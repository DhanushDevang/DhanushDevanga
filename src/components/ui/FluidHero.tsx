import { useEffect, useRef, useState } from "react";
import { createFluidSim } from "@/three/fluid/pavelFluidSim";
import { usePerformanceTier } from "@/three/fluid/usePerformanceTier";

export function FluidHero() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const { configOverride } = usePerformanceTier();

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    let sim: ReturnType<typeof createFluidSim> | null = null;
    try {
      sim = createFluidSim(canvas, configOverride);
      // A small initial splash so first-time visitors see color right away,
      // rather than a blank canvas until they move their cursor.
      sim.addRandomSplats(2);
    } catch {
      // WebGL unavailable/blocked — fail silently, the scrim overlay behind
      // this still leaves the hero looking intentional (plain dark bg).
      return;
    }

    function onVisibility() {
      sim?.setPaused(document.hidden);
    }
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      sim?.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion]);

  if (reducedMotion) {
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

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
    />
  );
}
