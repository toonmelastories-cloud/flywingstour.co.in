import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd, pageMetadata, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Cancellation & Refund Policy",
  description:
    "Cancellation and refund policy for Flywings Tour & Packages Pvt Ltd bookings — flights, hotels, packages, visas, refund timelines and how to cancel.",
  path: "/cancellation-refund-policy",
});

const sections = [
  {
    title: "1. The Golden Rule: Supplier Policies Apply",
    body: [
      "Every booking is ultimately governed by the cancellation rules of the supplier providing it — the airline's fare rules, the hotel's cancellation window, the cruise or activity operator's policy. These are stated on your quote and booking confirmation, because they differ by fare type, property and season. Where this page and a supplier's rule differ, the supplier's rule prevails for that component.",
    ],
  },
  {
    title: "2. Flights",
    body: [
      "Airline tickets follow the fare rules of the booked class: refundable fares return the amount after the airline's cancellation charge, while many promotional/basic fares are non-refundable with only statutory taxes recoverable. Date changes attract the airline's change fee plus any fare difference. If the airline itself cancels the flight, you are entitled to the remedy under its policy — full refund or free rebooking — and we pursue it for you.",
    ],
  },
  {
    title: "3. Holiday Packages",
    body: [
      "Package cancellation charges depend on how close to departure you cancel, because our suppliers' penalties increase as the date approaches. The exact slab for your trip is stated on your quote — as a general framework: cancellations well in advance (typically 30+ days) lose the least, mid-window cancellations (roughly 15–29 days) attract partial charges, and cancellations inside 7 days or no-shows are generally non-refundable. Peak-season bookings (festive weeks, Christmas–New Year) often carry stricter supplier terms, flagged on your quote.",
    ],
  },
  {
    title: "4. Hotels",
    body: [
      "Hotels booked on flexible rates can usually be cancelled free until the property's stated deadline; non-refundable rates cannot. Your voucher states the applicable window. Early departures and unused nights are charged per the hotel's policy.",
    ],
  },
  {
    title: "5. Visa Fees",
    body: [
      "Embassy/consulate fees and visa processing charges are non-refundable once an application is submitted — regardless of the visa decision or later trip cancellation. This is an embassy rule, not ours. If a visa is rejected, refundable components of the rest of the booking are refunded per their individual policies.",
    ],
  },
  {
    title: "6. How to Cancel & Refund Timelines",
    body: [
      "To cancel, contact us by phone or email with your booking reference — cancellation takes effect from when we receive it in writing (email/WhatsApp), since supplier penalties are time-stamped. We file the refund with the supplier immediately.",
      "Refunds reach us from airlines and hotels typically within 7–21 working days depending on the supplier, and we pass them to your original payment method within 7 working days of receipt. We keep you informed at each stage — you will never need to chase us for your own money.",
    ],
  },
  {
    title: "7. Trip Changes Instead of Cancellation",
    body: [
      "Before cancelling, ask us about rescheduling — shifting dates often costs far less than cancelling and rebooking, and in many cases suppliers waive penalties for date moves we negotiate. This is where booking through a human desk earns its keep.",
    ],
  },
];

export default function RefundPolicyPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Cancellation & Refund Policy", path: "/cancellation-refund-policy" },
          ]),
        ]}
      />
      <main className="section-padding pt-36">
        <div className="container-custom max-w-3xl">
          <span className="inline-block px-4 py-1 bg-gold/10 border border-gold/30 text-gold text-xs font-body font-medium tracking-widest uppercase rounded-full mb-4">
            Legal
          </span>
          <h1 className="font-display font-800 text-3xl sm:text-4xl text-navy mb-3">
            Cancellation &amp; Refund Policy
          </h1>
          <p className="text-muted-foreground font-body text-sm mb-10">
            {SITE_NAME} · Effective July 2026
          </p>
          <p className="text-muted-foreground font-body text-base leading-relaxed mb-10">
            Plans change — we get it. This page explains how cancellations and refunds work across flights,
            hotels, packages and visas, and the exact timelines you can expect. Your booking confirmation always
            carries the specific terms for your trip.
          </p>
          {sections.map((s) => (
            <section key={s.title} className="mb-8">
              <h2 className="font-display font-700 text-xl text-navy mb-3">{s.title}</h2>
              {s.body.map((p) => (
                <p key={p.slice(0, 32)} className="text-muted-foreground font-body text-base leading-relaxed mb-3">
                  {p}
                </p>
              ))}
            </section>
          ))}
          <p className="text-muted-foreground font-body text-base leading-relaxed mt-10">
            Need to cancel or reschedule? Call{" "}
            <a href="tel:+919914310333" className="text-gold hover:underline">+91 99143 10333</a> or email{" "}
            <a href="mailto:sales@flywingstour.co.in" className="text-gold hover:underline">sales@flywingstour.co.in</a>.
            Related: <Link href="/terms-and-conditions" className="text-gold hover:underline">Terms &amp; Conditions</Link> ·{" "}
            <Link href="/privacy-policy" className="text-gold hover:underline">Privacy Policy</Link>.
          </p>
        </div>
      </main>
    </>
  );
}
