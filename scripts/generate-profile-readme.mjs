const OWNER = 'Arjunsk1291';
const FEATURED_REPOS = ['wisentry', 'documind-rag-app', 'opportunityDash', 'hireflow', 'rag-qwen-local'];
const HERO_IMAGE = {
  url: 'https://giffiles.alphacoders.com/217/217729.gif',
  alt: 'Cyberpunk neon cityscape',
  width: 380,
};
const RECRUITER_LINE = 'Für Recruiter in DE: Embedded Systems, Sensorik und robuste Systementwicklung.';
const PRINCIPAL_LANGUAGES = ['TypeScript', 'JavaScript', 'Python', 'C++'];
const EXCLUDED_LANGUAGES = new Set(['CSS', 'HTML', 'Shell', 'Dockerfile']);

function badge(label, value) {
  return `https://img.shields.io/badge/${encodeURIComponent(label)}-${encodeURIComponent(value)}-0b1020?style=for-the-badge`;
}

function yearInBerlin(date = new Date()) {
  return new Intl.DateTimeFormat('en-US', { timeZone: 'Europe/Berlin', year: 'numeric' })
    .formatToParts(date)
    .find((part) => part.type === 'year')?.value ?? String(date.getFullYear());
}

async function fetchText(url, headers = {}) {
  const res = await fetch(url, { headers: { 'user-agent': 'codex-profile-readme', ...headers } });
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
  }
  return res.text();
}

