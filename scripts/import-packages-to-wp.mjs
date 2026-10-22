#!/usr/bin/env node
/**
 * Copies the packages in src/data/packages.ts into WordPress through the
 * Flywings Packages plugin, so nobody has to retype them in wp-admin.
 *
 * Run it once after installing the plugin. Running it again updates the
 * same packages (matched by slug) rather than creating copies, so only
 * re-run it if you want WordPress overwritten with the file's version.
 * The six homepage packages are marked "Feature on the homepage" in the
 * same order the homepage shows them today. Prices stay hidden on the
 * website, as they are now.
 *
 * Needs an administrator's application password. Read from .env.local:
 *   WP_API_URL        e.g. https://wp.flywingstour.co.in/wp-json/wp/v2
 *   WP_APP_USER       WordPress username
 *   WP_APP_PASSWORD   application password (Users > Profile > Application Passwords)
 *
 * Usage:
 *   node scripts/import-packages-to-wp.mjs             # publish all
 *   node scripts/import-packages-to-wp.mjs --draft     # import as drafts to review first
 *   node scripts/import-packages-to-wp.mjs --dry-run   # list what would be sent, send nothing
 *   node scripts/import-packages-to-wp.mjs --only dubai-luxury-5n6d,bali-romance-6n7d
 *
 * Needs Node 22.18 or newer (it loads packages.ts directly).
 */

import { existsSync } from "node:fs";

// Node warns that packages.ts has no declared module type. Harmless here,
// and it would bury the useful output, so it is silenced for this load.
process.removeAllListeners("warning");
const { getAllPackages } = await import("../src/data/packages.ts");

// Same six, same order, as LOCAL_FEATURED_SLUGS in src/lib/tours.ts.
const FEATURED_SLUGS = [
  "dubai-luxury-5n6d",
  "thailand-explorer-7n8d",
  "bali-romance-6n7d",
  "kashmir-family-4n5d",
  "maldives-luxury-4n5d",
  "singapore-escape-4n5d",
];

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const asDraft = args.includes("--draft");
const onlyArg = args.indexOf("--only");
const only = onlyArg >= 0 ? new Set((args[onlyArg + 1] ?? "").split(",").filter(Boolean)) : null;

if (existsSync(".env.local")) process.loadEnvFile(".env.local");

const apiUrl = process.env.WP_API_URL || "https://wp.flywingstour.co.in/wp-json/wp/v2";
const root = apiUrl.replace(/\/wp\/v2\/?$/, "");
const user = process.env.WP_APP_USER;
const password = process.env.WP_APP_PASSWORD;

const packages = getAllPackages().filter((p) => !only || only.has(p.slug));
if (packages.length === 0) {
  console.error("No packages matched.");
  process.exit(1);
}

console.log(`${packages.length} package(s) -> ${root}/flywings/v1/import (${asDraft ? "draft" : "publish"})`);
for (const p of packages) {
  console.log(`  ${p.slug}${FEATURED_SLUGS.includes(p.slug) ? "  [homepage]" : ""}`);
}
if (dryRun) {
  console.log("Dry run: nothing sent.");
  process.exit(0);
}
if (!user || !password) {
  console.error("Set WP_APP_USER and WP_APP_PASSWORD (an administrator's application password) in .env.local.");
  process.exit(1);
}

// WordPress lists packages newest first. Sent in one request, all of
// them would get the same publish second and come out in no particular
// order. Sent one at a time, last package first and a second apart, each
// gets its own publish time and the packages page keeps the order of
// packages.ts. (Re-running only updates, which leaves publish times alone.)
const totals = { created: 0, updated: 0, skipped: [] };
for (const [i, pkg] of [...packages].reverse().entries()) {
  if (i > 0) await new Promise((resolve) => setTimeout(resolve, 1100));

  const res = await fetch(`${root}/flywings/v1/import`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Basic " + Buffer.from(`${user}:${password}`).toString("base64"),
    },
    body: JSON.stringify({
      packages: [pkg],
      featuredSlugs: FEATURED_SLUGS,
      status: asDraft ? "draft" : "publish",
    }),
  });

  const body = await res.json().catch(() => null);
  if (!res.ok || !body) {
    console.error(`Import failed at ${pkg.slug}: HTTP ${res.status}`, body?.message ?? "");
    if (res.status === 404) console.error("Is the Flywings Packages plugin installed and active?");
    console.error("Packages sent before this one are saved; re-running is safe.");
    process.exit(1);
  }
  totals.created += body.created.length;
  totals.updated += body.updated.length;
  totals.skipped.push(...body.skipped);
  console.log(`  ${pkg.slug}: ${body.created.length ? "created" : body.updated.length ? "updated" : "skipped"}`);
}

console.log(`Created: ${totals.created}  Updated: ${totals.updated}  Skipped: ${totals.skipped.length}`);
if (totals.skipped.length) console.log("Skipped:", totals.skipped.join(", "));
