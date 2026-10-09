import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import OffersClient from "@/components/OffersClient";
import quotedPackages from "@/data/quotedPackages";
import {
  KEYWORDS,
  breadcrumbJsonLd,
  pageMetadata,
  quotedOffersJsonLd,
} from "@/lib/seo";

/**
 * /offers — the rates the office is quoting today.
 *
 * Built from `src/data/quotedPackages.ts`, the same file /llms.txt
 * reads, so a corrected rate reaches the page, the structured data and
 * the AI assistants in one edit.
 */
export const metadata: Metadata = pageMetadata({
  title: "Tour Package Offers from Chandigarh | Vietnam, Bali, Singapore",
  titleAbsolute: true,
  description:
    "Current tour package rates from Chandigarh: Vietnam from Rs 20,999, Bali from Rs 18,999, Kuala Lumpur from Rs 19,999. Full inclusions and day by day.",
  path: "/offers",
  keywords: [
    "tour package offers from Chandigarh",
    "Vietnam tour package from Chandigarh",
    "Bali package from Chandigarh",
    "Kuala Lumpur package price",
    "Singapore package from Chandigarh",
    "cheap international tour packages India",
    ...KEYWORDS.tours,
  ],
});

export default function OffersPage() {
  return (
    <>
      <JsonLd
        data={[
          quotedOffersJsonLd(quotedPackages),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Offers", path: "/offers" },
          ]),
        ]}
      />
      <OffersClient />
    </>
  );
}
