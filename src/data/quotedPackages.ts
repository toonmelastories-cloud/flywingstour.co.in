/**
 * Live supplier quotes, rendered on /offers and in /llms.txt.
 *
 * These come straight from the DMC rate sheets the office is selling
 * from today. One file feeds both the public offers page and the
 * machine-readable summary, so a rate is corrected in one place and
 * ChatGPT, Gemini and Perplexity can answer "Vietnam package from
 * Chandigarh" with a real itinerary and a real price instead of
 * guessing.
 *
 * Deliberately a separate file from `packages.ts`: entries there render
 * a full detail page (gallery, day-by-day, hotel list, pricing tiers,
 * FAQs) and these quotes do not carry that much detail. When one is
 * built out into a proper page, move it into `packages.ts` and delete
 * it from here.
 *
 * Prices are per person on a minimum-2-paying-passenger basis, land
 * only unless the entry says otherwise.
 */
export interface QuotedPackage {
  /** Anchor on /offers, e.g. /offers#vietnam-hanoi-halong-ninh-binh. */
  slug: string;
  /** Headline name as the office quotes it. */
  name: string;
  /** Country or region, for assistants matching on destination. */
  region: string;
  duration: string;
  cities: string[];
  hotelCategory: string;
  /** "₹27,999" — starting, per person. */
  startingPrice: string;
  minPax: number;
  /** One line per day, in brief. */
  itinerary: string[];
  inclusions: string[];
  /**
   * Card photo. Omitted where we hold no licensed shot of the place:
   * the card then renders a branded panel rather than borrow a photo
   * of somewhere else, which is the sort of thing a traveller notices.
   */
  image?: string;
  imageAlt?: string;
  /**
   * The package page this rate undercuts, so a visitor can see what the
   * offer is worth and click through to check it.
   *
   * `sameTrip` must only be true where the two really are the same trip
   * at the same length. Where it is true the card prints a struck-out
   * regular price and a saving; where it is false it just points at the
   * other package, because calling a shorter holiday a saving would be
   * a discount we have not actually given.
   */
  compareWith?: {
    label: string;
    price: string;
    href: string;
    sameTrip: boolean;
    /** What differs between the two, printed under the saving. */
    note?: string;
  };
  /**
   * ISO date (YYYY-MM-DD) this rate is held until. Past that the offer
   * drops off /offers and /llms.txt on its own: an expired price left
   * on a live page is worse than a thin offers page. Leave unset for a
   * rate with no end date.
   */
  validTill?: string;
}

