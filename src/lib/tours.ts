import { getTours, getTourBySlug, getFeaturedImageUrl, getYoastMeta, wpJsonFetch, type WPPost } from "@/lib/wordpress";
import { getAllPackages, getPackageBySlug, type PackageData } from "@/data/packages";
import { getDestinationBySlug } from "@/data/destinations";
import { activeOffers, type QuotedPackage } from "@/data/quotedPackages";
import { stripWpHtml } from "@/lib/sanitize";

const FALLBACK_IMAGE = "/assets/hero-bg.jpg";

/** A package's special price on /offers, set in the plugin's Visibility & Offer tab. */
export interface PackageOffer {
  price: string;
  /** Price the offer is compared with, or "" for no saving line. */
  comparePrice: string;
  /** ISO date (YYYY-MM-DD) the offer ends, or "". */
  validTill: string;
  minPax: number;
  note: string;
  /** "Day 1: Arrival in Dubai (Dinner)", one line per day. */
  itinerary: string[];
}

/**
 * Superset of PackageData used to render tours from every source:
 *
 * - "plugin": the Flywings Packages WordPress plugin
 *   (wp-plugin/flywings-packages). Carries every structured field plus
 *   the extras below.
 * - "wordpress": a plain post in the `tours` category (the older setup).
 *   Title, content, featured image and Yoast meta only; the structured
 *   fields stay empty and the UI hides those sections.
 * - "local": src/data/packages.ts, the fallback when WordPress has
 *   nothing for a slug or cannot be reached.
 */
export interface TourData extends PackageData {
  source: "plugin" | "wordpress" | "local";
  /** Overview HTML, shown in the overview section when present. */
  contentHtml?: string;
  destinationName?: string;
  region?: "india" | "international";
  tripTypes?: string[];
  /** A smaller crop of the cover photo for listing cards. */
  cardImage?: string;
  heroImageAlts?: string[];
  /** Show "Starting from" prices on cards and the detail page. */
  showPrice?: boolean;
  priceOnRequest?: boolean;
  soldOut?: boolean;
  /** False for private-link packages: the page works but stays out of listings and Google. */
  listed?: boolean;
  featured?: boolean;
  featuredOrder?: number;
  /** ISO timestamp of the last edit. */
  modified?: string;
  offer?: PackageOffer | null;
  /** Set on drafts opened through the editor's preview link. */
  preview?: boolean;
}

/* ─── Flywings Packages plugin ─────────────────────────────────────────── */

type PluginPackage = Omit<TourData, "source">;

interface PluginList {
  /** Listed packages only. */
  packages: PluginPackage[];
  /** Live but private-link or expired: slug only, the page itself still works. */
  hidden?: string[];
  /** Slugs that were live and have been unpublished or deleted in WordPress. */
  gone: string[];
}

type PluginLookup =
  | { package: PluginPackage }
  | { moved: string }
  | { gone: true; destinationSlug: string };

const list = <T,>(v: T[] | null | undefined): T[] => (Array.isArray(v) ? v : []);

/**
 * Photos that are the website's own files (the importer stores
 * "/assets/x.jpg" as a full flywingstour.co.in address) are served as
 * site paths again: no apex-to-www redirect per photo, and they load on
 * preview deployments too. Media-library photos on wp. are left alone.
 */
const OWN_ORIGIN = /^https?:\/\/(?:www\.)?flywingstour\.co\.in(?=\/)/i;
const ownPath = (url: string) => url.replace(OWN_ORIGIN, "");

function fromPlugin(p: PluginPackage): TourData {
  const heroImages = list(p.heroImages).map(ownPath);
  return {
    ...p,
    badge: p.badge || undefined,
    childPrice: p.childPrice || undefined,
    heroImages: heroImages.length > 0 ? heroImages : [FALLBACK_IMAGE],
    cardImage: p.cardImage ? ownPath(p.cardImage) : undefined,
    // Plugin 1.0.0 sent this UTC time without a zone, which would parse as server-local time.
    modified: p.modified && !/(?:Z|[+-]\d\d:?\d\d)$/i.test(p.modified) ? `${p.modified}Z` : p.modified,
    destinations: list(p.destinations),
    itinerary: list(p.itinerary),
    inclusions: list(p.inclusions),
    exclusions: list(p.exclusions),
    hotels: list(p.hotels),
    pricingTiers: list(p.pricingTiers),
    cancellationPolicy: list(p.cancellationPolicy),
    faqs: list(p.faqs),
    relatedSlugs: list(p.relatedSlugs),
    keywords: list(p.keywords),
    source: "plugin",
  };
}

async function getPluginList(): Promise<PluginList | null> {
  const data = await wpJsonFetch<PluginList>("/flywings/v1/packages");
  return data && Array.isArray(data.packages) ? data : null;
}

/**
 * A draft package for the editor's "Preview on website" button. The
 * signed link is checked by WordPress; read fresh so edits show at once.
 */
