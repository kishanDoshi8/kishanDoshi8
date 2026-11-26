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
  lead: "I'm a full stack developer in Toronto. I build the systems a business depends on, and keep them running.",
  aside: "Outside work, I'm usually the one setting up game night.",
  status: "Looking for a senior developer role in Toronto",
};

export type Problem = {
  title: string;
  // The outcome, shown without opening the row.
  impact: string;
  where: string;
  when: string;
  problem: string;
  approach: string;
  result: string;
  stack: string[];
};

export const problems: Problem[] = [
  {
    title: "Automated Microsoft licence order-to-invoice",
    impact: "Days → under an hour",
    where: "Red Dot Distribution",
    when: "2025 – now",
    problem:
      "Orders for Microsoft CSP licences moved through credit checks, pro forma invoices, purchase orders, goods receipts, accruals and customer invoices by hand, across two systems.",
    approach:
      "Designed and built the company's largest integration to date, between Odoo and AppXite, using webhooks and REST APIs. It keeps products, resellers, end customers and tenants in sync, and applies every subscription change (upgrade, downgrade, renewal, cancellation) according to policy, with logging and automatic retries.",
    result: "Order-to-invoice processing went from days to under an hour.",
    stack: ["Python", "Odoo", "Webhooks", "REST APIs"],
  },
  {
    title: "Stabilised the Odoo-to-SAP posting API under month-end load",
    impact: "5+ restarts a day → 0",
    where: "Red Dot Distribution",
    when: "2025 – now",
    problem:
      "Month-end volume crashed the posting API, forcing more than five restarts a day. Retries after a crash could post the same entry twice and corrupt customer balances.",
    approach:
      "Put a semaphore-throttled, Redis-backed queue in front of SAP, with idempotency keys so every request can be retried safely.",
    result: "The API no longer needs restarts, and duplicate postings are prevented by design.",
    stack: ["C#", "SAP SDK", "Redis", "IIS"],
  },
  {
    title: "Direct tax reporting to four revenue authorities",
    impact: "4 countries, 1 click",
    where: "Red Dot Distribution",
    when: "2025 – now",
    problem:
      "Sales and purchase tax for Kenya, Tanzania, Uganda and Zambia was typed into each authority's portal by hand or posted through legacy SAP.",
    approach:
      "Built an Odoo module that submits to the KRA, TRA, URA and ZRA through their APIs, with idempotent retries and an audit log.",
    result:
      "Finance submits with one click, and invoices carry the authority's invoice number and QR code as required.",
    stack: ["Python", "Odoo", "REST APIs"],
  },
  {
    title: "Rebuilt CI/CD for an ERP used in 10 countries",
    impact: "Gated releases, 3 environments",
    where: "Red Dot Distribution",
    when: "2025 – now",
    problem:
      "A growing team needed deployments across dev, UAT and production to be repeatable and safe to roll back.",
    approach:
      "Set up branch protection, lint and test gates, pre-deploy rehearsals, upgrades of only the Odoo modules that changed, targeted container restarts, nightly backups, pre-deploy snapshots, and automated release and back-merge workflows.",
    result: "Every release follows one gated, rehearsed path, with a snapshot to roll back to.",
    stack: ["GitHub Actions", "Docker", "Odoo", "PostgreSQL"],
  },
  {
    title: "Multi-state payroll tax, calculated and allocated automatically",
    impact: "Hours a week → minutes",
    where: "GreenSlate",
    when: "2021 – 2024",
    problem:
      "For people working across several productions, withholding tax had to be split by gross income, and payroll admins did it by hand every week.",
    approach:
      "Implemented withholding tax for all 50 US states (live in the 20+ the company operated in), automated the allocation, and filed with state agencies through their APIs. Also built retroactive timesheet processing that recalculates gross-to-net pay, taxes, fringes and union rules after a payroll is committed.",
    result: "Allocation that took admins several hours a week now runs in minutes.",
    stack: ["C#", ".NET", "SQL Server", "CQRS", "Event sourcing"],
  },
  {
    title: "Data access migration from Entity Framework to Dapper",
    impact: "About 3x faster",
    where: "GreenSlate",
    when: "2021 – 2024",
    problem: "Key requests and page loads in the payroll product were slow.",
    approach:
      "Migrated the data access layer to Dapper and hand-tuned the SQL behind the slowest requests.",
    result: "Requests and page loads became roughly three times faster.",
    stack: ["C#", "Dapper", "SQL Server"],
  },
  {
    title: "Kept the business running through an ISP outage",
    impact: "10 countries, 1.5 days",
    where: "Red Dot Distribution",
    when: "2025 – now",
    problem: "An ISP outage cut off access to the ERP in all 10 countries for a day and a half.",
    approach:
      "Drew on my networking background to route VPN-connected office machines to the Odoo server through SSH port forwarding.",
    result: "Critical operations kept running until the connection was restored.",
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
  // Short facts shown above the description.
  facts: ["Live at playcrow.app", "About 15 weekly players", "Built solo, end to end"],
  body: [
    "A prediction game for friend groups. Someone asks a question, everyone makes a call before the deadline, and Crow keeps score across a season. My friends and I play it every week on Premier League, Champions League, IPL and World Cup matches.",
    "I designed and built all of it: the product and UI, the app, the database and the server it runs on. Fixtures and results arrive on their own, players get reminders before picks close, and it installs on a phone like a native app.",
  ],
  // Shown only when someone opens "How it's built".
  technical:
    "The browser talks to Postgres directly, so the database enforces every rule: writes go through RPC functions that check membership, deadlines and balances, and row-level security limits what each player can read. Scheduled jobs sync fixtures and live results, fetching each match once for every room that follows it to stay within the provider's rate limit, and send Web Push notifications. Every change runs type checks, linting and 34 SQL test files in CI, and tagged releases deploy to a DigitalOcean server.",
  stack: ["React", "TypeScript", "Supabase", "PostgreSQL", "pg_cron", "PWA", "nginx", "GitHub Actions"],
};

export type Job = {
  years: string;
  company: string;
  place: string;
  roles: string[];
};

export const jobs: Job[] = [
  {
    years: "2025 – now",
    company: "Red Dot Distribution",
    place: "Dar es Salaam",
    roles: ["Team Lead, since Jun 2026", "Senior Software Engineer, Aug 2025 to Jun 2026"],
  },
  {
    years: "2021 – 2024",
    company: "GreenSlate",
    place: "Toronto",
    roles: ["Full Stack Engineer II, Aug 2022 to Oct 2024", "Full Stack Engineer, Jun 2021 to Aug 2022"],
  },
  {
    years: "2021 – 2022",
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
