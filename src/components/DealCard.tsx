import { Deal } from "@/config/dealsSheet";
import { format, parseISO } from "date-fns";
import { Calendar, Luggage, Info, ClipboardList } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useBookingDialog } from "@/components/BookingDialog";

interface DealCardProps {
  deal: Deal;
}

export function DealCard({ deal }: DealCardProps) {
  const { openBooking } = useBookingDialog();
  // Format dates nicely, handle potential parse errors
  const formatDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), 'MMM dd, yyyy');
    } catch {
      return dateStr;
    }
  };

  const validFromFormatted = formatDate(deal.valid_from);
  const validToFormatted = formatDate(deal.valid_to);

  const routeStr = `${deal.route_from_city} → ${deal.route_via_code ? `${deal.route_via_code} → ` : ''}${deal.route_to_city}`;
  
  const whatsappMsg = `Hi Seabird Travel, I'm interested in the ${deal.route_from_city} → ${deal.route_to_city} deal (${deal.valid_from} to ${deal.valid_to}, $${deal.price_cad} CAD).`;

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-white text-card-foreground shadow-card hover:shadow-elevated hover:border-primary/20 hover:-translate-y-1 transition-all duration-300 h-full">
      {deal.poster_image_url && (
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
          <img 
            src={deal.poster_image_url} 
            alt={`Deal to ${deal.route_to_city}`} 
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute left-3 top-3">
            <Badge variant="secondary" className="bg-white/90 backdrop-blur font-semibold text-primary px-2.5 py-1 text-xs">
              {deal.trip_type}
            </Badge>
          </div>
        </div>
      )}
      
      <div className="flex flex-1 flex-col p-6">
        {!deal.poster_image_url && (
           <div className="mb-3">
             <Badge variant="secondary" className="bg-secondary/80 text-primary font-semibold px-2.5 py-1 text-xs">
               {deal.trip_type}
             </Badge>
           </div>
        )}
        
        <div className="mb-4">
          <h3 className="font-bold text-lg leading-tight line-clamp-2 text-foreground group-hover:text-primary transition-colors">
            {routeStr}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground font-semibold uppercase tracking-wider">
            {deal.route_from_code} → {deal.route_to_code}
          </p>
        </div>

        <div className="space-y-2.5 mb-6 text-sm text-muted-foreground/90 flex-1">
          <div className="flex items-center gap-2.5">
            <Calendar className="h-4 w-4 shrink-0 text-primary/75" />
            <span className="font-medium text-foreground/80">{validFromFormatted} – {validToFormatted}</span>
          </div>
          {deal.baggage && (
            <div className="flex items-center gap-2.5">
              <Luggage className="h-4 w-4 shrink-0 text-primary/75" />
              <span className="font-medium text-foreground/80">{deal.baggage}</span>
            </div>
          )}
          {deal.transit_note && (
            <div className="flex items-center gap-2.5">
              <Info className="h-4 w-4 shrink-0 text-primary/75" />
              <span className="font-medium text-foreground/80">{deal.transit_note}</span>
            </div>
          )}
        </div>

        <div className="mt-auto border-t border-border/80 pt-4 flex items-center justify-between gap-4">
          <div>
            <div className="text-2xl font-extrabold text-primary font-display tracking-tight">
              ${deal.price_cad}<span className="text-xs font-semibold text-muted-foreground ml-1">CAD</span>
            </div>
            <div className="text-[10px] text-muted-foreground mt-0.5 font-medium">
              *Per adult, subject to availability
            </div>
          </div>
          
          <button
            onClick={() => openBooking({
              type: "flights",
              from: deal.route_from_city,
              to: deal.route_to_city,
              departureDate: deal.valid_from,
              returnDate: deal.valid_to,
              details: `Hi Seabird Travel, I'm interested in the flight deal: ${deal.route_from_city} (${deal.route_from_code}) to ${deal.route_to_city} (${deal.route_to_code}) priced at $${deal.price_cad} CAD.`
            })}
            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-accent px-5 py-2.5 text-xs font-bold text-accent-foreground shadow-sm transition hover:bg-accent-dark hover:cursor-pointer"
          >
            <ClipboardList className="h-3.5 w-3.5" />
            Enquire Now
          </button>
        </div>
      </div>
    </div>
  );
}
