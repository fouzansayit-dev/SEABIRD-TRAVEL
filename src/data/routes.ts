// PLACEHOLDER PRICES — replace with real fares before publishing.
export type Route = {
  id: string;
  from: string;
  to: string;
  country: string;
  price: number; // CAD, sample
  sampleDates: string;
  image: string;
};

export const routes: Route[] = [
  {
    id: "yyc-lhr",
    from: "Calgary",
    to: "London",
    country: "United Kingdom",
    price: 849,
    sampleDates: "Sample · Mar 12 – Mar 24",
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&q=80",
  },
  {
    id: "yyz-cdg",
    from: "Toronto",
    to: "Paris",
    country: "France",
    price: 729,
    sampleDates: "Sample · Apr 04 – Apr 16",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&q=80",
  },
  {
    id: "yyz-ist",
    from: "Toronto",
    to: "Istanbul",
    country: "Turkey",
    price: 899,
    sampleDates: "Sample · May 02 – May 14",
    image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200&q=80",
  },
  {
    id: "yyz-mex",
    from: "Toronto",
    to: "Mexico City",
    country: "Mexico",
    price: 549,
    sampleDates: "Sample · Feb 18 – Feb 28",
    image: "https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=1200&q=80",
  },
  {
    id: "yyz-zrh",
    from: "Toronto",
    to: "Zurich",
    country: "Switzerland",
    price: 939,
    sampleDates: "Sample · Jun 06 – Jun 18",
    image: "https://images.unsplash.com/photo-1530841377377-3ff06c0ca713?w=1200&q=80",
  },
];

// PLACEHOLDER — real hotel partner data goes here later.
export const hotelCities = [
  { city: "London", country: "UK", from: 142, image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80" },
  { city: "Paris", country: "France", from: 168, image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80" },
  { city: "Istanbul", country: "Turkey", from: 92, image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=600&q=80" },
  { city: "Mexico City", country: "Mexico", from: 78, image: "https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=600&q=80" },
  { city: "Zurich", country: "Switzerland", from: 189, image: "https://images.unsplash.com/photo-1530841377377-3ff06c0ca713?w=600&q=80" },
  { city: "Vancouver", country: "Canada", from: 154, image: "https://images.unsplash.com/photo-1559511260-66a654ae982a?w=600&q=80" },
];

export const airlines = [
  "Air Canada",
  "WestJet",
  "British Airways",
  "Lufthansa",
  "Emirates",
  "Air France",
  "KLM",
  "Turkish Airlines",
];
