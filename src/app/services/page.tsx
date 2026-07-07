"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Plane, Package, FileCheck, Hotel, Briefcase,
  CheckCircle2, ChevronRight, ChevronDown,
  DollarSign, UserCheck, Sliders, Shield, Headphones, BadgeCheck,
  Phone, MessageCircle, Star, Globe, Clock
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import InquiryModal from "@/components/InquiryModal";

const servicesHero = "/assets/services-hero.jpg";
const serviceFlight = "/assets/service-flight.jpg";
const serviceHoliday = "/assets/service-holiday.jpg";
const serviceVisa = "/assets/service-visa.jpg";
const serviceHotel = "/assets/service-hotel.jpg";
const serviceCorporate = "/assets/service-corporate.jpg";

/* ─── Reusable Section Badge ────────────────────── */
function SectionBadge({ text }: { text: string }) {
  return (
    <div className="inline-flex items-center gap-2 bg-secondary/10 border border-secondary/30 rounded-full px-4 py-1.5 mb-4">
      <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
      <span className="text-secondary text-xs font-body font-semibold tracking-widest uppercase">{text}</span>
    </div>
  );
}

/* ─── Service Detail Section ─────────────────────── */
interface ServiceDetailProps {
  id: string;
  badge: string;
  heading: string;
  description: string;
  bullets: string[];
  ctaLabel: string;
  image: string;
  imageAlt: string;
  reverse?: boolean;
  onInquiry: () => void;
}

