import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import type { ThreeEvent } from "@react-three/fiber";
import { FluidScene } from "@/three/fluid/FluidScene";
import { useFluidPointer } from "@/three/fluid/useFluidPointer";
import { usePerformanceTier } from "@/three/fluid/usePerformanceTier";

export function FluidHero() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [active, setActive] = useState(true);
  const pausedRef = useRef(false);
  const pointer = useFluidPointer(0.15);
  const { simScale, dpr } = usePerformanceTier();

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Pause the render loop entirely when the tab isn't visible — avoids
  // burning GPU/battery on a background tab.
  useEffect(() => {
    function onVisibility() {
      const hidden = document.hidden;
      pausedRef.current = hidden;
      setActive(!hidden);
    }
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  if (reducedMotion) {
    // Static, motion-free fallback: a soft gradient echoing the fluid's palette.
    return (
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, rgba(61,139,253,0.18), transparent 55%), radial-gradient(circle at 75% 65%, rgba(124,156,255,0.14), transparent 55%)",
        }}
      />
    );
  }

  function handlePointerMove(e: ThreeEvent<PointerEvent>) {
    if (!e.uv) return;
    pointer.setTarget(e.uv.x, e.uv.y);
  }

  return (
    <div aria-hidden="true" className="absolute inset-0">
      <Canvas
        orthographic
        dpr={dpr}
        frameloop={active ? "always" : "never"}
        gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
        style={{ pointerEvents: "auto" }}
      >
        <FluidScene
          pointer={pointer}
          simScale={simScale}
          paused={pausedRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={pointer.clear}
        />
      </Canvas>
    </div>
  );
}
