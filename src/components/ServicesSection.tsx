"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Plane, Package, FileCheck, Hotel, Briefcase, Globe } from "lucide-react";

const services = [
  {
    icon: Plane,
    title: "Flight Booking",
    description: "Best fares on domestic & international flights with flexible booking options and instant confirmation.",
    color: "from-blue-500/10 to-blue-600/5",
  },
  {
    icon: Package,
    title: "Holiday Packages",
    description: "All-inclusive curated holiday packages for families, couples, and solo travelers worldwide.",
    color: "from-emerald-500/10 to-emerald-600/5",
  },
  {
    icon: FileCheck,
    title: "Visa Services",
    description: "Hassle-free visa processing with expert guidance, documentation support, and high success rates.",
    color: "from-gold/10 to-gold/5",
  },
  {
    icon: Hotel,
    title: "Hotel Booking",
    description: "Handpicked luxury hotels and resorts at the best rates, from boutique stays to 5-star properties.",
    color: "from-purple-500/10 to-purple-600/5",
  },
  {
    icon: Briefcase,
    title: "Corporate Travel",
    description: "End-to-end corporate travel management with dedicated account managers and priority support.",
    color: "from-red-500/10 to-red-600/5",
  },
  {
    icon: Globe,
    title: "Group Tours",
    description: "Specially crafted group tour experiences with expert local guides and seamless logistics.",
    color: "from-teal-500/10 to-teal-600/5",
  },
];

export default function ServicesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="services" className="section-padding bg-muted/30">
      <div className="container-custom" ref={ref}>
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-block px-4 py-1 bg-gold/10 border border-gold/30 text-gold text-xs font-body font-medium tracking-widest uppercase rounded-full mb-4">
            What We Offer
          </span>
          <h2 className="font-display font-800 text-3xl sm:text-4xl text-navy mb-4">
            Complete Travel Solutions
          </h2>
          <p className="text-muted-foreground font-body max-w-xl mx-auto leading-relaxed">
            From flights to full holidays — we handle every detail so you travel with complete peace of mind.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(({ icon: Icon, title, description, color }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <div className="group h-full bg-white rounded-2xl p-6 border border-border hover:border-gold/40 shadow-card hover:shadow-gold transition-all duration-300 cursor-pointer hover:-translate-y-1">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-7 h-7 text-navy group-hover:text-gold transition-colors duration-300" />
                </div>
                <h3 className="font-display font-700 text-lg text-navy mb-3 group-hover:text-gold transition-colors">
                  {title}
                </h3>
                <p className="text-muted-foreground font-body text-sm leading-relaxed">{description}</p>
                <div className="mt-4 flex items-center gap-1 text-gold text-sm font-body font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Learn more <span className="ml-1">→</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