function ServiceDetail({ id, badge, heading, description, bullets, ctaLabel, image, imageAlt, reverse, onInquiry }: ServiceDetailProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id={id} className="section-padding" ref={ref}>
      <div className="container-custom">
        <div className={`grid lg:grid-cols-2 gap-14 items-center ${reverse ? "lg:grid-flow-col-dense" : ""}`}>
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: reverse ? 40 : -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className={`relative group ${reverse ? "lg:col-start-2" : ""}`}
          >
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={image}
                alt={imageAlt}
                className="w-full h-[380px] object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
            </div>
            {/* Decorative accent */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-2xl bg-secondary/20 -z-10" />
            <div className="absolute -top-4 -left-4 w-16 h-16 rounded-full border-2 border-secondary/30 -z-10" />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: reverse ? -40 : 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className={reverse ? "lg:col-start-1 lg:row-start-1" : ""}
          >
            <SectionBadge text={badge} />
            <h2 className="font-display font-800 text-3xl sm:text-4xl text-primary mb-5 leading-tight">
              {heading}
            </h2>
            <p className="font-body text-muted-foreground text-base leading-relaxed mb-7">
              {description}
            </p>

            <ul className="space-y-3 mb-8">
              {bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-secondary/20 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-secondary" />
                  </div>
                  <span className="font-body text-foreground text-sm leading-snug">{bullet}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={onInquiry}
              className="group inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-secondary font-display font-700 rounded-full hover:bg-primary/90 transition-all duration-200 hover:scale-105 shadow-navy text-sm"
            >
              {ctaLabel}
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─── FAQ Item ───────────────────────────────────── */
function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      className="border border-border rounded-xl overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left bg-white hover:bg-muted/40 transition-colors duration-200"
        aria-expanded={open}
      >
        <span className="font-display font-700 text-primary text-sm sm:text-base pr-4">{question}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="shrink-0">
          <ChevronDown className="w-5 h-5 text-secondary" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="font-body text-muted-foreground text-sm leading-relaxed px-5 pb-5">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Main Page ──────────────────────────────────── */
export default function Services() {
  const [inquiryOpen, setInquiryOpen] = useState(false);

  /* SEO */
  useEffect(() => {
    document.title = "Travel Services | Flights, Holidays, Visa | Flywings";
    const setMeta = (name: string, content: string, property?: string) => {
      const el = document.querySelector(
        property ? `meta[property="${name}"]` : `meta[name="${name}"]`
      ) || document.createElement("meta");
      if (property) el.setAttribute("property", name);
      else el.setAttribute("name", name);
      el.setAttribute("content", content);
      if (!el.parentNode) document.head.appendChild(el);
    };
    setMeta("description", "Flywings Tour and Travel offers premium travel services — cheap flight booking, customized holiday packages, visa assistance, hotel reservations & corporate travel solutions across India.");
    setMeta("keywords", "travel services India, cheap flights, international flight booking, holiday packages India, visa assistance, hotel booking, corporate travel management, Flywings");
    setMeta("og:title", "Travel Services | Flights, Holidays, Visa | Flywings", "property");
    setMeta("og:description", "Complete travel solutions — Flywings offers flights, holiday packages, visa services, hotel booking, and corporate travel with best price guarantee.", "property");
    setMeta("og:type", "website", "property");
    setMeta("twitter:card", "summary_large_image");

    /* Service + FAQ Schema */
    const schema = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Service",
          "serviceType": "Travel Agency Services",
          "provider": {
            "@type": "TravelAgency",
            "name": "Flywings Tour and Travel",
            "url": "https://flywings.in"
          },
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Travel Services",
            "itemListElement": [
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Flight Booking" } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Holiday Packages" } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Visa Services" } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Hotel Booking" } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Corporate Travel" } }
            ]
          }
        },
        {
          "@type": "FAQPage",
          "mainEntity": [
            { "@type": "Question", "name": "How can I book flights with Flywings?", "acceptedAnswer": { "@type": "Answer", "text": "You can book flights by contacting our travel experts directly via phone, WhatsApp, or by filling out our inquiry form. We'll find the best fares for your route and confirm instantly." } },
            { "@type": "Question", "name": "Do you provide visa assistance?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, Flywings provides professional visa assistance for tourist, business, and student visas to 50+ countries. Our experts guide you through every step — documentation, appointment booking, and submission." } },
            { "@type": "Question", "name": "Can I customize my holiday package?", "acceptedAnswer": { "@type": "Answer", "text": "Absolutely! All our holiday packages are fully customizable. Our consultants work with you to create a bespoke itinerary based on your budget, travel dates, and preferences." } },
            { "@type": "Question", "name": "Do you offer international tours?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, we offer international tours to 100+ destinations worldwide including Dubai, Thailand, Bali, Singapore, Maldives, Europe, and more. Both group and private tours are available." } },
            { "@type": "Question", "name": "What is included in your holiday packages?", "acceptedAnswer": { "@type": "Answer", "text": "Our packages typically include flights, hotel accommodations, airport transfers, sightseeing, and sometimes meals — depending on the package. All inclusions are clearly listed and there are no hidden charges." } },
            { "@type": "Question", "name": "Do you offer corporate travel management?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, Flywings provides end-to-end corporate travel management including bulk bookings, travel policy management, dedicated account managers, and 24/7 priority support for business travelers." } }
          ]
        }
      ]
    };
    const s = document.getElementById("services-schema") || document.createElement("script");
    s.setAttribute("type", "application/ld+json"); s.id = "services-schema";
    s.textContent = JSON.stringify(schema);
    if (!s.parentNode) document.head.appendChild(s);
  }, []);

  const services = [
    {
      id: "flight-booking",
      badge: "Domestic & International",
      heading: "Flight Booking at Best Airfare Deals",
      description: "Discover unbeatable fares on domestic and international flights. Whether you're planning a business trip, a family holiday, or a last-minute getaway, Flywings ensures you travel at the best possible price — with complete flexibility and instant confirmation.",
      bullets: [
        "Cheapest Fare Guarantee — we beat any price you find",
        "Group bookings with special negotiated fares",
        "Last-minute deals on 500+ airline routes",
        "Flexible booking & hassle-free rescheduling",
        "24/7 support for check-in and boarding queries",
      ],
      ctaLabel: "Book Your Flight",
      image: serviceFlight,
      imageAlt: "Commercial airplane flying above golden clouds at sunset — Flywings flight booking service",
      reverse: false,
    },
    {
      id: "holiday-packages",
      badge: "Tailored For You",
      heading: "Customized Holiday Packages for Every Traveler",
      description: "From romantic honeymoon escapes to adventurous family vacations and luxury corporate retreats — Flywings curates personalized holiday packages that match your vision, budget, and travel style perfectly.",
      bullets: [
        "Romantic honeymoon packages to exotic destinations",
        "Family-friendly tours with child-friendly itineraries",
        "Luxury travel experiences — 5-star all-inclusive",
        "Budget-friendly backpacker and group tours",
        "Domestic pilgrimage and heritage tours across India",
      ],
      ctaLabel: "Explore Tour Packages",
      image: serviceHoliday,
      imageAlt: "Happy family enjoying a tropical beach holiday — Flywings customized holiday packages",
      reverse: true,
    },
    {
      id: "visa-services",
      badge: "50+ Countries",
      heading: "Visa Assistance & Documentation Support",
      description: "Navigating visa requirements can be overwhelming — but not with Flywings. Our certified visa consultants simplify the entire process, from documentation to appointment booking, ensuring maximum success rate for your visa application.",
      bullets: [
        "Expert guidance on tourist, business & student visas",
        "Complete document checklist and review support",
        "Appointment scheduling and slot booking assistance",
        "Fast-track processing for urgent travel",
        "High visa success rate across 50+ countries",
      ],
      ctaLabel: "Get Visa Assistance",
      image: serviceVisa,
      imageAlt: "Travel consultant helping client with visa documentation — Flywings visa services",
      reverse: false,
    },
    {
      id: "hotel-booking",
      badge: "Best Price Guaranteed",
      heading: "Hotel Reservations Worldwide — Any Budget",
      description: "From intimate boutique stays to iconic 5-star luxury resorts, Flywings offers verified hotel reservations at the best available rates worldwide. Every property is handpicked and reviewed to ensure quality, comfort, and value.",
      bullets: [
        "Budget guesthouses to ultra-luxury 5-star resorts",
        "10,000+ verified properties across 100+ countries",
        "Best price match — guaranteed or refunded",
        "Free breakfast and room upgrade options",
        "Instant booking confirmation with 24/7 support",
      ],
      ctaLabel: "Find Your Hotel",
      image: serviceHotel,
      imageAlt: "Opulent 5-star hotel lobby with chandeliers — Flywings hotel booking service",
      reverse: true,
    },
    {
      id: "corporate-travel",
      badge: "Business Travel",
      heading: "Corporate & Business Travel Solutions",
      description: "Flywings streamlines corporate travel so your team can focus on business. From policy management to bulk bookings and VIP lounge access, we provide a dedicated, seamless travel management solution for companies of all sizes.",
      bullets: [
        "Dedicated corporate account manager",
        "Travel policy setup and compliance management",
        "Bulk flight and hotel bookings at negotiated rates",
        "Priority boarding and lounge access arrangements",
        "Monthly billing and expense report generation",
      ],
      ctaLabel: "Corporate Inquiry",
      image: serviceCorporate,
      imageAlt: "Business professionals with luggage at airport — Flywings corporate travel solutions",
      reverse: false,
    },
  ];

  const whyItems = [
    { icon: DollarSign, title: "Transparent Pricing", desc: "No hidden fees, no surprise charges. What you see is exactly what you pay." },
    { icon: UserCheck, title: "Expert Travel Advisors", desc: "Our consultants average 8+ years of expertise in domestic & international travel." },
    { icon: Sliders, title: "Personalized Planning", desc: "Fully bespoke itineraries crafted around your budget, preferences, and timeline." },
    { icon: Headphones, title: "24/7 Assistance", desc: "Round-the-clock support via phone, WhatsApp, and email — wherever you are." },
    { icon: Shield, title: "Secure Booking Process", desc: "PCI-compliant payments and industry-leading data privacy standards." },
    { icon: BadgeCheck, title: "Verified Travel Partners", desc: "We work exclusively with accredited airlines, hotels, and tour operators." },
  ];

  const faqs = [
    {
      question: "How can I book flights with Flywings?",
      answer: "You can book flights by contacting our travel experts directly via phone, WhatsApp, or by filling out our inquiry form. We'll find the best fares for your route and confirm instantly. We also offer group booking discounts for 10+ passengers.",
    },
    {
      question: "Do you provide visa assistance?",
      answer: "Yes, Flywings provides professional visa assistance for tourist, business, and student visas to 50+ countries. Our experts guide you through every step — documentation, appointment booking, and submission — ensuring a high success rate.",
    },
    {
      question: "Can I customize my holiday package?",
      answer: "Absolutely! All our holiday packages are fully customizable. Our consultants work with you to create a bespoke itinerary based on your budget, travel dates, group size, and personal preferences — at no extra planning charge.",
    },
    {
      question: "Do you offer international tours?",
      answer: "Yes, we offer international tours to 100+ destinations worldwide including Dubai, Thailand, Bali, Singapore, Maldives, Europe, USA, and more. Both guided group tours and private tailored tours are available year-round.",
    },
    {
      question: "What is included in your holiday packages?",
      answer: "Our packages typically include return flights, hotel accommodations, airport transfers, sightseeing tours, and sometimes daily meals — depending on the package tier. All inclusions are clearly listed with no hidden charges.",
    },
    {
      question: "Do you offer corporate travel management?",
      answer: "Yes, Flywings provides end-to-end corporate travel management including bulk bookings, travel policy management, dedicated account managers, and 24/7 priority support for business travelers.",
    },
  ];

  return (
    <div className="min-h-screen bg-background font-body">
      <Navbar onInquiryOpen={() => setInquiryOpen(true)} />

      {/* Sticky inquiry button */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-40 hidden lg:block">
        <button
          onClick={() => setInquiryOpen(true)}
          className="flex flex-col items-center gap-1.5 bg-secondary text-primary font-display font-700 text-xs py-5 px-3 rounded-l-xl shadow-gold hover:bg-secondary/90 transition-colors writing-mode-vertical"
          style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
        >
          <MessageCircle className="w-4 h-4 rotate-90" />
          Free Quote
        </button>
      </div>

      <main>
        {/* ── 1. Hero ── */}
        <section className="relative h-[65vh] min-h-[500px] flex items-end pb-16 overflow-hidden" id="services-hero">
          <img
            src={servicesHero}
            alt="Premium international airport terminal — Flywings travel services"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/50 via-primary/50 to-primary/85" />

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
              <span className="text-secondary font-medium">Services</span>
            </motion.nav>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="font-display font-900 text-4xl sm:text-5xl lg:text-6xl text-white max-w-3xl leading-tight mb-4"
            >
              Our <span className="text-secondary">Travel</span> Services
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="font-body text-white/80 text-lg sm:text-xl max-w-xl leading-relaxed mb-8"
            >
              Complete Travel Solutions — Flights, Holidays, Visa & More
            </motion.p>

            {/* Quick nav pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-2"
            >
              {[
                { label: "Flights", href: "#flight-booking" },
                { label: "Holidays", href: "#holiday-packages" },
                { label: "Visa", href: "#visa-services" },
                { label: "Hotels", href: "#hotel-booking" },
                { label: "Corporate", href: "#corporate-travel" },
              ].map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  className="px-4 py-1.5 bg-white/10 border border-white/30 backdrop-blur-sm text-white text-xs font-body font-medium rounded-full hover:bg-secondary hover:border-secondary hover:text-primary transition-all duration-200"
                >
                  {label}
                </a>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── 2–6. Service Detail Sections ── */}
        {services.map((svc, i) => (
          <div key={svc.id} className={i % 2 === 0 ? "bg-background" : "bg-muted/30"}>
            <ServiceDetail
              {...svc}
              onInquiry={() => setInquiryOpen(true)}
            />
          </div>
        ))}

        {/* ── 7. Why Choose Flywings ── */}
        <section className="section-padding bg-primary relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-secondary -mr-24 -mt-24" />
            <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-secondary -ml-16 -mb-16" />
          </div>
          <div className="container-custom relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
              className="text-center mb-14"
            >
              <div className="inline-flex items-center gap-2 bg-secondary/20 border border-secondary/40 rounded-full px-4 py-1.5 mb-4">
                <Star className="w-3 h-3 text-secondary fill-secondary" />
                <span className="text-secondary text-xs font-body font-semibold tracking-widest uppercase">Why Flywings</span>
              </div>
              <h2 className="font-display font-800 text-3xl sm:text-4xl text-white mb-4 leading-tight">
                Why Thousands Choose <span className="text-secondary">Flywings</span>
              </h2>
              <p className="text-white/70 font-body text-lg max-w-2xl mx-auto leading-relaxed">
                Six compelling reasons that make Flywings India's most trusted travel partner.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {whyItems.map(({ icon: Icon, title, desc }, i) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="group bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-secondary/40 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center mb-4 group-hover:bg-secondary/30 transition-colors">
                    <Icon className="w-6 h-6 text-secondary" />
                  </div>
                  <h3 className="font-display font-700 text-white text-base mb-2">{title}</h3>
                  <p className="font-body text-white/60 text-sm leading-relaxed">{desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 8. FAQ Section ── */}
        <section className="section-padding bg-background" id="faq">
          <div className="container-custom max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <SectionBadge text="FAQ" />
              <h2 className="font-display font-800 text-3xl sm:text-4xl text-primary mb-4 leading-tight">
                Frequently Asked Questions
              </h2>
              <p className="font-body text-muted-foreground text-lg leading-relaxed">
                Everything you need to know about booking with Flywings.
              </p>
            </motion.div>

            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <FAQItem key={faq.question} {...faq} index={i} />
              ))}
            </div>

            {/* Still have questions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-10 text-center p-7 bg-muted/50 border border-border rounded-2xl"
            >
              <h3 className="font-display font-700 text-primary text-lg mb-2">Still have questions?</h3>
              <p className="font-body text-muted-foreground text-sm mb-5">
                Our travel experts are available 24/7 to answer all your queries.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => setInquiryOpen(true)}
                  className="flex items-center gap-2 px-6 py-2.5 bg-primary text-secondary font-display font-700 text-sm rounded-full hover:bg-primary/90 transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  Ask a Question
                </button>
                <a
                  href="tel:+919914310333"
                  className="flex items-center gap-2 px-6 py-2.5 border border-primary text-primary font-display font-700 text-sm rounded-full hover:bg-primary/5 transition-all"
                >
                  <Phone className="w-4 h-4" />
                  Call Us Now
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── 9. Final CTA ── */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-gold opacity-95" />
          <div className="absolute inset-0 opacity-10">
            <svg viewBox="0 0 1440 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <path d="M0 200 Q360 0 720 200 Q1080 400 1440 200" stroke="currentColor" strokeWidth="2" className="text-primary" fill="none" />
              <path d="M0 300 Q360 100 720 300 Q1080 500 1440 300" stroke="currentColor" strokeWidth="2" className="text-primary" fill="none" />
            </svg>
          </div>
          <div className="absolute top-8 right-8 w-48 h-48 rounded-full bg-primary/10 -mr-16 -mt-16" />
          <div className="absolute bottom-8 left-8 w-32 h-32 rounded-full bg-primary/10 -ml-10 -mb-10" />

          <div className="relative container-custom text-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7 }}
            >
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-6">
                <Globe className="w-3.5 h-3.5 text-primary" />
                <span className="text-primary text-xs font-body font-medium tracking-widest uppercase">Plan With Confidence</span>
              </div>

              <h2 className="font-display font-900 text-3xl sm:text-4xl lg:text-5xl text-primary mb-5 max-w-2xl mx-auto leading-tight">
                Let's Plan Your <br />Next Journey
              </h2>

              <p className="text-primary/70 font-body text-lg max-w-lg mx-auto mb-10 leading-relaxed">
                Talk to our expert consultants and receive a personalized itinerary — completely free, with no obligations.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4">
                <button
                  onClick={() => setInquiryOpen(true)}
                  className="group flex items-center gap-2 px-8 py-4 bg-primary text-secondary font-display font-700 rounded-full hover:bg-primary/90 transition-all duration-200 hover:scale-105 shadow-navy text-sm sm:text-base"
                >
                  <MessageCircle className="w-5 h-5" />
                  Get a Free Quote
                </button>
                <a
                  href="tel:+919914310333"
                  className="flex items-center gap-2 px-8 py-4 border-2 border-primary text-primary font-display font-700 rounded-full hover:bg-primary/10 transition-all duration-200 text-sm sm:text-base"
                >
                  <Phone className="w-5 h-5" />
                  Call +91 99143 10333
                </a>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 mt-10">
                {["No Booking Fee", "Free Consultation", "Best Price Match", "Instant Confirmation"].map((tag) => (
                  <div key={tag} className="flex items-center gap-1.5 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span className="text-primary text-xs font-body font-medium">{tag}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton />
      <InquiryModal isOpen={inquiryOpen} onClose={() => setInquiryOpen(false)} />
    </div>
  );
}
