import { createFileRoute } from "@tanstack/react-router";
import { SearchWidget } from "@/components/SearchWidget";
import { RouteCard, SectionHeader } from "@/routes/index";
import { routes, airlines } from "@/data/routes";

export const Route = createFileRoute("/flights")({
  head: () => ({
    meta: [
      { title: "Flight Deals from Canada — Seabird Travel" },
      { name: "description", content: "Search and enquire about flights from Edmonton, Calgary, Toronto and across Canada with Seabird Travel." },
      { property: "og:title", content: "Flight Deals from Canada — Seabird Travel" },
      { property: "og:description", content: "Curated international flight deals handled personally by Seabird Travel." },
    ],
  }),
  component: FlightsPage,
});

function FlightsPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-primary-dark via-primary to-primary-dark py-12 text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h1 className="text-3xl font-bold sm:text-4xl">Find your next flight</h1>
          <p className="mt-2 max-w-2xl text-primary-foreground/85">Tell us where you want to go — our team finds the best fares and contacts you directly.</p>
          <div className="mt-6">
            <SearchWidget defaultTab="flights" />
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-background py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Popular Airlines We Work With</div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {airlines.map((a) => (
              <div key={a} className="text-sm font-semibold tracking-wide text-muted-foreground/70 transition hover:text-primary">
                {a}
              </div>
            ))}
          </div>
          <p className="mt-3 text-center text-[11px] text-muted-foreground/60">Logos shown for trust signal only. Not affiliated, no live booking integration.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <SectionHeader eyebrow="Top Routes" title="Popular routes from Seabird travellers" />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {routes.map((r) => <RouteCard key={r.id} route={r} />)}
        </div>
        <p className="mt-4 text-xs text-muted-foreground">* Sample placeholder fares. Final pricing confirmed by our team on enquiry.</p>
      </section>
    </>
  );
}
