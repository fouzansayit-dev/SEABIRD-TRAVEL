import { createFileRoute, notFound } from "@tanstack/react-router";
import { destinations, packages } from "@/data/packages";
import { PackageCard, SectionHeader } from "@/routes/index";
import { EnquireButton } from "@/components/EnquireButton";

export const Route = createFileRoute("/destinations/$slug")({
  head: ({ params }) => {
    const dest = destinations.find((d) => d.slug === params.slug);
    const name = dest?.name ?? "Destination";
    return {
      meta: [
        { title: `${name} Tours — Seabird Travel` },
        { name: "description", content: `${name} travel packages from Seabird Travel. ${dest?.tagline ?? ""}` },
        { property: "og:title", content: `${name} Tours — Seabird Travel` },
        { property: "og:description", content: dest?.tagline ?? "Curated tour packages." },
        ...(dest ? [{ property: "og:image", content: dest.image }] : []),
      ],
    };
  },
  loader: ({ params }) => {
    const dest = destinations.find((d) => d.slug === params.slug);
    if (!dest) throw notFound();
    return { dest };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="text-3xl font-bold">Destination not found</h1>
      <p className="mt-2 text-muted-foreground">Try one of our featured destinations from the homepage.</p>
    </div>
  ),
  component: DestinationPage,
});

function DestinationPage() {
  const { slug } = Route.useParams();
  const dest = destinations.find((d) => d.slug === slug)!;
  const list = packages.filter((p) => p.destination === dest.slug);

  return (
    <>
      <section className="relative isolate overflow-hidden">
        <img src={dest.image} alt={dest.name} className="absolute inset-0 -z-10 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-primary-dark via-primary/70 to-primary/30" />
        <div className="mx-auto max-w-7xl px-4 py-24 text-primary-foreground sm:px-6">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Destination</div>
          <h1 className="mt-2 text-4xl font-bold sm:text-5xl">{dest.name}</h1>
          <p className="mt-2 max-w-xl text-lg text-primary-foreground/85">{dest.tagline}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <SectionHeader eyebrow="Featured" title={`${list.length} curated ${list.length === 1 ? "package" : "packages"}`} />
        {list.length === 0 ? (
          <p className="mt-8 text-muted-foreground">More itineraries coming soon — get in touch and we'll build one for you.</p>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((p) => <PackageCard key={p.id} pkg={p} />)}
          </div>
        )}

        <div className="mt-12 rounded-3xl bg-secondary/50 p-8 text-center">
          <h3 className="text-2xl font-bold">Want a custom {dest.name} itinerary?</h3>
          <p className="mt-1 text-muted-foreground">Tell us your dates and preferences — we'll build it from scratch.</p>
          <div className="mt-5 flex justify-center">
            <EnquireButton message={`Hi Seabird Travel, I'd like a custom ${dest.name} itinerary.`} variant="accent" />
          </div>
        </div>
      </section>
    </>
  );
}
