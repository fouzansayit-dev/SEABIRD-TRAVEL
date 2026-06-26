import { Link } from "@tanstack/react-router";
import { Menu, X, Calendar, Plane } from "lucide-react";
import { useState } from "react";
import { useBookingDialog } from "@/components/BookingDialog";

const nav = [
  { to: "/", label: "Home" },
  { to: "/flights", label: "Flights" },
  { to: "/hotels", label: "Hotels" },
  { to: "/deals", label: "Deals" },
  { to: "/destinations/canada-west-coast", label: "Packages" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as any[];

export function Header() {
  const [open, setOpen] = useState(false);
  const { openBooking } = useBookingDialog();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <img src="/seabird_logo.png" alt="Seabird Travel Logo" className="h-10 w-auto" />
          <div className="flex flex-col leading-none">
            <span className="text-lg font-bold tracking-tight text-primary">Seabird Travel</span>
            <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Edmonton, Canada
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-secondary hover:text-primary"
              activeProps={{ className: "text-primary bg-secondary" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openBooking({ type: "general" })}
            className="hidden items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground shadow-sm transition hover:bg-accent-dark sm:inline-flex hover:cursor-pointer"
          >
            <Calendar className="h-4 w-4" />
            Book Now
          </button>
          <button
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-md text-foreground lg:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-4 py-3 sm:px-6">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 text-sm font-medium text-foreground/80 hover:bg-secondary"
                activeProps={{ className: "text-primary bg-secondary" }}
                activeOptions={{ exact: item.to === "/" }}
              >
                {item.label}
              </Link>
            ))}
            <button
              onClick={() => {
                openBooking({ type: "general" });
                setOpen(false);
              }}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground sm:hidden hover:cursor-pointer"
            >
              <Calendar className="h-4 w-4" /> Book Now
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
