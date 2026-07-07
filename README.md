This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `WP_API_URL` | No (defaults to production URL) | Base URL of the headless WordPress REST API, e.g. `https://wp.flywingstour.co.in/wp-json/wp/v2`. Used server-side only by `src/lib/wordpress.ts` to fetch tours (`/tours`) and blog posts (`/posts`). If the "tours" custom post type doesn't exist yet or WordPress is unreachable, `/packages` pages automatically fall back to the local static data in `src/data/packages.ts` — no build/runtime crash. |

**Local development:** already set in `.env.local` (gitignored).

**Vercel:** add the same key under Project Settings → Environment Variables (Production, Preview, and Development) so deployed builds fetch from the same WordPress instance:

```
WP_API_URL=https://wp.flywingstour.co.in/wp-json/wp/v2
```

### WordPress content model this integration expects

No ACF, no custom post type — everything is a regular WordPress **Post**:

- **Tours**: create a category in WP admin with slug `tours` (Posts → Categories) and assign tour posts to it. `/packages` and `/packages/[slug]` pull posts from that category; the post's featured image, title, excerpt and content are used. Until the `tours` category exists (or has no posts), those pages show the local curated packages in `src/data/packages.ts` and switch over automatically via ISR (`revalidate: 300`) once you start publishing.
- **Blog**: any other post (i.e. not in the `tours` category) powers `/blog` and `/blog/[slug]`.
- **SEO**: managed entirely by the **Yoast SEO** plugin — install & activate it on WordPress. Once active, Yoast automatically adds a `yoast_head_json` field (title, meta description) to every post in the REST API response, and this site prefers it over the raw post title/excerpt for page `<title>`/meta description. No extra configuration needed on the frontend side.
