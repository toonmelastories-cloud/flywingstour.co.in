/**
 * Content for the dedicated service landing pages (/services/[slug]).
 *
 * These pages exist for SEO: each footer "Our Services" link gets a
 * keyword-rich, conversion-focused landing page instead of dumping on
 * the generic /services overview. Site-wide rules apply: no absolute
 * prices anywhere — every price question routes to a custom quote.
 */

export interface ServicePage {
  slug: string;
  /** Short name used in footer/breadcrumbs/nav. */
  name: string;
  /** H1 — first half rendered white, `accent` rendered gold. */
  heroTitle: string;
  heroAccent: string;
  heroSubtitle: string;
  heroImage: string;
  heroAlt: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  /** Opening rich paragraphs (rendered in order). */
  intro: string[];
  featuresTitle: string;
  features: { title: string; description: string }[];
  whyTitle: string;
  whyPoints: string[];
  steps: { title: string; description: string }[];
  faqs: { question: string; answer: string }[];
  /** Internal links rendered as related-reading pills. */
  related: { label: string; href: string }[];
}

const servicePages: ServicePage[] = [
  // ─── FLIGHT BOOKING ────────────────────────────────────────
  {
    slug: "flight-booking",
    name: "Flight Booking",
    heroTitle: "Domestic & International",
    heroAccent: "Flight Booking",
    heroSubtitle:
      "Air ticket booking at the day's lowest fares — from Chandigarh (IXC), Delhi, Amritsar and every Indian airport, backed by a human ticketing desk since 2005.",
    heroImage: "/assets/service-flight.jpg",
    heroAlt: "Commercial airplane above golden clouds — air ticket booking Chandigarh, domestic and international flights",
    metaTitle: "Flight Booking Chandigarh | Domestic & International Air Tickets | Flywings",
    metaDescription:
      "Book domestic & international air tickets at the lowest fares with Flywings Mohali — IXC direct flights, group bookings, 24/7 support & honest wait-or-book advice. Free fare check.",
    keywords: [
      "flight booking Chandigarh",
      "air ticket booking Mohali",
      "cheap air tickets India",
      "domestic flight booking",
      "international flight tickets",
      "flight booking agent near me",
      "group flight booking India",
      "Chandigarh airport flights",
    ],
    intro: [
      "Air ticketing is where Flywings began in 2005, and it is still the heart of everything we do. Our Mohali ticketing desk issues domestic and international air tickets every single day — Chandigarh to Mumbai and Bengaluru, direct IXC–Dubai, Delhi long-hauls to Europe and North America, and every routing in between. We watch fares the way traders watch markets: booking windows, fare buckets, sale calendars and seasonal swings — so you board the same seat for less.",
      "What makes a human desk better than a booking app? Honest advice before you pay — book now or wait, fly from Chandigarh or Delhi, one-way mix or return — and a real person on the phone when a flight cancels at midnight. Same fares as the portals, plus group blocks, corporate deals and airline-office contacts the apps simply do not have.",
    ],
    featuresTitle: "What Our Flight Desk Handles",
    features: [
      { title: "Domestic Air Tickets", description: "Every Indian carrier and route — with IXC-first planning so Tricity travellers skip the Delhi drive whenever a direct flight exists." },
      { title: "International Air Tickets", description: "Gulf, Southeast Asia, Europe, UK, North America — smart one-stop routings via Dubai, Abu Dhabi or Delhi at the day's best fare." },
      { title: "Group Fare Blocks (10+)", description: "Weddings, corporate offsites and student groups get airline-filed group fares with seat holds and name flexibility portals can't offer." },
      { title: "Date & Fare Watching", description: "Tell us your route and rough dates — we track fares and call you when the booking window hits its sweet spot." },
      { title: "Changes, Refunds & Disruptions", description: "Reschedules, cancellations and airline disruptions handled by us directly with the airline — you make one call, we do the rest." },
      { title: "Web Check-in & Add-ons", description: "Seats, meals and baggage added at booking prices, boarding passes on your WhatsApp before every departure." },
    ],
    whyTitle: "Why Book Flights with Flywings",
    whyPoints: [
      "Two decades of daily ticketing experience on Chandigarh, Delhi and Amritsar departures",
      "Same fares as online portals — plus group and corporate fares they don't show",
      "Honest wait-or-book advice based on real booking-window data",
      "One phone number for booking, changes, refunds and midnight emergencies",
      "EMI options available on international itineraries",
    ],
    steps: [
      { title: "Share Your Route & Dates", description: "Call, WhatsApp or use the enquiry form — even rough dates work." },
      { title: "Get Options Within Hours", description: "We send the best 2–3 routings with honest notes on fare direction." },
      { title: "Confirm & Fly", description: "Pay, receive tickets on WhatsApp/email, and travel with 24/7 desk support." },
    ],
    faqs: [
      {
        question: "Is booking through Flywings costlier than online portals?",
        answer:
          "No — we sell from the same fare inventory as the portals, so the price is the same or lower. On top of that we access group fares, corporate deals and airline-office contacts that portals don't show, and you get a human desk for changes and emergencies at no extra cost.",
      },
      {
        question: "How far in advance should I book my flight?",
        answer:
          "For domestic routes the 4–6 week window is typically the sweet spot; for international, 6–10 weeks. Last-week fares routinely run 25–35% higher. Our desk tracks your route and tells you honestly whether to book now or wait — read our full guide on cheap flights from Chandigarh on the blog.",
      },
      {
        question: "Do you handle flight cancellations and refunds?",
        answer:
          "Yes — completely. If an airline cancels or reschedules, we pursue the refund or rebooking directly with the airline and keep you updated. Refund timelines follow each airline's policy, and we push them so you don't have to sit in call-centre queues.",
      },
      {
        question: "Can you book group flights for a wedding or corporate trip?",
        answer:
          "Absolutely — groups of 10 or more qualify for airline group blocks with held seats, deferred name submission and better flexibility. This is agent-only inventory and one of the biggest savings we deliver. Share your dates and group size for a group quote.",
      },
    ],
    related: [
      { label: "12 Cheap Flight Booking Secrets", href: "/blog/cheap-flights-from-chandigarh" },
      { label: "Direct Flights from Chandigarh (IXC)", href: "/blog/direct-flights-from-chandigarh" },
      { label: "All Travel Services", href: "/services" },
    ],
  },

  // ─── VISA ASSISTANCE ───────────────────────────────────────
  {
    slug: "visa-assistance",
    name: "Visa Services",
    heroTitle: "Visa Assistance &",
    heroAccent: "Documentation",
    heroSubtitle:
      "Tourist and business visa assistance for 50+ countries — documentation, appointments and follow-up handled by our Mohali visa desk since 2005.",
    heroImage: "/assets/service-visa.jpg",
    heroAlt: "Travel consultant helping client with visa documentation — visa assistance services Chandigarh Mohali",
    metaTitle: "Visa Assistance Chandigarh | Tourist & Business Visa Services | Flywings",
    metaDescription:
      "Visa assistance in Chandigarh & Mohali for UAE, Schengen, UK, USA, Thailand, Singapore & 50+ countries. Documentation, appointments & follow-up by experts since 2005.",
    keywords: [
      "visa assistance Chandigarh",
      "visa agent Mohali",
      "tourist visa services India",
      "UAE visa assistance",
      "Schengen visa help Chandigarh",
      "business visa documentation",
      "visa consultant near me",
    ],
    intro: [
      "A visa file prepared right the first time is the difference between a confirmed holiday and a heartbreaking rejection stamp. Our visa desk in Phase 7, Mohali has been preparing tourist and business visa files since 2005 — UAE and the Gulf, Schengen Europe, UK, USA, Thailand, Singapore, Malaysia, Australia and 50+ destinations — for travellers across Chandigarh, Mohali, Panchkula and Punjab.",
      "We do the part that actually decides outcomes: checking every document against the embassy's current checklist, flagging rejection risks before submission, booking biometric appointments, drafting cover letters and itineraries, and following the file until the decision arrives. Visa assistance is included with every Flywings tour package — and available standalone when you only need the paperwork done right.",
    ],
    featuresTitle: "What Our Visa Desk Covers",
    features: [
      { title: "Tourist Visas", description: "UAE, Thailand, Singapore, Schengen, UK, USA, Australia and more — current checklists, honest timelines and complete filing." },
      { title: "Business Visas", description: "Invitation-letter guidance, company documentation and express options for trade fairs, meetings and site visits." },
      { title: "Document Preparation", description: "Bank statement review, ITR guidance, cover letters, sponsorship formats and photo specifications — checked line by line." },
      { title: "Appointments & Biometrics", description: "VFS/embassy appointment booking at the earliest usable slots, with full briefing on what to carry and expect." },
      { title: "Rejection-Risk Review", description: "Weak files are flagged and fixed before submission — travel history, funds trail and purpose clarity strengthened honestly." },
      { title: "Follow-up Till Decision", description: "We track every file with the processing centre until the passport is back in your hands." },
    ],
    whyTitle: "Why Trust Flywings with Your Visa",
    whyPoints: [
      "Two decades of files across 50+ countries — we know what each embassy actually checks",
      "Documentation checked in person at our Mohali office, not over a chatbot",
      "Honest assessment before you spend — if a file is weak, we say so and fix it",
      "Visa fees and timelines quoted transparently, no hidden service surprises",
      "Included free with every Flywings holiday package",
    ],
    steps: [
      { title: "Tell Us Your Destination", description: "Share your destination, travel dates and passport details for the current checklist." },
      { title: "We Build the File", description: "Documents reviewed and fixed, forms filled, appointments booked, cover letters drafted." },
      { title: "Track to Decision", description: "Biometrics done, file submitted, status tracked and passport returned — we chase, you pack." },
    ],
    faqs: [
      {
        question: "Which countries do you provide visa assistance for?",
        answer:
          "Over 50 destinations — most frequently UAE (Dubai/Abu Dhabi), Schengen Europe, UK, USA, Thailand, Singapore, Malaysia, Vietnam, Australia and New Zealand. If your destination isn't listed, ask — the desk almost certainly has processed it.",
      },
      {
        question: "How long does visa processing take?",
        answer:
          "It varies by country: UAE typically takes 3–4 working days, Singapore about a week, Schengen and UK need 3–6 weeks in season, and the USA depends on interview slot availability. We always advise applying with buffer — and tell you the realistic current timeline before you commit to travel dates.",
      },
      {
        question: "Can you help if my visa was rejected earlier?",
        answer:
          "Yes — rejection cases are a speciality. We analyse the refusal reason, rebuild the weak areas of the file (funds trail, travel purpose, ties to India) and advise honestly on when and how to reapply with a realistic chance.",
      },
      {
        question: "Is visa assistance included in Flywings tour packages?",
        answer:
          "Yes — every international package includes complete visa assistance: documentation, filing and follow-up. The government/embassy fee is part of your itemised package quote, so there are no surprises later.",
      },
    ],
    related: [
      { label: "Dubai Visa Process Explained", href: "/blog/dubai-tour-package-from-chandigarh" },
      { label: "International Packages from Chandigarh", href: "/international-tour-packages-from-chandigarh" },
      { label: "All Travel Services", href: "/services" },
    ],
  },

  // ─── HOTEL BOOKING ─────────────────────────────────────────
  {
    slug: "hotel-booking",
    name: "Hotel Booking",
    heroTitle: "Hotel & Resort",
    heroAccent: "Reservations",
    heroSubtitle:
      "Handpicked hotels, resorts and villas worldwide at agent-contracted rates — from Dubai 5-stars to Dal Lake houseboats.",
    heroImage: "/assets/service-hotel.jpg",
    heroAlt: "Luxury five-star hotel lobby with chandeliers — hotel booking agency Chandigarh",
    metaTitle: "Hotel Booking Agency Chandigarh | Hotels, Resorts & Villas | Flywings",
    metaDescription:
      "Book verified hotels, resorts, villas & houseboats worldwide with Flywings Mohali — agent rates, honest location advice & 24/7 support. Free custom quote.",
    keywords: [
      "hotel booking agency Chandigarh",
      "hotel reservations Mohali",
      "resort booking India",
      "luxury hotel deals",
      "houseboat booking Kashmir",
      "villa booking Bali Maldives",
      "hotel booking agent near me",
    ],
    intro: [
      "Anyone can book a hotel online. What you cannot see from a listing is the 40-minute 'beach walk', the wing under renovation, or which 'sea-view' rooms actually face the parking lot. Our hotel desk books properties we know — either stayed at, inspected on our destination visits, or vetted through two decades of guest feedback across Dubai, Thailand, Bali, Maldives, Singapore, Kashmir and every major Indian destination.",
      "Because we book volume through hotel partners and consolidators, our rates match or beat the portals — and unlike a portal, we tell you honestly when the cheaper hotel is the better choice. Every reservation comes with the details that matter: the right room category, smart location for your plans, meal-plan math done properly, and a human to call if check-in goes sideways at midnight.",
    ],
    featuresTitle: "What We Book",
    features: [
      { title: "City Hotels & Business Stays", description: "4★/5★ properties near metro lines, business districts and attractions — location logic explained before you book." },
      { title: "Beach Resorts & Overwater Villas", description: "Goa, Bali, Phuket, Maldives — the villa-category guidance that decides a honeymoon, done honestly." },
      { title: "Houseboats & Heritage Stays", description: "Dal Lake houseboats we personally re-verify every season, plus palaces and heritage properties across India." },
      { title: "Meal-Plan Advice", description: "Breakfast-only, half-board or all-inclusive — we do the math for your destination so 'cheap' doesn't turn costly at dinner." },
      { title: "Group & Event Blocks", description: "Room blocks for weddings, corporate offsites and group tours at negotiated rates with flexible rooming lists." },
      { title: "Special Requests Delivered", description: "Honeymoon decor, connecting family rooms, early check-ins, accessibility needs — requested in writing and confirmed." },
    ],
    whyTitle: "Why Book Hotels Through Flywings",
    whyPoints: [
      "Properties vetted through real stays and two decades of guest feedback",
      "Agent-contracted rates that match or beat online portals",
      "Honest location and room-category advice before you pay",
      "One call fixes check-in problems — no chatbot queues",
      "Bundles smartly with flights and transfers in one itemised quote",
    ],
    steps: [
      { title: "Share Destination & Dates", description: "Tell us where, when, who's travelling and the experience you want." },
      { title: "Get a Shortlist That Fits", description: "2–3 honest options with location logic, room categories and meal-plan advice." },
      { title: "Book & Relax", description: "Confirmed vouchers on WhatsApp, special requests locked in writing, 24/7 support while you travel." },
    ],
    faqs: [
      {
        question: "Are your hotel rates really competitive with online portals?",
        answer:
          "Yes — we book through hotel partners and consolidator inventory at agent rates, which typically match or beat portal pricing. The bigger difference is what comes with it: honest property advice, confirmed special requests and a human desk when something goes wrong.",
      },
      {
        question: "Can I book only a hotel without a full package?",
        answer:
          "Of course. Hotel-only bookings are welcome — domestic or international. That said, pairing the hotel with flights and transfers in one quote usually saves money and always saves coordination headaches.",
      },
      {
        question: "Do you handle honeymoon and anniversary special requests?",
        answer:
          "Yes — and we put them in writing with the hotel: room decor, cake, late check-out, high-floor or view preferences. Hotels honour written requests from partner agents far more reliably than app comment boxes.",
      },
      {
        question: "What happens if there's a problem at check-in?",
        answer:
          "You call us — at any hour. We hold the direct relationships with the properties and consolidators, so problems get fixed while you wait in the lobby, not after a support ticket cycle.",
      },
    ],
    related: [
      { label: "Maldives & Bali Honeymoon Compared", href: "/blog/best-honeymoon-destination-from-chandigarh" },
      { label: "Kashmir Houseboat Guide", href: "/blog/kashmir-tour-package-from-chandigarh" },
      { label: "All Travel Services", href: "/services" },
    ],
  },

  // ─── CORPORATE TRAVEL ──────────────────────────────────────
  {
    slug: "corporate-travel",
    name: "Corporate Travel",
    heroTitle: "Corporate Travel",
    heroAccent: "Management",
    heroSubtitle:
      "A dedicated travel desk for your company — flights, hotels, visas and MICE, with GST invoicing and 24/7 traveller support.",
    heroImage: "/assets/service-corporate.jpg",
    heroAlt: "Business professionals with luggage at airport — corporate travel management company Chandigarh",
    metaTitle: "Corporate Travel Management Chandigarh | Business Travel Desk | Flywings",
    metaDescription:
      "Corporate travel management for companies in Chandigarh, Mohali & Punjab — flight desks, hotel programmes, visas, MICE & GST invoicing with 24/7 support.",
    keywords: [
      "corporate travel management Chandigarh",
      "business travel agency Mohali",
      "corporate flight booking India",
      "company travel desk",
      "MICE travel Punjab",
      "corporate hotel programme",
      "GST invoice air tickets",
    ],
    intro: [
      "When your team travels, every hour lost to booking chaos is payroll burnt. Flywings runs the travel desk for businesses across the Tricity and Punjab — IT companies flying teams to Bengaluru weekly, manufacturers visiting suppliers overseas, startups stretching every rupee — with one number to call and clean GST invoices at month end.",
      "A corporate account with us means negotiated fares and hotel rates, a travel policy actually enforced at booking time, instant reschedules when meetings move, group blocks for offsites, and visas handled for international assignments. No portals, no per-seat software fees — just a professional desk that knows your travellers by name.",
    ],
    featuresTitle: "Corporate Travel Solutions",
    features: [
      { title: "Dedicated Booking Desk", description: "A named account manager who knows your routes, preferences and policy — bookings confirmed in minutes over call, email or WhatsApp." },
      { title: "Corporate & SME Fares", description: "Airline corporate deals and flexible fare classes that cut change fees on volatile business schedules." },
      { title: "Hotel Programmes", description: "Negotiated rates at business hotels in your regular cities, with GST-compliant billing and breakfast/wifi standardised." },
      { title: "MICE & Offsites", description: "Meetings, incentives, conferences and team offsites — venues, room blocks, transport and itineraries end to end." },
      { title: "Business Visa Desk", description: "Invitation letters, express appointments and complete filing for international assignments and trade fairs." },
      { title: "Reporting & GST Invoicing", description: "Monthly consolidated statements, traveller-wise reports and clean GST invoices your accounts team will love." },
    ],
    whyTitle: "Why Companies Choose Flywings",
    whyPoints: [
      "One accountable desk instead of employees fighting booking portals",
      "Negotiated corporate fares and hotel rates with policy compliance built in",
      "24/7 human support for travellers mid-journey — reschedules in minutes",
      "Clean GST invoicing and monthly consolidated reporting",
      "Serving Tricity businesses since 2005 — references available",
    ],
    steps: [
      { title: "Tell Us Your Travel Pattern", description: "Routes, volumes, policy and pain points — a 20-minute call maps it." },
      { title: "Get a Corporate Proposal", description: "Fares, hotel programme, SLAs and billing terms tailored to your volume." },
      { title: "Start Booking Same Week", description: "Your team gets the desk's number; your accounts team gets clean invoices." },
    ],
    faqs: [
      {
        question: "Is there a minimum travel volume for a corporate account?",
        answer:
          "No rigid minimum — if your team books a few trips a month, a desk already saves you money and hours. Pricing and SLAs scale with volume, and small growing companies are some of our longest-standing accounts.",
      },
      {
        question: "Do you provide GST-compliant invoices for air tickets and hotels?",
        answer:
          "Yes — GST invoices with your company's GSTIN on every booking, plus monthly consolidated statements so input credit reconciliation is painless for your accounts team.",
      },
      {
        question: "Can you handle last-minute changes when meetings move?",
        answer:
          "That's the core of corporate travel — one WhatsApp message and we rework the itinerary, using flexible fare classes booked precisely for this reason. Your traveller keeps working; we do the rebooking.",
      },
      {
        question: "Do you organise offsites and conferences (MICE)?",
        answer:
          "Yes — end to end: venue shortlisting, room blocks, AV and banquets coordination, transport, and group flight blocks. From a 20-person leadership offsite in Kasauli to a 200-person conference in Dubai.",
      },
    ],
    related: [
      { label: "Group Tours & Offsites", href: "/services/group-tours" },
      { label: "Flight Booking Desk", href: "/services/flight-booking" },
      { label: "All Travel Services", href: "/services" },
    ],
  },

  // ─── GROUP TOURS ───────────────────────────────────────────
  {
    slug: "group-tours",
    name: "Group Tours",
    heroTitle: "Group Tours &",
    heroAccent: "Custom Group Travel",
    heroSubtitle:
      "Families, friends, weddings, corporates and senior groups — group tour packages from Chandigarh with group fares, group hotels and zero coordination headache.",
    heroImage: "https://wp.flywingstour.co.in/wp-content/uploads/2026/07/svc-group-tours.jpg",
    heroAlt: "Happy group of Indian travellers on tour together — group tour packages from Chandigarh",
    metaTitle: "Group Tour Packages from Chandigarh | Family & Corporate Groups | Flywings",
    metaDescription:
      "Group tour packages from Chandigarh — family functions, friends' trips, weddings, corporate offsites & senior citizen groups with group fares & full coordination.",
    keywords: [
      "group tour packages from Chandigarh",
      "group travel agency Mohali",
      "family group tour India",
      "corporate group tours",
      "senior citizen group tours",
      "wedding group travel",
      "friends trip packages",
    ],
    intro: [
      "Travelling as a group is twice the fun and, without help, five times the coordination. Flywings has been moving groups out of Chandigarh since 2005 — joint families to Kashmir and Dubai, friends' gangs to Thailand and Bali, wedding parties flying together, kitty groups, senior citizens' circles and corporate teams — with one WhatsApp group, one itinerary and one desk answerable for everything.",
      "Groups unlock inventory individuals never see: airline group fare blocks with held seats, hotel room blocks with flexible rooming lists, private coaches, group visa filing and dedicated tour escorts on request. You collect the people; we run the machine behind the trip.",
    ],
    featuresTitle: "Group Travel, Handled End to End",
    features: [
      { title: "Airline Group Blocks", description: "10+ travellers get held seats, deferred name lists and group pricing — the single biggest saving in group travel." },
      { title: "Hotel Room Blocks", description: "Adjacent rooms, flexible rooming lists, group meal arrangements and banquet halls where the occasion needs one." },
      { title: "Private Transport", description: "Tempo travellers and coaches from your doorstep in the Tricity, plus private fleets at the destination." },
      { title: "Group Visas", description: "Bulk documentation collection and filing — one checklist drive instead of thirty separate embassy struggles." },
      { title: "Custom Itineraries", description: "Senior-friendly pacing, kids' inclusions, adventure days for friends' groups — built around who's actually travelling." },
      { title: "Tour Escort on Request", description: "A Flywings escort travels with larger groups — managing check-ins, coordination and the hundred tiny things." },
    ],
    whyTitle: "Why Groups Travel with Flywings",
    whyPoints: [
      "Group fares and room blocks individuals can't access",
      "One desk coordinates flights, rooms, meals, transport and visas",
      "Rooming-list changes and late joiners handled without drama",
      "Senior citizen and family-with-kids pacing built into itineraries",
      "Trusted by Tricity families, societies and companies since 2005",
    ],
    steps: [
      { title: "Tell Us Group Size & Dream", description: "Rough headcount, destination ideas and occasion — that's enough to start." },
      { title: "Get a Group Proposal", description: "Itinerary options with group-fare economics and hotel blocks, itemised transparently." },
      { title: "We Run the Trip", description: "Bookings, rooming lists, transport and on-trip support — you enjoy the group photo." },
    ],
    faqs: [
      {
        question: "How many people count as a group?",
        answer:
          "Ten or more travellers unlock airline group blocks — the sweet spot where real savings begin. Below ten we still coordinate everything as a multi-family booking; above forty we typically attach a dedicated tour escort.",
      },
      {
        question: "Can everyone in the group pay separately?",
        answer:
          "Yes — we manage per-family or per-person collections against one master booking, with itemised receipts for each payer. The group leader stays informed without becoming the accountant.",
      },
      {
        question: "What if someone drops out or joins late?",
        answer:
          "Group blocks exist precisely for this: name lists close later than individual bookings, and swaps are far more flexible. We manage changes against each airline's and hotel's group policy and keep the impact transparent.",
      },
      {
        question: "Do you organise religious and senior citizen group tours?",
        answer:
          "Regularly — Vaishno Devi and Amritsar circuits, Char Dham planning, and leisure trips paced for senior groups with accessible hotels, unhurried mornings and on-call support throughout.",
      },
    ],
    related: [
      { label: "Corporate Travel & Offsites", href: "/services/corporate-travel" },
      { label: "Weekend Getaways from Chandigarh", href: "/blog/weekend-getaways-from-chandigarh" },
      { label: "Browse Tour Packages", href: "/packages" },
    ],
  },

  // ─── HONEYMOON PACKAGES ────────────────────────────────────
  {
    slug: "honeymoon-packages",
    name: "Honeymoon Packages",
    heroTitle: "Honeymoon",
    heroAccent: "Packages",
    heroSubtitle:
      "Bali villas, Maldives overwater mornings, Dubai skylines and Kashmir houseboats — honeymoons from Chandigarh planned by people who plan hundreds every wedding season.",
    heroImage: "https://wp.flywingstour.co.in/wp-content/uploads/2026/07/svc-honeymoon.jpg",
    heroAlt: "Couple at a romantic overwater villa at sunset — honeymoon packages from Chandigarh",
    metaTitle: "Honeymoon Packages from Chandigarh | Bali, Maldives, Dubai | Flywings",
    metaDescription:
      "Honeymoon packages from Chandigarh — Bali, Maldives, Dubai, Thailand & Kashmir with flights, romantic stays, couple experiences & visa help. Free custom quote in 24 hours.",
    keywords: [
      "honeymoon packages from Chandigarh",
      "honeymoon package Bali Maldives Dubai",
      "best honeymoon destinations from India",
      "couple tour packages Chandigarh",
      "romantic holiday packages",
      "honeymoon travel agent Mohali",
    ],
    intro: [
      "The honeymoon is the one trip you cannot redo — and wedding season is exactly when flights and the best villas sell out first. Every winter our Mohali desk plans hundreds of honeymoons from Chandigarh, Mohali and across Punjab: overwater villas in the Maldives, private-pool mornings in Ubud, rooftop dinners over the Dubai Marina, island evenings in Thailand and houseboat sunsets in Kashmir.",
      "What you get with Flywings is the counter conversation Instagram can't give: which villa category actually matters, which month fits your wedding date, where the 'cheap' quote quietly dropped the couple experiences — and one itemised price covering flights, stays, transfers, romance touches and visas. Tell us your wedding month; we'll tell you honestly where to go.",
    ],
    featuresTitle: "What Every Flywings Honeymoon Includes",
    features: [
      { title: "Destination Matching", description: "Bali vs Maldives vs Dubai vs Thailand — matched honestly to your wedding month, style and budget, not to a brochure." },
      { title: "Romantic Stays", description: "Overwater villas, private-pool villas, houseboats and view rooms — the right category, confirmed in writing." },
      { title: "Couple Experiences", description: "Candlelight dinners, floating breakfasts, couple spas, sunset cruises and private safaris — genuinely included, not 'optional'." },
      { title: "Flights & Transfers", description: "Direct IXC departures where they exist, smart routings where they don't — with private airport transfers throughout." },
      { title: "Visa Assistance", description: "UAE, Indonesia, Thailand, Maldives — complete filing handled while you handle the wedding." },
      { title: "Honeymoon Announcements", description: "We tell the resort it's your honeymoon — upgrades, decorated rooms and surprise desserts are real and free." },
    ],
    whyTitle: "Why Couples Plan with Flywings",
    whyPoints: [
      "Hundreds of honeymoons planned from the Tricity every wedding season",
      "Honest villa-category and season advice that protects the trip's one chance",
      "One itemised quote — flights, stays, romance inclusions and visas together",
      "EMI options so the dream trip fits the wedding-year budget",
      "24/7 support while you travel — parents get our number too",
    ],
    steps: [
      { title: "Share Your Wedding Month", description: "Dates, dream destinations and days available — the matching starts there." },
      { title: "Get a Tailored Proposal", description: "2–3 destination options with honest season notes and an itemised quote in 24 hours." },
      { title: "Book Early, Relax Fully", description: "We lock villas and flights before the wedding rush, then run everything till you're home." },
    ],
    faqs: [
      {
        question: "Which honeymoon destination is best from Chandigarh?",
        answer:
          "It depends on your wedding month: November–February weddings suit the Maldives and Dubai perfectly, April–October belongs to Bali, and Thailand flexes across most of the year. Our detailed comparison of Bali vs Maldives vs Dubai on the blog walks through exactly this decision.",
      },
      {
        question: "How far in advance should we book our honeymoon?",
        answer:
          "For December–February weddings, 60–90 days ahead — overwater villas and the best flight fares genuinely sell out first in wedding season. Booking 4+ weeks early typically keeps flights 20–25% cheaper than last-minute.",
      },
      {
        question: "Can you plan a honeymoon combining two destinations?",
        answer:
          "Yes — Dubai + Maldives is the classic 8–9 day combination (city glamour, then lagoon switch-off), and Singapore + Bali works beautifully too. We sequence the flights so the routing feels effortless.",
      },
      {
        question: "Do you offer EMI on honeymoon packages?",
        answer:
          "Yes — EMI plans are available so the wedding year doesn't have to choose between the celebration and the trip. Ask for EMI options with your quote and we'll structure payments before your travel date.",
      },
    ],
    related: [
      { label: "Bali vs Maldives vs Dubai Compared", href: "/blog/best-honeymoon-destination-from-chandigarh" },
      { label: "Dubai Honeymoon 5N/6D Package", href: "/packages/dubai-honeymoon-5n6d" },
      { label: "Bali Romance 6N/7D Package", href: "/packages/bali-romance-6n7d" },
    ],
  },
];

export default servicePages;

export const getServicePageBySlug = (slug: string): ServicePage | undefined =>
  servicePages.find((s) => s.slug === slug);