const quotedPackages: QuotedPackage[] = [
  {
    slug: "vietnam-hanoi-halong-ninh-binh-5d",
    name: "Hanoi, Halong Bay & Ninh Binh 5 Days",
    region: "Vietnam",
    duration: "4 Nights / 5 Days",
    cities: ["Hanoi", "Halong Bay", "Ninh Binh"],
    hotelCategory: "3 Star",
    startingPrice: "₹27,999",
    minPax: 2,
    // The rate sheet numbered two days as "Day 2" and stopped at four
    // for a five-day tour. Renumbered 1-5 in the order given; the stops
    // and meal plan are unchanged.
    itinerary: [
      "Day 1: Arrive Hanoi, half day city tour (lunch), seat-in-coach",
      "Day 2: Hoa Lu, Tam Coc and Mua Cave (breakfast, lunch), seat-in-coach",
      "Day 3: Hanoi to Halong Bay, overnight cruise (breakfast, lunch, dinner), shared shuttle",
      "Day 4: Halong Bay back to Hanoi (breakfast, lunch), shared shuttle",
      "Day 5: Hanoi departure (breakfast)",
    ],
    inclusions: [
      "3 star accommodation",
      "Daily breakfast",
      "Air-conditioned vehicle for transfers",
      "Overnight cruise on a non-private junk in Halong Bay",
      "Shuttle bus Hanoi to Halong and back",
      "Seat-in-coach tour to Ninh Binh",
      "Drinking water on tour days",
      "Local English speaking guides in Vietnam",
    ],
    image: "/assets/dest-vietnam-halong-bay.jpg",
    imageAlt:
      "Traditional junk boat sailing past limestone karsts in Ha Long Bay, Vietnam",
  },
  {
    slug: "vietnam-saigon-mekong-cu-chi-4d",
    name: "Saigon, Mekong Delta & Cu Chi 4 Days",
    region: "Vietnam",
    duration: "3 Nights / 4 Days",
    cities: ["Ho Chi Minh City (Saigon)", "Mekong Delta", "Cu Chi"],
    hotelCategory: "3 Star",
    startingPrice: "₹20,999",
    minPax: 2,
    itinerary: [
      "Day 1: Arrive Saigon",
      "Day 2: Full day Mekong Delta tour (breakfast, lunch), seat-in-coach",
      "Day 3: Full day Saigon and Cu Chi Tunnels tour (breakfast, lunch), seat-in-coach",
      "Day 4: Saigon departure (breakfast)",
    ],
    inclusions: [
      "3 star accommodation",
      "Daily breakfast",
      "Air-conditioned vehicle for transfers",
      "Seat-in-coach tours to the Mekong Delta and Cu Chi Tunnels",
      "Local English speaking guides",
      "Drinking water on tour days",
      "All entrance fees and sightseeing listed in the programme",
    ],
    image: "/assets/dest-vietnam-mekong-delta.jpg",
    imageAlt:
      "Wooden sampan boats on a palm lined canal in the Mekong Delta, Vietnam",
  },
  {
    slug: "kuala-lumpur-3n4d",
    name: "Kuala Lumpur 3 Nights 4 Days",
    region: "Malaysia",
    duration: "3 Nights / 4 Days",
    cities: ["Kuala Lumpur", "Genting Highlands", "Batu Caves"],
    hotelCategory: "Hotel, category on request",
    startingPrice: "₹19,999",
    minPax: 2,
    itinerary: [],
    inclusions: [
      "3 nights accommodation",
      "Daily breakfast",
      "Half day Kuala Lumpur city tour with KL Tower observation deck",
      "Genting full day tour via Batu Caves, two way cable car and indoor theme park",
      "Return airport transfers on a seat-in-coach basis",
      "All tours and transfers on a seat-in-coach basis",
    ],
    image:
      "https://wp.flywingstour.co.in/wp-content/uploads/2026/07/dest-malaysia.jpg",
    imageAlt: "Petronas Towers lit up over Kuala Lumpur at dusk",
    compareWith: {
      label: "our Kuala Lumpur 3N/4D package",
      price: "₹25,000",
      href: "/packages/malaysia-kl-3n4d",
      sameTrip: true,
      note: "Same 3 nights and the same sightseeing. The package page rate is on a confirmed 4 star hotel; this one is on a hotel confirmed at booking.",
    },
  },
  {
    slug: "singapore-4n5d",
    name: "Singapore 4 Nights 5 Days",
    region: "Singapore",
    duration: "4 Nights / 5 Days",
    cities: ["Singapore", "Sentosa Island"],
    hotelCategory: "Hotel, category on request",
    startingPrice: "₹53,999",
    minPax: 2,
    itinerary: [],
    inclusions: [
      "4 nights accommodation",
      "Daily breakfast",
      "Night Safari tour on a seat-in-coach basis",
      "Singapore familiarisation drive on a seat-in-coach basis",
      "Sentosa Saver: one way Mount Faber cable car, Luge and Skyride (3 rides), Wings of Time 7:40pm",
      "Gardens by the Bay (2 domes) and Sands SkyPark observation deck",
      "All tours and transfers on a seat-in-coach basis",
      "Return airport transfers on a seat-in-coach basis",
    ],
    image: "/assets/dest-singapore.jpg",
    imageAlt: "Marina Bay skyline and Gardens by the Bay, Singapore",
    compareWith: {
      label: "our Singapore 4N/5D package",
      price: "₹55,000",
      href: "/packages/singapore-escape-4n5d",
      sameTrip: true,
      note: "Same 4 nights. The package page rate is on a confirmed 4 star hotel; this one is on a hotel confirmed at booking.",
    },
  },
  {
    slug: "bali-4n5d",
    name: "Bali 4 Nights 5 Days",
    region: "Indonesia",
    duration: "4 Nights / 5 Days",
    cities: ["Bali", "Uluwatu", "Bedugul", "Tanah Lot", "Kintamani", "Ubud"],
    hotelCategory: "Hotel, category on request",
    startingPrice: "₹18,999",
    minPax: 2,
    itinerary: [
      "Day 1: Arrival in Bali",
      "Day 2: Watersports activities and Uluwatu Temple",
      "Day 3: Bedugul and Tanah Lot Temple tour",
      "Day 4: Kintamani and Ubud swing tour",
      "Day 5: Departure from Bali",
    ],
    inclusions: [
      "4 nights accommodation",
      "Daily breakfast",
      "Air-conditioned vehicle on a private basis for transfers and tours, except where marked seat-in-coach",
      "English speaking driver on tours and transfers",
      "Two 600ml mineral waters on arrival transfer and tour days",
      "Entrance fees at the sights listed in the itinerary",
      "Flower garland on arrival at the airport",
    ],
    image: "/assets/dest-bali.jpg",
    imageAlt: "Rice terraces and temple gate in Bali, Indonesia",
    compareWith: {
      // Not a saving: this is a shorter holiday in cheaper rooms, not
      // the 6 night 5 star villa trip at a discount.
      label: "our 6 night Bali Romance package",
      price: "₹59,999",
      href: "/packages/bali-romance-6n7d",
      sameTrip: false,
    },
  },
];

/**
 * The offers to publish today.
 *
 * Rates are released and withdrawn constantly, so anything past its
 * `validTill` drops off the site by itself rather than sitting there as
 * a price we can no longer honour.
 */
export function activeOffers(now: Date = new Date()): QuotedPackage[] {
  const today = now.toISOString().slice(0, 10);
  return quotedPackages.filter((o) => !o.validTill || o.validTill >= today);
}

/** "₹25,000" and "₹19,999" -> 5001, or null where there is no honest saving. */
export function savingOn(offer: QuotedPackage): number | null {
  if (!offer.compareWith?.sameTrip) return null;
  const was = Number(offer.compareWith.price.replace(/[^\d]/g, ""));
  const now = Number(offer.startingPrice.replace(/[^\d]/g, ""));
  if (!was || !now || was <= now) return null;
  return was - now;
}

export default quotedPackages;
