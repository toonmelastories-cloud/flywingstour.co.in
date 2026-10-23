import type { Metadata } from "next";
import PillarDomesticClient from "@/components/PillarDomesticClient";
import JsonLd from "@/components/JsonLd";
import { stripLinks } from "@/components/LinkedText";
import { getAllTours, regionOf } from "@/lib/tours";
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
  title: "India Tour Packages from Chandigarh | Best Holiday Deals",
  titleAbsolute: true,
  // As supplied by the SEO team, less the opening "Explore" and the
  // serial comma: with them the line measured 986px against the ~920px
  // a snippet gets, and the closing call to action would have clipped.
  description:
    "India tour packages from Chandigarh with affordable prices, popular destinations, comfortable stays and customized holiday plans. Book today!",
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
  const tours = (await getAllTours()).filter((pkg) => regionOf(pkg) === "india");
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
          faqJsonLd(PILLAR_DOMESTIC_FAQS.map((f) => ({ ...f, answer: stripLinks(f.answer) }))),
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
