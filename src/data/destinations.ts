const destDubai = "/assets/dest-dubai.jpg";
const destThailand = "/assets/dest-thailand.jpg";
const destBali = "/assets/dest-bali.jpg";
const destKashmir = "/assets/dest-kashmir.jpg";
const destMaldives = "/assets/dest-maldives.jpg";
const destSingapore = "/assets/dest-singapore.jpg";
const destMalaysia = "https://wp.flywingstour.co.in/wp-content/uploads/2026/07/dest-malaysia.jpg";
const destAlmaty = "https://wp.flywingstour.co.in/wp-content/uploads/2026/07/dest-almaty.jpg";

/**
 * Domestic destination heroes.
 *
 * PENDING UPLOAD: these four files do not exist on WordPress yet and
 * will 404 until they are added to the September 2026 uploads folder.
 * Upload before deploying these pages. Landscape, 1600x900 or wider:
 *   dest-manali.jpg        Solang Valley or the Beas valley with snow peaks
 *   dest-shimla-manali.jpg Shimla Ridge with Christ Church, or the toy train
 *   dest-goa.jpg           Palm-lined beach at golden hour, boats on the sand
 *   dest-spiti.jpg         Key Monastery above the Spiti river, bare mountains
 */
const destManali = "https://wp.flywingstour.co.in/wp-content/uploads/2026/09/dest-manali.jpg";
const destShimlaManali = "https://wp.flywingstour.co.in/wp-content/uploads/2026/09/dest-shimla-manali.jpg";
const destGoa = "https://wp.flywingstour.co.in/wp-content/uploads/2026/09/dest-goa.jpg";
const destSpiti = "https://wp.flywingstour.co.in/wp-content/uploads/2026/09/dest-spiti.jpg";

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  activities: string[];
}

export interface TourPackage {
  id: string;
  title: string;
  duration: string;
  price: string;
  originalPrice: string;
  inclusions: string[];
  badge?: string;
}

export interface Destination {
  slug: string;
  name: string;
  country: string;
  tagline: string;
  heroImage: string;
  startingPrice: string;
  bestTime: string;
  tripDuration: string;
  currency: string;
  visaInfo: string;
  weather: string;
  about: string;
  metaTitle: string;
  metaDescription: string;
  packages: TourPackage[];
  highlights: { icon: string; title: string; description: string }[];
  itinerary: ItineraryDay[];
  inclusions: string[];
  exclusions: string[];
  faqs: { question: string; answer: string }[];
  relatedSlugs: string[];
}

