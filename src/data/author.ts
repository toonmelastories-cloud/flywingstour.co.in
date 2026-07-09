/**
 * Site author profile — rendered on /author/[slug], attributed on every
 * blog post, and emitted as a schema.org Person linked to the agency
 * (an E-E-A-T signal: named human author with a real profile page).
 */

export const AUTHOR = {
  name: "Sukhjinder Kaur",
  slug: "sukhjinder-kaur",
  initials: "SK",
  role: "Senior Travel Content Writer",
  tagline: "Premium travel writing for the tourism industry",
  location: "Mohali, Punjab (Chandigarh Tricity)",
  shortBio:
    "Sukhjinder Kaur is a premium travel content writer specialising in the tourism industry. She writes Flywings' destination guides, fare-saving playbooks and visa explainers — every piece researched with the agency's ticketing and visa desks before it is published.",
  bio: [
    "Sukhjinder Kaur is a premium travel content writer specialising in the tourism and aviation industry. At Flywings Tour and Travel, she turns two decades of the agency's on-the-ground booking experience into long-form guides that travellers from Chandigarh, Mohali and across Punjab actually use — what a trip really involves, when to book, and what the brochures leave out.",
    "Her writing process starts at the counter, not the keyboard: every guide is built on inputs from the ticketing desk that watches fares daily, the visa team that files real applications every week, and feedback from travellers after they return. Prices change, visa rules change — so every article carries a verified date and gets re-checked against current conditions.",
    "She believes premium travel content means honest travel content: naming the watch-outs, comparing options a reader might actually choose between, and never publishing a claim the team hasn't verified.",
  ],
  expertise: [
    "Air Ticketing & Fare Strategy",
    "Dubai & Middle East Travel",
    "Southeast Asia (Thailand, Bali, Singapore)",
    "Honeymoon & Couples Travel",
    "Visa Guidance for Indian Travellers",
    "Domestic India Getaways",
  ],
  principles: [
    {
      title: "Research-first, always",
      text: "Every guide is fact-checked with the ticketing and visa desks before publishing — no recycled internet lore.",
    },
    {
      title: "Long-form and complete",
      text: "2,000+ word guides with comparison tables, itineraries and FAQs — one article should answer the whole question.",
    },
    {
      title: "Dated and re-verified",
      text: "Fares, visa rules and seasons change; articles carry a verified date and get updated when the facts move.",
    },
    {
      title: "Honest recommendations",
      text: "Watch-outs get named alongside highlights — the goal is a well-planned trip, not a pretty pitch.",
    },
  ],
} as const;

export const AUTHOR_PATH = `/author/${AUTHOR.slug}`;
