import { useMemo } from "react";

export type QualityTier = "high" | "mid" | "low";

export type QualitySettings = {
  tier: QualityTier;
  /** Multiplier applied to canvas size to get simulation resolution — kept low since the
   *  display pass upscales with linear filtering, which looks soft and smoke-like for free. */
  simScale: number;
  dpr: [number, number];
};

/**
 * A coarse, one-time device tier estimate based on cheap, widely-supported
 * signals (no WebGL capability probing, which would cost a context creation).
 * This intentionally only picks an initial quality tier — see the runtime
 * FPS watchdog in FluidScene for a one-time step-down if a device turns out
 * to be slower than this heuristic predicted.
 */
export function usePerformanceTier(): QualitySettings {
  return useMemo(() => {
    const cores = navigator.hardwareConcurrency || 4;
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const smallScreen = typeof window !== "undefined" && window.innerWidth < 768;

    let tier: QualityTier = "high";
    if (isMobile || smallScreen) {
      tier = cores <= 4 ? "low" : "mid";
    } else if (cores <= 4) {
      tier = "mid";
    }

    const simScale = tier === "high" ? 0.55 : tier === "mid" ? 0.4 : 0.25;
    const dpr: [number, number] =
      tier === "high" ? [1, 1.5] : tier === "mid" ? [1, 1] : [0.75, 1];

    return { tier, simScale, dpr };
  }, []);
}
