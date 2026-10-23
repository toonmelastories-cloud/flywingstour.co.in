import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import OffersClient from "@/components/OffersClient";
import { getOffers } from "@/lib/tours";
import {
  KEYWORDS,
  breadcrumbJsonLd,
  pageMetadata,
  quotedOffersJsonLd,
} from "@/lib/seo";

/**
 * /offers — the rates the office is quoting today.
 *
 * Built from WordPress: packages switched onto the Offers page in the
 * package editor, then the standalone offers from the Offers menu. The
 * hard-coded list in `src/data/quotedPackages.ts` is the fallback for
 * the second half while WordPress has none of its own or cannot be
 * reached, so the page is never empty.
 *
 * One read feeds the page, the structured data and /llms.txt, so a
 * corrected rate reaches all three at once.
 *
 * Regenerated at least hourly because offers drop off on their hold
 * date. Prerendered once at build time, an expired rate would sit on
 * the page until the next deploy. In practice it refreshes sooner: the
 * WordPress read is cached for 5 minutes, and the plugin calls
 * /api/revalidate the moment an offer is saved.
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
  const offers = await getOffers();
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
