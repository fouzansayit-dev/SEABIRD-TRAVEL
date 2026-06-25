import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useTodaysDeals } from "@/hooks/useTodaysDeals";
import { DealCard } from "@/components/DealCard";
import { INDIA_AIRPORT_CODES } from "@/config/dealsSheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useBookingDialog } from "@/components/BookingDialog";

export const Route = createFileRoute("/deals")({
  head: () => ({
    meta: [
      { title: "Today's Deals — Seabird Travel" },
      { name: "description", content: "Check out today's best flight deals from Seabird Travel. Prices subject to availability." },
    ],
  }),
  component: DealsPage,
});

const CANADA_AIRPORTS = [
  'YYZ', 'YVR', 'YEG', 'YYC', 'YUL', 'YOW', 'YHZ', 'YWG', 'YXX', 'YQB', 'YHM', 'YXY', 'YZF', 'YKA', 'YQR', 'YXE', 'YQT', 'YDF'
];

type FilterType = "All" | "Canada-India" | "Domestic Canada" | "International";

function DealsPage() {
  const { openBooking } = useBookingDialog();
  const { deals, loading, error } = useTodaysDeals();
  const [filter, setFilter] = useState<FilterType>("All");

  const filteredDeals = deals.filter((deal) => {
    if (filter === "All") return true;
    
    const isCanadaIndia = INDIA_AIRPORT_CODES.includes(deal.route_to_code) || INDIA_AIRPORT_CODES.includes(deal.route_from_code);
    const isDomestic = CANADA_AIRPORTS.includes(deal.route_from_code) && CANADA_AIRPORTS.includes(deal.route_to_code);
    
    if (filter === "Canada-India") return isCanadaIndia;
    if (filter === "Domestic Canada") return isDomestic;
    if (filter === "International") return !isCanadaIndia && !isDomestic;
    
    return true;
  });

  return (
    <>
      <section className="bg-gradient-to-br from-primary-dark via-primary to-primary-dark py-12 text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h1 className="text-3xl font-bold sm:text-4xl flex items-center gap-3">
            Today's Deals
          </h1>
          <p className="mt-2 max-w-2xl text-primary-foreground/85">
            Updated daily. Find the best fares available right now and book before they expire.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-2">
          {(["All", "Canada-India", "Domestic Canada", "International"] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                filter === f 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex h-[400px] flex-col rounded-xl border border-border bg-card p-5">
                <Skeleton className="h-6 w-1/3 mb-4" />
                <Skeleton className="h-10 w-full mb-2" />
                <Skeleton className="h-4 w-1/2 mb-6" />
                <div className="space-y-3 mt-auto">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-10 w-full mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : error || deals.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card py-20 px-6 text-center shadow-sm">
            <h3 className="mb-3 text-xl font-bold">No live deals right now</h3>
            <p className="mb-6 max-w-md text-muted-foreground">
              Send us an inquiry and we'll find the best fare for your dates and destination.
            </p>
            <button
              onClick={() => openBooking({ type: "flights", details: "Hi Seabird Travel, I am looking for flight deals." })}
              className="inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3 font-semibold text-accent-foreground shadow transition hover:bg-accent-dark hover:cursor-pointer"
            >
              Enquire Now
            </button>
          </div>
        ) : filteredDeals.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            No deals found in this category. Try selecting "All".
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDeals.map((deal, idx) => (
              <DealCard key={`${deal.route_from_code}-${deal.route_to_code}-${idx}`} deal={deal} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
