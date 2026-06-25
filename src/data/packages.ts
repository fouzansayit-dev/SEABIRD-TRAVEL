// PLACEHOLDER DATA — replace with real Seabird Travel itineraries/prices.
// Structure is stable; swap fields without changing component code.

export type Package = {
  id: string;
  destination: "canada-west-coast" | "india" | "us";
  title: string;
  duration: string;
  price: number; // CAD, placeholder
  image: string;
  gallery: string[];
  highlights: string[];
  itinerary: { day: number; title: string; description: string }[];
  inclusions: string[];
  exclusions: string[];
};

const sampleItinerary = (days: number) =>
  Array.from({ length: days }, (_, i) => ({
    day: i + 1,
    title: i === 0 ? "Arrival & Welcome" : i === days - 1 ? "Departure" : `Day ${i + 1} Exploration`,
    description: "SAMPLE — replace with real day-by-day itinerary copy.",
  }));

const sampleInclusions = [
  "SAMPLE — Return flights (economy)",
  "SAMPLE — Hotel accommodation",
  "SAMPLE — Daily breakfast",
  "SAMPLE — Airport transfers",
];
const sampleExclusions = [
  "SAMPLE — Travel insurance",
  "SAMPLE — Personal expenses",
  "SAMPLE — Visa fees",
];

export const packages: Package[] = [
  // ---- Canada West Coast (6) ----
  {
    id: "vancouver-whistler",
    destination: "canada-west-coast",
    title: "SAMPLE — Vancouver & Whistler Explorer",
    duration: "6 Days / 5 Nights",
    price: 1299,
    image: "https://images.unsplash.com/photo-1559511260-66a654ae982a?w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1559511260-66a654ae982a?w=1600&q=80",
      "https://images.unsplash.com/photo-1609825488888-3a766db05542?w=1600&q=80",
      "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=1600&q=80",
    ],
    highlights: ["Stanley Park & Granville Island", "Sea-to-Sky Gondola", "Peak 2 Peak in Whistler"],
    itinerary: sampleItinerary(6),
    inclusions: sampleInclusions,
    exclusions: sampleExclusions,
  },
  {
    id: "victoria-island",
    destination: "canada-west-coast",
    title: "SAMPLE — Victoria & Vancouver Island Escape",
    duration: "5 Days / 4 Nights",
    price: 1149,
    image: "https://images.unsplash.com/photo-1609825488888-3a766db05542?w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1609825488888-3a766db05542?w=1600&q=80",
    ],
    highlights: ["Butchart Gardens", "Whale watching tour", "Inner Harbour walk"],
    itinerary: sampleItinerary(5),
    inclusions: sampleInclusions,
    exclusions: sampleExclusions,
  },
  {
    id: "rockies-banff",
    destination: "canada-west-coast",
    title: "SAMPLE — Canadian Rockies & Banff",
    duration: "7 Days / 6 Nights",
    price: 1799,
    image: "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=1200&q=80",
    gallery: ["https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=1600&q=80"],
    highlights: ["Lake Louise & Moraine Lake", "Icefields Parkway drive", "Banff hot springs"],
    itinerary: sampleItinerary(7),
    inclusions: sampleInclusions,
    exclusions: sampleExclusions,
  },
  {
    id: "jasper-glacier",
    destination: "canada-west-coast",
    title: "SAMPLE — Jasper & Columbia Icefield",
    duration: "5 Days / 4 Nights",
    price: 1399,
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200&q=80",
    gallery: ["https://images.unsplash.com/photo-1551632811-561732d1e306?w=1600&q=80"],
    highlights: ["Athabasca Glacier walk", "Maligne Lake cruise", "SkyTram to summit"],
    itinerary: sampleItinerary(5),
    inclusions: sampleInclusions,
    exclusions: sampleExclusions,
  },
  {
    id: "okanagan-wine",
    destination: "canada-west-coast",
    title: "SAMPLE — Okanagan Valley Wine Country",
    duration: "4 Days / 3 Nights",
    price: 999,
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
    gallery: ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80"],
    highlights: ["Winery tours", "Lake Okanagan cruise", "Farm-to-table dining"],
    itinerary: sampleItinerary(4),
    inclusions: sampleInclusions,
    exclusions: sampleExclusions,
  },
  {
    id: "calgary-stampede",
    destination: "canada-west-coast",
    title: "SAMPLE — Calgary & Stampede Country",
    duration: "4 Days / 3 Nights",
    price: 949,
    image: "https://images.unsplash.com/photo-1609766418204-94aae0ecfdfc?w=1200&q=80",
    gallery: ["https://images.unsplash.com/photo-1609766418204-94aae0ecfdfc?w=1600&q=80"],
    highlights: ["Calgary Tower views", "Heritage Park", "Day trip to Drumheller"],
    itinerary: sampleItinerary(4),
    inclusions: sampleInclusions,
    exclusions: sampleExclusions,
  },
  // ---- India (1) ----
  {
    id: "golden-triangle",
    destination: "india",
    title: "SAMPLE — India Golden Triangle",
    duration: "9 Days / 8 Nights",
    price: 2199,
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200&q=80",
    gallery: ["https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1600&q=80"],
    highlights: ["Taj Mahal sunrise", "Amber Fort, Jaipur", "Old Delhi rickshaw ride"],
    itinerary: sampleItinerary(9),
    inclusions: sampleInclusions,
    exclusions: sampleExclusions,
  },
  // ---- US (1) ----
  {
    id: "california-coast",
    destination: "us",
    title: "SAMPLE — California Pacific Coast",
    duration: "8 Days / 7 Nights",
    price: 2399,
    image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1200&q=80",
    gallery: ["https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1600&q=80"],
    highlights: ["San Francisco & Golden Gate", "Big Sur drive", "Los Angeles & Santa Monica"],
    itinerary: sampleItinerary(8),
    inclusions: sampleInclusions,
    exclusions: sampleExclusions,
  },
];

export const destinations = [
  {
    slug: "canada-west-coast",
    name: "Canada West Coast",
    tagline: "Mountains, coastline, and Rockies",
    image: "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=1600&q=80",
    count: 6,
  },
  {
    slug: "india",
    name: "India",
    tagline: "Heritage, colour, and unforgettable flavour",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1600&q=80",
    count: 1,
  },
  {
    slug: "us",
    name: "United States",
    tagline: "Iconic cities and scenic drives",
    image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1600&q=80",
    count: 1,
  },
];
