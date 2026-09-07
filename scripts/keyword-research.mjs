#!/usr/bin/env node
/**
 * Free keyword discovery for flywingstour.co.in.
 *
 * Expands a small set of seed phrases into the queries people actually
 * type, using Google's public autocomplete endpoint. No API key, no
 * account, no cost, and the suggestions are real user queries rather
 * than a tool's guess at them.
 *
 * What this does NOT produce is monthly search volume. Only Google and
 * Bing hold that data and neither exposes it for free. Get volume from
 * Bing Webmaster Tools (free, real numbers, no ad spend needed) or
 * Google Keyword Planner (free, but shows ranges like "1K-10K" unless
 * an ad campaign is running). Use this tool to find the queries, then
 * look up volume for the shortlist.
 *
 * Usage:
 *   node scripts/keyword-research.mjs
 *   node scripts/keyword-research.mjs --gsc path/to/gsc-queries.csv
 *   node scripts/keyword-research.mjs --seeds "spiti tour,ladakh package"
 *   node scripts/keyword-research.mjs --quick        # base + questions only
 *
 * Output (written to keyword-research/):
 *   keywords-<date>.csv      every query, intent, and whether we rank
 *   keywords-<date>.json     same data for further processing
 *   report-<date>.html       browsable report for the marketing team
 *
 * The GSC export is optional but makes the output far more useful: it
 * marks which queries the site already appears for and which are gaps.
 * Export it from Search Console: Performance > Queries > Export > CSV.
 */

import { writeFile, mkdir, readFile } from "node:fs/promises";
import path from "node:path";

// ─── Configuration ──────────────────────────────────────────────

/**
 * Seeds for this business specifically: the two service lines that
 * actually generate enquiries (packages and visa/ticketing), plus the
 * local-intent phrases that feed the Google Business Profile work.
 */
const DEFAULT_SEEDS = [
  // Local commercial intent, the highest-value cluster
  "travel agent in chandigarh",
  "travel agent in mohali",
  "tour and travel company in chandigarh",
  "visa consultant in chandigarh",
  "visa agent in mohali",
  "corporate travel agency chandigarh",

  // Package intent from the departure city
  "tour package from chandigarh",
  "international tour package from chandigarh",
  "honeymoon package from chandigarh",
  "family tour package from chandigarh",

  // Ticketing
  "flight booking agent in chandigarh",
  "cheap flights from chandigarh",
  "international flights from amritsar",

  // Destinations the agency actually sells
  "dubai tour package from chandigarh",
  "kashmir tour package",
  "thailand tour package from india",
  "bali tour package from india",
  "maldives package from india",
  "vietnam tour package from india",
  "singapore tour package from india",
];

/** Google autocomplete. `gl=in` and `hl=en` keep results Indian. */
const SUGGEST_URL =
  "https://suggestqueries.google.com/complete/search?client=firefox&hl=en&gl=in&q=";

/** Politeness settings. Google tolerates this happily; do not raise them. */
const CONCURRENCY = 3;
const DELAY_MS = 180;

const ALPHABET = "abcdefghijklmnopqrstuvwxyz".split("");
const DIGITS = "0123456789".split("");

/**
 * Prefixes that surface question-shaped queries, which is where the
 * blog content competes, and suffixes that surface buying-shaped ones,
 * which is where the money is. Both matter, and the audit showed this
 * site is heavily skewed to the first.
 */
const QUESTION_PREFIXES = [
  "how to", "how much", "what is", "which", "when to",
  "where to", "why", "is", "can i", "do i need",
];

const COMMERCIAL_SUFFIXES = [
  "price", "cost", "booking", "near me", "contact number",
  "best", "cheapest", "reviews", "with flight", "for family",
  "for couple", "packages", "quotation", "offers",
];

// ─── Intent classification ──────────────────────────────────────

/**
 * Intent buckets, ordered most to least commercially valuable.
 *
 * The Sep 2026 audit found 60.7% of ranking keywords informational and
 * only 3.6% transactional, which is why every query here gets labelled:
 * the point of the exercise is finding the buying-intent queries that
 * are currently missing, not adding more article ideas.
 */
