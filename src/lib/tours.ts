import { getTours, getTourBySlug, getFeaturedImageUrl, getYoastMeta, type WPPost } from "@/lib/wordpress";
import { getAllPackages, getPackageBySlug, getRelatedPackages, type PackageData } from "@/data/packages";
import { stripWpHtml } from "@/lib/sanitize";

const FALLBACK_IMAGE = "/assets/hero-bg.jpg";

/**
 * Superset of PackageData used to render both WordPress-sourced tours
 * (plain posts — title, content, featured image, Yoast SEO meta; no
 * structured pricing/itinerary/gallery fields) and the rich local
 * static packages. WP tours simply leave the structured fields (hotels,
 * pricingTiers, faqs, etc.) empty — the detail/listing UI already
 * guards those sections and hides them when empty.
 */
export interface TourData extends PackageData {
  source: "wordpress" | "local";
  /** Raw WP post content HTML, shown in the overview section when present. */
  contentHtml?: string;
}

function mapWpPostToTourData(post: WPPost): TourData {
  const title = stripWpHtml(post.title?.rendered ?? "");
  const excerpt = stripWpHtml(post.excerpt?.rendered ?? "");
  const overview = stripWpHtml(post.content?.rendered ?? "").slice(0, 400);
  const yoast = getYoastMeta(post);

  return {
    slug: post.slug,
    destinationSlug: "",
    title,
    shortTitle: title,
    tagline: excerpt,
    heroImages: [getFeaturedImageUrl(post) ?? FALLBACK_IMAGE],
    rating: 0,
    reviewCount: 0,
    duration: "",
    nights: 0,
    days: 0,
    destinations: [],
    hotelCategory: "",
    transferIncluded: false,
    mealsIncluded: "",
    startingPrice: "",
    originalPrice: "",
    badge: undefined,
    overview: overview || excerpt,
    itinerary: [],
    contentHtml: post.content?.rendered,
    inclusions: [],
    exclusions: [],
    hotels: [],
    pricingTiers: [],
    childPrice: undefined,
    emiAvailable: false,
    cancellationPolicy: [],
    faqs: [],
    relatedSlugs: [],
    metaTitle: yoast.title || title,
    metaDescription: (yoast.description || excerpt).slice(0, 160),
    keywords: [],
    source: "wordpress",
  };
}

function localToTourData(pkg: PackageData): TourData {
  return { ...pkg, source: "local" };
}

/**
 * All tours for the /packages listing. Tries WordPress first (posts
 * tagged with the "tours" category); if that category doesn't exist
 * yet or WP is unreachable, falls back to the local curated package
 * data so the page never looks empty.
 */
export async function getAllTours(): Promise<TourData[]> {
  const wpTours = await getTours();
  if (wpTours && wpTours.length > 0) {
    return wpTours.map(mapWpPostToTourData);
  }
  return getAllPackages().map(localToTourData);
}

/** A single tour by slug, checking WordPress first, then local data. */
export async function getTourData(slug: string): Promise<TourData | null> {
  const wpTour = await getTourBySlug(slug);
  if (wpTour) return mapWpPostToTourData(wpTour);

  const local = getPackageBySlug(slug);
  return local ? localToTourData(local) : null;
}

/** Related tours — only meaningful for local data today (WP tours carry no relatedSlugs yet). */
export function getRelatedTours(tour: TourData): TourData[] {
  if (tour.source !== "local" || tour.relatedSlugs.length === 0) return [];
  return getRelatedPackages(tour.relatedSlugs).map(localToTourData);
}

/** All slugs (WordPress + local) for generateStaticParams — deduplicated, WP takes precedence. */
export async function getAllTourSlugs(): Promise<string[]> {
  const wpTours = await getTours();
  const wpSlugs = (wpTours ?? []).map((t) => t.slug);
  const localSlugs = getAllPackages().map((p) => p.slug);
  return Array.from(new Set([...wpSlugs, ...localSlugs]));
}
