import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Dice } from "./components/Dice";
import { Disclosure } from "./components/Disclosure";
import { DotPortrait } from "./components/DotPortrait";
import { LightsOut } from "./components/LightsOut";
import { Pizza } from "./components/Pizza";
import { Problems } from "./components/Problems";
import { TorontoClock } from "./components/TorontoClock";
import { crow, education, intro, jobs, links, now, problems, toolbox } from "./content";

function Section({ id, title, note, children }: { id: string; title: string; note?: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="grid gap-6 md:grid-cols-[15rem_1fr] md:gap-10">
      <div className="md:sticky md:top-8 md:self-start">
        <h2 id={`${id}-title`} className="font-dot text-[1.75rem] leading-tight font-extrabold">
          {title}
        </h2>
        {note && <p className="mt-2 text-sm text-dim">{note}</p>}
      </div>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

function Tile({ title, children, className = "" }: { title: string; children: ReactNode; className?: string }) {
  return (
    <article className={`flex flex-col gap-4 rounded-[var(--radius-widget)] bg-tile p-6 ${className}`}>
      <h3 className="text-lg font-semibold">{title}</h3>
      {children}
    </article>
  );
}

function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="dot-link">
      {children}
    </a>
  );
}

export function App() {
  const reduce = useReducedMotion();
  // The hero text settles in once the portrait has booted; nothing else moves on its own.
  const settle = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 8 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5, delay, ease: [0.3, 0, 0.2, 1] as const },
        };

  return (
    <div className="mx-auto max-w-[72rem] px-5 md:px-10">
      <header className="flex items-center justify-between py-6">
        <a href="#top" className="font-dot text-lg font-extrabold">
          kd
        </a>
        <TorontoClock />
      </header>

      <main id="top" className="flex flex-col gap-24 pb-16 md:gap-32">
        <section className="grid items-center gap-10 pt-4 md:grid-cols-12 md:gap-12 md:pt-10">
          <div className="w-[80%] max-w-[26rem] md:col-span-5 md:w-full">
            <DotPortrait />
          </div>
          <div className="md:col-span-7">
            <motion.h1
              {...settle(0.9)}
              className="font-dot text-[clamp(3.25rem,10vw,6.5rem)] leading-[0.92] font-extrabold"
            >
              {intro.name}
            </motion.h1>
            <motion.p {...settle(1.05)} className="mt-6 max-w-[34ch] text-xl leading-snug md:text-2xl">
              {intro.lead}
            </motion.p>
            <motion.p {...settle(1.15)} className="mt-4 max-w-[40ch] text-dim md:text-lg">
              {intro.aside}
            </motion.p>
            <motion.div {...settle(1.25)} className="mt-8 flex flex-col gap-5">
              <p className="inline-flex w-fit items-center gap-3 rounded-full bg-tile py-2.5 pr-5 pl-4 text-sm">
                <span className="relative flex size-2.5" aria-hidden>
                  <span className="absolute inset-0 rounded-full bg-kurta opacity-60 motion-safe:animate-ping" />
                  <span className="relative size-2.5 rounded-full bg-kurta" />
                </span>
                {intro.status}
              </p>
              <p className="flex flex-wrap gap-x-6 gap-y-2">
                <a href={`mailto:${links.email}`} className="dot-link">
                  Email me
                </a>
                <ExternalLink href={links.linkedin}>LinkedIn</ExternalLink>
                <ExternalLink href={links.github}>GitHub</ExternalLink>
              </p>
            </motion.div>
          </div>
        </section>

        <Section id="work" title="Selected work" note="Open one for the problem, my approach and the result.">
          <Problems items={problems} />
        </Section>

        <Section id="crow" title="Side project">
          <article className="grid gap-8 rounded-[var(--radius-widget)] bg-tile p-6 md:grid-cols-[1fr_15rem] md:p-8">
            <div className="flex flex-col gap-4">
              <h3 className="font-dot text-4xl font-extrabold">{crow.title}</h3>
              <ul className="flex flex-wrap gap-2 text-sm">
                {crow.facts.map((fact, i) => (
                  <li key={fact} className="inline-flex items-center gap-2 rounded-full bg-tile-raised px-3 py-1.5">
                    {/* Red means live: only the first fact gets the dot. */}
                    {i === 0 && <span aria-hidden className="size-2 rounded-full bg-kurta" />}
                    {fact}
                  </li>
                ))}
              </ul>
              {crow.body.map((p) => (
                <p key={p.slice(0, 20)} className="max-w-[58ch] leading-relaxed text-fg/85">
                  {p}
                </p>
              ))}
              <Disclosure label="How it's built">
                <p className="max-w-[58ch] leading-relaxed text-fg/85">{crow.technical}</p>
                <p className="mt-3 text-sm text-dim">{crow.stack.join(", ")}</p>
              </Disclosure>
              <p className="mt-auto flex flex-wrap gap-x-6 gap-y-2 pt-2">
                <ExternalLink href={links.crow}>Play Crow</ExternalLink>
                <ExternalLink href={links.crowCode}>Read the code</ExternalLink>
              </p>
            </div>
            <a
              href={links.crow}
              target="_blank"
              rel="noreferrer"
              className="block w-full max-w-[15rem] self-center overflow-hidden rounded-[2rem] border-4 border-tile-raised"
            >
              <img
                src="/crow.webp"
                width={585}
                height={1266}
                loading="lazy"
                alt="Crow's home screen: 'Call it. Crow about it.' with buttons to start a room or join with a code."
                className="block h-auto w-full"
              />
            </a>
          </article>
        </Section>

        <Section id="off" title="Off the clock" note="Most of my favourite evenings involve a game and a pizza.">
          <div className="grid gap-4 lg:grid-cols-2">
            <Tile title="Puzzles">
              <p className="text-dim">I can't leave one alone. Try this: switch every light off. Each tap flips a light and the ones next to it.</p>
              <LightsOut />
            </Tile>
            <Tile title="Pizza">
              <p className="text-dim">Game night runs on it. Help yourself.</p>
              <Pizza />
            </Tile>
            <Tile title="Game nights" className="lg:col-span-2">
              <div className="grid gap-6 md:grid-cols-2 md:items-end">
                <p className="max-w-[48ch] leading-relaxed text-fg/85">
                  Board games, card games, anything with a scoreboard. I like being the person who brings everyone to
                  the table, and Crow is the same idea for the group chat. I'd rather play sport than watch it, and when
                  I do watch, I want company.
                </p>
                <Dice />
              </div>
            </Tile>
          </div>
        </Section>

        <Section id="history" title="Where I've worked">
          <div className="flex flex-col gap-10">
            <p className="max-w-[60ch] text-lg leading-relaxed">
              <span className="text-dim">Right now: </span>
              {now.role}. {now.detail}
            </p>
            <ol className="flex flex-col">
              {jobs.map((job) => (
                <li key={job.company} className="grid gap-1 border-t border-line py-5 md:grid-cols-[10rem_1fr] md:gap-6">
                  <span className="font-dot text-lg font-extrabold text-fg/80">{job.years}</span>
                  <div>
                    <p className="text-lg">
                      {job.company}
                      <span className="text-dim">, {job.place}</span>
                    </p>
                    {job.roles.map((r) => (
                      <p key={r} className="text-dim">
                        {r}
                      </p>
                    ))}
                  </div>
                </li>
              ))}
              <li className="grid gap-1 border-t border-b border-line py-5 md:grid-cols-[10rem_1fr] md:gap-6">
                <span className="font-dot text-lg font-extrabold text-fg/80">2017 – 2019</span>
                <div>
                  <p className="text-lg">School</p>
                  {education.map((e) => (
                    <p key={e} className="text-dim">
                      {e}
                    </p>
                  ))}
                </div>
              </li>
            </ol>
          </div>
        </Section>

        <Section id="toolbox" title="What I reach for">
          <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-[8rem_1fr]">
            {toolbox.map((t) => (
              <div key={t.group} className="contents">
                <dt className="text-dim">{t.group}</dt>
                <dd className="-mt-4 sm:mt-0">{t.items}</dd>
              </div>
            ))}
          </dl>
        </Section>

        <section aria-labelledby="hello" className="rounded-[var(--radius-widget)] bg-tile p-6 md:p-10">
          <h2 id="hello" className="text-lg text-dim">
            Say hello
          </h2>
          <a
            href={`mailto:${links.email}`}
            className="mt-3 block w-fit font-dot text-[clamp(1rem,4.7vw,3.25rem)] leading-tight font-extrabold whitespace-nowrap transition-colors hover:text-kurta"
          >
            {links.email}
          </a>
          <p className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
            <ExternalLink href={links.linkedin}>LinkedIn</ExternalLink>
            <ExternalLink href={links.github}>GitHub</ExternalLink>
          </p>
        </section>
      </main>

      <footer className="border-t border-line py-8 text-sm text-dim">
        <p>Built by hand with React and Motion. No cookies, no tracking.</p>
      </footer>
    </div>
  );
}
