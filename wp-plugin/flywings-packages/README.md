# Flywings Packages (WordPress plugin)

Adds a **Packages** menu to WordPress. A package added there appears on
flywingstour.co.in in the site's own design: the packages page, its own
detail page, the homepage (when featured), the Offers page (when on
offer), the India or International tours page, and the sitemap.

WordPress only stores the packages. The website (this repo) reads them
from `/wp-json/flywings/v1/` and renders them; see `src/lib/tours.ts`.

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
4. Optional, once: copy the packages that are hard-coded in
   `src/data/packages.ts` into WordPress, so nobody retypes them:

   ```
   node scripts/import-packages-to-wp.mjs --dry-run   # check first
   node scripts/import-packages-to-wp.mjs
   ```

   It uses `WP_APP_USER` / `WP_APP_PASSWORD` from `.env.local` (an
   administrator's application password).

The website keeps working before any of this: a package WordPress does
not have is read from `src/data/packages.ts`.

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

## Editing the editor

The editor is `src/admin.jsx`, compiled to `assets/admin.js` (that file
is what WordPress loads, so commit it after a change). It uses
WordPress's own React and components, so it is built with the classic
JSX transform and no bundled React:

```
npx esbuild@0.25.10 src/admin.jsx --bundle --outfile=assets/admin.js \
  --jsx=transform --jsx-factory=wp.element.createElement \
  --jsx-fragment=wp.element.Fragment --tsconfig-raw={} \
  --target=es2019 --minify --legal-comments=none
```

Run it from this folder. `--tsconfig-raw={}` matters: without it esbuild
reads the website's tsconfig and bundles React 19's JSX runtime, which
breaks the editor on WordPress's React 18.

## Files

- `includes/class-fwp-data.php`: the package fields, cleaning, publish
  checks, and the JSON the website reads.
- `includes/class-fwp-post-type.php`: the Packages menu, Destinations
  and Trip Types, list columns, Duplicate.
- `includes/class-fwp-admin.php`: the edit screen, saving and the
  publish guard.
- `includes/class-fwp-rest.php`: the website API and the importer.
- `includes/class-fwp-sync.php`: refreshes the website when a live
  package changes, and remembers removed packages for redirects.
- `includes/class-fwp-settings.php`: Packages > Settings.