export async function getPackagePreview(id: string, exp: string, token: string): Promise<TourData | null> {
  if (!/^\d+$/.test(id) || !/^\d+$/.test(exp) || !/^[a-f0-9]{64}$/.test(token)) return null;
  const data = await wpJsonFetch<{ package?: PluginPackage }>(
    `/flywings/v1/preview/${id}?exp=${exp}&token=${token}`,
    { fresh: true }
  );
  return data?.package ? fromPlugin(data.package) : null;
}

/* ─── Older sources ────────────────────────────────────────────────────── */

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

/* ─── Lookups ──────────────────────────────────────────────────────────── */

/**
 * Every tour the listings may show. The plugin wins over the older
 * sources on the same slug, and a slug the plugin reports as hidden or
 * removed is not brought back from local data (so making an imported
 * package private, or deleting it, really takes it off the listings).
 */
async function getEveryTour(): Promise<TourData[]> {
  const [plugin, legacy] = await Promise.all([getPluginList(), getTours()]);
  const seen = new Set<string>();
  const tours: TourData[] = [];
  const add = (t: TourData) => {
    if (seen.has(t.slug)) return;
    seen.add(t.slug);
    tours.push(t);
  };

  list(plugin?.packages).map(fromPlugin).forEach(add);
  [...list(plugin?.hidden), ...list(plugin?.gone)].forEach((slug) => seen.add(slug));
  list(legacy).map(mapWpPostToTourData).forEach(add);
  getAllPackages().map(localToTourData).forEach(add);
  return tours;
}

/**
 * Tours for listings (/packages, the homepage, the India and
 * International pages, the sitemap, llms.txt). Private-link and expired
 * plugin packages are left out. Falls back to the local packages when
 * WordPress is unreachable, so the page never looks empty.
 */
export async function getAllTours(): Promise<TourData[]> {
  return (await getEveryTour()).filter((t) => t.listed !== false);
}

export type TourLookup = { tour: TourData } | { redirect: string };

/**
 * One tour by slug, for its detail page: the plugin first, then the
 * older tours category, then local data. An old slug of a renamed
 * package, or a package taken down in WordPress, comes back as a redirect.
 */
export async function findTour(slug: string): Promise<TourLookup | null> {
  const hit = await wpJsonFetch<PluginLookup>(`/flywings/v1/packages/${encodeURIComponent(slug)}`);
  if (hit && "package" in hit && hit.package) return { tour: fromPlugin(hit.package) };
  if (hit && "moved" in hit && hit.moved?.startsWith("/packages/")) return { redirect: hit.moved };
  if (hit && "gone" in hit && hit.gone) {
    const destination = hit.destinationSlug ? getDestinationBySlug(hit.destinationSlug) : undefined;
    return { redirect: destination ? `/destinations/${destination.slug}` : "/packages" };
  }

  const wpTour = await getTourBySlug(slug);
  if (wpTour) return { tour: mapWpPostToTourData(wpTour) };

  const local = getPackageBySlug(slug);
  return local ? { tour: localToTourData(local) } : null;
}

/** "india" or "international": from the plugin, else from the destination's country. */
export function regionOf(tour: TourData): "india" | "international" {
  if (tour.region) return tour.region;
  return getDestinationBySlug(tour.destinationSlug)?.country === "India" ? "india" : "international";
}

/**
 * Related tours: the ones picked on the package, else others from the
 * same destination, then the same region.
 */
export async function getRelatedTours(tour: TourData): Promise<TourData[]> {
  const others = (await getAllTours()).filter((t) => t.slug !== tour.slug);
  if (tour.relatedSlugs.length > 0) {
    const bySlug = new Map(others.map((t) => [t.slug, t]));
    const picked = tour.relatedSlugs
      .map((slug) => bySlug.get(slug))
      .filter((t): t is TourData => t !== undefined);
    if (picked.length > 0) return picked.slice(0, 6);
  }
  const sameDestination = others.filter((t) => t.destinationSlug && t.destinationSlug === tour.destinationSlug);
  const sameRegion = others.filter((t) => !sameDestination.includes(t) && regionOf(t) === regionOf(tour));
  return [...sameDestination, ...sameRegion].slice(0, 3);
}

/**
 * The packages on sale for one destination, for its destination page.
 *
 * A Himachal-style hub counts its children too: the hub has no packages
 * of its own, and a visitor on it is after the whole state, not a page
 * that says there is nothing here.
 */
export async function getToursForDestination(slug: string): Promise<TourData[]> {
  const wanted = new Set([slug]);
  if (isHub(slug)) {
    for (const child of getDestinationBySlug(slug)?.relatedSlugs ?? []) {
      wanted.add(child);
    }
  }
  return (await getAllTours()).filter((t) => t.destinationSlug && wanted.has(t.destinationSlug));
}

/**
 * A destination that stands for several others rather than a place
 * packages are sold against: it carries no packages and the grid hides
 * it behind its children. Himachal is the only one today.
 */
function isHub(slug: string): boolean {
  const d = getDestinationBySlug(slug);
  return !!d && d.packages.length === 0 && d.relatedSlugs.length > 0;
}

/** Slugs for generateStaticParams. Private-link packages render on first visit instead. */
export async function getAllTourSlugs(): Promise<string[]> {
  return (await getAllTours()).map((t) => t.slug);
}