const INTENT_RULES = [
  {
    intent: "transactional",
    note: "Ready to book or call",
    patterns: [
      /\bnear me\b/, /\bcontact\b/, /\bnumber\b/, /\bbook(ing)?\b/,
      /\bprice\b/, /\bcost\b/, /\bcharges?\b/, /\bquotation\b/, /\bquote\b/,
      /\bcheap(est)?\b/, /\boffers?\b/, /\bdeals?\b/, /\bagent\b/,
      /\bagency\b/, /\bconsultant\b/, /\bfees?\b/,
    ],
  },
  {
    intent: "commercial",
    note: "Comparing options",
    patterns: [
      /\bbest\b/, /\btop\b/, /\bvs\b/, /\bor\b/, /\breviews?\b/,
      /\bcompare\b/, /\bpackages?\b/, /\bitinerary\b/, /\bwith flight\b/,
      /\bfor (family|couple|honeymoon|group)\b/, /\bwhich\b/,
    ],
  },
  {
    intent: "informational",
    note: "Researching",
    patterns: [
      /^how\b/, /^what\b/, /^why\b/, /^when\b/, /^where\b/, /^is\b/,
      /^can\b/, /^do\b/, /\bguide\b/, /\btips?\b/, /\bdocuments?\b/,
      /\brequirements?\b/, /\bweather\b/, /\bbest time\b/, /\bvisa (rules|process)\b/,
    ],
  },
];

function classifyIntent(query) {
  for (const rule of INTENT_RULES) {
    if (rule.patterns.some((p) => p.test(query))) return rule.intent;
  }
  // A bare "<destination> tour package" with no qualifier is someone
  // shopping, not researching.
  return "commercial";
}

/**
 * Queries that look commercial but bring the wrong person.
 *
 * "travel agent jobs in mohali" and "how to become a travel agent" rank
 * as transactional on wording alone, but the searcher wants employment
 * or a franchise, not a holiday. Left in, they pad the priority list
 * with keywords that can never produce an enquiry.
 */
const NOISE_PATTERNS = [
  /\bjobs?\b/, /\bsalary\b/, /\bvacancy|vacancies\b/, /\brecruitment\b/,
  /\bhiring\b/, /\bcareer\b/, /\binternship\b/,
  /\bcourse\b/, /\btraining\b/, /\binstitute\b/, /\bdiploma\b/,
  /\bhow to (become|start|open)\b/, /\bfranchise\b/,
  /\b(iata|tafi|iato) (course|certification|exam)\b/,
  /\blicen[sc]e\b/, /\bregistration process\b/,
  /\bsoftware\b/, /\bcrm\b/, /\bwebsite template\b/,
];

function isNoise(query) {
  return NOISE_PATTERNS.some((p) => p.test(query));
}

/** Rough local-intent flag: these feed the Google Business Profile work. */
function isLocal(query) {
  return /\b(chandigarh|mohali|panchkula|zirakpur|kharar|tricity|punjab|amritsar|ludhiana|near me)\b/.test(
    query
  );
}

// ─── Fetching ───────────────────────────────────────────────────

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchSuggestions(query) {
  try {
    const res = await fetch(SUGGEST_URL + encodeURIComponent(query), {
      headers: {
        // The endpoint returns an empty list to requests that do not
        // look like a browser.
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36",
        Accept: "*/*",
      },
    });
    if (!res.ok) return [];
    const body = await res.json();
    // Shape: [originalQuery, [suggestion, ...], ...]
    return Array.isArray(body?.[1]) ? body[1] : [];
  } catch {
    // One failed variant must not abort a run of several hundred.
    return [];
  }
}

/** Runs `worker` over `items` with a small concurrency cap and a delay. */
async function mapLimit(items, limit, worker, onProgress) {
  const results = [];
  let index = 0;
  let done = 0;

  async function run() {
    while (index < items.length) {
      const i = index++;
      results[i] = await worker(items[i]);
      done++;
      onProgress?.(done, items.length);
      await sleep(DELAY_MS);
    }
  }

  await Promise.all(Array.from({ length: limit }, run));
  return results;
}

