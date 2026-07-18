const destDubai = "/assets/dest-dubai.jpg";
const destThailand = "/assets/dest-thailand.jpg";
const destBali = "/assets/dest-bali.jpg";
const destKashmir = "/assets/dest-kashmir.jpg";
const destMaldives = "/assets/dest-maldives.jpg";
const destSingapore = "/assets/dest-singapore.jpg";
const destMalaysia = "https://wp.flywingstour.co.in/wp-content/uploads/2026/07/dest-malaysia.jpg";
const destAlmaty = "https://wp.flywingstour.co.in/wp-content/uploads/2026/07/dest-almaty.jpg";

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  activities: string[];
  meals?: string;
  hotel?: string;
}

export interface HotelDetail {
  name: string;
  stars: number;
  location: string;
  roomType: string;
  upgradeOption?: string;
}

export interface PricingTier {
  label: string;
  price: string;
  originalPrice: string;
  description: string;
}

export interface PackageData {
  slug: string;
  destinationSlug: string;
  title: string;
  shortTitle: string;
  tagline: string;
  heroImages: string[];
  rating: number;
  reviewCount: number;
  duration: string;
  nights: number;
  days: number;
  destinations: string[];
  hotelCategory: string;
  transferIncluded: boolean;
  mealsIncluded: string;
  startingPrice: string;
  originalPrice: string;
  badge?: string;
  overview: string;
  itinerary: ItineraryDay[];
  inclusions: string[];
  exclusions: string[];
  hotels: HotelDetail[];
  pricingTiers: PricingTier[];
  childPrice?: string;
  emiAvailable: boolean;
  cancellationPolicy: string[];
  faqs: { question: string; answer: string }[];
  relatedSlugs: string[];
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
}

