"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { MapPin, ArrowRight, Search, Filter } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import InquiryModal from "@/components/InquiryModal";
import destinations from "@/data/destinations";

const REGIONS = ["All", "Middle East", "Southeast Asia", "South Asia", "Indian Ocean", "Central Asia"];

const regionMap: Record<string, string[]> = {
  "Middle East": ["dubai"],
  "Southeast Asia": ["thailand", "bali", "singapore", "malaysia"],
  "South Asia": ["kashmir"],
  "Indian Ocean": ["maldives"],
  "Central Asia": ["almaty"],
};

export default function DestinationsListClient() {
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeRegion, setActiveRegion] = useState("All");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  const filtered = destinations.filter((d) => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.country.toLowerCase().includes(search.toLowerCase());
    const matchRegion = activeRegion === "All" || regionMap[activeRegion]?.includes(d.slug);
    return matchSearch && matchRegion;
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
              <span className="text-secondary">Destinations</span>
            </nav>
            <div className="inline-flex items-center gap-2 bg-secondary/20 border border-secondary/30 rounded-full px-4 py-1.5 mb-4">
              <MapPin className="w-3.5 h-3.5 text-secondary" />
              <span className="text-secondary text-xs font-body font-semibold tracking-widest uppercase">Explore The World</span>
            </div>
            <h1 className="font-display font-900 text-4xl sm:text-5xl text-white mb-4 leading-tight">
              Our Travel Destinations
            </h1>
            <p className="text-white/65 font-body text-lg max-w-xl mx-auto mb-8 leading-relaxed">
              Handpicked destinations across the globe — each one a masterpiece waiting to be explored with Flywings.
            </p>
            {/* Search */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search destinations..."
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
        <div className="container-custom py-3">
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
            <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            {REGIONS.map((region) => (
              <button
                key={region}
                onClick={() => setActiveRegion(region)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-body font-semibold transition-all duration-200 ${
                  activeRegion === region
                    ? "bg-primary text-secondary shadow-navy"
                    : "bg-muted text-muted-foreground hover:bg-muted/70"
                }`}
              >
                {region}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── DESTINATION GRID ───────────────────────────────────── */}
      <section className="section-padding bg-background">
        <div className="container-custom" ref={ref}>
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🌍</div>
              <h3 className="font-display font-700 text-primary text-xl mb-2">No destinations found</h3>
              <p className="text-muted-foreground font-body text-sm">Try a different search or region filter.</p>
            </div>
          ) : (
            <>
              <p className="text-muted-foreground font-body text-sm mb-8">
                Showing <span className="font-semibold text-primary">{filtered.length}</span> destination{filtered.length !== 1 ? "s" : ""}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
                {filtered.map((dest, i) => (
                  <motion.div
                    key={dest.slug}
                    initial={{ opacity: 0, y: 40 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                    className="group relative rounded-2xl overflow-hidden shadow-card hover:shadow-navy transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                  >
                    {/* Image */}
                    <div className="relative h-72 overflow-hidden">
                      <img
                        src={dest.heroImage}
                        alt={`${dest.name} tour packages from India`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-card" />
                      <div className="absolute top-4 left-4 flex items-center gap-1 bg-black/30 backdrop-blur-sm px-2.5 py-1 rounded-full">
                        <MapPin className="w-3 h-3 text-secondary" />
                        <span className="text-white/90 text-xs font-body">{dest.country}</span>
                      </div>
                    </div>

                    {/* Info overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <div className="flex items-center gap-1.5 mb-1 text-secondary/80 font-body text-xs">
                        <span>Best time: {dest.bestTime}</span>
                      </div>
                      <h2 className="font-display font-800 text-2xl text-white mb-1">{dest.name}</h2>
                      <p className="text-white/70 font-body text-xs leading-relaxed mb-4 max-h-0 overflow-hidden group-hover:max-h-20 transition-all duration-300">
                        {dest.tagline}
                      </p>
                      <Link
                        href={`/destinations/${dest.slug}`}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-secondary text-primary font-display font-700 text-sm rounded-full shadow-gold hover:opacity-90 transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-300"
                      >
                        Explore Packages <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ── CTA BANNER ─────────────────────────────────────────── */}
      <section className="section-padding bg-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-80 h-80 bg-secondary rounded-full blur-3xl -mr-40 -mt-40" />
        </div>
        <div className="container-custom relative text-center">
          <h2 className="font-display font-800 text-3xl sm:text-4xl text-white mb-4">
            Can't Find Your Dream Destination?
          </h2>
          <p className="text-white/60 font-body max-w-xl mx-auto mb-8">
            We craft custom itineraries to any corner of the world. Talk to our travel experts and let's plan your perfect trip.
          </p>
          <button
            onClick={() => setInquiryOpen(true)}
            className="px-8 py-4 bg-gradient-gold text-primary font-display font-700 rounded-full shadow-gold hover:opacity-90 hover:scale-105 transition-all duration-200"
          >
            Get a Custom Quote
          </button>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
      <InquiryModal isOpen={inquiryOpen} onClose={() => setInquiryOpen(false)} />
    </div>
  );
}
