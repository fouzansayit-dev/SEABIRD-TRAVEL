import { createFileRoute } from "@tanstack/react-router";
import { SearchWidget } from "@/components/SearchWidget";
import { SectionHeader } from "@/routes/index";
import { hotelCities } from "@/data/routes";
import { useBookingDialog } from "@/components/BookingDialog";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/hotels")({
  head: () => ({
    meta: [
      { title: "Hotel Deals — Seabird Travel" },
      { name: "description", content: "Find hotels at popular destinations worldwide with Seabird Travel. Personalized rates by our Edmonton team." },
      { property: "og:title", content: "Hotel Deals — Seabird Travel" },
      { property: "og:description", content: "Personalized hotel quotes across the world's most-loved destinations." },
    ],
  }),
  component: HotelsPage,
});

// Section structurally ready for real hotel-partner data later.
function HotelsPage() {
  const { openBooking } = useBookingDialog();
  return (
    <>
      <section className="bg-gradient-to-br from-primary-dark via-primary to-primary-dark py-12 text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h1 className="text-3xl font-bold sm:text-4xl">Hotels at the destinations you love</h1>
          <p className="mt-2 max-w-2xl text-primary-foreground/85">Personalized rates from our partner network — confirmed by our team.</p>
          <div className="mt-6">
            <SearchWidget defaultTab="hotels" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <SectionHeader eyebrow="Popular Cities" title="Book hotels at popular destinations" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {hotelCities.map((h) => (
            <button key={h.city}
              onClick={() => openBooking({
                type: "hotels",
                to: h.city,
                details: `Hi Seabird Travel, I'd like hotel options in ${h.city}.`
              })}
              className="group flex items-center gap-4 overflow-hidden rounded-2xl bg-card p-3 shadow-card ring-1 ring-border text-left hover:cursor-pointer transition hover:-translate-y-0.5 hover:shadow-elevated w-full">
              <img src={h.image} alt={h.city} className="h-24 w-28 shrink-0 rounded-xl object-cover" />
              <div className="min-w-0 flex-1">
                <div className="text-lg font-bold">{h.city}</div>
                <div className="text-xs text-muted-foreground">{h.country}</div>
                <div className="mt-1.5 text-xs text-muted-foreground">
                  Starting at <span className="text-lg font-bold text-primary">${h.from}*</span><span className="text-[11px]"> /night CAD</span>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
            </button>
          ))}
        </div>
        <p className="mt-4 text-xs text-muted-foreground">* Sample placeholder pricing — confirmed on enquiry.</p>
      </section>
    </>
  );
}
