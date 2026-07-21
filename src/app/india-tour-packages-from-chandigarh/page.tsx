import type { Metadata } from "next";
import PillarDomesticClient from "@/components/PillarDomesticClient";
import JsonLd from "@/components/JsonLd";
import { getAllTours } from "@/lib/tours";
import { PILLAR_DOMESTIC_FAQS } from "@/data/pillar-domestic";
import {
  breadcrumbJsonLd,
  faqJsonLd,
  itemListJsonLd,
  pageMetadata,
} from "@/lib/seo";

export const revalidate = 300;

const PATH = "/india-tour-packages-from-chandigarh";

export const metadata: Metadata = pageMetadata({
  title:
    "India Tour Packages from Chandigarh 2026 | Kashmir, Vaishno Devi, Amritsar | Flywings",
  titleAbsolute: true,
  description:
    "Book domestic tour packages from Chandigarh — Kashmir, Vaishno Devi yatra, Golden Temple Amritsar & Himachal circuits. Trusted Mohali agency since 2005. Get a free custom quote in 24 hours.",
  path: PATH,
  keywords: [
    "india tour packages from chandigarh",
    "domestic tour packages from chandigarh",
    "kashmir package from chandigarh",
    "vaishno devi package from chandigarh",
    "amritsar tour package",
    "himachal tour package from chandigarh",
    "travel agency chandigarh domestic tours",
  ],
});

export default async function IndiaToursFromChandigarhPage() {
  const tours = (await getAllTours()).filter(
    (pkg) => pkg.destinationSlug === "kashmir"
  );
  const packages = tours.map((pkg) => ({
    slug: pkg.slug,
    shortTitle: pkg.shortTitle,
    duration: pkg.duration,
    heroImage: pkg.heroImages[0],
    badge: pkg.badge,
    rating: pkg.rating,
    reviewCount: pkg.reviewCount,
  }));

  return (
    <>
      <JsonLd
        data={[
          itemListJsonLd(
            "India Tour Packages from Chandigarh",
            tours.map((pkg) => ({
              name: pkg.title,
              path: `/packages/${pkg.slug}`,
              image: pkg.heroImages[0],
            }))
          ),
          faqJsonLd(PILLAR_DOMESTIC_FAQS),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "India Tour Packages from Chandigarh", path: PATH },
          ]),
        ]}
      />
      <PillarDomesticClient packages={packages} />
    </>
  );
}
