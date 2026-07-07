"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Users, ArrowRight, Shield, Clock, Tag, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const heroBg = "/assets/hero-bg.jpg";

interface HeroSectionProps {
  onInquiryOpen: () => void;
}

const trustBadges = [
  { icon: Shield, label: "Trusted Travel Partner", sub: "IATA Certified" },
  { icon: Clock, label: "24/7 Support", sub: "Always Available" },
  { icon: Tag, label: "Best Price Guarantee", sub: "No Hidden Fees" },
];

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
});

export default function HeroSection({ onInquiryOpen }: HeroSectionProps) {
  const [departureDate, setDepartureDate] = useState<Date>();
  const [returnDate, setReturnDate] = useState<Date>();

  return (
    <section id="home" className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="Luxury airplane flying over clouds at sunset"
          className="w-full h-full object-cover object-center"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 bg-navy/30" />
      </div>

      {/* Content */}
      <div className="relative container-custom pt-32 pb-16">
        <div className="max-w-3xl">
          {/* Badge */}
          <motion.div {...fadeUp(0.1)} className="inline-flex items-center gap-2 bg-gold/20 border border-gold/40 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            <span className="text-gold text-xs font-body font-medium tracking-widest uppercase">Premium Travel Since 2005</span>
          </motion.div>

          {/* H1 */}
          <motion.h1
            {...fadeUp(0.2)}
            className="font-display font-900 text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-white leading-tight mb-6"
          >
            Explore The World <br />
            <span className="text-transparent bg-clip-text bg-gradient-gold">With Flywings</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p {...fadeUp(0.35)} className="text-white/80 font-body text-lg sm:text-xl mb-8 max-w-xl leading-relaxed">
            Flights, Holidays, Visa & Complete Travel Solutions — tailored to your dreams.
          </motion.p>

          {/* CTAs */}
          <motion.div {...fadeUp(0.5)} className="flex flex-wrap gap-4 mb-12">
            <button
              onClick={onInquiryOpen}
              className="group flex items-center gap-2 px-7 py-4 bg-gradient-gold text-navy font-display font-700 rounded-full shadow-gold hover:opacity-90 transition-all duration-200 hover:scale-105 text-sm sm:text-base"
            >
              Get a Free Quote
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="#destinations"
              className="flex items-center gap-2 px-7 py-4 border-2 border-white/50 text-white font-display font-600 rounded-full hover:border-gold hover:text-gold transition-all duration-200 text-sm sm:text-base backdrop-blur-sm"
            >
              Explore Packages
            </a>
          </motion.div>
        </div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-6 max-w-5xl"
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {/* From */}
            <div className="col-span-1 bg-white/10 hover:bg-white/20 rounded-xl p-3 cursor-pointer transition-colors">
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-3.5 h-3.5 text-gold" />
                <span className="text-gold text-xs font-body font-medium uppercase tracking-wide">From</span>
              </div>
              <input
                type="text"
                placeholder="City or airport"
                className="bg-transparent text-white placeholder-white/50 text-sm font-body w-full outline-none"
              />
            </div>
            {/* To */}
            <div className="col-span-1 bg-white/10 hover:bg-white/20 rounded-xl p-3 cursor-pointer transition-colors">
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-3.5 h-3.5 text-gold" />
                <span className="text-gold text-xs font-body font-medium uppercase tracking-wide">To</span>
              </div>
              <input
                type="text"
                placeholder="City or airport"
                className="bg-transparent text-white placeholder-white/50 text-sm font-body w-full outline-none"
              />
            </div>
            {/* Departure */}
            <div className="col-span-1">
              <Popover>
                <PopoverTrigger asChild>
                  <button className="w-full bg-white/10 hover:bg-white/20 rounded-xl p-3 cursor-pointer transition-colors text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <CalendarIcon className="w-3.5 h-3.5 text-gold" />
                      <span className="text-gold text-xs font-body font-medium uppercase tracking-wide">Departure</span>
                    </div>
                    <span className="text-white/80 text-sm font-body">
                      {departureDate ? format(departureDate, "PPP") : "Select date"}
                    </span>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-[200]" align="start">
                  <Calendar
                    mode="single"
                    selected={departureDate}
                    onSelect={setDepartureDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
            {/* Return */}
            <div className="col-span-1">
              <Popover>
                <PopoverTrigger asChild>
                  <button className="w-full bg-white/10 hover:bg-white/20 rounded-xl p-3 cursor-pointer transition-colors text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <CalendarIcon className="w-3.5 h-3.5 text-gold" />
                      <span className="text-gold text-xs font-body font-medium uppercase tracking-wide">Return</span>
                    </div>
                    <span className="text-white/80 text-sm font-body">
                      {returnDate ? format(returnDate, "PPP") : "Select date"}
                    </span>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-[200]" align="start">
                  <Calendar
                    mode="single"
                    selected={returnDate}
                    onSelect={setReturnDate}
                    disabled={(date) => date < (departureDate || new Date())}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
            {/* Travelers + Search */}
            <div className="col-span-2 sm:col-span-3 lg:col-span-1 flex gap-2">
              <div className="flex-1 bg-white/10 hover:bg-white/20 rounded-xl p-3 cursor-pointer transition-colors">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-3.5 h-3.5 text-gold" />
                  <span className="text-gold text-xs font-body font-medium uppercase tracking-wide">Travelers</span>
                </div>
                <select className="bg-transparent text-white/80 text-sm font-body w-full outline-none">
                  <option value="1" className="text-navy">1 Adult</option>
                  <option value="2" className="text-navy">2 Adults</option>
                  <option value="3" className="text-navy">3 Adults</option>
                  <option value="4" className="text-navy">4+ Adults</option>
                </select>
              </div>
              <button className="px-4 py-3 bg-gradient-gold text-navy rounded-xl shadow-gold hover:opacity-90 transition-all hover:scale-105 flex items-center justify-center">
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9 }}
          className="flex flex-wrap gap-4 mt-8"
        >
          {trustBadges.map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2.5">
              <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
                <Icon className="w-4 h-4 text-gold" />
              </div>
              <div>
                <div className="text-white text-xs font-display font-600 leading-none">{label}</div>
                <div className="text-white/60 text-[10px] font-body leading-none mt-0.5">{sub}</div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-white/60 text-xs font-body tracking-widest uppercase">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-gold to-transparent" />
      </motion.div>
    </section>
  );
}
