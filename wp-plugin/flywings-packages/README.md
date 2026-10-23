# Flywings Packages (WordPress plugin)

Adds **Packages** and **Offers** menus to WordPress.

A package appears on flywingstour.co.in in the site's own design: the
packages page, its own detail page, the homepage (when featured), the
Offers page (when on offer), the India or International tours page, and
the sitemap.

An **offer** is a rate being quoted now for a trip with no package page
of its own, such as the Vietnam circuits or a supplier's one-off Kuala
Lumpur price. It appears on the Offers page only. A package that goes on
offer does not belong here: switch it on in the package editor's
**Visibility & Offer** tab instead.

WordPress only stores them. The website (this repo) reads them from
`/wp-json/flywings/v1/` and renders them; see `src/lib/tours.ts`.

## Install

1. Zip the `flywings-packages` folder (the zip must contain the folder,
   not just its files).
2. WordPress admin > Plugins > Add New Plugin > Upload Plugin > choose
   the zip > Install Now > Activate.
3. Packages > Settings:
   - **Website address**: `https://www.flywingstour.co.in`
   - **Refresh secret**: the same value as `REVALIDATE_SECRET` in the
     website's Vercel environment variables. Or put
     `define( 'FWP_REVALIDATE_SECRET', '...' );` in `wp-config.php`.
   - Click **Refresh the website now**. It should say "Website refreshed".
4. Optional, once: copy the packages and offers that are hard-coded in
   the website into WordPress, so nobody retypes them:

   ```
   node scripts/import-packages-to-wp.mjs --dry-run   # check first
   node scripts/import-packages-to-wp.mjs

   node scripts/import-offers-to-wp.mjs --dry-run
   node scripts/import-offers-to-wp.mjs
   ```

   They use `WP_APP_USER` / `WP_APP_PASSWORD` from `.env.local` (an
   administrator's application password).

The website keeps working before any of this: a package WordPress does
not have is read from `src/data/packages.ts`, and while WordPress has no
offers of its own the Offers page falls back to
`src/data/quotedPackages.ts`.

## What the editor does

- One screen with tabs: Basics, Photos, Overview, Itinerary,
  Inclusions, Hotels, Pricing, FAQs & Policy, Google (SEO),
  Visibility & Offer. A dot on each tab shows red (must fix),
  amber (suggestion) or green.
- A live card preview and a checklist in the sidebar. Publish is
  blocked while anything red is left. On the server, a package missing
  required details is saved as a draft instead of going live, and an edit
  that would break a live package is not saved (the live page stays as it
  was and the editor reopens with the edits).
- Itinerary: one day card per day from the number of nights; paste a
  whole itinerary from WhatsApp, Word or an email ("Day 1: ...") and it
  is split into days; drag or arrow buttons to reorder; duplicate a day.
- Lists (activities, inclusions, policy): Enter adds the next line,
  pasting several lines adds them all, quick-add chips for common items
  (edit the chips in Settings).
- Preview on website before publishing, Duplicate a package, revisions,
  scheduled publishing.
- Prices are hidden on the website unless "Show the price on the
  website" is on, matching how the site works today.
- Private link packages (a custom quote for one client): the page works
  but is kept out of listings and Google.
- Renamed packages redirect from the old link; removed packages redirect
  to their destination page.

## What the offer editor does

- One screen with tabs: Basics, Photo, Days & Inclusions, Price &
  Saving, Visibility. Same dots, checklist, card preview and publish
  guard as the package editor.
- **Price & Saving** is the part worth knowing. Turning on "Compare this
  rate with one of our packages" picks a published package from a list,
  fills in its price, and prints the saving on the card linked to that
  package so a visitor can check the figure. The "same trip at the same
  length" switch is deliberate: with it off the card only points at the
  other package, because calling a shorter or lower-grade trip a saving
  claims a discount nobody gave.
- **Hold the rate until** takes the offer off the website by itself the
  day after. An expired price on a live page is worse than a short
  Offers page.
- Paste a whole itinerary ("Day 1: ...") and it is split into one line
  per day. Duplicate an offer to build next season's from this one.

## Editing the editors

There are two: `src/admin.jsx` for packages, compiled to
`assets/admin.js`, and `src/offer-admin.jsx` for offers, compiled to
`assets/offer-admin.js`. Those compiled files are what WordPress loads,
so commit them after a change. Both use WordPress's own React and
components, so they are built with the classic JSX transform and no
bundled React:

```
npx esbuild@0.25.10 src/admin.jsx --bundle --outfile=assets/admin.js   --jsx=transform --jsx-factory=wp.element.createElement   --jsx-fragment=wp.element.Fragment --tsconfig-raw={}   --target=es2019 --minify --legal-comments=none

npx esbuild@0.25.10 src/offer-admin.jsx --bundle --outfile=assets/offer-admin.js   --jsx=transform --jsx-factory=wp.element.createElement   --jsx-fragment=wp.element.Fragment --tsconfig-raw={}   --target=es2019 --minify --legal-comments=none
```

Run them from this folder. `--tsconfig-raw={}` matters: without it
esbuild reads the website's tsconfig and bundles React 19's JSX runtime,
which breaks the editor on WordPress's React 18.

The two editors share a stylesheet (`assets/admin.css`) but each keeps
its own copy of the small building blocks (Section, Field, ListEditor
and so on). That duplication is deliberate for now: `admin.jsx` is the
live package editor and cannot be exercised outside WordPress, so it was
left untouched. Worth lifting into one module next time it is opened.

## Files

- `includes/class-fwp-data.php`: the package fields, cleaning, publish
  checks, and the JSON the website reads.
- `includes/class-fwo-data.php`: the same for an offer.
- `includes/class-fwo-post-type.php`: the Offers menu, list columns,
  Duplicate.
- `includes/class-fwo-admin.php`: the offer edit screen, saving and the
  publish guard.
- `includes/class-fwp-post-type.php`: the Packages menu, Destinations
  and Trip Types, list columns, Duplicate.
- `includes/class-fwp-admin.php`: the edit screen, saving and the
  publish guard.
- `includes/class-fwp-rest.php`: the website API and the importer.
- `includes/class-fwp-sync.php`: refreshes the website when a live
  package changes, and remembers removed packages for redirects.
- `includes/class-fwp-settings.php`: Packages > Settings.
