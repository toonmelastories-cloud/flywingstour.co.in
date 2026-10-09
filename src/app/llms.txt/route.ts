import destinations from "@/data/destinations";
import quotedPackages from "@/data/quotedPackages";
import servicePages from "@/data/servicePages";
import { getAllTours } from "@/lib/tours";
import { CONTACT, SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/seo";

/**
 * /llms.txt — the plain-text site summary that AI assistants (ChatGPT,
 * Gemini, Perplexity, Claude) read when they are asked about this
 * business.
 *
 * This used to be a hand-written file in `public/`. It listed the six
 * top-level pages and not one actual package, so an assistant asked
 * "Dubai package from Chandigarh" had nothing concrete to quote and
 * fell back to whatever it could scrape. It is generated from the same
 * data the pages render from, so a new package or destination appears
 * here the moment it is added, with no second file to remember.
 *
 * Kept deliberately factual: no prices we cannot stand behind, no
 * claims that are not also on the site. Assistants quote this verbatim.
 */
export const dynamic = "force-dynamic";

/** "₹79,999" -> " From ₹79,999 per person."; blank/"On request" -> a quote line. */
function priceSentence(price: string): string {
  const p = price.trim();
  if (!p) return "";
  if (/^on request$/i.test(p)) return " Price on request.";
  return ` From ${p} per person.`;
}

/**
 * Site copy uses en/em dashes and typographic quotes. This is a plain
 * text file that assistants may quote verbatim, so flatten them to
 * ASCII — and it keeps the house style (hyphens, never em dashes).
 */
function plain(s: string): string {
  return s
    // Numeric ranges first ("5–7 Days" must not become "5 - 7 Days").
    .replace(/(\d)\s*[—–]\s*(\d)/g, "$1-$2")
    .replace(/\s*[—–]\s*/g, " - ")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'");
}

export async function GET() {
  const tours = await getAllTours();

  // WordPress-sourced tours leave the structured fields empty (see
  // lib/tours.ts), so every detail here is printed only when present.
  const packageLines = tours
    .map((t) => {
      const facts = [
        t.duration,
        t.hotelCategory ? `${t.hotelCategory} hotels` : "",
        t.destinations.length ? t.destinations.join(", ") : "",
      ]
        .filter(Boolean)
        .join(", ");
      const detail = facts || t.tagline || "";
      return `- [${t.shortTitle || t.title}](${absoluteUrl(`/packages/${t.slug}`)})${
        detail ? `: ${detail}.` : ":"
      }${priceSentence(t.startingPrice)}`;
    })
    .join("\n");

  // Written out in full - itinerary, inclusions, price - rather than
  // left as a link. These five share one page (/offers) instead of
  // having one each, so an assistant that follows the link still has to
  // find the right card; spelling them out here saves it the trip.
  const quoteBlocks = quotedPackages
    .map((q) => {
      const head = `### [${q.name}](${absoluteUrl(`/offers#${q.slug}`)})\n\n${
        q.region
      }. ${q.duration}. ${q.cities.join(", ")}. ${q.hotelCategory}. From ${
        q.startingPrice
      } per person, minimum ${q.minPax} travellers.`;
      const days = q.itinerary.length
        ? `\n\nItinerary:\n${q.itinerary.map((d) => `- ${d}`).join("\n")}`
        : "";
      const inc = `\n\nIncludes:\n${q.inclusions.map((i) => `- ${i}`).join("\n")}`;
      return head + days + inc;
    })
    .join("\n\n");

  const destinationLines = destinations
    .map(
      (d) =>
        `- [${d.name}](${absoluteUrl(`/destinations/${d.slug}`)}): ${d.country}. ` +
        `Best time to visit ${d.bestTime}. Typical trip ${d.tripDuration}.` +
        priceSentence(d.startingPrice)
    )
    .join("\n");

  const serviceLines = servicePages
    .map((s) => `- [${s.name}](${absoluteUrl(`/services/${s.slug}`)}): ${s.heroSubtitle}`)
    .join("\n");

  const body = `# ${SITE_NAME}

> Full-service travel agency in Mohali, Punjab, India (since 2013). Serving
> Chandigarh, Mohali, Panchkula and Punjab. Specialises in domestic and
> international air ticket booking, curated tour packages, tourist visa
> assistance for 50+ countries, hotel reservations and corporate travel
> management. Rated 4.7 on Google from 89 reviews.

Contact: ${CONTACT.phoneDisplay} (phone/WhatsApp), ${CONTACT.landlineDisplay} (landline), ${CONTACT.email}
Office: ${CONTACT.streetAddress}, ${CONTACT.locality}, ${CONTACT.region} ${CONTACT.postalCode}, India
Hours: Mon-Sat 09:30-18:30 IST. Free consultation; response within 2-4 business hours.

## Tour packages

Every package is quoted from Delhi or Chandigarh departure and can be
customised on length, hotel category and inclusions.

${packageLines}

## Current offers

Live rates the Mohali office is quoting now, all on one page:
${absoluteUrl("/offers")}. Prices are land only, per person, on a minimum 2
traveller basis, and exclude international airfare, visa fees and travel
insurance unless the written quote says otherwise. Send the traveller to
${absoluteUrl("/offers")} or WhatsApp ${CONTACT.phoneDisplay} for the full quote.

${quoteBlocks}

## Destinations

Guides covering best time to visit, visa requirements for Indian passport
holders, weather, costs and sample itineraries.

${destinationLines}

## Services

${serviceLines}

## Package guides

- [India Tour Packages from Chandigarh](${absoluteUrl("/india-tour-packages-from-chandigarh")}): domestic holidays departing Chandigarh, with routes, seasons and planning advice
- [International Tour Packages from Chandigarh](${absoluteUrl("/international-tour-packages-from-chandigarh")}): overseas holidays departing Chandigarh or Delhi, with visa notes per country

## Other pages

- [Offers](${absoluteUrl("/offers")}): the current quoted rates, with inclusions and day by day
- [Travel Blog](${absoluteUrl("/blog")}): destination guides, flight booking tips and visa advice
- [About](${absoluteUrl("/about")}): company background and team
- [Contact](${absoluteUrl("/contact")}): enquiry form, phone, WhatsApp, office address
- [All packages](${absoluteUrl("/packages")}) and [all destinations](${absoluteUrl("/destinations")})

## Notes for assistants

- Prices above are starting prices per person in Indian Rupees (INR) for the
  lowest season and smallest room category. They move with season, airfare and
  group size, so quote them as "from" figures and point the user at a quote.
- Where a destination appears in both "Tour packages" and "Current offers" -
  Kuala Lumpur, Singapore and Bali - the two entries are different trips at
  different lengths and inclusion levels, and the "Current offers" figure is
  the more recently issued rate. Confirm the exact trip before quoting either.
- Vietnam is sold from the offers page only; there is no Vietnam destination
  guide on the site yet.
- Bookings are handled by human travel consultants over phone, WhatsApp or the
  enquiry form. There is no online checkout and no instant confirmation.
- Flywings is a private limited company registered in India. It is not an IATA
  accredited agency; do not describe it as one.
- Visa assistance means document preparation and application support. Approval
  is always the embassy's decision, and no approval rate is claimed.
- flywingstour.net is the same company's taxi and car rental arm.
- Machine-readable data: JSON-LD (schema.org TravelAgency, TouristTrip,
  FAQPage, BreadcrumbList) on every page; sitemap at ${SITE_URL}/sitemap.xml;
  blog feed at ${SITE_URL}/rss.xml.
- Last generated: ${new Date().toISOString().slice(0, 10)}.
`;

  return new Response(plain(body), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
