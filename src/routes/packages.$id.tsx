import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { packages } from "@/data/packages";
import { EnquireButton } from "@/components/EnquireButton";
import { Check, X, Calendar, MapPin } from "lucide-react";
import { useBookingDialog } from "@/components/BookingDialog";

export const Route = createFileRoute("/packages/$id")({
  head: ({ params }) => {
    const pkg = packages.find((p) => p.id === params.id);
    return {
      meta: [
        { title: `${pkg?.title ?? "Package"} — Seabird Travel` },
        { name: "description", content: `${pkg?.title ?? "Travel package"} · ${pkg?.duration ?? ""} · From $${pkg?.price ?? ""} CAD` },
        { property: "og:title", content: pkg?.title ?? "Travel Package" },
        { property: "og:description", content: pkg?.highlights.join(" · ") ?? "" },
        ...(pkg ? [{ property: "og:image", content: pkg.image }] : []),
      ],
    };
  },
  loader: ({ params }) => {
    const pkg = packages.find((p) => p.id === params.id);
    if (!pkg) throw notFound();
    return { pkg };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="text-3xl font-bold">Package not found</h1>
      <Link to="/" className="mt-4 inline-block text-primary underline">Back home</Link>
    </div>
  ),
  component: PackageDetail,
});

function PackageDetail() {
  const { openBooking } = useBookingDialog();
  const { id } = Route.useParams();
  const pkg = packages.find((p) => p.id === id)!;
  const gallery = pkg.gallery.length ? pkg.gallery : [pkg.image];

  return (
    <article className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="grid gap-3 sm:grid-cols-3 sm:gap-3">
        <img src={gallery[0]} alt={pkg.title} className="h-64 w-full rounded-3xl object-cover sm:col-span-2 sm:h-96" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-1">
          {gallery.slice(1, 3).concat([gallery[0], gallery[0]]).slice(0, 2).map((g, i) => (
            <img key={i} src={g} alt="" className="h-32 w-full rounded-2xl object-cover sm:h-[186px]" />
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-dark">Tour Package</div>
          <h1 className="mt-1 text-3xl font-bold sm:text-4xl">{pkg.title}</h1>
          <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-primary" /> {pkg.duration}</span>
            <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-primary" /> {pkg.destination.replace(/-/g, " ")}</span>
          </div>

          <section className="mt-8">
            <h2 className="text-xl font-bold">Highlights</h2>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {pkg.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2 rounded-xl bg-secondary/50 p-3 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{h}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-10">
            <h2 className="text-xl font-bold">Day-by-day Itinerary</h2>
            <p className="mt-1 text-xs text-muted-foreground">SAMPLE structure — final itinerary confirmed with your travel consultant.</p>
            <ol className="mt-4 space-y-3">
              {pkg.itinerary.map((d) => (
                <li key={d.day} className="flex gap-4 rounded-2xl bg-card p-4 shadow-card ring-1 ring-border">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
                    <div className="text-[10px] uppercase tracking-wider">Day</div>
                    <div className="text-base font-bold leading-none">{d.day}</div>
                  </div>
                  <div>
                    <div className="text-sm font-bold">{d.title}</div>
                    <p className="mt-0.5 text-sm text-muted-foreground">{d.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="mt-10 grid gap-6 sm:grid-cols-2">
            <div>
              <h2 className="text-xl font-bold text-primary">Inclusions</h2>
              <ul className="mt-3 space-y-2 text-sm">
                {pkg.inclusions.map((i) => (
                  <li key={i} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 text-primary" />{i}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-bold text-destructive">Exclusions</h2>
              <ul className="mt-3 space-y-2 text-sm">
                {pkg.exclusions.map((i) => (
                  <li key={i} className="flex items-start gap-2"><X className="mt-0.5 h-4 w-4 text-destructive" />{i}</li>
                ))}
              </ul>
            </div>
          </section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl bg-card p-6 shadow-elevated ring-1 ring-border">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Starting from*</div>
            <div className="text-4xl font-bold text-primary">${pkg.price}<span className="text-sm font-medium text-muted-foreground"> CAD</span></div>
            <div className="text-xs text-muted-foreground">per person · {pkg.duration}</div>

            <div className="mt-5 space-y-2">
              <EnquireButton message={`Hi Seabird Travel, I'd like details on ${pkg.title} (${pkg.duration}).`} variant="accent" className="w-full" />
              <button
                onClick={() => openBooking({
                  type: "packages",
                  to: pkg.destination,
                  details: `Hi Seabird Travel, please call me back about ${pkg.title}.`
                })}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-primary px-5 py-2.5 text-sm font-semibold text-primary hover:bg-primary hover:text-primary-foreground hover:cursor-pointer transition"
              >
                Request Callback
              </button>
            </div>
            <p className="mt-4 text-[11px] text-muted-foreground">* Sample placeholder price. Final quote confirmed by our team.</p>
          </div>
        </aside>
      </div>
    </article>
  );
}
