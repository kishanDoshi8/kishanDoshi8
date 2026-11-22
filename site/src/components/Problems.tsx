import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { Problem } from "../content";

// A 3x3 dot glyph: a plus when closed, a minus when open.
function Toggle({ open }: { open: boolean }) {
  const reduce = useReducedMotion();
  return (
    <span aria-hidden className="grid size-5 shrink-0 grid-cols-3 gap-[3px]">
      {Array.from({ length: 9 }, (_, i) => {
        const row = Math.floor(i / 3);
        const col = i % 3;
        const horizontal = row === 1;
        const vertical = col === 1 && !horizontal;
        const on = horizontal || (vertical && !open);
        return (
          <motion.span
            key={i}
            className="block size-[4px] rounded-full bg-fg"
            initial={false}
            animate={{ opacity: on ? 1 : 0, scale: on ? 1 : 0.3 }}
            transition={{ duration: reduce ? 0 : 0.2 }}
          />
        );
      })}
    </span>
  );
}

function Row({ problem }: { problem: Problem }) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const id = useId();

  return (
    <li className="border-t border-line last:border-b">
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((o) => !o)}
          className="group flex w-full cursor-pointer items-start gap-5 py-5 text-left"
        >
          <span className="flex-1">
            <span className="block text-lg leading-snug text-fg transition-colors group-hover:text-fg/80 md:text-xl">
              {problem.title}
            </span>
            <span className="mt-1 block text-sm text-dim">{problem.where}</span>
          </span>
          <span className="pt-1.5">
            <Toggle open={open} />
          </span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={id}
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.28, ease: [0.3, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="max-w-[62ch] pb-6">
              <p className="leading-relaxed text-fg/85">{problem.body}</p>
              <p className="mt-3 text-sm text-dim">{problem.stack.join(", ")}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

export function Problems({ items }: { items: Problem[] }) {
  return (
    <ul>
      {items.map((p) => (
        <Row key={p.title} problem={p} />
      ))}
    </ul>
  );
}
