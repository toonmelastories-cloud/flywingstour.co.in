"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Priya Sharma",
    location: "Mumbai, India",
    review:
      "Flywings made our Dubai honeymoon absolutely magical! Every detail was perfect — from the hotel to the desert safari. Their team was responsive and helpful throughout. Highly recommend!",
    rating: 5,
    trip: "Dubai Honeymoon Package",
    initials: "PS",
    color: "from-pink-400 to-rose-500",
  },
  {
    name: "Rajesh Mehta",
    location: "Bangalore, India",
    review:
      "Booked a Thailand family package for 4. The value was incredible — luxury hotels, transfers, guided tours all included. The kids had the time of their lives! Will definitely book again.",
    rating: 5,
    trip: "Thailand Family Package",
    initials: "RM",
    color: "from-blue-400 to-indigo-500",
  },
  {
    name: "Aisha Khan",
    location: "Delhi, India",
    review:
      "Our Maldives trip was pure paradise. The overwater villa was breathtaking. Flywings handled everything seamlessly — visa, transfers, activities. 10/10 experience!",
    rating: 5,
    trip: "Maldives Luxury Escape",
    initials: "AK",
    color: "from-teal-400 to-emerald-500",
  },
  {
    name: "Vikram Patel",
    location: "Pune, India",
    review:
      "Corporate travel management has never been easier. Flywings handles all our company bookings with professionalism and speed. Best rates in the market, period.",
    rating: 5,
    trip: "Corporate Travel",
    initials: "VP",
    color: "from-amber-400 to-orange-500",
  },
  {
    name: "Sunita Nair",
    location: "Chennai, India",
    review:
      "Kashmir in October was breathtaking. Our guide was knowledgeable and the houseboat experience was unforgettable. Flywings made this dream trip a reality within our budget.",
    rating: 5,
    trip: "Kashmir Paradise Package",
    initials: "SN",
    color: "from-purple-400 to-violet-500",
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const navigate = (dir: number) => {
    setDirection(dir);
    setCurrent((prev) => (prev + dir + testimonials.length) % testimonials.length);
  };

  const t = testimonials[current];

  return (
    <section id="testimonials" className="section-padding bg-white">
      <div className="container-custom" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-block px-4 py-1 bg-gold/10 border border-gold/30 text-gold text-xs font-body font-medium tracking-widest uppercase rounded-full mb-4">
            Happy Travelers
          </span>
          <h2 className="font-display font-800 text-3xl sm:text-4xl text-navy mb-4">
            What Our Clients Say
          </h2>
          <p className="text-muted-foreground font-body max-w-xl mx-auto leading-relaxed">
            Real experiences from real travelers who trusted Flywings with their dream vacations.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto relative">
          {/* Main testimonial */}
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: direction * 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -direction * 60 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="bg-gradient-to-br from-navy to-navy-dark rounded-3xl p-8 sm:p-12 relative overflow-hidden"
            >
              {/* Decorative */}
              <Quote className="absolute top-6 right-6 w-20 h-20 text-gold/10" />
              <div className="absolute bottom-0 right-0 w-48 h-48 rounded-full bg-gold/5 -mr-16 -mb-16" />

              <div className="relative">
                {/* Stars */}
                <div className="flex gap-1 mb-6">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-gold fill-gold" />
                  ))}
                </div>

                {/* Review */}
                <p className="text-white/90 font-body text-lg sm:text-xl leading-relaxed mb-8 italic">
                  "{t.review}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-display font-800 text-lg shadow-lg`}>
                    {t.initials}
                  </div>
                  <div>
                    <div className="font-display font-700 text-white text-lg">{t.name}</div>
                    <div className="text-white/60 font-body text-sm">{t.location}</div>
                    <div className="text-gold text-xs font-body mt-0.5">📦 {t.trip}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={() => navigate(-1)}
              className="w-12 h-12 rounded-full border-2 border-navy/20 hover:border-gold hover:bg-gold/10 text-navy hover:text-gold transition-all duration-200 flex items-center justify-center"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                  className={`rounded-full transition-all duration-300 ${
                    i === current ? "w-8 h-2.5 bg-gold" : "w-2.5 h-2.5 bg-navy/20 hover:bg-gold/50"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => navigate(1)}
              className="w-12 h-12 rounded-full border-2 border-navy/20 hover:border-gold hover:bg-gold/10 text-navy hover:text-gold transition-all duration-200 flex items-center justify-center"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Trust numbers */}
          <div className="grid grid-cols-3 gap-4 mt-10">
            {[
              { value: "50,000+", label: "Travelers Served" },
              { value: "4.9★", label: "Average Rating" },
              { value: "98%", label: "Would Recommend" },
            ].map(({ value, label }) => (
              <div key={label} className="text-center p-4 rounded-2xl bg-muted/50 border border-border">
                <div className="font-display font-800 text-xl sm:text-2xl text-navy">{value}</div>
                <div className="text-muted-foreground font-body text-xs mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
