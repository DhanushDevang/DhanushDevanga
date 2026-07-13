// Real GPU fluid simulation: velocity field advection, vorticity confinement
// (curl), divergence computation, Jacobi pressure iteration, and gradient
// subtraction to keep the flow divergence-free. This is the full technique
// (unlike the lighter curl-noise approximation used elsewhere in this repo)
// — ported from a working reference implementation into a disposable module
// that can be safely mounted/unmounted inside a React component.

export type FluidSimConfig = {
  TEXTURE_DOWNSAMPLE: number;
  DENSITY_DISSIPATION: number;
  VELOCITY_DISSIPATION: number;
  PRESSURE_DISSIPATION: number;
  PRESSURE_ITERATIONS: number;
  CURL: number;
  SPLAT_RADIUS: number;
};

export const defaultFluidConfig: FluidSimConfig = {
  TEXTURE_DOWNSAMPLE: 1,
  DENSITY_DISSIPATION: 0.98,
  VELOCITY_DISSIPATION: 0.99,
  PRESSURE_DISSIPATION: 0.8,
  PRESSURE_ITERATIONS: 25,
  CURL: 35,
  SPLAT_RADIUS: 0.002,
};

type FBO = [WebGLTexture, WebGLFramebuffer, number];
type DoubleFBO = {
  readonly first: FBO;
  readonly second: FBO;
  swap: () => void;
};

