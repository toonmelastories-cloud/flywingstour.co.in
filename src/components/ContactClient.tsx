"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useSubmitContact } from "@/hooks/useApi";
import Link from "next/link";
import {
  ChevronRight, Phone, Mail, MapPin, Clock, MessageCircle,
  Send, CheckCircle, Zap, FileText, DollarSign, HeadphonesIcon,
  Shield, Globe, Loader2
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import InquiryModal from "@/components/InquiryModal";

const contactHero = "/assets/contact-hero.jpg";

import { contactFaqs as faqs } from "@/data/contact-faqs";

/* ─── Why Contact Data ─────────────────────────── */
const whyItems = [
  { icon: Zap, title: "Fast Response", desc: "Get a reply within 2–4 hours on all inquiries" },
  { icon: FileText, title: "Personalized Itinerary", desc: "Custom travel plans tailored to your preferences" },
  { icon: DollarSign, title: "Transparent Pricing", desc: "No hidden charges — what you see is what you pay" },
  { icon: Shield, title: "Expert Travel Support", desc: "Seasoned consultants with 10+ years experience" },
  { icon: HeadphonesIcon, title: "24/7 Assistance", desc: "Round-the-clock support before, during & after your trip" },
];

/* ─── Contact Page ─────────────────────────────── */
export default function ContactClient() {
  const [inquiryOpen, setInquiryOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background font-body">
      <Navbar onInquiryOpen={() => setInquiryOpen(true)} />
      <main>
        <HeroSection />
        <ContactInfoSection />
        <ContactFormSection />
        <WhyContactSection />
        <FAQSection />
        <FinalCTA onInquiryOpen={() => setInquiryOpen(true)} />
      </main>
      <Footer />
      <WhatsAppButton />
      {/* Sticky mobile call button */}
      <a
        href="tel:+919914310333"
        className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full bg-primary text-secondary flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200 lg:hidden"
        aria-label="Call Flywings"
      >
        <Phone className="w-6 h-6" />
      </a>
      <InquiryModal isOpen={inquiryOpen} onClose={() => setInquiryOpen(false)} />
    </div>
  );
}

/* ─── 1. Hero ──────────────────────────────────── */
function HeroSection() {
  return (
    <section className="relative h-[60vh] min-h-[450px] flex items-end pb-16 overflow-hidden">
      <img src={contactHero} alt="Flywings Tour and Travel — contact our travel experts" className="absolute inset-0 w-full h-full object-cover" loading="eager" />
      <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/50 to-primary/80" />
      <div className="relative container-custom w-full">
        <motion.nav
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-sm font-body text-white/70 mb-5"
        >
          <Link href="/" className="hover:text-secondary transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-secondary font-medium">Contact</span>
        </motion.nav>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="font-display font-900 text-4xl sm:text-5xl lg:text-6xl text-white max-w-3xl leading-tight mb-4"
        >
          Contact <span className="text-secondary">Flywings</span> Tour and Travel
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="font-body text-white/80 text-lg sm:text-xl max-w-xl leading-relaxed"
        >
          Let's Plan Your Next Journey Together
        </motion.p>
      </div>
    </section>
  );
}

/* ─── 2. Contact Info ──────────────────────────── */
function ContactInfoSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const cards = [
    { icon: Phone, title: "Call Us", info: "+91 99143 10333 · 0172-4736185", href: "tel:+919914310333", color: "bg-primary" },
    { icon: MessageCircle, title: "WhatsApp Us", info: "+91 99143 10333", href: "https://wa.me/919914310333?text=Hello%20Flywings!", color: "bg-[#25D366]" },
    { icon: Mail, title: "Email Us", info: "sales@flywingstour.co.in", href: "mailto:sales@flywingstour.co.in", color: "bg-secondary" },
    { icon: MapPin, title: "Visit Our Office", info: "SCF 29, Phase 7, Mohali", href: "https://maps.google.com/?q=SCF+29+Phase+7+SAS+Nagar+Mohali+160062", color: "bg-primary" },
  ];

  return (
    <section className="section-padding bg-background" ref={ref}>
      <div className="container-custom">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-secondary/10 border border-secondary/30 rounded-full px-4 py-1.5 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
            <span className="text-secondary text-xs font-body font-semibold tracking-widest uppercase">Get In Touch</span>
          </div>
          <h2 className="font-display font-800 text-3xl sm:text-4xl text-primary mb-4 leading-tight">We're Here To Help</h2>
          <p className="text-muted-foreground font-body text-lg max-w-2xl mx-auto">Reach out through any channel — our friendly travel experts are always ready to assist you.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left — Details */}
          <div>
            <div className="space-y-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-secondary/15 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <h3 className="font-display font-700 text-primary text-base mb-1">Office Address</h3>
                  <p className="text-muted-foreground font-body text-sm leading-relaxed">SCF 29, First Floor, Phase 7,<br />S.A.S Nagar Mohali, Punjab — 160062</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-secondary/15 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <h3 className="font-display font-700 text-primary text-base mb-1">Phone / WhatsApp</h3>
                  <a href="tel:+919914310333" className="text-muted-foreground hover:text-secondary transition-colors font-body text-sm">+91 99143 10333</a>
                  <br />
                  <a href="tel:+911724736185" className="text-muted-foreground hover:text-secondary transition-colors font-body text-sm">0172-4736185 (Landline)</a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-secondary/15 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <h3 className="font-display font-700 text-primary text-base mb-1">Email</h3>
                  <a href="mailto:sales@flywingstour.co.in" className="text-muted-foreground hover:text-secondary transition-colors font-body text-sm">sales@flywingstour.co.in</a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-secondary/15 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <h3 className="font-display font-700 text-primary text-base mb-1">Working Hours</h3>
                  <p className="text-muted-foreground font-body text-sm">Mon – Sat: 9:30 AM – 6:30 PM</p>
                  <p className="text-muted-foreground font-body text-sm">Sunday: Closed</p>
                </div>
              </div>
            </div>
            {/* Google Map */}
            <div className="rounded-2xl overflow-hidden shadow-lg border border-border">
              <iframe
                title="Flywings Tour and Travel Office Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3430.0!2d76.7!3d30.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sSCF+29+Phase+7+SAS+Nagar+Mohali!5e0!3m2!1sen!2sin!4v1"
                width="100%"
                height="280"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full"
              />
            </div>
          </div>

          {/* Right — Contact Cards */}
          <div className="grid sm:grid-cols-2 gap-4">
            {cards.map(({ icon: Icon, title, info, href, color }, i) => (
              <motion.a
                key={title}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-display font-700 text-primary text-base mb-1">{title}</h3>
                <p className="text-muted-foreground font-body text-sm">{info}</p>
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── 3. Contact Form ──────────────────────────── */
function ContactFormSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [submitted, setSubmitted] = useState(false);
  const contactMutation = useSubmitContact();
  const [form, setForm] = useState({ phone: "", email: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    contactMutation.mutate(
      { ...form, source: "contact-page" },
      {
        onSuccess: () => {
          setSubmitted(true);
          setTimeout(() => {
            setSubmitted(false);
            setForm({ phone: "", email: "" });
          }, 4000);
        },
      }
    );
  };
  const loading = contactMutation.isPending;

  const set = (key: string, val: string) => setForm(prev => ({ ...prev, [key]: val }));

  return (
    <section className="section-padding bg-muted/30" ref={ref} id="inquiry-form">
      <div className="container-custom">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-secondary/10 border border-secondary/30 rounded-full px-4 py-1.5 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
            <span className="text-secondary text-xs font-body font-semibold tracking-widest uppercase">Free Consultation</span>
          </div>
          <h2 className="font-display font-800 text-3xl sm:text-4xl text-primary mb-4 leading-tight">Get Your Free Travel Consultation</h2>
          <p className="text-muted-foreground font-body text-lg max-w-2xl mx-auto">Leave your phone number and email and our travel expert will contact you within a few hours.</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="max-w-lg mx-auto bg-card rounded-3xl shadow-lg border border-border overflow-hidden"
        >
          <div className="bg-primary px-8 py-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-secondary/10 -mr-10 -mt-10" />
            <div className="relative">
              <h3 className="font-display font-800 text-2xl text-white mb-1">Plan Your Dream Trip</h3>
              <p className="text-white/60 font-body text-sm">Our expert will call you within 24 hours.</p>
            </div>
          </div>

          <div className="p-8">
            {submitted ? (
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                <h3 className="font-display font-800 text-xl text-primary mb-2">Inquiry Sent Successfully!</h3>
                <p className="text-muted-foreground font-body text-sm">Thank you! Our travel expert will contact you shortly.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-primary font-body font-medium text-xs mb-1.5">Phone Number *</label>
                  <input required type="tel" value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="+91 XXXXX XXXXX" maxLength={15}
                    className="w-full px-4 py-3 border border-border rounded-xl text-primary font-body text-sm outline-none focus:border-secondary transition-colors" />
                </div>

                <div>
                  <label className="block text-primary font-body font-medium text-xs mb-1.5">Email Address *</label>
                  <input required type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="you@example.com" maxLength={255}
                    className="w-full px-4 py-3 border border-border rounded-xl text-primary font-body text-sm outline-none focus:border-secondary transition-colors" />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-primary text-secondary font-display font-700 rounded-xl hover:opacity-90 transition-all hover:scale-[1.01] shadow-lg disabled:opacity-60"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  {loading ? "Sending..." : "Get Free Travel Consultation"}
                </button>

                <p className="text-center text-muted-foreground font-body text-xs">
                  🔒 Your information is 100% secure and will never be shared.
                </p>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── 4. Why Contact Flywings ──────────────────── */
function WhyContactSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="section-padding bg-background" ref={ref}>
      <div className="container-custom">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-secondary/10 border border-secondary/30 rounded-full px-4 py-1.5 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
            <span className="text-secondary text-xs font-body font-semibold tracking-widest uppercase">Why Flywings</span>
          </div>
          <h2 className="font-display font-800 text-3xl sm:text-4xl text-primary mb-4 leading-tight">Why Contact Flywings?</h2>
          <p className="text-muted-foreground font-body text-lg max-w-2xl mx-auto">We don't just plan trips — we create experiences that you'll remember forever.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {whyItems.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="text-center p-6 rounded-2xl bg-card border border-border hover:shadow-md hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-xl bg-secondary/15 flex items-center justify-center mx-auto mb-4">
                <Icon className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="font-display font-700 text-primary text-sm mb-2">{title}</h3>
              <p className="text-muted-foreground font-body text-xs leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── 5. FAQ ───────────────────────────────────── */
function FAQSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="section-padding bg-muted/30" ref={ref}>
      <div className="container-custom">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-secondary/10 border border-secondary/30 rounded-full px-4 py-1.5 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
            <span className="text-secondary text-xs font-body font-semibold tracking-widest uppercase">FAQs</span>
          </div>
          <h2 className="font-display font-800 text-3xl sm:text-4xl text-primary mb-4 leading-tight">Frequently Asked Questions</h2>
          <p className="text-muted-foreground font-body text-lg max-w-2xl mx-auto">Got questions? We've got answers.</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="bg-card border border-border rounded-xl px-6 overflow-hidden">
                <AccordionTrigger className="font-display font-700 text-primary text-sm hover:no-underline py-5">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground font-body text-sm leading-relaxed pb-5">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── 6. Final CTA ─────────────────────────────── */
function FinalCTA({ onInquiryOpen }: { onInquiryOpen: () => void }) {
  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-primary" />
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-72 h-72 rounded-full bg-secondary blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-secondary blur-3xl" />
      </div>
      <div className="relative container-custom text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <Globe className="w-12 h-12 text-secondary mx-auto mb-6" />
          <h2 className="font-display font-900 text-3xl sm:text-4xl lg:text-5xl text-white mb-4">
            Ready To Explore The World?
          </h2>
          <p className="text-white/70 font-body text-lg max-w-xl mx-auto mb-8">
            Let our travel experts design the perfect trip for you. From flights to full itineraries — we've got you covered.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onInquiryOpen}
              className="px-8 py-4 bg-secondary text-primary font-display font-700 text-sm rounded-full shadow-gold hover:opacity-90 transition-all hover:scale-105"
            >
              Talk To Travel Expert Now
            </button>
            <a
              href="https://wa.me/919914310333?text=Hello%20Flywings!%20I%20want%20to%20plan%20a%20trip."
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 border-2 border-secondary/40 text-secondary font-display font-700 text-sm rounded-full hover:bg-secondary/10 transition-all"
            >
              <MessageCircle className="w-4 h-4 inline mr-2" />
              WhatsApp Us
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
