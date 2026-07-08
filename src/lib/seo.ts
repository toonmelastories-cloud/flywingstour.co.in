import type { Metadata } from "next";
import type { Destination } from "@/data/destinations";
import type { TourData } from "@/lib/tours";

/**
 * Central SEO / AEO configuration for the whole site.
 *
 * Every page builds its metadata and JSON-LD structured data from the
 * constants and helpers here, so brand names, the canonical domain,
 * contact details, and keyword clusters live in exactly one place.
 *
 * The canonical origin comes from NEXT_PUBLIC_SITE_URL so staging
 * deployments can point canonicals/sitemap at themselves without a
 * code change.
 */

// The www host is the primary domain on Vercel (the apex 308-redirects
// to it), so canonicals/sitemap/JSON-LD must all use www.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.flywingstour.co.in"
).replace(/\/+$/, "");

export const SITE_NAME = "Flywings Tour and Travel";
export const SITE_SHORT_NAME = "Flywings";
export const SITE_LOGO_URL =
  "https://wp.flywingstour.co.in/wp-content/uploads/2026/07/flywings-logo.png";
export const DEFAULT_OG_IMAGE = "/assets/hero-bg.jpg";

export const CONTACT = {
  phoneDisplay: "+91 99143 10333",
  phoneE164: "+919914310333",
  landlineDisplay: "0172-4736185",
  landlineE164: "+911724736185",
  email: "sales@flywingstour.co.in",
  streetAddress: "SCF 29, First Floor, Phase 7, S.A.S Nagar",
  locality: "Mohali",
  region: "Punjab",
  postalCode: "160062",
  country: "IN",
  foundingYear: "2005",
} as const;

/**
 * Keyword clusters. The business's primary focus is air ticketing
 * (domestic + international) followed by tour packages, so those two
 * clusters lead everywhere.
 */
export const KEYWORDS = {
  flights: [
    "air ticket booking",
    "domestic flight booking India",
    "international flight tickets",
    "cheap air tickets India",
    "flight booking agent Mohali",
    "air ticket agent Chandigarh",
    "lowest airfare domestic flights",
    "international air ticketing agency",
    "group flight booking India",
  ],
  tours: [
    "tour packages from India",
    "international tour packages",
    "domestic tour packages India",
    "holiday packages with flights",
    "Dubai tour package",
    "Thailand tour package",
    "Bali tour package",
    "Maldives honeymoon package",
    "Singapore tour package",
    "Kashmir tour package",
  ],
  services: [
    "visa assistance India",
    "hotel booking agency",
    "corporate travel management",
    "travel agency Mohali",
    "travel agency Chandigarh",
    "best travel agent Punjab",
  ],
} as const;

export const ALL_KEYWORDS = [
  ...KEYWORDS.flights,
  ...KEYWORDS.tours,
  ...KEYWORDS.services,
];

export function absoluteUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

/** "₹49,999" → 49999 (schema.org offers need numeric price). */
export function parsePrice(price: string | undefined): number | undefined {
  if (!price) return undefined;
  const digits = price.replace(/[^\d]/g, "");
  return digits ? Number(digits) : undefined;
}

interface PageMetadataInput {
  title: string;
  description: string;
  /** Route path beginning with "/", used for the canonical URL. */
  path: string;
  keywords?: readonly string[];
  image?: string;
  ogType?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  noIndex?: boolean;
  /**
   * Set when `title` already contains the brand name (e.g. curated
   * metaTitles, Yoast titles) so the layout's "%s | Flywings…"
   * template doesn't double-brand it.
   */
  titleAbsolute?: boolean;
}

/**
 * Standard per-page metadata: title, description, canonical, Open Graph
 * and Twitter cards — consistent across every route.
 */
