import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X, ArrowRight } from "lucide-react";
import { useBookingDialog } from "./BookingDialog";
import popupBanner from "../../pop-up banners/seabird_pop-up-r.png";

export function PopupBanner() {
  const [isOpen, setIsOpen] = React.useState(false);
  const { openBooking } = useBookingDialog();

  React.useEffect(() => {
    // Only show the pop-up once per browser session to prevent annoying the user
    const hasBeenShown = sessionStorage.getItem("seabird_popup_shown");
    if (!hasBeenShown) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem("seabird_popup_shown", "true");
      }, 1500); // 1.5 seconds delay after load for smoother UX
      return () => clearTimeout(timer);
    }
  }, []);

  const handleBannerClick = () => {
    setIsOpen(false);
    openBooking({
      type: "general",
      details: "Hi Seabird Travel, I saw your special pop-up offer and would like to learn more about flight and package deals."
    });
  };

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
      <DialogPrimitive.Portal>
        {/* Dark overlay backdrop without blur effect */}
        <DialogPrimitive.Overlay className="fixed inset-0 z-[100] bg-black/75 transition-opacity duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        
        {/* Modal content container */}
        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-[101] w-[90%] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-transparent outline-none transition-all duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 focus:outline-none">
          <div className="relative group overflow-hidden rounded-3xl shadow-elevated border border-white/10 bg-black/10">
            {/* The clickable banner image button */}
            <button
              onClick={handleBannerClick}
              className="relative block w-full overflow-hidden focus:outline-none hover:cursor-pointer transition-transform duration-500 hover:scale-[1.01]"
              aria-label="Promotional banner. Click to enquire about this offer."
            >
              <img
                src={popupBanner}
                alt="Seabird Special Promotion"
                className="w-full h-auto object-cover max-h-[75vh] select-none rounded-3xl"
              />
              
              {/* Overlay gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Interactive badge/CTA that rises on hover */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground font-bold px-6 py-3 rounded-full hover:bg-accent-dark transition-all duration-300 shadow-lg flex items-center gap-2 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 text-xs sm:text-sm">
                Enquire Now
                <ArrowRight className="h-4 w-4" />
              </div>
            </button>

            {/* Custom Premium Close Button */}
            <DialogPrimitive.Close className="absolute top-4 right-4 z-[102] flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary border border-border shadow-lg hover:bg-accent hover:text-accent-foreground hover:scale-105 hover:cursor-pointer transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
