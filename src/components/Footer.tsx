import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, MapPin, Mail, Phone, Plane } from "lucide-react";
import { ADDRESS, EMAIL, PHONE_DISPLAY } from "@/lib/whatsapp";
import { useBookingDialog } from "@/components/BookingDialog";

export function Footer() {
  const { openBooking } = useBookingDialog();
  return (
    <footer className="mt-20 bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <img src="/seabird_logo (1).png" alt="Seabird Travel Logo" className="h-10 w-auto" />
            <span className="text-lg font-bold">Seabird Travel</span>
          </div>
          <p className="mt-4 text-sm text-primary-foreground/75">
            Taking you wherever you need to be. A Canadian travel agency based in Edmonton.
          </p>
          <div className="mt-4 flex gap-3">
            <a href="https://www.facebook.com/Seabirdtravel.ca/" target="_blank" rel="noreferrer" aria-label="Facebook"
              className="grid h-9 w-9 place-items-center rounded-full bg-white/10 hover:bg-accent hover:text-accent-foreground">
              <Facebook className="h-4 w-4" />
            </a>
            <a href="https://www.instagram.com/seabird__travel/" target="_blank" rel="noreferrer" aria-label="Instagram"
              className="grid h-9 w-9 place-items-center rounded-full bg-white/10 hover:bg-accent hover:text-accent-foreground">
              <Instagram className="h-4 w-4" />
            </a>
            <a href="https://www.pinterest.ca/seabirdtravelcanada/" target="_blank" rel="noreferrer" aria-label="Pinterest"
              className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-sm font-bold hover:bg-accent hover:text-accent-foreground">
              P
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-accent">Quick Links</h4>
          <ul className="mt-4 space-y-2 text-sm text-primary-foreground/80">
            <li><Link to="/deals" className="hover:text-accent">Today's Deals</Link></li>
            <li><Link to="/flights" className="hover:text-accent">Flights</Link></li>
            <li><Link to="/hotels" className="hover:text-accent">Hotels</Link></li>
            <li><Link to="/destinations/$slug" params={{ slug: "canada-west-coast" }} className="hover:text-accent">Canada West Coast</Link></li>
            <li><Link to="/destinations/$slug" params={{ slug: "india" }} className="hover:text-accent">India Tours</Link></li>
            <li><Link to="/destinations/$slug" params={{ slug: "us" }} className="hover:text-accent">US Tours</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-accent">Support</h4>
          <ul className="mt-4 space-y-2 text-sm text-primary-foreground/80">
            <li><Link to="/about" className="hover:text-accent">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-accent">Contact</Link></li>
            <li>
              <button 
                onClick={() => openBooking({ type: "general" })} 
                className="hover:text-accent hover:cursor-pointer bg-transparent border-none p-0 text-left font-normal text-sm"
              >
                Submit Enquiry
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-accent">Get in Touch</h4>
          <ul className="mt-4 space-y-3 text-sm text-primary-foreground/80">
            <li className="flex gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />{ADDRESS}</li>
            <li className="flex gap-2"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent" /><a href={`mailto:${EMAIL}`} className="hover:text-accent">{EMAIL}</a></li>
            <li className="flex gap-2"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-accent" /><a href={`tel:+${PHONE_DISPLAY.replace(/\D/g, "")}`} className="hover:text-accent">{PHONE_DISPLAY}</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-primary-foreground/60 sm:flex-row sm:px-6">
          <span>© {new Date().getFullYear()} Seabird Travel. All rights reserved.</span>
          <span>Lead-generation site. All bookings handled by our team.</span>
        </div>
      </div>
    </footer>
  );
}
