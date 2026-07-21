"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  Mountain, Clock, ArrowRight, Phone, ShieldCheck, BadgeCheck,
  IdCard, Headphones, Wallet, MapPin, Star, BookOpen,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import InquiryModal from "@/components/InquiryModal";
import {
  DOMESTIC_REGIONS,
  DOMESTIC_GUIDES,
  PILLAR_DOMESTIC_FAQS,
} from "@/data/pillar-domestic";
import { CONTACT } from "@/lib/seo";

/** Slim projection of TourData — only what the cards render, no prices. */
export interface PillarPackage {
  slug: string;
  shortTitle: string;
  duration: string;
  heroImage: string;
  badge?: string;
  rating: number;
  reviewCount: number;
}

const TRUST_STATS = [
  { value: "Since 2005", label: "Serving the Chandigarh Tricity" },
  { value: "4+", label: "Domestic circuits covered" },
  { value: "No Visa Needed", label: "Just a photo ID" },
  { value: "Custom Itineraries", label: "Built around your dates" },
];

const WHY_US = [
  {
    icon: MapPin,
    title: "Local office in Mohali (Phase 7)",
    text: "Walk in, meet the team, and plan face-to-face — we are based in the Tricity, not a faceless call centre.",
  },
  {
    icon: BadgeCheck,
    title: "20+ years of local knowledge",
    text: "Hill routes, houseboat operators, and yatra logistics we've worked with since 2005 — not a scripted itinerary.",
  },
  {
    icon: IdCard,
    title: "No visa paperwork",
    text: "Domestic travel needs no visa or passport — just a photo ID for every traveller, which we help arrange documentation around when needed.",
  },
  {
    icon: Wallet,
    title: "Transparent pricing & EMI",
    text: "Itemised quotes with no hidden charges, and EMI plans available on major packages.",
  },
  {
    icon: Headphones,
    title: "24/7 on-trip support",
    text: "A Punjabi/Hindi/English-speaking team that picks up the phone, from Kashmir to Katra.",
  },
  {
    icon: ShieldCheck,
    title: "Customised, not copy-paste",
    text: "Every itinerary is adjusted to your dates, budget, and pace — family, yatra group, or couple.",
  },
];

const BOOKING_STEPS = [
  {
    title: "Tell us your plan",
    text: "Call, WhatsApp, or send an enquiry with your destination, dates, and rough budget.",
  },
  {
    title: "Get a custom quote in 24 hours",
    text: "We shortlist transport (flight, cab or helicopter), hotels, and build a day-wise itinerary.",
  },
  {
    title: "We handle logistics & bookings",
    text: "Transport, hotels, transfers, and sightseeing — confirmed and shared in one document.",
  },
  {
    title: "Travel with 24/7 support",
    text: "A phone call away throughout your trip, from departure to your return home.",
  },
];

