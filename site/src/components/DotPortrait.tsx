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

const calm = parse(portrait.a);
const smile = parse(portrait.b);
const { cols, rows } = portrait;

function cssVar(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/**
 * The selfie rendered as an LED panel. Hover (or tap) swaps to the second
 * photo by easing every dot's brightness, and the pointer lights up the dots
 * right under it, like a finger on a glyph screen.
 */
export function DotPortrait() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();
  const [smiling, setSmiling] = useState(false);
  const lastPointer = useRef<string>("mouse");

  // Mutable draw state; kept out of React so a pointer move doesn't re-render.
  const state = useRef({ mix: 0, boot: 0, px: -1e3, py: -1e3, glow: 0 });
  const requestDraw = useRef<() => void>(() => {});

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
      draw();
    };

    const draw = () => {
      frame = 0;
      const s = state.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const reach = cell * 3.2;
      for (let y = 0; y < rows; y++) {
        // The panel boots bottom-up, a few rows fading in at a time.
        const fromBottom = rows - 1 - y;
        const bootAlpha = Math.min(1, Math.max(0, (s.boot * (rows + 8) - fromBottom) / 8));
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x;
          let lvl = calm.level[i] + (smile.level[i] - calm.level[i]) * s.mix;
          const isRed = s.mix < 0.5 ? calm.red[i] : smile.red[i];
          const cx = x * cell + cell / 2;
          const cy = y * cell + cell / 2;
          if (s.glow > 0) {
            const d = Math.hypot(cx - s.px, cy - s.py);
            if (d < reach) lvl += (1 - d / reach) * 1.6 * s.glow;
          }
          lvl *= bootAlpha;
          if (lvl < 0.35) {
            ctx.fillStyle = off;
            ctx.beginPath();
            ctx.arc(cx, cy, cell * 0.16, 0, Math.PI * 2);
            ctx.fill();
            continue;
          }
          const l = Math.min(lvl, 5);
          ctx.globalAlpha = 0.35 + l * 0.13;
          ctx.fillStyle = isRed ? red : fg;
          ctx.beginPath();
          ctx.arc(cx, cy, cell * (0.14 + l * 0.065), 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      }
    };

    requestDraw.current = () => {
      if (!frame) frame = requestAnimationFrame(draw);
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
            requestDraw.current();
          },
        });

    return () => {
      ro.disconnect();
      boot?.stop();
      cancelAnimationFrame(frame);
    };
  }, [reduce]);

  useEffect(() => {
    if (reduce) {
      state.current.mix = smiling ? 1 : 0;
      requestDraw.current();
      return;
    }
    const c = animate(state.current.mix, smiling ? 1 : 0, {
      duration: 0.45,
      ease: "easeInOut",
      onUpdate: (v) => {
        state.current.mix = v;
        requestDraw.current();
      },
    });
    return () => c.stop();
  }, [smiling, reduce]);

  const onMove = (e: React.PointerEvent) => {
    const r = e.currentTarget.getBoundingClientRect();
    const s = state.current;
    s.px = e.clientX - r.left;
    s.py = e.clientY - r.top;
    s.glow = reduce ? 0 : 1;
    requestDraw.current();
  };

  return (
    <figure className="w-full">
      <button
        type="button"
        aria-pressed={smiling}
        aria-label="Portrait of Kishan made of dots. Press to switch to a smiling photo."
        className="block w-full cursor-pointer rounded-[var(--radius-widget)] bg-ink"
        onPointerDown={(e) => (lastPointer.current = e.pointerType)}
        onPointerEnter={(e) => e.pointerType === "mouse" && setSmiling(true)}
        onPointerLeave={(e) => {
          if (e.pointerType === "mouse") setSmiling(false);
          state.current.glow = 0;
          requestDraw.current();
        }}
        onPointerMove={onMove}
        onClick={(e) => {
          // Mouse users get the smile on hover; touch and keyboard toggle it.
          if (e.detail === 0 || lastPointer.current !== "mouse") setSmiling((v) => !v);
        }}
      >
        <canvas ref={canvasRef} className="block aspect-[48/60] w-full" />
      </button>
      <figcaption className="mt-3 text-sm text-dim">
        <span className="[@media(hover:none)]:hidden">{smiling ? "There we go." : "Hover to make me smile."}</span>
        <span className="hidden [@media(hover:none)]:inline">{smiling ? "There we go." : "Tap to make me smile."}</span>
      </figcaption>
    </figure>
  );
}
