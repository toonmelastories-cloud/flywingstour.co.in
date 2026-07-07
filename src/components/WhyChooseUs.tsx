"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import {
  UserCheck,
  BadgeDollarSign,
  HeadphonesIcon,
  FileText,
  Building,
  Award,
} from "lucide-react";

const features = [
  {
    icon: UserCheck,
    title: "Personalized Planning",
    description: "Every itinerary is crafted to match your unique preferences, travel style, and budget.",
  },
  {
    icon: BadgeDollarSign,
    title: "Best Price Guarantee",
    description: "We match or beat any comparable quote. Transparent pricing with zero hidden charges.",
  },
  {
    icon: HeadphonesIcon,
    title: "24/7 Customer Support",
    description: "Our dedicated travel consultants are available around the clock for any assistance.",
  },
  {
    icon: FileText,
    title: "Visa Assistance",
    description: "Expert visa guidance with high approval rates across 50+ countries globally.",
  },
  {
    icon: Building,
    title: "Handpicked Hotels",
    description: "Only the finest vetted accommodations — from charming boutiques to luxury resorts.",
  },
  {
    icon: Award,
    title: "Award-Winning Agency",
    description: "Recognized as India's top travel agency with 18+ years of outstanding service.",
  },
];

export default function WhyChooseUs() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="why-us" className="section-padding relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy to-navy-dark" />
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full border border-gold" />
        <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full border border-gold" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border border-gold" />
      </div>

      <div className="relative container-custom" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-block px-4 py-1 bg-gold/20 border border-gold/40 text-gold text-xs font-body font-medium tracking-widest uppercase rounded-full mb-4">
            Our Advantage
          </span>
          <h2 className="font-display font-800 text-3xl sm:text-4xl text-white mb-4">
            Why Choose <span className="text-gold">Flywings?</span>
          </h2>
          <p className="text-white/60 font-body max-w-xl mx-auto leading-relaxed">
            18 years of trust, thousands of happy travelers, and an unwavering commitment to excellence.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, description }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group relative bg-white/5 hover:bg-white/10 border border-white/10 hover:border-gold/40 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-gold/10 border border-gold/30 flex items-center justify-center mb-5 group-hover:bg-gold/20 transition-colors">
                <Icon className="w-7 h-7 text-gold" />
              </div>

              {/* Number */}
              <div className="absolute top-5 right-5 text-white/10 font-display font-900 text-4xl leading-none">
                {String(i + 1).padStart(2, "0")}
              </div>

              <h3 className="font-display font-700 text-lg text-white mb-3">{title}</h3>
              <p className="text-white/60 font-body text-sm leading-relaxed">{description}</p>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-12 border-t border-white/10"
        >
          {[
            { value: "50K+", label: "Happy Travelers" },
            { value: "180+", label: "Destinations" },
            { value: "18+", label: "Years Experience" },
            { value: "99%", label: "Satisfaction Rate" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="font-display font-900 text-3xl sm:text-4xl text-gold mb-1">{value}</div>
              <div className="text-white/60 font-body text-sm">{label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
