"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { Clock, Utensils, Hotel, Plane, ArrowRight } from "lucide-react";
import type { FeaturedPackageCard } from "@/lib/tours";

/*
 * The cards are built on the server by getFeaturedPackageCards() in
 * lib/tours.ts, from the same package data the detail pages render, so
 * a card cannot advertise a different trip from the page it opens.
 * Which packages appear is set with "Feature on the homepage" in the
 * WordPress package editor.
 */
type FeaturedPackage = FeaturedPackageCard;

interface PackageCardProps {
  pkg: FeaturedPackage;
  index: number;
  isInView: boolean;
}

function PackageCard({ pkg, index, isInView }: PackageCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      {/*
        The card used to be a div with an onClick that called
        router.push, so it was invisible to search engines, could not be
        opened in a new tab, and did nothing without JavaScript. It is a
        link now, and the button inside it is styled text.
      */}
      <Link
        href={`/packages/${pkg.slug}`}
        className={`group relative flex flex-col h-full bg-white rounded-2xl overflow-hidden border transition-all duration-300 hover:-translate-y-2 hover:shadow-navy ${
          pkg.featured
            ? "border-gold shadow-gold ring-1 ring-gold/20"
            : "border-border shadow-card"
        }`}
      >
        {/* Badge */}
        {pkg.badge && (
          <div className={`absolute top-4 left-4 z-10 px-3 py-1 text-xs font-display font-700 rounded-full ${
            pkg.featured ? "bg-gold text-navy" : "bg-navy text-gold"
          }`}>
            {pkg.badge}
          </div>
        )}

        {/* Header */}
        <div className={`px-6 pb-5 ${pkg.badge ? "pt-12" : "pt-8"} ${pkg.featured ? "bg-gradient-to-r from-navy to-navy-light" : "bg-muted/30"}`}>
          <div className={`text-xs font-body uppercase tracking-widest mb-1 ${pkg.featured ? "text-gold/80" : "text-muted-foreground"}`}>
            {pkg.destination}
          </div>
          <h3 className={`font-display font-800 text-xl mb-2 ${pkg.featured ? "text-white" : "text-navy"}`}>
            {pkg.name}
          </h3>
          <div className={`flex items-center gap-1 text-xs font-body ${pkg.featured ? "text-white/60" : "text-muted-foreground"}`}>
            <Clock className="w-3.5 h-3.5" />
            {pkg.duration}
          </div>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col flex-1">
          <div className="flex flex-wrap gap-2 mb-5">
            {pkg.chips.map((chip) => (
              <span key={chip} className="px-2.5 py-1 bg-muted text-muted-foreground text-xs font-body rounded-full flex items-center gap-1">
                {chip === "Flights" && <Plane className="w-3 h-3" />}
                {/Hotel|Houseboat|Villa|Resort|Star/.test(chip) && <Hotel className="w-3 h-3" />}
                {/Meal|Breakfast|Dinner|Board/.test(chip) && <Utensils className="w-3 h-3" />}
                {chip}
              </span>
            ))}
          </div>

          <span
            className={`mt-auto w-full flex items-center justify-center gap-2 py-3 rounded-xl font-display font-700 text-sm transition-all duration-200 group-hover:scale-105 ${
              pkg.featured
                ? "bg-gradient-gold text-navy shadow-gold"
                : "bg-navy text-gold group-hover:bg-navy-dark"
            }`}
          >
            View Package <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

interface TourPackagesProps {
  packages: FeaturedPackage[];
  onBook: () => void;
}

export default function TourPackages({ packages, onBook }: TourPackagesProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="packages" className="section-padding bg-muted/30">
      <div className="container-custom" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-block px-4 py-1 bg-gold/10 border border-gold/30 text-gold text-xs font-body font-medium tracking-widest uppercase rounded-full mb-4">
            Featured Packages
          </span>
          <h2 className="font-display font-800 text-3xl sm:text-4xl text-navy mb-4">
            Premium Tour Packages
          </h2>
          <p className="text-muted-foreground font-body max-w-xl mx-auto leading-relaxed">
            Thoughtfully designed packages that combine the best experiences at unbeatable value.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg, i) => (
            <PackageCard key={pkg.slug} pkg={pkg} index={i} isInView={isInView} />
          ))}
        </div>

        {/*
          The cards are links now, so the enquiry form lost the entry
          point it used to have as their click fallback. It gets its own
          here, next to the route to the rest of the packages.
        */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/packages"
            className="inline-flex items-center gap-2 px-6 py-3 bg-navy text-gold font-display font-700 text-sm rounded-full hover:bg-navy-dark transition-colors"
          >
            See all packages <ArrowRight className="w-4 h-4" />
          </Link>
          <button
            type="button"
            onClick={onBook}
            className="inline-flex items-center gap-2 px-6 py-3 bg-muted text-navy font-display font-700 text-sm rounded-full hover:bg-muted/70 transition-colors"
          >
            Ask for a custom quote
          </button>
        </div>
      </div>
    </section>
  );
}
