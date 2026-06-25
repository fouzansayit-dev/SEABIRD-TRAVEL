import React, { createContext, useContext, useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Check, Calendar, Users, MapPin, Mail, Phone, Plane, ClipboardCheck, ArrowRight, MessageSquare, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { sendEnquiryEmail } from "@/lib/email";

export type BookingType = "flights" | "hotels" | "packages" | "visas" | "general";
export type ContactMethod = "email" | "phone" | "whatsapp" | "sms";

export interface BookingDetails {
  type: BookingType;
  from?: string;
  to?: string;
  departureDate?: string;
  returnDate?: string;
  adults?: number;
  children?: number;
  infants?: number;
  cabinClass?: string;
  details?: string;
}

interface BookingDialogContextType {
  isOpen: boolean;
  prefilled: BookingDetails | null;
  openBooking: (details?: Partial<BookingDetails>) => void;
  closeBooking: () => void;
}

const BookingDialogContext = createContext<BookingDialogContextType | undefined>(undefined);

export function useBookingDialog() {
  const context = useContext(BookingDialogContext);
  if (!context) {
    throw new Error("useBookingDialog must be used within a BookingDialogProvider");
  }
  return context;
}

export function BookingDialogProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [prefilled, setPrefilled] = useState<BookingDetails | null>(null);

  const openBooking = (details?: Partial<BookingDetails>) => {
    const defaultDetails: BookingDetails = {
      type: "general",
      adults: 1,
      children: 0,
      infants: 0,
      cabinClass: "Economy",
      ...details,
    };
    setPrefilled(defaultDetails);
    setIsOpen(true);
  };

  const closeBooking = () => {
    setIsOpen(false);
    setPrefilled(null);
  };

  return (
    <BookingDialogContext.Provider value={{ isOpen, prefilled, openBooking, closeBooking }}>
      {children}
      <BookingDialog />
    </BookingDialogContext.Provider>
  );
}

