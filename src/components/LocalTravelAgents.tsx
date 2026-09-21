import Link from "next/link";
import { MapPin, Phone } from "lucide-react";
import { CONTACT } from "@/lib/seo";

/**
 * Local SEO band on the homepage, added Sep 2026 on the SEO team's brief.
 *
 * Targets "travel agents in Chandigarh" and "travel agents in Mohali",
 * the local commercial terms the homepage was not covering in body copy.
 * It also repeats the office address and phone exactly as they appear in
 * seo.ts, so the homepage carries the same NAP as the directory listings
 * and the Google Business Profile.
 *
 * Sits between Premium Tour Packages (bg-muted/30) and What Our Clients
 * Say (bg-white), so the content is boxed rather than flat, otherwise it
 * would read as part of the testimonials block.
 */
export default function LocalTravelAgents() {
  const services = [
    { label: "Flight Booking", href: "/services/flight-booking" },
    { label: "Holiday Packages", href: "/packages" },
    { label: "Visa Assistance", href: "/services/visa-assistance" },
    { label: "Hotel Booking", href: "/services/hotel-booking" },
    { label: "Corporate Travel", href: "/services/corporate-travel" },
    { label: "Tours from Chandigarh", href: "/india-tour-packages-from-chandigarh" },
  ];

  return (
    <section id="travel-agents-chandigarh-mohali" className="section-padding bg-white">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto rounded-3xl border border-border bg-muted/30 px-6 py-10 sm:px-12 sm:py-14 text-center">
          <span className="inline-block px-4 py-1 bg-gold/10 border border-gold/30 text-gold text-xs font-body font-medium tracking-widest uppercase rounded-full mb-4">
            Local Expertise
          </span>

          <h2 className="font-display font-800 text-3xl sm:text-4xl text-navy mb-4">
            Travel Agents in Chandigarh &amp; Mohali
          </h2>

          <p className="text-muted-foreground font-body leading-relaxed max-w-2xl mx-auto">
            Looking for reliable travel agents in Chandigarh or travel agents in Mohali? Flywings offers complete travel
            solutions for flights, holiday packages, hotels, visas, corporate travel and customized tours. Our team
            helps individuals, families and businesses plan domestic and international journeys with personalized
            assistance.
          </p>

          <ul className="flex flex-wrap justify-center gap-2.5 mt-7">
            {services.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="inline-block px-4 py-2 rounded-full border border-border bg-white text-navy font-body text-sm hover:border-gold hover:text-gold transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-8 pt-6 border-t border-border text-muted-foreground font-body text-sm">
            <span className="inline-flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gold" />
              {CONTACT.streetAddress}, {CONTACT.locality}, {CONTACT.region} {CONTACT.postalCode}
            </span>
            <a
              href={`tel:${CONTACT.phoneE164}`}
              className="inline-flex items-center gap-2 text-navy font-medium hover:text-gold transition-colors"
            >
              <Phone className="w-4 h-4 text-gold" />
              {CONTACT.phoneDisplay}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
