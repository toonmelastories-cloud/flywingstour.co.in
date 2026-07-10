const destDubai = "/assets/dest-dubai.jpg";
const destThailand = "/assets/dest-thailand.jpg";
const destBali = "/assets/dest-bali.jpg";
const destKashmir = "/assets/dest-kashmir.jpg";
const destMaldives = "/assets/dest-maldives.jpg";
const destSingapore = "/assets/dest-singapore.jpg";

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
    metaTitle: "Kashmir Tour Package | Flywings Tour & Packages Pvt Ltd",
    metaDescription:
      "Book Kashmir tour packages starting ₹22,999. Dal Lake houseboats, Gulmarg, Pahalgam, Shikara rides, and more. Best prices guaranteed. Get a free quote.",
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
    relatedSlugs: ["dubai", "thailand", "bali"],
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