function PillarPackageCard({ pkg, index, isInView, onBook }: {
  pkg: PillarPackage; index: number; isInView: boolean; onBook: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: Math.min(index * 0.07, 0.4) }}
      className="group bg-card rounded-2xl overflow-hidden border border-border shadow-card hover:-translate-y-2 hover:shadow-navy transition-all duration-300"
    >
      <Link href={`/packages/${pkg.slug}`} className="block relative h-48 overflow-hidden">
        <img
          src={pkg.heroImage}
          alt={`${pkg.shortTitle} from Chandigarh`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-transparent" />
        {pkg.badge && (
          <span className="absolute top-3 left-3 bg-secondary text-primary text-xs font-display font-700 px-2.5 py-1 rounded-full shadow-gold">
            {pkg.badge}
          </span>
        )}
        {pkg.rating > 0 && (
          <span className="absolute bottom-3 left-3 flex items-center gap-1 text-white/90 font-body text-xs">
            <Star className="w-3 h-3 fill-secondary text-secondary" />
            {pkg.rating} ({pkg.reviewCount} reviews)
          </span>
        )}
      </Link>
      <div className="p-5">
        <div className="flex items-center gap-1.5 text-muted-foreground font-body text-xs mb-1.5">
          <Clock className="w-3 h-3" /> {pkg.duration}
        </div>
        <h3 className="font-display font-700 text-primary text-base mb-3 leading-snug">
          {pkg.shortTitle}
        </h3>
        <div className="flex items-center gap-1.5 mb-4 text-muted-foreground font-body text-xs">
          <Phone className="w-3 h-3 text-secondary" /> Custom quote within 24 hours — no hidden charges
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/packages/${pkg.slug}`}
            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 border border-border text-primary font-display font-600 text-xs rounded-xl hover:bg-muted/50 transition-all"
          >
            View Details <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={onBook}
            className="flex-1 px-4 py-2.5 bg-gradient-gold text-primary font-display font-700 text-xs rounded-xl shadow-gold hover:opacity-90 transition-all"
          >
            Enquire Now
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function PillarDomesticClient({ packages }: { packages: PillarPackage[] }) {
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const gridRef = useRef(null);
  const gridInView = useInView(gridRef, { once: true, margin: "-60px" });

  return (
    <div className="min-h-screen bg-background font-body">
      <Navbar onInquiryOpen={() => setInquiryOpen(true)} />

      {/* ── HERO ───────────────────────────────────────────────── */}
      <section className="relative bg-gradient-navy pt-36 pb-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-secondary rounded-full blur-3xl -mr-48 -mt-48" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-secondary rounded-full blur-3xl -ml-36 -mb-36" />
        </div>
        <div className="container-custom relative text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <nav className="flex items-center justify-center gap-2 text-white/50 font-body text-xs mb-6">
              <Link href="/" className="hover:text-secondary transition-colors">Home</Link>
              <span>/</span>
              <span className="text-secondary">India Tour Packages from Chandigarh</span>
            </nav>
            <div className="inline-flex items-center gap-2 bg-secondary/20 border border-secondary/30 rounded-full px-4 py-1.5 mb-4">
              <Mountain className="w-3.5 h-3.5 text-secondary" />
              <span className="text-secondary text-xs font-body font-semibold tracking-widest uppercase">
                Kashmir · Vaishno Devi · Amritsar · Himachal
              </span>
            </div>
            <h1 className="font-display font-900 text-4xl sm:text-5xl text-white mb-4 leading-tight">
              India Tour Packages from Chandigarh
            </h1>
            <p className="text-white/65 font-body text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
              Kashmir houseboats, Vaishno Devi yatras, the Golden Temple, and Himachal's hill circuit —
              planned by a Mohali-based travel agency trusted since 2005. No visa, no passport, just pure India.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => setInquiryOpen(true)}
                className="px-8 py-4 bg-gradient-gold text-primary font-display font-700 rounded-full shadow-gold hover:opacity-90 hover:scale-105 transition-all duration-200 text-sm sm:text-base"
              >
                Get a Free Quote
              </button>
              <a
                href={`tel:${CONTACT.phoneE164}`}
                className="flex items-center gap-2 px-8 py-4 border-2 border-secondary/60 text-secondary font-display font-700 rounded-full hover:bg-secondary/10 transition-all duration-200 text-sm sm:text-base"
              >
                <Phone className="w-4 h-4" /> {CONTACT.phoneDisplay}
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── TRUST STATS ────────────────────────────────────────── */}
      <section className="bg-card border-b border-border">
        <div className="container-custom py-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {TRUST_STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-display font-800 text-primary text-lg sm:text-xl">{s.value}</div>
              <div className="text-muted-foreground font-body text-xs mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── INTRO ──────────────────────────────────────────────── */}
      <section className="section-padding bg-background">
        <div className="container-custom max-w-3xl mx-auto">
          <h2 className="font-display font-800 text-2xl sm:text-3xl text-primary mb-5">
            Plan Your Domestic Holiday or Yatra from the Chandigarh Tricity
          </h2>
          <div className="space-y-4 text-muted-foreground font-body leading-relaxed">
            <p>
              India&rsquo;s own mountains, lakes and shrines sit closer to Chandigarh than almost any
              international destination — Kashmir a short flight away, Vaishno Devi a night&rsquo;s
              journey via Katra, and the Golden Temple barely four hours down the highway. No visa,
              no passport, no currency exchange — just planning done right.
            </p>
            <p>
              Flywings Tour & Packages Pvt Ltd is a full-service travel agency in Phase 7, Mohali,
              planning domestic holidays and yatras since 2005. Every trip below is customised for
              families, honeymooners, and pilgrimage groups, and quoted with transport, hotels,
              transfers and sightseeing — one price, no surprises.
            </p>
          </div>
        </div>
      </section>

      {/* ── COMPARISON TABLE ───────────────────────────────────── */}
      <section className="section-padding bg-muted/40 pt-0">
        <div className="container-custom">
          <h2 className="font-display font-800 text-2xl sm:text-3xl text-primary mb-3 text-center">
            Compare Domestic Circuits from Chandigarh
          </h2>
          <p className="text-muted-foreground font-body text-sm text-center max-w-2xl mx-auto mb-8">
            Every trip includes transport, hotels, transfers &amp; sightseeing —
            get an itemised quote for your dates. Updated July 2026.
          </p>
          <div className="overflow-x-auto rounded-2xl border border-border shadow-card bg-card">
            <table className="w-full text-left font-body text-sm min-w-[720px]">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="px-5 py-4 font-display font-700">Region</th>
                  <th className="px-5 py-4 font-display font-700">Duration</th>
                  <th className="px-5 py-4 font-display font-700">How to Reach</th>
                  <th className="px-5 py-4 font-display font-700">Best Months</th>
                </tr>
              </thead>
              <tbody>
                {DOMESTIC_REGIONS.map((row, i) => (
                  <tr key={row.region} className={i % 2 ? "bg-muted/40" : "bg-card"}>
                    <td className="px-5 py-4">
                      {row.destinationSlug ? (
                        <Link
                          href={`/destinations/${row.destinationSlug}`}
                          className="font-display font-700 text-primary hover:text-secondary transition-colors"
                        >
                          {row.region}
                        </Link>
                      ) : (
                        <span className="font-display font-700 text-primary">{row.region}</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">{row.duration}</td>
                    <td className="px-5 py-4 text-muted-foreground">{row.howToReach}</td>
                    <td className="px-5 py-4 text-muted-foreground">{row.bestMonths}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── PACKAGES GRID ──────────────────────────────────────── */}
      {packages.length > 0 && (
        <section className="section-padding bg-background">
          <div className="container-custom" ref={gridRef}>
            <h2 className="font-display font-800 text-2xl sm:text-3xl text-primary mb-3 text-center">
              Our Best-Selling Domestic Package
            </h2>
            <p className="text-muted-foreground font-body text-sm text-center max-w-2xl mx-auto mb-10">
              Ready-to-book itineraries — customisable for your dates and budget.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {packages.map((pkg, i) => (
                <PillarPackageCard
                  key={pkg.slug}
                  pkg={pkg}
                  index={i}
                  isInView={gridInView}
                  onBook={() => setInquiryOpen(true)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── REGIONS WE COVER (guides) ──────────────────────────── */}
      <section className="section-padding bg-muted/40">
        <div className="container-custom">
          <h2 className="font-display font-800 text-2xl sm:text-3xl text-primary mb-3 text-center">
            More Regions We Plan — Custom Quote on Request
          </h2>
          <p className="text-muted-foreground font-body text-sm text-center max-w-2xl mx-auto mb-10">
            Not every circuit has a fixed package yet — read the in-depth guide, then call for a
            custom itinerary and quote.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {DOMESTIC_GUIDES.map((g) => (
              <Link
                key={g.href}
                href={g.href}
                className="group bg-card rounded-2xl border border-border shadow-card p-6 hover:-translate-y-1 hover:shadow-navy transition-all duration-300"
              >
                <h3 className="font-display font-700 text-primary text-base mb-2 group-hover:text-secondary transition-colors">
                  {g.title}
                </h3>
                <p className="text-muted-foreground font-body text-sm leading-relaxed mb-4">
                  {g.description}
                </p>
                <span className="inline-flex items-center gap-1.5 text-secondary font-display font-600 text-xs">
                  {g.cta} <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY US ─────────────────────────────────────────────── */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <h2 className="font-display font-800 text-2xl sm:text-3xl text-primary mb-10 text-center">
            Why Book Your India Trip with a Chandigarh-Based Agency
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {WHY_US.map(({ icon: Icon, title, text }) => (
              <div key={title} className="bg-card rounded-2xl border border-border shadow-card p-6">
                <div className="w-11 h-11 rounded-xl bg-secondary/15 border border-secondary/25 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-secondary" />
                </div>
                <h3 className="font-display font-700 text-primary text-base mb-2">{title}</h3>
                <p className="text-muted-foreground font-body text-sm leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────────── */}
      <section className="section-padding bg-muted/40">
        <div className="container-custom max-w-3xl mx-auto">
          <h2 className="font-display font-800 text-2xl sm:text-3xl text-primary mb-10 text-center">
            How Booking Works
          </h2>
          <ol className="space-y-6">
            {BOOKING_STEPS.map((step, i) => (
              <li key={step.title} className="flex gap-5">
                <span className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-gold text-primary font-display font-800 flex items-center justify-center shadow-gold">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-display font-700 text-primary text-base mb-1">{step.title}</h3>
                  <p className="text-muted-foreground font-body text-sm leading-relaxed">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────── */}
      <section className="section-padding bg-background">
        <div className="container-custom max-w-3xl mx-auto">
          <h2 className="font-display font-800 text-2xl sm:text-3xl text-primary mb-10 text-center">
            India Tour Packages from Chandigarh — FAQs
          </h2>
          <div className="space-y-3">
            {PILLAR_DOMESTIC_FAQS.map((faq) => (
              <details
                key={faq.question}
                className="group bg-card rounded-2xl border border-border shadow-card px-6 py-4"
              >
                <summary className="font-display font-700 text-primary text-sm sm:text-base cursor-pointer list-none flex items-center justify-between gap-4">
                  {faq.question}
                  <span className="text-secondary transition-transform group-open:rotate-90">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </summary>
                <p className="text-muted-foreground font-body text-sm leading-relaxed mt-3">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── GUIDES ─────────────────────────────────────────────── */}
      <section className="section-padding bg-muted/40">
        <div className="container-custom max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-secondary/15 border border-secondary/25 rounded-full px-4 py-1.5 mb-4">
            <BookOpen className="w-3.5 h-3.5 text-secondary" />
            <span className="text-primary text-xs font-body font-semibold tracking-widest uppercase">Travel Guides</span>
          </div>
          <h2 className="font-display font-800 text-2xl sm:text-3xl text-primary mb-4">
            Research Your Trip Like a Pro
          </h2>
          <p className="text-muted-foreground font-body text-sm max-w-xl mx-auto mb-8">
            In-depth, regularly updated guides written by our travel consultants — routes, itineraries,
            and money-saving tips for travellers from Chandigarh and Punjab.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/blog/kashmir-tour-package-from-chandigarh"
              className="px-6 py-3 border border-border text-primary font-display font-600 text-sm rounded-full hover:bg-muted/50 transition-all"
            >
              Kashmir Tour Package: Complete Guide
            </Link>
            <Link
              href="/international-tour-packages-from-chandigarh"
              className="px-6 py-3 border border-border text-primary font-display font-600 text-sm rounded-full hover:bg-muted/50 transition-all"
            >
              International Packages from Chandigarh
            </Link>
            <Link
              href="/blog"
              className="px-6 py-3 border border-border text-primary font-display font-600 text-sm rounded-full hover:bg-muted/50 transition-all"
            >
              View All Guides <ArrowRight className="w-3.5 h-3.5 inline ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────── */}
      <section className="section-padding bg-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-80 h-80 bg-secondary rounded-full blur-3xl -mr-40 -mt-40" />
        </div>
        <div className="container-custom relative text-center">
          <h2 className="font-display font-800 text-3xl sm:text-4xl text-white mb-4">
            Ready for Your Next India Trip?
          </h2>
          <p className="text-white/60 font-body max-w-xl mx-auto mb-8">
            Get a customised itinerary with transport, hotels, and sightseeing — free of cost,
            within 24 hours.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setInquiryOpen(true)}
              className="px-8 py-4 bg-gradient-gold text-primary font-display font-700 rounded-full shadow-gold hover:opacity-90 hover:scale-105 transition-all duration-200"
            >
              Get a Free Custom Quote
            </button>
            <a
              href={`tel:${CONTACT.phoneE164}`}
              className="flex items-center gap-2 px-8 py-4 border-2 border-secondary/60 text-secondary font-display font-700 rounded-full hover:bg-secondary/10 transition-all duration-200"
            >
              <Phone className="w-4 h-4" /> Call {CONTACT.phoneDisplay}
            </a>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
      <InquiryModal isOpen={inquiryOpen} onClose={() => setInquiryOpen(false)} />
    </div>
  );
}
