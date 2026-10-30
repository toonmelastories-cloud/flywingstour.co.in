#!/usr/bin/env node
/**
 * Copies the offers in src/data/quotedPackages.ts into WordPress
 * through the Flywings Packages plugin, so nobody has to retype them in
 * wp-admin.
 *
 * Run it once after updating the plugin to the version with the Offers
 * menu. Running it again updates the same offers (matched by slug)
 * rather than creating copies, so only re-run it if you want WordPress
 * overwritten with the file's version.
 *
 * The file stays where it is afterwards: the website falls back to it
 * whenever WordPress has no offers of its own or cannot be reached, so
 * the Offers page is never empty.
 *
 * Needs an administrator's application password. Read from .env.local:
 *   WP_API_URL        e.g. https://wp.flywingstour.co.in/wp-json/wp/v2
 *   WP_APP_USER       WordPress username
 *   WP_APP_PASSWORD   application password (Users > Profile > Application Passwords)
 *
 * Usage:
 *   node scripts/import-offers-to-wp.mjs             # publish all
 *   node scripts/import-offers-to-wp.mjs --draft     # import as drafts to review first
 *   node scripts/import-offers-to-wp.mjs --dry-run   # list what would be sent, send nothing
 *   node scripts/import-offers-to-wp.mjs --only bali-4n5d
 *
 * Once the plugin is installed, WordPress is where offers are added and
 * edited, and quotedPackages.ts is only the fallback for when it cannot
 * be reached. To push a new offer straight into WordPress without
 * touching that file, put it in a JSON file shaped like QuotedPackage
 * (an array, or { "offers": [...] }) and pass it:
 *
 *   node scripts/import-offers-to-wp.mjs --file new-offers.json --dry-run
 *   node scripts/import-offers-to-wp.mjs --file new-offers.json
 *
 * Needs Node 22.18 or newer (it loads quotedPackages.ts directly).
 */

import { existsSync, readFileSync } from "node:fs";

// Node warns that quotedPackages.ts has no declared module type.
// Harmless here, and it would bury the useful output.
process.removeAllListeners("warning");
const { default: quotedPackages } = await import("../src/data/quotedPackages.ts");

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const asDraft = args.includes("--draft");
const onlyArg = args.indexOf("--only");
const only = onlyArg >= 0 ? new Set((args[onlyArg + 1] ?? "").split(",").filter(Boolean)) : null;
const fileArg = args.indexOf("--file");
const file = fileArg >= 0 ? args[fileArg + 1] : null;

/** The offers to send: a JSON file when given, else the fallback data file. */
function source() {
  if (!file) return quotedPackages;
  const parsed = JSON.parse(readFileSync(file, "utf8"));
  const list = Array.isArray(parsed) ? parsed : parsed.offers;
  if (!Array.isArray(list)) {
    console.error(`${file} should hold an array of offers, or { "offers": [...] }.`);
    process.exit(1);
  }
  return list;
}

if (existsSync(".env.local")) process.loadEnvFile(".env.local");

const apiUrl = process.env.WP_API_URL || "https://wp.flywingstour.co.in/wp-json/wp/v2";
const root = apiUrl.replace(/\/wp\/v2\/?$/, "");
const user = process.env.WP_APP_USER;
const password = process.env.WP_APP_PASSWORD;

const offers = source().filter((o) => !only || only.has(o.slug));
if (offers.length === 0) {
  console.error("No offers matched.");
  process.exit(1);
}

console.log(`${offers.length} offer(s) -> ${root}/flywings/v1/offers/import (${asDraft ? "draft" : "publish"})`);
for (const o of offers) {
  console.log(`  ${o.slug.padEnd(34)} ${o.startingPrice.padStart(9)}  ${o.name}`);
}
if (dryRun) {
  console.log("Dry run: nothing sent.");
  process.exit(0);
}
if (!user || !password) {
  console.error("Set WP_APP_USER and WP_APP_PASSWORD (an administrator's application password) in .env.local.");
  process.exit(1);
}

// Sent oldest first, a second apart, so each gets its own publish time
// and the Offers page keeps the order the file has. (Re-running only
// updates, which leaves publish times alone.)
const totals = { created: 0, updated: 0, skipped: [] };
for (const [i, offer] of [...offers].reverse().entries()) {
  if (i > 0) await new Promise((resolve) => setTimeout(resolve, 1100));

  const res = await fetch(`${root}/flywings/v1/offers/import`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Basic " + Buffer.from(`${user}:${password}`).toString("base64"),
    },
    body: JSON.stringify({
      offers: [offer],
      status: asDraft ? "draft" : "publish",
    }),
  });

  const body = await res.json().catch(() => null);
  if (!res.ok || !body) {
    console.error(`Import failed at ${offer.slug}: HTTP ${res.status}`, body?.message ?? "");
    if (res.status === 404) {
      console.error("Is the Flywings Packages plugin installed, active, and version 1.1.0 or newer?");
    }
    console.error("Offers sent before this one are saved; re-running is safe.");
    process.exit(1);
  }
  totals.created += body.created.length;
  totals.updated += body.updated.length;
  totals.skipped.push(...body.skipped);
  console.log(`  ${offer.slug}: ${body.created.length ? "created" : body.updated.length ? "updated" : "skipped"}`);
}

console.log(`Created: ${totals.created}  Updated: ${totals.updated}  Skipped: ${totals.skipped.length}`);
if (totals.skipped.length) console.log("Skipped:", totals.skipped.join(", "));
