import { useMemo } from "react";
import type { FluidSimConfig } from "./pavelFluidSim";

export type QualityTier = "high" | "mid" | "low";

/**
 * A coarse, one-time device tier estimate based on cheap, widely-supported
 * signals (no WebGL capability probing, which would cost a context creation).
 * Maps to concrete overrides for the fluid sim's texture resolution and
 * Jacobi pressure iteration count — the two knobs that matter most for GPU
 * cost on this simulation.
 */
export function usePerformanceTier(): { tier: QualityTier; configOverride: Partial<FluidSimConfig> } {
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

    const configOverride: Partial<FluidSimConfig> =
      tier === "high"
        ? { TEXTURE_DOWNSAMPLE: 1, PRESSURE_ITERATIONS: 25 }
        : tier === "mid"
          ? { TEXTURE_DOWNSAMPLE: 1, PRESSURE_ITERATIONS: 16 }
          : { TEXTURE_DOWNSAMPLE: 2, PRESSURE_ITERATIONS: 10 };

    return { tier, configOverride };
  }, []);
}
