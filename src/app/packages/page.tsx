import type { Metadata } from "next";
import PackagesClient from "@/components/PackagesClient";
import JsonLd from "@/components/JsonLd";
import { getAllTours } from "@/lib/tours";
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
    "Browse best-value domestic & international tour packages from India — Dubai, Thailand, Bali, Kashmir, Maldives, Singapore. Flights, hotels, transfers & visa assistance included. Get a free quote from Flywings.",
  path: "/packages",
  keywords: KEYWORDS.tours,
});

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
      <PackagesClient packages={packages} />
    </>
  );
}
