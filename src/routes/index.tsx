import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SearchWidget } from "@/components/SearchWidget";
import { TodaysDealsSection } from "@/components/TodaysDealsSection";
import { EnquireButton } from "@/components/EnquireButton";
import { ShieldCheck, Wallet, HeartHandshake, Tag, Plane, Star, ArrowRight, ArrowLeft, Quote } from "lucide-react";
import { routes, hotelCities } from "@/data/routes";
import { destinations, packages } from "@/data/packages";
import { useBookingDialog } from "@/components/BookingDialog";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import canadaBanner from "../../bottom banners/seabird_canada_banner.png";
import dubaiBanner from "../../bottom banners/seabird_dubai_banner.png";
import indiaBanner from "../../bottom banners/seabird_india_banner.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Seabird Travel — Flights, Hotels & Tour Packages from Edmonton" },
      { name: "description", content: "Search flights, hotels and tour packages with Seabird Travel. Personalized, secure, and great value — based in Edmonton, Canada." },
      { property: "og:title", content: "Seabird Travel — Taking You Wherever You Need to Be" },
      { property: "og:description", content: "Edmonton-based Canadian travel agency. Flights, hotels and curated packages." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      <div className="relative">
        <Hero />
        <div className="relative z-10 -mt-16 sm:-mt-24 mx-auto max-w-7xl px-4 sm:px-6">
          <SearchWidget />
        </div>
      </div>
      <TrustStrip />
      <TodaysDealsSection />
      <PopularRoutes />
      <TopDestinations />
      <HotelDeals />
      <PopularPackages />
      <SpecialPromotions />
      <WhyChoose />
      <Testimonials />
      <CtaBanner />
    </>
  );
}

function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <img
          src="/seabird_travel_banner.png"
          alt="Seabird Travel Banner"
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/45" />
      </div>
      <div className="mx-auto max-w-7xl px-4 pb-28 pt-14 sm:px-6 sm:pb-36 sm:pt-20">
        <div className="max-w-2xl text-primary-foreground">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wider backdrop-blur">
            <Star className="h-3 w-3 fill-accent text-accent" /> Trusted Canadian Travel Agency
          </span>
          <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Taking You <span className="text-accent">Wherever</span> You Need to Be
          </h1>
          <p className="mt-4 max-w-xl text-base text-primary-foreground/85 sm:text-lg">
            Search smart. Travel easy. We hand-craft flights, hotels and packages so every trip from Edmonton starts smooth.
          </p>
        </div>
      </div>
    </section>
  );
}

