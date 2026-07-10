/**
 * Content for the "International Tour Packages from Chandigarh" pillar
 * page. Kept in a plain data module so the server page (JSON-LD) and the
 * client component render from the same source.
 *
 * Business rule: no prices are shown anywhere on the pillar page or in
 * blogs — every price question routes to an enquiry/call instead.
 */

export interface DestinationComparisonRow {
  destination: string;
  destinationSlug: string;
  duration: string;
  visa: string;
  flightFromChandigarh: string;
  bestMonths: string;
}

export const COMPARISON_ROWS: DestinationComparisonRow[] = [
  {
    destination: "Dubai",
    destinationSlug: "dubai",
    duration: "4–6 Days",
    visa: "UAE visa (we arrange it)",
    flightFromChandigarh: "Direct from IXC · ~3h 40m",
    bestMonths: "November – March",
  },
  {
    destination: "Thailand",
    destinationSlug: "thailand",
    duration: "7–8 Days",
    visa: "Visa-free · up to 60 days",
    flightFromChandigarh: "Via Delhi · ~8–9h total",
    bestMonths: "November – February",
  },
  {
    destination: "Bali",
    destinationSlug: "bali",
    duration: "6–7 Days",
    visa: "Visa on arrival · 30 days",
    flightFromChandigarh: "Via Delhi / KL · ~12h total",
    bestMonths: "April – October",
  },
  {
    destination: "Singapore",
    destinationSlug: "singapore",
    duration: "4–5 Days",
    visa: "e-Visa (we file it for you)",
    flightFromChandigarh: "Via Delhi · ~9–10h total",
    bestMonths: "February – April",
  },
  {
    destination: "Maldives",
    destinationSlug: "maldives",
    duration: "4–5 Days",
    visa: "Free visa on arrival · 30 days",
    flightFromChandigarh: "Via Delhi · ~7–8h total",
    bestMonths: "November – April",
  },
];

export const PILLAR_FAQS: { question: string; answer: string }[] = [
  {
    question:
      "How much does an international tour package from Chandigarh cost?",
    answer:
      "The cost depends on your destination, travel dates, trip length, hotel category, and how early you book — which is why we quote every trip individually instead of publishing one-size-fits-all rates. Share your plan on +91 99143 10333 and you will receive a fully itemised quote (flights, hotels, transfers, sightseeing, and visa) within 24 hours, with no hidden charges.",
  },
  {
    question: "Is there a direct international flight from Chandigarh airport?",
    answer:
      "Yes. IndiGo operates a direct Chandigarh (IXC) to Dubai (DXB) flight with a flying time of roughly 3 hours 40 minutes, which makes Dubai the most convenient international holiday from Chandigarh. For Thailand, Bali, Singapore, and Maldives, we book connecting flights via Delhi, which is a short drive or a 40-minute hop from Chandigarh.",
  },
  {
    question:
      "Which countries can Indians visit without a visa from Chandigarh?",
    answer:
      "Popular visa-easy destinations for Indian passport holders include Thailand (visa-free entry up to 60 days), Maldives (free visa on arrival for 30 days), Indonesia/Bali (visa on arrival), and Malaysia (visa-free for 30 days). Entry rules change from time to time, so our team re-verifies requirements for every booking and prepares all documents for you.",
  },
  {
    question:
      "Which is the best international honeymoon destination from Chandigarh?",
    answer:
      "For most couples from Chandigarh and Punjab it comes down to three options: Maldives for overwater-villa luxury, Bali for a longer romantic trip at mid-range budgets, and Dubai for glamour plus the shortest, direct flight. Tell us your budget and travel month and we will recommend the right fit with a customised quote.",
  },
  {
    question: "Do your packages include flights from Chandigarh?",
    answer:
      "Yes. Every international package can be quoted with return airfare from Chandigarh (IXC) or Delhi (DEL) — whichever routing is cheaper or more convenient for your dates. We are an air-ticketing agency first, so we monitor fares daily and lock the lowest available fare for your booking.",
  },
  {
    question: "Do you provide visa assistance in Chandigarh and Mohali?",
    answer:
      "Yes. Flywings Tour & Packages Pvt Ltd has been processing tourist visas since 2005 from our office in Phase 7, Mohali (Chandigarh Tricity). We handle documentation, appointment booking, and follow-up for UAE, Singapore, Thailand, Schengen, and most other tourist visas — included with our tour packages.",
  },
  {
    question: "When should I book an international package for the best price?",
    answer:
      "Book 60–90 days before departure for the best airfare and hotel rates — international flights booked around 4 weeks or more in advance are typically 20–25% cheaper than last-minute fares. For peak seasons (Diwali, Christmas–New Year, and the November–February wedding/honeymoon window), book at least 3 months ahead.",
  },
  {
    question: "Can I pay for my tour package in EMI?",
    answer:
      "Yes, EMI options are available on all our major international packages including Dubai, Thailand, Bali, Singapore, and Maldives. Speak to our team on +91 99143 10333 and we will structure a payment plan before your travel date.",
  },
];