/* ─── Homepage ─────────────────────────────────────────────────────────── */

/**
 * Local packages featured on the homepage. Plugin packages use their own
 * "Feature on the homepage" switch and position instead.
 */
const LOCAL_FEATURED_SLUGS = [
  "dubai-luxury-5n6d",
  "thailand-explorer-7n8d",
  "bali-romance-6n7d",
  "kashmir-family-4n5d",
  "maldives-luxury-4n5d",
  "singapore-escape-4n5d",
];

export interface FeaturedPackageCard {
  slug: string;
  name: string;
  destination: string;
  duration: string;
  chips: string[];
  badge?: string;
  featured?: boolean;
}

/** Short chips for a homepage card, every one of them taken from the package. */
function chipsFor(pkg: TourData): string[] {
  const includesFlights = pkg.inclusions.some((i) => /flight|airfare/i.test(i));
  return [
    ...(includesFlights ? ["Flights"] : []),
    pkg.hotelCategory,
    ...(pkg.transferIncluded ? ["Transfers"] : []),
    pkg.mealsIncluded,
  ].filter(Boolean);
}

export async function getFeaturedPackageCards(limit = 6): Promise<FeaturedPackageCard[]> {
  const tours = await getAllTours();
  const rank = (t: TourData): number | null => {
    if (t.source === "plugin") return t.featured ? t.featuredOrder || 50 : null;
    const i = LOCAL_FEATURED_SLUGS.indexOf(t.slug);
    return i >= 0 ? i + 1 : null;
  };
  const ranked = tours
    .map((t) => ({ t, r: rank(t) }))
    .filter((x): x is { t: TourData; r: number } => x.r !== null)
    .sort((a, b) => a.r - b.r)
    .map((x) => x.t);
  const picked = (ranked.length > 0 ? ranked : tours).slice(0, limit);

  return picked.map((pkg, i) => ({
    slug: pkg.slug,
    name: pkg.shortTitle,
    destination:
      getDestinationBySlug(pkg.destinationSlug)?.name ?? pkg.destinationName ?? pkg.destinations[0] ?? "",
    duration: pkg.duration,
    chips: chipsFor(pkg),
    badge: pkg.badge,
    featured: i === 0,
  }));
}

/* ─── Offers ───────────────────────────────────────────────────────────── */

/**
 * Standalone offers from the plugin's Offers menu.
 *
 * These are rates for trips with no package page of their own: the
 * Vietnam circuits, a supplier's one-off Kuala Lumpur price. WordPress
 * has already dropped anything expired or hidden, so whatever comes
 * back is what the page should show.
 *
 * Returns null, not an empty array, when WordPress cannot be reached,
 * so the caller can tell "no offers today" from "no answer" and fall
 * back to the hard-coded list instead of emptying the page.
 */
export async function getWpOffers(): Promise<QuotedPackage[] | null> {
  const data = await wpJsonFetch<{ offers?: QuotedPackage[] }>("/flywings/v1/offers");
  return data && Array.isArray(data.offers) ? data.offers : null;
}

/**
 * Every offer for /offers and /llms.txt: packages switched on in the
 * package editor first, then the standalone offers.
 *
 * `src/data/quotedPackages.ts` is the fallback for the standalone half.
 * It is used only while WordPress is unreachable or has no offers of
 * its own yet, so the page still has something on it the day the
 * plugin is installed, or the morning WordPress is down.
 */
export async function getOffers(): Promise<QuotedPackage[]> {
  const [fromPackages, fromWp] = await Promise.all([getPackageOffers(), getWpOffers()]);
  const standalone = fromWp && fromWp.length > 0 ? fromWp : activeOffers();
  const seen = new Set(fromPackages.map((o) => o.slug));
  return [...fromPackages, ...standalone.filter((o) => !seen.has(o.slug))];
}

/**
 * Plugin packages with a live offer, in the shape /offers and llms.txt
 * already render. Private-link, expired and sold-out packages are left out.
 */
export async function getPackageOffers(now: Date = new Date()): Promise<QuotedPackage[]> {
  const today = now.toISOString().slice(0, 10);
  return (await getAllTours())
    .filter((t) => t.source === "plugin" && !t.soldOut)
    .flatMap((t): QuotedPackage[] => {
      const o = t.offer;
      if (!o || !o.price || (o.validTill && o.validTill < today)) return [];
      return [
        {
          slug: t.slug,
          name: t.shortTitle,
          region: t.destinationName || t.destinations[0] || "",
          duration: t.duration,
          cities: t.destinations,
          hotelCategory: t.hotelCategory,
          startingPrice: o.price,
          minPax: o.minPax || 2,
          itinerary: list(o.itinerary),
          inclusions: t.inclusions,
          image: t.cardImage || t.heroImages[0],
          imageAlt: t.heroImageAlts?.[0] || t.shortTitle,
          compareWith: o.comparePrice
            ? {
                label: t.shortTitle,
                price: o.comparePrice,
                href: `/packages/${t.slug}`,
                sameTrip: true,
                note: o.note || undefined,
              }
            : undefined,
          validTill: o.validTill || undefined,
        },
      ];
    });
}