const destinations: Destination[] = [
  {
    slug: "dubai",
    name: "Dubai",
    country: "UAE",
    tagline: "Where luxury meets the desert — a city of wonders",
    heroImage: destDubai,
    startingPrice: "₹49,999",
    bestTime: "November to March",
    tripDuration: "5–7 Days",
    currency: "AED (UAE Dirham)",
    visaInfo: "Visa on arrival for Indian passport holders (30 days)",
    weather: "Desert climate; mild winters (17–28°C), hot summers (38°C+)",
    about:
      "Dubai is a jewel of the Middle East — a city that rose from desert sands to become one of the most glamorous destinations on Earth. Home to the world's tallest building (Burj Khalifa), ultra-luxury malls, pristine beaches, and thrilling desert safaris, Dubai is the ultimate blend of tradition and ultra-modernity. Indian travelers love Dubai for its seamless visa process, direct flights, and welcoming culture. Whether you seek a honeymoon escape, a family holiday, or a solo adventure, Dubai delivers unforgettable experiences at every turn.",
    metaTitle: "Dubai Tour Package from India | Flywings Tour & Packages Pvt Ltd",
    metaDescription:
      "Book the best Dubai tour packages from India starting at ₹49,999. Flights, 5★ hotels, desert safari, city tours, and visa assistance included. 24/7 support. Get a free quote today.",
    packages: [
      {
        id: "dubai-classic",
        title: "Dubai Classic",
        duration: "4N / 5D",
        price: "₹49,999",
        originalPrice: "₹65,000",
        inclusions: ["Return Flights", "4★ Hotel", "Desert Safari", "City Tour", "Breakfast"],
        badge: "Best Value",
      },
      {
        id: "dubai-luxury",
        title: "Dubai Luxury",
        duration: "5N / 6D",
        price: "₹79,999",
        originalPrice: "₹1,00,000",
        inclusions: ["Return Flights", "5★ Hotel", "Desert Safari", "Burj Khalifa Entry", "All Meals", "Transfers"],
        badge: "Best Seller",
      },
      {
        id: "dubai-honeymoon",
        title: "Dubai Honeymoon",
        duration: "5N / 6D",
        price: "₹89,999",
        originalPrice: "₹1,15,000",
        inclusions: ["Return Flights", "5★ Resort", "Romantic Dinner", "Spa", "Desert Safari", "Dhow Cruise"],
        badge: "Romantic",
      },
    ],
    highlights: [
      { icon: "🏙️", title: "Iconic Skyline", description: "Burj Khalifa, Burj Al Arab, Dubai Frame & more" },
      { icon: "🏜️", title: "Desert Safari", description: "Dune bashing, camel rides, belly dance & BBQ dinner" },
      { icon: "🛍️", title: "World-Class Shopping", description: "Dubai Mall, Gold Souk, Spice Market & Outlet City" },
      { icon: "🎢", title: "Theme Parks", description: "IMG Worlds, Global Village, Miracle Garden & Aquaventure" },
      { icon: "🌊", title: "Beaches & Water Sports", description: "JBR Beach, Palm Jumeirah, jet skiing & parasailing" },
      { icon: "🍽️", title: "Fine Dining", description: "World cuisine from Michelin-star chefs & rooftop restaurants" },
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival & City Orientation",
        description: "Welcome to Dubai! Arrive at Dubai International Airport where our representative will assist you.",
        activities: ["Airport meet & greet", "Check-in at 5★ hotel", "Dubai Creek & Old Dubai orientation", "Dinner at a rooftop restaurant"],
      },
      {
        day: 2,
        title: "Modern Dubai & Burj Khalifa",
        description: "Explore the ultra-modern side of Dubai with its iconic skyscrapers and world-famous attractions.",
        activities: ["Burj Khalifa 124th floor visit (At the Top)", "Dubai Mall & Souk Al Bahar", "Dubai Fountain show", "Shopping at Dubai Mall"],
      },
      {
        day: 3,
        title: "Desert Safari Adventure",
        description: "An adrenaline-packed afternoon and magical evening in the golden Arabian desert.",
        activities: ["Morning at leisure", "Desert dune bashing in 4x4", "Camel riding & sandboarding", "BBQ dinner with belly dance & Tanoura show"],
      },
      {
        day: 4,
        title: "Palm Jumeirah & Marina",
        description: "Discover Dubai's iconic man-made island and the glamorous Marina district.",
        activities: ["Palm Jumeirah monorail", "Atlantis Aquaventure (optional)", "Dubai Marina & JBR beach", "Dhow Cruise dinner"],
      },
      {
        day: 5,
        title: "Shopping & Departure",
        description: "Last-minute shopping and a fond farewell from the city of gold.",
        activities: ["Gold Souk & Spice Market", "City Centre Mall shopping", "Hotel checkout", "Transfer to airport"],
      },
    ],
    inclusions: [
      "Return economy class flights from India",
      "4★ / 5★ hotel accommodation with breakfast",
      "Dubai visa fees and processing",
      "Return airport transfers",
      "Desert safari with BBQ dinner",
      "Burj Khalifa 124th floor entry",
      "Dubai city tour with guide",
      "Dhow cruise dinner",
      "24/7 travel assistance",
    ],
    exclusions: [
      "Travel insurance (recommended)",
      "Personal expenses & shopping",
      "Optional tours not mentioned",
      "Tips & gratuities",
      "Lunches & dinners unless specified",
      "Early check-in / late checkout",
    ],
    faqs: [
      {
        question: "What is the best time to visit Dubai?",
        answer: "The best time to visit Dubai is from November to March when the weather is pleasant (17–28°C). Avoid May to September due to extreme heat (40°C+). December to February is peak season.",
      },
      {
        question: "Do Indians need a visa to visit Dubai?",
        answer: "Indian passport holders with a valid US, UK, or Schengen visa can get a visa on arrival for 14 days. Otherwise, Flywings will arrange your UAE tourist visa (30/60 days) as part of your package.",
      },
      {
        question: "How much does a Dubai tour package cost from India?",
        answer: "Dubai tour packages from India start at ₹49,999 per person for 4N/5D including flights, hotel, and key activities. Luxury packages with 5★ hotels start at ₹79,999.",
      },
      {
        question: "Is Dubai safe for solo female travelers?",
        answer: "Yes, Dubai is one of the safest cities in the world, including for solo female travelers. The city has strict laws and excellent security infrastructure.",
      },
      {
        question: "Is Dubai a good honeymoon destination?",
        answer: "Absolutely! Dubai is a top honeymoon destination offering luxury resorts, romantic desert dinners, private beach experiences, spa retreats, and fine dining — all in a stunning setting.",
      },
    ],
    relatedSlugs: ["maldives", "singapore", "thailand"],
  },
  {
    slug: "thailand",
    name: "Thailand",
    country: "Bangkok & Phuket",
    tagline: "Land of smiles — temples, beaches, and tropical bliss",
    heroImage: destThailand,
    startingPrice: "₹34,999",
    bestTime: "November to April",
    tripDuration: "6–8 Days",
    currency: "THB (Thai Baht)",
    visaInfo: "Visa on arrival for Indian passport holders (30 days free)",
    weather: "Tropical; warm year-round (28–35°C). Rainy season May–October.",
    about:
      "Thailand is Southeast Asia's most beloved destination, enchanting travelers with ornate Buddhist temples, turquoise waters, vibrant street food scenes, and warm hospitality. From the bustling markets of Bangkok to the paradise beaches of Phuket and the emerald waters of Krabi, Thailand offers an extraordinary range of experiences at surprisingly affordable prices. Indian travelers enjoy visa-free access, making Thailand one of the easiest international destinations to explore.",
    metaTitle: "Thailand Tour Package from India | Flywings Tour & Packages Pvt Ltd",
    metaDescription:
      "Book Thailand tour packages from India starting ₹34,999. Bangkok, Phuket & Krabi. Flights, hotels, island tours, and more included. Get free quote.",
    packages: [
      {
        id: "thailand-essential",
        title: "Thailand Essential",
        duration: "5N / 6D",
        price: "₹34,999",
        originalPrice: "₹48,000",
        inclusions: ["Return Flights", "4★ Hotel", "Bangkok City Tour", "Phi Phi Island Tour", "Breakfast"],
        badge: "Best Value",
      },
      {
        id: "thailand-explorer",
        title: "Thailand Explorer",
        duration: "7N / 8D",
        price: "₹52,999",
        originalPrice: "₹69,000",
        inclusions: ["Return Flights", "4★ Hotel", "Bangkok + Phuket + Krabi", "All Island Tours", "Meals", "Transfers"],
        badge: "Best Seller",
      },
      {
        id: "thailand-honeymoon",
        title: "Thailand Honeymoon",
        duration: "6N / 7D",
        price: "₹62,999",
        originalPrice: "₹82,000",
        inclusions: ["Return Flights", "Beach Resort", "Private Island Trip", "Couples Spa", "Candle Dinner", "Transfers"],
        badge: "Romantic",
      },
    ],
    highlights: [
      { icon: "🏝️", title: "Tropical Islands", description: "Phi Phi, Krabi, Koh Samui, James Bond Island & more" },
      { icon: "🛕", title: "Buddhist Temples", description: "Wat Phra Kaew, Wat Arun, Wat Pho & Grand Palace" },
      { icon: "🌊", title: "Water Activities", description: "Snorkeling, kayaking, diving & island hopping" },
      { icon: "🍜", title: "Street Food Culture", description: "Pad Thai, Som Tam, mango sticky rice & night markets" },
      { icon: "🐘", title: "Wildlife Experiences", description: "Ethical elephant sanctuaries and jungle trekking" },
      { icon: "🛍️", title: "Shopping & Nightlife", description: "Chatuchak Market, Khao San Road & beach parties" },
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Bangkok",
        description: "Land in Bangkok and begin your Thai adventure in Asia's most vibrant capital.",
        activities: ["Airport transfer to hotel", "Khao San Road exploration", "Thai Welcome dinner", "Night market visit"],
      },
      {
        day: 2,
        title: "Bangkok City & Temples",
        description: "Explore Bangkok's royal heritage and spiritual heart.",
        activities: ["Grand Palace & Wat Phra Kaew", "Wat Pho (Reclining Buddha)", "Chao Phraya River Cruise", "Asiatique Night Market"],
      },
      {
        day: 3,
        title: "Bangkok to Phuket",
        description: "Fly to Phuket and settle into your beachside haven.",
        activities: ["Domestic flight to Phuket", "Check-in at beach resort", "Patong Beach sunset", "Bangla Road evening"],
      },
      {
        day: 4,
        title: "Phi Phi Island Tour",
        description: "Full-day speedboat tour to the legendary Phi Phi Islands.",
        activities: ["Phi Phi Don & Phi Phi Leh", "Maya Bay (The Beach)", "Snorkeling at Bamboo Island", "Viking Cave & Monkey Beach"],
      },
      {
        day: 5,
        title: "Phang Nga Bay & James Bond Island",
        description: "Kayak through stunning limestone karsts and hidden sea caves.",
        activities: ["Phang Nga Bay by longtail boat", "James Bond Island", "Sea kayaking through caves", "Local seafood lunch"],
      },
      {
        day: 6,
        title: "Leisure & Departure",
        description: "Relax on white sand beaches before heading home.",
        activities: ["Beach relaxation", "Spa session", "Shopping at Jungceylon Mall", "Airport transfer"],
      },
    ],
    inclusions: [
      "Return economy class flights from India",
      "Hotel accommodation with breakfast",
      "Bangkok to Phuket domestic flight",
      "All airport and hotel transfers",
      "Phi Phi Island speedboat tour",
      "Phang Nga Bay & James Bond Island tour",
      "Bangkok city tour with guide",
      "Visa on arrival fee (if applicable)",
      "24/7 Flywings travel assistance",
    ],
    exclusions: [
      "Travel insurance",
      "Personal expenses",
      "Optional tours",
      "Tips and gratuities",
      "Lunches & dinners unless specified",
    ],
    faqs: [
      {
        question: "Do Indians need a visa to visit Thailand?",
        answer: "Indian passport holders currently enjoy visa-free entry to Thailand for up to 30 days. No pre-visa required — simply arrive at the airport and proceed through immigration.",
      },
      {
        question: "What is the best time to visit Thailand?",
        answer: "November to April is the ideal time with dry, sunny weather. December to February is peak season. The rainy season (May–October) brings lush greenery and fewer crowds but occasional heavy showers.",
      },
      {
        question: "How much does a Thailand tour package cost from India?",
        answer: "Thailand packages from India start at ₹34,999 per person for 5N/6D covering Bangkok and Phuket with flights, hotel, and key tours. Budget travelers can explore comfortably within this range.",
      },
      {
        question: "Is Thailand safe for families?",
        answer: "Yes, Thailand is extremely family-friendly. Attractions like elephant sanctuaries, water parks, cultural shows, and beautiful beaches make it perfect for families with children of all ages.",
      },
    ],
    relatedSlugs: ["bali", "singapore", "maldives"],
  },
  {
    slug: "bali",
    name: "Bali",
    country: "Indonesia",
    tagline: "The Island of the Gods — spiritual, serene, and stunning",
    heroImage: destBali,
    startingPrice: "₹36,999",
    bestTime: "April to October",
    tripDuration: "5–7 Days",
    currency: "IDR (Indonesian Rupiah)",
    visaInfo: "Visa on arrival for Indian passport holders (USD 35, 30 days)",
    weather: "Tropical; warm year-round (26–32°C). Dry season: April–October.",
    about:
      "Bali is more than a destination — it is a spiritual experience. This enchanting Indonesian island captivates travelers with emerald rice terraces, ancient Hindu temples perched on cliff edges, pristine surf beaches, and a wellness culture unlike anywhere else. From the cultural hub of Ubud to the beach paradise of Seminyak and the surfer's haven of Canggu, Bali suits every type of traveler. Indian visitors especially love Bali for its vegetarian-friendly cuisine, vibrant yoga retreats, and warm Balinese hospitality.",
    metaTitle: "Bali Tour Package from India | Flywings Tour & Packages Pvt Ltd",
    metaDescription:
      "Book Bali Indonesia tour packages from India starting ₹36,999. Temples, rice terraces, beaches, spa retreats, and more. Flights included. Get free quote.",
    packages: [
      {
        id: "bali-bliss",
        title: "Bali Bliss",
        duration: "5N / 6D",
        price: "₹36,999",
        originalPrice: "₹50,000",
        inclusions: ["Return Flights", "4★ Resort", "Temple Tour", "Rice Terrace Visit", "Breakfast"],
        badge: "Best Value",
      },
      {
        id: "bali-romance",
        title: "Bali Romance",
        duration: "6N / 7D",
        price: "₹59,999",
        originalPrice: "₹78,000",
        inclusions: ["Return Flights", "Clifftop Villa", "Couples Spa", "Sunset Dinner", "Ubud Swing", "Transfers"],
        badge: "Honeymoon Pick",
      },
      {
        id: "bali-wellness",
        title: "Bali Wellness Retreat",
        duration: "7N / 8D",
        price: "₹74,999",
        originalPrice: "₹95,000",
        inclusions: ["Return Flights", "Boutique Resort", "Daily Yoga", "Spa Treatments", "Cooking Class", "All Meals"],
        badge: "Wellness",
      },
    ],
    highlights: [
      { icon: "🛕", title: "Ancient Temples", description: "Tanah Lot, Uluwatu, Besakih & Tirta Empul" },
      { icon: "🌾", title: "Rice Terraces", description: "Tegalalang UNESCO rice terrace & Jatiluwih paddies" },
      { icon: "🧘", title: "Yoga & Wellness", description: "Ubud retreat centers, spa therapies & meditation" },
      { icon: "🏄", title: "Surf & Beach", description: "Kuta, Seminyak, Canggu & Nusa Dua beaches" },
      { icon: "🌋", title: "Mt. Batur Trekking", description: "Sunrise hike to the active volcano rim" },
      { icon: "🎨", title: "Arts & Culture", description: "Traditional Kecak fire dance, silverwork & batik" },
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Bali",
        description: "Arrive at Ngurah Rai Airport and settle into your tropical resort.",
        activities: ["Airport transfer", "Check-in at resort", "Seminyak Beach sunset", "Welcome dinner"],
      },
      {
        day: 2,
        title: "Ubud Cultural Discovery",
        description: "Explore Bali's cultural heartland — ancient temples, monkey forests, and artists' workshops.",
        activities: ["Tegalalang Rice Terrace", "Ubud Monkey Forest", "Traditional Ubud Market", "Kecak Fire Dance at Uluwatu"],
      },
      {
        day: 3,
        title: "Temples & Sacred Sites",
        description: "Visit Bali's most revered and photogenic temples.",
        activities: ["Tanah Lot Temple at sunrise", "Tirta Empul holy spring temple", "Pura Luhur Batukaru", "Traditional Balinese massage"],
      },
      {
        day: 4,
        title: "Adventure & Nature",
        description: "For the thrill-seekers — waterfalls, swings, and volcano views.",
        activities: ["Mt. Batur sunrise trek (optional)", "Tegenungan Waterfall", "Bali Swing (Instagram famous)", "ATV riding"],
      },
      {
        day: 5,
        title: "Beach & Water Sports",
        description: "Spend a blissful day on Bali's pristine southern beaches.",
        activities: ["Nusa Dua Beach", "Water sports: snorkeling, parasailing", "Uluwatu Cliff Walk", "Sunset at Jimbaran Beach"],
      },
      {
        day: 6,
        title: "Leisure & Departure",
        description: "Final Balinese experience before heading home.",
        activities: ["Spa treatment", "Souvenir shopping at Sukawati Market", "Airport transfer"],
      },
    ],
    inclusions: [
      "Return economy class flights from India",
      "Hotel/Resort accommodation with breakfast",
      "Bali visa on arrival fee",
      "All airport and inter-hotel transfers",
      "Ubud cultural tour with guide",
      "Temple tour (Tanah Lot & Tirta Empul)",
      "Tegalalang Rice Terrace visit",
      "Uluwatu sunset and Kecak fire dance",
      "24/7 Flywings travel support",
    ],
    exclusions: [
      "Travel insurance",
      "Personal expenses",
      "Optional adventure activities",
      "Lunches & dinners unless specified",
      "Tips and gratuities",
    ],
    faqs: [
      {
        question: "Is Bali good for a honeymoon from India?",
        answer: "Absolutely! Bali is one of the most romantic destinations in the world. Clifftop villas, private beach dinners, couples spa rituals, and stunning sunsets make it ideal for newlyweds.",
      },
      {
        question: "Do Indians need a visa for Bali?",
        answer: "Yes, Indian passport holders need a Visa on Arrival (VoA) for Indonesia, which costs USD 35 and grants a 30-day stay extendable by another 30 days. Flywings can guide you through the process.",
      },
      {
        question: "What is the best time to visit Bali?",
        answer: "April to October (dry season) is the best time to visit Bali. July and August are peak months. November to March brings monsoon rains but the island is lush, green, and less crowded.",
      },
      {
        question: "Is Bali vegetarian-friendly for Indian travelers?",
        answer: "Yes! Bali has a thriving vegetarian and vegan food scene, especially in Ubud. You'll find plenty of Indian-style vegetarian options, salads, smoothie bowls, and plant-based restaurants.",
      },
    ],
    relatedSlugs: ["thailand", "maldives", "singapore"],
  },
  {
    slug: "kashmir",
    name: "Kashmir",
    country: "India",
    tagline: "Heaven on Earth — where the Himalayas meet paradise",
    heroImage: destKashmir,
    startingPrice: "₹22,999",
    bestTime: "March to October",
    tripDuration: "4–6 Days",
    currency: "INR (Indian Rupee)",
    visaInfo: "No visa required for Indian citizens",
    weather: "Alpine climate; pleasant summers (15–25°C), snowy winters (−5 to 5°C)",
    about:
      "Kashmir — aptly called 'Paradise on Earth' — is India's crown jewel of natural beauty. The Kashmir Valley stuns with mirror-like Dal Lake, flower-filled gardens, majestic Mughal architecture, and snow-draped Himalayan peaks. A shikara ride at sunrise, a stay on a traditional wooden houseboat, the meadows of Gulmarg, and the hill station charm of Pahalgam create memories that last a lifetime. Kashmir is the perfect domestic holiday for Indian families, couples, and solo travelers seeking dramatic landscapes.",
    // Kashmir is the one domestic destination in this file, so unlike the
    // international pages it keeps the departure city. Research bears this
    // out: "from Chandigarh" carries real volume for domestic trips
    // (45 Manali variants, 23 Shimla, 4 Kashmir) and almost none for
    // international ones, where "from India" dominates.
    metaTitle: "Kashmir Tour Package from Chandigarh with Flight | Flywings",
    metaDescription:
      "Kashmir tour packages from Chandigarh starting ₹22,999, with flights. Dal Lake houseboats, Gulmarg, Pahalgam and Shikara rides. Free quote in 24 hours.",
    packages: [
      {
        id: "kashmir-classic",
        title: "Kashmir Classic",
        duration: "4N / 5D",
        price: "₹22,999",
        originalPrice: "₹32,000",
        inclusions: ["Return Flights", "Houseboat + Hotel", "Shikara Ride", "Gulmarg", "Breakfast"],
        badge: "Family Fav",
      },
      {
        id: "kashmir-complete",
        title: "Kashmir Complete",
        duration: "6N / 7D",
        price: "₹34,999",
        originalPrice: "₹46,000",
        inclusions: ["Return Flights", "Premium Houseboat", "Pahalgam", "Gulmarg", "Sonmarg", "All Meals", "Transfers"],
        badge: "Best Seller",
      },
      {
        id: "kashmir-winter",
        title: "Kashmir Winter Special",
        duration: "5N / 6D",
        price: "₹39,999",
        originalPrice: "₹54,000",
        inclusions: ["Return Flights", "Snow Hotel", "Skiing in Gulmarg", "Gondola Ride", "Snowfall Experience", "Meals"],
        badge: "Winter Special",
      },
    ],
    highlights: [
      { icon: "⛵", title: "Shikara Rides", description: "Glide across serene Dal Lake at dawn" },
      { icon: "🏔️", title: "Gulmarg", description: "Asia's highest gondola & world-class skiing" },
      { icon: "🌸", title: "Mughal Gardens", description: "Shalimar Bagh, Nishat Bagh & Chashme Shahi" },
      { icon: "🌿", title: "Pahalgam", description: "Lidder River, Aru Valley & Betaab Valley" },
      { icon: "🏠", title: "Houseboat Stay", description: "Iconic wooden houseboats on Dal Lake" },
      { icon: "❄️", title: "Sonmarg", description: "Glacier meadows & Thajiwas Glacier trek" },
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Srinagar",
        description: "Welcome to the crown of India. Arrive at Srinagar Airport and board your houseboat.",
        activities: ["Airport transfer to houseboat", "Evening Shikara ride on Dal Lake", "Floating market visit", "Houseboat dinner"],
      },
      {
        day: 2,
        title: "Srinagar Sightseeing",
        description: "Explore Srinagar's iconic Mughal-era gardens and ancient mosques.",
        activities: ["Shalimar Bagh & Nishat Bagh", "Shankaracharya Temple", "Jama Masjid", "Local Kashmiri handicraft shopping"],
      },
      {
        day: 3,
        title: "Gulmarg Day Trip",
        description: "Visit the 'Meadow of Flowers' — home to the world's highest gondola.",
        activities: ["Drive to Gulmarg (56 km)", "Gondola cable car ride (Phase 1 & 2)", "Snow activities & skiing", "Return to Srinagar"],
      },
      {
        day: 4,
        title: "Pahalgam Valley",
        description: "Journey to the stunning Pahalgam — gateway to the Amarnath Yatra.",
        activities: ["Aru Valley & Betaab Valley", "Lidder River walk", "Baisaran meadows (mini-Switzerland)", "Return to Srinagar"],
      },
      {
        day: 5,
        title: "Departure",
        description: "Last morning on the houseboat before your journey home.",
        activities: ["Sunrise Shikara ride", "Kashmiri wazwan breakfast", "Airport transfer & departure"],
      },
    ],
    inclusions: [
      "Return economy flights from Delhi/Mumbai",
      "3 nights premium houseboat on Dal Lake",
      "2 nights 3★/4★ hotel",
      "All daily breakfast & dinner",
      "All sightseeing by private cab",
      "Shikara ride on Dal Lake",
      "Gulmarg gondola (Phase 1)",
      "Pahalgam valley tour",
      "24/7 Flywings travel support",
    ],
    exclusions: [
      "Travel insurance",
      "Personal expenses",
      "Pony rides & adventure activities",
      "Gondola Phase 2 (optional extra)",
      "Lunches",
      "Tips and gratuities",
    ],
    faqs: [
      {
        question: "Is Kashmir safe to visit in 2025?",
        answer: "Yes, Kashmir is safe for tourists. Millions of travelers visit Kashmir every year. Tourist zones like Srinagar, Gulmarg, Pahalgam, and Sonmarg are well-secured and peaceful. Always follow local advisories.",
      },
      {
        question: "What is the best time to visit Kashmir?",
        answer: "March–June offers pleasant weather and blooming flowers. July–September sees lush green valleys. October–November has golden autumn foliage. December–February offers heavy snowfall and ski opportunities.",
      },
      {
        question: "Can I see snowfall in Kashmir?",
        answer: "Yes! Gulmarg receives heavy snowfall from December to February. Ski resorts, snowmobile rides, and snowfall experiences are available. Even in October and March, you can often find snow at higher altitudes.",
      },
      {
        question: "Is Kashmir good for a honeymoon?",
        answer: "Absolutely! Kashmir is one of India's most romantic honeymoon destinations. A houseboat stay on Dal Lake, shikara rides at dawn, Mughal gardens, and snow-capped mountains create an unforgettable experience.",
      },
    ],
    relatedSlugs: ["dubai", "thailand", "bali"],
  },
  {
    slug: "maldives",
    name: "Maldives",
    country: "Maldives",
    tagline: "An island paradise of crystal waters and overwater dreams",
    heroImage: destMaldives,
    startingPrice: "₹89,999",
    bestTime: "November to April",
    tripDuration: "4–6 Days",
    currency: "MVR (Maldivian Rufiyaa) / USD accepted",
    visaInfo: "Free visa on arrival for all nationalities (30 days)",
    weather: "Tropical; warm year-round (26–30°C). Dry season: November–April.",
    about:
      "The Maldives is the definition of paradise — 1,200 tiny coral islands scattered like jewels across the Indian Ocean, each ringed with powdery white sand and crystal-clear turquoise waters. Here, the most iconic luxury experience is the overwater bungalow: a private villa perched above the lagoon with a glass floor panel revealing the coral reef below. Whether you dream of snorkeling with manta rays, dining under the stars, or simply disconnecting from the world in absolute tranquility, the Maldives delivers perfection.",
    metaTitle: "Maldives Tour Package from India | Flywings Tour & Packages Pvt Ltd",
    metaDescription:
      "Book Maldives tour packages from India starting ₹89,999. Overwater villas, snorkeling, all-inclusive resorts, and more. Flights included. Get free quote.",
    packages: [
      {
        id: "maldives-escape",
        title: "Maldives Escape",
        duration: "4N / 5D",
        price: "₹89,999",
        originalPrice: "₹1,10,000",
        inclusions: ["Return Flights", "Water Villa", "Breakfast & Dinner", "Snorkeling", "Speedboat Transfers"],
        badge: "Ultra Luxury",
      },
      {
        id: "maldives-allInclusive",
        title: "Maldives All-Inclusive",
        duration: "5N / 6D",
        price: "₹1,19,999",
        originalPrice: "₹1,50,000",
        inclusions: ["Return Flights", "Overwater Villa", "All Meals", "Diving Session", "Sunset Cruise", "Spa"],
        badge: "Best Seller",
      },
      {
        id: "maldives-honeymoon",
        title: "Maldives Honeymoon",
        duration: "5N / 6D",
        price: "₹1,39,999",
        originalPrice: "₹1,75,000",
        inclusions: ["Return Flights", "Private Villa", "All Meals", "Couples Spa", "Private Beach Dinner", "Dolphin Cruise"],
        badge: "Romantic",
      },
    ],
    highlights: [
      { icon: "🏖️", title: "Overwater Bungalows", description: "Private villas on stilts over crystal lagoons" },
      { icon: "🤿", title: "Snorkeling & Diving", description: "World-class coral reefs, manta rays & whale sharks" },
      { icon: "🌅", title: "Sunset Cruises", description: "Dolphin watching & private catamaran sunset cruises" },
      { icon: "🍽️", title: "Underwater Dining", description: "Dine inside a submerged restaurant surrounded by fish" },
      { icon: "🛥️", title: "Island Hopping", description: "Local island visits & sandbank picnics" },
      { icon: "💆", title: "Luxury Spa", description: "Overwater spa pavilions and holistic wellness treatments" },
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival & Speedboat Transfer",
        description: "Arrive at Velana International Airport and take a scenic speedboat to your island resort.",
        activities: ["Airport arrival", "Speedboat transfer to resort", "Check-in at overwater villa", "Welcome cocktails & beach dinner"],
      },
      {
        day: 2,
        title: "Snorkeling & Marine Life",
        description: "Explore the vibrant coral reefs teeming with tropical marine life.",
        activities: ["House reef snorkeling session", "Guided coral reef tour", "Manta ray encounter (seasonal)", "Sunset cruise"],
      },
      {
        day: 3,
        title: "Island Adventures",
        description: "Discover local culture and pristine sandbanks.",
        activities: ["Local island village tour", "Sandbank picnic", "Water sports: kayaking, windsurfing", "Couples spa treatment"],
      },
      {
        day: 4,
        title: "Diving & Underwater World",
        description: "Dive into the deep blue and witness the extraordinary underwater world.",
        activities: ["Beginners scuba diving lesson", "Underwater restaurant lunch", "Dolphin watching cruise", "Stargazing on the beach"],
      },
      {
        day: 5,
        title: "Departure",
        description: "A final morning in paradise before returning home.",
        activities: ["Morning swim from villa deck", "Resort breakfast", "Speedboat transfer to airport", "Departure"],
      },
    ],
    inclusions: [
      "Return economy flights from India",
      "Overwater villa / Water bungalow accommodation",
      "Breakfast and dinner daily",
      "Speedboat transfers (airport ↔ resort)",
      "House reef snorkeling equipment",
      "Sunset dolphin cruise",
      "Guided island tour",
      "24/7 Flywings travel support",
    ],
    exclusions: [
      "Travel insurance",
      "Scuba diving lessons (extra charge)",
      "Personal expenses",
      "Lunches",
      "Tips and gratuities",
      "Premium spa treatments",
    ],
    faqs: [
      {
        question: "Is Maldives worth visiting from India?",
        answer: "Absolutely! The Maldives is just 1.5–2 hours by flight from South Indian cities like Chennai, Kochi, and Bangalore, making it one of the easiest luxury international getaways for Indians.",
      },
      {
        question: "What is the best time to visit Maldives?",
        answer: "November to April is the peak season with dry weather, calm seas, and excellent visibility for snorkeling and diving. May to October is the wet season but offers lower prices and fewer crowds.",
      },
      {
        question: "How much does a Maldives trip cost from India?",
        answer: "Maldives packages from India start at ₹89,999 per person for 4N/5D including flights, overwater villa, and meals. Luxury all-inclusive packages range from ₹1.2–1.8 lakhs per person.",
      },
      {
        question: "Can non-swimmers enjoy Maldives?",
        answer: "Yes! Non-swimmers can enjoy glass-bottom boat tours, underwater restaurants, spa treatments, beautiful sunsets, sandbank visits, and lounging on stunning private beaches.",
      },
    ],
    relatedSlugs: ["dubai", "bali", "thailand"],
  },
  {
    slug: "singapore",
    name: "Singapore",
    country: "Singapore",
    tagline: "The Lion City — where futuristic design meets cultural diversity",
    heroImage: destSingapore,
    startingPrice: "₹42,999",
    bestTime: "February to April",
    tripDuration: "4–5 Days",
    currency: "SGD (Singapore Dollar)",
    visaInfo: "Visa required for Indian passport holders — Flywings arranges it",
    weather: "Tropical; warm year-round (26–32°C) with frequent short rain showers.",
    about:
      "Singapore is the ultimate modern city-state: a 719 km² island that punches far above its weight with world-class attractions, remarkable cleanliness, extraordinary food diversity, and seamless infrastructure. From the futuristic Gardens by the Bay to the thrilling Universal Studios, the cultural tapestry of Little India and Chinatown, and the rooftop infinity pool of Marina Bay Sands, Singapore offers something extraordinary at every turn. It's one of Asia's most family-friendly destinations and a favorite among Indian travelers.",
    metaTitle: "Singapore Tour Package from India | Flywings Tour & Packages Pvt Ltd",
    metaDescription:
      "Book Singapore tour packages from India starting ₹42,999. Universal Studios, Gardens by the Bay, cable car, and more. Flights included. Get free quote.",
    packages: [
      {
        id: "singapore-explorer",
        title: "Singapore Explorer",
        duration: "4N / 5D",
        price: "₹42,999",
        originalPrice: "₹57,000",
        inclusions: ["Return Flights", "4★ Hotel", "City Tour", "Gardens by the Bay", "Cable Car", "Breakfast"],
        badge: "Best Value",
      },
      {
        id: "singapore-complete",
        title: "Singapore Complete",
        duration: "5N / 6D",
        price: "₹62,999",
        originalPrice: "₹80,000",
        inclusions: ["Return Flights", "4★ Hotel", "Universal Studios", "Sentosa", "Night Safari", "All Tours", "Transfers"],
        badge: "Best Seller",
      },
      {
        id: "singapore-family",
        title: "Singapore Family Fun",
        duration: "5N / 6D",
        price: "₹69,999",
        originalPrice: "₹89,000",
        inclusions: ["Return Flights", "Family Suite", "Universal Studios", "SEA Aquarium", "Zoo", "All Meals", "Transfers"],
        badge: "Family Pack",
      },
    ],
    highlights: [
      { icon: "🌿", title: "Gardens by the Bay", description: "Supertree Grove, Cloud Forest & Flower Dome" },
      { icon: "🎢", title: "Universal Studios", description: "Hollywood-grade theme park on Sentosa Island" },
      { icon: "🌉", title: "Marina Bay Sands", description: "Iconic skyline, infinity pool & Art Science Museum" },
      { icon: "🦁", title: "Singapore Zoo & Night Safari", description: "World-renowned open-zoo concept & nocturnal animals" },
      { icon: "🍜", title: "Hawker Culture", description: "UNESCO-listed hawker centers & diverse world cuisine" },
      { icon: "🛍️", title: "Orchard Road Shopping", description: "Luxury malls, duty-free shops & boutique stores" },
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Singapore",
        description: "Arrive at Changi Airport — consistently voted the world's best airport.",
        activities: ["Changi Airport Jewel fountain", "Hotel check-in", "Orchard Road walk", "Clarke Quay night dining"],
      },
      {
        day: 2,
        title: "Marina Bay & City Icons",
        description: "Explore the world-famous Marina Bay district and Singapore's landmark attractions.",
        activities: ["Marina Bay Sands SkyPark", "Gardens by the Bay (Supertree Grove & domes)", "Merlion Park & Esplanade", "Marina Bay light show"],
      },
      {
        day: 3,
        title: "Sentosa Island",
        description: "Singapore's entertainment island — theme parks, beaches, and adventure.",
        activities: ["Universal Studios Singapore", "Sentosa beaches", "Cable car ride", "Madame Tussauds (optional)"],
      },
      {
        day: 4,
        title: "Culture, Zoo & Night Safari",
        description: "Explore Singapore's cultural quarters and its world-famous wildlife experiences.",
        activities: ["Little India & Chinatown heritage walk", "Singapore Zoo", "Night Safari (world's first nocturnal zoo)", "Hawker Center dinner"],
      },
      {
        day: 5,
        title: "Departure",
        description: "Final shopping and farewell to the Lion City.",
        activities: ["Orchard Road shopping", "Singapore souvenirs", "Airport transfer & departure"],
      },
    ],
    inclusions: [
      "Return economy flights from India",
      "4★ hotel accommodation with breakfast",
      "Singapore visa fee (tourist e-visa)",
      "All airport and hotel transfers",
      "Gardens by the Bay (Cloud Forest & Flower Dome)",
      "Universal Studios Singapore tickets",
      "Singapore cable car ride",
      "City tour with licensed guide",
      "24/7 Flywings travel assistance",
    ],
    exclusions: [
      "Travel insurance",
      "Personal expenses & shopping",
      "Night Safari tickets (can be added)",
      "Lunches & dinners unless specified",
      "Tips and gratuities",
    ],
    faqs: [
      {
        question: "Do Indians need a visa for Singapore?",
        answer: "Yes, Indian passport holders require a Singapore Tourist Visa. Flywings handles the complete e-visa application process as part of your package. Approval typically takes 1–3 business days.",
      },
      {
        question: "How much does a Singapore trip cost from India?",
        answer: "Singapore packages from India start at ₹42,999 per person for 4N/5D including flights, hotel, and key attractions. Family packages with Universal Studios start around ₹69,999.",
      },
      {
        question: "Is Singapore good for families with kids?",
        answer: "Singapore is one of the best family destinations in Asia. Universal Studios, the Night Safari, SEA Aquarium, Adventure Cove Waterpark, and Sentosa Island provide world-class entertainment for all ages.",
      },
      {
        question: "What is the best time to visit Singapore?",
        answer: "February to April is relatively drier and ideal. Singapore is a year-round destination with consistent warm weather, so any time is fine. December brings festive Christmas lights along Orchard Road.",
      },
    ],
    relatedSlugs: ["dubai", "thailand", "malaysia"],
  },
  {
    slug: "malaysia",
    name: "Malaysia",
    country: "Malaysia",
    tagline: "Petronas skyline by day, Genting Highlands by cable car",
    heroImage: destMalaysia,
    startingPrice: "₹25,000",
    bestTime: "December to February",
    tripDuration: "3–4 Days",
    currency: "MYR (Malaysian Ringgit)",
    visaInfo: "Visa-free entry for Indian passport holders (short tourist stays)",
    weather: "Tropical; warm and humid year-round (25–33°C), afternoon showers common",
    about:
      "Malaysia packs a remarkable range into a short flight from India — the futuristic Kuala Lumpur skyline anchored by the Petronas Twin Towers, the limestone temple caves at Batu Caves, and the cool hill-station air of Genting Highlands reached by Southeast Asia's longest cable car system. Kuala Lumpur's Bukit Bintang district blends shopping, street food, and nightlife, making it an easy, affordable international escape for first-time travelers, families, and quick weekend getaways.",
    metaTitle: "Malaysia Tour Package from India | Flywings Tour & Packages Pvt Ltd",
    metaDescription:
      "Book Malaysia tour packages from India starting ₹25,000. Kuala Lumpur city tour, Genting Highlands, Batu Caves & 4★ hotel. TCS extra. Get a free quote today.",
    packages: [
      {
        id: "malaysia-kl",
        title: "Malaysia (Kuala Lumpur)",
        duration: "3N / 4D",
        price: "₹25,000",
        originalPrice: "",
        inclusions: ["Private Transfers", "4★ Hotel", "KL City Tour", "Genting Highlands", "Batu Caves", "Breakfast"],
        badge: "Quick Getaway",
      },
    ],
    highlights: [
      { icon: "🏙️", title: "Petronas Twin Towers", description: "The iconic KL skyline and KLCC Park" },
      { icon: "🗼", title: "KL Tower", description: "Observation deck views over the capital" },
      { icon: "🚡", title: "Genting Skyway", description: "Two-way cable car to the hill-station resort" },
      { icon: "🛕", title: "Batu Caves", description: "Limestone temple caves with the giant Lord Murugan statue" },
      { icon: "🎢", title: "Genting Theme Park", description: "Indoor theme park admission included" },
      { icon: "🛍️", title: "Bukit Bintang", description: "Shopping, street food & nightlife district" },
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Kuala Lumpur",
        description: "Land in KL and settle into Bukit Bintang, the city's shopping and entertainment district.",
        activities: ["Private airport transfer", "Check-in at Furama Hotel Kuala Lumpur", "Evening at Bukit Bintang"],
      },
      {
        day: 2,
        title: "KL City Tour & KL Tower",
        description: "Half-day city tour followed by panoramic views from KL Tower.",
        activities: ["Petronas Twin Towers photo stop", "Merdeka Square", "KL Tower Observation Deck"],
      },
      {
        day: 3,
        title: "Genting Highlands & Batu Caves",
        description: "A full day trip into the hills, via Southeast Asia's longest cable car system.",
        activities: ["Batu Caves en-route", "Two-way Genting Skyway cable car", "Indoor theme park"],
      },
      {
        day: 4,
        title: "Departure",
        description: "Final breakfast and private transfer to the airport.",
        activities: ["Breakfast at hotel", "Hotel checkout", "Private airport transfer"],
      },
    ],
    inclusions: [
      "3 nights accommodation at a 4★ hotel in Bukit Bintang",
      "Daily breakfast",
      "Private airport transfers",
      "Half-day KL city tour & KL Tower",
      "Full-day Genting Highlands tour with Batu Caves",
      "Two-way Genting Skyway cable car & theme park admission",
    ],
    exclusions: [
      "International airfare",
      "Travel insurance",
      "Lunch & dinner",
      "Personal expenses",
      "Malaysia Tourism Tax (payable at hotel)",
      "TCS extra as per Government of India regulations",
    ],
    faqs: [
      {
        question: "Do Indians need a visa for Malaysia?",
        answer:
          "Indian passport holders currently enjoy visa-free entry to Malaysia for short tourist stays. Our team confirms the latest entry requirements at the time of booking.",
      },
      {
        question: "How much does a Malaysia tour package cost from India?",
        answer:
          "Malaysia packages from India start at ₹25,000 per person for 3N/4D covering Kuala Lumpur and Genting Highlands, with airfare quoted separately as a land package. TCS applies extra as per Government of India regulations.",
      },
      {
        question: "Is Genting Highlands included in the base package?",
        answer:
          "Yes — the full-day Genting Highlands tour with the two-way Skyway cable car, Batu Caves en-route, and indoor theme park admission is included in every Malaysia package.",
      },
    ],
    relatedSlugs: ["singapore", "thailand", "bali"],
  },
  {
    slug: "almaty",
    name: "Almaty",
    country: "Kazakhstan",
    tagline: "Central Asia's rising star — Tien Shan peaks meet Silk Road history",
    heroImage: destAlmaty,
    startingPrice: "₹81,900",
    bestTime: "April to October (sightseeing) / December to March (skiing)",
    tripDuration: "4–5 Days",
    currency: "KZT (Kazakhstani Tenge)",
    visaInfo: "Visa-free for Indian passport holders — up to 14 days per visit (max 42 days per rolling 180-day period); e-Visa available for longer stays",
    weather: "Continental climate; warm summers (20–30°C), cold snowy winters (−10 to 0°C)",
    about:
      "Almaty is emerging as one of the most exciting new destinations for Indian travelers — a green, mountain-ringed city at the foot of the Tien Shan range, with Soviet-era architecture, leafy boulevards, and easy access to some of Central Asia's most dramatic landscapes. From the Kok-Tobe hilltop viewpoint to the high-altitude Medeu ice rink and the Shymbulak ski resort, Almaty offers a refreshingly offbeat alternative to the usual international circuit, reachable on a direct Air Astana flight from Delhi.",
    metaTitle: "Almaty Kazakhstan Tour Package from India | Flywings Tour & Packages Pvt Ltd",
    metaDescription:
      "Book Almaty (Kazakhstan) tour packages from India starting ₹81,900. Return Air Astana flights ex-Delhi, hotel, sightseeing & transfers included. GST & TCS extra.",
    packages: [
      {
        id: "almaty-kazakhstan",
        title: "Almaty (Kazakhstan)",
        duration: "4N / 5D",
        price: "₹81,900",
        originalPrice: "",
        inclusions: ["Return Air Astana Flights", "Hotel", "Breakfast", "Sightseeing", "Transfers", "Tour Guide"],
        badge: "Trending",
      },
    ],
    highlights: [
      { icon: "🚡", title: "Kok-Tobe Hill", description: "Cable car ride & panoramic city viewpoint" },
      { icon: "⛸️", title: "Medeu", description: "The world's highest-altitude Olympic ice rink" },
      { icon: "🏔️", title: "Shymbulak", description: "Cable car ride into the Tien Shan mountains" },
      { icon: "🛕", title: "Zenkov Cathedral", description: "One of the world's tallest wooden buildings" },
      { icon: "🏛️", title: "Panfilov Park", description: "War memorial and leafy city-centre park" },
      { icon: "🏞️", title: "Charyn Canyon", description: "The 'Grand Canyon of Kazakhstan', a full-day excursion" },
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Almaty",
        description: "Land in Almaty and transfer to your hotel to rest before sightseeing begins.",
        activities: ["Airport transfer & hotel check-in", "Evening walk at Arbat Street & Panfilov Park"],
      },
      {
        day: 2,
        title: "Almaty City Tour",
        description: "Explore the city's landmarks, old and new.",
        activities: ["Kok-Tobe Hill cable car", "Central State Museum", "Green Bazaar"],
      },
      {
        day: 3,
        title: "Medeu & Shymbulak",
        description: "A day in the mountains at the region's most famous ice rink and ski resort.",
        activities: ["Medeu ice rink", "Shymbulak cable car ride"],
      },
      {
        day: 4,
        title: "Full-Day Excursion",
        description: "A full day to Charyn Canyon or Big Almaty Lake, subject to season.",
        activities: ["Charyn Canyon or Big Almaty Lake excursion", "Professional tour guide"],
      },
      {
        day: 5,
        title: "Departure",
        description: "Early transfer to the airport for your return flight to Delhi.",
        activities: ["Hotel checkout", "Airport transfer & departure"],
      },
    ],
    inclusions: [
      "Return Air Astana flights ex-Delhi",
      "4 nights hotel accommodation",
      "Daily breakfast",
      "All major sightseeing with professional guide",
      "Airport transfers",
    ],
    exclusions: [
      "GST & TCS (extra, as applicable)",
      "Lunch & dinner",
      "Travel insurance",
      "Kazakhstan e-visa fee (assistance provided)",
      "Personal expenses",
    ],
    faqs: [
      {
        question: "Do Indians need a visa for Kazakhstan?",
        answer:
          "Indian nationals typically require a Kazakhstan e-visa, applied for online in advance. Our team assists with the application and confirms current processing times and fees at booking.",
      },
      {
        question: "How much does an Almaty tour package cost from India?",
        answer:
          "Almaty packages from India start at ₹81,900 per person for 4N/5D, including return Air Astana flights ex-Delhi, hotel, breakfast, and sightseeing. GST and TCS apply extra as per Government of India regulations.",
      },
      {
        question: "What is the best time to visit Almaty?",
        answer:
          "April to October is ideal for sightseeing and mountain excursions, while December to March draws visitors for skiing at Shymbulak.",
      },
    ],
    relatedSlugs: ["kashmir", "dubai", "thailand"],
  },

  /* ─────────────────────────────────────────────────────────────
   * Domestic destinations reachable by road from Chandigarh.
   *
   * Added Sep 2026 after keyword research found the largest
   * winnable demand sitting here with no page to catch it:
   * 45 distinct "manali ... from chandigarh" queries, 23 for
   * Shimla, 14 for Goa. The international pages target "from
   * India" because the departure city stops mattering once you
   * fly; for these it is the whole trip, so the departure city
   * leads the title.
   *
   * Prices are "On request" deliberately. `parsePrice` returns
   * undefined for a non-numeric string and the Offer schema is
   * conditional on it, so nothing breaks, and no rate is invented
   * that the sales team has not agreed to honour.
   * ───────────────────────────────────────────────────────────── */

  {
    slug: "manali",
    name: "Manali",
    country: "India",
    tagline: "Eight hours from Chandigarh, and a different world",
    heroImage: destManali,
    startingPrice: "On request",
    bestTime: "March to June, and December to February for snow",
    tripDuration: "4–6 Days",
    currency: "INR (Indian Rupee)",
    visaInfo: "No visa or permit required for Indian citizens",
    weather: "Pleasant summers (10–25°C), cold snowy winters (−2 to 10°C), heavy monsoon July–August",
    about:
      "Manali sits at roughly 2,050 metres in the Beas valley, about 310 kilometres and eight to nine hours by road from Chandigarh, which makes it the most-booked hill holiday in the Tricity. The town splits neatly in two: Old Manali with its cafés, orchards and slow mornings, and the newer town around Mall Road that handles the crowds. Beyond it lie Solang Valley for paragliding and winter snow, the Atal Tunnel that now opens Lahaul as a comfortable day trip, and the Hadimba Devi temple standing in deodar forest since 1553. Most Chandigarh travellers go by overnight Volvo or private cab, arrive at breakfast and lose nothing to travel days, which is exactly why the trip works over a long weekend.",
    metaTitle: "Manali Tour Package from Chandigarh | 4N/5D Volvo & Cab | Flywings",
    metaDescription:
      "Manali tour packages from Chandigarh with Volvo or private cab, hotel, Solang Valley and Atal Tunnel sightseeing. Departures all year. Free quote in 24 hours.",
    packages: [
      {
        id: "manali-weekend",
        title: "Manali Long Weekend",
        duration: "2N / 3D",
        price: "On request",
        originalPrice: "",
        inclusions: ["Volvo from Chandigarh", "Hotel + Breakfast", "Solang Valley", "Hadimba Temple", "Local sightseeing"],
        badge: "Quick Escape",
      },
      {
        id: "manali-classic",
        title: "Manali Classic",
        duration: "4N / 5D",
        price: "On request",
        originalPrice: "",
        inclusions: ["Private cab ex-Chandigarh", "Hotel + Breakfast", "Solang Valley", "Atal Tunnel & Sissu", "Kullu & Naggar", "All transfers"],
        badge: "Best Seller",
      },
      {
        id: "manali-snow",
        title: "Manali Snow Special",
        duration: "3N / 4D",
        price: "On request",
        originalPrice: "",
        inclusions: ["Volvo or cab ex-Chandigarh", "Hotel + Breakfast", "Solang snow point", "Atal Tunnel", "Snow activities"],
        badge: "Dec–Feb",
      },
    ],
    highlights: [
      { icon: "🪂", title: "Solang Valley", description: "Paragliding, zorbing and winter snow, 13 km from town" },
      { icon: "🚇", title: "Atal Tunnel", description: "9 km tunnel to Lahaul, making Sissu a day trip" },
      { icon: "🛕", title: "Hadimba Temple", description: "Cedar-wood shrine standing in the forest since 1553" },
      { icon: "🏘️", title: "Old Manali", description: "Cafés, orchards and the slower half of the town" },
      { icon: "🚣", title: "Kullu Rafting", description: "White water on the Beas, graded for beginners" },
      { icon: "🏰", title: "Naggar Castle", description: "500-year-old castle and the Roerich gallery" },
    ],
    itinerary: [
      {
        day: 1,
        title: "Chandigarh to Manali",
        description: "Overnight Volvo or a daytime private cab up the Beas valley. Both arrive in time to settle in.",
        activities: ["Departure from Chandigarh (310 km)", "Breakfast stop en route", "Hotel check-in", "Evening at Mall Road"],
      },
      {
        day: 2,
        title: "Solang Valley and Atal Tunnel",
        description: "The day most people come for: snow or adventure sports, then through the tunnel into Lahaul.",
        activities: ["Solang Valley (13 km)", "Paragliding or snow activities by season", "Atal Tunnel to Sissu", "Return by evening"],
      },
      {
        day: 3,
        title: "Manali Local and Old Manali",
        description: "Temples, hot springs and the older side of town on foot.",
        activities: ["Hadimba Devi Temple", "Manu Temple", "Vashisht hot springs", "Old Manali cafés and market"],
      },
      {
        day: 4,
        title: "Kullu, Naggar and the valley",
        description: "Down-valley day covering rafting, a hilltop castle and the Roerich estate.",
        activities: ["Beas river rafting at Kullu", "Naggar Castle", "Roerich Art Gallery", "Shawl and handicraft workshops"],
      },
      {
        day: 5,
        title: "Return to Chandigarh",
        description: "Morning departure, back in the Tricity by evening.",
        activities: ["Hotel check-out", "Shopping stop at Mall Road", "Drive to Chandigarh", "Drop at your preferred point"],
      },
    ],
    inclusions: [
      "Volvo seats or private cab from Chandigarh, Mohali or Panchkula",
      "Hotel stay on twin sharing",
      "Daily breakfast",
      "Solang Valley and Atal Tunnel sightseeing",
      "All road transfers and toll",
      "Driver allowance and parking",
      "24/7 Flywings travel support",
    ],
    exclusions: [
      "Lunch and dinner unless specified",
      "Paragliding, skiing and adventure activity charges",
      "Rohtang Pass permit and separate vehicle",
      "Personal expenses and tips",
      "Travel insurance",
      "Anything not listed under inclusions",
    ],
    faqs: [
      {
        question: "How far is Manali from Chandigarh and how long does it take?",
        answer:
          "About 310 kilometres, and eight to nine hours by road depending on traffic at Mandi and Kullu. Overnight Volvo buses leave Chandigarh in the evening and reach Manali around breakfast, which is why a two-night trip still gives you two full days.",
      },
      {
        question: "Do I need a permit for Rohtang Pass?",
        answer:
          "Yes. Rohtang requires a permit and the number of vehicles allowed each day is capped, so it has to be arranged in advance and is not guaranteed. Since the Atal Tunnel opened, most itineraries use the tunnel to reach Lahaul instead, which needs no permit and stays open far longer in the year.",
      },
      {
        question: "When can I see snow in Manali?",
        answer:
          "Solang Valley usually holds snow from late December through February, and the higher points past the Atal Tunnel keep it longer. If snow is the reason for the trip, plan for January or February. In March and April you can still find it at altitude but not reliably in the town.",
      },
      {
        question: "Is July or August a good time to visit Manali?",
        answer:
          "It is the one window we advise against. The monsoon brings landslides on the Mandi–Kullu stretch and roads close at short notice. If those are your only dates, we plan a route with buffer days and flexible hotels rather than a fixed itinerary.",
      },
      {
        question: "Volvo or private cab from Chandigarh?",
        answer:
          "Volvo is cheaper and comfortable if you are two adults travelling light. A private cab makes more sense for families, anyone with elderly parents or small children, and for trips that include Naggar and Kullu, because you keep the vehicle for sightseeing instead of hiring locally each day.",
      },
    ],
    relatedSlugs: ["shimla-manali", "spiti-valley", "kashmir"],
  },

  {
    slug: "shimla-manali",
    name: "Shimla & Manali",
    country: "India",
    tagline: "The Himachal circuit the Tricity has been doing for fifty years",
    heroImage: destShimlaManali,
    startingPrice: "On request",
    bestTime: "March to June, and December to February for snow",
    tripDuration: "5–7 Days",
    currency: "INR (Indian Rupee)",
    visaInfo: "No visa or permit required for Indian citizens",
    weather: "Shimla 5–22°C, Manali −2 to 25°C by season. Both cold and snowy December to February",
    about:
      "This is the classic Himachal loop and it belongs to Chandigarh more than to anywhere else, because the drive starts here. Shimla is only 115 kilometres away, close enough to reach by lunch, and the Kalka–Shimla toy train that UNESCO lists as World Heritage boards a half hour from the city. From Shimla the road runs on to Manali, roughly 250 kilometres through the Sutlej and Beas valleys. Doing both in one trip gives you two very different hill stations: Shimla with its colonial ridge, Christ Church and Mall Road promenade, and Manali with snow, adventure sport and the Atal Tunnel. Five to seven nights covers the circuit without spending the whole holiday in the car.",
    metaTitle: "Shimla Manali Tour Package from Chandigarh by Car | 5N/6D | Flywings",
    metaDescription:
      "Shimla Manali tour packages from Chandigarh by car or Volvo. Kufri, Mall Road, Solang Valley, Atal Tunnel and the Kalka toy train. Free quote in 24 hours.",
    packages: [
      {
        id: "shimla-manali-classic",
        title: "Shimla Manali Classic",
        duration: "5N / 6D",
        price: "On request",
        originalPrice: "",
        inclusions: ["Private cab ex-Chandigarh", "Hotels + Breakfast", "Kufri", "Solang Valley", "Atal Tunnel", "All transfers"],
        badge: "Best Seller",
      },
      {
        id: "shimla-manali-complete",
        title: "Shimla Manali Complete",
        duration: "6N / 7D",
        price: "On request",
        originalPrice: "",
        inclusions: ["Private cab ex-Chandigarh", "Hotels + Breakfast & Dinner", "Kufri", "Chail", "Solang", "Atal Tunnel", "Naggar", "Kullu rafting"],
        badge: "Most Complete",
      },
      {
        id: "shimla-manali-honeymoon",
        title: "Shimla Manali Honeymoon",
        duration: "5N / 6D",
        price: "On request",
        originalPrice: "",
        inclusions: ["Private cab ex-Chandigarh", "Couple rooms", "Candlelight dinner", "Kufri", "Solang", "Atal Tunnel", "Flower decor"],
        badge: "Couples",
      },
    ],
    highlights: [
      { icon: "🚂", title: "Kalka Toy Train", description: "UNESCO World Heritage line, boards near Chandigarh" },
      { icon: "⛪", title: "Shimla Ridge", description: "Christ Church, Mall Road and the Scandal Point promenade" },
      { icon: "🐎", title: "Kufri", description: "Himalayan Nature Park and the ride up to Mahasu Peak" },
      { icon: "🪂", title: "Solang Valley", description: "Paragliding in summer, snow through winter" },
      { icon: "🚇", title: "Atal Tunnel", description: "Straight through to Lahaul without the Rohtang permit" },
      { icon: "🛕", title: "Jakhoo Temple", description: "108-foot Hanuman statue on Shimla's highest point" },
    ],
    itinerary: [
      {
        day: 1,
        title: "Chandigarh to Shimla",
        description: "A short 115 km climb, so the first day still gives you an afternoon on the Ridge.",
        activities: ["Depart Chandigarh after breakfast", "Optional Kalka–Shimla toy train leg", "Hotel check-in", "Evening on Mall Road and the Ridge"],
      },
      {
        day: 2,
        title: "Shimla and Kufri",
        description: "The full Shimla day: colonial centre in the morning, Kufri after lunch.",
        activities: ["Christ Church and Scandal Point", "Jakhoo Temple", "Kufri and Himalayan Nature Park", "Green Valley viewpoint"],
      },
      {
        day: 3,
        title: "Shimla to Manali",
        description: "The long leg of the trip, roughly 250 km through the Sutlej and Beas valleys.",
        activities: ["Depart after breakfast", "Sundernagar Lake stop", "Pandoh Dam viewpoint", "Manali check-in by evening"],
      },
      {
        day: 4,
        title: "Solang Valley and Atal Tunnel",
        description: "Snow or adventure sport, then through the tunnel into Lahaul.",
        activities: ["Solang Valley", "Paragliding or snow activities by season", "Atal Tunnel to Sissu", "Return by evening"],
      },
      {
        day: 5,
        title: "Manali local and Naggar",
        description: "Temples and old town in the morning, the valley in the afternoon.",
        activities: ["Hadimba Devi Temple", "Vashisht hot springs", "Old Manali", "Naggar Castle and Roerich gallery"],
      },
      {
        day: 6,
        title: "Return to Chandigarh",
        description: "Early start for the drive back down the valley.",
        activities: ["Hotel check-out", "Kullu shawl workshop stop", "Drive to Chandigarh", "Drop at your preferred point"],
      },
    ],
    inclusions: [
      "Private cab or Volvo from Chandigarh, Mohali or Panchkula",
      "Hotels in both Shimla and Manali on twin sharing",
      "Daily breakfast",
      "Kufri, Solang Valley and Atal Tunnel sightseeing",
      "All inter-city transfers, toll and parking",
      "Driver allowance",
      "24/7 Flywings travel support",
    ],
    exclusions: [
      "Kalka–Shimla toy train tickets (booked separately on request)",
      "Lunch and dinner unless specified",
      "Kufri horse rides and adventure activity charges",
      "Rohtang Pass permit and separate vehicle",
      "Personal expenses, tips and travel insurance",
    ],
    faqs: [
      {
        question: "How many days do I need for Shimla and Manali from Chandigarh?",
        answer:
          "Five nights is the honest minimum. Shimla is 115 km from Chandigarh and Manali another 250 km from Shimla, so two of your days are travel days. Anything shorter than five nights turns the holiday into driving with brief stops.",
      },
      {
        question: "Can we take the Kalka–Shimla toy train?",
        answer:
          "Yes, and it is worth it. The line is a UNESCO World Heritage site and Kalka is only about 30 minutes from Chandigarh. The usual arrangement is the train up to Shimla while your cab meets you there, then the road for the rest of the trip. Seats sell out in peak season so it needs booking well ahead.",
      },
      {
        question: "Is the Shimla Manali trip suitable for elderly parents?",
        answer:
          "Yes, with a private cab rather than Volvo, and with the itinerary spread over six nights instead of five. The roads are paved throughout and neither town is at extreme altitude. Kufri involves either a horse ride or a walk on a steep path, so that section is optional.",
      },
      {
        question: "What is the difference between doing this by car and by Volvo?",
        answer:
          "Volvo covers Chandigarh to Shimla and Shimla to Manali, but you then hire local vehicles at each stop for sightseeing. A private cab stays with you for the whole trip, which works out simpler for families and usually costs less once local hire is counted in.",
      },
    ],
    relatedSlugs: ["manali", "spiti-valley", "kashmir"],
  },

  {
    slug: "goa",
    name: "Goa",
    country: "India",
    tagline: "The one domestic beach holiday worth the flight",
    heroImage: destGoa,
    startingPrice: "On request",
    bestTime: "November to February",
    tripDuration: "4–6 Days",
    currency: "INR (Indian Rupee)",
    visaInfo: "No visa required for Indian citizens",
    weather: "Warm through the year (22–33°C). Heavy monsoon June to September",
    about:
      "Goa is the one beach holiday most Chandigarh families take by air rather than road, and the choice that actually decides the trip is north or south. North Goa, around Baga, Calangute, Anjuna and Vagator, is the busy half: markets, shacks, nightlife and water sports. South Goa, around Palolem, Agonda, Colva and Benaulim, is quieter, greener and built around resorts rather than streets. Old Goa sits between them with the Basilica of Bom Jesus and Se Cathedral, both UNESCO listed. From Chandigarh most itineraries connect through Delhi or Mumbai, with seasonal direct options, and both Goan airports, Dabolim and the newer Manohar International at Mopa, are used depending on fares.",
    metaTitle: "Goa Tour Package from Chandigarh with Flight | North & South Goa | Flywings",
    metaDescription:
      "Goa tour packages from Chandigarh with flights, hotel and transfers. North Goa nightlife or South Goa resorts, Dudhsagar Falls and Old Goa churches. Free quote in 24 hours.",
    packages: [
      {
        id: "goa-north",
        title: "North Goa Explorer",
        duration: "3N / 4D",
        price: "On request",
        originalPrice: "",
        inclusions: ["Return flights ex-Chandigarh", "Beachside hotel", "Breakfast", "Airport transfers", "North Goa sightseeing"],
        badge: "Popular",
      },
      {
        id: "goa-south-resort",
        title: "South Goa Resort Stay",
        duration: "4N / 5D",
        price: "On request",
        originalPrice: "",
        inclusions: ["Return flights ex-Chandigarh", "Resort on twin sharing", "Breakfast & dinner", "Transfers", "Old Goa churches"],
        badge: "Couples",
      },
      {
        id: "goa-family",
        title: "Goa Family Complete",
        duration: "5N / 6D",
        price: "On request",
        originalPrice: "",
        inclusions: ["Return flights ex-Chandigarh", "Hotel + Breakfast", "North & South Goa tours", "Dudhsagar Falls", "Boat cruise", "All transfers"],
        badge: "Families",
      },
    ],
    highlights: [
      { icon: "🏖️", title: "North Goa", description: "Baga, Calangute, Anjuna: markets, shacks and nightlife" },
      { icon: "🌴", title: "South Goa", description: "Palolem, Agonda and Colva: quieter sand and resorts" },
      { icon: "⛪", title: "Old Goa", description: "Basilica of Bom Jesus and Se Cathedral, both UNESCO listed" },
      { icon: "💦", title: "Dudhsagar Falls", description: "Four-tier waterfall on the Mandovi, best just after monsoon" },
      { icon: "🏰", title: "Fort Aguada", description: "17th-century Portuguese fort above the Sinquerim headland" },
      { icon: "🚤", title: "Water Sports", description: "Parasailing, jet ski and banana boat off the north beaches" },
    ],
    itinerary: [
      {
        day: 1,
        title: "Chandigarh to Goa",
        description: "Fly down, usually connecting through Delhi or Mumbai, and reach the coast by afternoon.",
        activities: ["Flight from Chandigarh", "Airport transfer to hotel", "Beach evening", "Dinner at a beach shack"],
      },
      {
        day: 2,
        title: "North Goa",
        description: "The busy half: forts in the morning, beaches and markets after.",
        activities: ["Fort Aguada", "Calangute and Baga beaches", "Water sports", "Anjuna flea market (Wednesdays)"],
      },
      {
        day: 3,
        title: "Old Goa and South Goa",
        description: "Churches in the morning, then across to the quieter southern beaches.",
        activities: ["Basilica of Bom Jesus", "Se Cathedral", "Miramar and Dona Paula", "Colva or Palolem beach"],
      },
      {
        day: 4,
        title: "Dudhsagar and Spice Plantation",
        description: "Inland day trip to the falls and a working spice farm.",
        activities: ["Jeep safari to Dudhsagar Falls", "Spice plantation tour with lunch", "Mandovi river sunset cruise"],
      },
      {
        day: 5,
        title: "Return to Chandigarh",
        description: "A free morning before the flight back.",
        activities: ["Free morning at the beach", "Souvenir shopping", "Airport transfer", "Flight to Chandigarh"],
      },
    ],
    inclusions: [
      "Return flights from Chandigarh (connecting or direct as available)",
      "Hotel or resort on twin sharing",
      "Daily breakfast",
      "Airport transfers both ways",
      "North Goa and Old Goa sightseeing by private cab",
      "24/7 Flywings travel support",
    ],
    exclusions: [
      "Lunch and dinner unless specified",
      "Water sports and Dudhsagar jeep safari charges",
      "Casino entry and nightlife",
      "Personal expenses, tips and travel insurance",
      "Anything not listed under inclusions",
    ],
    faqs: [
      {
        question: "Are there direct flights from Chandigarh to Goa?",
        answer:
          "Direct services run seasonally and are not available all year. Most departures connect through Delhi or Mumbai, which adds two to three hours. We check both Goan airports, Dabolim and Manohar International at Mopa, because fares and timings often differ significantly between them.",
      },
      {
        question: "Should we stay in North Goa or South Goa?",
        answer:
          "North for markets, nightlife, water sports and shorter distances between things. South for quiet beaches, resort stays and space. Couples and families with small children usually prefer South; groups and first-time visitors usually prefer North. If you want both, we split the stay rather than commuting daily, because the drive between them is over an hour.",
      },
      {
        question: "When is the best time to visit Goa?",
        answer:
          "November to February has the best weather and the fullest calendar, and it is also the most expensive. March to May is hot but noticeably cheaper. June to September is monsoon: beaches are dramatic, many shacks close, and water sports stop, but rates fall sharply and Dudhsagar Falls is at its best.",
      },
      {
        question: "Is Goa suitable for a family trip with children?",
        answer:
          "Yes. South Goa resorts and the calmer beaches at Colva, Benaulim and Palolem suit families better than the northern strip. We keep the itinerary to one activity a day and book resorts with pools, since children spend more time there than on sightseeing.",
      },
    ],
    relatedSlugs: ["kashmir", "manali", "thailand"],
  },

  {
    slug: "spiti-valley",
    name: "Spiti Valley",
    country: "India",
    tagline: "A cold desert at 4,000 metres, reached from your own doorstep",
    heroImage: destSpiti,
    startingPrice: "On request",
    bestTime: "Mid-June to early October for the full circuit",
    tripDuration: "7–10 Days",
    currency: "INR (Indian Rupee)",
    visaInfo: "No permit for Indian citizens. Foreign nationals need an Inner Line Permit between Rekong Peo and Kaza",
    weather: "Cold desert. Summer 5–20°C by day, near freezing at night. Winter well below −20°C",
    about:
      "Spiti is the hardest trip on this list and the one people talk about for years afterwards. It is a high cold desert on the Tibetan plateau's edge, with Kaza at about 3,800 metres and passes higher still. Two roads reach it from Chandigarh. The Kinnaur route through Shimla, Sarahan and Nako climbs gradually over several days, which is what lets your body adjust. The Manali route over Kunzum Pass at 4,551 metres is far shorter but only open from roughly June to October, and taken in that direction it gains altitude too fast for comfort. We almost always route in via Shimla and out via Manali, which acclimatises properly and means you never drive the same road twice. Key Monastery, Chandratal, Hikkim's post office at 4,400 metres and the fossil village of Langza are all on that loop.",
    metaTitle: "Spiti Valley Tour Package from Chandigarh | Circuit Route | Flywings",
    metaDescription:
      "Spiti Valley tour packages from Chandigarh on the Shimla-in, Manali-out circuit. Key Monastery, Chandratal, Kaza and Hikkim, with acclimatisation built in.",
    packages: [
      {
        id: "spiti-circuit",
        title: "Spiti Full Circuit",
        duration: "8N / 9D",
        price: "On request",
        originalPrice: "",
        inclusions: ["Tempo Traveller ex-Chandigarh", "Hotels & homestays", "Breakfast & dinner", "Kinnaur route in, Manali out", "Chandratal", "Oxygen support"],
        badge: "Jun–Oct",
      },
      {
        id: "spiti-short",
        title: "Spiti via Shimla",
        duration: "6N / 7D",
        price: "On request",
        originalPrice: "",
        inclusions: ["Private vehicle ex-Chandigarh", "Hotels & homestays", "Breakfast & dinner", "Kalpa, Nako, Tabo, Kaza", "Key Monastery"],
        badge: "Most Days Open",
      },
      {
        id: "spiti-winter",
        title: "Winter Spiti",
        duration: "7N / 8D",
        price: "On request",
        originalPrice: "",
        inclusions: ["4x4 vehicle ex-Chandigarh", "Heated homestays", "All meals", "Kinnaur route only", "Snow leopard territory", "Oxygen support"],
        badge: "Experienced Only",
      },
    ],
    highlights: [
      { icon: "🏔️", title: "Key Monastery", description: "Thousand-year-old gompa stacked above the Spiti river" },
      { icon: "🏞️", title: "Chandratal", description: "Crescent lake at 4,300 m, reachable June to September" },
      { icon: "📮", title: "Hikkim", description: "World's highest post office at 4,400 m, and it still posts" },
      { icon: "🦴", title: "Langza", description: "Fossil village under the Buddha statue, marine fossils in the soil" },
      { icon: "🛕", title: "Tabo Monastery", description: "Founded 996 AD, the oldest continuously working gompa here" },
      { icon: "🌌", title: "Night Skies", description: "No light pollution, no humidity, the clearest stars in India" },
    ],
    itinerary: [
      {
        day: 1,
        title: "Chandigarh to Shimla or Narkanda",
        description: "Gentle first leg. The whole point of this route is gaining height slowly.",
        activities: ["Depart Chandigarh", "Shimla or Narkanda by evening", "Overnight at around 2,700 m"],
      },
      {
        day: 2,
        title: "To Sangla or Chitkul",
        description: "Into Kinnaur along the Sutlej, ending at the last village before the Tibet border.",
        activities: ["Drive through Rampur and Karcham", "Sangla valley", "Chitkul, India's last village on this road", "Overnight in Sangla"],
      },
      {
        day: 3,
        title: "Kalpa",
        description: "Short driving day facing the Kinner Kailash range, deliberately easy for acclimatisation.",
        activities: ["Drive to Kalpa", "Kinner Kailash viewpoint", "Roghi village and Suicide Point", "Overnight at 2,960 m"],
      },
      {
        day: 4,
        title: "Kalpa to Tabo via Nako",
        description: "The landscape turns from green to cold desert over a single day.",
        activities: ["Nako lake and village", "Gue mummy monastery", "Tabo Monastery, founded 996 AD", "Overnight in Tabo"],
      },
      {
        day: 5,
        title: "Tabo to Kaza",
        description: "Cliff monastery at Dhankar, then into Spiti's main town.",
        activities: ["Dhankar Monastery", "Optional Dhankar lake walk", "Pin Valley viewpoint", "Kaza check-in at 3,800 m"],
      },
      {
        day: 6,
        title: "Key, Kibber, Hikkim and Langza",
        description: "The high villages, all above 4,000 metres, done as one loop from Kaza.",
        activities: ["Key Monastery", "Kibber village", "Hikkim post office", "Komic and Langza fossil hunting"],
      },
      {
        day: 7,
        title: "Kaza to Chandratal",
        description: "Over Kunzum Pass to the lake. Camping only, and only in season.",
        activities: ["Kunzum Pass at 4,551 m", "Chandratal lake walk", "Overnight in camps at 4,300 m"],
      },
      {
        day: 8,
        title: "Chandratal to Manali",
        description: "Down through Lahaul and out via the Atal Tunnel.",
        activities: ["Batal and Gramphu", "Atal Tunnel", "Manali by evening"],
      },
      {
        day: 9,
        title: "Manali to Chandigarh",
        description: "The last leg back down the Beas valley.",
        activities: ["Depart Manali after breakfast", "Kullu stop", "Arrive Chandigarh by evening"],
      },
    ],
    inclusions: [
      "Tempo Traveller or SUV from Chandigarh with an experienced mountain driver",
      "Hotels and village homestays on twin sharing",
      "Daily breakfast and dinner",
      "Chandratal camping in season",
      "Oxygen cylinder and basic first aid in the vehicle",
      "All road tolls, permits and parking",
      "24/7 Flywings travel support",
    ],
    exclusions: [
      "Lunches",
      "Inner Line Permit fees for foreign nationals",
      "Personal expenses and tips",
      "Travel insurance, strongly recommended for this route",
      "Any cost from route closure, landslide or weather diversion",
    ],
    faqs: [
      {
        question: "Do I need a permit for Spiti Valley?",
        answer:
          "Indian citizens need no permit for Spiti itself. Foreign nationals need an Inner Line Permit for the stretch between Rekong Peo and Kaza, which we arrange. This is one of the most misreported facts about Spiti online, so it is worth checking against your own nationality rather than a blog.",
      },
      {
        question: "Which route should we take from Chandigarh?",
        answer:
          "In via Shimla and Kinnaur, out via Manali. The Kinnaur road climbs over four days, which gives your body time to adjust. Going the other way puts you at 4,551 metres on Kunzum Pass within about thirty-six hours of leaving Chandigarh, and altitude sickness on that itinerary is common rather than unlucky.",
      },
      {
        question: "When is Spiti open?",
        answer:
          "The full circuit needs mid-June to early October, because Kunzum Pass and the Chandratal road are snowbound outside that window. The Kinnaur route to Kaza stays open for far more of the year, including winter, but winter travel here needs experience, a 4x4 and heated homestays rather than hotels.",
      },
      {
        question: "How serious is altitude sickness in Spiti?",
        answer:
          "Serious enough to plan around. Kaza is at 3,800 metres and the day trips go above 4,400. Our itineraries build in slow gains and an easy day at Kalpa for exactly this reason, and every vehicle carries oxygen. Anyone with a heart or lung condition should clear the trip with a doctor first, and we will say so rather than take the booking.",
      },
      {
        question: "Is Spiti suitable for children or elderly travellers?",
        answer:
          "We do not recommend it for children under about ten, or for elderly travellers without a doctor's clearance. Medical help is hours away from most of the route. Families wanting high mountains with far less risk are usually better served by Manali and Lahaul through the Atal Tunnel.",
      },
    ],
    relatedSlugs: ["manali", "shimla-manali", "kashmir"],
  },
];

export function getDestinationBySlug(slug: string): Destination | undefined {
  return destinations.find((d) => d.slug === slug);
}

export function getRelatedDestinations(slugs: string[]): Destination[] {
  return slugs
    .map((s) => destinations.find((d) => d.slug === s))
    .filter(Boolean) as Destination[];
}

export { destinations };
export default destinations;
