"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useInView } from "framer-motion";
import {
  Clock, Star, Plane, Hotel, Utensils, ArrowRight,
  Search, Filter, Tag, Users, CreditCard,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import InquiryModal from "@/components/InquiryModal";
import type { TourData } from "@/lib/tours";

const FILTERS = ["All", "Dubai", "Thailand", "Bali", "Kashmir", "Maldives", "Singapore"];
const BUDGETS = ["All Budgets", "Under ₹30k", "₹30k–₹60k", "₹60k–₹90k", "Above ₹90k"];

function matchesBudget(price: string, budget: string) {
  const num = parseInt(price.replace(/[₹,]/g, ""));
  if (budget === "Under ₹30k") return num < 30000;
  if (budget === "₹30k–₹60k") return num >= 30000 && num < 60000;
  if (budget === "₹60k–₹90k") return num >= 60000 && num < 90000;
  if (budget === "Above ₹90k") return num >= 90000;
  return true;
}

function PackageCard({ pkg, index, isInView, onBook }: {
  pkg: TourData; index: number; isInView: boolean; onBook: () => void;
}) {
  const router = useRouter();
  const inclusionPills = [
    { label: "Flights", icon: Plane },
    { label: pkg.hotelCategory, icon: Hotel },
    { label: pkg.mealsIncluded.split(" ")[0], icon: Utensils },
  ].filter((p) => p.label);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: Math.min(index * 0.07, 0.4) }}
      onClick={() => router.push(`/packages/${pkg.slug}`)}
      className={`group relative bg-card rounded-2xl overflow-hidden border transition-all duration-300 hover:-translate-y-2 hover:shadow-navy cursor-pointer ${
        pkg.badge === "Best Seller" || pkg.badge === "Romantic"
          ? "border-secondary/30 shadow-gold ring-1 ring-secondary/10"
          : "border-border shadow-card"
      }`}
    >
      {/* Hero Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={pkg.heroImages[0]}
          alt={pkg.shortTitle}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-transparent" />
        {pkg.badge && (
          <div className="absolute top-3 left-3 flex items-center gap-1 bg-secondary text-primary text-xs font-display font-700 px-2.5 py-1 rounded-full shadow-gold">
            <Tag className="w-3 h-3" /> {pkg.badge}
          </div>
        )}
        {pkg.rating > 0 && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-3 h-3 ${i < Math.floor(pkg.rating) ? "fill-secondary text-secondary" : "text-white/20"}`} />
            ))}
            <span className="text-white/80 font-body text-xs ml-1">{pkg.rating} ({pkg.reviewCount})</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {pkg.duration && (
          <div className="flex items-center gap-1.5 text-muted-foreground font-body text-xs mb-1.5">
            <Clock className="w-3 h-3" /> {pkg.duration}
          </div>
        )}
        <h3 className="font-display font-700 text-primary text-base mb-3 leading-snug line-clamp-2">
          {pkg.shortTitle}
        </h3>

        {/* Destinations */}
        {pkg.destinations.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {pkg.destinations.slice(0, 3).map((d) => (
              <span key={d} className="text-[11px] font-body bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{d}</span>
            ))}
          </div>
        )}

        {/* Inclusions */}
        {(inclusionPills.length > 0 || pkg.transferIncluded) && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {inclusionPills.map(({ label, icon: Icon }) => (
              <span key={label} className="inline-flex items-center gap-1 text-[11px] font-body bg-secondary/10 text-primary px-2 py-0.5 rounded-full border border-secondary/20">
                <Icon className="w-3 h-3 text-secondary" /> {label}
              </span>
            ))}
            {pkg.transferIncluded && (
              <span className="inline-flex items-center gap-1 text-[11px] font-body bg-secondary/10 text-primary px-2 py-0.5 rounded-full border border-secondary/20">
                <Users className="w-3 h-3 text-secondary" /> Transfers
              </span>
            )}
          </div>
        )}

        {/* Price + CTA */}
        <div className="flex items-end justify-between gap-3">
          <div>
            {pkg.originalPrice && pkg.originalPrice !== pkg.startingPrice && (
              <div className="text-muted-foreground line-through text-xs font-body">{pkg.originalPrice}</div>
            )}
            <div className="text-primary font-display font-900 text-2xl">{pkg.startingPrice || "Enquire"}</div>
            <div className="text-muted-foreground font-body text-xs">/person</div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Link
              href={`/packages/${pkg.slug}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-gold text-primary font-display font-700 text-xs rounded-xl shadow-gold hover:opacity-90 transition-all"
            >
              View Details <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={(e) => { e.stopPropagation(); onBook(); }}
              className="px-4 py-2 bg-primary text-secondary font-display font-600 text-xs rounded-xl hover:opacity-90 transition-all"
            >
              Book Now
            </button>
          </div>
        </div>

        {pkg.emiAvailable && (
          <div className="mt-3 flex items-center gap-1.5 text-muted-foreground font-body text-xs">
            <CreditCard className="w-3 h-3 text-secondary" />
            Zero-cost EMI available
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function PackagesClient({ packages }: { packages: TourData[] }) {
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeDestination, setActiveDestination] = useState("All");
  const [activeBudget, setActiveBudget] = useState("All Budgets");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  const filtered = packages.filter((pkg) => {
    const matchSearch =
      pkg.shortTitle.toLowerCase().includes(search.toLowerCase()) ||
      pkg.destinations.some((d) => d.toLowerCase().includes(search.toLowerCase()));
    const matchDest = activeDestination === "All" ||
      pkg.destinations.some((d) => d.toLowerCase().includes(activeDestination.toLowerCase())) ||
      pkg.destinationSlug.toLowerCase().includes(activeDestination.toLowerCase());
    const matchBudget = matchesBudget(pkg.startingPrice, activeBudget);
    return matchSearch && matchDest && matchBudget;
  });

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
            {/* Breadcrumb */}
            <nav className="flex items-center justify-center gap-2 text-white/50 font-body text-xs mb-6">
              <Link href="/" className="hover:text-secondary transition-colors">Home</Link>
              <span>/</span>
              <span className="text-secondary">Tour Packages</span>
            </nav>
            <div className="inline-flex items-center gap-2 bg-secondary/20 border border-secondary/30 rounded-full px-4 py-1.5 mb-4">
              <Plane className="w-3.5 h-3.5 text-secondary" />
              <span className="text-secondary text-xs font-body font-semibold tracking-widest uppercase">All Tour Packages</span>
            </div>
            <h1 className="font-display font-900 text-4xl sm:text-5xl text-white mb-4 leading-tight">
              Our Premium Tour Packages
            </h1>
            <p className="text-white/65 font-body text-lg max-w-xl mx-auto mb-8 leading-relaxed">
              Thoughtfully designed packages combining the best destinations, stays, and experiences — at unbeatable value.
            </p>
            {/* Search */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search packages..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-full bg-white text-primary font-body text-sm outline-none focus:ring-2 focus:ring-secondary/50 shadow-lg"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FILTERS ────────────────────────────────────────────── */}
      <section className="bg-card border-b border-border sticky top-20 z-30">
        <div className="container-custom py-3 space-y-2">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            <Filter className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setActiveDestination(f)}
                className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-body font-semibold transition-all ${
                  activeDestination === f
                    ? "bg-primary text-secondary shadow-navy"
                    : "bg-muted text-muted-foreground hover:bg-muted/70"
                }`}
              >
                {f}
              </button>
            ))}
            <div className="w-px h-4 bg-border mx-1 flex-shrink-0" />
            {BUDGETS.map((b) => (
              <button
                key={b}
                onClick={() => setActiveBudget(b)}
                className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-body font-semibold transition-all ${
                  activeBudget === b
                    ? "bg-secondary text-primary shadow-gold"
                    : "bg-muted text-muted-foreground hover:bg-muted/70"
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── PACKAGES GRID ──────────────────────────────────────── */}
      <section className="section-padding bg-background">
        <div className="container-custom" ref={ref}>
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">✈️</div>
              <h3 className="font-display font-700 text-primary text-xl mb-2">No packages found</h3>
              <p className="text-muted-foreground font-body text-sm mb-6">Try adjusting your filters or search term.</p>
              <button
                onClick={() => { setSearch(""); setActiveDestination("All"); setActiveBudget("All Budgets"); }}
                className="px-6 py-3 bg-gradient-gold text-primary font-display font-700 rounded-full shadow-gold hover:opacity-90 transition-all"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <p className="text-muted-foreground font-body text-sm mb-8">
                Showing <span className="font-semibold text-primary">{filtered.length}</span> package{filtered.length !== 1 ? "s" : ""}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
                {filtered.map((pkg, i) => (
                  <PackageCard
                    key={pkg.slug}
                    pkg={pkg}
                    index={i}
                    isInView={isInView}
                    onBook={() => setInquiryOpen(true)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────── */}
      <section className="section-padding bg-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-80 h-80 bg-secondary rounded-full blur-3xl -mr-40 -mt-40" />
        </div>
        <div className="container-custom relative text-center">
          <h2 className="font-display font-800 text-3xl sm:text-4xl text-white mb-4">
            Need a Custom Package?
          </h2>
          <p className="text-white/60 font-body max-w-xl mx-auto mb-8">
            We build bespoke itineraries for every type of traveler. Talk to our experts and get a personalized quote.
          </p>
          <button
            onClick={() => setInquiryOpen(true)}
            className="px-8 py-4 bg-gradient-gold text-primary font-display font-700 rounded-full shadow-gold hover:opacity-90 hover:scale-105 transition-all duration-200"
          >
            Get a Free Custom Quote
          </button>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
      <InquiryModal isOpen={inquiryOpen} onClose={() => setInquiryOpen(false)} />
    </div>
  );
}
