/**
 * Headless WordPress API client — Plug-and-Play Backend Layer
 *
 * Talks to the WP REST API at WP_API_URL (defaults to the production
 * WordPress install). Every function fails soft: on network errors,
 * non-2xx responses (including 404 when a custom post type/endpoint
 * doesn't exist yet), or malformed JSON, it resolves to `null` instead
 * of throwing — so pages can fall back to static content and builds
 * never crash because WordPress isn't ready yet.
 */

const WP_API_URL = process.env.WP_API_URL || "https://wp.flywingstour.co.in/wp-json/wp/v2";

const REVALIDATE_SECONDS = 300;

export interface WPRendered {
  rendered: string;
}

export interface WPTourACF {
  price?: string;
  duration?: string;
  destination?: string;
  itinerary?: string;
  gallery?: string[];
}

export interface WPTour {
  id: number;
  slug: string;
  date: string;
  title: WPRendered;
  content: WPRendered;
  excerpt?: WPRendered;
  acf?: WPTourACF;
  _embedded?: {
    "wp:featuredmedia"?: Array<{ source_url: string }>;
  };
}

export interface WPPost {
  id: number;
  slug: string;
  date: string;
  title: WPRendered;
  content: WPRendered;
  excerpt: WPRendered;
  _embedded?: {
    "wp:featuredmedia"?: Array<{ source_url: string }>;
    "wp:term"?: Array<Array<{ name: string; slug: string }>>;
  };
}

async function wpFetch<T>(path: string): Promise<T | null> {
  const url = `${WP_API_URL}${path}`;
  try {
    const res = await fetch(url, {
      next: { revalidate: REVALIDATE_SECONDS },
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      // Includes 404 (endpoint / post type not registered yet on WP)
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

/** Fetch all published tours from the "tours" custom post type. */
export async function getTours(): Promise<WPTour[] | null> {
  return wpFetch<WPTour[]>("/tours?_embed&per_page=100&orderby=date&order=desc");
}

/** Fetch a single tour by slug, or null if not found / WP unreachable. */
export async function getTourBySlug(slug: string): Promise<WPTour | null> {
  const tours = await wpFetch<WPTour[]>(`/tours?slug=${encodeURIComponent(slug)}&_embed`);
  return tours && tours.length > 0 ? tours[0] : null;
}

/** Fetch all published blog posts. */
export async function getPosts(): Promise<WPPost[] | null> {
  return wpFetch<WPPost[]>("/posts?_embed&per_page=100&orderby=date&order=desc");
}

/** Fetch a single blog post by slug, or null if not found / WP unreachable. */
export async function getPostBySlug(slug: string): Promise<WPPost | null> {
  const posts = await wpFetch<WPPost[]>(`/posts?slug=${encodeURIComponent(slug)}&_embed`);
  return posts && posts.length > 0 ? posts[0] : null;
}

/** Best-effort featured image URL extraction from an embedded WP entity. */
export function getFeaturedImageUrl(entity: WPTour | WPPost): string | undefined {
  return entity._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
}
