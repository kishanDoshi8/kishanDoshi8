import { useEffect, useState } from "react";

const format = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Toronto",
  hour: "numeric",
  minute: "2-digit",
});

// Local time in Toronto, so anyone reaching out knows if it's a sensible hour.
export function TorontoClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 10_000);
    return () => clearInterval(t);
  }, []);
  const time = format.format(now).replace(/\./g, "");
  return (
    <span className="text-sm text-dim">
      Toronto <time className="font-dot text-base text-fg" dateTime={now.toISOString()}>{time}</time>
    </span>
  );
}