export function pageMetadata({
  title,
  description,
  path,
  keywords,
  image = DEFAULT_OG_IMAGE,
  ogType = "website",
  publishedTime,
  modifiedTime,
  noIndex,
  titleAbsolute,
}: PageMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(image);

  return {
    title: titleAbsolute ? { absolute: title } : title,
    description,
    keywords: keywords ? [...keywords] : undefined,
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: true } : undefined,
    openGraph: {
      type: ogType,
      url,
      siteName: SITE_NAME,
      locale: "en_IN",
      title,
      description,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
      ...(ogType === "article" && publishedTime ? { publishedTime } : {}),
      ...(ogType === "article" && modifiedTime ? { modifiedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

/* ────────────────────────────────────────────────────────────────────
 * JSON-LD builders (schema.org)
 *
 * Stable @id anchors let Google/Bing/AI engines merge the entities
 * across pages — a core E-E-A-T signal: one well-described,
 * consistently referenced organization.
 * ──────────────────────────────────────────────────────────────────── */

export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/** TravelAgency (subtype of LocalBusiness + Organization). */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": ORG_ID,
    name: SITE_NAME,
    alternateName: SITE_SHORT_NAME,
    url: `${SITE_URL}/`,
    logo: {
      "@type": "ImageObject",
      url: SITE_LOGO_URL,
    },
    image: absoluteUrl(DEFAULT_OG_IMAGE),
    description:
      "Flywings Tour and Travel is an IATA-style full-service travel agency in Mohali, Punjab, specialising in domestic and international air ticket booking, customised tour packages, visa assistance, hotel reservations, and corporate travel management.",
    telephone: CONTACT.phoneE164,
    email: CONTACT.email,
    priceRange: "₹₹",
    foundingDate: CONTACT.foundingYear,
    address: {
      "@type": "PostalAddress",
      streetAddress: CONTACT.streetAddress,
      addressLocality: CONTACT.locality,
      addressRegion: CONTACT.region,
      postalCode: CONTACT.postalCode,
      addressCountry: CONTACT.country,
    },
    areaServed: [
      { "@type": "Country", name: "India" },
      { "@type": "AdministrativeArea", name: "Punjab" },
      { "@type": "City", name: "Mohali" },
      { "@type": "City", name: "Chandigarh" },
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: CONTACT.phoneE164,
        contactType: "customer service",
        email: CONTACT.email,
        availableLanguage: ["English", "Hindi", "Punjabi"],
        areaServed: "IN",
      },
      {
        "@type": "ContactPoint",
        telephone: CONTACT.landlineE164,
        contactType: "reservations",
        availableLanguage: ["English", "Hindi", "Punjabi"],
        areaServed: "IN",
      },
    ],
    knowsAbout: [
      "Domestic air ticketing",
      "International air ticketing",
      "Tour packages",
      "Visa assistance",
      "Hotel booking",
      "Corporate travel",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Travel Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Domestic & International Flight Booking",
            serviceType: "Air ticketing",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Tour Packages",
            serviceType: "Package tours",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Visa Assistance",
            serviceType: "Visa services",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Hotel Reservations",
            serviceType: "Hotel booking",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Corporate Travel Management",
            serviceType: "Business travel",
          },
        },
      ],
    },
  };
}

/** WebSite entity with SearchAction (sitelinks search box eligibility). */
export function webSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: `${SITE_URL}/`,
    name: SITE_NAME,
    publisher: { "@id": ORG_ID },
    inLanguage: "en-IN",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/packages?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function touristDestinationJsonLd(destination: Destination) {
  return {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    "@id": `${SITE_URL}/destinations/${destination.slug}#destination`,
    name: destination.name,
    description: destination.about,
    url: absoluteUrl(`/destinations/${destination.slug}`),
    image: absoluteUrl(destination.heroImage),
    touristType: ["Couples", "Families", "Honeymooners", "Solo travellers"],
    includesAttraction: destination.highlights.map((h) => ({
      "@type": "TouristAttraction",
      name: h.title,
      description: h.description,
    })),
  };
}

/** TouristTrip + Offer for a tour package detail page. */
export function touristTripJsonLd(pkg: TourData) {
  const price = parsePrice(pkg.startingPrice);
  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    "@id": `${SITE_URL}/packages/${pkg.slug}#trip`,
    name: pkg.title,
    description: pkg.metaDescription || pkg.overview,
    url: absoluteUrl(`/packages/${pkg.slug}`),
    image: pkg.heroImages.map((img) => absoluteUrl(img)),
    touristType: ["Couples", "Families", "Honeymooners"],
    provider: { "@id": ORG_ID },
    ...(pkg.itinerary.length > 0
      ? {
          itinerary: {
            "@type": "ItemList",
            numberOfItems: pkg.itinerary.length,
            itemListElement: pkg.itinerary.map((day) => ({
              "@type": "ListItem",
              position: day.day,
              name: `Day ${day.day}: ${day.title}`,
              description: day.description,
            })),
          },
        }
      : {}),
    ...(price
      ? {
          offers: {
            "@type": "Offer",
            price,
            priceCurrency: "INR",
            availability: "https://schema.org/InStock",
            url: absoluteUrl(`/packages/${pkg.slug}`),
            seller: { "@id": ORG_ID },
          },
        }
      : {}),
  };
}

export function blogPostingJsonLd(post: {
  slug: string;
  title: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${SITE_URL}/blog/${post.slug}#article`,
    headline: post.title,
    description: post.description,
    image: absoluteUrl(post.image),
    url: absoluteUrl(`/blog/${post.slug}`),
    datePublished: post.datePublished,
    dateModified: post.dateModified || post.datePublished,
    inLanguage: "en-IN",
    author: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(`/blog/${post.slug}`),
    },
  };
}

export function itemListJsonLd(
  name: string,
  items: { name: string; path: string; image?: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: items.length,
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      url: absoluteUrl(item.path),
      ...(item.image ? { image: absoluteUrl(item.image) } : {}),
    })),
  };
}
