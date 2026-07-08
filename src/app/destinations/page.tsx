import type { Metadata } from "next";
import DestinationsListClient from "@/components/DestinationsListClient";
import JsonLd from "@/components/JsonLd";
import destinations from "@/data/destinations";
import {
  KEYWORDS,
  breadcrumbJsonLd,
  itemListJsonLd,
  pageMetadata,
} from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Travel Destinations | Dubai, Thailand, Bali & More | Flywings",
  titleAbsolute: true,
  description:
    "Explore top international and domestic travel destinations from India — Dubai, Thailand, Bali, Kashmir, Maldives, Singapore. Tour packages with flights, hotels & visa assistance included. Plan your trip with Flywings.",
  path: "/destinations",
  keywords: KEYWORDS.tours,
});

export default function Destinations() {
  return (
    <>
      <JsonLd
        data={[
          itemListJsonLd(
            "Flywings Travel Destinations",
            destinations.map((d) => ({
              name: `${d.name} Tour Packages`,
              path: `/destinations/${d.slug}`,
              image: d.heroImage,
            }))
          ),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Destinations", path: "/destinations" },
          ]),
        ]}
      />
      <DestinationsListClient />
    </>
  );
}
