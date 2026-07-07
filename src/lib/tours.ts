import { getTours, getTourBySlug, getFeaturedImageUrl, type WPTour } from "@/lib/wordpress";
import { getAllPackages, getPackageBySlug, getRelatedPackages, type PackageData } from "@/data/packages";
import { stripWpHtml } from "@/lib/sanitize";

const FALLBACK_IMAGE = "/assets/hero-bg.jpg";

/**
 * Superset of PackageData used to render both WordPress-sourced tours
 * (minimal ACF fields) and the rich local static packages. Fields that
 * only WordPress provides raw HTML for are kept separately so the UI can
 * render them safely (sanitized) instead of forcing them into the
 * structured local shape.
 */
export interface TourData extends PackageData {
  source: "wordpress" | "local";
  /** Raw itinerary HTML from WP ACF field, when present (WP tours only). */
  itineraryHtml?: string;
  /** Raw WP post content HTML, shown in the overview section when present. */
  contentHtml?: string;
}

function mapWpTourToTourData(tour: WPTour): TourData {
  const acf = tour.acf ?? {};
  const title = stripWpHtml(tour.title?.rendered ?? "");
  const excerpt = stripWpHtml(tour.excerpt?.rendered ?? "");
  const overview = stripWpHtml(tour.content?.rendered ?? "").slice(0, 400);
  const destination = acf.destination?.trim() ?? "";
  const gallery = acf.gallery && acf.gallery.length > 0
    ? acf.gallery
    : [getFeaturedImageUrl(tour) ?? FALLBACK_IMAGE];
  const price = acf.price?.trim() ?? "";

  return {
    slug: tour.slug,
    destinationSlug: destination.toLowerCase().replace(/\s+/g, "-"),
    title,
    shortTitle: title,
    tagline: excerpt,
    heroImages: gallery,
    rating: 0,
    reviewCount: 0,
    duration: acf.duration ?? "",
    nights: 0,
    days: 0,
    destinations: destination ? [destination] : [],
    hotelCategory: "",
    transferIncluded: false,
    mealsIncluded: "",
    startingPrice: price,
    originalPrice: price,
    badge: undefined,
    overview: overview || excerpt,
    itinerary: [],
    itineraryHtml: acf.itinerary,
    contentHtml: tour.content?.rendered,
    inclusions: [],
    exclusions: [],
    hotels: [],
    pricingTiers: price
      ? [{ label: "Per Person", price, originalPrice: price, description: "" }]
      : [],
    childPrice: undefined,
    emiAvailable: false,
    cancellationPolicy: [],
    faqs: [],
    relatedSlugs: [],
    metaTitle: title,
    metaDescription: excerpt.slice(0, 160),
    keywords: [],
    source: "wordpress",
  };
}

function localToTourData(pkg: PackageData): TourData {
  return { ...pkg, source: "local" };
}

/**
 * All tours for the /packages listing. Tries WordPress first; if the
 * "tours" post type doesn't exist yet or WP is unreachable, falls back
 * to the local curated package data so the page never looks empty.
 */
export async function getAllTours(): Promise<TourData[]> {
  const wpTours = await getTours();
  if (wpTours && wpTours.length > 0) {
    return wpTours.map(mapWpTourToTourData);
  }
  return getAllPackages().map(localToTourData);
}

/** A single tour by slug, checking WordPress first, then local data. */
export async function getTourData(slug: string): Promise<TourData | null> {
  const wpTour = await getTourBySlug(slug);
  if (wpTour) return mapWpTourToTourData(wpTour);

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
