"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { MapPin, ArrowRight, Search, Filter, ChevronDown } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import InquiryModal from "@/components/InquiryModal";
import LinkedText from "@/components/LinkedText";
import destinations, { type Destination } from "@/data/destinations";
import { DESTINATIONS_FAQS } from "@/data/destinationsPage";

const REGIONS = ["All", "South Asia", "Middle East", "Southeast Asia", "Central Asia"];

// Maldives moves in with the Indian destinations, which is where it
// belongs geographically and leaves no chip holding a single card. The
// group is "South Asia" rather than "India" because Maldives is not.
const regionMap: Record<string, string[]> = {
  "South Asia": ["himachal", "kashmir", "manali", "shimla-manali", "goa", "spiti-valley", "maldives"],
  "Middle East": ["dubai"],
  "Southeast Asia": ["thailand", "bali", "singapore", "malaysia", "vietnam"],
  "Central Asia": ["almaty"],
};

/* ─── Card ─────────────────────────────────────────────────────────────── */

/**
 * Lifted out of the grid when the page split into an international and
 * a domestic section, so both render the same card.
 *
 * Heading level is h3: the two section headings are the h2s now, and a
 * card is a thing inside a section, not a peer of it.
 */
function DestinationCard({ dest, index, isInView }: { dest: Destination; index: number; isInView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: Math.min(index, 5) * 0.08 }}
      className="group relative rounded-2xl overflow-hidden shadow-card hover:shadow-navy transition-all duration-300 hover:-translate-y-1"
    >
      {/*
        The card used to show a pointer cursor and lift on hover while
        only the button inside it was a link, and that button was
        invisible until hover. The whole card is the link now; the
        button below is styled text inside it, not a second anchor,
        because an anchor inside an anchor is invalid HTML.
      */}
      <Link href={`/destinations/${dest.slug}`} aria-label={`${dest.name} tour packages`} className="block">
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
          <h3 className="font-display font-800 text-2xl text-white mb-1">{dest.name}</h3>
          <p className="text-white/70 font-body text-xs leading-relaxed mb-4 max-h-0 overflow-hidden group-hover:max-h-20 transition-all duration-300">
            {dest.tagline}
          </p>
          <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-secondary text-primary font-display font-700 text-sm rounded-full shadow-gold group-hover:opacity-90 transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-300">
            Explore Packages <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

/* ─── FAQ ──────────────────────────────────────────────────────────────── */

