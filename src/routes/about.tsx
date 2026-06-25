import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, Sparkles, Users, Globe } from "lucide-react";
import { EnquireButton } from "@/components/EnquireButton";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Seabird Travel — Edmonton Travel Agency" },
      { name: "description", content: "Seabird Travel is a Canadian travel agency in Edmonton, Alberta. Learn about our mission to make travel accessible and seamless." },
      { property: "og:title", content: "About Seabird Travel" },
      { property: "og:description", content: "A team of passionate travel enthusiasts based in Edmonton, Canada." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-primary py-20 text-primary-foreground">
        <img src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1800&q=80" alt="" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-25" />
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">About Seabird Travel</div>
          <h1 className="mt-3 text-4xl font-bold sm:text-5xl">Travel made easier, faster, and more affordable</h1>
          <p className="mt-4 text-lg text-primary-foreground/85">
            Seabird Travel was founded with a simple mission: to make flight booking easier, faster, and more affordable for everyone. We are a team of passionate travel enthusiasts and tech wizards who believe that the journey should start with a smooth booking experience.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-dark">Our Mission</div>
            <h2 className="mt-2 text-3xl font-bold">Travel accessible to everyone</h2>
            <p className="mt-4 text-muted-foreground">
              To make travel accessible to everyone by providing a seamless booking experience and exceptional customer service. From last-minute flights out of Edmonton to multi-week itineraries across India, the US and Europe — we plan it like it's our own trip.
            </p>
            <div className="mt-6">
              <EnquireButton message="Hi Seabird Travel, I'd like to chat about a trip." />
            </div>
          </div>
          <div className="overflow-hidden rounded-3xl shadow-elevated ring-1 ring-border">
            <img src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&q=80" alt="Seabird Travel" className="h-80 w-full object-cover" />
          </div>
        </div>
      </section>

      <section className="bg-secondary/50 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="text-center text-3xl font-bold">Why Choose Us</h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: ShieldCheck, title: "Customer Satisfaction", desc: "Every itinerary is built around your needs, your pace, your budget." },
              { icon: Sparkles, title: "Innovation", desc: "We blend modern tech with old-school personal service for the best of both." },
              { icon: Users, title: "Personal Team", desc: "Real travel experts in Edmonton, not chatbots." },
              { icon: Globe, title: "Global Reach", desc: "Partners and fares across six continents." },
            ].map((it) => (
              <div key={it.title} className="rounded-2xl bg-card p-6 shadow-card ring-1 ring-border">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary text-primary-foreground"><it.icon className="h-5 w-5" /></span>
                <div className="mt-4 text-base font-bold">{it.title}</div>
                <p className="mt-1 text-sm text-muted-foreground">{it.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
