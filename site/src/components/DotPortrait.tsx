import { useEffect, useRef, useState } from "react";
import { animate, useReducedMotion } from "motion/react";
import { portrait } from "../data/portrait";

type Frame = { level: Float32Array; red: Uint8Array };

function parse(src: string): Frame {
  const level = new Float32Array(src.length);
  const red = new Uint8Array(src.length);
  for (let i = 0; i < src.length; i++) {
    const c = src.charCodeAt(i);
    if (c >= 97) {
      level[i] = c - 97;
      red[i] = 1;
    } else {
      level[i] = c - 48;
    }
  }
  return { level, red };
}

const face = parse(portrait.face);
const wink = parse(portrait.wink);
const { cols, rows } = portrait;
const count = cols * rows;

// How the dots move out of the pointer's way, in cells.
const REACH = 5; // radius the pointer pushes within
const PUSH = 1.15; // how far a dot right under the pointer moves
const STIFFNESS = 0.12; // pull back to its home position
const DAMPING = 0.78; // velocity kept each frame; lower settles faster

// The wink: the head tilts towards the closing eye, pivoting at the neck,
// and a small sparkle appears beside it.
const TILT = -0.04; // radians at full wink
const PIVOT = { x: 24, y: 50 }; // cells
const SPARKLE = { x: 6, y: 21 }; // cells, just outside the winking eye
const SHOULDERS = 46; // rows below this stay put

