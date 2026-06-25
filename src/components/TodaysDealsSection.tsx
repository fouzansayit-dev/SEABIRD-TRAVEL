import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { useTodaysDeals } from "@/hooks/useTodaysDeals";
import { DealCard } from "./DealCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { ArrowLeft, ArrowRight } from "lucide-react";

export function TodaysDealsSection() {
  const { deals, loading, error } = useTodaysDeals();
  const [api, setApi] = useState<CarouselApi>();

  // Autoplay effect
  useEffect(() => {
    if (!api) return;
    const interval = setInterval(() => {
      api.scrollNext();
    }, 4000); // Rotate deals every 4 seconds

    return () => clearInterval(interval);
  }, [api]);

  if (error) {
    // Fail silently on error as per requirements
    return null;
  }

  if (!loading && deals.length === 0) {
    // If no deals are active, fail silently on homepage
    return null;
  }

  // Display all deals in the carousel loop
  const displayDeals = deals;
  const hasMore = deals.length > 6;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24">
      <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Today's Deals
            </h2>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold tracking-wide text-emerald-600 ring-1 ring-emerald-600/10">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              LIVE
            </span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Updated daily — prices subject to availability
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {hasMore && (
            <Link
              to="/deals"
              className="group hidden items-center gap-1 text-sm font-semibold text-primary transition-colors hover:text-primary/80 sm:flex"
            >
              View All Deals
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
          )}
          
          {/* Carousel Navigation Buttons */}
          {!loading && displayDeals.length > 1 && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => api?.scrollPrev()}
                className="grid h-9 w-9 place-items-center rounded-full border border-border bg-white text-muted-foreground hover:bg-secondary hover:text-primary transition shadow-sm hover:cursor-pointer"
                aria-label="Previous deal"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => api?.scrollNext()}
                className="grid h-9 w-9 place-items-center rounded-full border border-border bg-white text-muted-foreground hover:bg-secondary hover:text-primary transition shadow-sm hover:cursor-pointer"
                aria-label="Next deal"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
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
      ) : (
        <Carousel opts={{ loop: true }} setApi={setApi} className="w-full">
          <CarouselContent className="-ml-6">
            {displayDeals.map((deal, idx) => (
              <CarouselItem key={`${deal.route_from_code}-${deal.route_to_code}-${idx}`} className="pl-6 sm:basis-1/2 lg:basis-1/3">
                <div className="h-full py-1">
                  <DealCard deal={deal} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      )}

      {hasMore && (
        <div className="mt-8 sm:hidden">
          <Link
            to="/deals"
            className="flex w-full items-center justify-center gap-2 rounded-md bg-secondary px-4 py-3 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-secondary/80"
          >
            View All Deals →
          </Link>
        </div>
      )}
    </section>
  );
}
