/**
 * Headless WordPress API client — Plug-and-Play Backend Layer
 *
 * Talks to the WP REST API at WP_API_URL (defaults to the production
 * WordPress install). Every function fails soft: on network errors,
 * non-2xx responses (including 404 when a category/endpoint doesn't
 * exist yet), or malformed JSON, it resolves to `null` instead of
 * throwing — so pages can fall back to static content and builds
 * never crash because WordPress isn't ready yet.
 *
 * Content model: tours and blog articles are both plain WordPress
 * Posts (no ACF, no custom post type). Tours are simply posts assigned
 * to a category whose slug is TOURS_CATEGORY_SLUG (create it in
 * WP admin and tag tour posts with it). SEO title/description are
 * managed entirely by the Yoast SEO plugin, which — once installed and
 * active — automatically adds a `yoast_head_json` field to every post
 * in the REST API response. No extra plugin/config needed for that.
 */

const WP_API_URL = process.env.WP_API_URL || "https://wp.flywingstour.co.in/wp-json/wp/v2";
const TOURS_CATEGORY_SLUG = "tours";
const REVALIDATE_SECONDS = 300;

// Vercel's data cache has been observed serving expired entries across
// deployments, so cache keys are versioned per deploy: every build
// fetches fresh WP data. WP REST ignores the extra query param.
const CACHE_VERSION = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 8) ?? "dev";

export interface WPRendered {
  rendered: string;
}

/** Populated automatically by the Yoast SEO plugin on every REST post response. */
export interface WPYoastHead {
  title?: string;
  description?: string;
  og_title?: string;
  og_description?: string;
  og_image?: Array<{ url: string; width?: number; height?: number }>;
}

export interface WPPost {
  id: number;
  slug: string;
  date: string;
  modified?: string;
  title: WPRendered;
  content: WPRendered;
  excerpt: WPRendered;
  categories?: number[];
  yoast_head_json?: WPYoastHead;
  _embedded?: {
    "wp:featuredmedia"?: Array<{ source_url: string }>;
    "wp:term"?: Array<Array<{ id: number; name: string; slug: string }>>;
  };
}

interface WpFetchOptions {
  /**
   * Bypass the Next data cache entirely.
   *
   * Route-level `dynamic = "force-dynamic"` does not win against an
   * explicit `next: { revalidate }` on the fetch itself, so the sitemap
   * and feed kept serving whatever was cached at build time even after
   * they were made dynamic. Those two routes pass `fresh` so the post
   * list is always read live from WordPress.
   */
  fresh?: boolean;
}

async function wpFetch<T>(
  path: string,
  { fresh = false }: WpFetchOptions = {}
): Promise<T | null> {
  const url = `${WP_API_URL}${path}${path.includes("?") ? "&" : "?"}_v=${CACHE_VERSION}`;
  try {
    const res = await fetch(url, {
      // Tagged so /api/revalidate can invalidate every WP-derived page
      // on demand (a WordPress save_post hook pings that endpoint).
      // Time-based revalidation alone proved unreliable on Vercel for
      // build-time-seeded entries.
      ...(fresh
        ? { cache: "no-store" as const }
        : { next: { revalidate: REVALIDATE_SECONDS, tags: ["wordpress"] } }),
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      // Includes 404 (category / endpoint doesn't exist yet)
      return null;
    }

    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) return null;

    return (await res.json()) as T;
  } catch {
    // Network unreachable, DNS failure, timeout, etc. — fail soft.
    return null;
  }
}

/** Resolves a category slug to its numeric WP term ID, or null if it doesn't exist / WP is unreachable. */
async function getCategoryIdBySlug(
  slug: string,
  options?: WpFetchOptions
): Promise<number | null> {
  const categories = await wpFetch<Array<{ id: number; slug: string }>>(
    `/categories?slug=${encodeURIComponent(slug)}`,
    options
  );
  return categories && categories.length > 0 ? categories[0].id : null;
}

