import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";

const N = 5;

function press(board: boolean[], i: number) {
  const next = board.slice();
  const x = i % N;
  const y = Math.floor(i / N);
  const flip = (cx: number, cy: number) => {
    if (cx >= 0 && cx < N && cy >= 0 && cy < N) next[cy * N + cx] = !next[cy * N + cx];
  };
  flip(x, y);
  flip(x - 1, y);
  flip(x + 1, y);
  flip(x, y - 1);
  flip(x, y + 1);
  return next;
}

// Scrambling from a solved board by real presses guarantees a solution exists.
function scramble() {
  let b = Array<boolean>(N * N).fill(false);
  while (b.every((v) => !v)) {
    for (let k = 0; k < 5; k++) b = press(b, Math.floor(Math.random() * N * N));
  }
  return b;
}

export function LightsOut() {
  const [board, setBoard] = useState(scramble);
  const [moves, setMoves] = useState(0);
  const reduce = useReducedMotion();
  const solved = board.every((v) => !v);
  const lit = board.filter(Boolean).length;

  return (
    <div className="flex flex-col gap-5">
      <div
        role="grid"
        aria-label="Lights out puzzle"
        className="grid w-fit grid-cols-5 gap-2.5 self-center"
      >
        {board.map((on, i) => (
          <motion.button
            key={i}
            type="button"
            role="gridcell"
            aria-label={`Row ${Math.floor(i / N) + 1}, column ${(i % N) + 1}, ${on ? "on" : "off"}`}
            disabled={solved}
            onClick={() => {
              setBoard((b) => press(b, i));
              setMoves((m) => m + 1);
            }}
            whileTap={reduce ? undefined : { scale: 0.82 }}
            className="grid size-9 place-items-center rounded-full disabled:cursor-default sm:size-10"
          >
            <motion.span
              className="block size-6 rounded-full sm:size-7"
              initial={false}
              animate={{
                backgroundColor: on ? "var(--color-fg)" : "var(--color-dot-off)",
                scale: on ? 1 : 0.72,
              }}
              transition={{ duration: reduce ? 0 : 0.18 }}
            />
          </motion.button>
        ))}
      </div>
      <div className="flex items-baseline justify-between gap-4 text-sm" aria-live="polite">
        <span className="text-dim">
          {solved
            ? `All dark in ${moves} ${moves === 1 ? "move" : "moves"}. Nicely done.`
            : `${lit} ${lit === 1 ? "light" : "lights"} on, ${moves} ${moves === 1 ? "move" : "moves"}`}
        </span>
        <button
          type="button"
          className="dot-link shrink-0 text-fg"
          onClick={() => {
            setBoard(scramble());
            setMoves(0);
          }}
        >
          {solved ? "Play again" : "New board"}
        </button>
      </div>
    </div>
  );
}
