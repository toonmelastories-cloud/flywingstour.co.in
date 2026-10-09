"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  Tag,
  MapPin,
  Clock,
  Users,
  Check,
  ChevronDown,
  MessageCircle,
  Send,
  Plane,
  Info,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import InquiryModal from "@/components/InquiryModal";
import quotedPackages, { type QuotedPackage } from "@/data/quotedPackages";
import { CONTACT } from "@/lib/seo";

const WA_NUMBER = CONTACT.phoneE164.replace("+", "");

/** WhatsApp deep link naming the offer, so the office knows what was clicked. */
function waHref(offer: QuotedPackage): string {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
    `Hi Flywings! I saw the ${offer.name} offer at ${offer.startingPrice} per person on your website. Please share the full quote.`
  )}`;
}

/** Everything these land rates leave out, stated once instead of per card. */
const EXCLUSIONS = [
  "International airfare, unless the quote you receive says otherwise",
  "Visa fees and travel insurance",
  "Meals not listed in the inclusions",
  "Tips, porterage and personal expenses",
  "Anything not listed under Includes",
  "Peak season, festival and long weekend surcharges",
];

function OfferCard({ offer, index, onQuote }: {
  offer: QuotedPackage;
  index: number;
  onQuote: (destination: string) => void;
}) {
  const [showAllIncludes, setShowAllIncludes] = useState(false);
  const [showItinerary, setShowItinerary] = useState(false);

  const visibleIncludes = showAllIncludes
    ? offer.inclusions
    : offer.inclusions.slice(0, 5);
  const hiddenCount = offer.inclusions.length - visibleIncludes.length;

  return (
    <motion.article
      id={offer.slug}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: Math.min(index, 3) * 0.08 }}
      className="scroll-mt-28 bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-navy/10 hover:border-secondary/40 transition-all duration-300 flex flex-col"
    >
      {/* Photo, or a branded panel where we hold no picture of the place */}
      <div className="relative h-52 overflow-hidden">
        {offer.image ? (
          <img
            src={offer.image}
            alt={offer.imageAlt || offer.name}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-navy flex flex-col items-center justify-center gap-2">
            <Plane className="w-9 h-9 text-secondary/70" />
            <span className="font-display font-800 text-white/90 text-lg">
              {offer.region}
            </span>
          </div>
        )}
        <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 bg-white/95 backdrop-blur rounded-full px-3 py-1">
          <MapPin className="w-3 h-3 text-secondary" />
          <span className="text-primary text-[11px] font-body font-bold uppercase tracking-wider">
            {offer.region}
          </span>
        </div>
        <div className="absolute top-3 right-3 inline-flex items-center gap-1.5 bg-navy/90 backdrop-blur rounded-full px-3 py-1">
          <Clock className="w-3 h-3 text-secondary" />
          <span className="text-white text-[11px] font-body font-semibold">
            {offer.duration}
          </span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-display font-800 text-primary text-xl leading-snug mb-2">
          {offer.name}
        </h3>

        <p className="text-muted-foreground font-body text-sm mb-4">
          {offer.cities.join(" · ")}
        </p>

        {/* Price */}
        <div className="flex items-end justify-between gap-3 mb-4 pb-4 border-b border-border">
          <div>
            <span className="block text-muted-foreground font-body text-xs mb-0.5">
              Starting from
            </span>
            <span className="font-display font-900 text-secondary text-2xl">
              {offer.startingPrice}
            </span>
            <span className="text-muted-foreground font-body text-xs"> /person</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground font-body text-xs">
            <Users className="w-3.5 h-3.5" />
            Min {offer.minPax} travellers
          </div>
        </div>

        {/* Inclusions */}
        <h4 className="font-body font-bold text-primary text-xs uppercase tracking-wider mb-2.5">
          Includes
        </h4>
        <ul className="space-y-1.5 mb-3">
          {visibleIncludes.map((item) => (
            <li key={item} className="flex gap-2 text-foreground/80 font-body text-sm leading-relaxed">
              <Check className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        {hiddenCount > 0 && (
          <button
            type="button"
            onClick={() => setShowAllIncludes(true)}
            className="self-start text-secondary font-body text-xs font-semibold hover:underline mb-3"
          >
            + {hiddenCount} more inclusion{hiddenCount > 1 ? "s" : ""}
          </button>
        )}

        {/* Itinerary, where the rate sheet gave us one */}
        {offer.itinerary.length > 0 && (
          <div className="mb-4">
            <button
              type="button"
              onClick={() => setShowItinerary((v) => !v)}
              aria-expanded={showItinerary}
              className="w-full flex items-center justify-between gap-2 bg-muted hover:bg-muted/70 rounded-lg px-3 py-2.5 transition-colors"
            >
              <span className="font-body font-bold text-primary text-xs uppercase tracking-wider">
                Day by day
              </span>
              <ChevronDown
                className={`w-4 h-4 text-primary transition-transform duration-200 ${
                  showItinerary ? "rotate-180" : ""
                }`}
              />
            </button>
            {showItinerary && (
              <ol className="mt-2.5 space-y-1.5 pl-1">
                {offer.itinerary.map((day) => (
                  <li
                    key={day}
                    className="text-foreground/75 font-body text-sm leading-relaxed border-l-2 border-secondary/40 pl-3"
                  >
                    {day}
                  </li>
                ))}
              </ol>
            )}
          </div>
        )}

        {/* CTAs */}
        <div className="mt-auto grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <a
            href={waHref(offer)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5b] text-white font-body font-bold text-sm rounded-full px-4 py-3 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </a>
          <button
            type="button"
            onClick={() => onQuote(offer.region)}
            className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-navy-dark text-secondary font-body font-bold text-sm rounded-full px-4 py-3 transition-colors"
          >
            <Send className="w-4 h-4" />
            Get a quote
          </button>
        </div>
      </div>
    </motion.article>
  );
}

export default function OffersClient() {
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [inquiryDestination, setInquiryDestination] = useState("");
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });

  const openQuote = (destination: string) => {
    setInquiryDestination(destination);
    setInquiryOpen(true);
  };

  const cheapest = quotedPackages.reduce((lowest, o) => {
    const n = Number(o.startingPrice.replace(/[^\d]/g, ""));
    return n && n < lowest ? n : lowest;
  }, Number.POSITIVE_INFINITY);

  return (
    <div className="min-h-screen bg-background font-body">
      <Navbar onInquiryOpen={() => openQuote("")} />

      {/* ── HERO ───────────────────────────────────────────────── */}
      <section className="relative bg-gradient-navy pt-36 pb-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-secondary rounded-full blur-3xl -mr-48 -mt-48" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-secondary rounded-full blur-3xl -ml-36 -mb-36" />
        </div>
        <div className="container-custom relative text-center" ref={heroRef}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <nav className="flex items-center justify-center gap-2 text-white/50 font-body text-xs mb-6">
              <Link href="/" className="hover:text-secondary transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-secondary">Offers</span>
            </nav>
            <div className="inline-flex items-center gap-2 bg-secondary/20 border border-secondary/30 rounded-full px-4 py-1.5 mb-4">
              <Tag className="w-3.5 h-3.5 text-secondary" />
              <span className="text-secondary text-xs font-body font-semibold tracking-widest uppercase">
                Current Rates
              </span>
            </div>
            <h1 className="font-display font-900 text-4xl sm:text-5xl text-white mb-4 leading-tight">
              Tour Package Offers from Chandigarh
            </h1>
            <p className="text-white/65 font-body text-lg max-w-2xl mx-auto leading-relaxed">
              Live rates our Mohali office is quoting right now for Vietnam,
              Bali, Singapore and Kuala Lumpur
              {Number.isFinite(cheapest)
                ? `, starting at ₹${cheapest.toLocaleString("en-IN")} per person`
                : ""}
              . Land packages for two or more travellers, with the full day by
              day and inclusions on every card.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── OFFER GRID ─────────────────────────────────────────── */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quotedPackages.map((offer, i) => (
              <OfferCard
                key={offer.slug}
                offer={offer}
                index={i}
                onQuote={openQuote}
              />
            ))}
          </div>

          {/* What these rates leave out */}
          <div className="mt-12 bg-card border border-border rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-2.5 mb-4">
              <Info className="w-5 h-5 text-secondary" />
              <h2 className="font-display font-800 text-primary text-xl">
                What these rates do not include
              </h2>
            </div>
            <p className="text-muted-foreground font-body text-sm mb-5 leading-relaxed">
              Every price on this page is a starting land rate, per person, on a
              minimum of {quotedPackages[0]?.minPax ?? 2} travellers sharing.
              Rates move with season, hotel availability and group size, so the
              written quote you receive is the one that counts.
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
              {EXCLUSIONS.map((item) => (
                <li
                  key={item}
                  className="flex gap-2 text-foreground/75 font-body text-sm leading-relaxed"
                >
                  <span className="text-secondary mt-0.5">·</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Where to go next */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <span className="text-muted-foreground font-body text-sm">
              Looking for something else?
            </span>
            <Link
              href="/packages"
              className="inline-flex items-center gap-1.5 bg-muted hover:bg-muted/70 text-primary font-body font-semibold text-sm rounded-full px-4 py-2 transition-colors"
            >
              All tour packages
            </Link>
            <Link
              href="/destinations"
              className="inline-flex items-center gap-1.5 bg-muted hover:bg-muted/70 text-primary font-body font-semibold text-sm rounded-full px-4 py-2 transition-colors"
            >
              Destination guides
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 bg-muted hover:bg-muted/70 text-primary font-body font-semibold text-sm rounded-full px-4 py-2 transition-colors"
            >
              Talk to a consultant
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
      <InquiryModal
        isOpen={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
        defaultDestination={inquiryDestination}
        source="offers-page"
      />
    </div>
  );
}
