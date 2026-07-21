/**
 * Content for the "India Tour Packages from Chandigarh" (P2) pillar page.
 * Mirrors pillar-international.ts — same no-prices rule, same
 * data/component split so the server page (JSON-LD) and client
 * component render from one source.
 */

export interface DomesticRegionRow {
  region: string;
  /** Links to /destinations/[slug] when a real destination page exists, else undefined. */
  destinationSlug?: string;
  duration: string;
  howToReach: string;
  bestMonths: string;
}

export const DOMESTIC_REGIONS: DomesticRegionRow[] = [
  {
    region: "Kashmir Valley",
    destinationSlug: "kashmir",
    duration: "4–6 Days",
    howToReach: "Flight to Srinagar (via Delhi) or road via Jammu, NH44",
    bestMonths: "March – October (peak); December – February (snow)",
  },
  {
    region: "Vaishno Devi Yatra",
    duration: "2–3 Days",
    howToReach: "Flight/train to Jammu, then road to Katra",
    bestMonths: "March – October (avoid peak monsoon landslides)",
  },
  {
    region: "Amritsar & Golden Temple",
    duration: "1–2 Days",
    howToReach: "Direct flight to Amritsar (ATQ) or ~230 km road from Chandigarh",
    bestMonths: "October – March",
  },
  {
    region: "Shimla–Manali Himachal Circuit",
    duration: "4–6 Days",
    howToReach: "Road from Chandigarh, 3–7 hours depending on the stop",
    bestMonths: "March – June, September – November; December – February for snow",
  },
];

/** A "region we cover" card for areas without a dedicated bookable package yet — links to the matching blog + a quote CTA instead of a package page. */
export interface DomesticGuideCard {
  title: string;
  description: string;
  href: string;
  cta: string;
}

export const DOMESTIC_GUIDES: DomesticGuideCard[] = [
  {
    title: "Vaishno Devi Package from Chandigarh & Amritsar",
    description:
      "Complete yatra planning — Katra travel, trek vs pony vs helicopter, and the Punjab-to-Jammu route.",
    href: "/blog/vaishno-devi-package-from-chandigarh",
    cta: "Read the Yatra Guide",
  },
  {
    title: "Golden Temple Amritsar: Visitor Guide",
    description:
      "Timings, langar, the Wagah Border ceremony, and how to combine it with a Kashmir or international trip.",
    href: "/blog/golden-temple-amritsar-guide",
    cta: "Read the Amritsar Guide",
  },
  {
    title: "Weekend Getaways from Chandigarh",
    description:
      "10 best short trips by distance — Morni Hills, Kasauli, Barog, Chail, Shimla and beyond.",
    href: "/blog/weekend-getaways-from-chandigarh",
    cta: "See the Getaway List",
  },
];

export const PILLAR_DOMESTIC_FAQS: { question: string; answer: string }[] = [
  {
    question: "How much does a domestic tour package from Chandigarh cost?",
    answer:
      "It depends on the destination, season, hotel category and mode of transport (flight vs road vs helicopter for yatras) — which is why we quote every trip individually. Share your plan on +91 99143 10333 for an itemised quote within 24 hours.",
  },
  {
    question: "Which Indian destinations do you cover from Chandigarh?",
    answer:
      "Kashmir (Srinagar, Gulmarg, Pahalgam) is our flagship packaged destination, alongside custom-planned trips to Vaishno Devi, Amritsar, and the Himachal hill circuit (Shimla, Manali, Kasauli, Chail and more). Tell us your dream and we'll build the itinerary.",
  },
  {
    question: "Do I need any documents for domestic travel?",
    answer:
      "No visa or passport is required — any government-issued photo ID (Aadhaar, driving licence, voter card) works for flights, hotels and yatra registration for every family member.",
  },
  {
    question: "What is the best time to visit Kashmir from Chandigarh?",
    answer:
      "Kashmir works in every season: March–April for tulip blooms, May–August for the classic green-meadow escape, September–October for autumn colours, and December–February for snow and skiing in Gulmarg. Read our full Kashmir guide for a month-by-month breakdown.",
  },
  {
    question: "Can you arrange helicopter bookings for Vaishno Devi?",
    answer:
      "Yes — we arrange the full range from trek/pony options to helicopter bookings for Vaishno Devi, timed around the Katra travel and your available days.",
  },
  {
    question: "Can I combine Amritsar with a Kashmir or international trip?",
    answer:
      "Very easily — Amritsar sits on the way to Kashmir by road, and its international airport (ATQ) also connects onward to Dubai, London and more, so many of our clients combine a Golden Temple visit with either leg of their trip.",
  },
  {
    question: "Do domestic packages include transport and hotels?",
    answer:
      "Yes — every Flywings domestic package includes transport (flights and/or private cab as chosen), hotel stays, transfers, and sightseeing with a local driver, quoted as one itemised price with no hidden charges.",
  },
];