/** Every variant of a seed we ask Google about. */
function buildVariants(seed, quick) {
  const variants = [seed];
  for (const p of QUESTION_PREFIXES) variants.push(`${p} ${seed}`);
  for (const s of COMMERCIAL_SUFFIXES) variants.push(`${seed} ${s}`);
  if (!quick) {
    for (const letter of ALPHABET) variants.push(`${seed} ${letter}`);
    for (const digit of DIGITS) variants.push(`${seed} ${digit}`);
  }
  return variants;
}

// ─── Search Console cross-reference ─────────────────────────────

/**
 * Parses a Search Console query export.
 *
 * GSC exports a CSV whose first column is the query and which usually
 * carries Clicks / Impressions / CTR / Position. Column names differ by
 * locale, so this reads by position after locating the header row, and
 * tolerates a UTF-8 BOM and quoted fields.
 */
async function loadGscQueries(filePath) {
  const raw = await readFile(filePath, "utf8");
  const lines = raw.replace(/^﻿/, "").split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return new Map();

  const map = new Map();
  for (const line of lines.slice(1)) {
    const cells = splitCsvLine(line);
    const query = (cells[0] || "").trim().toLowerCase();
    if (!query) continue;
    map.set(query, {
      clicks: Number(cells[1]) || 0,
      impressions: Number(cells[2]) || 0,
      position: Number(String(cells[4] ?? cells[3]).replace(",", ".")) || null,
    });
  }
  return map;
}

function splitCsvLine(line) {
  const out = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { cur += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (ch === "," && !inQuotes) {
      out.push(cur); cur = "";
    } else cur += ch;
  }
  out.push(cur);
  return out;
}

// ─── Output ─────────────────────────────────────────────────────

