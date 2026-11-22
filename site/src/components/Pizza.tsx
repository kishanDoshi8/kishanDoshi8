import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

const SLICES = 8;
const GRID = 15;
const R = GRID / 2;

type Dot = { x: number; y: number; slice: number; kind: "crust" | "topping" | "cheese" };

// A pizza drawn on the same dot grid as everything else. Each dot belongs to
// the slice its angle falls in; the outer ring is crust.
function bake(): Dot[] {
  const dots: Dot[] = [];
  for (let y = 0; y < GRID; y++) {
    for (let x = 0; x < GRID; x++) {
      const dx = x + 0.5 - R;
      const dy = y + 0.5 - R;
      const d = Math.hypot(dx, dy);
      if (d > R) continue;
      const angle = (Math.atan2(dy, dx) + Math.PI * 2.5) % (Math.PI * 2);
      const pos = (angle / (Math.PI * 2)) * SLICES;
      const slice = Math.floor(pos);
      // Leave the cut lines dark so it reads as a sliced pizza, not a disc.
      const edge = Math.min(pos - slice, slice + 1 - pos) * ((Math.PI * 2) / SLICES) * d;
      if (d > 1.2 && edge < 0.45) continue;
      const kind = d > R - 1.1 ? "crust" : (x * 7 + y * 13) % 9 === 0 ? "topping" : "cheese";
      dots.push({ x, y, slice, kind });
    }
  }
  return dots;
}

export function Pizza() {
  const dots = useMemo(bake, []);
  const [eaten, setEaten] = useState(0);
  const reduce = useReducedMotion();
  const left = SLICES - eaten;

  const label =
    left === SLICES
      ? "Fresh out of the oven. Take a slice."
      : left === 1
        ? "Last slice. It's yours."
        : left === 0
          ? "Gone. That's game night done right."
          : `${left} slices left.`;

  return (
    <div className="flex flex-col gap-5">
      <button
        type="button"
        onClick={() => setEaten((e) => (e >= SLICES ? 0 : e + 1))}
        aria-label={left === 0 ? "Order another pizza" : "Take a slice"}
        className="grid aspect-square w-full max-w-56 cursor-pointer self-center rounded-full"
        style={{ gridTemplateColumns: `repeat(${GRID}, 1fr)` }}
      >
        {Array.from({ length: GRID * GRID }, (_, i) => {
          const dot = dots.find((d) => d.y * GRID + d.x === i);
          if (!dot) return <span key={i} />;
          const gone = dot.slice < eaten;
          return (
            <span key={i} className="grid place-items-center">
              <motion.span
                className="block aspect-square w-[62%] rounded-full"
                initial={false}
                animate={{
                  backgroundColor: gone
                    ? "var(--color-dot-off)"
                    : dot.kind === "topping"
                      ? "var(--color-fg)"
                      : "var(--color-dim)",
                  scale: gone ? 0.55 : dot.kind === "cheese" ? 0.75 : 1,
                }}
                transition={{ duration: reduce ? 0 : 0.25, delay: reduce ? 0 : (dot.x + dot.y) * 0.006 }}
              />
            </span>
          );
        })}
      </button>
      <div className="flex items-baseline justify-between gap-4 text-sm" aria-live="polite">
        <span className="text-dim">{label}</span>
        {left === 0 && (
          <button type="button" className="dot-link shrink-0 text-fg" onClick={() => setEaten(0)}>
            Order another
          </button>
        )}
      </div>
    </div>
  );
}
