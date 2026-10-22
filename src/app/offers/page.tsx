import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import OffersClient from "@/components/OffersClient";
import { activeOffers } from "@/data/quotedPackages";
import { getPackageOffers } from "@/lib/tours";
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
 * the AI assistants in one edit. WordPress packages switched onto the
 * Offers page in the package editor are listed first.
 *
 * Regenerated at least hourly because `activeOffers()` compares each
 * rate's hold date against today. Prerendered once at build time, an
 * expired rate would sit on the page until the next deploy. (The
 * WordPress package read refreshes every 5 minutes, so in practice the
 * page does too.)
 */
export const revalidate = 3600;
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

export default async function OffersPage() {
  const offers = [...(await getPackageOffers()), ...activeOffers()];
  return (
    <>
      <JsonLd
        data={[
          quotedOffersJsonLd(offers),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Offers", path: "/offers" },
          ]),
        ]}
      />
      <OffersClient offers={offers} />
    </>
  );
}