function toCsv(rows) {
  const header = [
    "keyword", "intent", "local", "seed", "already_ranking",
    "gsc_impressions", "gsc_clicks", "gsc_position", "words",
  ];
  const escape = (v) => {
    const s = String(v ?? "");
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [
    header.join(","),
    ...rows.map((r) =>
      [
        r.keyword, r.intent, r.local ? "yes" : "no", r.seed,
        r.ranking ? "yes" : "no", r.impressions ?? "", r.clicks ?? "",
        r.position ?? "", r.words,
      ].map(escape).join(",")
    ),
  ].join("\n");
}

function buildHtmlReport(rows, meta) {
  const counts = rows.reduce((acc, r) => {
    acc[r.intent] = (acc[r.intent] || 0) + 1;
    return acc;
  }, {});
  const gaps = rows.filter((r) => !r.ranking);
  const priority = rows
    .filter((r) => !r.ranking && r.intent !== "informational")
    .sort((a, b) => Number(b.local) - Number(a.local) || a.words - b.words);

  const pct = (n) => ((n / (rows.length || 1)) * 100).toFixed(1);

  const row = (r) => `<tr>
    <td>${escapeHtml(r.keyword)}</td>
    <td><span class="tag t-${r.intent}">${r.intent}</span></td>
    <td>${r.local ? '<span class="tag t-local">local</span>' : ""}</td>
    <td class="num">${r.impressions ?? "-"}</td>
    <td class="num">${r.position ? r.position.toFixed(1) : "-"}</td>
  </tr>`;

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Flywings Keyword Research</title>
<style>
:root{--bg:#f4f6f8;--surface:#fff;--ink:#0e1f2d;--ink2:#4b6275;--ink3:#7a8fa1;--line:#d3dde5;--accent:#0b4f6c;--t:#9b2a21;--c:#8a5d06;--i:#17654a}
@media(prefers-color-scheme:dark){:root{--bg:#0a141c;--surface:#111e28;--ink:#e3ecf2;--ink2:#93a9b9;--ink3:#6b8296;--line:#23343f;--accent:#62b6d6;--t:#e37c6c;--c:#dba845;--i:#58c295}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.6 system-ui,-apple-system,Segoe UI,sans-serif}
.wrap{max-width:1060px;margin:0 auto;padding:36px 22px 80px}
h1{font-size:1.9rem;margin:0 0 6px}h2{font-size:1.15rem;margin:38px 0 12px}
.sub{color:var(--ink2);margin:0 0 4px}.meta{color:var(--ink3);font-size:.82rem;font-family:ui-monospace,monospace}
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:1px;background:var(--line);border:1px solid var(--line);border-radius:3px;overflow:hidden;margin:22px 0}
.card{background:var(--surface);padding:14px 16px}
.card b{display:block;font-size:1.5rem;font-family:ui-monospace,monospace;line-height:1.1}
.card span{font-size:.78rem;color:var(--ink3)}
.note{background:var(--surface);border:1px solid var(--line);border-left:3px solid var(--accent);border-radius:3px;padding:16px 18px;margin:20px 0;color:var(--ink2);font-size:.93rem}
.scroll{overflow-x:auto;border:1px solid var(--line);border-radius:3px;background:var(--surface)}
table{border-collapse:collapse;width:100%;min-width:560px;font-size:.88rem}
th{text-align:left;font-size:.7rem;letter-spacing:.08em;text-transform:uppercase;color:var(--ink3);padding:10px 14px;border-bottom:1px solid var(--line);white-space:nowrap}
td{padding:9px 14px;border-bottom:1px solid var(--line);color:var(--ink2)}
tr:last-child td{border-bottom:0}
td.num{font-family:ui-monospace,monospace;text-align:right}
.tag{display:inline-block;font-size:.68rem;text-transform:uppercase;letter-spacing:.04em;padding:2px 7px;border-radius:2px;font-family:ui-monospace,monospace}
.t-transactional{background:color-mix(in srgb,var(--t) 16%,transparent);color:var(--t)}
.t-commercial{background:color-mix(in srgb,var(--c) 18%,transparent);color:var(--c)}
.t-informational{background:color-mix(in srgb,var(--i) 16%,transparent);color:var(--i)}
.t-local{background:color-mix(in srgb,var(--accent) 16%,transparent);color:var(--accent)}
</style></head><body><div class="wrap">
<h1>Keyword research</h1>
<p class="sub">Real queries from Google autocomplete, India-targeted, grouped by buying intent.</p>
<p class="meta">Generated ${meta.date} &middot; ${meta.seeds} seeds &middot; ${meta.requests} lookups &middot; ${rows.length} unique keywords${meta.gscFile ? ` &middot; cross-referenced against ${escapeHtml(meta.gscFile)}` : ""}</p>

<div class="cards">
  <div class="card"><b>${rows.length}</b><span>unique keywords</span></div>
  <div class="card"><b style="color:var(--t)">${counts.transactional || 0}</b><span>transactional ${pct(counts.transactional || 0)}%</span></div>
  <div class="card"><b style="color:var(--c)">${counts.commercial || 0}</b><span>commercial ${pct(counts.commercial || 0)}%</span></div>
  <div class="card"><b style="color:var(--i)">${counts.informational || 0}</b><span>informational ${pct(counts.informational || 0)}%</span></div>
  <div class="card"><b>${rows.filter((r) => r.local).length}</b><span>local intent</span></div>
  <div class="card"><b>${gaps.length}</b><span>not ranking yet</span></div>
</div>

<div class="note"><strong>No search volume here, by design.</strong> Only Google and Bing hold volume data and neither gives it away. Take the shortlist below into <strong>Bing Webmaster Tools &rarr; Keyword Research</strong> (free, real numbers, no ad spend) or Google Keyword Planner (free, shows ranges) to attach volume. This tool answers "what do people actually type", which those tools are bad at.</div>

<h2>Priority: buying intent, not ranking yet</h2>
<p class="sub">Commercial and transactional queries the site does not currently appear for, shortest and most local first. This is the working list.</p>
<div class="scroll"><table>
<thead><tr><th>Keyword</th><th>Intent</th><th></th><th>Impr.</th><th>Pos.</th></tr></thead>
<tbody>${priority.slice(0, 120).map(row).join("")}</tbody>
</table></div>

<h2>Everything found</h2>
<div class="scroll"><table>
<thead><tr><th>Keyword</th><th>Intent</th><th></th><th>Impr.</th><th>Pos.</th></tr></thead>
<tbody>${rows.slice(0, 500).map(row).join("")}</tbody>
</table></div>
${rows.length > 500 ? `<p class="meta" style="margin-top:10px">Showing first 500. Full list is in the CSV.</p>` : ""}
</div></body></html>`;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );
}

// ─── Main ───────────────────────────────────────────────────────

function parseArgs(argv) {
  const args = { quick: false, gsc: null, seeds: null };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--quick") args.quick = true;
    else if (argv[i] === "--gsc") args.gsc = argv[++i];
    else if (argv[i] === "--seeds") args.seeds = argv[++i];
  }
  return args;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const seeds = args.seeds
    ? args.seeds.split(",").map((s) => s.trim()).filter(Boolean)
    : DEFAULT_SEEDS;

  let gsc = new Map();
  if (args.gsc) {
    try {
      gsc = await loadGscQueries(args.gsc);
      console.log(`Loaded ${gsc.size} queries from ${args.gsc}`);
    } catch (err) {
      console.warn(`Could not read GSC export (${err.message}); continuing without it.`);
    }
  }

  const jobs = [];
  for (const seed of seeds) {
    for (const variant of buildVariants(seed, args.quick)) {
      jobs.push({ seed, variant });
    }
  }

  console.log(`${seeds.length} seeds, ${jobs.length} lookups. This takes a few minutes.`);

  let lastLogged = 0;
  const responses = await mapLimit(
    jobs,
    CONCURRENCY,
    async (job) => ({ seed: job.seed, suggestions: await fetchSuggestions(job.variant) }),
    (done, total) => {
      const pct = Math.floor((done / total) * 100);
      if (pct >= lastLogged + 10) {
        lastLogged = pct;
        process.stdout.write(`  ${pct}% (${done}/${total})\n`);
      }
    }
  );

  // Dedupe, keeping the first seed that surfaced each keyword.
  const seen = new Map();
  let dropped = 0;
  for (const { seed, suggestions } of responses) {
    for (const raw of suggestions) {
      const keyword = String(raw).trim().toLowerCase();
      if (!keyword || seen.has(keyword)) continue;
      if (isNoise(keyword)) { dropped++; continue; }
      const hit = gsc.get(keyword);
      seen.set(keyword, {
        keyword,
        seed,
        intent: classifyIntent(keyword),
        local: isLocal(keyword),
        words: keyword.split(/\s+/).length,
        ranking: Boolean(hit),
        impressions: hit?.impressions ?? null,
        clicks: hit?.clicks ?? null,
        position: hit?.position ?? null,
      });
    }
  }

  const order = { transactional: 0, commercial: 1, informational: 2 };
  const rows = [...seen.values()].sort(
    (a, b) =>
      order[a.intent] - order[b.intent] ||
      Number(b.local) - Number(a.local) ||
      a.keyword.localeCompare(b.keyword)
  );

  const date = new Date().toISOString().slice(0, 10);
  const outDir = path.join(process.cwd(), "keyword-research");
  await mkdir(outDir, { recursive: true });

  const meta = {
    date,
    seeds: seeds.length,
    requests: jobs.length,
    gscFile: args.gsc ? path.basename(args.gsc) : null,
  };

  await writeFile(path.join(outDir, `keywords-${date}.csv`), toCsv(rows), "utf8");
  await writeFile(
    path.join(outDir, `keywords-${date}.json`),
    JSON.stringify({ meta, rows }, null, 2),
    "utf8"
  );
  await writeFile(
    path.join(outDir, `report-${date}.html`),
    buildHtmlReport(rows, meta),
    "utf8"
  );

  const counts = rows.reduce((a, r) => ((a[r.intent] = (a[r.intent] || 0) + 1), a), {});
  console.log(`\nDone. ${rows.length} unique keywords.`);
  console.log(
    `  transactional ${counts.transactional || 0} | commercial ${counts.commercial || 0} | informational ${counts.informational || 0}`
  );
  console.log(`  local intent: ${rows.filter((r) => r.local).length}`);
  console.log(`  dropped as noise (jobs/courses/franchise): ${dropped}`);
  if (gsc.size) console.log(`  not ranking yet: ${rows.filter((r) => !r.ranking).length}`);
  console.log(`\nWritten to ${outDir}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
