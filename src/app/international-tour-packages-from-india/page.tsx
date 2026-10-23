import type { Metadata } from "next";
import PillarInternationalClient from "@/components/PillarInternationalClient";
import JsonLd from "@/components/JsonLd";
import { stripLinks } from "@/components/LinkedText";
import { getAllTours, regionOf } from "@/lib/tours";
import { PILLAR_FAQS } from "@/data/pillar-international";
import {
  breadcrumbJsonLd,
  faqJsonLd,
  itemListJsonLd,
  pageMetadata,
} from "@/lib/seo";

export const revalidate = 300;

const PATH = "/international-tour-packages-from-india";

export const metadata: Metadata = pageMetadata({
  title: "International Tour Packages from India | Best Deals",
  titleAbsolute: true,
  // The SEO team's wording, with "Chandigarh" changed to "India" to
  // match the new URL and H1, and "customized" shortened: as supplied
  // the line measured 1005px against the ~920px a snippet gets.
  description:
    "International tour packages from India with affordable prices, visa assistance, hotels and custom holiday plans. Discover your dream destination.",
  path: PATH,
  keywords: [
    "international tour packages from Chandigarh",
    "international holiday packages from Chandigarh",
    "Dubai tour package from Chandigarh",
    "Thailand tour package from Chandigarh",
    "Bali package from Chandigarh",
    "Singapore package from Chandigarh",
    "Maldives package from Chandigarh",
    "travel agency Chandigarh international tours",
    "honeymoon packages from Chandigarh",
  ],
});

export default async function InternationalToursFromChandigarhPage() {
  const tours = (await getAllTours()).filter((pkg) => regionOf(pkg) === "international");
  // Slim projection: only what the cards render (business rule — no
  // prices anywhere on this page, not even in the serialized payload).
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
            "International Tour Packages from Chandigarh",
            tours.map((pkg) => ({
              name: pkg.title,
              path: `/packages/${pkg.slug}`,
              image: pkg.heroImages[0],
            }))
          ),
          faqJsonLd(PILLAR_FAQS.map((f) => ({ ...f, answer: stripLinks(f.answer) }))),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "International Tour Packages from India", path: PATH },
          ]),
        ]}
      />
      <PillarInternationalClient packages={packages} />
    </>
  );
}
