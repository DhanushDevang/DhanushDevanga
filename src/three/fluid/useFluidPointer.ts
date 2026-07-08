import { useRef } from "react";

export type PointerState = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  active: boolean;
};

type TargetState = { x: number; y: number };

/**
 * Holds the fluid cursor position in a ref (not React state) so updates
 * happen every frame without triggering re-renders. `target` is set
 * immediately by pointer events; `state` is smoothed toward it once per
 * frame inside the simulation's useFrame loop via `advance(dt)`.
 */
export function useFluidPointer(smoothing = 0.15) {
  const state = useRef<PointerState>({ x: 0.5, y: 0.5, vx: 0, vy: 0, active: false });
  const target = useRef<TargetState>({ x: 0.5, y: 0.5 });
  const idleTimeout = useRef<number | null>(null);

  function setTarget(x: number, y: number) {
    target.current.x = x;
    target.current.y = y;
    state.current.active = true;

    if (idleTimeout.current) window.clearTimeout(idleTimeout.current);
    idleTimeout.current = window.setTimeout(() => {
      state.current.active = false;
    }, 200);
  }

  function clear() {
    state.current.active = false;
  }

  function advance(dt: number) {
    const s = state.current;
    const prevX = s.x;
    const prevY = s.y;
    s.x += (target.current.x - s.x) * smoothing;
    s.y += (target.current.y - s.y) * smoothing;
    s.vx = dt > 0 ? (s.x - prevX) / dt : 0;
    s.vy = dt > 0 ? (s.y - prevY) / dt : 0;
  }

  return { state, setTarget, clear, advance };
}
