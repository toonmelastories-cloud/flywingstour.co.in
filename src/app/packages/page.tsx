import type { Metadata } from "next";
import PackagesClient, { type DestinationFilter } from "@/components/PackagesClient";
import JsonLd from "@/components/JsonLd";
import { getDestinationBySlug } from "@/data/destinations";
import { getAllTours, type TourData } from "@/lib/tours";
import {
  KEYWORDS,
  breadcrumbJsonLd,
  itemListJsonLd,
  pageMetadata,
} from "@/lib/seo";

export const revalidate = 300;

export const metadata: Metadata = pageMetadata({
  title: "Tour Packages from India | Dubai, Bali & More | Flywings",
  titleAbsolute: true,
  description:
    "Tour packages from Chandigarh and India to Dubai, Thailand, Bali, Maldives, Kashmir and Manali. Flights, hotels and transfers included.",
  path: "/packages",
  keywords: KEYWORDS.tours,
});

/**
 * One filter chip per destination that has packages, most packages
 * first, so a destination added in WordPress gets its chip with no code
 * change.
 */
function destinationFilters(packages: TourData[]): DestinationFilter[] {
  const counts = new Map<string, { label: string; count: number }>();
  for (const pkg of packages) {
    if (!pkg.destinationSlug) continue;
    const entry = counts.get(pkg.destinationSlug);
    if (entry) {
      entry.count += 1;
    } else {
      const label =
        getDestinationBySlug(pkg.destinationSlug)?.name ??
        (pkg.destinationName ||
          pkg.destinationSlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()));
      counts.set(pkg.destinationSlug, { label, count: 1 });
    }
  }
  // Stable sort: equal counts keep the order the packages came in.
  return Array.from(counts, ([slug, { label, count }]) => ({ slug, label, count }))
    .sort((a, b) => b.count - a.count)
    .map(({ slug, label }) => ({ slug, label }));
}

export default async function PackagesPage() {
  const packages = await getAllTours();
  return (
    <>
      <JsonLd
        data={[
          itemListJsonLd(
            "Flywings Tour Packages",
            packages.map((pkg) => ({
              name: pkg.title,
              path: `/packages/${pkg.slug}`,
              image: pkg.heroImages[0],
            }))
          ),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Tour Packages", path: "/packages" },
          ]),
        ]}
      />
      <PackagesClient packages={packages} filters={destinationFilters(packages)} />
    </>
  );
}