/**
 * All published tours — posts tagged with the `tours` category.
 * Returns null (triggering local fallback) if that category doesn't
 * exist yet or WordPress is unreachable.
 */
export async function getTours(): Promise<WPPost[] | null> {
  const categoryId = await getCategoryIdBySlug(TOURS_CATEGORY_SLUG);
  if (categoryId === null) return null;
  // orderby=date&order=desc are the WP REST defaults, so they're omitted.
  return wpFetch<WPPost[]>(`/posts?categories=${categoryId}&_embed&per_page=50`);
}

/** A single tour by slug — must actually belong to the `tours` category, otherwise null. */
export async function getTourBySlug(slug: string): Promise<WPPost | null> {
  const categoryId = await getCategoryIdBySlug(TOURS_CATEGORY_SLUG);
  if (categoryId === null) return null;

  const posts = await wpFetch<WPPost[]>(`/posts?slug=${encodeURIComponent(slug)}&_embed`);
  const post = posts && posts.length > 0 ? posts[0] : null;
  if (!post || !post.categories?.includes(categoryId)) return null;
  return post;
}

/**
 * All published blog posts, excluding anything tagged `tours` so the
 * two content types don't mix in listings.
 */
export async function getPosts(
  options?: WpFetchOptions
): Promise<WPPost[] | null> {
  const categoryId = await getCategoryIdBySlug(TOURS_CATEGORY_SLUG, options);
  const exclude = categoryId !== null ? `&categories_exclude=${categoryId}` : "";
  return wpFetch<WPPost[]>(`/posts?_embed&per_page=100${exclude}`, options);
}

/** Just what the sitemap needs about a post. */
export interface WPPostRef {
  slug: string;
  date: string;
  modified?: string;
}

/**
 * Slim post list for the sitemap.
 *
 * `getPosts()` asks for `_embed`, which pulls featured images, authors
 * and terms for every post and currently returns about 2.8 MB. The
 * sitemap needs three fields. Requesting only those keeps the response
 * a few kilobytes, well under the size at which Next stops caching a
 * response, and makes the route fast enough to render per request.
 *
 * Read fresh on every call: a sitemap that lags behind what is
 * published is worse than no sitemap, because Google trusts it.
 */
export async function getPostRefs(): Promise<WPPostRef[] | null> {
  const categoryId = await getCategoryIdBySlug(TOURS_CATEGORY_SLUG, {
    fresh: true,
  });
  const exclude = categoryId !== null ? `&categories_exclude=${categoryId}` : "";
  return wpFetch<WPPostRef[]>(
    `/posts?per_page=100&_fields=slug,date,modified${exclude}`,
    { fresh: true }
  );
}

/** A single blog post by slug (any category), or null if not found / WP unreachable. */
export async function getPostBySlug(slug: string): Promise<WPPost | null> {
  const posts = await wpFetch<WPPost[]>(`/posts?slug=${encodeURIComponent(slug)}&_embed`);
  return posts && posts.length > 0 ? posts[0] : null;
}

/** Best-effort featured image URL extraction from an embedded WP post. */
export function getFeaturedImageUrl(post: WPPost): string | undefined {
  return post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
}

/**
 * Yoast-managed SEO title/description/OG image, when the Yoast SEO plugin
 * is active. Yoast emits these values HTML-encoded (the site-name suffix
 * turns "&" into "&#038;"/"&amp;"); metadata consumers re-escape on render,
 * so decode here or titles show a literal "&amp;" in tabs and link previews.
 */
export function getYoastMeta(post: WPPost): {
  title?: string;
  description?: string;
  ogImage?: string;
} {
  const decode = (s: string | undefined) =>
    s === undefined
      ? undefined
      : s
          .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
          .replace(/&amp;/g, "&")
          .replace(/&quot;/g, '"')
          .replace(/&#039;|&apos;/g, "'")
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&nbsp;/g, " ");

  return {
    title: decode(post.yoast_head_json?.title),
    description: decode(post.yoast_head_json?.description),
    ogImage: post.yoast_head_json?.og_image?.[0]?.url,
  };
}
