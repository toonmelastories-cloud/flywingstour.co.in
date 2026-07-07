"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Phone, MessageCircle } from "lucide-react";

interface CTASectionProps {
  onInquiryOpen: () => void;
}

export default function CTASection({ onInquiryOpen }: CTASectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-20 relative overflow-hidden" ref={ref}>
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-gold opacity-95" />
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <svg viewBox="0 0 1440 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path d="M0 200 Q360 0 720 200 Q1080 400 1440 200" stroke="currentColor" strokeWidth="2" className="text-navy" fill="none" />
            <path d="M0 300 Q360 100 720 300 Q1080 500 1440 300" stroke="currentColor" strokeWidth="2" className="text-navy" fill="none" />
          </svg>
        </div>
      </div>
      <div className="absolute top-8 right-8 w-48 h-48 rounded-full bg-navy/10 -mr-16 -mt-16" />
      <div className="absolute bottom-8 left-8 w-32 h-32 rounded-full bg-navy/10 -ml-10 -mb-10" />

      <div className="relative container-custom text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 bg-navy/10 border border-navy/20 rounded-full px-4 py-1.5 mb-6">
            <span className="text-navy text-xs font-body font-medium tracking-widest uppercase">Let's Plan Together</span>
          </div>

          <h2 className="font-display font-900 text-3xl sm:text-4xl lg:text-5xl text-navy mb-5 max-w-2xl mx-auto leading-tight">
            Ready To Plan Your <br />Dream Trip?
          </h2>

          <p className="text-navy/70 font-body text-lg max-w-lg mx-auto mb-10 leading-relaxed">
            Talk to our expert travel consultants and get a personalized itinerary crafted just for you — completely free.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onInquiryOpen}
              className="group flex items-center gap-2 px-8 py-4 bg-navy text-gold font-display font-700 rounded-full hover:bg-navy-dark transition-all duration-200 hover:scale-105 shadow-navy text-sm sm:text-base"
            >
              <MessageCircle className="w-5 h-5" />
              Contact Our Travel Expert
            </button>
            <a
              href="tel:+919914310333"
              className="flex items-center gap-2 px-8 py-4 border-2 border-navy text-navy font-display font-700 rounded-full hover:bg-navy/10 transition-all duration-200 text-sm sm:text-base"
            >
              <Phone className="w-5 h-5" />
              Call +91 99143 10333
            </a>
          </div>

          {/* Trust tags */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-10">
            {["No Booking Fee", "Free Consultation", "Best Price Match", "Instant Confirmation"].map((tag) => (
              <div key={tag} className="flex items-center gap-1.5 bg-navy/10 border border-navy/20 rounded-full px-4 py-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-navy" />
                <span className="text-navy text-xs font-body font-medium">{tag}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
