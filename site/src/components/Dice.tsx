import { useState } from "react";
import { motion, useAnimate, useReducedMotion } from "motion/react";

// Which cells of a 3x3 grid hold a pip, for faces 1 to 6.
const FACES: Record<number, number[]> = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};

const roll = () => 1 + Math.floor(Math.random() * 6);

function Die({ value }: { value: number }) {
  return (
    <span className="die grid size-20 grid-cols-3 place-items-center rounded-2xl bg-tile-raised p-3 sm:size-24">
      {Array.from({ length: 9 }, (_, i) => (
        <span
          key={i}
          className={`block size-3.5 rounded-full transition-colors duration-100 sm:size-4 ${
            FACES[value].includes(i) ? "bg-fg" : "bg-dot-off"
          }`}
        />
      ))}
    </span>
  );
}

export function Dice() {
  const [dice, setDice] = useState<[number, number]>([5, 2]);
  const [rolled, setRolled] = useState(false);
  const [busy, setBusy] = useState(false);
  const [scope, animate] = useAnimate();
  const reduce = useReducedMotion();

  const throwDice = async () => {
    if (busy) return;
    setBusy(true);
    if (!reduce) {
      // Flicker through a few faces while the dice tumble, then land.
      const flicker = setInterval(() => setDice([roll(), roll()]), 70);
      await animate(".die", { rotate: [0, -14, 10, -6, 0], y: [0, -10, 0, -3, 0] }, { duration: 0.5 });
      clearInterval(flicker);
    }
    setDice([roll(), roll()]);
    setRolled(true);
    setBusy(false);
  };

  const [a, b] = dice;
  const result = !rolled
    ? "Tap to roll. Highest roll picks the next game."
    : a === b
      ? `Double ${a}s. You pick the next game.`
      : `You rolled ${a + b}.`;

  return (
    <div className="flex flex-col gap-5">
      <motion.button
        ref={scope}
        type="button"
        onClick={throwDice}
        aria-label={`Roll the dice. Showing ${a} and ${b}.`}
        whileTap={reduce ? undefined : { scale: 0.96 }}
        className="flex w-fit cursor-pointer gap-4 self-center rounded-3xl md:self-end"
      >
        <Die value={a} />
        <Die value={b} />
      </motion.button>
      <p className="text-sm text-dim md:text-right" aria-live="polite">
        {result}
      </p>
    </div>
  );
}