function BookingDialog() {
  const { isOpen, prefilled, closeBooking } = useBookingDialog();
  const [submitted, setSubmitted] = useState(false);
  const [refNumber, setRefNumber] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [preferredContact, setPreferredContact] = useState<ContactMethod>("email");
  
  // Trip details states (prefilled or custom)
  const [type, setType] = useState<BookingType>("general");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [cabinClass, setCabinClass] = useState("Economy");
  const [details, setDetails] = useState("");

  // Sync state when prefilled changes
  useEffect(() => {
    if (prefilled) {
      setType(prefilled.type);
      setFrom(prefilled.from || "");
      setTo(prefilled.to || "");
      setDepartureDate(prefilled.departureDate || "");
      setReturnDate(prefilled.returnDate || "");
      setAdults(prefilled.adults || 1);
      setChildren(prefilled.children || 0);
      setInfants(prefilled.infants || 0);
      setCabinClass(prefilled.cabinClass || "Economy");
      setDetails(prefilled.details || "");
      setSubmitted(false);
      setErrors({});
    }
  }, [prefilled, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Full name is required";
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (phone.replace(/\D/g, "").length < 10) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please correct the errors in the form.", {
        position: "top-center",
      });
      return;
    }

    setSending(true);
    const ref = "SBT-" + Math.floor(100000 + Math.random() * 900000);

    let detailsText = `• Service requested: ${type.toUpperCase()}`;
    if (from || to) {
      detailsText += `\n• Route: ${from ? `${from} → ` : ""}${to}`;
    }
    if (departureDate) {
      detailsText += `\n• Departure: ${departureDate}`;
    }
    if (returnDate) {
      detailsText += `\n• Return: ${returnDate}`;
    }
    detailsText += `\n• Passengers: ${adults} Adult(s)`;
    if (children > 0) detailsText += `, ${children} Child(ren)`;
    if (infants > 0) detailsText += `, ${infants} Infant(s)`;
    if (type === "flights") {
      detailsText += `\n• Cabin: ${cabinClass}`;
    }
    if (details.trim()) {
      detailsText += `\n\n• Additional Notes:\n${details}`;
    }

    try {
      const res = await sendEnquiryEmail({
        data: {
          name,
          email,
          phone,
          subject: `New booking request: ${type.toUpperCase()} enquiry from ${name}`,
          type: `Booking Popup - ${type}`,
          details: detailsText,
          refNumber: ref,
          preferredContact,
        }
      });

      if (res.success) {
        setRefNumber(ref);
        setSubmitted(true);
        toast.success("Enquiry submitted successfully!", {
          description: `Your reference code is ${ref}`,
          position: "top-center",
        });
      } else {
        toast.error(res.error || "Failed to submit enquiry. Please try again.", {
          position: "top-center",
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred while sending.", {
        position: "top-center",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeBooking()}>
      <DialogContent className="max-h-[92vh] w-[95%] max-w-2xl overflow-y-auto rounded-3xl bg-white p-0 shadow-elevated border-none select-none">
        
        {submitted ? (
          <div className="flex flex-col items-center justify-center p-8 text-center sm:p-12 animate-in fade-in-50 zoom-in-95 duration-300">
            <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-accent/10 text-accent">
              <div className="absolute inset-0 rounded-full bg-accent/20 animate-ping opacity-75 duration-1000" />
              <ClipboardCheck className="h-10 w-10 text-accent" />
            </div>
            
            <DialogTitle className="text-2xl font-bold text-primary sm:text-3xl">
              Thank you, {name}!
            </DialogTitle>
            <DialogDescription className="mt-2 text-base text-muted-foreground max-w-md">
              Your travel enquiry has been securely logged with Seabird Travel. 
              Our travel specialists are already looking into options for you.
            </DialogDescription>

            <div className="mt-8 w-full max-w-md rounded-2xl bg-secondary/50 border border-border/80 p-5 text-left">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Inquiry Reference</span>
                <span className="font-mono text-sm font-bold text-primary bg-white px-2.5 py-1 rounded-md border border-border shadow-sm">
                  {refNumber}
                </span>
              </div>
              <div className="mt-3 space-y-2 text-sm text-foreground/80">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Requested Service:</span>
                  <span className="font-semibold capitalize">{type}</span>
                </div>
                {(from || to) && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Route/Destination:</span>
                    <span className="font-semibold">{from ? `${from} → ` : ""}{to}</span>
                  </div>
                )}
                {departureDate && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Travel Date:</span>
                    <span className="font-semibold">{departureDate}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Contact Channel:</span>
                  <span className="font-semibold capitalize">{preferredContact}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col items-center gap-3">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <ClockIcon className="h-4 w-4 text-accent" /> Our team will contact you within 2-4 hours.
              </div>
              <Button onClick={closeBooking} className="mt-2 rounded-full px-8 bg-primary hover:bg-primary-dark">
                Close Window
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col">
            <div className="p-6 pb-0 sm:p-8 sm:pb-0">
              <DialogHeader className="text-left">
                <DialogTitle className="text-2xl font-bold text-primary flex items-center gap-2">
                  <Plane className="h-6 w-6 text-accent -rotate-12" /> Complete Your Booking Enquiry
                </DialogTitle>
                <DialogDescription className="mt-1 text-sm text-muted-foreground">
                  Fill in your details below. Our Edmonton team will research the best prices and options, and reach out directly.
                </DialogDescription>
              </DialogHeader>
            </div>

            <div className="space-y-6 p-6 sm:p-8">
              {/* SECTION 1: Contact Details */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-accent border-b border-border pb-1.5 flex items-center gap-1.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/10 text-[10px] text-accent">1</span>
                  Contact Information
                </h3>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Full Name *
                    </Label>
                    <div className="relative">
                      <Input
                        required
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className={`rounded-xl bg-secondary/30 ${errors.name ? "border-destructive focus-visible:ring-destructive/20" : ""}`}
                      />
                      {errors.name && (
                        <span className="mt-1 flex items-center gap-1 text-[11px] text-destructive">
                          <AlertCircle className="h-3 w-3" /> {errors.name}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Phone Number *
                    </Label>
                    <div className="relative">
                      <Input
                        required
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. 587-788-2222"
                        className={`rounded-xl bg-secondary/30 ${errors.phone ? "border-destructive focus-visible:ring-destructive/20" : ""}`}
                      />
                      {errors.phone && (
                        <span className="mt-1 flex items-center gap-1 text-[11px] text-destructive">
                          <AlertCircle className="h-3 w-3" /> {errors.phone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Email Address *
                    </Label>
                    <div className="relative">
                      <Input
                        required
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        className={`rounded-xl bg-secondary/30 ${errors.email ? "border-destructive focus-visible:ring-destructive/20" : ""}`}
                      />
                      {errors.email && (
                        <span className="mt-1 flex items-center gap-1 text-[11px] text-destructive">
                          <AlertCircle className="h-3 w-3" /> {errors.email}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      How should we reach you?
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      {(["email", "phone", "whatsapp", "sms"] as ContactMethod[]).map((method) => (
                        <button
                          key={method}
                          type="button"
                          onClick={() => setPreferredContact(method)}
                          className={`flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold capitalize transition ${
                            preferredContact === method
                              ? "border-primary bg-primary/5 text-primary"
                              : "border-border bg-white text-muted-foreground hover:bg-secondary/40"
                          }`}
                        >
                          {method === "email" && <Mail className="h-3.5 w-3.5" />}
                          {method === "phone" && <Phone className="h-3.5 w-3.5" />}
                          {method === "whatsapp" && <MessageSquare className="h-3.5 w-3.5" />}
                          {method === "sms" && <MessageSquare className="h-3.5 w-3.5 text-orange-500" />}
                          {method}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: Trip Details */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-accent border-b border-border pb-1.5 flex items-center gap-1.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/10 text-[10px] text-accent">2</span>
                  Travel Preferences
                </h3>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="type" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Service Type
                    </Label>
                    <select
                      id="type"
                      value={type}
                      onChange={(e) => setType(e.target.value as BookingType)}
                      className="w-full rounded-xl border border-border bg-secondary/30 px-3 py-2.5 text-sm font-medium outline-none transition focus:border-primary"
                    >
                      <option value="flights">Flights Only</option>
                      <option value="hotels">Hotels Only</option>
                      <option value="packages">Tour Packages</option>
                      <option value="visas">Visa Inquiries</option>
                      <option value="general">General Custom Travel</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Travellers
                    </Label>
                    <div className="flex h-[42px] items-center justify-between rounded-xl border border-border bg-secondary/30 px-3 text-sm">
                      <div className="flex items-center gap-1 text-xs">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{adults} Ad · {children} Ch · {infants} Inf</span>
                      </div>
                      <div className="flex gap-1.5">
                        <button type="button" onClick={() => setAdults(Math.max(1, adults - 1))} className="h-6 w-6 rounded-full bg-white border flex items-center justify-center font-bold text-xs">-</button>
                        <button type="button" onClick={() => setAdults(adults + 1)} className="h-6 w-6 rounded-full bg-white border flex items-center justify-center font-bold text-xs">+</button>
                        {type !== "hotels" && type !== "visas" && (
                          <>
                            <button type="button" onClick={() => setChildren(Math.max(0, children - 1))} className="h-6 w-6 rounded-full bg-white border flex items-center justify-center font-bold text-xs text-blue-500">c-</button>
                            <button type="button" onClick={() => setChildren(children + 1)} className="h-6 w-6 rounded-full bg-white border flex items-center justify-center font-bold text-xs text-blue-500">c+</button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="from" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Departure City / Airport
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-[13px] h-4 w-4 text-muted-foreground" />
                      <Input
                        id="from"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                        placeholder="e.g. Edmonton (YEG)"
                        className="rounded-xl bg-secondary/30 pl-9"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="to" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Destination City / Country
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-[13px] h-4 w-4 text-muted-foreground" />
                      <Input
                        id="to"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        placeholder="e.g. Delhi, London, Maui"
                        className="rounded-xl bg-secondary/30 pl-9"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="departureDate" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-primary" /> Departure Date
                    </Label>
                    <Input
                      id="departureDate"
                      type="date"
                      value={departureDate}
                      onChange={(e) => setDepartureDate(e.target.value)}
                      className="rounded-xl bg-secondary/30"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="returnDate" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-primary" /> Return Date (Optional)
                    </Label>
                    <Input
                      id="returnDate"
                      type="date"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="rounded-xl bg-secondary/30"
                    />
                  </div>
                </div>

                {type === "flights" && (
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Cabin Class
                    </Label>
                    <div className="grid grid-cols-4 gap-2">
                      {["Economy", "Premium Economy", "Business", "First"].map((cls) => (
                        <button
                          key={cls}
                          type="button"
                          onClick={() => setCabinClass(cls)}
                          className={`rounded-xl border py-2 text-xs font-semibold transition ${
                            cabinClass === cls
                              ? "border-primary bg-primary/5 text-primary"
                              : "border-border bg-white text-muted-foreground hover:bg-secondary/40"
                          }`}
                        >
                          {cls}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label htmlFor="details" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Additional Requirements or Special Notes
                  </Label>
                  <Textarea
                    id="details"
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    placeholder="Enter any other requirements (e.g. visa assistance, specific hotels, dietary plans, airlines preference...)"
                    rows={3}
                    className="rounded-xl bg-secondary/30 resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-border p-6 bg-secondary/20 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 rounded-b-3xl">
              <Button type="button" variant="outline" onClick={closeBooking} className="rounded-full px-6 border-border text-foreground/80">
                Cancel
              </Button>
              <Button type="submit" disabled={sending} className="rounded-full px-8 bg-accent text-accent-foreground font-bold hover:bg-accent-dark shadow-sm disabled:opacity-50">
                {sending ? "Submitting..." : "Submit Booking Request"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

function ClockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
