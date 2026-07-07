"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import { Clock, Utensils, Hotel, Plane, ArrowRight, Star } from "lucide-react";

interface Package {
  name: string;
  destination: string;
  duration: string;
  price: string;
  originalPrice: string;
  rating: number;
  inclusions: string[];
  badge?: string;
  featured?: boolean;
}

const packages: Package[] = [
  {
    name: "Dubai Discovery",
    destination: "UAE",
    duration: "5 Nights / 6 Days",
    price: "₹49,999",
    originalPrice: "₹65,000",
    rating: 4.9,
    inclusions: ["Flights", "5★ Hotel", "Desert Safari", "City Tour", "Meals"],
    badge: "Best Seller",
    featured: true,
  },
  {
    name: "Thailand Explorer",
    destination: "Bangkok & Phuket",
    duration: "6 Nights / 7 Days",
    price: "₹34,999",
    originalPrice: "₹48,000",
    rating: 4.8,
    inclusions: ["Flights", "4★ Hotel", "Island Tour", "Meals", "Transfers"],
    badge: "Hot Deal",
  },
  {
    name: "Bali Bliss",
    destination: "Indonesia",
    duration: "5 Nights / 6 Days",
    price: "₹36,999",
    originalPrice: "₹50,000",
    rating: 4.9,
    inclusions: ["Flights", "Resort Stay", "Temple Visit", "Spa", "Breakfast"],
    badge: "Romantic",
  },
  {
    name: "Kashmir Paradise",
    destination: "India",
    duration: "4 Nights / 5 Days",
    price: "₹22,999",
    originalPrice: "₹32,000",
    rating: 4.7,
    inclusions: ["Flights", "Houseboat", "Shikara Ride", "Meals", "Gulmarg"],
    badge: "Family Fav",
  },
  {
    name: "Maldives Luxury",
    destination: "Maldives",
    duration: "4 Nights / 5 Days",
    price: "₹89,999",
    originalPrice: "₹1,10,000",
    rating: 5.0,
    inclusions: ["Flights", "Water Villa", "All Meals", "Snorkeling", "Spa"],
    badge: "Ultra Luxury",
  },
  {
    name: "Singapore Escape",
    destination: "Singapore",
    duration: "4 Nights / 5 Days",
    price: "₹42,999",
    originalPrice: "₹57,000",
    rating: 4.8,
    inclusions: ["Flights", "4★ Hotel", "Universal Studios", "Meals", "City Tour"],
    badge: "",
  },
];

interface PackageCardProps {
  pkg: Package;
  index: number;
  isInView: boolean;
  onBook: () => void;
}

function PackageCard({ pkg, index, isInView, onBook }: PackageCardProps) {
  const router = useRouter();
  const slugMap: Record<string, string> = {
    "Dubai Discovery": "dubai-luxury-5n6d",
    "Thailand Explorer": "thailand-explorer-7n8d",
    "Bali Bliss": "bali-romance-6n7d",
    "Kashmir Paradise": "kashmir-family-4n5d",
    "Maldives Luxury": "maldives-luxury-4n5d",
    "Singapore Escape": "singapore-escape-4n5d",
  };
  const handleView = () => {
    const slug = slugMap[pkg.name];
    if (slug) router.push(`/packages/${slug}`);
    else onBook();
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      onClick={handleView}
      className={`group relative bg-white rounded-2xl overflow-hidden border transition-all duration-300 hover:-translate-y-2 hover:shadow-navy cursor-pointer ${
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

        {/* Rating */}
        <div className="flex items-center gap-1 mt-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3 h-3 ${i < Math.floor(pkg.rating) ? "text-gold fill-gold" : "text-gold/30"}`}
            />
          ))}
          <span className={`text-xs font-body ml-1 ${pkg.featured ? "text-white/70" : "text-muted-foreground"}`}>
            {pkg.rating}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-6">
        {/* Inclusions */}
        <div className="flex flex-wrap gap-2 mb-5">
          {pkg.inclusions.map((inc) => (
            <span key={inc} className="px-2.5 py-1 bg-muted text-muted-foreground text-xs font-body rounded-full flex items-center gap-1">
              {inc === "Flights" && <Plane className="w-3 h-3" />}
              {(inc.includes("Hotel") || inc === "Houseboat" || inc === "Water Villa" || inc === "Resort Stay") && <Hotel className="w-3 h-3" />}
              {(inc === "Meals" || inc === "Breakfast" || inc === "All Meals") && <Utensils className="w-3 h-3" />}
              {inc}
            </span>
          ))}
        </div>

        {/* Price */}
        <div className="flex items-end gap-2 mb-5">
          <div>
            <div className="text-muted-foreground font-body text-xs line-through">{pkg.originalPrice}</div>
            <div className="font-display font-900 text-2xl text-primary">{pkg.price}</div>
          </div>
          <div className="text-muted-foreground text-xs font-body font-medium pb-1">
            /person
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={handleView}
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-display font-700 text-sm transition-all duration-200 hover:scale-105 ${
            pkg.featured
              ? "bg-gradient-gold text-navy shadow-gold"
              : "bg-navy text-gold hover:bg-navy-dark"
          }`}
        >
          View Package <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

interface TourPackagesProps {
  onBook: () => void;
}

export default function TourPackages({ onBook }: TourPackagesProps) {
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
            <PackageCard key={pkg.name} pkg={pkg} index={i} isInView={isInView} onBook={onBook} />
          ))}
        </div>
      </div>
    </section>
  );
}
