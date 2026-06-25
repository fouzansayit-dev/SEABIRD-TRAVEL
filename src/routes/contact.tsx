import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ADDRESS, EMAIL, PHONE_DISPLAY } from "@/lib/whatsapp";
import { MapPin, Mail, Phone, Check } from "lucide-react";
import { useBookingDialog } from "@/components/BookingDialog";
import { sendEnquiryEmail } from "../lib/email";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Seabird Travel — Edmonton, Canada" },
      { name: "description", content: "Get in touch with Seabird Travel. Visit our Edmonton office, email contact@seabirdtravel.ca, or WhatsApp +1 587-788-2222." },
      { property: "og:title", content: "Contact Seabird Travel" },
      { property: "og:description", content: "Reach our team in Edmonton, Canada — flights, hotels, and tour packages." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { openBooking } = useBookingDialog();
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const interest = formData.get("interest") as string;
    const message = formData.get("message") as string;

    const ref = "SBT-" + Math.floor(100000 + Math.random() * 900000);

    try {
      const res = await sendEnquiryEmail({
        data: {
          name,
          email,
          phone,
          subject: `New contact page message from ${name}`,
          type: `Contact form interest: ${interest}`,
          details: message,
          refNumber: ref,
          preferredContact: "email",
        }
      });

      if (res.success) {
        setSent(true);
        toast.success("Message sent successfully!", {
          description: `We'll reach out within 24 hours. Ref: ${ref}`,
          position: "top-center",
        });
        (e.target as HTMLFormElement).reset();
      } else {
        toast.error(res.error || "Failed to send message.", {
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
    <>
      <section className="bg-primary py-14 text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h1 className="text-4xl font-bold sm:text-5xl">Get in touch</h1>
          <p className="mt-2 max-w-2xl text-primary-foreground/85">We reply fast — usually within a few hours, directly via Email or Phone.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-4">
            <InfoCard icon={MapPin} title="Visit us" lines={[ADDRESS]} />
            <InfoCard icon={Mail} title="Email" lines={[EMAIL]} href={`mailto:${EMAIL}`} />
            <InfoCard icon={Phone} title="Call Us" lines={[PHONE_DISPLAY]} href={`tel:+${PHONE_DISPLAY.replace(/\D/g, "")}`} />
            <button onClick={() => openBooking({ type: "general" })}
              className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-bold text-accent-foreground hover:bg-accent-dark hover:cursor-pointer transition shadow-sm w-fit">
              <Check className="h-4 w-4" /> Open Booking Form
            </button>
            <div className="overflow-hidden rounded-2xl border border-border">
              <iframe
                title="Seabird Travel — Edmonton office"
                src="https://www.google.com/maps?q=1004+Parsons+Rd+SW+Unit+8,+Edmonton&output=embed"
                className="h-72 w-full"
                loading="lazy"
              />
            </div>
          </div>

          <form onSubmit={onSubmit} className="space-y-4 rounded-3xl bg-card p-6 shadow-card ring-1 ring-border sm:p-8">
            <h2 className="text-2xl font-bold">Send us a note</h2>
            <p className="text-sm text-muted-foreground">We'll reach out within 24 hours.</p>

            <FormField label="Your name"><input required name="name" className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary" /></FormField>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Email"><input required type="email" name="email" className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary" /></FormField>
              <FormField label="Phone"><input required name="phone" className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary" /></FormField>
            </div>
            <FormField label="Travel interest">
              <select name="interest" className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary">
                <option>Flights</option>
                <option>Hotels</option>
                <option>Packages</option>
                <option>Visa Inquiry</option>
              </select>
            </FormField>
            <FormField label="Message"><textarea required name="message" rows={5} className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary" /></FormField>

            <button type="submit" disabled={sending} className="w-full rounded-full bg-accent py-3 text-sm font-bold text-accent-foreground hover:bg-accent-dark disabled:opacity-50">
              {sending ? "Sending..." : "Send message"}
            </button>

            {sent && (
              <div className="flex items-center gap-2 rounded-xl bg-secondary p-3 text-sm font-medium text-primary">
                <Check className="h-4 w-4" /> Thanks! We'll reach out within 24 hours.
              </div>
            )}
          </form>
        </div>
      </section>
    </>
  );
}

function InfoCard({ icon: Icon, title, lines, href }: { icon: any; title: string; lines: string[]; href?: string }) {
  const body = (
    <div className="flex gap-4 rounded-2xl bg-card p-5 shadow-card ring-1 ring-border">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-secondary text-primary"><Icon className="h-5 w-5" /></span>
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</div>
        {lines.map((l) => <div key={l} className="text-sm font-semibold text-foreground">{l}</div>)}
      </div>
    </div>
  );
  return href ? <a href={href} className="block hover:opacity-90">{body}</a> : body;
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
