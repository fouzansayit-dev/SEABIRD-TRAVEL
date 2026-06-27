import { Calendar } from "lucide-react";
import { useBookingDialog } from "@/components/BookingDialog";

export function BookingFab() {
  const { openBooking } = useBookingDialog();

  return (
    <button
      onClick={() => openBooking({ type: "general" })}
      aria-label="Book a Trip"
      className="fixed bottom-5 right-24 z-50 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground shadow-elevated transition hover:scale-105 hover:bg-accent-dark hover:cursor-pointer group"
    >
      <Calendar className="h-5 w-5 transition-transform group-hover:rotate-12" />
      <span className="hidden sm:inline">Book a Trip</span>
    </button>
  );
}
