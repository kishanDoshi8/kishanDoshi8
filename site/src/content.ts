// Everything the page says lives here, so copy edits never touch layout code.

export const links = {
  email: "kishan.doshi88@gmail.com",
  linkedin: "https://www.linkedin.com/in/kishan-doshi/",
  github: "https://github.com/kishanDoshi8",
  crow: "https://playcrow.app",
  crowCode: "https://github.com/kishanDoshi8/crow",
};

export const intro = {
  name: "Kishan Doshi",
  lead: "I'm a full stack developer in Toronto. I build the systems that quietly keep a business running: payroll, ERP, and the integrations in between.",
  aside: "Outside work, I'm usually the one setting up game night.",
  status: "Looking for a senior developer role in Toronto",
};

export type Problem = {
  title: string;
  where: string;
  body: string;
  stack: string[];
};

export const problems: Problem[] = [
  {
    title: "An API that had to be restarted five times a day at month-end",
    where: "Red Dot Distribution",
    body: "Our Odoo-to-SAP posting API fell over every month-end under load, and retries sometimes posted the same entry twice. I put a throttled, Redis-backed queue in front of it, with idempotency keys so a retry can never post twice. It hasn't needed a restart since.",
    stack: ["C#", "Redis", "SAP SDK", "IIS"],
  },
  {
    title: "Licence orders that took days to turn into invoices",
    where: "Red Dot Distribution",
    body: "I connected Odoo to AppXite, the platform we use to sell Microsoft licences. An order now moves through credit checks, purchase orders, goods receipts and invoicing on its own, and renewals, upgrades and cancellations sync back. What used to take days takes under an hour.",
    stack: ["Python", "Odoo", "Webhooks", "REST"],
  },
  {
    title: "Tax returns typed into four government portals by hand",
    where: "Red Dot Distribution",
    body: "One Odoo module now reports sales and purchase tax straight to the revenue authorities in Kenya, Tanzania, Uganda and Zambia. Finance clicks once, invoices come back with the authority's number and QR code, and retries are safe because nothing gets filed twice.",
    stack: ["Python", "Odoo", "REST", "Audit logging"],
  },
  {
    title: "Fixing a payroll after it's already been paid",
    where: "GreenSlate",
    body: "Timesheets change after a pay period closes. I built the processing that applies those corrections: it recalculates gross-to-net pay, taxes, fringes and union rules, then writes the adjustment lines. I also worked on withholding tax for all 50 US states.",
    stack: ["C#", ".NET", "SQL Server", "CQRS"],
  },
  {
    title: "Pages that took too long to load",
    where: "GreenSlate",
    body: "We moved our data access from Entity Framework to Dapper and rewrote the slow queries by hand. Requests and page loads got about three times faster.",
    stack: ["C#", "Dapper", "SQL"],
  },
  {
    title: "A day and a half without internet, across ten countries",
    where: "Red Dot Distribution",
    body: "An ISP outage cut every office off from our ERP. My networking courses at George Brown finally earned their keep: SSH port forwarding gave VPN-connected machines a way through to the Odoo server, so the most urgent work kept moving.",
    stack: ["SSH", "Networking", "Linux"],
  },
];

export const now = {
  role: "Team lead at Red Dot Distribution",
  detail:
    "I lead four engineers on an Odoo ERP used by 150+ people in 10 countries across the Middle East and East Africa. I run planning and code reviews, mentor the newer developers, and still write code most days.",
};

export const crow = {
  title: "Crow",
  body: [
    "A prediction game I built for my friends. Someone asks a question, everyone makes a call before the deadline, and Crow keeps score. About 15 of us play it on Premier League, Champions League, IPL and World Cup matches.",
    "Every game rule lives in Postgres, behind row-level security and RPC functions, so there's no API server to look after. Fixtures and results sync on a schedule, and reminders arrive as push notifications. GitHub Actions deploys it to a DigitalOcean droplet, the same one serving this page.",
  ],
  stack: ["React", "TypeScript", "Supabase", "Postgres", "PWA", "nginx"],
};

export type Job = {
  years: string;
  company: string;
  place: string;
  roles: string[];
};

export const jobs: Job[] = [
  {
    years: "2025 to now",
    company: "Red Dot Distribution",
    place: "Dar es Salaam",
    roles: ["Team Lead, since Jun 2026", "Senior Software Engineer, Aug 2025 to Jun 2026"],
  },
  {
    years: "2021 to 2024",
    company: "GreenSlate",
    place: "Toronto",
    roles: ["Full Stack Engineer II, Aug 2022 to Oct 2024", "Full Stack Engineer, Jun 2021 to Aug 2022"],
  },
  {
    years: "2021 to 2022",
    company: "University of Toronto",
    place: "Toronto",
    roles: ["Teaching Assistant, Full Stack Web Development Bootcamp"],
  },
];

export const education = [
  "Postgraduate certificates in IT administration and in electronics engineering, George Brown College, Toronto",
  "Bachelor of Engineering, electronics and communications, ITM Universe, Vadodara",
];

export const toolbox: { group: string; items: string }[] = [
  { group: "Languages", items: "C#, Python, TypeScript, JavaScript, SQL" },
  { group: "Frontend", items: "React, Vite, Zustand, PWAs, service workers, Web Push" },
  { group: "Backend", items: ".NET Core, ASP.NET, Node.js, REST, webhooks, Dapper, Entity Framework" },
  { group: "Data", items: "SQL Server, PostgreSQL, Supabase, Redis" },
  { group: "ERP", items: "Odoo modules, SAP SDK, tax authority APIs" },
  { group: "Shipping", items: "GitHub Actions, Azure DevOps, TeamCity, Docker, nginx, IIS" },
  { group: "Habits", items: "DDD, CQRS, idempotent APIs, unit tests, Playwright, code review" },
];
