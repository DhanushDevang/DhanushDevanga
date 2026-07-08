import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { vertexShader, dyeFragmentShader, displayFragmentShader } from "./shaders";
import type { PointerState } from "./useFluidPointer";

type Targets = { read: THREE.WebGLRenderTarget; write: THREE.WebGLRenderTarget };

const RT_OPTIONS: THREE.RenderTargetOptions = {
  type: THREE.HalfFloatType,
  minFilter: THREE.LinearFilter,
  magFilter: THREE.LinearFilter,
  format: THREE.RGBAFormat,
  depthBuffer: false,
  stencilBuffer: false,
};

type Props = {
  pointer: {
    state: React.RefObject<PointerState>;
    advance: (dt: number) => void;
  };
  simScale: number;
  paused: React.RefObject<boolean>;
  onPointerMove: (e: ThreeEvent<PointerEvent>) => void;
  onPointerLeave: () => void;
};

export function FluidScene({ pointer, simScale, paused, onPointerMove, onPointerLeave }: Props) {
  const { gl, size } = useThree();

  const simSize = useMemo(() => {
    const w = Math.max(48, Math.floor(size.width * simScale));
    const h = Math.max(48, Math.floor(size.height * simScale));
    return { w, h };
  }, [size, simScale]);

  const quadGeo = useMemo(() => new THREE.PlaneGeometry(2, 2), []);

  // Off-screen scene used only for the simulation pass — never rendered to
  // the visible canvas directly; we `gl.render()` it into a target manually.
  const simMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader: dyeFragmentShader,
        depthTest: false,
        depthWrite: false,
        uniforms: {
          uPrevDye: { value: null },
          uTime: { value: 0 },
          uDt: { value: 0 },
          uMouse: { value: new THREE.Vector2(0.5, 0.5) },
          uMouseVelocity: { value: new THREE.Vector2(0, 0) },
          uMouseActive: { value: 0 },
          uDissipation: { value: 0.973 },
          uRadius: { value: 0.16 },
          uCurlStrength: { value: 0.55 },
          uAdvectSpeed: { value: 0.55 },
          uAspect: { value: size.width / size.height },
        },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const displayMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader: displayFragmentShader,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        uniforms: {
          uDye: { value: null },
          uTexel: { value: new THREE.Vector2(1 / simSize.w, 1 / simSize.h) },
        },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const simScene = useMemo(() => {
    const scene = new THREE.Scene();
    scene.add(new THREE.Mesh(quadGeo, simMaterial));
    return scene;
  }, [quadGeo, simMaterial]);

  const dummyCamera = useMemo(() => new THREE.Camera(), []);

  const targetsRef = useRef<Targets | null>(null);

  // (Re)allocate ping-pong render targets whenever resolved sim size changes.
  useEffect(() => {
    const read = new THREE.WebGLRenderTarget(simSize.w, simSize.h, RT_OPTIONS);
    const write = new THREE.WebGLRenderTarget(simSize.w, simSize.h, RT_OPTIONS);
    targetsRef.current = { read, write };
    displayMaterial.uniforms.uTexel.value.set(1 / simSize.w, 1 / simSize.h);

    return () => {
      read.dispose();
      write.dispose();
    };
  }, [simSize.w, simSize.h, displayMaterial]);

  useEffect(() => {
    simMaterial.uniforms.uAspect.value = size.width / size.height;
  }, [size, simMaterial]);

  // Dispose GPU resources on unmount — avoids leaking VRAM across route changes.
  useEffect(() => {
    return () => {
      simMaterial.dispose();
      displayMaterial.dispose();
      quadGeo.dispose();
    };
  }, [simMaterial, displayMaterial, quadGeo]);

  // Runtime watchdog: if frames run consistently slow, step resolution down
  // once. Deliberately one-directional (no thrashing back up).
  const frameTimes = useRef<number[]>([]);
  const hasDowngraded = useRef(false);
  const downgradeScale = useRef(1);

  // Simulation pass runs first (priority -1) so the display mesh's uniform
  // update below sees the freshly-written texture within the same frame.
  useFrame((_, delta) => {
    if (paused.current || !targetsRef.current) return;
    const dt = Math.min(delta, 1 / 30);

    // FPS watchdog
    frameTimes.current.push(delta);
    if (frameTimes.current.length > 90) frameTimes.current.shift();
    if (!hasDowngraded.current && frameTimes.current.length === 90) {
      const avg = frameTimes.current.reduce((a, b) => a + b, 0) / 90;
      if (avg > 1 / 28) {
        hasDowngraded.current = true;
        downgradeScale.current = 0.6;
        simMaterial.uniforms.uRadius.value *= 1.1; // compensate softness at lower res
      }
    }

    pointer.advance(dt);
    const p = pointer.state.current;
    const { read, write } = targetsRef.current;

    simMaterial.uniforms.uPrevDye.value = read.texture;
    simMaterial.uniforms.uDt.value = dt;
    simMaterial.uniforms.uTime.value += dt;
    simMaterial.uniforms.uMouse.value.set(p.x, p.y);
    simMaterial.uniforms.uMouseVelocity.value.set(p.vx, p.vy);
    simMaterial.uniforms.uMouseActive.value = p.active ? 1 : 0;

    const prevTarget = gl.getRenderTarget();
    gl.setRenderTarget(write);
    gl.render(simScene, dummyCamera);
    gl.setRenderTarget(prevTarget);

    targetsRef.current = { read: write, write: read };
    displayMaterial.uniforms.uDye.value = targetsRef.current.read.texture;
  }, -1);

  return (
    <mesh onPointerMove={onPointerMove} onPointerLeave={onPointerLeave}>
      <primitive object={quadGeo} attach="geometry" />
      <primitive object={displayMaterial} attach="material" />
    </mesh>
  );
}