function FaqItem({ faq, index }: { faq: { question: string; answer: string }; index: number }) {
  const [open, setOpen] = useState(index === 0);
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-muted/40 transition-colors"
      >
        <span className="font-display font-700 text-primary text-sm sm:text-base">{faq.question}</span>
        <ChevronDown
          className={`w-5 h-5 text-secondary flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="px-5 pb-5 pt-1 border-t border-border">
          <p className="text-muted-foreground font-body text-sm leading-relaxed">
            <LinkedText text={faq.answer} />
          </p>
        </div>
      )}
    </div>
  );
}

/* ─── Page ─────────────────────────────────────────────────────────────── */

export default function DestinationsListClient() {
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeRegion, setActiveRegion] = useState("All");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  const filtered = destinations.filter((d) => {
    // Hidden entries stay reachable by search, just not by default: a
    // visitor typing "shimla" should still find the circuit.
    if (d.listed === false && !search.trim()) return false;
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.country.toLowerCase().includes(search.toLowerCase());
    const matchRegion = activeRegion === "All" || regionMap[activeRegion]?.includes(d.slug);
    return matchSearch && matchRegion;
  });

  // The split the page is built around. Anything in India is domestic;
  // everything else needs a flight and a passport.
  const international = filtered.filter((d) => d.country !== "India");
  const domestic = filtered.filter((d) => d.country === "India");

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
            <h1 className="font-display font-900 text-4xl sm:text-5xl text-white mb-5 leading-tight">
              Explore the World's Most Beautiful Travel Destinations
            </h1>
            <div className="text-white/65 font-body text-base sm:text-lg max-w-3xl mx-auto mb-8 leading-relaxed space-y-4 text-left sm:text-center">
              <p>
                Discover extraordinary places, experience different cultures and create unforgettable
                memories with Flywings Tour &amp; Packages. From the stunning beaches of Bali and
                Maldives to the vibrant streets of Dubai and Singapore, explore handpicked holiday
                destinations for every kind of traveller.
              </p>
              <p>
                Whether you are planning an international getaway, a romantic honeymoon, a family
                vacation or an adventurous domestic trip, we help you find the right destination and
                holiday package. Explore our popular destinations and start planning your next journey
                with a trusted travel agency in Mohali and Chandigarh.
              </p>
            </div>
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

      {/* ── DESTINATIONS ───────────────────────────────────────── */}
      <section className="section-padding bg-background">
        <div className="container-custom" ref={ref}>
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🌍</div>
              <h2 className="font-display font-700 text-primary text-xl mb-2">No destinations found</h2>
              <p className="text-muted-foreground font-body text-sm">Try a different search or region filter.</p>
            </div>
          ) : (
            <div className="space-y-16">
              {/*
                Both sections are filtered by the search box and the
                region chips above, so either can come back empty. An
                empty one is dropped rather than left as a heading over
                nothing.
              */}
              {international.length > 0 && (
                <div>
                  <h2 className="font-display font-800 text-3xl sm:text-4xl text-primary mb-4">
                    Popular International Destinations
                  </h2>
                  <div className="text-muted-foreground font-body max-w-3xl leading-relaxed mb-8 space-y-3">
                    <p>
                      Explore some of the world's most exciting holiday destinations with carefully
                      planned international tour packages. From beautiful island escapes and cultural
                      experiences to modern city attractions, find a destination that matches your
                      travel interests and budget.
                    </p>
                    <p>
                      Discover breathtaking landscapes, exciting activities, iconic attractions and
                      memorable experiences across these international destinations.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
                    {international.map((dest, i) => (
                      <DestinationCard key={dest.slug} dest={dest} index={i} isInView={isInView} />
                    ))}
                  </div>
                </div>
              )}

              {domestic.length > 0 && (
                <div>
                  <h2 className="font-display font-800 text-3xl sm:text-4xl text-primary mb-4">
                    Explore Beautiful Domestic Destinations
                  </h2>
                  <div className="text-muted-foreground font-body max-w-3xl leading-relaxed mb-8 space-y-3">
                    <p>
                      India offers incredible travel experiences, from snow-covered mountains and
                      peaceful valleys to beautiful hill stations and scenic landscapes. Explore popular
                      Indian holiday destinations and plan memorable trips with customized domestic tour
                      packages.
                    </p>
                    <p>
                      Whether you are looking for a relaxing family vacation, a romantic honeymoon or an
                      adventurous mountain escape, discover destinations that make every journey special.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
                    {domestic.map((dest, i) => (
                      <DestinationCard key={dest.slug} dest={dest} index={i} isInView={isInView} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ── HELP CHOOSING ──────────────────────────────────────── */}
      <section className="section-padding bg-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-80 h-80 bg-secondary rounded-full blur-3xl -mr-40 -mt-40" />
        </div>
        <div className="container-custom relative text-center">
          <h2 className="font-display font-800 text-3xl sm:text-4xl text-white mb-4">
            Find Your Perfect Holiday Destination
          </h2>
          <div className="text-white/65 font-body max-w-3xl mx-auto mb-8 leading-relaxed space-y-3">
            <p>
              Not sure where to travel next? Whether you dream of exploring international cities,
              relaxing on tropical beaches or enjoying the peaceful beauty of Indian mountains, we can
              help you choose a destination that suits your travel plans.
            </p>
            <p>
              Explore our holiday packages, compare destinations and connect with our travel experts to
              plan your next vacation. From family holidays and honeymoon trips to international
              getaways, make every journey memorable with Flywings Tour &amp; Packages.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setInquiryOpen(true)}
              className="px-8 py-4 bg-gradient-gold text-primary font-display font-700 rounded-full shadow-gold hover:opacity-90 hover:scale-105 transition-all duration-200"
            >
              Get a Custom Quote
            </button>
            <Link
              href="/packages"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 border border-white/20 text-white font-display font-700 rounded-full hover:bg-white/20 transition-colors"
            >
              Browse holiday packages <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────── */}
      <section className="section-padding bg-background">
        <div className="container-custom max-w-3xl">
          <h2 className="font-display font-800 text-3xl sm:text-4xl text-primary mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {DESTINATIONS_FAQS.map((faq, i) => (
              <FaqItem key={faq.question} faq={faq} index={i} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
      <InquiryModal isOpen={inquiryOpen} onClose={() => setInquiryOpen(false)} />
    </div>
  );
}
