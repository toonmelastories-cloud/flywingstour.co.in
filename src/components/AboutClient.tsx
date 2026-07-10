"use client";

import { useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Target, Eye, Users, Clock, BadgeCheck, TrendingUp,
  Sliders, Shield, Phone, MessageCircle, ChevronRight,
  MapPin, Award, Star, HeartHandshake, Plane,
  CheckCircle2, UserCheck, DollarSign, Globe, Headphones
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import InquiryModal from "@/components/InquiryModal";

const aboutHero = "/assets/about-hero.jpg";
const aboutTeam = "/assets/about-team.jpg";
const team1 = "/assets/team-1.jpg";
const team2 = "/assets/team-2.jpg";
const team3 = "/assets/team-3.jpg";

/* ─── Animated Counter ─────────────────────────── */
function AnimatedCounter({ target, suffix = "", prefix = "" }: { target: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const step = 16;
    const increment = target / (duration / step);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, step);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

/* ─── Section Header ────────────────────────────── */
function SectionHeader({ badge, title, subtitle }: { badge: string; title: string; subtitle?: string }) {
  return (
    <div className="text-center mb-14">
      <div className="inline-flex items-center gap-2 bg-secondary/10 border border-secondary/30 rounded-full px-4 py-1.5 mb-4">
        <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
        <span className="text-secondary text-xs font-body font-semibold tracking-widest uppercase">{badge}</span>
      </div>
      <h2 className="font-display font-800 text-3xl sm:text-4xl text-primary mb-4 leading-tight">{title}</h2>
      {subtitle && <p className="text-muted-foreground font-body text-lg max-w-2xl mx-auto leading-relaxed">{subtitle}</p>}
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────── */
export default function AboutClient() {
  const [inquiryOpen, setInquiryOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background font-body">
      <Navbar onInquiryOpen={() => setInquiryOpen(true)} />
      <main>
        <HeroSection />
        <CompanyIntro />
        <MissionVision />
        <WhyChooseSection />
        <ProcessSection />
        <TeamSection />
        <StatsSection />
        <CTASection onInquiryOpen={() => setInquiryOpen(true)} />
      </main>
      <Footer />
      <WhatsAppButton />
      <InquiryModal isOpen={inquiryOpen} onClose={() => setInquiryOpen(false)} />
    </div>
  );
}

/* ─── 1. Hero ───────────────────────────────────── */
function HeroSection() {
  return (
    <section className="relative h-[65vh] min-h-[500px] flex items-end pb-16 overflow-hidden" id="about-hero">
      <img src={aboutHero} alt="Flywings Tour & Packages Pvt Ltd — premium international airport" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/50 to-primary/80" />

      <div className="relative container-custom w-full">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-sm font-body text-white/70 mb-5"
        >
          <a href="/" className="hover:text-secondary transition-colors">Home</a>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-secondary font-medium">About</span>
        </motion.nav>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="font-display font-900 text-4xl sm:text-5xl lg:text-6xl text-white max-w-3xl leading-tight mb-4"
        >
          About <span className="text-secondary">Flywings</span><br />Tour and Travel
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="font-body text-white/80 text-lg sm:text-xl max-w-xl leading-relaxed"
        >
          Your Trusted Partner for Flights, Holidays & Complete Travel Solutions
        </motion.p>
      </div>
    </section>
  );
}

/* ─── 2. Company Intro ──────────────────────────── */
function CompanyIntro() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const highlights = [
    { icon: Sliders, text: "Personalized travel planning tailored to your dreams" },
    { icon: DollarSign, text: "Transparent pricing with zero hidden charges" },
    { icon: BadgeCheck, text: "Reliable visa assistance across 50+ countries" },
    { icon: Headphones, text: "Dedicated 24/7 customer support — always here for you" },
  ];

  return (
    <section className="section-padding bg-background" ref={ref}>
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img src={aboutTeam} alt="Flywings Tour & Packages Pvt Ltd team at our travel agency office" className="w-full h-[420px] object-cover" />
            </div>
            {/* Badge overlay */}
            <div className="absolute -bottom-6 -right-6 bg-secondary rounded-2xl px-6 py-4 shadow-gold">
              <div className="font-display font-800 text-3xl text-primary leading-none">10+</div>
              <div className="font-body text-primary/80 text-sm font-medium">Years of Excellence</div>
            </div>
            <div className="absolute -top-4 -left-4 w-20 h-20 rounded-full border-4 border-secondary/30 bg-primary/5 backdrop-blur-sm flex items-center justify-center">
              <Plane className="w-8 h-8 text-secondary" />
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <div className="inline-flex items-center gap-2 bg-secondary/10 border border-secondary/30 rounded-full px-4 py-1.5 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
              <span className="text-secondary text-xs font-body font-semibold tracking-widest uppercase">Our Story</span>
            </div>

            <h2 className="font-display font-800 text-3xl sm:text-4xl text-primary mb-5 leading-tight">
              A Decade of Crafting<br /><span className="text-secondary">Unforgettable Journeys</span>
            </h2>

            <p className="font-body text-muted-foreground text-base leading-relaxed mb-4">
              Founded in 2012, <strong className="text-primary">Flywings Tour & Packages Pvt Ltd</strong> was born out of a simple belief — that every traveler deserves a stress-free, memorable journey. From our humble beginnings as a local travel desk in New Delhi, we have grown into one of India's most trusted full-service travel agencies.
            </p>
            <p className="font-body text-muted-foreground text-base leading-relaxed mb-8">
              We serve thousands of satisfied travelers every year — from solo adventurers and honeymooners to corporate groups and family vacationers. Our team of passionate travel experts is committed to going the extra mile to craft journeys that exceed expectations, every single time.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {highlights.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-start gap-3 p-4 bg-muted/50 rounded-xl border border-border">
                  <div className="w-9 h-9 rounded-lg bg-secondary/15 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-secondary" />
                  </div>
                  <p className="text-sm font-body text-foreground leading-snug">{text}</p>
                </div>
              ))}
            </div>

            <a
              href="#services"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-secondary font-display font-700 rounded-full hover:bg-primary/90 transition-all text-sm"
            >
              Explore Our Services <ChevronRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─── 3. Mission & Vision ───────────────────────── */
function MissionVision() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const mission = [
    "Deliver seamless, stress-free travel experiences",
    "Provide best-value packages with zero compromise",
    "Make travel accessible and enjoyable for every budget",
  ];
  const vision = [
    "Become India's most loved and trusted travel agency",
    "Expand world-class international travel solutions",
    "Build lasting client relationships through exceptional service",
  ];

  return (
    <section className="section-padding bg-muted/30" ref={ref}>
      <div className="container-custom">
        <SectionHeader badge="Our Purpose" title="Mission & Vision" subtitle="Guiding every journey with purpose, passion, and an unwavering commitment to your satisfaction." />

        <div className="grid md:grid-cols-2 gap-8">
          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="bg-primary rounded-2xl p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-36 h-36 rounded-full bg-secondary/10 -mr-10 -mt-10" />
            <div className="relative">
              <div className="w-14 h-14 rounded-xl bg-secondary/20 flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-secondary" />
              </div>
              <h3 className="font-display font-800 text-2xl text-white mb-3">Our Mission</h3>
              <p className="text-white/70 font-body text-sm mb-6 leading-relaxed">
                To transform travel planning from a task into a joyful experience — one journey at a time.
              </p>
              <ul className="space-y-3">
                {mission.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                    <span className="text-white/80 font-body text-sm leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Vision */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="bg-secondary rounded-2xl p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-36 h-36 rounded-full bg-primary/10 -mr-10 -mt-10" />
            <div className="relative">
              <div className="w-14 h-14 rounded-xl bg-primary/15 flex items-center justify-center mb-6">
                <Eye className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display font-800 text-2xl text-primary mb-3">Our Vision</h3>
              <p className="text-primary/70 font-body text-sm mb-6 leading-relaxed">
                To redefine the travel experience in India with innovation, trust, and unmatched expertise.
              </p>
              <ul className="space-y-3">
                {vision.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-primary/80 font-body text-sm leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─── 4. Why Choose ─────────────────────────────── */
function WhyChooseSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const items = [
    { icon: UserCheck, title: "Experienced Travel Experts", desc: "Our consultants average 8+ years of industry expertise across international and domestic travel." },
    { icon: Clock, title: "24/7 Customer Support", desc: "Round-the-clock assistance ensuring you're never stranded — before, during, or after your trip." },
    { icon: BadgeCheck, title: "Verified Travel Partners", desc: "We partner only with accredited airlines, hotels, and tour operators for guaranteed quality." },
    { icon: DollarSign, title: "Competitive Pricing", desc: "Best price match promise — if you find it cheaper elsewhere, we'll beat it, no questions asked." },
    { icon: Sliders, title: "Customized Itineraries", desc: "No two trips are alike. We craft bespoke journeys tailored precisely to your preferences and budget." },
    { icon: Shield, title: "Safe & Secure Booking", desc: "PCI-compliant payment processing and full data privacy — your security is our priority." },
  ];

  return (
    <section className="section-padding bg-background" ref={ref}>
      <div className="container-custom">
        <SectionHeader
          badge="Why Flywings"
          title="The Flywings Advantage"
          subtitle="Six compelling reasons why thousands of Indian travelers choose Flywings for every journey."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="group p-6 rounded-2xl border border-border bg-card hover:border-secondary/50 hover:shadow-lg transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/5 group-hover:bg-secondary/15 flex items-center justify-center mb-4 transition-colors duration-300">
                <Icon className="w-6 h-6 text-primary group-hover:text-secondary transition-colors duration-300" />
              </div>
              <h3 className="font-display font-700 text-base text-primary mb-2">{title}</h3>
              <p className="font-body text-muted-foreground text-sm leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── 5. Process ────────────────────────────────── */
function ProcessSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const steps = [
    { num: "01", title: "Consultation", desc: "Share your travel dreams with our expert consultants. We listen, understand your requirements, budget, and preferred experiences.", icon: Phone },
    { num: "02", title: "Customized Planning", desc: "Our team designs a tailor-made itinerary — flights, hotels, activities, visa requirements, and every detail sorted for you.", icon: Sliders },
    { num: "03", title: "Booking & Confirmation", desc: "Once you approve the plan, we handle all reservations and send you complete booking confirmations instantly.", icon: BadgeCheck },
    { num: "04", title: "Travel Support", desc: "From airport assistance to in-destination support, our team is available 24/7 throughout your journey.", icon: Headphones },
    { num: "05", title: "Post-Trip Assistance", desc: "We follow up after your return to ensure everything was perfect and gather feedback to keep improving for you.", icon: HeartHandshake },
  ];

  return (
    <section className="section-padding bg-muted/30" ref={ref}>
      <div className="container-custom">
        <SectionHeader
          badge="How It Works"
          title="Our Simple 5-Step Process"
          subtitle="From your first call to your final return — we make every step seamless and stress-free."
        />

        <div className="relative">
          {/* Connector line (desktop) */}
          <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-transparent via-secondary/40 to-transparent" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {steps.map(({ num, title, desc, icon: Icon }, i) => (
              <motion.div
                key={num}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                className="relative text-center group"
              >
                {/* Step circle */}
                <div className="relative w-20 h-20 mx-auto mb-5">
                  <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center shadow-lg group-hover:bg-secondary transition-colors duration-300">
                    <Icon className="w-8 h-8 text-secondary group-hover:text-primary transition-colors duration-300" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-secondary text-primary font-display font-800 text-xs flex items-center justify-center shadow-gold">
                    {num}
                  </div>
                </div>
                <h3 className="font-display font-700 text-base text-primary mb-2">{title}</h3>
                <p className="font-body text-muted-foreground text-xs leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── 6. Team ───────────────────────────────────── */
function TeamSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const team = [
    { name: "Rahul Sharma", role: "Founder & CEO", desc: "15 years in luxury travel. Rahul's vision built Flywings from a single desk into a nationally trusted brand.", img: team1 },
    { name: "Priya Mehta", role: "Head of Operations", desc: "Travel operations expert with 10+ years crafting flawless itineraries for families, corporates, and honeymooners.", img: team2 },
    { name: "Suresh Iyer", role: "Senior Travel Consultant", desc: "Visa specialist and destination expert for South-East Asia and Europe, with 8 years of hands-on consulting.", img: team3 },
  ];

  return (
    <section className="section-padding bg-background" ref={ref}>
      <div className="container-custom">
        <SectionHeader
          badge="Our Team"
          title="The People Behind Your Journey"
          subtitle="Passionate travel experts dedicated to turning your travel dreams into extraordinary realities."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map(({ name, role, desc, img }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="group text-center"
            >
              <div className="relative inline-block mb-5">
                <div className="w-36 h-36 rounded-2xl overflow-hidden mx-auto shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <img src={img} alt={`${name} — ${role} at Flywings Tour & Packages Pvt Ltd`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="absolute -bottom-3 -right-3 w-10 h-10 rounded-full bg-secondary flex items-center justify-center shadow-gold">
                  <Star className="w-4 h-4 text-primary fill-primary" />
                </div>
              </div>
              <h3 className="font-display font-700 text-lg text-primary mb-1">{name}</h3>
              <div className="text-secondary font-body font-semibold text-sm mb-3">{role}</div>
              <p className="font-body text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── 7. Stats ──────────────────────────────────── */
function StatsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const stats = [
    { icon: Users, label: "Happy Travelers", target: 5000, suffix: "+" },
    { icon: Globe, label: "Destinations", target: 100, suffix: "+" },
    { icon: Clock, label: "Support — Always Available", target: 24, suffix: "/7" },
    { icon: Award, label: "5-Star Reviews", target: 5234, suffix: "+" },
  ];

  return (
    <section className="py-20 bg-primary relative overflow-hidden" ref={ref}>
      <div className="absolute inset-0 opacity-5">
        <svg viewBox="0 0 1440 320" className="w-full h-full" preserveAspectRatio="none">
          <path d="M0,160 C480,320 960,0 1440,160 L1440,320 L0,320 Z" fill="hsl(43 88% 42%)" />
        </svg>
      </div>
      <div className="absolute top-6 right-12 w-52 h-52 rounded-full bg-secondary/5 blur-2xl" />
      <div className="absolute bottom-6 left-12 w-40 h-40 rounded-full bg-secondary/5 blur-2xl" />

      <div className="relative container-custom">
        <div className="text-center mb-12">
          <h2 className="font-display font-800 text-3xl sm:text-4xl text-white mb-3">Numbers That Speak</h2>
          <p className="font-body text-white/60 text-lg">A decade of trust, built one journey at a time.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map(({ icon: Icon, label, target, suffix }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="text-center"
            >
              <div className="w-14 h-14 rounded-xl bg-secondary/15 flex items-center justify-center mx-auto mb-4">
                <Icon className="w-7 h-7 text-secondary" />
              </div>
              <div className="font-display font-900 text-4xl sm:text-5xl text-secondary mb-2">
                <AnimatedCounter target={target} suffix={suffix} />
              </div>
              <div className="font-body text-white/70 text-sm">{label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── 8. CTA ────────────────────────────────────── */
function CTASection({ onInquiryOpen }: { onInquiryOpen: () => void }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-20 relative overflow-hidden" ref={ref}>
      <div className="absolute inset-0 bg-secondary opacity-95" />
      <div className="absolute top-8 right-8 w-48 h-48 rounded-full bg-primary/10 -mr-16 -mt-16" />
      <div className="absolute bottom-8 left-8 w-32 h-32 rounded-full bg-primary/10 -ml-10 -mb-10" />

      <div className="relative container-custom text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-6">
            <span className="text-primary text-xs font-body font-semibold tracking-widest uppercase">Start Your Journey</span>
          </div>

          <h2 className="font-display font-900 text-3xl sm:text-4xl lg:text-5xl text-primary mb-5 max-w-2xl mx-auto leading-tight">
            Plan Your Next Journey<br />With Confidence
          </h2>

          <p className="text-primary/70 font-body text-lg max-w-lg mx-auto mb-10 leading-relaxed">
            Our expert travel consultants are ready to craft a personalized itinerary just for you — completely free of charge.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onInquiryOpen}
              className="flex items-center gap-2 px-8 py-4 bg-primary text-secondary font-display font-700 rounded-full hover:bg-primary/90 transition-all duration-200 hover:scale-105 text-sm sm:text-base"
            >
              <MessageCircle className="w-5 h-5" />
              Talk To Our Travel Expert
            </button>
            <a
              href="/#services"
              className="flex items-center gap-2 px-8 py-4 border-2 border-primary text-primary font-display font-700 rounded-full hover:bg-primary/10 transition-all duration-200 text-sm sm:text-base"
            >
              Explore Services <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
