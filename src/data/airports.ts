/**
 * Airport list for the flight fare-request form autocomplete.
 * No API needed — this static list covers every airport the business
 * actually books: all major Indian airports plus the international
 * destinations popular with travellers from North India.
 */

export interface Airport {
  code: string;
  city: string;
  name: string;
  country: string;
}

export const AIRPORTS: Airport[] = [
  // ── India — North ──────────────────────────────────────────────
  { code: "IXC", city: "Chandigarh", name: "Shaheed Bhagat Singh International", country: "India" },
  { code: "ATQ", city: "Amritsar", name: "Sri Guru Ram Dass Jee International", country: "India" },
  { code: "DEL", city: "New Delhi", name: "Indira Gandhi International", country: "India" },
  { code: "LUH", city: "Ludhiana", name: "Halwara International", country: "India" },
  { code: "SXR", city: "Srinagar", name: "Sheikh ul-Alam International", country: "India" },
  { code: "IXJ", city: "Jammu", name: "Jammu Airport", country: "India" },
  { code: "IXL", city: "Leh", name: "Kushok Bakula Rimpochee", country: "India" },
  { code: "DHM", city: "Dharamshala", name: "Kangra Airport", country: "India" },
  { code: "SLV", city: "Shimla", name: "Shimla Airport", country: "India" },
  { code: "DED", city: "Dehradun", name: "Jolly Grant Airport", country: "India" },
  { code: "PGH", city: "Pantnagar", name: "Pantnagar Airport", country: "India" },
  { code: "JAI", city: "Jaipur", name: "Jaipur International", country: "India" },
  { code: "JDH", city: "Jodhpur", name: "Jodhpur Airport", country: "India" },
  { code: "UDR", city: "Udaipur", name: "Maharana Pratap Airport", country: "India" },
  { code: "LKO", city: "Lucknow", name: "Chaudhary Charan Singh International", country: "India" },
  { code: "KNU", city: "Kanpur", name: "Kanpur Airport", country: "India" },
  { code: "VNS", city: "Varanasi", name: "Lal Bahadur Shastri International", country: "India" },
  { code: "AYJ", city: "Ayodhya", name: "Maharishi Valmiki International", country: "India" },
  { code: "IXD", city: "Prayagraj", name: "Prayagraj Airport", country: "India" },
  // ── India — West ───────────────────────────────────────────────
  { code: "BOM", city: "Mumbai", name: "Chhatrapati Shivaji Maharaj International", country: "India" },
  { code: "AMD", city: "Ahmedabad", name: "Sardar Vallabhbhai Patel International", country: "India" },
  { code: "STV", city: "Surat", name: "Surat International", country: "India" },
  { code: "BDQ", city: "Vadodara", name: "Vadodara Airport", country: "India" },
  { code: "RAJ", city: "Rajkot", name: "Rajkot International", country: "India" },
  { code: "PNQ", city: "Pune", name: "Pune Airport", country: "India" },
  { code: "GOI", city: "Goa (Dabolim)", name: "Dabolim Airport", country: "India" },
  { code: "GOX", city: "Goa (Mopa)", name: "Manohar International", country: "India" },
  { code: "NAG", city: "Nagpur", name: "Dr. Babasaheb Ambedkar International", country: "India" },
  { code: "IDR", city: "Indore", name: "Devi Ahilya Bai Holkar Airport", country: "India" },
  { code: "BHO", city: "Bhopal", name: "Raja Bhoj Airport", country: "India" },
  // ── India — South ──────────────────────────────────────────────
  { code: "BLR", city: "Bengaluru", name: "Kempegowda International", country: "India" },
  { code: "MAA", city: "Chennai", name: "Chennai International", country: "India" },
  { code: "HYD", city: "Hyderabad", name: "Rajiv Gandhi International", country: "India" },
  { code: "COK", city: "Kochi", name: "Cochin International", country: "India" },
  { code: "TRV", city: "Thiruvananthapuram", name: "Trivandrum International", country: "India" },
  { code: "CCJ", city: "Kozhikode", name: "Calicut International", country: "India" },
  { code: "CJB", city: "Coimbatore", name: "Coimbatore International", country: "India" },
  { code: "IXM", city: "Madurai", name: "Madurai Airport", country: "India" },
  { code: "VTZ", city: "Visakhapatnam", name: "Visakhapatnam International", country: "India" },
  // ── India — East & Northeast ───────────────────────────────────
  { code: "CCU", city: "Kolkata", name: "Netaji Subhas Chandra Bose International", country: "India" },
  { code: "PAT", city: "Patna", name: "Jay Prakash Narayan International", country: "India" },
  { code: "GAY", city: "Gaya", name: "Gaya International", country: "India" },
  { code: "DBR", city: "Darbhanga", name: "Darbhanga Airport", country: "India" },
  { code: "IXB", city: "Bagdogra (Siliguri)", name: "Bagdogra International", country: "India" },
  { code: "GAU", city: "Guwahati", name: "Lokpriya Gopinath Bordoloi International", country: "India" },
  { code: "IXA", city: "Agartala", name: "Maharaja Bir Bikram Airport", country: "India" },
  { code: "BBI", city: "Bhubaneswar", name: "Biju Patnaik International", country: "India" },
  { code: "IXR", city: "Ranchi", name: "Birsa Munda Airport", country: "India" },
  { code: "RPR", city: "Raipur", name: "Swami Vivekananda Airport", country: "India" },
  { code: "IXZ", city: "Port Blair", name: "Veer Savarkar International", country: "India" },
  // ── Gulf & Middle East ─────────────────────────────────────────
  { code: "DXB", city: "Dubai", name: "Dubai International", country: "UAE" },
  { code: "AUH", city: "Abu Dhabi", name: "Zayed International", country: "UAE" },
  { code: "SHJ", city: "Sharjah", name: "Sharjah International", country: "UAE" },
  { code: "DOH", city: "Doha", name: "Hamad International", country: "Qatar" },
  { code: "KWI", city: "Kuwait City", name: "Kuwait International", country: "Kuwait" },
  { code: "BAH", city: "Bahrain", name: "Bahrain International", country: "Bahrain" },
  { code: "MCT", city: "Muscat", name: "Muscat International", country: "Oman" },
  { code: "RUH", city: "Riyadh", name: "King Khalid International", country: "Saudi Arabia" },
  { code: "JED", city: "Jeddah", name: "King Abdulaziz International", country: "Saudi Arabia" },
  { code: "DMM", city: "Dammam", name: "King Fahd International", country: "Saudi Arabia" },
  { code: "TLV", city: "Tel Aviv", name: "Ben Gurion Airport", country: "Israel" },
  // ── Southeast Asia ─────────────────────────────────────────────
  { code: "BKK", city: "Bangkok", name: "Suvarnabhumi Airport", country: "Thailand" },
  { code: "DMK", city: "Bangkok (Don Mueang)", name: "Don Mueang International", country: "Thailand" },
  { code: "HKT", city: "Phuket", name: "Phuket International", country: "Thailand" },
  { code: "SIN", city: "Singapore", name: "Changi Airport", country: "Singapore" },
  { code: "KUL", city: "Kuala Lumpur", name: "KL International", country: "Malaysia" },
  { code: "DPS", city: "Bali (Denpasar)", name: "Ngurah Rai International", country: "Indonesia" },
  { code: "CGK", city: "Jakarta", name: "Soekarno–Hatta International", country: "Indonesia" },
  { code: "HAN", city: "Hanoi", name: "Noi Bai International", country: "Vietnam" },
  { code: "SGN", city: "Ho Chi Minh City", name: "Tan Son Nhat International", country: "Vietnam" },
  { code: "DAD", city: "Da Nang", name: "Da Nang International", country: "Vietnam" },
  { code: "MNL", city: "Manila", name: "Ninoy Aquino International", country: "Philippines" },
  { code: "PNH", city: "Phnom Penh", name: "Phnom Penh International", country: "Cambodia" },
  // ── South Asia ─────────────────────────────────────────────────
  { code: "CMB", city: "Colombo", name: "Bandaranaike International", country: "Sri Lanka" },
  { code: "MLE", city: "Malé", name: "Velana International", country: "Maldives" },
  { code: "KTM", city: "Kathmandu", name: "Tribhuvan International", country: "Nepal" },
  { code: "DAC", city: "Dhaka", name: "Hazrat Shahjalal International", country: "Bangladesh" },
  // ── East Asia ──────────────────────────────────────────────────
  { code: "HKG", city: "Hong Kong", name: "Hong Kong International", country: "Hong Kong" },
  { code: "NRT", city: "Tokyo (Narita)", name: "Narita International", country: "Japan" },
  { code: "HND", city: "Tokyo (Haneda)", name: "Haneda Airport", country: "Japan" },
  { code: "ICN", city: "Seoul", name: "Incheon International", country: "South Korea" },
  { code: "PVG", city: "Shanghai", name: "Pudong International", country: "China" },
  { code: "PEK", city: "Beijing", name: "Beijing Capital International", country: "China" },
  { code: "TPE", city: "Taipei", name: "Taoyuan International", country: "Taiwan" },
  // ── Europe & UK ────────────────────────────────────────────────
  { code: "LHR", city: "London (Heathrow)", name: "Heathrow Airport", country: "UK" },
  { code: "LGW", city: "London (Gatwick)", name: "Gatwick Airport", country: "UK" },
  { code: "BHX", city: "Birmingham", name: "Birmingham Airport", country: "UK" },
  { code: "MAN", city: "Manchester", name: "Manchester Airport", country: "UK" },
  { code: "DUB", city: "Dublin", name: "Dublin Airport", country: "Ireland" },
  { code: "CDG", city: "Paris", name: "Charles de Gaulle Airport", country: "France" },
  { code: "FRA", city: "Frankfurt", name: "Frankfurt Airport", country: "Germany" },
  { code: "MUC", city: "Munich", name: "Munich Airport", country: "Germany" },
  { code: "AMS", city: "Amsterdam", name: "Schiphol Airport", country: "Netherlands" },
  { code: "ZRH", city: "Zurich", name: "Zurich Airport", country: "Switzerland" },
  { code: "GVA", city: "Geneva", name: "Geneva Airport", country: "Switzerland" },
  { code: "VIE", city: "Vienna", name: "Vienna International", country: "Austria" },
  { code: "FCO", city: "Rome", name: "Fiumicino Airport", country: "Italy" },
  { code: "MXP", city: "Milan", name: "Malpensa Airport", country: "Italy" },
  { code: "MAD", city: "Madrid", name: "Barajas Airport", country: "Spain" },
  { code: "BCN", city: "Barcelona", name: "El Prat Airport", country: "Spain" },
  { code: "ATH", city: "Athens", name: "Eleftherios Venizelos International", country: "Greece" },
  { code: "IST", city: "Istanbul", name: "Istanbul Airport", country: "Turkey" },
  // ── North America ──────────────────────────────────────────────
  { code: "JFK", city: "New York (JFK)", name: "John F. Kennedy International", country: "USA" },
  { code: "EWR", city: "Newark", name: "Newark Liberty International", country: "USA" },
  { code: "IAD", city: "Washington DC", name: "Dulles International", country: "USA" },
  { code: "ORD", city: "Chicago", name: "O'Hare International", country: "USA" },
  { code: "LAX", city: "Los Angeles", name: "Los Angeles International", country: "USA" },
  { code: "SFO", city: "San Francisco", name: "San Francisco International", country: "USA" },
  { code: "SEA", city: "Seattle", name: "Seattle–Tacoma International", country: "USA" },
  { code: "DFW", city: "Dallas", name: "Dallas/Fort Worth International", country: "USA" },
  { code: "IAH", city: "Houston", name: "George Bush Intercontinental", country: "USA" },
  { code: "ATL", city: "Atlanta", name: "Hartsfield–Jackson International", country: "USA" },
  { code: "BOS", city: "Boston", name: "Logan International", country: "USA" },
  { code: "YYZ", city: "Toronto", name: "Pearson International", country: "Canada" },
  { code: "YVR", city: "Vancouver", name: "Vancouver International", country: "Canada" },
  { code: "YYC", city: "Calgary", name: "Calgary International", country: "Canada" },
  { code: "YEG", city: "Edmonton", name: "Edmonton International", country: "Canada" },
  { code: "YUL", city: "Montreal", name: "Trudeau International", country: "Canada" },
  { code: "YOW", city: "Ottawa", name: "Macdonald–Cartier International", country: "Canada" },
  // ── Oceania ────────────────────────────────────────────────────
  { code: "SYD", city: "Sydney", name: "Kingsford Smith Airport", country: "Australia" },
  { code: "MEL", city: "Melbourne", name: "Melbourne Airport", country: "Australia" },
  { code: "BNE", city: "Brisbane", name: "Brisbane Airport", country: "Australia" },
  { code: "PER", city: "Perth", name: "Perth Airport", country: "Australia" },
  { code: "AKL", city: "Auckland", name: "Auckland Airport", country: "New Zealand" },
  // ── Central Asia, Caucasus & Africa ────────────────────────────
  { code: "TAS", city: "Tashkent", name: "Tashkent International", country: "Uzbekistan" },
  { code: "ALA", city: "Almaty", name: "Almaty International", country: "Kazakhstan" },
  { code: "GYD", city: "Baku", name: "Heydar Aliyev International", country: "Azerbaijan" },
  { code: "TBS", city: "Tbilisi", name: "Tbilisi International", country: "Georgia" },
  { code: "EVN", city: "Yerevan", name: "Zvartnots International", country: "Armenia" },
  { code: "CAI", city: "Cairo", name: "Cairo International", country: "Egypt" },
  { code: "NBO", city: "Nairobi", name: "Jomo Kenyatta International", country: "Kenya" },
  { code: "JNB", city: "Johannesburg", name: "O.R. Tambo International", country: "South Africa" },
  { code: "CPT", city: "Cape Town", name: "Cape Town International", country: "South Africa" },
  { code: "MRU", city: "Mauritius", name: "Sir Seewoosagur Ramgoolam International", country: "Mauritius" },
  { code: "SEZ", city: "Seychelles (Mahé)", name: "Seychelles International", country: "Seychelles" },
];

/** Case-insensitive search across code, city, airport name and country. */
export function searchAirports(query: string, limit = 8): Airport[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const starts: Airport[] = [];
  const contains: Airport[] = [];
  for (const a of AIRPORTS) {
    const code = a.code.toLowerCase();
    const city = a.city.toLowerCase();
    if (code === q || city.startsWith(q)) starts.push(a);
    else if (
      code.startsWith(q) ||
      city.includes(q) ||
      a.name.toLowerCase().includes(q) ||
      a.country.toLowerCase().startsWith(q)
    )
      contains.push(a);
    if (starts.length >= limit) break;
  }
  return [...starts, ...contains].slice(0, limit);
}

export const formatAirport = (a: Airport) => `${a.city} (${a.code})`;