const packages: PackageData[] = [
  // ─── DUBAI LUXURY ──────────────────────────────────────────
  {
    slug: "dubai-luxury-5n6d",
    destinationSlug: "dubai",
    title: "Dubai 5 Nights / 6 Days Luxury Tour Package",
    shortTitle: "Dubai Luxury 5N/6D",
    tagline: "Experience the pinnacle of luxury — world-class hotels, desert safaris & iconic skyline views",
    heroImages: ["/assets/pkg-dubai-luxury.jpg", destDubai],
    rating: 4.9,
    reviewCount: 387,
    duration: "5 Nights / 6 Days",
    nights: 5,
    days: 6,
    destinations: ["Dubai", "Abu Dhabi (optional)"],
    hotelCategory: "5 Star",
    transferIncluded: true,
    mealsIncluded: "Breakfast + Welcome Dinner",
    startingPrice: "₹79,999",
    originalPrice: "₹1,00,000",
    badge: "Best Seller",
    overview:
      "Embark on an extraordinary journey to Dubai, the jewel of the Middle East. This 5 Nights / 6 Days Dubai luxury package from India combines five-star comfort with the city's most iconic experiences. Begin with a grand arrival, explore the record-breaking Burj Khalifa, glide through the golden sands on a thrilling desert safari, and sail the Dubai Marina on a Dhow Cruise. Our expert team handles your visa, flights, transfers, and accommodation — so you simply arrive and be amazed. Perfect for couples, families, and first-time visitors seeking the very best of Dubai.",
    itinerary: [
      {
        day: 1,
        title: "Arrival in Dubai — City Orientation",
        description:
          "Welcome to the city of gold! Arrive at Dubai International Airport and enjoy a seamless meet-and-greet by your Flywings representative. Transfer to your 5★ hotel and unwind before a leisurely stroll through old Dubai.",
        activities: [
          "Airport meet & greet and VIP transfer",
          "Check-in at 5★ hotel (early check-in subject to availability)",
          "Dubai Creek walk & abra boat ride",
          "Gold Souk & Spice Market exploration",
          "Welcome dinner at a rooftop restaurant",
        ],
        meals: "Welcome Dinner",
        hotel: "JW Marriott / Sofitel Dubai / Similar",
      },
      {
        day: 2,
        title: "Modern Dubai — Burj Khalifa & Downtown",
        description:
          "Explore the ultra-modern face of Dubai, from the world's tallest building to the world's largest mall and dancing fountains.",
        activities: [
          "Burj Khalifa 124th floor 'At the Top' experience",
          "Dubai Mall & KidZania (optional for families)",
          "Dubai Fountain Show (evening spectacle)",
          "Souk Al Bahar for dining and shopping",
        ],
        meals: "Breakfast",
        hotel: "JW Marriott / Sofitel Dubai / Similar",
      },
      {
        day: 3,
        title: "Arabian Desert Safari — Golden Sands Adventure",
        description:
          "A morning at leisure followed by an unforgettable afternoon deep in the Arabian desert — dunes, camels, culture, and cuisine under the stars.",
        activities: [
          "Morning spa or leisure (hotel amenities)",
          "Afternoon dune bashing in a 4x4 (60 minutes)",
          "Camel riding & sandboarding",
          "Henna painting & falconry experience",
          "Lavish BBQ dinner with live belly dance & Tanoura show",
        ],
        meals: "Breakfast + BBQ Dinner",
        hotel: "JW Marriott / Sofitel Dubai / Similar",
      },
      {
        day: 4,
        title: "Palm Jumeirah, Marina & Dhow Cruise",
        description:
          "Discover Dubai's iconic man-made wonder — the Palm Jumeirah — then relax in the glamorous Marina before a magical evening on the water.",
        activities: [
          "Palm Jumeirah monorail & Boardwalk stroll",
          "Atlantis Aquaventure (optional upgrade)",
          "Dubai Marina & JBR The Walk",
          "2-hour Dhow Cruise with live music & dinner",
        ],
        meals: "Breakfast + Dhow Cruise Dinner",
        hotel: "JW Marriott / Sofitel Dubai / Similar",
      },
      {
        day: 5,
        title: "Global Village, Shopping & Leisure",
        description:
          "Spend your penultimate day exploring the world's largest outdoor entertainment destination and wrapping up shopping.",
        activities: [
          "Global Village (Oct–Apr season) or IMG Worlds of Adventure",
          "Miracle Garden (seasonal, Oct–May)",
          "City Centre Mirdif or Mall of Emirates",
          "Ski Dubai (optional — world's largest indoor ski resort)",
        ],
        meals: "Breakfast",
        hotel: "JW Marriott / Sofitel Dubai / Similar",
      },
      {
        day: 6,
        title: "Departure — Farewell Dubai",
        description:
          "Savor a leisurely breakfast at your hotel, do any last-minute souvenir shopping, and transfer to Dubai International Airport for your flight home.",
        activities: [
          "Buffet breakfast at hotel",
          "Hotel checkout & luggage storage (if needed)",
          "Last-minute Duty Free shopping at DXB airport",
          "Departure transfer to Dubai International Airport",
        ],
        meals: "Breakfast",
      },
    ],
    inclusions: [
      "Return economy class flights from India (Delhi / Mumbai / Chennai)",
      "5★ hotel accommodation for 5 nights with daily breakfast",
      "UAE tourist visa fees and processing (30 days)",
      "All airport and hotel transfers in a private air-conditioned vehicle",
      "Desert safari with 4x4 dune bashing, camel ride & BBQ dinner",
      "Burj Khalifa 124th floor 'At the Top' entry ticket",
      "Dhow Cruise dinner with live entertainment",
      "Dubai city tour with English-speaking guide",
      "Welcome dinner on arrival night",
      "24/7 Flywings travel helpline throughout the trip",
      "All taxes & service charges included",
    ],
    exclusions: [
      "Travel insurance (strongly recommended — available on request)",
      "Lunches unless specifically mentioned in the itinerary",
      "Optional tours: Aquaventure, Global Village entry, Ski Dubai",
      "Personal shopping and expenses",
      "Tips and gratuities for guides and drivers",
      "Early check-in or late checkout (subject to hotel availability)",
      "Any increase in airline fuel surcharges after booking",
    ],
    hotels: [
      {
        name: "JW Marriott Marquis Dubai",
        stars: 5,
        location: "Business Bay, near Dubai Mall",
        roomType: "Deluxe King Room",
        upgradeOption: "Upgrade to Corner Suite with Burj Khalifa view (+₹8,000/night)",
      },
      {
        name: "Sofitel Dubai The Palm",
        stars: 5,
        location: "Palm Jumeirah, Dubai",
        roomType: "Prestige Room with Pool View",
        upgradeOption: "Upgrade to Sea-View Suite (+₹10,000/night)",
      },
    ],
    pricingTiers: [
      {
        label: "Per Person (Twin Sharing)",
        price: "₹79,999",
        originalPrice: "₹1,00,000",
        description: "Most popular option — 2 adults sharing one room",
      },
      {
        label: "Per Person (Triple Sharing)",
        price: "₹72,999",
        originalPrice: "₹92,000",
        description: "3 adults sharing — ideal for friends & siblings",
      },
      {
        label: "Solo Traveler (Single Room)",
        price: "₹1,05,999",
        originalPrice: "₹1,30,000",
        description: "Private room for solo adventurers",
      },
      {
        label: "Group (10+ Pax)",
        price: "₹69,999",
        originalPrice: "₹90,000",
        description: "Best group rates with dedicated group escort",
      },
    ],
    childPrice: "₹35,000 (age 2–11, sharing parents' room)",
    emiAvailable: true,
    cancellationPolicy: [
      "Free cancellation up to 30 days before departure — full refund",
      "15–29 days before departure: 25% cancellation fee applies",
      "7–14 days before departure: 50% cancellation fee applies",
      "Less than 7 days before departure or no-show: 100% cancellation fee",
      "Visa rejection: visa fee non-refundable; rest of payment refunded in full",
      "Date changes: one free date change up to 30 days before departure",
    ],
    faqs: [
      {
        question: "What is included in this Dubai 5N/6D package?",
        answer:
          "This package includes return economy flights from India, 5★ hotel accommodation for 5 nights with daily breakfast, Dubai tourist visa, all airport and hotel transfers, desert safari with BBQ dinner, Burj Khalifa entry, Dhow Cruise dinner, and 24/7 Flywings support.",
      },
      {
        question: "Is the UAE visa included in the package price?",
        answer:
          "Yes! The UAE 30-day tourist visa fee and processing is fully included in the package price. Our team submits your visa application 7–10 days before departure. You just need to provide your passport and required documents.",
      },
      {
        question: "Can I customize this Dubai package?",
        answer:
          "Absolutely! We offer flexible customization — add Abu Dhabi city tour, upgrade to a water-view suite, extend your stay, or swap activities. Contact our travel experts and we'll build a bespoke itinerary tailored to your preferences.",
      },
      {
        question: "What is the cancellation and refund policy?",
        answer:
          "You get a full refund if you cancel 30+ days before departure. Partial cancellations apply from 15–29 days (25%), 7–14 days (50%), and 100% is charged for cancellations within 7 days. We also allow one free date change up to 30 days before travel.",
      },
      {
        question: "Is Dubai good for a honeymoon?",
        answer:
          "Dubai is one of the world's top honeymoon destinations! Luxury resorts on Palm Jumeirah, private beach dinners, couples spa treatments, and romantic desert camps make it ideal for newlyweds. Ask us about our special honeymoon add-ons.",
      },
      {
        question: "Are there EMI options available?",
        answer:
          "Yes! We offer zero-cost EMI options on select credit cards (SBI, HDFC, ICICI, Axis). You can pay in 3, 6, or 12 monthly installments. Contact our team for the latest EMI offers.",
      },
    ],
    relatedSlugs: ["thailand-explorer-7n8d", "maldives-luxury-4n5d", "bali-romance-6n7d"],
    metaTitle: "Dubai 5 Nights Tour Package Price | Flywings Tour & Packages Pvt Ltd",
    metaDescription:
      "Book Dubai 5 Nights 6 Days luxury tour package from India ₹79,999. Includes 5★ hotel, flights, desert safari, Burj Khalifa & visa. Get a free quote today!",
    keywords: [
      "dubai 5 nights package",
      "dubai tour package from india",
      "dubai 5n 6d package price",
      "dubai luxury tour package",
      "dubai holiday package",
    ],
  },

  // ─── DUBAI CLASSIC ─────────────────────────────────────────
  {
    slug: "dubai-classic-4n5d",
    destinationSlug: "dubai",
    title: "Dubai 4 Nights / 5 Days Classic Tour Package",
    shortTitle: "Dubai Classic 4N/5D",
    tagline: "The best of Dubai in 5 days — iconic landmarks, desert thrills & world-class shopping",
    heroImages: ["/assets/pkg-dubai-classic.jpg", destDubai],
    rating: 4.8,
    reviewCount: 512,
    duration: "4 Nights / 5 Days",
    nights: 4,
    days: 5,
    destinations: ["Dubai"],
    hotelCategory: "4 Star",
    transferIncluded: true,
    mealsIncluded: "Daily Breakfast",
    startingPrice: "₹33,000",
    originalPrice: "",
    badge: "Best Value",
    overview:
      "Experience the best of Dubai in a perfectly paced 4 Nights / 5 Days itinerary — the iconic Burj Khalifa and Dubai Mall, a Marina dinner cruise, the golden desert safari with BBQ dinner, and a guided city tour, with your UAE visa and private airport transfers handled end to end. This is a land package: airfare is quoted separately by our ticketing desk at the day's best fare from Chandigarh or Delhi, so you always fly at the current lowest price instead of a padded package fare.",
    itinerary: [
      {
        day: 1,
        title: "Arrival in Dubai — Private Transfer to Hotel",
        description: "Land in Dubai and settle in — your driver is waiting.",
        activities: [
          "Meet & greet at Dubai International Airport",
          "Private transfer to your 4★ hotel",
          "Hotel check-in and evening at leisure",
          "Optional first stroll — Deira souks or Dubai Mall",
        ],
        meals: "—",
        hotel: "Handpicked 4★ Hotel",
      },
      {
        day: 2,
        title: "Half-Day City Tour + Marina Dinner Cruise",
        description: "See Dubai's landmarks by day and dine on the water by night.",
        activities: [
          "Half-day Dubai city tour (shared/SIC basis)",
          "Jumeirah Mosque, Dubai Frame & Palm photo stops",
          "Evening Marina cruise with buffet dinner",
          "Skyline views from the water",
        ],
        meals: "Breakfast + Dinner (cruise)",
        hotel: "Handpicked 4★ Hotel",
      },
      {
        day: 3,
        title: "Desert Safari with BBQ Dinner & Tanura Show",
        description: "The day every group rates highest — dunes, camels and a Bedouin-camp evening.",
        activities: [
          "Morning at leisure",
          "4x4 dune bashing in the desert",
          "Camel rides, sandboarding & henna",
          "BBQ dinner with live Tanura show",
        ],
        meals: "Breakfast + Dinner (BBQ)",
        hotel: "Handpicked 4★ Hotel",
      },
      {
        day: 4,
        title: "Dubai Mall, Burj Khalifa & Fountain Show",
        description: "Up the world's tallest tower, then the world's biggest mall.",
        activities: [
          "Burj Khalifa 'At the Top' — 124th floor (non-prime)",
          "Dubai Mall & aquarium viewing panel",
          "Dubai Fountain show after sunset",
          "Return transfer included (SIC basis)",
        ],
        meals: "Breakfast",
        hotel: "Handpicked 4★ Hotel",
      },
      {
        day: 5,
        title: "Departure — Private Airport Drop",
        description: "Breakfast, check-out and your private transfer to the airport.",
        activities: [
          "Breakfast at the hotel",
          "Hotel check-out",
          "Private transfer to Dubai International Airport",
          "Duty-free shopping before departure",
        ],
        meals: "Breakfast",
      },
    ],
    inclusions: [
      "4 nights accommodation in a 4★ hotel with breakfast",
      "Dubai Airport to hotel private transfer",
      "Hotel to Dubai Airport private transfer",
      "Dubai city tour (SIC basis)",
      "Marina cruise with dinner (SIC basis)",
      "Desert safari with BBQ dinner & Tanura show (SIC basis)",
      "Dubai Mall + Burj Khalifa 124th floor (non-prime) with Fountain show — ticket & transfer (SIC basis)",
      "UAE tourist visa",
      "All hotel taxes (excluding Tourism Dirham / events / exhibitions / festivals)",
      "GST included",
      "24/7 Flywings support",
    ],
    exclusions: [
      "International & domestic airfare (quoted separately at the day's best fare)",
      "Tourism Dirham fee (payable directly at the hotel)",
      "Lunches, except where specifically mentioned",
      "Personal expenses",
      "Porterage & tips",
      "Laundry & telephone charges",
      "Optional sightseeing",
      "Travel insurance",
      "Early check-in / late check-out",
      "Peak season surcharges",
      "Expenses arising from flight delays, weather conditions, or force majeure",
      "Anything not specifically mentioned under Inclusions",
    ],
    hotels: [
      {
        name: "Handpicked 4★ Hotel — Central Dubai",
        stars: 4,
        location: "Deira / Bur Dubai area (property confirmed at booking)",
        roomType: "Standard Double / Twin Room",
        upgradeOption: "5★ hotel upgrade available on request",
      },
    ],
    pricingTiers: [
      {
        label: "Per Adult (Twin Sharing)",
        price: "₹33,000",
        originalPrice: "",
        description:
          "Starting price — final quote depends on travel dates, hotel and season; airfare quoted separately",
      },
    ],
    childPrice: undefined,
    emiAvailable: true,
    cancellationPolicy: [
      "Free cancellation up to 30 days before departure — full refund",
      "15–29 days before departure: 25% cancellation fee",
      "7–14 days before departure: 50% cancellation fee",
      "Less than 7 days or no-show: 100% cancellation fee",
      "Visa rejection: visa fee non-refundable; rest refunded",
    ],
    faqs: [
      {
        question: "What is included in this Dubai 4N/5D package?",
        answer:
          "4 nights in a 4★ hotel with breakfast, private airport transfers both ways, Dubai city tour, Marina dinner cruise, desert safari with BBQ dinner and Tanura show, Burj Khalifa 124th floor with Dubai Mall and Fountain show, UAE visa, hotel taxes (except Tourism Dirham) and GST. See the full inclusions list above.",
      },
      {
        question: "Are flights included in the package price?",
        answer:
          "No — this is a land package, so airfare is quoted separately. That works in your favour: our ticketing desk books the day's lowest fare from Chandigarh (direct IXC–Dubai) or Delhi at the time of booking, instead of padding a fixed fare into the package.",
      },
      {
        question: "What is the Tourism Dirham fee?",
        answer:
          "A small per-room, per-night city fee that Dubai hotels collect directly at check-in or check-out. It is set by the hotel's star category and is payable at the hotel, which is why it stays outside the package price.",
      },
      {
        question: "Can I upgrade to a 5★ hotel?",
        answer:
          "Yes. We offer easy upgrades to 5★ properties at additional cost. Contact our team to get a customized quote.",
      },
      {
        question: "What documents are needed for the UAE visa?",
        answer:
          "You'll need a valid Indian passport (6+ months validity), a passport-size photo with white background, and a PAN card copy. Our team files everything and guides you through each step — standard processing takes 3–4 working days.",
      },
    ],
    relatedSlugs: ["dubai-luxury-5n6d", "dubai-honeymoon-5n6d", "singapore-escape-4n5d"],
    metaTitle: "Dubai 4 Nights Tour Package from India | Flywings",
    metaDescription:
      "Dubai 4 Nights 5 Days tour package — 4★ hotel with breakfast, private transfers, desert safari, Marina dinner cruise, Burj Khalifa & UAE visa included. Get a free custom quote.",
    keywords: ["dubai 4 nights package", "dubai tour package", "cheap dubai package from india"],
  },

  // ─── DUBAI HONEYMOON ───────────────────────────────────────
  {
    slug: "dubai-honeymoon-5n6d",
    destinationSlug: "dubai",
    title: "Dubai Honeymoon Package 5 Nights / 6 Days",
    shortTitle: "Dubai Honeymoon 5N/6D",
    tagline: "A dream start to forever — luxury, romance & golden memories in Dubai",
    heroImages: ["/assets/pkg-dubai-honeymoon.jpg", destDubai],
    rating: 5.0,
    reviewCount: 203,
    duration: "5 Nights / 6 Days",
    nights: 5,
    days: 6,
    destinations: ["Dubai", "Palm Jumeirah"],
    hotelCategory: "5 Star Resort",
    transferIncluded: true,
    mealsIncluded: "Breakfast + Romantic Dinners",
    startingPrice: "₹89,999",
    originalPrice: "₹1,15,000",
    badge: "Romantic",
    overview:
      "Begin your forever with an extraordinary honeymoon in Dubai — the city of golden dreams. This exclusive 5 Nights / 6 Days Dubai honeymoon package is crafted for couples seeking romance, luxury, and memories that last a lifetime. Stay at a premium Palm Jumeirah resort, enjoy private beach dinners, couples spa retreats, Dhow Cruise under the stars, and the magical desert by night. Everything is arranged — you just need to be in love.",
    itinerary: [
      {
        day: 1,
        title: "Arrival — Romantic Welcome",
        description: "Arrive in Dubai and step into a world of romance and luxury.",
        activities: [
          "VIP airport pickup with honeymooner board",
          "Check-in at 5★ Palm Jumeirah beach resort",
          "Welcome fruit basket & rose petal turndown service",
          "Private beach sunset walk",
          "Romantic candlelit dinner at hotel restaurant",
        ],
        meals: "Welcome Dinner",
        hotel: "Atlantis The Palm / W Dubai – The Palm / Similar",
      },
      {
        day: 2,
        title: "Dubai Icons & Burj Khalifa",
        description: "Explore the most romantic spots of modern Dubai as a couple.",
        activities: [
          "Burj Khalifa 'At the Top' (sunset time slot)",
          "Dubai Mall & Souk Al Bahar",
          "Dubai Fountain show (most romantic in Dubai)",
          "Dinner at a rooftop restaurant with Burj views",
        ],
        meals: "Breakfast + Dinner",
        hotel: "Atlantis The Palm / Similar",
      },
      {
        day: 3,
        title: "Couples Spa & Leisure Day",
        description: "A day dedicated entirely to relaxation, connection, and pampering.",
        activities: [
          "90-minute couples spa treatment (aromatherapy + hot stone)",
          "Private pool time at hotel",
          "In-room gourmet dining (optional)",
          "Evening Dhow Cruise with live music & dinner",
        ],
        meals: "Breakfast + Dhow Cruise Dinner",
        hotel: "Atlantis The Palm / Similar",
      },
      {
        day: 4,
        title: "Desert Romance — Sunset & Stars",
        description: "Experience the magic of the Arabian desert — just the two of you.",
        activities: [
          "Private desert camp transfer",
          "Couples camel ride at sunset",
          "Dune bashing (private 4x4)",
          "Private BBQ dinner under the desert stars",
          "Stargazing with desert guide",
        ],
        meals: "Breakfast + Desert Dinner",
        hotel: "Atlantis The Palm / Similar",
      },
      {
        day: 5,
        title: "Aquaventure & Beach Day",
        description: "Spend your last full day making the most of Atlantis and the Palm's stunning beaches.",
        activities: [
          "Atlantis Aquaventure Waterpark (included)",
          "Private beach loungers",
          "Couple photo shoot on the beach (1 hour)",
          "Farewell dinner at signature restaurant",
        ],
        meals: "Breakfast + Farewell Dinner",
        hotel: "Atlantis The Palm / Similar",
      },
      {
        day: 6,
        title: "Departure — Goodbye Dubai",
        description: "Checkout, a leisurely breakfast, and your transfer to the airport.",
        activities: [
          "Late checkout (until 2 PM, subject to availability)",
          "Last souvenir shopping",
          "Airport transfer",
          "Departure",
        ],
        meals: "Breakfast",
      },
    ],
    inclusions: [
      "Return economy flights from India (upgradeable to Business Class)",
      "5★ Palm Jumeirah beach resort for 5 nights with breakfast",
      "UAE tourist visa fees and processing",
      "All airport, hotel & activity transfers in private luxury vehicle",
      "Atlantis Aquaventure passes for 2",
      "90-minute couples spa session",
      "Desert safari (private) with BBQ dinner",
      "Dhow Cruise dinner with live music",
      "Romantic candlelit welcome dinner",
      "Farewell dinner at signature restaurant",
      "Rose petal turndown & welcome fruit basket",
      "Couple beach photoshoot (1 hour, digital photos delivered)",
      "24/7 dedicated honeymoon concierge",
    ],
    exclusions: [
      "Travel insurance (recommended)",
      "Lunches",
      "Personal shopping and expenses",
      "Tips and gratuities",
      "Business class upgrade (available on request)",
      "Additional spa sessions",
    ],
    hotels: [
      {
        name: "Atlantis The Palm",
        stars: 5,
        location: "Palm Jumeirah, Dubai — beachfront",
        roomType: "Superior Room with Ocean View",
        upgradeOption: "Upgrade to Partial Atlantis Suite (+₹15,000/night)",
      },
      {
        name: "W Dubai – The Palm",
        stars: 5,
        location: "Palm Jumeirah, steps from the beach",
        roomType: "Wonderful Room with Palm View",
        upgradeOption: "Upgrade to Spectacular Suite (+₹12,000/night)",
      },
    ],
    pricingTiers: [
      {
        label: "Per Couple (Twin Room)",
        price: "₹89,999",
        originalPrice: "₹1,15,000",
        description: "Per couple — all inclusions as listed",
      },
      {
        label: "Business Class Upgrade",
        price: "₹1,29,999",
        originalPrice: "₹1,60,000",
        description: "Upgrade both flights to Business Class",
      },
    ],
    childPrice: undefined,
    emiAvailable: true,
    cancellationPolicy: [
      "Free cancellation up to 45 days before departure — full refund",
      "30–44 days before departure: 25% cancellation fee",
      "15–29 days before departure: 50% cancellation fee",
      "Less than 15 days or no-show: 100% cancellation fee",
      "Honeymoon add-ons (flowers, cakes, photoshoot) are non-refundable once arranged",
    ],
    faqs: [
      {
        question: "What romantic extras are included?",
        answer:
          "Your honeymoon package includes a romantic candlelit welcome dinner, rose petal turndown service, welcome fruit basket, couples spa session, and a couple beach photoshoot with digital photos.",
      },
      {
        question: "Can we request special room decorations?",
        answer:
          "Yes! We can arrange rose petal beds, balloon decorations, personalized cakes, and flower arrangements at your hotel room. Additional charges apply. Let us know your preferences and we'll make it magical.",
      },
      {
        question: "Is Dubai a good honeymoon destination for Indian couples?",
        answer:
          "Dubai is one of the top honeymoon destinations for Indian couples. It offers world-class luxury resorts, private beach experiences, romantic desert dinners, 5-star spas, and easy visa access — all within a short 3–4 hour flight from major Indian cities.",
      },
    ],
    relatedSlugs: ["bali-romance-6n7d", "maldives-luxury-4n5d", "dubai-luxury-5n6d"],
    metaTitle: "Dubai Honeymoon Package from India | Flywings",
    metaDescription:
      "Best Dubai honeymoon package from India 5N/6D starting ₹89,999/couple. 5★ Palm resort, couples spa, romantic dinner, desert safari & more. Book now!",
    keywords: ["dubai honeymoon package", "dubai romantic package", "dubai couple tour"],
  },

  // ─── THAILAND EXPLORER ─────────────────────────────────────
  {
    slug: "thailand-explorer-7n8d",
    destinationSlug: "thailand",
    title: "Thailand 7 Nights / 8 Days Explorer Tour Package",
    shortTitle: "Thailand Explorer 7N/8D",
    tagline: "Bangkok temples, Phuket beaches & Krabi islands — Thailand at its absolute best",
    heroImages: [destThailand, destThailand],
    rating: 4.8,
    reviewCount: 441,
    duration: "7 Nights / 8 Days",
    nights: 7,
    days: 8,
    destinations: ["Bangkok", "Phuket", "Krabi"],
    hotelCategory: "4 Star",
    transferIncluded: true,
    mealsIncluded: "Daily Breakfast + Select Dinners",
    startingPrice: "₹52,999",
    originalPrice: "₹69,000",
    badge: "Best Seller",
    overview:
      "Thailand Explorer is the ultimate 7 Nights / 8 Days Thailand package from India — covering Bangkok's royal temples and night markets, Phuket's legendary beach resorts, Phi Phi Island's crystal waters, and Krabi's dramatic limestone karsts. With visa-free entry for Indians, direct flights, and an itinerary that balances culture, adventure, and relaxation, this is the most comprehensive Thailand holiday package available. Ideal for families, friends, and solo explorers seeking authentic Southeast Asian experiences at outstanding value.",
    itinerary: [
      {
        day: 1,
        title: "Arrival in Bangkok",
        description: "Land in Bangkok — Asia's most vibrant city — and begin your Thai adventure.",
        activities: [
          "Airport transfer to hotel",
          "Khao San Road exploration",
          "Asiatique The Riverfront night market",
          "Welcome Thai dinner",
        ],
        meals: "Welcome Dinner",
        hotel: "Centara Grand / Avani Riverside / Similar 4★",
      },
      {
        day: 2,
        title: "Bangkok Temples & Royal Palace",
        description: "Discover Bangkok's magnificent royal and spiritual heritage.",
        activities: [
          "Grand Palace & Wat Phra Kaew (Temple of the Emerald Buddha)",
          "Wat Pho (Reclining Buddha)",
          "Wat Arun (Temple of Dawn) — cross-river ferry",
          "Chao Phraya River dinner cruise",
        ],
        meals: "Breakfast + River Cruise Dinner",
        hotel: "Centara Grand / Similar 4★",
      },
      {
        day: 3,
        title: "Bangkok — Shopping & Floating Market",
        description: "Experience Bangkok's legendary markets and modern shopping.",
        activities: [
          "Damnoen Saduak Floating Market",
          "Chatuchak Weekend Market (world's largest)",
          "Siam Paragon & Central World shopping",
          "Khao San Road nightlife",
        ],
        meals: "Breakfast",
        hotel: "Centara Grand / Similar 4★",
      },
      {
        day: 4,
        title: "Bangkok → Phuket — Beach Paradise",
        description: "Fly to Phuket and settle into island life.",
        activities: [
          "Domestic flight Bangkok to Phuket",
          "Check-in at Patong Beach resort",
          "Patong Beach sunset swim",
          "Bangla Road & Phuket nightlife",
        ],
        meals: "Breakfast",
        hotel: "Holiday Inn Phuket / Similar 4★",
      },
      {
        day: 5,
        title: "Phi Phi Island Speedboat Tour",
        description: "Full-day speedboat excursion to the world-famous Phi Phi Islands.",
        activities: [
          "Phi Phi Don & Phi Phi Leh by speedboat",
          "Maya Bay (the iconic 'The Beach' location)",
          "Snorkeling at Bamboo Island coral reefs",
          "Viking Cave & Monkey Beach",
        ],
        meals: "Breakfast",
        hotel: "Holiday Inn Phuket / Similar 4★",
      },
      {
        day: 6,
        title: "James Bond Island & Phang Nga Bay",
        description: "Kayak through stunning limestone karsts in an emerald lagoon.",
        activities: [
          "Phang Nga Bay by longtail boat",
          "James Bond Island (The Man with the Golden Gun)",
          "Sea kayaking through sea caves and lagoons",
          "Local Thai seafood lunch",
        ],
        meals: "Breakfast + Lunch",
        hotel: "Holiday Inn Phuket / Similar 4★",
      },
      {
        day: 7,
        title: "Krabi Day Trip or Beach Leisure",
        description: "Explore Krabi's Four Islands or enjoy a relaxing beach day.",
        activities: [
          "Krabi Four Islands boat tour (optional)",
          "Railay Beach by longtail (only accessible by sea)",
          "Sunset at Laem Tong Beach",
          "Seafood dinner on the beach",
        ],
        meals: "Breakfast + Dinner",
        hotel: "Holiday Inn Phuket / Similar 4★",
      },
      {
        day: 8,
        title: "Departure",
        description: "Final breakfast, souvenir shopping, and departure from Phuket.",
        activities: [
          "Buffet breakfast",
          "Hotel checkout",
          "Jungceylon Mall shopping (if time permits)",
          "Transfer to Phuket Airport & departure",
        ],
        meals: "Breakfast",
      },
    ],
    inclusions: [
      "Return international economy flights from India to Bangkok",
      "Bangkok → Phuket one-way domestic flight",
      "4★ hotel accommodation for 7 nights with daily breakfast",
      "All airport, hotel, and inter-city transfers",
      "Phi Phi Island full-day speedboat tour",
      "Phang Nga Bay & James Bond Island tour",
      "Bangkok city tour with English-speaking guide",
      "Chao Phraya River dinner cruise",
      "Thai welcome dinner",
      "Visa on arrival fees (if applicable for Indian passport)",
      "24/7 Flywings travel support",
      "All taxes and service charges",
    ],
    exclusions: [
      "Travel insurance",
      "Lunches (except Day 6)",
      "Optional tours: Krabi 4 Islands, Tiger Kingdom, Elephant Sanctuary",
      "Personal expenses & shopping",
      "Tips for guides and drivers",
      "Alcoholic beverages",
    ],
    hotels: [
      {
        name: "Centara Grand At Central World",
        stars: 4,
        location: "Bangkok city centre, above CentralWorld Mall",
        roomType: "Superior Room with City View",
        upgradeOption: "Upgrade to Deluxe Room with Rooftop Pool Access (+₹3,500/night)",
      },
      {
        name: "Holiday Inn Phuket Mai Khao Beach Resort",
        stars: 4,
        location: "Patong Beach, Phuket",
        roomType: "Deluxe Room with Pool View",
        upgradeOption: "Upgrade to Beachfront Suite (+₹5,000/night)",
      },
    ],
    pricingTiers: [
      {
        label: "Per Person (Twin Sharing)",
        price: "₹52,999",
        originalPrice: "₹69,000",
        description: "2 adults sharing — most popular",
      },
      {
        label: "Per Person (Triple Sharing)",
        price: "₹47,999",
        originalPrice: "₹62,000",
        description: "3 adults sharing — great for groups",
      },
      {
        label: "Solo Traveler",
        price: "₹68,999",
        originalPrice: "₹86,000",
        description: "Private single room",
      },
      {
        label: "Group (10+ Pax)",
        price: "₹44,999",
        originalPrice: "₹58,000",
        description: "Best group rates with group escort",
      },
    ],
    childPrice: "₹28,000 (age 2–11, sharing parents' room)",
    emiAvailable: true,
    cancellationPolicy: [
      "Free cancellation up to 30 days before departure — full refund",
      "15–29 days before departure: 25% cancellation fee",
      "7–14 days: 50% cancellation fee",
      "Less than 7 days or no-show: 100% cancellation fee",
    ],
    faqs: [
      {
        question: "Do Indians need a visa to visit Thailand?",
        answer:
          "Indian passport holders currently enjoy visa-free entry to Thailand for up to 30 days. Simply arrive at the airport and proceed through immigration. No pre-visa is required.",
      },
      {
        question: "What is the best time to visit Thailand?",
        answer:
          "November to April is ideal — dry, sunny, perfect for beaches. December to February is peak season with the most pleasant weather. The rainy season (May–October) brings greener landscapes and fewer crowds.",
      },
      {
        question: "Is the Thailand package suitable for families with kids?",
        answer:
          "Yes! Thailand is exceptionally family-friendly. The floating markets, elephant sanctuaries, water parks, temples, and beaches all make for unforgettable family memories. Children under 2 fly free on most airlines.",
      },
      {
        question: "Can I add Krabi or Koh Samui to the itinerary?",
        answer:
          "Absolutely! We can customize this package to add Krabi (limestone beaches & rock climbing) or Koh Samui (luxury island resort) as additional destinations. Contact our team for pricing.",
      },
    ],
    relatedSlugs: ["bali-bliss-5n6d", "singapore-escape-4n5d", "dubai-classic-4n5d"],
    metaTitle: "Thailand 7 Nights Tour Package from India | Flywings",
    metaDescription:
      "Book Thailand 7N/8D tour package from India starting ₹52,999. Bangkok, Phuket, Phi Phi Island & James Bond Island. Flights, hotels & tours included.",
    keywords: ["thailand tour package from india", "bangkok phuket package", "thailand 7 nights package"],
  },

  // ─── BALI ROMANCE ──────────────────────────────────────────
  {
    slug: "bali-romance-6n7d",
    destinationSlug: "bali",
    title: "Bali Honeymoon Package 6 Nights / 7 Days",
    shortTitle: "Bali Romance 6N/7D",
    tagline: "Clifftop villas, temple sunsets & tropical bliss — Bali made for lovers",
    heroImages: [destBali, destBali],
    rating: 4.9,
    reviewCount: 289,
    duration: "6 Nights / 7 Days",
    nights: 6,
    days: 7,
    destinations: ["Seminyak", "Ubud", "Uluwatu"],
    hotelCategory: "5 Star Villa / Resort",
    transferIncluded: true,
    mealsIncluded: "Breakfast + Romantic Dinners",
    startingPrice: "₹59,999",
    originalPrice: "₹78,000",
    badge: "Honeymoon Pick",
    overview:
      "Bali is the world's most romantic island — and this 6 Nights / 7 Days Bali honeymoon package captures its soul. Begin in Seminyak's chic beach clubs, explore Ubud's sacred monkey forest and rice terraces, watch the legendary Kecak fire dance at Uluwatu's clifftop temple, and indulge in a private couples spa retreat. Staying in a stunning private pool villa, every moment is crafted for romance. This is Bali honeymoon done perfectly.",
    itinerary: [
      {
        day: 1,
        title: "Arrival in Bali — Romantic Welcome",
        description: "Arrive at Ngurah Rai Airport and enter a world of tropical paradise.",
        activities: [
          "Airport VIP transfer with honeymooner board",
          "Check-in at private pool villa",
          "Rose petal bath & welcome basket",
          "Seminyak Beach sunset",
          "Candlelit beach dinner",
        ],
        meals: "Welcome Dinner",
        hotel: "Alaya Resort Ubud / Seminyak Villa / Similar 5★",
      },
      {
        day: 2,
        title: "Seminyak — Beaches & Sunset",
        description: "A blissful day on Bali's most glamorous stretch of coastline.",
        activities: [
          "Morning yoga on the beach (optional)",
          "Seminyak Beach & beach clubs",
          "Potato Head Beach Club (iconic)",
          "Sunset cocktails at Ku De Ta",
          "Dinner at La Lucciola beachfront restaurant",
        ],
        meals: "Breakfast + Dinner",
        hotel: "Alaya / Seminyak Villa",
      },
      {
        day: 3,
        title: "Ubud Cultural Immersion",
        description: "Explore Bali's artistic and spiritual heartland.",
        activities: [
          "Tegalalang Rice Terrace & Ubud Swing",
          "Sacred Monkey Forest Sanctuary",
          "Ubud Traditional Market & Craft Shops",
          "Balinese cooking class (optional)",
          "Traditional Balinese dinner",
        ],
        meals: "Breakfast + Dinner",
        hotel: "Alaya Ubud / Similar",
      },
      {
        day: 4,
        title: "Couples Spa & Temple Tour",
        description: "A day of healing, spirituality, and togetherness.",
        activities: [
          "3-hour Balinese couples spa at Alaya Spa",
          "Tirta Empul Holy Spring Temple",
          "Gunung Kawi ancient royal temple",
          "Private pool villa afternoon",
          "Romantic in-villa dinner",
        ],
        meals: "Breakfast + In-Villa Dinner",
        hotel: "Alaya Ubud / Similar",
      },
      {
        day: 5,
        title: "Uluwatu — Clifftop Temple & Kecak Fire Dance",
        description: "Witness Bali's most dramatic sunset at the cliff-top Uluwatu Temple.",
        activities: [
          "Uluwatu Temple (100m above Indian Ocean)",
          "Kecak Fire Dance at sunset (UNESCO-listed performance)",
          "Jimbaran Bay seafood dinner on the beach",
          "Evening moonlit beach walk",
        ],
        meals: "Breakfast + Seafood Dinner",
        hotel: "Alaya / Seminyak Villa",
      },
      {
        day: 6,
        title: "Mt. Batur Sunrise Trek or Leisure",
        description: "Either summit the sacred volcano for a breathtaking sunrise or enjoy a final spa day.",
        activities: [
          "Option A: Mt. Batur volcano sunrise trek (4 AM start)",
          "Option B: Morning at leisure & hotel spa",
          "Afternoon at Nusa Dua beach",
          "Farewell romantic dinner",
        ],
        meals: "Breakfast + Farewell Dinner",
        hotel: "Alaya / Seminyak Villa",
      },
      {
        day: 7,
        title: "Departure",
        description: "Final Balinese breakfast, souvenir shopping, and goodbye.",
        activities: [
          "Late breakfast at villa",
          "Hotel checkout with luggage storage",
          "Kuta art market for last-minute shopping",
          "Airport transfer & departure",
        ],
        meals: "Breakfast",
      },
    ],
    inclusions: [
      "Return economy flights from India to Bali (Ngurah Rai Airport)",
      "6 nights in a private pool villa / 5★ resort",
      "Bali visa on arrival fee (USD 35, included)",
      "All airport and inter-attraction transfers",
      "Candlelit welcome dinner on arrival",
      "3-hour Balinese couples spa session",
      "Ubud rice terrace tour including Ubud Swing",
      "Uluwatu Temple visit + Kecak Fire Dance tickets",
      "Jimbaran Bay seafood dinner",
      "Farewell romantic dinner",
      "Daily breakfast at resort",
      "Dedicated honeymoon concierge (24/7)",
    ],
    exclusions: [
      "Travel insurance",
      "Lunches",
      "Mt. Batur volcano trek fee (if chosen)",
      "Personal expenses",
      "Tips for guides and villa staff",
      "Additional spa services",
      "Room decoration (available on request)",
    ],
    hotels: [
      {
        name: "Alaya Resort Ubud",
        stars: 5,
        location: "Ubud forest edge, central Bali",
        roomType: "Pool Villa with Garden View",
        upgradeOption: "Upgrade to Forest Infinity Pool Villa (+₹6,000/night)",
      },
      {
        name: "Katamama Seminyak",
        stars: 5,
        location: "Petitenget, Seminyak beach area",
        roomType: "Junior Suite with Pool Access",
        upgradeOption: "Upgrade to Private Pool Suite (+₹9,000/night)",
      },
    ],
    pricingTiers: [
      {
        label: "Per Couple (Pool Villa)",
        price: "₹59,999",
        originalPrice: "₹78,000",
        description: "Per couple — all romantic inclusions",
      },
      {
        label: "Premium Pool Villa",
        price: "₹74,999",
        originalPrice: "₹96,000",
        description: "Upgraded premium pool villa with extra amenities",
      },
    ],
    childPrice: undefined,
    emiAvailable: true,
    cancellationPolicy: [
      "Free cancellation up to 45 days before departure",
      "30–44 days: 25% cancellation fee",
      "15–29 days: 50% cancellation fee",
      "Less than 15 days or no-show: 100% cancellation fee",
      "Honeymoon decorations non-refundable once arranged",
    ],
    faqs: [
      {
        question: "Is Bali a good honeymoon destination for Indians?",
        answer:
          "Bali is one of the most popular honeymoon destinations for Indian couples. It offers breathtaking natural scenery, private pool villas, world-class spas, romantic beach dinners, and spiritual experiences — all at relatively affordable prices compared to European or Maldivian alternatives.",
      },
      {
        question: "Do Indians need a visa for Bali?",
        answer:
          "Yes, Indian passport holders need a Bali visa on arrival (USD 35 for 30 days). This fee is included in your package. Just present your passport on arrival and the visa is issued immediately.",
      },
      {
        question: "What romantic extras can be arranged?",
        answer:
          "We can arrange rose petal pool decorations, flower baths, personalized birthday or anniversary cakes, private villa BBQ dinners, couples cooking classes, traditional Balinese wedding blessings, and professional photoshoots. Let us know and we'll customize your dream honeymoon.",
      },
    ],
    relatedSlugs: ["dubai-honeymoon-5n6d", "maldives-luxury-4n5d", "thailand-explorer-7n8d"],
    metaTitle: "Bali Honeymoon Package from India 6N/7D | Flywings",
    metaDescription:
      "Romantic Bali honeymoon package from India 6N/7D starting ₹59,999/couple. Private pool villa, couples spa, temple sunset & beach dinner. Book now!",
    keywords: ["bali honeymoon package", "bali romance tour", "bali couple package from india"],
  },

  // ─── MALDIVES LUXURY ───────────────────────────────────────
  {
    slug: "maldives-luxury-4n5d",
    destinationSlug: "maldives",
    title: "Maldives 4 Nights / 5 Days Luxury Water Villa Package",
    shortTitle: "Maldives Luxury 4N/5D",
    tagline: "Overwater bungalows, crystal lagoons & coral reefs — paradise on Earth",
    heroImages: [destMaldives, destMaldives],
    rating: 5.0,
    reviewCount: 174,
    duration: "4 Nights / 5 Days",
    nights: 4,
    days: 5,
    destinations: ["Male", "Resort Island"],
    hotelCategory: "5 Star Water Villa",
    transferIncluded: true,
    mealsIncluded: "All Meals (Full Board)",
    startingPrice: "₹89,999",
    originalPrice: "₹1,10,000",
    badge: "Ultra Luxury",
    overview:
      "The Maldives is the world's ultimate luxury escape — and this 4 Nights / 5 Days Maldives package delivers every dream. Stay in an iconic overwater bungalow perched above a turquoise lagoon, snorkel through vibrant coral reefs, kayak in crystal waters, enjoy a sunset dolphin cruise, and savor world-class fine dining on a private sandbank. This all-inclusive package takes care of absolutely everything — from Male transfers to every meal. Simply arrive, step into the water, and feel your soul exhale.",
    itinerary: [
      {
        day: 1,
        title: "Arrival in Male — Speedboat to Paradise",
        description: "Land in Male and transfer to your private resort island.",
        activities: [
          "Arrive at Velana International Airport, Male",
          "Speedboat transfer to resort island (30–45 min)",
          "Check-in at overwater water villa",
          "Welcome cocktail & tropical fruit platter",
          "Sunset from your private villa deck",
          "Welcome dinner at overwater restaurant",
        ],
        meals: "Welcome Dinner",
        hotel: "Sun Siyam Olhuveli / Centara Ras Fushi / Similar 5★",
      },
      {
        day: 2,
        title: "House Reef Snorkeling & Water Sports",
        description: "Spend the day exploring the stunning underwater world right below your villa.",
        activities: [
          "Morning house reef snorkeling (turtles, rays & fish)",
          "Kayaking and stand-up paddleboarding (complimentary)",
          "Catamaran sailing (1 hour)",
          "Afternoon relaxation on your private deck",
          "All-day access to resort pool & beach",
          "Dinner at beachside grill",
        ],
        meals: "Breakfast + Lunch + Dinner",
        hotel: "Sun Siyam Olhuveli / Similar",
      },
      {
        day: 3,
        title: "Dolphin Cruise & Sunset Sandbank",
        description: "Chase dolphins at dusk and watch the sun set over an empty sandbank.",
        activities: [
          "Full-day leisure or optional diving (extra cost)",
          "Sunset dolphin watching cruise",
          "Private sandbank visit at golden hour",
          "Underwater glass restaurant dinner (if available at resort)",
          "Stargazing from the villa deck",
        ],
        meals: "Breakfast + Lunch + Dinner",
        hotel: "Sun Siyam Olhuveli / Similar",
      },
      {
        day: 4,
        title: "Full Day Excursion — Local Island & Spa",
        description: "Visit a local Maldivian island and indulge in a signature spa treatment.",
        activities: [
          "Local island visit — Maafushi or Thulusdhoo",
          "Snorkeling with manta rays or whale sharks (seasonal)",
          "90-minute overwater couples spa",
          "Farewell private beach dinner",
        ],
        meals: "Breakfast + Lunch + Farewell Dinner",
        hotel: "Sun Siyam Olhuveli / Similar",
      },
      {
        day: 5,
        title: "Departure",
        description: "Final breakfast on your villa deck and farewell to paradise.",
        activities: [
          "Leisurely breakfast on villa deck",
          "Late checkout (subject to availability)",
          "Speedboat transfer to Male Airport",
          "Departure",
        ],
        meals: "Breakfast",
      },
    ],
    inclusions: [
      "Return economy flights from India (Delhi / Mumbai) to Male",
      "Speedboat transfers from Male to resort and back",
      "4 nights in an overwater water villa / bungalow",
      "Full board meals — all breakfasts, lunches, and dinners",
      "Welcome cocktail and tropical fruit platter",
      "Complimentary water sports: kayaking, snorkeling gear, SUP, catamaran sailing",
      "Sunset dolphin watching cruise",
      "Sandbank visit",
      "90-minute couples spa session",
      "24/7 Flywings travel concierge",
      "All taxes and resort fees",
    ],
    exclusions: [
      "Travel insurance (strongly recommended)",
      "Scuba diving and PADI courses (available at extra cost)",
      "Maldives arrival tax (USD 50 — paid at airport)",
      "Alcoholic beverages",
      "Submarine excursion and seaplane rides",
      "Personal shopping",
      "Tips and gratuities",
    ],
    hotels: [
      {
        name: "Sun Siyam Olhuveli",
        stars: 5,
        location: "South Male Atoll, 30 min speedboat from Male",
        roomType: "Water Villa with Private Deck",
        upgradeOption: "Upgrade to 2-Bedroom Beach Water Pool Villa (+₹18,000/night)",
      },
      {
        name: "Centara Ras Fushi Resort & Spa",
        stars: 5,
        location: "North Male Atoll, adults-only resort",
        roomType: "Water Villa with Infinity Pool",
        upgradeOption: "Upgrade to Sunset Water Villa (+₹12,000/night)",
      },
    ],
    pricingTiers: [
      {
        label: "Per Person (Water Villa, Full Board)",
        price: "₹89,999",
        originalPrice: "₹1,10,000",
        description: "Per person twin share — all meals included",
      },
      {
        label: "Per Person (Sunset Water Villa)",
        price: "₹1,09,999",
        originalPrice: "₹1,35,000",
        description: "Premium sunset-facing villa with infinity plunge pool",
      },
    ],
    childPrice: "₹42,000 (age 2–11, sharing parents' villa)",
    emiAvailable: true,
    cancellationPolicy: [
      "Free cancellation up to 45 days before departure — full refund",
      "30–44 days: 30% cancellation fee",
      "15–29 days: 60% cancellation fee",
      "Less than 15 days or no-show: 100% cancellation fee",
      "Resort fees are non-refundable once booking is confirmed at hotel",
    ],
    faqs: [
      {
        question: "Do Indians need a visa for the Maldives?",
        answer:
          "No visa required! Indian passport holders receive a free 30-day tourist visa on arrival in the Maldives. Simply show your passport, return ticket, and hotel booking confirmation.",
      },
      {
        question: "What is included in the all-inclusive package?",
        answer:
          "Your package includes all international flights, speedboat transfers, 4 nights in a water villa, all meals (breakfast, lunch, dinner), water sports, dolphin cruise, sandbank visit, and a couples spa session.",
      },
      {
        question: "Is the Maldives suitable for a honeymoon?",
        answer:
          "The Maldives is arguably the world's best honeymoon destination. Private overwater bungalows, crystal-clear lagoons, bioluminescent beaches at night, private sandbank dinners, and world-class spas make it absolutely magical for couples.",
      },
      {
        question: "What is the best time to visit the Maldives?",
        answer:
          "November to April is the dry season — ideal weather, calm seas, and excellent visibility for snorkeling and diving. December to March is peak season. May to October is the wet season (cheaper prices but some rain).",
      },
    ],
    relatedSlugs: ["dubai-honeymoon-5n6d", "bali-romance-6n7d", "thailand-explorer-7n8d"],
    metaTitle: "Maldives 4 Nights Water Villa Package from India | Flywings",
    metaDescription:
      "Book Maldives 4N/5D luxury water villa package from India starting ₹89,999. All-inclusive, flights, speedboat, full board meals & spa. Get free quote!",
    keywords: ["maldives tour package from india", "maldives water villa package", "maldives honeymoon package"],
  },

  // ─── KASHMIR FAMILY ────────────────────────────────────────
  {
    slug: "kashmir-family-4n5d",
    destinationSlug: "kashmir",
    title: "Kashmir 4 Nights / 5 Days Family Tour Package",
    shortTitle: "Kashmir Family 4N/5D",
    tagline: "Heaven on Earth — snow peaks, shikara rides & valley blooms for your family",
    heroImages: [destKashmir, destKashmir],
    rating: 4.7,
    reviewCount: 628,
    duration: "4 Nights / 5 Days",
    nights: 4,
    days: 5,
    destinations: ["Srinagar", "Gulmarg", "Pahalgam"],
    hotelCategory: "4 Star / Deluxe Houseboat",
    transferIncluded: true,
    mealsIncluded: "Breakfast + Dinner",
    startingPrice: "₹22,999",
    originalPrice: "₹32,000",
    badge: "Family Fav",
    overview:
      "Kashmir — the crown jewel of India — offers an experience unlike any other. This 4 Nights / 5 Days Kashmir family tour package covers the serene Dal Lake (with a night on a traditional houseboat), the snow-capped slopes of Gulmarg, the scenic meadows of Pahalgam, and the fragrant Mughal Gardens of Srinagar. Safe, comfortable, and family-friendly — Kashmir is an experience every Indian family must have at least once.",
    itinerary: [
      {
        day: 1,
        title: "Arrival in Srinagar — Houseboat Check-in",
        description: "Welcome to Paradise on Earth. Arrive in Srinagar and settle onto your lakeside houseboat.",
        activities: [
          "Srinagar airport pickup",
          "Shikara ride to your Dal Lake houseboat",
          "Dal Lake shikara ride — floating gardens & markets",
          "Sunset on the lake",
          "Traditional Kashmiri welcome dinner on houseboat",
        ],
        meals: "Dinner",
        hotel: "Deluxe Houseboat, Dal Lake",
      },
      {
        day: 2,
        title: "Mughal Gardens & Old City",
        description: "Explore Srinagar's magnificent Mughal-era gardens and old town.",
        activities: [
          "Shalimar Bagh, Nishat Bagh & Chashme Shahi Mughal Gardens",
          "Shankaracharya Temple (panoramic valley views)",
          "Old Srinagar market — spices, shawls & dry fruits",
          "Overnight in hotel",
        ],
        meals: "Breakfast + Dinner",
        hotel: "Hotel Broadway or Similar 4★",
      },
      {
        day: 3,
        title: "Gulmarg — Snow & Gondola",
        description: "Experience Asia's highest cable car and endless snowy meadows.",
        activities: [
          "Drive to Gulmarg (54 km, 1.5 hrs)",
          "Gondola cable car ride Phase 1 & 2 (highest in Asia)",
          "Snow activities: sledging, snowball fights (seasonal)",
          "Pony ride through Gulmarg meadows",
          "Return to Srinagar hotel",
        ],
        meals: "Breakfast + Dinner",
        hotel: "Hotel Broadway or Similar 4★",
      },
      {
        day: 4,
        title: "Pahalgam — Valley of Shepherds",
        description: "Journey to one of India's most breathtaking valley destinations.",
        activities: [
          "Drive to Pahalgam (95 km, 2.5 hrs)",
          "Betaab Valley & Aru Valley scenic walks",
          "Lidder River — pony rides and trout fishing",
          "Chandanwari (snow point — seasonal)",
          "Return to Srinagar",
        ],
        meals: "Breakfast + Dinner",
        hotel: "Hotel Broadway or Similar 4★",
      },
      {
        day: 5,
        title: "Departure",
        description: "Final breakfast, local souvenir shopping, and departure.",
        activities: [
          "Breakfast at hotel",
          "Lal Chowk — local handicraft shopping",
          "Transfer to Srinagar Airport",
          "Departure",
        ],
        meals: "Breakfast",
      },
    ],
    inclusions: [
      "Return economy flights from Delhi/Mumbai to Srinagar",
      "1 night on a deluxe houseboat on Dal Lake (with all meals)",
      "3 nights in a 4★ hotel in Srinagar (with breakfast & dinner)",
      "All road transfers in a comfortable vehicle",
      "Shikara ride on Dal Lake (1 hour)",
      "Sightseeing as per itinerary with local English-speaking guide",
      "All toll taxes, fuel charges & parking",
      "24/7 Flywings travel support",
    ],
    exclusions: [
      "Gondola cable car tickets at Gulmarg (approx ₹800–1,200/person)",
      "Pony rides, sledging, and adventure activities",
      "Lunches",
      "Personal expenses and shopping",
      "Tips for guides and drivers",
      "Travel insurance",
    ],
    hotels: [
      {
        name: "Deluxe Heritage Houseboat — Dal Lake",
        stars: 4,
        location: "Dal Lake, Srinagar",
        roomType: "Deluxe Cabin with Lake View",
        upgradeOption: "Upgrade to Super Deluxe Houseboat with Private Deck (+₹2,500/night)",
      },
      {
        name: "Hotel Broadway / Grand Palace / Similar",
        stars: 4,
        location: "Maulana Azad Road, central Srinagar",
        roomType: "Deluxe Room with Garden View",
        upgradeOption: "Upgrade to Suite with Mountain View (+₹3,000/night)",
      },
    ],
    pricingTiers: [
      {
        label: "Per Person (Twin Sharing)",
        price: "₹22,999",
        originalPrice: "₹32,000",
        description: "2 adults sharing — best value",
      },
      {
        label: "Per Person (Triple Sharing)",
        price: "₹19,999",
        originalPrice: "₹28,000",
        description: "3 adults sharing — family rooms",
      },
      {
        label: "Solo Traveler",
        price: "₹29,999",
        originalPrice: "₹40,000",
        description: "Private single room",
      },
      {
        label: "Group (10+ Pax)",
        price: "₹17,999",
        originalPrice: "₹25,000",
        description: "Group rate with dedicated escort",
      },
    ],
    childPrice: "₹9,000 (age 2–11, sharing parents' room)",
    emiAvailable: false,
    cancellationPolicy: [
      "Free cancellation up to 30 days before departure — full refund",
      "15–29 days: 25% cancellation fee",
      "7–14 days: 50% cancellation fee",
      "Less than 7 days or no-show: 100% cancellation fee",
      "Political unrest or security advisories: full refund provided",
    ],
    faqs: [
      {
        question: "Is Kashmir safe for tourists?",
        answer:
          "Yes, Kashmir is safe for tourists, especially in Srinagar, Gulmarg, and Pahalgam. The region has seen significant improvement in tourist infrastructure. Our local guides ensure you have a smooth, safe experience. We also monitor advisories and keep you updated.",
      },
      {
        question: "What is the best time to visit Kashmir?",
        answer:
          "Kashmir is beautiful year-round. March–May: cherry blossoms & tulip season. June–August: green meadows, ideal weather. September–November: autumn leaves & golden chinar trees. December–February: snow-covered landscapes for winter lovers.",
      },
      {
        question: "Is a Gondola ride included in the package?",
        answer:
          "The Gondola (cable car) ride at Gulmarg is not included in the base price as entry is managed directly by the Gondola Authority. However, our guide will assist you with purchasing tickets on site (₹800–1,200 per person depending on the phase).",
      },
    ],
    relatedSlugs: ["singapore-escape-4n5d", "dubai-classic-4n5d", "thailand-explorer-7n8d"],
    metaTitle: "Kashmir 4 Nights Family Tour Package | Flywings",
    metaDescription:
      "Book Kashmir 4N/5D family tour package starting ₹22,999. Dal Lake houseboat, Gulmarg Gondola, Pahalgam & Mughal Gardens. Flights included. Get free quote!",
    keywords: ["kashmir tour package", "kashmir family tour", "kashmir 4 nights package", "kashmir houseboat"],
  },

  // ─── SINGAPORE ─────────────────────────────────────────────
  {
    slug: "singapore-escape-4n5d",
    destinationSlug: "singapore",
    title: "Singapore 4 Nights / 5 Days City Escape Package",
    shortTitle: "Singapore Escape 4N/5D",
    tagline: "Night Safari, Sentosa thrills & the Marina Bay skyline — Singapore in one easy escape",
    heroImages: [destSingapore, destSingapore],
    rating: 4.8,
    reviewCount: 356,
    duration: "4 Nights / 5 Days",
    nights: 4,
    days: 5,
    destinations: ["Singapore", "Sentosa Island"],
    hotelCategory: "4 Star",
    transferIncluded: true,
    mealsIncluded: "Daily Breakfast",
    startingPrice: "₹55,000",
    originalPrice: "",
    badge: "Popular",
    overview:
      "Singapore is a city that never ceases to amaze — a seamless fusion of futuristic architecture, tropical gardens, multicultural cuisine, and world-class entertainment. This 4 Nights / 5 Days Singapore package stays centrally at V Hotel Lavender and covers the Night Safari, a Singapore familiarisation drive, the Sentosa Saver experience (cable car, Luge & Skyride, Wings of Time), Gardens by the Bay's two domes, and the Marina Bay Sands SkyPark Observation Deck — with return airport transfers on a private basis and all tours as seat-in-coach. TCS applies extra as per Government of India regulations.",
    itinerary: [
      {
        day: 1,
        title: "Arrival in Singapore",
        description: "Land at Changi Airport — consistently rated the world's best airport — and settle in.",
        activities: [
          "Private arrival transfer & hotel check-in at V Hotel Lavender",
          "Singapore city familiarisation drive (SIC basis)",
          "Evening at leisure",
          "Singapore Night Safari (world's first wildlife night park, SIC basis)",
        ],
        meals: "—",
        hotel: "V Hotel Lavender",
      },
      {
        day: 2,
        title: "Sentosa Saver Experience",
        description: "A full day on Sentosa Island, capped with the Wings of Time light-and-water show.",
        activities: [
          "One-way Mount Faber Cable Car to Sentosa",
          "Luge & Skyride (3 rides)",
          "Sentosa beaches and leisure time",
          "Wings of Time show (07:40 PM)",
        ],
        meals: "Breakfast",
        hotel: "V Hotel Lavender",
      },
      {
        day: 3,
        title: "Marina Bay & Gardens by the Bay",
        description: "Singapore's most iconic skyline and its extraordinary domed gardens.",
        activities: [
          "Gardens by the Bay — 2 Domes (Flower Dome & Cloud Forest)",
          "Marina Bay Sands SkyPark Observation Deck",
          "Merlion Park & Marina Bay waterfront",
          "Evening at leisure",
        ],
        meals: "Breakfast",
        hotel: "V Hotel Lavender",
      },
      {
        day: 4,
        title: "Free Day for Shopping & Leisure",
        description: "A day at your own pace to revisit favourite spots or explore further.",
        activities: [
          "Day at leisure — Orchard Road / Bugis Street shopping",
          "Optional: Little India or Chinatown self-exploration",
          "Optional activities available on request (not included)",
        ],
        meals: "Breakfast",
        hotel: "V Hotel Lavender",
      },
      {
        day: 5,
        title: "Departure",
        description: "Final breakfast and your private transfer to Changi Airport.",
        activities: [
          "Breakfast at hotel",
          "Hotel checkout (standard check-out 12:00 hrs)",
          "Private departure transfer to Changi Airport",
        ],
        meals: "Breakfast",
      },
    ],
    inclusions: [
      "Daily breakfast",
      "4 nights accommodation at V Hotel Lavender",
      "Night Safari tour (SIC basis)",
      "Singapore familiarisation drive (SIC basis)",
      "Sentosa Saver: one-way Mount Faber Cable Car, Luge & Skyride (3 rides), Wings of Time (07:40 PM)",
      "Gardens by the Bay (2 Domes)",
      "Marina Bay Sands SkyPark Observation Deck",
      "Return airport transfers (private basis)",
      "All tours on seat-in-coach basis",
    ],
    exclusions: [
      "International airfare",
      "Singapore visa",
      "TCS extra",
      "Travel insurance",
      "Lunch & dinner",
      "Personal expenses",
      "Early check-in / late check-out",
      "Tips & porterage",
      "Optional tours",
      "Anything not specifically listed under Inclusions",
    ],
    hotels: [
      {
        name: "V Hotel Lavender",
        stars: 4,
        location: "Lavender, Singapore",
        roomType: "Superior Room",
      },
    ],
    pricingTiers: [
      {
        label: "Per Person (Min. 2 Adults Travelling Together)",
        price: "₹55,000",
        originalPrice: "",
        description: "TCS extra — valid for new bookings, India market only",
      },
    ],
    childPrice: "1 Adult + 1 Child is charged at the adult rate",
    emiAvailable: true,
    cancellationPolicy: [
      "Rates are per person, applicable for a minimum of 2 passengers travelling together",
      "Valid for new bookings only, applicable for the India market only",
      "Surcharges may apply during exhibitions, conventions, public holidays & special events — confirmed at the time of booking",
      "Cancellation charges apply as per hotel, transfer, and attraction supplier policies",
    ],
    faqs: [
      {
        question: "Do Indians need a visa to visit Singapore?",
        answer:
          "Yes, Indian passport holders need a Singapore visa. It is an e-visa that can be applied for online. Flywings will assist you with the visa application (visa fee is charged separately).",
      },
      {
        question: "What if I'm travelling as 1 Adult + 1 Child?",
        answer:
          "For bookings of 1 Adult + 1 Child, the child is charged at the full adult rate. Please plan accordingly when booking for a parent travelling with a single child.",
      },
      {
        question: "Are there extra charges for late-night or early-morning airport transfers?",
        answer:
          "Private arrival or departure transfers scheduled between 23:00 and 07:00 hrs attract an additional SGD 25 per vehicle, per way, payable on top of the package price.",
      },
      {
        question: "What are the hotel check-in and check-out times?",
        answer:
          "Standard check-in at V Hotel Lavender is 15:00 hrs and check-out is 12:00 hrs. Early check-in or late check-out can be arranged on request, subject to availability and additional charges.",
      },
    ],
    relatedSlugs: ["dubai-classic-4n5d", "thailand-explorer-7n8d", "malaysia-kl-3n4d"],
    metaTitle: "Singapore Tour Package from India 4N/5D | Flywings",
    metaDescription:
      "Best Singapore 4N/5D tour package from India starting ₹55,000. Night Safari, Sentosa, Gardens by the Bay, Marina Bay Sands SkyPark & more.",
    keywords: ["singapore tour package from india", "singapore 4 nights package", "singapore family package"],
  },

  // ─── MALAYSIA (KUALA LUMPUR) ───────────────────────────────
  {
    slug: "malaysia-kl-3n4d",
    destinationSlug: "malaysia",
    title: "Malaysia (Kuala Lumpur) 3 Nights / 4 Days Package",
    shortTitle: "Malaysia KL 3N/4D",
    tagline: "Petronas skyline, Batu Caves & the hill-station thrill of Genting Highlands",
    heroImages: [destMalaysia, destMalaysia],
    rating: 4.7,
    reviewCount: 132,
    duration: "3 Nights / 4 Days",
    nights: 3,
    days: 4,
    destinations: ["Kuala Lumpur", "Genting Highlands"],
    hotelCategory: "4 Star",
    transferIncluded: true,
    mealsIncluded: "Daily Breakfast",
    startingPrice: "₹25,000",
    originalPrice: "",
    badge: "Quick Getaway",
    overview:
      "A perfectly paced 3 Nights / 4 Days introduction to Malaysia — the futuristic KL skyline by day, the hill-station thrill of Genting Highlands by cable car, and a stop at the towering Batu Caves along the way. Stay centrally at the Furama Hotel Kuala Lumpur in Bukit Bintang, the city's shopping and nightlife district, with breakfast and private airport transfers taken care of. This is a land package — international airfare is quoted separately by our ticketing desk, and TCS applies extra as per Government of India regulations.",
    itinerary: [
      {
        day: 1,
        title: "Arrival in Kuala Lumpur — Bukit Bintang Check-in",
        description: "Land in KL and settle into the heart of the city's shopping and entertainment district.",
        activities: [
          "Meet & greet at Kuala Lumpur International Airport",
          "Private transfer to Furama Hotel Kuala Lumpur (Bukit Bintang)",
          "Hotel check-in (standard check-in 02:00 PM)",
          "Evening at leisure — Bukit Bintang street & Pavilion KL",
        ],
        meals: "—",
        hotel: "Furama Hotel Kuala Lumpur (Bukit Bintang)",
      },
      {
        day: 2,
        title: "Half-Day Kuala Lumpur City Tour + KL Tower",
        description: "See the city's colonial landmarks and modern skyline, then rise above it all at KL Tower.",
        activities: [
          "Half-day Kuala Lumpur city tour (seat-in-coach)",
          "Petronas Twin Towers photo stop & KLCC Park",
          "Merdeka Square & Sultan Abdul Samad Building",
          "KL Tower Observation Deck",
        ],
        meals: "Breakfast",
        hotel: "Furama Hotel Kuala Lumpur (Bukit Bintang)",
      },
      {
        day: 3,
        title: "Genting Highlands Full-Day Tour + Batu Caves",
        description: "A full day in the cool hill-station air, reached by Southeast Asia's longest cable car system.",
        activities: [
          "En-route visit to Batu Caves (limestone temple & giant statue)",
          "Two-way Genting Skyway cable car ride",
          "Genting Highlands indoor theme park admission",
          "Full-day Genting excursion on private basis",
        ],
        meals: "Breakfast",
        hotel: "Furama Hotel Kuala Lumpur (Bukit Bintang)",
      },
      {
        day: 4,
        title: "Departure",
        description: "A final breakfast in KL before your private transfer to the airport.",
        activities: [
          "Breakfast at hotel",
          "Hotel checkout (standard check-out 12:00 PM)",
          "Private transfer to Kuala Lumpur International Airport",
          "Departure",
        ],
        meals: "Breakfast",
      },
    ],
    inclusions: [
      "3 nights accommodation at Furama Hotel Kuala Lumpur (Bukit Bintang)",
      "Daily breakfast",
      "Private airport transfers (arrival & departure)",
      "Half-day Kuala Lumpur city tour",
      "KL Tower Observation Deck",
      "Full-day Genting Highlands tour",
      "En-route visit to Batu Caves",
      "Two-way Genting Skyway cable car",
      "Indoor theme park admission",
      "Sightseeing as per itinerary",
      "All tours and transfers on seat-in-coach basis (Genting day trip on private basis)",
    ],
    exclusions: [
      "International airfare",
      "Travel insurance",
      "Lunch & dinner",
      "Personal expenses",
      "Tips & porterage",
      "Early check-in / late check-out",
      "Malaysia Tourism Tax (payable directly at the hotel)",
      "Optional tours & activities",
      "Anything not specifically mentioned under Package Inclusions",
    ],
    hotels: [
      {
        name: "Furama Hotel Kuala Lumpur",
        stars: 4,
        location: "Bukit Bintang, Kuala Lumpur",
        roomType: "Superior Room",
      },
    ],
    pricingTiers: [
      {
        label: "Per Person (Min. 2 Adults Travelling Together)",
        price: "₹25,000",
        originalPrice: "",
        description: "TCS extra as per Government of India regulations",
      },
    ],
    childPrice: undefined,
    emiAvailable: true,
    cancellationPolicy: [
      "Package is based on a minimum of 2 adults travelling together",
      "Subject to availability at the time of booking",
      "Rates may change during festivals, exhibitions, public holidays, or special events",
      "Cancellation charges apply as per the respective hotel, transport, and supplier policies",
      "Any increase in hotel, transport, or government taxes prior to travel will be charged additionally",
    ],
    faqs: [
      {
        question: "Is airfare included in this Malaysia package?",
        answer:
          "No — this is a land package, so international airfare is quoted separately by our ticketing desk at the best available fare at the time of booking, rather than a padded package fare.",
      },
      {
        question: "Do Indian passport holders need a visa for Malaysia?",
        answer:
          "Indian passport holders currently enjoy visa-free entry to Malaysia for short tourist stays. Our team will confirm the latest entry requirements at the time of booking.",
      },
      {
        question: "What is TCS and why is it extra?",
        answer:
          "TCS (Tax Collected at Source) is a Government of India levy on outbound tour packages, applicable as per current regulations. It is collected at the time of booking and can be adjusted against your income tax liability when filing your ITR. Our team will confirm the exact applicable amount at booking.",
      },
      {
        question: "Is the Genting Highlands day trip on a shared or private basis?",
        answer:
          "All tours and transfers in this package run on a seat-in-coach (shared) basis except the Genting Highlands day trip, which is on a private basis as noted in the inclusions.",
      },
    ],
    relatedSlugs: ["singapore-escape-4n5d", "thailand-explorer-7n8d", "dubai-classic-4n5d"],
    metaTitle: "Malaysia Kuala Lumpur Tour Package from India 3N/4D | Flywings",
    metaDescription:
      "Book Malaysia (Kuala Lumpur) 3 Nights 4 Days tour package ₹25,000 per person. 4★ Furama Bukit Bintang hotel, KL city tour, Genting Highlands & Batu Caves. TCS extra.",
    keywords: [
      "malaysia tour package from india",
      "kuala lumpur tour package",
      "malaysia 3 nights package",
      "genting highlands tour package",
    ],
  },

  // ─── ALMATY (KAZAKHSTAN) ────────────────────────────────────
  {
    slug: "almaty-4n5d",
    destinationSlug: "almaty",
    title: "Almaty (Kazakhstan) 4 Nights / 5 Days Package",
    shortTitle: "Almaty 4N/5D",
    tagline: "Central Asia's rising star — Tien Shan peaks, Silk Road charm & Soviet-era grandeur",
    heroImages: [destAlmaty, destAlmaty],
    rating: 4.6,
    reviewCount: 68,
    duration: "4 Nights / 5 Days",
    nights: 4,
    days: 5,
    destinations: ["Almaty"],
    hotelCategory: "4 Star",
    transferIncluded: true,
    mealsIncluded: "Daily Breakfast",
    startingPrice: "₹81,900",
    originalPrice: "",
    badge: "Trending",
    overview:
      "Almaty is fast becoming one of the most talked-about new destinations for Indian travelers — snow-dusted Tien Shan peaks, Soviet-era architecture, leafy boulevards, and a Silk Road history, all reachable on a direct Air Astana flight from Delhi. This 4 Nights / 5 Days package includes return flights, hotel accommodation, daily breakfast, all major sightseeing with a professional guide, and airport transfers. GST and TCS apply extra as per Government of India regulations. A recent departure ran 13–17 August ex-Delhi (flight KC 964 out, KC 907 return) — seats and exact travel dates are confirmed at the time of booking, so please check current availability with our team.",
    itinerary: [
      {
        day: 1,
        title: "Arrival in Almaty",
        description: "Land in Almaty in the early hours and transfer to your hotel to rest before the day begins.",
        activities: [
          "Arrival at Almaty International Airport (overnight/early-morning flight)",
          "Private transfer to hotel & check-in",
          "Morning at leisure",
          "Evening walk — Arbat Street (Zhibek Zholy) & Panfilov Park",
          "Ascension (Zenkov) Cathedral",
        ],
        meals: "Breakfast",
        hotel: "4★ Hotel, Almaty",
      },
      {
        day: 2,
        title: "Almaty City Tour",
        description: "A full tour of Almaty's landmarks, old and new.",
        activities: [
          "Kok-Tobe Hill cable car & viewpoint",
          "Central State Museum of Kazakhstan",
          "Almaty Central Mosque",
          "Green Bazaar & Republic Square",
        ],
        meals: "Breakfast",
        hotel: "4★ Hotel, Almaty",
      },
      {
        day: 3,
        title: "Medeu & Shymbulak",
        description: "Head into the mountains to the world-famous high-altitude skating rink and ski resort.",
        activities: [
          "Drive to Medeu — the world's highest-altitude Olympic ice rink",
          "Shymbulak cable car ride into the Tien Shan mountains",
          "Mountain viewpoints and photo stops",
          "Return to Almaty",
        ],
        meals: "Breakfast",
        hotel: "4★ Hotel, Almaty",
      },
      {
        day: 4,
        title: "Full-Day Excursion (Charyn Canyon / Big Almaty Lake)",
        description: "A full day out of the city to one of the region's dramatic natural landmarks, subject to season and road conditions.",
        activities: [
          "Full-day excursion to Charyn Canyon or Big Almaty Lake (as per itinerary/season)",
          "Sightseeing with professional tour guide",
          "Return to Almaty in the evening",
        ],
        meals: "Breakfast",
        hotel: "4★ Hotel, Almaty",
      },
      {
        day: 5,
        title: "Departure",
        description: "An early-morning transfer to the airport for your return flight to Delhi.",
        activities: [
          "Early breakfast (or packed breakfast, subject to flight time)",
          "Hotel checkout",
          "Private transfer to Almaty International Airport",
          "Departure",
        ],
        meals: "Breakfast",
      },
    ],
    inclusions: [
      "Return Air Astana flights (Ex-Delhi)",
      "Hotel accommodation for 4 nights",
      "Daily breakfast",
      "All major sightseeing as per itinerary",
      "Airport transfers",
      "Professional tour guide",
      "Entrance tickets as per itinerary",
    ],
    exclusions: [
      "GST & TCS (extra, as applicable)",
      "Lunch & dinner",
      "Travel insurance",
      "Personal expenses",
      "Tips & porterage",
      "Early check-in / late check-out",
      "Kazakhstan visa/e-visa fee (assistance provided)",
      "Optional tours & activities not mentioned in the itinerary",
      "Anything not specifically mentioned under Inclusions",
    ],
    hotels: [
      {
        name: "Handpicked 4★ Hotel — Central Almaty",
        stars: 4,
        location: "Almaty city centre (property confirmed at booking)",
        roomType: "Standard Double / Twin Room",
      },
    ],
    pricingTiers: [
      {
        label: "Per Person (Twin Sharing)",
        price: "₹81,900",
        originalPrice: "",
        description: "Ex-Delhi via Air Astana — GST & TCS extra as applicable",
      },
    ],
    childPrice: undefined,
    emiAvailable: true,
    cancellationPolicy: [
      "Fares and seat availability are confirmed at the time of booking and can change without prior notice",
      "Cancellation charges apply as per Air Astana, hotel, and ground-handler policies — full terms shared before you book",
      "GST & TCS, once collected, follow Government of India rules and are adjustable only through your income tax filing, not refundable by us directly",
      "Any increase in airfare, hotel, or government taxes prior to travel will be charged additionally",
    ],
    faqs: [
      {
        question: "Do Indian passport holders need a visa for Kazakhstan?",
        answer:
          "Indian nationals typically require a Kazakhstan e-visa, applied for online in advance. Our team assists with the application and will confirm current processing times and fees at the time of booking.",
      },
      {
        question: "What is included in the ₹81,900 Almaty package price?",
        answer:
          "The price includes return Air Astana flights ex-Delhi, 4 nights hotel accommodation, daily breakfast, all major sightseeing with a professional guide, and airport transfers. GST and TCS apply extra as per Government of India regulations.",
      },
      {
        question: "What is the best time to visit Almaty?",
        answer:
          "April to October is pleasant for sightseeing and mountain excursions, while December to March draws visitors for skiing at Shymbulak. Check with our team for season-specific itinerary changes.",
      },
      {
        question: "Are the flight details (Air Astana KC 964 / KC 907) fixed?",
        answer:
          "Flight numbers and schedules are illustrative of a recent Delhi–Almaty departure and are subject to airline availability. Exact dates and fares are reconfirmed with you at the time of booking.",
      },
    ],
    relatedSlugs: ["kashmir-family-4n5d", "dubai-classic-4n5d", "thailand-explorer-7n8d"],
    metaTitle: "Almaty Kazakhstan Tour Package from India 4N/5D | Flywings",
    metaDescription:
      "Book Almaty (Kazakhstan) 4 Nights 5 Days tour package ₹81,900 per person, ex-Delhi via Air Astana. Hotel, breakfast, sightseeing & transfers included. GST & TCS extra.",
    keywords: [
      "almaty tour package from india",
      "kazakhstan tour package",
      "almaty package ex delhi",
      "air astana almaty flights",
    ],
  },
];

export const getAllPackages = (): PackageData[] => packages;

export const getPackageBySlug = (slug: string): PackageData | undefined =>
  packages.find((p) => p.slug === slug);

export const getPackagesByDestination = (destinationSlug: string): PackageData[] =>
  packages.filter((p) => p.destinationSlug === destinationSlug);

export const getRelatedPackages = (slugs: string[]): PackageData[] =>
  slugs.map((s) => packages.find((p) => p.slug === s)).filter(Boolean) as PackageData[];

export default packages;
