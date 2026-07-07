"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";

const dubaiImg = "/assets/dubai.jpg";
const thailandImg = "/assets/thailand.jpg";
const baliImg = "/assets/bali.jpg";
const kashmirImg = "/assets/kashmir.jpg";
const singaporeImg = "/assets/singapore.jpg";
const maldivesImg = "/assets/maldives.jpg";

const destinations = [
  { name: "Dubai", slug: "dubai", country: "UAE", image: dubaiImg, price: "₹45,999", description: "Luxury skyscrapers, golden desert safaris, and world-class shopping awaits.", badge: "Most Popular" },
  { name: "Thailand", slug: "thailand", country: "Southeast Asia", image: thailandImg, price: "₹28,999", description: "Pristine beaches, rich culture, ancient temples, and vibrant street life.", badge: "Best Value" },
  { name: "Bali", slug: "bali", country: "Indonesia", image: baliImg, price: "₹32,999", description: "Terraced rice fields, sacred temples, tropical beaches and spiritual bliss.", badge: "" },
  { name: "Kashmir", slug: "kashmir", country: "India", image: kashmirImg, price: "₹18,999", description: "Heaven on earth — serene lakes, snow-capped peaks and blooming gardens.", badge: "Editor's Pick" },
  { name: "Singapore", slug: "singapore", country: "Southeast Asia", image: singaporeImg, price: "₹38,999", description: "A dazzling city-state blending futuristic architecture and multicultural charm.", badge: "" },
  { name: "Maldives", slug: "maldives", country: "Indian Ocean", image: maldivesImg, price: "₹85,999", description: "Overwater bungalows, crystalline lagoons and unparalleled luxury in paradise.", badge: "Luxury" },
];

export default function DestinationsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="destinations" className="section-padding bg-white">
      <div className="container-custom" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-block px-4 py-1 bg-gold/10 border border-gold/30 text-gold text-xs font-body font-medium tracking-widest uppercase rounded-full mb-4">
            Handpicked For You
          </span>
          <h2 className="font-display font-800 text-3xl sm:text-4xl text-navy mb-4">
            Popular Destinations
          </h2>
          <p className="text-muted-foreground font-body max-w-xl mx-auto leading-relaxed">
            Dream destinations curated by our travel experts — each one a masterpiece waiting to be explored.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map(({ name, slug, country, image, price, description, badge }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative rounded-2xl overflow-hidden shadow-card hover:shadow-navy transition-all duration-400 cursor-pointer"
            >
              {/* Image */}
              <div className="relative h-72 overflow-hidden">
                <img
                  src={image}
                  alt={`${name} travel destination`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-card" />
                {badge && (
                  <span className="absolute top-4 left-4 px-3 py-1 bg-gold text-navy text-xs font-display font-700 rounded-full shadow-gold">
                    {badge}
                  </span>
                )}
                <div className="absolute top-4 right-4 px-3 py-1 bg-navy/80 backdrop-blur-sm text-gold text-sm font-display font-700 rounded-full border border-gold/30">
                  From {price}
                </div>
              </div>

              {/* Info */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="flex items-center gap-1.5 mb-1">
                  <MapPin className="w-3.5 h-3.5 text-gold" />
                  <span className="text-gold/80 text-xs font-body">{country}</span>
                </div>
                <h3 className="font-display font-800 text-2xl text-white mb-2">{name}</h3>
                <p className="text-white/70 font-body text-xs leading-relaxed mb-4 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  {description}
                </p>
                <Link
                  href={`/destinations/${slug}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gold text-navy font-display font-700 text-sm rounded-full shadow-gold hover:bg-gold-light transition-colors opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-300"
                >
                  View Package <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="text-center mt-12"
        >
          <Link
            href="/destinations"
            className="inline-block px-8 py-4 border-2 border-navy text-navy font-display font-700 rounded-full hover:bg-navy hover:text-gold transition-all duration-300 hover:shadow-navy"
          >
            View All Destinations
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