function cssVar(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/**
 * The selfie as an LED panel. The dots part around the pointer (or a finger)
 * and spring back, and a click or tap makes it wink.
 */
export function DotPortrait() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();
  const [winks, setWinks] = useState(0);

  // Mutable draw state, kept out of React so pointer moves don't re-render.
  const state = useRef({
    boot: 0,
    eye: 0, // 0 open, 1 closed
    px: 0,
    py: 0,
    pointer: false,
    ox: new Float32Array(count),
    oy: new Float32Array(count),
    vx: new Float32Array(count),
    vy: new Float32Array(count),
  });
  const wake = useRef<() => void>(() => {});

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const fg = cssVar("--color-fg");
    const red = cssVar("--color-kurta");
    const off = cssVar("--color-dot-off");
    let cell = 0;
    let frame = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      cell = w / cols;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(cell * rows * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      wake.current();
    };

    // Advance the springs one step; returns whether anything is still moving.
    const step = () => {
      const s = state.current;
      const reach = REACH * cell;
      let moving = false;
      for (let i = 0; i < count; i++) {
        const hx = (i % cols) * cell + cell / 2;
        const hy = Math.floor(i / cols) * cell + cell / 2;
        let tx = 0;
        let ty = 0;
        if (s.pointer) {
          const dx = hx - s.px;
          const dy = hy - s.py;
          const d = Math.hypot(dx, dy);
          if (d < reach && d > 0.001) {
            const f = (1 - d / reach) ** 2 * PUSH * cell;
            tx = (dx / d) * f;
            ty = (dy / d) * f;
          }
        }
        s.vx[i] = (s.vx[i] + (tx - s.ox[i]) * STIFFNESS) * DAMPING;
        s.vy[i] = (s.vy[i] + (ty - s.oy[i]) * STIFFNESS) * DAMPING;
        s.ox[i] += s.vx[i];
        s.oy[i] += s.vy[i];
        if (Math.abs(s.vx[i]) + Math.abs(s.vy[i]) > 0.01 || Math.abs(s.ox[i] - tx) + Math.abs(s.oy[i] - ty) > 0.05) {
          moving = true;
        }
      }
      return moving;
    };

    const draw = () => {
      const s = state.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const angle = TILT * s.eye;
      const px = PIVOT.x * cell;
      const py = PIVOT.y * cell;
      for (let y = 0; y < rows; y++) {
        // The head turns fully; the neck blends into still shoulders.
        const weight = Math.min(1, Math.max(0, (SHOULDERS - y) / 12));
        const cos = Math.cos(angle * weight);
        const sin = Math.sin(angle * weight);
        // The panel boots bottom-up, a few rows fading in at a time.
        const fromBottom = rows - 1 - y;
        const bootAlpha = Math.min(1, Math.max(0, (s.boot * (rows + 8) - fromBottom) / 8));
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x;
          const lvl = (face.level[i] + (wink.level[i] - face.level[i]) * s.eye) * bootAlpha;
          let cx = x * cell + cell / 2;
          let cy = y * cell + cell / 2;
          // Every cell keeps an unlit pixel at home, so anywhere a lit dot
          // moves away from shows a switched-off screen, not a hole.
          ctx.fillStyle = off;
          ctx.beginPath();
          ctx.arc(cx, cy, cell * 0.16, 0, Math.PI * 2);
          ctx.fill();
          if (lvl < 0.35) continue;
          if (angle) {
            const rx = cx - px;
            const ry = cy - py;
            cx = px + rx * cos - ry * sin;
            cy = py + rx * sin + ry * cos;
          }
          cx += s.ox[i];
          cy += s.oy[i];
          const l = Math.min(lvl, 5);
          ctx.globalAlpha = 0.35 + l * 0.13;
          ctx.fillStyle = face.red[i] ? red : fg;
          ctx.beginPath();
          ctx.arc(cx, cy, cell * (0.14 + l * 0.065), 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      }
      if (s.eye > 0.05) {
        // A four-point sparkle in the accent red, sized by how closed the eye is.
        ctx.fillStyle = red;
        const sx = SPARKLE.x * cell + cell / 2;
        const sy = SPARKLE.y * cell + cell / 2;
        const arms: [number, number, number][] = [
          [0, 0, 0.42],
          [1, 0, 0.3], [-1, 0, 0.3], [0, 1, 0.3], [0, -1, 0.3],
          [2, 0, 0.18], [-2, 0, 0.18], [0, 2, 0.18], [0, -2, 0.18],
        ];
        for (const [dx, dy, r] of arms) {
          ctx.beginPath();
          ctx.arc(sx + dx * cell, sy + dy * cell, cell * r * s.eye, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    // One loop for everything: it runs while dots are moving and stops when they settle.
    const tick = () => {
      const moving = step();
      draw();
      frame = moving || state.current.pointer ? requestAnimationFrame(tick) : 0;
    };
    wake.current = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // The one unprompted animation on the page.
    const boot = reduce
      ? ((state.current.boot = 1), undefined)
      : animate(0, 1, {
          duration: 1.4,
          ease: [0.3, 0, 0.2, 1],
          delay: 0.15,
          onUpdate: (v) => {
            state.current.boot = v;
            wake.current();
          },
        });

    return () => {
      ro.disconnect();
      boot?.stop();
      cancelAnimationFrame(frame);
      frame = 0;
    };
  }, [reduce]);

  // Close the eye, hold it for a beat, open it again.
  useEffect(() => {
    if (winks === 0) return;
    const s = state.current;
    const set = (v: number) => {
      s.eye = v;
      wake.current();
    };
    if (reduce) {
      set(1);
      const t = setTimeout(() => set(0), 500);
      return () => clearTimeout(t);
    }
    const c = animate(0, [0, 1, 1, 0], {
      duration: 0.75,
      times: [0, 0.15, 0.7, 1],
      ease: "easeInOut",
      onUpdate: set,
    });
    return () => c.stop();
  }, [winks, reduce]);

  const track = (e: React.PointerEvent) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    const s = state.current;
    s.px = e.clientX - r.left;
    s.py = e.clientY - r.top;
    s.pointer = true;
    wake.current();
  };
  const release = () => {
    state.current.pointer = false;
    wake.current();
  };

  return (
    <figure className="w-full">
      <button
        type="button"
        aria-label="Portrait of Kishan made of dots. Press to make him wink."
        className="block w-full cursor-pointer touch-pan-y rounded-[var(--radius-widget)] bg-ink"
        onPointerMove={track}
        onPointerDown={track}
        onPointerLeave={release}
        onPointerUp={(e) => e.pointerType !== "mouse" && release()}
        onPointerCancel={release}
        onClick={() => setWinks((n) => n + 1)}
      >
        <canvas ref={canvasRef} className="block aspect-[48/60] w-full" />
      </button>
      <figcaption className="mt-3 text-sm text-dim" aria-live="polite">
        {winks > 0 ? (
          "Hi there."
        ) : (
          <>
            <span className="[@media(hover:none)]:hidden">Click to say hi.</span>
            <span className="hidden [@media(hover:none)]:inline">Tap to say hi.</span>
          </>
        )}
      </figcaption>
    </figure>
  );
}
