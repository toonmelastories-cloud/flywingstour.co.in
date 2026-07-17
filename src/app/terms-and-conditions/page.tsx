import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import PageChrome from "@/components/PageChrome";
import { breadcrumbJsonLd, pageMetadata, CONTACT, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Terms & Conditions",
  description:
    "Terms and conditions for bookings with Flywings Tour & Packages Pvt Ltd — quotes, payments, documents, visas, itinerary changes and travel responsibilities.",
  path: "/terms-and-conditions",
});

const sections = [
  {
    title: "1. Our Role",
    body: [
      "Flywings acts as a booking agent between you and the airlines, hotels, transport operators, visa processing authorities and other suppliers who actually provide the travel services. Each supplier's own terms (airline fare rules, hotel policies, embassy decisions) apply to the services they deliver, in addition to these terms.",
    ],
  },
  {
    title: "2. Quotes & Pricing",
    body: [
      "All quotes are prepared for your specific dates, group size and hotel category, and remain subject to availability until paid and confirmed. Airfares in particular can change between quote and booking — a fare is guaranteed only once ticketed. Package quotes are itemised so you can see exactly what is and is not included; anything not listed under inclusions is excluded.",
      "Prices may change with peak-season surcharges, events/exhibitions at the destination, currency movement on international bookings, or statutory tax changes. Any such change is communicated before you pay.",
    ],
  },
  {
    title: "3. Payments",
    body: [
      "Bookings are confirmed against the advance communicated with your quote, with the balance due before the deadline stated on your booking confirmation. GST is charged as applicable and invoices are provided for every payment. EMI facilities, where offered, are subject to the financing partner's approval and terms.",
    ],
  },
  {
    title: "4. Travel Documents & Visas",
    body: [
      "You are responsible for holding a passport valid for at least 6 months from the travel date (for international trips), valid photo ID for domestic travel, and any health documentation the destination requires. While our visa desk prepares and files applications with complete care, visa issuance is solely the decision of the embassy or consulate concerned — a rejection is not within any agent's control, and embassy fees are non-refundable as per the respective embassy's rules.",
    ],
  },
  {
    title: "5. Itinerary Changes by Suppliers",
    body: [
      "Airlines reschedule and cancel flights; hotels occasionally overbook; weather closes mountain roads and delays seaplanes. Where a supplier changes your itinerary, we immediately arrange the best available alternative and pursue any refunds due under the supplier's policy. Costs arising from events beyond anyone's control (force majeure — weather, strikes, civil disruption, pandemic restrictions) are not our liability, though we always assist in minimising them.",
    ],
  },
  {
    title: "6. Your Responsibilities While Travelling",
    body: [
      "Travellers must respect local laws and customs, arrive at airports and pick-ups by the times advised, and safeguard their own belongings and documents. Costs arising from missed departures, denied boarding due to documentation, or conduct issues at hotels are the traveller's responsibility. We strongly recommend travel insurance on every trip — ask us and we will guide you.",
    ],
  },
  {
    title: "7. Complaints & Jurisdiction",
    body: [
      "If something is not right during your trip, call us immediately — problems are easiest to fix while you are still at the destination, and our desk is available 24/7 for travelling clients. Formal complaints should reach us in writing within 14 days of return. These terms are governed by Indian law, with courts at Mohali/Chandigarh having exclusive jurisdiction.",
    ],
  },
];

export default function TermsPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Terms & Conditions", path: "/terms-and-conditions" },
          ]),
        ]}
      />
      <PageChrome>
      <main className="section-padding pt-36">
        <div className="container-custom max-w-3xl">
          <span className="inline-block px-4 py-1 bg-gold/10 border border-gold/30 text-gold text-xs font-body font-medium tracking-widest uppercase rounded-full mb-4">
            Legal
          </span>
          <h1 className="font-display font-800 text-3xl sm:text-4xl text-navy mb-3">Terms &amp; Conditions</h1>
          <p className="text-muted-foreground font-body text-sm mb-10">
            {SITE_NAME} · Effective July 2026
          </p>
          <p className="text-muted-foreground font-body text-base leading-relaxed mb-10">
            These terms govern every booking made with {SITE_NAME}, {CONTACT.streetAddress}, {CONTACT.locality},{" "}
            {CONTACT.region} — whether made at our office, by phone/WhatsApp, or through this website. Booking with
            us constitutes acceptance of these terms.
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
            Related: <Link href="/cancellation-refund-policy" className="text-gold hover:underline">Cancellation &amp; Refund Policy</Link> ·{" "}
            <Link href="/privacy-policy" className="text-gold hover:underline">Privacy Policy</Link>. Questions? Call{" "}
            <a href="tel:+919914310333" className="text-gold hover:underline">+91 99143 10333</a>.
          </p>
        </div>
      </main>
      </PageChrome>
    </>
  );
}
