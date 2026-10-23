"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  ChevronRight, Clock, MapPin, Sun, DollarSign, Globe,
  Cloud, Phone, MessageCircle, ArrowRight,
  Plane, Hotel, Utensils, Shield, Headphones, Users, BadgeCheck,
  ChevronDown, ChevronUp,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import InquiryModal from "@/components/InquiryModal";
import LinkedText from "@/components/LinkedText";
import { getRelatedDestinations, originFor, Destination } from "@/data/destinations";
import type { TourData } from "@/lib/tours";
import type { QuotedPackage } from "@/data/quotedPackages";

/* ─── Animated Counter ────────────────────────── */
function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const step = 16;
    const increment = target / (duration / step);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, step);
    return () => clearInterval(timer);
  }, [isInView, target]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* ─── Section Header ──────────────────────────── */
function SectionHeader({ badge, title, subtitle }: { badge: string; title: string; subtitle?: string }) {
  return (
    <div className="text-center mb-14">
      <div className="inline-flex items-center gap-2 bg-secondary/10 border border-secondary/30 rounded-full px-4 py-1.5 mb-4">
        <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
        <span className="text-secondary text-xs font-body font-semibold tracking-widest uppercase">{badge}</span>
      </div>
      <h2 className="font-display font-800 text-3xl sm:text-4xl text-primary mb-4">{title}</h2>
      {subtitle && <p className="text-muted-foreground font-body max-w-2xl mx-auto leading-relaxed">{subtitle}</p>}
    </div>
  );
}