async function fetchJson(url, headers = {}) {
  const res = await fetch(url, { headers: { 'user-agent': 'codex-profile-readme', accept: 'application/vnd.github+json', ...headers } });
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

async function fetchContributionCount(owner, year) {
  const html = await fetchText(`https://github.com/users/${owner}/contributions?from=${year}-01-01&to=${year}-12-31`);
  const match = html.match(/js-contribution-activity-description"[^>]*>\s*([\d,]+)\s*contributions\s*in\s*\d{4}/i);
  if (!match) {
    throw new Error('Could not parse contribution count from GitHub contributions page.');
  }
  return Number(match[1].replace(/,/g, ''));
}

async function fetchLanguageMix(owner, repos) {
  const totals = new Map();
  for (const repo of repos) {
    const data = await fetchJson(`https://api.github.com/repos/${owner}/${repo}/languages`);
    for (const [language, bytes] of Object.entries(data)) {
      if (EXCLUDED_LANGUAGES.has(language)) continue;
      totals.set(language, (totals.get(language) ?? 0) + bytes);
    }
  }

  const ranked = [...totals.entries()].sort((a, b) => b[1] - a[1]);
  const rankedByName = new Map(ranked);
  const preferred = PRINCIPAL_LANGUAGES.filter((language) => rankedByName.has(language))
    .sort((a, b) => rankedByName.get(b) - rankedByName.get(a));
  const picked = (preferred.length ? preferred : ranked.map(([language]) => language)).slice(0, 4);
  return picked.join(' / ');
}

function renderBadge(label, value, alt) {
  return `  <img src="${badge(label, value)}" alt="${alt}" />`;
}

function renderReadme({ year, contributions, languageMix }) {
  return `
<p align="center">
  <img src="${HERO_IMAGE.url}" width="${HERO_IMAGE.width}" alt="${HERO_IMAGE.alt}" />
</p>

<p align="center">
${[
  renderBadge(`${year} contributions`, contributions.toLocaleString('en-US'), `${year} contributions ${contributions.toLocaleString('en-US')}`),
  renderBadge('Main focus', 'Embedded / Robotics', 'Main focus Embedded / Robotics'),
  renderBadge('Core languages', languageMix, `Core languages ${languageMix}`),
  renderBadge('Featured signals', 'WiSentry / DocuMind / OpportunityDash / HireFlow / rag-qwen-local', 'Featured signals WiSentry DocuMind OpportunityDash HireFlow rag-qwen-local'),
].join('\n')}
</p>

<h3 align="center">Embedded sensing first, robotics next, with AI and software as support layers.</h3>

<p align="center">
  <a href="https://www.linkedin.com/in/arjun-s-kumar-721758276/">LinkedIn</a> ·
  <a href="https://github.com/Arjunsk1291">GitHub</a>
</p>

> I am especially interested in robotics, autonomous systems, industrial automation, defence, aerospace, and applied R&D roles in Germany and the DACH region.

<p align="center"><sub>${RECRUITER_LINE}</sub></p>

## Engineering Trajectory

- Mechanical systems - building enough intuition for physical constraints, packaging, tolerances, and hardware-software tradeoffs to work well around mechatronics teams.
- Embedded + sensing - \`WiSentry\` shows ESP32 sensing, WiFi CSI, simulator-backed data generation, and a live dashboard.
- Control + computation - turning noisy signals into bounded, testable decisions with disciplined parsing and signal processing.
- Software + AI - \`DocuMind\`, \`OpportunityDash\`, \`HireFlow\`, and \`rag-qwen-local\` show practical AI, ops, and full-stack execution.
- Robotics / autonomous systems - the direction is toward systems that sense, interpret, and act reliably in real environments.

## Core Projects

### WiSentry

WiSentry is the clearest embedded-sensing project in the portfolio.

- ESP32 microcontrollers capture WiFi CSI for human presence and pose detection.
- A simulator generates training data so the firmware, parser, and runtime pipeline stay aligned.
- The wire protocol is pinned across firmware, simulator, and downstream parsing.
- The system includes signal processing, CNN-based modeling, and a live dashboard.
- The repo stays honest about what is synthetic-trained and what is demonstrated experimentally.

### DocuMind

DocuMind is the strongest applied-AI project for technical document work.

- FastAPI backend with a React + Vite frontend.
- OCR and OpenCV support visual extraction from documents.
- GraphRAG-style retrieval helps answer with more structural awareness than plain keyword search.
- Visual source attribution makes outputs traceable to the document region.
- CAD and telecom-symbol support keeps the use case close to engineering documentation.

### OpportunityDash

OpportunityDash is the best evidence for production ops software.

- Microsoft Graph Excel sync brings structured opportunity data into the system.
- Role-based approvals make the workflow usable in real operations.
- Analytics, KPI views, filtering, export, and reporting are all part of one flow.
- Monitoring-oriented behavior matters more here than flashy UI.
- Dockerized deployment ties frontend, backend, and database together cleanly.

### HireFlow

HireFlow shows a modern full-stack foundation.

- Next.js app structure with Prisma data modeling.
- NextAuth handles authentication.
- Background jobs, scheduled tasks, and migration-aware scripts show operational thinking.
- Tests and guard scripts make the repo feel closer to a shipped system than a demo.
- The stack is practical for job tracking and workflow tooling.

### rag-qwen-local

rag-qwen-local is the clearest local-AI and privacy-first signal.

- Local RAG over personal documents instead of cloud-only inference.
- FastAPI service layer with ChromaDB-backed retrieval.
- Hardware-aware tuning for a GTX 1660 Ti class machine.
- The setup values privacy, repeatability, and laptop-class practicality.
- It is useful evidence for building local AI tools that can actually be run.

## Stack

Python · C++ · TypeScript · JavaScript · FastAPI · React · Next.js · Node.js · Express · Prisma · MongoDB · SQLite · Docker · RAG · OCR · OpenCV · ChromaDB · ESP32 · WiFi CSI

## Working Style

- I prefer systems that are easy to reason about, test, and maintain.
- I lean toward local-first or privacy-conscious designs when the tradeoff makes sense.
- I care about documentation that helps the next engineer move faster.
- I am comfortable moving between embedded work, product software, and applied AI.

## Contact

LinkedIn: [arjun-s-kumar-721758276](https://www.linkedin.com/in/arjun-s-kumar-721758276/) · GitHub: [Arjunsk1291](https://github.com/Arjunsk1291)
`;
}

async function main() {
  const args = process.argv.slice(2);
  const outputIndex = args.indexOf('--output');
  const output = outputIndex >= 0 ? args[outputIndex + 1] : null;
  const check = args.includes('--check');
  const year = Number(yearInBerlin());
  const contributions = await fetchContributionCount(OWNER, year);
  const languageMix = await fetchLanguageMix(OWNER, FEATURED_REPOS);
  const readme = renderReadme({ year, contributions, languageMix });

  if (check) {
    const target = output ?? 'README.md';
    const fs = await import('node:fs/promises');
    const current = await fs.readFile(target, 'utf8');
    if (current !== readme) {
      console.error(`${target} is out of date.`);
      process.exit(1);
    }
    process.stdout.write(`OK: ${target} is up to date.\n`);
    return;
  }

  if (output) {
    const fs = await import('node:fs/promises');
    await fs.writeFile(output, readme, 'utf8');
    return;
  }

  process.stdout.write(readme);
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