export function createFluidSim(canvas: HTMLCanvasElement, userConfig: Partial<FluidSimConfig> = {}) {
  const config: FluidSimConfig = { ...defaultFluidConfig, ...userConfig };

  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;

  const { gl, ext, supportLinearFloat } = getWebGLContext(canvas);

  // Track every GL resource we allocate so `destroy()` can free them all —
  // the original reference implementation never needed to tear itself down
  // (it ran for the page's whole lifetime), but as a mounted/unmounted React
  // component this needs real cleanup to avoid leaking GPU memory.
  const disposables: { textures: WebGLTexture[]; framebuffers: WebGLFramebuffer[]; buffers: WebGLBuffer[] } = {
    textures: [],
    framebuffers: [],
    buffers: [],
  };

  function getWebGLContext(canvasEl: HTMLCanvasElement) {
    const params: WebGLContextAttributes = { alpha: false, depth: false, stencil: false, antialias: false };

    let glCtx = canvasEl.getContext("webgl2", params) as WebGL2RenderingContext | null;
    const isWebGL2 = !!glCtx;

    if (!glCtx) {
      glCtx = (canvasEl.getContext("webgl", params) ||
        canvasEl.getContext("experimental-webgl", params)) as WebGL2RenderingContext | null;
    }
    if (!glCtx) throw new Error("WebGL not supported");

    const halfFloat = glCtx.getExtension("OES_texture_half_float");
    let linearFloat = glCtx.getExtension("OES_texture_half_float_linear");

    if (isWebGL2) {
      glCtx.getExtension("EXT_color_buffer_float");
      linearFloat = glCtx.getExtension("OES_texture_float_linear");
    }

    glCtx.clearColor(0.0, 0.0, 0.0, 1.0);

    const internalFormat = isWebGL2 ? (glCtx as WebGL2RenderingContext).RGBA16F : glCtx.RGBA;
    const internalFormatRG = isWebGL2 ? (glCtx as WebGL2RenderingContext).RG16F : glCtx.RGBA;
    const formatRG = isWebGL2 ? (glCtx as WebGL2RenderingContext).RG : glCtx.RGBA;
    const texType = isWebGL2 ? glCtx.HALF_FLOAT : halfFloat?.HALF_FLOAT_OES;

    return {
      gl: glCtx,
      ext: { internalFormat, internalFormatRG, formatRG, texType },
      supportLinearFloat: !!linearFloat,
    };
  }

  type Pointer = { id: number; x: number; y: number; dx: number; dy: number; down: boolean; moved: boolean; color: number[] };
  const pointers: Pointer[] = [{ id: -1, x: 0, y: 0, dx: 0, dy: 0, down: false, moved: false, color: [30, 0, 300] }];
  const splatStack: number[] = [];

  class GLProgram {
    program: WebGLProgram;
    uniforms: Record<string, WebGLUniformLocation | null> = {};
    constructor(vertexShader: WebGLShader, fragmentShader: WebGLShader) {
      this.program = gl.createProgram()!;
      gl.attachShader(this.program, vertexShader);
      gl.attachShader(this.program, fragmentShader);
      gl.linkProgram(this.program);
      if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(this.program) ?? "Program link failed");
      }
      const uniformCount = gl.getProgramParameter(this.program, gl.ACTIVE_UNIFORMS);
      for (let i = 0; i < uniformCount; i++) {
        const info = gl.getActiveUniform(this.program, i);
        if (!info) continue;
        this.uniforms[info.name] = gl.getUniformLocation(this.program, info.name);
      }
    }
    bind() {
      gl.useProgram(this.program);
    }
  }

  function compileShader(type: number, source: string): WebGLShader {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error(gl.getShaderInfoLog(shader) ?? "Shader compile failed");
    }
    return shader;
  }

  const baseVertexShader = compileShader(
    gl.VERTEX_SHADER,
    `precision highp float; precision mediump sampler2D; attribute vec2 aPosition; varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB; uniform vec2 texelSize; void main () { vUv = aPosition * 0.5 + 0.5; vL = vUv - vec2(texelSize.x, 0.0); vR = vUv + vec2(texelSize.x, 0.0); vT = vUv + vec2(0.0, texelSize.y); vB = vUv - vec2(0.0, texelSize.y); gl_Position = vec4(aPosition, 0.0, 1.0); }`
  );
  const clearShader = compileShader(
    gl.FRAGMENT_SHADER,
    `precision highp float; precision mediump sampler2D; varying vec2 vUv; uniform sampler2D uTexture; uniform float value; void main () { gl_FragColor = value * texture2D(uTexture, vUv); }`
  );
  const displayShader = compileShader(
    gl.FRAGMENT_SHADER,
    `precision highp float; precision mediump sampler2D; varying vec2 vUv; uniform sampler2D uTexture; void main () { gl_FragColor = texture2D(uTexture, vUv); }`
  );
  const splatShader = compileShader(
    gl.FRAGMENT_SHADER,
    `precision highp float; precision mediump sampler2D; varying vec2 vUv; uniform sampler2D uTarget; uniform float aspectRatio; uniform vec3 color; uniform vec2 point; uniform float radius; void main () { vec2 p = vUv - point.xy; p.x *= aspectRatio; vec3 splat = exp(-dot(p, p) / radius) * color; vec3 base = texture2D(uTarget, vUv).xyz; gl_FragColor = vec4(base + splat, 1.0); }`
  );
  const advectionManualFilteringShader = compileShader(
    gl.FRAGMENT_SHADER,
    `precision highp float; precision mediump sampler2D; varying vec2 vUv; uniform sampler2D uVelocity; uniform sampler2D uSource; uniform vec2 texelSize; uniform float dt; uniform float dissipation; vec4 bilerp (in sampler2D sam, in vec2 p) { vec4 st; st.xy = floor(p - 0.5) + 0.5; st.zw = st.xy + 1.0; vec4 uv = st * texelSize.xyxy; vec4 a = texture2D(sam, uv.xy); vec4 b = texture2D(sam, uv.zy); vec4 c = texture2D(sam, uv.xw); vec4 d = texture2D(sam, uv.zw); vec2 f = p - st.xy; return mix(mix(a, b, f.x), mix(c, d, f.x), f.y); } void main () { vec2 coord = gl_FragCoord.xy - dt * texture2D(uVelocity, vUv).xy; gl_FragColor = dissipation * bilerp(uSource, coord); gl_FragColor.a = 1.0; }`
  );
  const advectionShader = compileShader(
    gl.FRAGMENT_SHADER,
    `precision highp float; precision mediump sampler2D; varying vec2 vUv; uniform sampler2D uVelocity; uniform sampler2D uSource; uniform vec2 texelSize; uniform float dt; uniform float dissipation; void main () { vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize; gl_FragColor = dissipation * texture2D(uSource, coord); }`
  );
  const divergenceShader = compileShader(
    gl.FRAGMENT_SHADER,
    `precision highp float; precision mediump sampler2D; varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB; uniform sampler2D uVelocity; vec2 sampleVelocity (in vec2 uv) { vec2 multiplier = vec2(1.0, 1.0); if (uv.x < 0.0) { uv.x = 0.0; multiplier.x = -1.0; } if (uv.x > 1.0) { uv.x = 1.0; multiplier.x = -1.0; } if (uv.y < 0.0) { uv.y = 0.0; multiplier.y = -1.0; } if (uv.y > 1.0) { uv.y = 1.0; multiplier.y = -1.0; } return multiplier * texture2D(uVelocity, uv).xy; } void main () { float L = sampleVelocity(vL).x; float R = sampleVelocity(vR).x; float T = sampleVelocity(vT).y; float B = sampleVelocity(vB).y; float div = 0.5 * (R - L + T - B); gl_FragColor = vec4(div, 0.0, 0.0, 1.0); }`
  );
  const curlShader = compileShader(
    gl.FRAGMENT_SHADER,
    `precision highp float; precision mediump sampler2D; varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB; uniform sampler2D uVelocity; void main () { float L = texture2D(uVelocity, vL).y; float R = texture2D(uVelocity, vR).y; float T = texture2D(uVelocity, vT).x; float B = texture2D(uVelocity, vB).x; float vorticity = R - L - T + B; gl_FragColor = vec4(vorticity, 0.0, 0.0, 1.0); }`
  );
  const vorticityShader = compileShader(
    gl.FRAGMENT_SHADER,
    `precision highp float; precision mediump sampler2D; varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB; uniform sampler2D uVelocity; uniform sampler2D uCurl; uniform float curl; uniform float dt; void main () { float L = texture2D(uCurl, vL).y; float R = texture2D(uCurl, vR).y; float T = texture2D(uCurl, vT).x; float B = texture2D(uCurl, vB).x; float C = texture2D(uCurl, vUv).x; vec2 force = vec2(abs(T) - abs(B), abs(R) - abs(L)); force *= 1.0 / length(force + 0.00001) * curl * C; vec2 vel = texture2D(uVelocity, vUv).xy; gl_FragColor = vec4(vel + force * dt, 0.0, 1.0); }`
  );
  const pressureShader = compileShader(
    gl.FRAGMENT_SHADER,
    `precision highp float; precision mediump sampler2D; varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB; uniform sampler2D uPressure; uniform sampler2D uDivergence; vec2 boundary (in vec2 uv) { uv = min(max(uv, 0.0), 1.0); return uv; } void main () { float L = texture2D(uPressure, boundary(vL)).x; float R = texture2D(uPressure, boundary(vR)).x; float T = texture2D(uPressure, boundary(vT)).x; float B = texture2D(uPressure, boundary(vB)).x; float C = texture2D(uPressure, vUv).x; float divergence = texture2D(uDivergence, vUv).x; float pressure = (L + R + B + T - divergence) * 0.25; gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0); }`
  );
  const gradientSubtractShader = compileShader(
    gl.FRAGMENT_SHADER,
    `precision highp float; precision mediump sampler2D; varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB; uniform sampler2D uPressure; uniform sampler2D uVelocity; vec2 boundary (in vec2 uv) { uv = min(max(uv, 0.0), 1.0); return uv; } void main () { float L = texture2D(uPressure, boundary(vL)).x; float R = texture2D(uPressure, boundary(vR)).x; float T = texture2D(uPressure, boundary(vT)).x; float B = texture2D(uPressure, boundary(vB)).x; vec2 velocity = texture2D(uVelocity, vUv).xy; velocity.xy -= vec2(R - L, T - B); gl_FragColor = vec4(velocity, 0.0, 1.0); }`
  );

  let textureWidth = 0;
  let textureHeight = 0;
  let density: DoubleFBO;
  let velocity: DoubleFBO;
  let divergence: FBO;
  let curl: FBO;
  let pressure: DoubleFBO;

  function createFBO(texId: number, w: number, h: number, internalFormat: number, format: number, type: number, param: number): FBO {
    gl.activeTexture(gl.TEXTURE0 + texId);
    const texture = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, param);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, param);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);

    const fbo = gl.createFramebuffer()!;
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    gl.viewport(0, 0, w, h);
    gl.clear(gl.COLOR_BUFFER_BIT);

    disposables.textures.push(texture);
    disposables.framebuffers.push(fbo);
    return [texture, fbo, texId];
  }

  function createDoubleFBO(texId: number, w: number, h: number, internalFormat: number, format: number, type: number, param: number): DoubleFBO {
    let fbo1 = createFBO(texId, w, h, internalFormat, format, type, param);
    let fbo2 = createFBO(texId + 1, w, h, internalFormat, format, type, param);
    return {
      get first() { return fbo1; },
      get second() { return fbo2; },
      swap() {
        const temp = fbo1;
        fbo1 = fbo2;
        fbo2 = temp;
      },
    };
  }

  function initFramebuffers() {
    textureWidth = gl.drawingBufferWidth >> config.TEXTURE_DOWNSAMPLE;
    textureHeight = gl.drawingBufferHeight >> config.TEXTURE_DOWNSAMPLE;

    const { internalFormat, internalFormatRG, formatRG, texType } = ext;
    const linearParam = supportLinearFloat ? gl.LINEAR : gl.NEAREST;

    density = createDoubleFBO(0, textureWidth, textureHeight, internalFormat, gl.RGBA, texType!, linearParam);
    velocity = createDoubleFBO(2, textureWidth, textureHeight, internalFormatRG, formatRG, texType!, linearParam);
    divergence = createFBO(4, textureWidth, textureHeight, internalFormatRG, formatRG, texType!, gl.NEAREST);
    curl = createFBO(5, textureWidth, textureHeight, internalFormatRG, formatRG, texType!, gl.NEAREST);
    pressure = createDoubleFBO(6, textureWidth, textureHeight, internalFormatRG, formatRG, texType!, gl.NEAREST);
  }

  const clearProgram = new GLProgram(baseVertexShader, clearShader);
  const displayProgram = new GLProgram(baseVertexShader, displayShader);
  const splatProgram = new GLProgram(baseVertexShader, splatShader);
  const advectionProgram = new GLProgram(baseVertexShader, supportLinearFloat ? advectionShader : advectionManualFilteringShader);
  const divergenceProgram = new GLProgram(baseVertexShader, divergenceShader);
  const curlProgram = new GLProgram(baseVertexShader, curlShader);
  const vorticityProgram = new GLProgram(baseVertexShader, vorticityShader);
  const pressureProgram = new GLProgram(baseVertexShader, pressureShader);
  const gradientSubtractProgram = new GLProgram(baseVertexShader, gradientSubtractShader);

  initFramebuffers();

  const quadBuffer = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
  const elementBuffer = gl.createBuffer()!;
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elementBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(0);
  disposables.buffers.push(quadBuffer, elementBuffer);

  function blit(destination: WebGLFramebuffer | null) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, destination);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
  }

  function splat(x: number, y: number, dx: number, dy: number, color: number[]) {
    splatProgram.bind();
    gl.uniform1i(splatProgram.uniforms.uTarget, velocity.first[2]);
    gl.uniform1f(splatProgram.uniforms.aspectRatio, canvas.width / canvas.height);
    gl.uniform2f(splatProgram.uniforms.point, x / canvas.width, 1.0 - y / canvas.height);
    gl.uniform3f(splatProgram.uniforms.color, dx, -dy, 1.0);
    gl.uniform1f(splatProgram.uniforms.radius, config.SPLAT_RADIUS);
    blit(velocity.second[1]);
    velocity.swap();

    gl.uniform1i(splatProgram.uniforms.uTarget, density.first[2]);
    gl.uniform3f(splatProgram.uniforms.color, color[0] * 0.3, color[1] * 0.3, color[2] * 0.3);
    blit(density.second[1]);
    density.swap();
  }

  function resizeCanvas() {
    if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      initFramebuffers();
    }
  }

  let lastTime = Date.now();
  let rafId = 0;
  let paused = false;

  function update() {
    rafId = requestAnimationFrame(update);
    if (paused) return;

    resizeCanvas();

    const dt = Math.min((Date.now() - lastTime) / 1000, 0.016);
    lastTime = Date.now();

    gl.viewport(0, 0, textureWidth, textureHeight);

    if (splatStack.length > 0) {
      const n = splatStack.pop()!;
      for (let m = 0; m < n; m++) {
        const color = [Math.random() * 10, Math.random() * 10, Math.random() * 10];
        const x = canvas.width * Math.random();
        const y = canvas.height * Math.random();
        const dx = 1000 * (Math.random() - 0.5);
        const dy = 1000 * (Math.random() - 0.5);
        splat(x, y, dx, dy, color);
      }
    }

    advectionProgram.bind();
    gl.uniform2f(advectionProgram.uniforms.texelSize, 1.0 / textureWidth, 1.0 / textureHeight);
    gl.uniform1i(advectionProgram.uniforms.uVelocity, velocity.first[2]);
    gl.uniform1i(advectionProgram.uniforms.uSource, velocity.first[2]);
    gl.uniform1f(advectionProgram.uniforms.dt, dt);
    gl.uniform1f(advectionProgram.uniforms.dissipation, config.VELOCITY_DISSIPATION);
    blit(velocity.second[1]);
    velocity.swap();

    gl.uniform1i(advectionProgram.uniforms.uVelocity, velocity.first[2]);
    gl.uniform1i(advectionProgram.uniforms.uSource, density.first[2]);
    gl.uniform1f(advectionProgram.uniforms.dissipation, config.DENSITY_DISSIPATION);
    blit(density.second[1]);
    density.swap();

    for (const pointer of pointers) {
      if (pointer.moved) {
        splat(pointer.x, pointer.y, pointer.dx, pointer.dy, pointer.color);
        pointer.moved = false;
      }
    }

    curlProgram.bind();
    gl.uniform2f(curlProgram.uniforms.texelSize, 1.0 / textureWidth, 1.0 / textureHeight);
    gl.uniform1i(curlProgram.uniforms.uVelocity, velocity.first[2]);
    blit(curl[1]);

    vorticityProgram.bind();
    gl.uniform2f(vorticityProgram.uniforms.texelSize, 1.0 / textureWidth, 1.0 / textureHeight);
    gl.uniform1i(vorticityProgram.uniforms.uVelocity, velocity.first[2]);
    gl.uniform1i(vorticityProgram.uniforms.uCurl, curl[2]);
    gl.uniform1f(vorticityProgram.uniforms.curl, config.CURL);
    gl.uniform1f(vorticityProgram.uniforms.dt, dt);
    blit(velocity.second[1]);
    velocity.swap();

    divergenceProgram.bind();
    gl.uniform2f(divergenceProgram.uniforms.texelSize, 1.0 / textureWidth, 1.0 / textureHeight);
    gl.uniform1i(divergenceProgram.uniforms.uVelocity, velocity.first[2]);
    blit(divergence[1]);

    clearProgram.bind();
    let pressureTexId = pressure.first[2];
    gl.activeTexture(gl.TEXTURE0 + pressureTexId);
    gl.bindTexture(gl.TEXTURE_2D, pressure.first[0]);
    gl.uniform1i(clearProgram.uniforms.uTexture, pressureTexId);
    gl.uniform1f(clearProgram.uniforms.value, config.PRESSURE_DISSIPATION);
    blit(pressure.second[1]);
    pressure.swap();

    pressureProgram.bind();
    gl.uniform2f(pressureProgram.uniforms.texelSize, 1.0 / textureWidth, 1.0 / textureHeight);
    gl.uniform1i(pressureProgram.uniforms.uDivergence, divergence[2]);
    pressureTexId = pressure.first[2];
    gl.activeTexture(gl.TEXTURE0 + pressureTexId);

    // Jacobi iteration: approximates the pressure field iteratively rather
    // than solving the linear system directly — the standard real-time
    // approach, trading iteration count for speed vs. accuracy.
    for (let i = 0; i < config.PRESSURE_ITERATIONS; i++) {
      gl.bindTexture(gl.TEXTURE_2D, pressure.first[0]);
      gl.uniform1i(pressureProgram.uniforms.uPressure, pressureTexId);
      blit(pressure.second[1]);
      pressure.swap();
    }

    gradientSubtractProgram.bind();
    gl.uniform2f(gradientSubtractProgram.uniforms.texelSize, 1.0 / textureWidth, 1.0 / textureHeight);
    gl.uniform1i(gradientSubtractProgram.uniforms.uPressure, pressure.first[2]);
    gl.uniform1i(gradientSubtractProgram.uniforms.uVelocity, velocity.first[2]);
    blit(velocity.second[1]);
    velocity.swap();

    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    displayProgram.bind();
    gl.uniform1i(displayProgram.uniforms.uTexture, density.first[2]);
    blit(null);
  }

  let colorCount = 0;
  let colorArr = [Math.random() + 0.2, Math.random() + 0.2, Math.random() + 0.2];

  function onPointerMove(e: PointerEvent) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    colorCount++;
    if (colorCount > 25) {
      colorArr = [Math.random() + 0.2, Math.random() + 0.2, Math.random() + 0.2];
      colorCount = 0;
    }

    const p = pointers[0];
    p.down = true;
    p.color = colorArr;
    p.moved = p.down;
    p.dx = (x - p.x) * 10.0;
    p.dy = (y - p.y) * 10.0;
    p.x = x;
    p.y = y;
  }

  function onPointerLeave() {
    pointers[0].down = false;
  }

  canvas.addEventListener("pointermove", onPointerMove, { passive: true });
  canvas.addEventListener("pointerleave", onPointerLeave, { passive: true });

  update();

  return {
    setPaused(value: boolean) {
      paused = value;
    },
    addRandomSplats(n: number) {
      splatStack.push(n);
    },
    destroy() {
      cancelAnimationFrame(rafId);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);

      disposables.textures.forEach((t) => gl.deleteTexture(t));
      disposables.framebuffers.forEach((f) => gl.deleteFramebuffer(f));
      disposables.buffers.forEach((b) => gl.deleteBuffer(b));
      [clearProgram, displayProgram, splatProgram, advectionProgram, divergenceProgram, curlProgram, vorticityProgram, pressureProgram, gradientSubtractProgram].forEach(
        (p) => gl.deleteProgram(p.program)
      );
      // Note: deliberately NOT calling WEBGL_lose_context here. It forces
      // the context into an async "lost" state that doesn't resolve until
      // a later `webglcontextrestored` event, which breaks React's
      // StrictMode double-invoke in development (mount -> cleanup -> mount
      // again immediately) — the second mount ends up drawing to a context
      // that hasn't finished recovering, silently no-oping every draw
      // call. Explicit resource deletion above already frees the GPU
      // memory that matters; losing the context isn't necessary for that.
    },
  };
}
