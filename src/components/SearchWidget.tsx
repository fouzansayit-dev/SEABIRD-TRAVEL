import { useState } from "react";
import { Plane, Hotel, Package as PackageIcon, MapPin, Calendar, Users, X, Minus, Plus, Check } from "lucide-react";
import { sendEnquiryEmail } from "@/lib/email";
import { toast } from "sonner";

type Tab = "flights" | "hotels" | "packages";
type TripType = "one-way" | "round-trip" | "multicity";



export function SearchWidget({ defaultTab = "flights" }: { defaultTab?: Tab }) {
  const [tab, setTab] = useState<Tab>(defaultTab);

  return (
    <div className="rounded-3xl bg-white p-3 shadow-elevated ring-1 ring-black/5 sm:p-5">
      <div className="flex gap-1 rounded-2xl bg-secondary p-1">
        <TabBtn active={tab === "flights"} onClick={() => setTab("flights")} icon={<Plane className="h-4 w-4" />}>Flights</TabBtn>
        <TabBtn active={tab === "hotels"} onClick={() => setTab("hotels")} icon={<Hotel className="h-4 w-4" />}>Hotels</TabBtn>
        <TabBtn active={tab === "packages"} onClick={() => setTab("packages")} icon={<PackageIcon className="h-4 w-4" />}>Packages</TabBtn>
      </div>

      <div className="mt-4">
        {tab === "flights" && <FlightsForm />}
        {tab === "hotels" && <HotelsForm />}
        {tab === "packages" && <PackagesForm />}
      </div>
    </div>
  );
}