function TrustStrip() {
  const items = [
    { icon: ShieldCheck, title: "Safe & Secure Booking", sub: "Vetted partners, transparent pricing" },
    { icon: Wallet, title: "Flexible Payment Plans", sub: "Spread the cost of your trip" },
    { icon: HeartHandshake, title: "Personalized Assistance", sub: "Real humans, every step" },
    { icon: Tag, title: "Discounted Travel Deals", sub: "Exclusive Seabird rates" },
  ];
  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        {items.map((it) => (
          <div key={it.title} className="flex items-start gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
              <it.icon className="h-5 w-5" />
            </span>
            <div>
              <div className="text-sm font-bold text-foreground">{it.title}</div>
              <div className="text-xs text-muted-foreground">{it.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function PopularRoutes() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <SectionHeader eyebrow="Popular Routes" title="Top picks from our travellers" link={{ to: "/flights", label: "View all routes" }} />
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {routes.map((r) => (
          <RouteCard key={r.id} route={r} />
        ))}
      </div>
    </section>
  );
}

export function RouteCard({ route }: { route: (typeof routes)[number] }) {
  const { openBooking } = useBookingDialog();
  return (
    <button
      onClick={() => openBooking({
        type: "flights",
        from: route.from,
        to: route.to,
        details: `Hi Seabird Travel, I'd like a flight quote for ${route.from} → ${route.to}.`
      })}
      className="group overflow-hidden rounded-2xl bg-card shadow-card ring-1 ring-border text-left hover:cursor-pointer transition hover:-translate-y-1 hover:shadow-elevated w-full flex flex-col"
    >
      <div className="relative h-44 overflow-hidden">
        <img src={route.image} alt={`${route.from} to ${route.to}`} className="h-full w-full object-cover transition group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent" />
        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-accent-foreground">
          <Plane className="h-3 w-3 -rotate-12" /> Flight
        </span>
        <div className="absolute bottom-3 left-3 text-primary-foreground">
          <div className="text-lg font-bold leading-tight">{route.from} → {route.to}</div>
          <div className="text-xs opacity-90">{route.country}</div>
        </div>
      </div>
      <div className="flex items-end justify-between p-4">
        <div>
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{route.sampleDates}</div>
          <div className="mt-0.5 text-xs text-muted-foreground">Round trip · Economy</div>
        </div>
        <div className="text-right">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">From*</div>
          <div className="text-xl font-bold text-primary">${route.price}<span className="text-xs font-medium text-muted-foreground"> CAD</span></div>
        </div>
      </div>
    </button>
  );
}

function TopDestinations() {
  return (
    <section className="bg-secondary/40 py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeader eyebrow="Top Destinations" title="Where Seabird travellers are going" />
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {destinations.map((d) => (
            <Link
              key={d.slug}
              to="/destinations/$slug"
              params={{ slug: d.slug }}
              className="group relative block h-72 overflow-hidden rounded-3xl shadow-card ring-1 ring-border"
            >
              <img src={d.image} alt={d.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-primary-foreground">
                <div className="text-xs font-semibold uppercase tracking-wider text-accent">{d.count} trip{d.count > 1 ? "s" : ""}</div>
                <div className="mt-1 text-2xl font-bold">{d.name}</div>
                <div className="text-sm opacity-90">{d.tagline}</div>
                <div className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-accent">
                  Explore <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function HotelDeals() {
  const { openBooking } = useBookingDialog();
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <SectionHeader eyebrow="Hotels" title="Book hotels at popular destinations" link={{ to: "/hotels", label: "All hotels" }} />
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {hotelCities.slice(0, 6).map((h) => (
          <button key={h.city}
            onClick={() => openBooking({
              type: "hotels",
              to: h.city,
              details: `Hi Seabird Travel, I'd like hotel options in ${h.city}.`
            })}
            className="group flex items-center gap-4 overflow-hidden rounded-2xl bg-card p-3 shadow-card ring-1 ring-border text-left hover:cursor-pointer transition hover:-translate-y-0.5 hover:shadow-elevated w-full">
            <img src={h.image} alt={h.city} className="h-20 w-24 shrink-0 rounded-xl object-cover" />
            <div className="min-w-0 flex-1">
              <div className="text-base font-bold text-foreground">{h.city}</div>
              <div className="text-xs text-muted-foreground">{h.country}</div>
              <div className="mt-1.5 text-xs text-muted-foreground">
                Starting at <span className="text-base font-bold text-primary">${h.from}*</span>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
          </button>
        ))}
      </div>
      <p className="mt-3 text-[11px] text-muted-foreground">* Sample placeholder pricing — actual rates confirmed on enquiry.</p>
    </section>
  );
}

function PopularPackages() {
  const featured = packages.slice(0, 6);
  return (
    <section className="bg-secondary/40 py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeader eyebrow="Popular Packages" title="Hand-crafted itineraries" link={{ to: "/destinations/canada-west-coast", label: "Browse all" }} />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => <PackageCard key={p.id} pkg={p} />)}
        </div>
      </div>
    </section>
  );
}

export function PackageCard({ pkg }: { pkg: (typeof packages)[number] }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl bg-card shadow-card ring-1 ring-border transition hover:-translate-y-1 hover:shadow-elevated">
      <Link to="/packages/$id" params={{ id: pkg.id }} className="relative block h-48 overflow-hidden">
        <img src={pkg.image} alt={pkg.title} className="h-full w-full object-cover transition group-hover:scale-105" />
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-primary">{pkg.duration}</span>
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <Link to="/packages/$id" params={{ id: pkg.id }} className="line-clamp-2 text-base font-bold text-foreground hover:text-primary">
          {pkg.title}
        </Link>
        <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
          {pkg.highlights.slice(0, 3).map((h) => (
            <li key={h} className="flex items-start gap-1.5">
              <span className="mt-1.5 inline-block h-1 w-1 rounded-full bg-accent" />{h}
            </li>
          ))}
        </ul>
        <div className="mt-4 flex items-end justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">From*</div>
            <div className="text-xl font-bold text-primary">${pkg.price}<span className="text-xs font-medium text-muted-foreground"> CAD</span></div>
          </div>
          <EnquireButton message={`Hi Seabird Travel, I'd like details on ${pkg.title}.`} variant="accent" className="px-4 py-2" />
        </div>
      </div>
    </div>
  );
}

function SpecialPromotions() {
  const { openBooking } = useBookingDialog();
  const promos = [
    {
      image: "/canada_banner_travel.png",
      alt: "Canada Special Offer",
      destination: "Canada",
      title: "Explore Canada",
      subtitle: "Discover package deals & seasonal flight offers across Canada.",
      details: "Hi Seabird Travel, I'd like to enquire about the Canada Featured Deal."
    },
    {
      image: "/dubai_banner.png",
      alt: "Dubai Special Offer",
      destination: "Dubai",
      title: "Experience Dubai",
      subtitle: "Unlock exclusive deals on hotels, flights, and tours in Dubai.",
      details: "Hi Seabird Travel, I'd like to enquire about the Dubai Featured Deal."
    }
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <SectionHeader eyebrow="Exclusive Offers" title="Limited-Time Exclusive Deals" />
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {promos.map((promo) => (
          <button
            key={promo.destination}
            onClick={() => openBooking({
              type: "general",
              to: promo.destination,
              details: promo.details
            })}
            className="group relative block w-full h-[220px] sm:h-[280px] md:h-[320px] overflow-hidden rounded-3xl bg-muted text-left shadow-card ring-1 ring-border hover:cursor-pointer transition-all duration-500 hover:-translate-y-1 hover:shadow-elevated focus:outline-none"
          >
            <img
              src={promo.image}
              alt={promo.alt}
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10 transition-opacity duration-300" />
            
            <div className="absolute inset-0 p-6 sm:p-8 text-white z-10 flex flex-col justify-between">
              <div>
                <span className="inline-flex items-center gap-1 rounded-full bg-accent text-accent-foreground px-3 py-1 text-xs font-bold uppercase tracking-wider shadow-sm">
                  Special Offer
                </span>
              </div>
              <div>
                <h3 className="text-2xl font-bold sm:text-3xl leading-tight drop-shadow-md">
                  {promo.title}
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-white/90 drop-shadow-sm line-clamp-1 sm:line-clamp-none">
                  {promo.subtitle}
                </p>
                <div className="mt-3.5 inline-flex items-center gap-2 rounded-full bg-white text-primary font-bold px-4 py-2 text-xs hover:bg-accent hover:text-accent-foreground transition-all duration-300 shadow-md">
                  Claim Offer
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

function WhyChoose() {
  const items = [
    { title: "User-Friendly Platform", desc: "Simple search, no clutter, no surprises." },
    { title: "Wide Selection", desc: "Flights and tours across the world's best destinations." },
    { title: "Competitive Pricing", desc: "Exclusive Seabird fares and consolidator rates." },
    { title: "Secure & Personal Service", desc: "Real people, real booking support, real care." },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <SectionHeader eyebrow="Why Seabird" title="Why travellers choose us" />
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it, i) => (
          <div key={it.title} className="rounded-2xl bg-card p-6 shadow-card ring-1 ring-border">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-lg font-bold text-primary-foreground">{i + 1}</div>
            <div className="mt-4 text-base font-bold">{it.title}</div>
            <p className="mt-1 text-sm text-muted-foreground">{it.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Testimonials() {
  // SAMPLE testimonials — replace before publishing.
  const tt = [
    { name: "Priya S.", trip: "India Golden Triangle", text: "Seabird handled every detail. Our family trip to India was absolutely seamless from Edmonton onward." },
    { name: "Daniel M.", trip: "Banff Rockies Tour", text: "Best price I found anywhere, and the personalized updates made the whole booking feel personal." },
    { name: "Aisha K.", trip: "Toronto → Istanbul", text: "They got us a flight when nothing else looked open. Genuine, fast, and trustworthy." },
  ];
  return (
    <section className="bg-primary py-14 text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Testimonials</div>
          <h2 className="mt-2 text-3xl font-bold sm:text-4xl">Loved by travellers across Canada</h2>
          <p className="mt-2 text-xs text-primary-foreground/60">SAMPLE testimonials — replace with real client quotes.</p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {tt.map((t) => (
            <figure key={t.name} className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur">
              <Quote className="h-6 w-6 text-accent" />
              <blockquote className="mt-3 text-sm leading-relaxed text-primary-foreground/90">"{t.text}"</blockquote>
              <figcaption className="mt-4 border-t border-white/10 pt-4">
                <div className="text-sm font-bold">{t.name}</div>
                <div className="text-xs text-primary-foreground/65">{t.trip}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaBanner() {
  const { openBooking } = useBookingDialog();
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  const banners = [
    {
      src: canadaBanner,
      alt: "Seabird Canada Banner",
      destination: "Canada",
      title: "Explore the Wonders of Canada",
      desc: "From the majestic Rockies to historic coastal towns, start your Canadian adventure today.",
      details: "Hi Seabird Travel, I'd like to enquire about travel packages and flights to Canada."
    },
    {
      src: dubaiBanner,
      alt: "Seabird Dubai Banner",
      destination: "Dubai",
      title: "Experience the Magic of Dubai",
      desc: "Witness futuristic skyscrapers, golden desert dunes, and world-class luxury experiences.",
      details: "Hi Seabird Travel, I'd like to enquire about travel packages and flights to Dubai."
    },
    {
      src: indiaBanner,
      alt: "Seabird India Banner",
      destination: "India",
      title: "Discover the Heritage of India",
      desc: "Immerse yourself in rich cultures, stunning architecture, and legendary hospitality.",
      details: "Hi Seabird Travel, I'd like to enquire about travel packages and flights to India."
    }
  ];

  React.useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on("select", onSelect);

    const interval = setInterval(() => {
      api.scrollNext();
    }, 5000);

    return () => {
      clearInterval(interval);
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <div className="relative overflow-hidden rounded-3xl shadow-elevated group/banner bg-muted">
        <Carousel
          setApi={setApi}
          opts={{
            loop: true,
            align: "start",
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-0">
            {banners.map((banner, index) => (
              <CarouselItem key={index} className="pl-0">
                <button
                  onClick={() => openBooking({
                    type: "general",
                    to: banner.destination,
                    details: banner.details
                  })}
                  className="relative block w-full h-[240px] sm:h-[320px] md:h-[400px] lg:h-[440px] overflow-hidden text-left hover:cursor-pointer group/slide focus:outline-none"
                >
                  <img
                    src={banner.src}
                    alt={banner.alt}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/slide:scale-105"
                  />
                  {/* Visual overlay for premium look and text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/15 transition-opacity duration-300" />
                  
                  {/* Full Slide Content Layout */}
                  <div className="absolute inset-0 z-10 flex flex-col justify-between p-6 sm:p-10 md:p-12">
                    <div>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3.5 py-1.5 text-xs font-semibold text-white uppercase tracking-wider backdrop-blur-md ring-1 ring-white/10">
                        Featured Destination
                      </span>
                    </div>
                    
                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                      <div className="max-w-2xl text-white">
                        <h3 className="text-2xl font-bold sm:text-3xl md:text-4xl leading-tight drop-shadow-md">
                          {banner.title}
                        </h3>
                        <p className="mt-2 text-xs sm:text-sm md:text-base text-white/90 drop-shadow-sm line-clamp-2 md:line-clamp-none">
                          {banner.desc}
                        </p>
                      </div>
                      
                      <div className="shrink-0">
                        <div className="inline-flex items-center gap-2 rounded-full bg-accent text-accent-foreground font-bold px-5 py-2.5 sm:px-6 sm:py-3.5 text-sm hover:bg-accent-dark transition-all duration-300 shadow-md group-hover/slide:translate-x-1">
                          Enquire Now
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          {/* Custom Arrows */}
          <button
            onClick={() => api?.scrollPrev()}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 hover:bg-white text-primary shadow-md hover:scale-105 transition-all duration-300 opacity-0 group-hover/banner:opacity-100 hover:cursor-pointer"
            aria-label="Previous banner"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => api?.scrollNext()}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 hover:bg-white text-primary shadow-md hover:scale-105 transition-all duration-300 opacity-0 group-hover/banner:opacity-100 hover:cursor-pointer"
            aria-label="Next banner"
          >
            <ArrowRight className="h-5 w-5" />
          </button>
        </Carousel>

        {/* Custom Pagination Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={`h-2 rounded-full transition-all duration-300 hover:cursor-pointer ${
                current === index ? "w-6 bg-accent" : "w-2 bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export function SectionHeader({ eyebrow, title, link }: { eyebrow: string; title: string; link?: { to: string; label: string } }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-dark">{eyebrow}</div>
        <h2 className="mt-1.5 text-2xl font-bold text-foreground sm:text-3xl">{title}</h2>
      </div>
      {link && (
        <a href={link.to} className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-dark">
          {link.label} <ArrowRight className="h-4 w-4" />
        </a>
      )}
    </div>
  );
}