/* ─── Package Card ────────────────────────────── */
function PackageCard({ pkg, index, isInView, onBook }: {
  pkg: Destination["packages"][0]; index: number; isInView: boolean; onBook: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-card rounded-2xl border border-border shadow-card overflow-hidden group hover:-translate-y-1 transition-all duration-300"
    >
      {pkg.badge && (
        <div className="bg-primary text-secondary text-xs font-display font-700 px-3 py-1.5 text-center tracking-wider">
          ★ {pkg.badge}
        </div>
      )}
      <div className="p-6">
        <h3 className="font-display font-700 text-lg text-primary mb-1">{pkg.title}</h3>
        <div className="flex items-center gap-1 text-muted-foreground text-xs font-body mb-4">
          <Clock className="w-3.5 h-3.5" /> {pkg.duration}
        </div>
        <div className="flex flex-wrap gap-1.5 mb-5">
          {pkg.inclusions.map((inc) => (
            <span key={inc} className="text-xs font-body bg-muted text-muted-foreground px-2.5 py-1 rounded-full flex items-center gap-1">
              {inc.includes("Flight") && <Plane className="w-3 h-3" />}
              {inc.includes("Hotel") || inc.includes("Villa") || inc.includes("Resort") ? <Hotel className="w-3 h-3" /> : null}
              {inc.includes("Meal") || inc.includes("Breakfast") || inc.includes("Dinner") ? <Utensils className="w-3 h-3" /> : null}
              {inc}
            </span>
          ))}
        </div>
        <button
          onClick={onBook}
          className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-gold text-primary font-display font-700 text-sm rounded-xl shadow-gold hover:opacity-90 hover:scale-105 transition-all duration-200"
        >
          Enquire Now <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

/* ─── Real Package Card ───────────────────────── */

/**
 * A package that exists, unlike the cards above: the whole card links
 * to its page. The ones built from `destination.packages` only open the
 * enquiry form, which is a dead end for a visitor who wants to read the
 * itinerary before asking.
 */
function TourCard({ tour, index, isInView }: { tour: TourData; index: number; isInView: boolean }) {
  const image = tour.cardImage || tour.heroImages[0];
  const price = tour.showPrice && !tour.priceOnRequest ? tour.startingPrice : "";
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: Math.min(index, 5) * 0.08 }}
    >
      <Link
        href={`/packages/${tour.slug}`}
        className="group flex flex-col h-full bg-card rounded-2xl border border-border shadow-card overflow-hidden hover:-translate-y-1 hover:shadow-navy transition-all duration-300"
      >
        {image && (
          <div className="relative h-40 overflow-hidden">
            <img
              src={image}
              alt={tour.heroImageAlts?.[0] || tour.shortTitle}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {tour.badge && (
              <span className="absolute top-3 left-3 bg-primary text-secondary text-[11px] font-display font-700 px-2.5 py-1 rounded-full">
                {tour.badge}
              </span>
            )}
          </div>
        )}
        <div className="p-5 flex flex-col flex-1">
          <h3 className="font-display font-700 text-lg text-primary mb-1 leading-snug">
            {tour.shortTitle || tour.title}
          </h3>
          <div className="flex items-center gap-1 text-muted-foreground text-xs font-body mb-3">
            <Clock className="w-3.5 h-3.5" /> {tour.duration}
          </div>
          {tour.destinations.length > 0 && (
            <p className="text-muted-foreground font-body text-xs mb-4">{tour.destinations.join(" · ")}</p>
          )}
          <div className="mt-auto flex items-center justify-between gap-3">
            <span className="font-display font-800 text-secondary text-base">
              {price ? (
                <>
                  {price}
                  <span className="text-muted-foreground font-body text-xs font-normal"> /person</span>
                </>
              ) : (
                <span className="text-muted-foreground font-body text-sm font-normal">Price on request</span>
              )}
            </span>
            <span className="inline-flex items-center gap-1.5 text-secondary font-display font-700 text-sm group-hover:gap-2.5 transition-all">
              View <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ─── Offer Card ──────────────────────────────── */

/** An offer for this destination, linked to its card on /offers. */
function OfferCard({ offer, index, isInView }: { offer: QuotedPackage; index: number; isInView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: Math.min(index, 5) * 0.08 }}
    >
      <Link
        href={`/offers#${offer.slug}`}
        className="group flex flex-col h-full bg-card rounded-2xl border border-border shadow-card overflow-hidden hover:-translate-y-1 hover:shadow-navy transition-all duration-300"
      >
        {offer.image && (
          <div className="relative h-40 overflow-hidden">
            <img
              src={offer.image}
              alt={offer.imageAlt || offer.name}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <span className="absolute top-3 left-3 bg-secondary text-primary text-[11px] font-display font-700 px-2.5 py-1 rounded-full">
              Offer
            </span>
          </div>
        )}
        <div className="p-5 flex flex-col flex-1">
          <h3 className="font-display font-700 text-lg text-primary mb-1 leading-snug">{offer.name}</h3>
          <div className="flex items-center gap-1 text-muted-foreground text-xs font-body mb-3">
            <Clock className="w-3.5 h-3.5" /> {offer.duration}
          </div>
          {offer.cities.length > 0 && (
            <p className="text-muted-foreground font-body text-xs mb-4">{offer.cities.join(" · ")}</p>
          )}
          <div className="mt-auto flex items-center justify-between gap-3">
            <span className="font-display font-800 text-secondary text-base">
              {offer.startingPrice}
              <span className="text-muted-foreground font-body text-xs font-normal"> /person</span>
            </span>
            <span className="inline-flex items-center gap-1.5 text-secondary font-display font-700 text-sm group-hover:gap-2.5 transition-all">
              View <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ─── FAQ Item ────────────────────────────────── */
function FAQItem({ faq, index }: { faq: { question: string; answer: string }; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07 }}
      className="border border-border rounded-xl overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 bg-card hover:bg-muted/40 transition-colors text-left"
      >
        <span className="font-display font-600 text-primary text-sm sm:text-base">{faq.question}</span>
        {open ? <ChevronUp className="w-5 h-5 text-secondary flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-5 text-muted-foreground font-body text-sm leading-relaxed border-t border-border pt-4">
              {/* Answers may carry [label](/href) internal links. */}
              <LinkedText text={faq.answer} />
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}


/* ─── Main Page ───────────────────────────────── */
export default function DestinationDetailClient({
  destination,
  packages,
  offers,
}: {
  destination: Destination;
  /** Packages on sale for this destination. Empty until WordPress has some. */
  packages: TourData[];
  /** Live offers for it, for destinations sold from the Offers page alone. */
  offers: QuotedPackage[];
}) {
  const router = useRouter();
  const [inquiryOpen, setInquiryOpen] = useState(false);

  const packagesRef = useRef(null);
  const packagesInView = useInView(packagesRef, { once: true, margin: "-80px" });

  const related = getRelatedDestinations(destination.relatedSlugs);

  return (
    <div className="min-h-screen bg-background font-body">
      <Navbar onInquiryOpen={() => setInquiryOpen(true)} />

      {/* ── HERO ──────────────────────────────────────── */}
      <section className="relative h-[92vh] min-h-[600px] flex items-end overflow-hidden">
        <img
          src={destination.heroImage}
          alt={`${destination.name} tour packages from ${originFor(destination)}`}
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/50 to-transparent" />
        {/* Top breadcrumb */}
        <div className="absolute top-28 left-0 right-0">
          <div className="container-custom">
            <nav className="flex items-center gap-2 text-white/70 font-body text-sm" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-secondary transition-colors">Home</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link href="/#destinations" className="hover:text-secondary transition-colors">Destinations</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-secondary font-semibold">{destination.name}</span>
            </nav>
          </div>
        </div>

        {/* Hero content */}
        <div className="relative container-custom pb-16 sm:pb-24">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 bg-secondary/20 border border-secondary/40 rounded-full px-4 py-1.5 mb-4 backdrop-blur-sm">
              <MapPin className="w-3.5 h-3.5 text-secondary" />
              <span className="text-secondary text-xs font-body font-semibold tracking-widest uppercase">{destination.country}</span>
            </div>
            <h1 className="font-display font-900 text-4xl sm:text-5xl lg:text-6xl text-white mb-4 max-w-3xl leading-tight">
              {destination.name} Tour Packages from {originFor(destination)}
            </h1>
            <p className="font-body text-white/80 text-lg max-w-2xl mb-6 leading-relaxed">
              {destination.tagline}
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <button
                onClick={() => setInquiryOpen(true)}
                className="px-7 py-3.5 bg-gradient-gold text-primary font-display font-700 rounded-full shadow-gold hover:opacity-90 hover:scale-105 transition-all duration-200"
              >
                Get a Free Quote
              </button>
              <a
                href="#packages"
                className="px-7 py-3.5 bg-white/15 backdrop-blur-sm border border-white/30 text-white font-display font-600 rounded-full hover:bg-white/25 transition-all duration-200"
              >
                View Packages
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── STICKY MOBILE CTA ────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 sm:hidden bg-primary border-t border-secondary/20 px-4 py-3">
        <button
          onClick={() => setInquiryOpen(true)}
          className="w-full py-3 bg-gradient-gold text-primary font-display font-700 text-sm rounded-xl shadow-gold"
        >
          Get Free Quote
        </button>
      </div>

      {/* ── OVERVIEW ─────────────────────────────────── */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-14 items-start">
            {/* Left: About text */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="inline-flex items-center gap-2 bg-secondary/10 border border-secondary/30 rounded-full px-4 py-1.5 mb-4">
                <span className="text-secondary text-xs font-body font-semibold tracking-widest uppercase">About {destination.name}</span>
              </div>
              <h2 className="font-display font-800 text-3xl sm:text-4xl text-primary mb-5 leading-tight">
                Why {destination.name} is a Must-Visit Destination
              </h2>
              <p className="text-muted-foreground font-body leading-relaxed text-base mb-6">
                {/* Through LinkedText so a hub page can point at the
                    destinations it covers from its opening paragraph,
                    the way the FAQ answers already can. */}
                <LinkedText text={destination.about} />
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 text-secondary font-body font-semibold text-sm hover:gap-3 transition-all"
                >
                  View Our Services <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 text-primary/60 font-body text-sm hover:text-primary transition-colors"
                >
                  About Flywings <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>

            {/* Right: Quick facts */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {[
                { icon: Sun, label: "Best Time to Visit", value: destination.bestTime },
                { icon: Clock, label: "Ideal Duration", value: destination.tripDuration },
                { icon: DollarSign, label: "Currency", value: destination.currency },
                {
                  icon: Globe,
                  label: destination.country === "India" ? "Permits & ID" : "Visa for Indians",
                  value: destination.visaInfo,
                },
                { icon: Cloud, label: "Climate", value: destination.weather },
                { icon: MapPin, label: "Country", value: destination.country },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3 bg-card border border-border rounded-xl p-4 shadow-card">
                <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-muted-foreground font-body text-xs mb-0.5">{label}</div>
                    <div className="text-primary font-display font-600 text-sm leading-snug">{value}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── TOUR PACKAGES ─────────────────────────────── */}
      {/*
        The packages WordPress is selling for this destination, each one
        a link to its page. `destination.packages` is the fallback: a
        hand-written outline of what we can put together, with no page
        behind it, so those cards open the enquiry form instead.
      */}
      <section id="packages" className="section-padding bg-muted/30">
        <div className="container-custom" ref={packagesRef}>
          <SectionHeader
            badge="Tour Packages"
            title={`${destination.name} Tour Packages`}
            subtitle={
              packages.length > 0
                ? `${packages.length} ${destination.name} package${packages.length === 1 ? "" : "s"} on sale now, with itineraries, hotels and what each one includes.`
                : offers.length > 0
                  ? `${offers.length} ${destination.name} circuit${offers.length === 1 ? "" : "s"} we are quoting right now, land only, with the full day by day.`
                  : `Thoughtfully crafted packages to give you the best of ${destination.name} at unbeatable value.`
            }
          />
          {packages.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {packages.slice(0, 6).map((tour, i) => (
                  <TourCard key={tour.slug} tour={tour} index={i} isInView={packagesInView} />
                ))}
              </div>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href={`/packages?destination=${destination.slug}`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-secondary font-display font-700 text-sm rounded-full hover:bg-navy-dark transition-colors"
                >
                  {packages.length > 6
                    ? `See all ${packages.length} ${destination.name} packages`
                    : `Explore ${destination.name} packages`}
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  type="button"
                  onClick={() => setInquiryOpen(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-muted text-primary font-display font-700 text-sm rounded-full hover:bg-muted/70 transition-colors"
                >
                  Ask for a custom {destination.name} trip
                </button>
              </div>
            </>
          ) : offers.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {offers.map((offer, i) => (
                  <OfferCard key={offer.slug} offer={offer} index={i} isInView={packagesInView} />
                ))}
              </div>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/offers"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-secondary font-display font-700 text-sm rounded-full hover:bg-navy-dark transition-colors"
                >
                  See all current offers <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  type="button"
                  onClick={() => setInquiryOpen(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-muted text-primary font-display font-700 text-sm rounded-full hover:bg-muted/70 transition-colors"
                >
                  Ask for a custom {destination.name} trip
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {destination.packages.map((pkg, i) => (
                  <PackageCard key={pkg.id} pkg={pkg} index={i} isInView={packagesInView} onBook={() => setInquiryOpen(true)} />
                ))}
              </div>
              {destination.packages.length === 0 && (
                <p className="text-center text-muted-foreground font-body text-sm">
                  We build {destination.name} trips to order rather than selling a fixed package.{" "}
                  <button
                    type="button"
                    onClick={() => setInquiryOpen(true)}
                    className="text-secondary font-semibold underline underline-offset-2"
                  >
                    Tell us your dates
                  </button>{" "}
                  and we will send an itinerary and a price within 24 hours.
                </p>
              )}
            </>
          )}
        </div>
      </section>

      {/* ── HIGHLIGHTS ────────────────────────────────── */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <SectionHeader
            badge="Must-See"
            title={`Top ${destination.name} Highlights`}
            subtitle={`Discover the iconic experiences that make ${destination.name} unforgettable.`}
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {destination.highlights.map((h, i) => (
              <motion.div
                key={h.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="flex flex-col items-center text-center bg-card border border-border rounded-2xl p-5 shadow-card hover:shadow-navy hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{h.icon}</div>
                <h3 className="font-display font-700 text-primary text-sm mb-1 leading-tight">{h.title}</h3>
                <p className="text-muted-foreground font-body text-xs leading-relaxed">{h.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY BOOK WITH FLYWINGS ─────────────────────── */}
      <section className="section-padding bg-primary">
        <div className="container-custom">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-secondary/20 border border-secondary/30 rounded-full px-4 py-1.5 mb-4">
              <span className="text-secondary text-xs font-body font-semibold tracking-widest uppercase">Why Flywings</span>
            </div>
            <h2 className="font-display font-800 text-3xl sm:text-4xl text-white mb-4">
              Why Book Your {destination.name} Trip With Us
            </h2>
            <p className="text-white/60 font-body max-w-xl mx-auto">
              We've been crafting perfect journeys since 2013. Here's why thousands of travelers trust Flywings.
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Headphones, title: "24/7 Support", desc: "Round-the-clock assistance during your trip" },
              { icon: Globe, title: "Tourist Visa Assistance", desc: "Complete visa guidance and documentation" },
              { icon: BadgeCheck, title: "Transparent Pricing", desc: "No hidden fees. What you see is what you pay" },
              { icon: Users, title: "Local Experts", desc: "Destination specialists with in-depth knowledge" },
            ].map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-navy-light/50 border border-white/10 rounded-2xl p-6 text-center hover:bg-navy-light/70 transition-colors"
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-secondary/20 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="font-display font-700 text-white text-sm mb-2">{title}</h3>
                <p className="text-white/50 font-body text-xs leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Stats strip */}
          <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-6 border-t border-white/10 pt-10">
            {[
              { target: 5000, suffix: "+", label: "Happy Travelers" },
              { target: 100, suffix: "+", label: "Destinations" },
              { target: 15, suffix: "+", label: "Years Experience" },
              { target: 98, suffix: "%", label: "Satisfaction Rate" },
            ].map(({ target, suffix, label }) => (
              <div key={label} className="text-center">
                <div className="font-display font-900 text-3xl sm:text-4xl text-secondary mb-1">
                  <AnimatedCounter target={target} suffix={suffix} />
                </div>
                <div className="text-white/50 font-body text-xs">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────── */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <SectionHeader
            badge="FAQs"
            title={`Frequently Asked Questions About ${destination.name}`}
            subtitle="Everything you need to know before planning your trip."
          />
          <div className="max-w-3xl mx-auto space-y-3">
            {destination.faqs.map((faq, i) => (
              <FAQItem key={i} faq={faq} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── RELATED DESTINATIONS ──────────────────────── */}
      {related.length > 0 && (
        <section className="section-padding bg-muted/30">
          <div className="container-custom">
            <SectionHeader
              badge="Explore More"
              title="Related Destinations You'll Love"
              subtitle="Extend your travel dreams with these handpicked destinations."
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {related.map((dest, i) => (
                <motion.div
                  key={dest.slug}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative rounded-2xl overflow-hidden shadow-card cursor-pointer"
                  onClick={() => router.push(`/destinations/${dest.slug}`)}
                >
                  <img
                    src={dest.heroImage}
                    alt={`${dest.name} tour packages`}
                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-card" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="text-secondary font-body text-xs uppercase tracking-widest mb-1">{dest.country}</div>
                    <h3 className="font-display font-700 text-white text-lg mb-1">{dest.name}</h3>
                    <Link
                      href={`/destinations/${dest.slug}`}
                      className="inline-flex items-center gap-1.5 bg-secondary/20 border border-secondary/30 text-secondary font-body text-xs px-3 py-1.5 rounded-full hover:bg-secondary/30 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View Package <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FINAL CTA ─────────────────────────────────── */}
      <section className="section-padding bg-gradient-navy relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-secondary rounded-full blur-3xl -mr-48 -mt-48" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-secondary rounded-full blur-3xl -ml-36 -mb-36" />
        </div>
        <div className="container-custom relative text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 bg-secondary/20 border border-secondary/30 rounded-full px-4 py-1.5 mb-6">
              <Plane className="w-3.5 h-3.5 text-secondary" />
              <span className="text-secondary text-xs font-body font-semibold tracking-widest uppercase">Ready to Fly?</span>
            </div>
            <h2 className="font-display font-900 text-3xl sm:text-5xl text-white mb-4 leading-tight">
              Plan Your {destination.name} Trip<br className="hidden sm:block" />
              <span className="text-secondary"> With Flywings Today</span>
            </h2>
            <p className="text-white/60 font-body text-lg max-w-xl mx-auto mb-10">
              Talk to our expert travel consultants and get a personalized itinerary crafted just for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setInquiryOpen(true)}
                className="px-8 py-4 bg-gradient-gold text-primary font-display font-700 rounded-full shadow-gold hover:opacity-90 hover:scale-105 transition-all duration-200 text-base"
              >
                Talk To Travel Expert
              </button>
              <a
                href="https://wa.me/919914310333"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-[#25D366]/20 border border-[#25D366]/40 text-white font-display font-600 rounded-full hover:bg-[#25D366]/30 transition-all duration-200 text-base flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5 text-[#25D366]" />
                WhatsApp Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
      {/* Extra padding for mobile sticky CTA */}
      <div className="h-16 sm:hidden" />
      <WhatsAppButton />
      <InquiryModal isOpen={inquiryOpen} onClose={() => setInquiryOpen(false)} />
    </div>
  );
}