function TabBtn({ active, onClick, icon, children }: { active: boolean; onClick: () => void; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
        active ? "bg-primary text-primary-foreground shadow-sm" : "text-foreground/70 hover:text-primary"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

function Field({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <label className="block rounded-xl border border-border bg-white px-3 py-2.5 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15">
      <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {icon} {label}
      </div>
      <div className="mt-1">{children}</div>
    </label>
  );
}

function ContactDetailsModal({ 
  message, 
  onClose,
  type = "general",
  from = "",
  to = "",
  departureDate = ""
}: { 
  message: string; 
  onClose: () => void;
  type?: string;
  from?: string;
  to?: string;
  departureDate?: string;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [preferredContact, setPreferredContact] = useState<"email" | "phone" | "whatsapp" | "sms">("email");
  const [submitted, setSubmitted] = useState(false);
  const [refNumber, setRefNumber] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);

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
      newErrors.phone = "Enter a valid 10-digit phone number";
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

    try {
      const res = await sendEnquiryEmail({
        data: {
          name,
          email,
          phone,
          subject: `New search quote request: ${type.toUpperCase()} from ${name}`,
          type: `Search Widget - ${type}`,
          details: message,
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
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto" onClick={onClose}>
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-elevated border-none select-none sm:p-8 animate-in fade-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
        {submitted ? (
          <div className="flex flex-col items-center justify-center text-center py-4">
            <div className="relative mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-accent">
              <div className="absolute inset-0 rounded-full bg-accent/20 animate-ping opacity-75 duration-1000" />
              <Check className="h-8 w-8 text-accent" />
            </div>
            <h3 className="text-xl font-bold text-primary">Inquiry Submitted!</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Thanks, {name}! We have received your booking request. Our team will verify rates and contact you within 2-4 hours.
            </p>
            <div className="mt-6 w-full rounded-2xl bg-secondary/50 border p-4 text-left text-sm space-y-1.5">
              <div className="flex justify-between border-b pb-2 mb-2">
                <span className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">Reference Number</span>
                <span className="font-mono font-bold text-primary">{refNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Contact details:</span>
                <span className="font-medium text-foreground">{email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Contact via:</span>
                <span className="font-semibold capitalize text-primary">{preferredContact}</span>
              </div>
            </div>
            <button type="button" onClick={onClose} className="mt-6 w-full rounded-full bg-primary py-3 text-sm font-bold text-primary-foreground hover:bg-primary-dark hover:cursor-pointer transition">
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-primary">Provide Contact Details</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Please fill in your info to submit your enquiry.</p>
              </div>
              <button type="button" onClick={onClose} className="rounded-full p-1 hover:bg-secondary text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
            </div>

            <div className="rounded-2xl bg-secondary/30 p-3.5 border text-xs text-foreground/80 space-y-1">
              <div className="font-bold text-primary uppercase tracking-wider text-[10px]">Your Search Request</div>
              <p className="whitespace-pre-line leading-relaxed mt-1 text-muted-foreground">{message.replace("Hi Seabird Travel, ", "")}</p>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Full Name *</label>
                <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" className="w-full rounded-xl border border-border bg-secondary/10 px-3 py-2 text-sm outline-none focus:border-primary" />
                {errors.name && <span className="text-[11px] text-destructive flex items-center gap-1 mt-0.5">{errors.name}</span>}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email *</label>
                  <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" className="w-full rounded-xl border border-border bg-secondary/10 px-3 py-2 text-sm outline-none focus:border-primary" />
                  {errors.email && <span className="text-[11px] text-destructive flex items-center gap-1 mt-0.5">{errors.email}</span>}
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Phone *</label>
                  <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="587-788-2222" className="w-full rounded-xl border border-border bg-secondary/10 px-3 py-2 text-sm outline-none focus:border-primary" />
                  {errors.phone && <span className="text-[11px] text-destructive flex items-center gap-1 mt-0.5">{errors.phone}</span>}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Preferred Contact Method</label>
                <div className="grid grid-cols-4 gap-1.5 mt-1">
                  {(["email", "phone", "whatsapp", "sms"] as const).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPreferredContact(method)}
                      className={`rounded-lg border py-1.5 text-xs font-semibold capitalize transition ${
                        preferredContact === method
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border bg-white text-muted-foreground hover:bg-secondary/40"
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button type="submit" disabled={sending} className="w-full rounded-full bg-accent py-3 text-sm font-bold text-accent-foreground shadow-sm hover:bg-accent-dark hover:cursor-pointer transition disabled:opacity-50">
              {sending ? "Submitting..." : "Submit Enquiry"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}



function FlightsForm() {
  const [trip, setTrip] = useState<TripType>("round-trip");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [dep, setDep] = useState("");
  const [ret, setRet] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [cabin, setCabin] = useState("Economy");
  const [success, setSuccess] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `Hi Seabird Travel, I'd like a flight quote.\n• Trip: ${trip}\n• From: ${from || "—"}\n• To: ${to || "—"}\n• Depart: ${dep || "—"}${trip === "round-trip" ? `\n• Return: ${ret || "—"}` : ""}\n• Passengers: ${adults} adult(s), ${children} child(ren), ${infants} infant(s)\n• Class: ${cabin}`;
    setSuccess(msg);
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {(["one-way", "round-trip", "multicity"] as TripType[]).map((t) => (
          <button key={t} type="button" onClick={() => setTrip(t)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold capitalize transition ${trip === t ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground/70 hover:text-primary"}`}>
            {t.replace("-", " ")}
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="From" icon={<MapPin className="h-3 w-3" />}>
          <input required value={from} onChange={(e) => setFrom(e.target.value)} placeholder="e.g. Edmonton" className="w-full bg-transparent text-sm font-semibold text-foreground outline-none placeholder:font-normal placeholder:text-muted-foreground" />
        </Field>
        <Field label="To" icon={<MapPin className="h-3 w-3" />}>
          <input required value={to} onChange={(e) => setTo(e.target.value)} placeholder="e.g. London" className="w-full bg-transparent text-sm font-semibold text-foreground outline-none placeholder:font-normal placeholder:text-muted-foreground" />
        </Field>
        <Field label="Departure" icon={<Calendar className="h-3 w-3" />}>
          <input required type="date" value={dep} onChange={(e) => setDep(e.target.value)} className="w-full bg-transparent text-sm font-semibold text-foreground outline-none" />
        </Field>
        <Field label="Return" icon={<Calendar className="h-3 w-3" />}>
          <input required={trip === "round-trip"} type="date" value={ret} onChange={(e) => setRet(e.target.value)} disabled={trip !== "round-trip"} className="w-full bg-transparent text-sm font-semibold text-foreground outline-none disabled:opacity-40" />
        </Field>
      </div>

      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <TravellerPopover {...{ adults, setAdults, children, setChildren, infants, setInfants, cabin, setCabin }} />
        <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-bold text-accent-foreground shadow-card transition hover:bg-accent-dark hover:cursor-pointer">
          <Calendar className="h-4 w-4" /> Request Quote
        </button>
      </div>

      {success && (
        <ContactDetailsModal 
          message={success} 
          onClose={() => setSuccess(null)} 
          type="flights" 
          from={from} 
          to={to} 
          departureDate={dep} 
        />
      )}
    </form>
  );
}

function TravellerPopover({ adults, setAdults, children, setChildren, infants, setInfants, cabin, setCabin }: any) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between rounded-xl border border-border bg-white px-3 py-2.5 text-left">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            <Users className="h-3 w-3" /> Travellers & Class
          </div>
          <div className="mt-1 text-sm font-semibold">{adults + children + infants} traveller{adults + children + infants > 1 ? "s" : ""} · {cabin}</div>
        </div>
      </button>
      {open && (
        <div className="absolute z-30 mt-2 w-full min-w-[280px] rounded-2xl border border-border bg-white p-4 shadow-elevated">
          <Stepper label="Adults" sub="12+ yrs" value={adults} setValue={setAdults} min={1} />
          <Stepper label="Children" sub="2–12 yrs" value={children} setValue={setChildren} />
          <Stepper label="Infants" sub="0–2 yrs" value={infants} setValue={setInfants} />
          <div className="mt-3">
            <div className="mb-1.5 text-xs font-semibold text-muted-foreground">Class</div>
            <div className="grid grid-cols-2 gap-1.5">
              {["Economy", "Premium Economy", "Business", "First"].map((c) => (
                <button key={c} type="button" onClick={() => setCabin(c)}
                  className={`rounded-lg px-2 py-1.5 text-xs font-semibold ${cabin === c ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground/70 hover:text-primary"}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>
          <button type="button" onClick={() => setOpen(false)} className="mt-4 w-full rounded-full bg-primary py-2 text-xs font-semibold text-primary-foreground">Done</button>
        </div>
      )}
    </div>
  );
}

function Stepper({ label, sub, value, setValue, min = 0 }: any) {
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <div className="text-sm font-semibold">{label}</div>
        <div className="text-xs text-muted-foreground">{sub}</div>
      </div>
      <div className="flex items-center gap-2">
        <button type="button" onClick={() => setValue(Math.max(min, value - 1))} className="grid h-8 w-8 place-items-center rounded-full border border-border hover:bg-secondary"><Minus className="h-3.5 w-3.5" /></button>
        <span className="w-6 text-center text-sm font-semibold">{value}</span>
        <button type="button" onClick={() => setValue(value + 1)} className="grid h-8 w-8 place-items-center rounded-full border border-border hover:bg-secondary"><Plus className="h-3.5 w-3.5" /></button>
      </div>
    </div>
  );
}

function HotelsForm() {
  const [dest, setDest] = useState("");
  const [ci, setCi] = useState("");
  const [co, setCo] = useState("");
  const [rooms, setRooms] = useState(1);
  const [guests, setGuests] = useState(2);
  const [success, setSuccess] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(`Hi Seabird Travel, I'd like a hotel quote.\n• Destination: ${dest || "—"}\n• Check-in: ${ci || "—"}\n• Check-out: ${co || "—"}\n• Rooms: ${rooms}\n• Guests: ${guests}`);
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Destination" icon={<MapPin className="h-3 w-3" />}>
          <input required value={dest} onChange={(e) => setDest(e.target.value)} placeholder="City or hotel" className="w-full bg-transparent text-sm font-semibold outline-none placeholder:font-normal placeholder:text-muted-foreground" />
        </Field>
        <Field label="Check-in" icon={<Calendar className="h-3 w-3" />}>
          <input required type="date" value={ci} onChange={(e) => setCi(e.target.value)} className="w-full bg-transparent text-sm font-semibold outline-none" />
        </Field>
        <Field label="Check-out" icon={<Calendar className="h-3 w-3" />}>
          <input required type="date" value={co} onChange={(e) => setCo(e.target.value)} className="w-full bg-transparent text-sm font-semibold outline-none" />
        </Field>
        <Field label="Rooms & Guests" icon={<Users className="h-3 w-3" />}>
          <div className="flex items-center gap-2 text-sm font-semibold">
            <input type="number" min={1} value={rooms} onChange={(e) => setRooms(+e.target.value)} className="w-12 bg-transparent outline-none" /> rm ·
            <input type="number" min={1} value={guests} onChange={(e) => setGuests(+e.target.value)} className="w-12 bg-transparent outline-none" /> gst
          </div>
        </Field>
      </div>
      <div className="flex justify-end">
        <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-bold text-accent-foreground shadow-card hover:bg-accent-dark hover:cursor-pointer">
          <Calendar className="h-4 w-4" /> Request Quote
        </button>
      </div>
      {success && (
        <ContactDetailsModal 
          message={success} 
          onClose={() => setSuccess(null)} 
          type="hotels" 
          to={dest} 
          departureDate={ci} 
        />
      )}
    </form>
  );
}

function PackagesForm() {
  const [dest, setDest] = useState("");
  const [month, setMonth] = useState("");
  const [success, setSuccess] = useState<string | null>(null);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(`Hi Seabird Travel, I'd like package options.\n• Destination: ${dest || "—"}\n• Travel month: ${month || "—"}`);
  };
  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Destination" icon={<MapPin className="h-3 w-3" />}>
          <input
            required
            type="text"
            value={dest}
            onChange={(e) => setDest(e.target.value)}
            placeholder="e.g. Canada West Coast"
            className="w-full bg-transparent text-sm font-semibold outline-none placeholder:font-normal placeholder:text-muted-foreground"
          />
        </Field>
        <Field label="Travel Month" icon={<Calendar className="h-3 w-3" />}>
          <input required type="month" value={month} onChange={(e) => setMonth(e.target.value)} className="w-full bg-transparent text-sm font-semibold outline-none" />
        </Field>
      </div>
      <div className="flex justify-end">
        <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-bold text-accent-foreground shadow-card hover:bg-accent-dark hover:cursor-pointer">
          <Calendar className="h-4 w-4" /> Request Quote
        </button>
      </div>
      {success && (
        <ContactDetailsModal 
          message={success} 
          onClose={() => setSuccess(null)} 
          type="packages" 
          to={dest} 
          departureDate={month} 
        />
      )}
    </form>
  );
}
