import { Calendar } from "lucide-react";
import { useBookingDialog, BookingType } from "@/components/BookingDialog";

export function EnquireButton({ 
  message, 
  variant = "primary", 
  className = "",
  tripType = "general",
  destination = ""
}: { 
  message: string; 
  variant?: "primary" | "accent" | "outline"; 
  className?: string;
  tripType?: BookingType;
  destination?: string;
}) {
  const { openBooking } = useBookingDialog();
  const base = "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition hover:cursor-pointer";
  const styles = {
    primary: "bg-primary text-primary-foreground hover:bg-primary-dark",
    accent: "bg-accent text-accent-foreground hover:bg-accent-dark",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground",
  }[variant];
  return (
    <button 
      onClick={() => openBooking({ 
        type: tripType, 
        to: destination,
        details: message 
      })} 
      className={`${base} ${styles} ${className}`}
    >
      <Calendar className="h-4 w-4" /> Enquire Now
    </button>
  );
}
