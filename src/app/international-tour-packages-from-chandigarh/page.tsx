import type { Metadata } from "next";
import PillarInternationalClient from "@/components/PillarInternationalClient";
import JsonLd from "@/components/JsonLd";
import { getAllTours } from "@/lib/tours";
import { PILLAR_FAQS } from "@/data/pillar-international";
import {
  breadcrumbJsonLd,
  faqJsonLd,
  itemListJsonLd,
  pageMetadata,
} from "@/lib/seo";

export const revalidate = 300;

const PATH = "/international-tour-packages-from-chandigarh";

export const metadata: Metadata = pageMetadata({
  title:
    "International Tour Packages from Chandigarh 2026 | Dubai, Thailand, Bali | Flywings",
  titleAbsolute: true,
  description:
    "Book international tour packages from Chandigarh — Dubai, Thailand, Bali, Singapore & Maldives. Flights from IXC, hotels, transfers & visa assistance by a trusted Mohali agency since 2005. Get a free custom quote in 24 hours.",
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
  const packages = (await getAllTours()).filter(
    (pkg) => pkg.destinationSlug !== "kashmir"
  );

  return (
    <>
      <JsonLd
        data={[
          itemListJsonLd(
            "International Tour Packages from Chandigarh",
            packages.map((pkg) => ({
              name: pkg.title,
              path: `/packages/${pkg.slug}`,
              image: pkg.heroImages[0],
            }))
          ),
          faqJsonLd(PILLAR_FAQS),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "International Tour Packages from Chandigarh", path: PATH },
          ]),
        ]}
      />
      <PillarInternationalClient packages={packages} />
    </>
  );
}
