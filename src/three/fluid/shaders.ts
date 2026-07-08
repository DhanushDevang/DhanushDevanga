// Fullscreen clip-space vertex shader. The quad geometry spans -1..1 directly,
// so we skip camera/projection matrices entirely — cheapest possible vertex stage.
export const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

// Standard 2D simplex noise (Ashima Arts / Ian McEwan formulation) — this is
// widely-published, permissively-licensed utility math (not proprietary
// creative content), used here as the base field for curl noise.
const simplexNoise2D = /* glsl */ `
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                        -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m;
    m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  // Curl of the noise's implied potential field, via finite differences.
  // Taking the perpendicular of the gradient gives a divergence-free-ish
  // flow — this is what makes the motion swirl naturally instead of just
  // radiating outward, without needing a full pressure-projection solve.
  vec2 curlNoise(vec2 p) {
    float e = 0.6;
    float n1 = snoise(vec2(p.x, p.y + e));
    float n2 = snoise(vec2(p.x, p.y - e));
    float n3 = snoise(vec2(p.x + e, p.y));
    float n4 = snoise(vec2(p.x - e, p.y));
    float dx = (n1 - n2) / (2.0 * e);
    float dy = (n3 - n4) / (2.0 * e);
    return vec2(dy, -dx);
  }

  vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
  }
`;

// --- Dye simulation pass ---
// This is a semi-Lagrangian advection step: instead of solving for pressure
// to keep the flow divergence-free (full Navier-Stokes), we drive motion
// directly from a curl-noise vector field plus the cursor's velocity. Each
// pixel looks "upstream" along the flow to sample where its color came from
// last frame (advection), fades it slightly (dissipation, for trailing
// smoke that never abruptly vanishes), then adds fresh color at the cursor
// and from a slow-wandering idle emitter so the canvas is never static.
export const dyeFragmentShader = /* glsl */ `
  precision highp float;
  varying vec2 vUv;

  uniform sampler2D uPrevDye;
  uniform float uTime;
  uniform float uDt;
  uniform vec2 uMouse;
  uniform vec2 uMouseVelocity;
  uniform float uMouseActive;
  uniform float uDissipation;
  uniform float uRadius;
  uniform float uCurlStrength;
  uniform float uAdvectSpeed;
  uniform float uAspect;

  ${simplexNoise2D}

  void main() {
    vec2 uv = vUv;
    vec2 aspectUv = vec2(uv.x * uAspect, uv.y);

    // Slowly evolving turbulence field — continues even with no pointer input.
    vec2 flow = curlNoise(aspectUv * 2.4 + uTime * 0.05) * uCurlStrength;

    // Semi-Lagrangian advection: sample last frame from the upstream position.
    vec2 advectedUv = uv - (flow + uMouseVelocity * 0.5) * uAdvectSpeed * uDt;
    vec4 prev = texture2D(uPrevDye, advectedUv);

    // Fade trails naturally instead of cutting them off.
    prev *= uDissipation;

    // --- Cursor color injection, energy scaled by movement speed ---
    vec2 mouseUv = vec2(uMouse.x * uAspect, uMouse.y);
    float dist = distance(aspectUv, mouseUv);
    float falloff = smoothstep(uRadius, 0.0, dist);
    float speed = clamp(length(uMouseVelocity) * 6.0, 0.0, 1.0);
    float injection = falloff * mix(0.12, 1.0, speed) * uMouseActive;

    // --- Idle ambient emitter: wanders via noise so color keeps evolving at rest ---
    vec2 idlePos = vec2(0.5 * uAspect, 0.5) + vec2(
      snoise(vec2(uTime * 0.045, 1.7)),
      snoise(vec2(3.1, uTime * 0.045))
    ) * 0.28;
    float idleDist = distance(aspectUv, idlePos);
    float idleInjection = smoothstep(uRadius * 1.6, 0.0, idleDist) * 0.10;

    float totalInjection = injection + idleInjection;

    // Hue drifts slowly over ~11s, gently offset by position for painterly blending.
    float hue = fract(uTime / 11.0 + uv.x * 0.15 + uv.y * 0.12);
    vec3 splatColor = hsv2rgb(vec3(hue, 0.62, 1.0));

    vec3 outColor = prev.rgb + splatColor * totalInjection;
    float outAlpha = clamp(prev.a + totalInjection, 0.0, 1.0);

    gl_FragColor = vec4(outColor, outAlpha);
  }
`;

// --- Display / composite pass ---
// Renders the low-res simulation upscaled (GPU linear filtering already
// smooths it beautifully — a classic trick for cheap, soft-looking fluid).
// Adds a lightweight multi-tap glow (a "poor man's bloom") rather than a
// full multi-pass blur pipeline, then soft tone-maps so bright colors don't
// clip harshly. Alpha is derived from luminance so it blends seamlessly
// into the page's dark background with no visible canvas edge.
export const displayFragmentShader = /* glsl */ `
  precision highp float;
  varying vec2 vUv;

  uniform sampler2D uDye;
  uniform vec2 uTexel;

  vec3 sampleGlow(vec2 uv) {
    vec3 sum = vec3(0.0);
    const int SAMPLES = 8;
    for (int i = 0; i < SAMPLES; i++) {
      float angle = (float(i) / float(SAMPLES)) * 6.28318;
      vec2 offset = vec2(cos(angle), sin(angle)) * uTexel * 7.0;
      sum += texture2D(uDye, uv + offset).rgb;
    }
    return sum / float(SAMPLES);
  }

  void main() {
    vec3 base = texture2D(uDye, vUv).rgb;
    vec3 glow = sampleGlow(vUv);

    // Additive blending for the glow layer — bright, cinematic, no hard edges.
    vec3 color = base + glow * 0.4;

    // Soft filmic-style tone mapping to tame highlights.
    color = color / (color + vec3(1.0));
    color = pow(color, vec3(0.82));

    float alpha = clamp(max(max(color.r, color.g), color.b) * 1.35, 0.0, 0.82);
    gl_FragColor = vec4(color, alpha);
  }
`;
