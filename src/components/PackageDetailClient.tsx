"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, Star, Clock, MapPin, Hotel, Utensils, Plane,
  CheckCircle2, XCircle, Phone, MessageCircle, ArrowRight,
  ChevronDown, ChevronUp, Users, Shield, Headphones, BadgeCheck,
  Globe, Zap, ImageIcon, X, Tag, Info,
  AlertTriangle,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import InquiryModal from "@/components/InquiryModal";
import type { TourData } from "@/lib/tours";
import { sanitizeWpHtml } from "@/lib/sanitize";

/* ─── Helpers ─────────────────────────────────────────────────────────────── */

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${i < Math.floor(rating) ? "text-secondary fill-secondary" : "text-secondary/30"}`}
          />
        ))}
      </div>
      <span className="font-display font-700 text-secondary text-sm">{rating}</span>
      <span className="text-white/60 font-body text-xs">({count.toLocaleString()} reviews)</span>
    </div>
  );
}

function QuickFact({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center text-center p-4 bg-muted/60 rounded-xl border border-border">
      <div className="w-9 h-9 rounded-lg bg-secondary/10 border border-secondary/20 flex items-center justify-center mb-2">
        <Icon className="w-4 h-4 text-secondary" />
      </div>
      <div className="text-muted-foreground font-body text-xs mb-0.5">{label}</div>
      <div className="text-primary font-display font-700 text-sm leading-snug">{value}</div>
    </div>
  );
}

function SectionHeader({ badge, title, subtitle }: { badge: string; title: string; subtitle?: string }) {
  return (
    <div className="text-center mb-12">
      <div className="inline-flex items-center gap-2 bg-secondary/10 border border-secondary/30 rounded-full px-4 py-1.5 mb-4">
        <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
        <span className="text-secondary text-xs font-body font-semibold tracking-widest uppercase">{badge}</span>
      </div>
      <h2 className="font-display font-800 text-3xl sm:text-4xl text-primary mb-4 leading-tight">{title}</h2>
      {subtitle && <p className="text-muted-foreground font-body max-w-2xl mx-auto leading-relaxed">{subtitle}</p>}
    </div>
  );
}

/* ─── Image Gallery Modal ─────────────────────────────────────────────────── */
function GalleryModal({ images, activeIndex, onClose }: {
  images: string[]; activeIndex: number; onClose: () => void;
}) {
  const [current, setCurrent] = useState(activeIndex);
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="relative w-full max-w-4xl"
        >
          <button
            onClick={onClose}
            className="absolute -top-12 right-0 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
          <img
            src={images[current]}
            alt={`Gallery image ${current + 1}`}
            className="w-full h-auto max-h-[80vh] object-cover rounded-2xl"
          />
          {images.length > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${i === current ? "bg-secondary w-6" : "bg-white/40"}`}
                />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

/* ─── FAQ Item ────────────────────────────────────────────────────────────── */
function FAQItem({ faq, index }: { faq: { question: string; answer: string }; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06 }}
      className="border border-border rounded-xl overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 bg-card hover:bg-muted/40 transition-colors text-left"
      >
        <span className="font-display font-600 text-primary text-sm sm:text-base">{faq.question}</span>
        {open
          ? <ChevronUp className="w-5 h-5 text-secondary flex-shrink-0" />
          : <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
        }
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28 }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-5 text-muted-foreground font-body text-sm leading-relaxed border-t border-border pt-4">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Sticky Enquiry Sidebar ─────────────────────────────────────────────── */
function BookingSidebar({ pkg, onBook }: { pkg: TourData; onBook: () => void }) {
  return (
    <div className="sticky top-28 bg-card border border-border rounded-2xl shadow-card overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-navy px-6 pt-6 pb-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/10 rounded-full -mr-8 -mt-8" />
        {pkg.badge && (
          <div className="inline-flex items-center gap-1.5 bg-secondary/20 border border-secondary/30 rounded-full px-3 py-1 mb-3">
            <Tag className="w-3 h-3 text-secondary" />
            <span className="text-secondary text-xs font-body font-semibold">{pkg.badge}</span>
          </div>
        )}
        <div className="text-white font-display font-700 text-lg mb-1">Interested in this package?</div>
        <div className="text-white/60 font-body text-xs">Enquire and our travel expert will get back to you.</div>
      </div>

      {/* CTAs */}
      <div className="p-6 space-y-3">
        <button
          onClick={onBook}
          className="w-full py-3.5 bg-gradient-gold text-primary font-display font-700 rounded-xl shadow-gold hover:opacity-90 hover:scale-[1.02] transition-all duration-200"
        >
          Enquire Now
        </button>

        <a
          href={`https://wa.me/919914310333?text=Hi! I'm interested in the ${pkg.shortTitle} package. Please share details.`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 py-3 bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] font-display font-600 text-sm rounded-xl hover:bg-[#25D366]/20 transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          WhatsApp Us
        </a>
      </div>

      {/* Trust Badges */}
      <div className="border-t border-border px-6 pb-5 pt-4 space-y-2">
        {[
          { icon: Shield, text: "Secure & confidential enquiry" },
          { icon: BadgeCheck, text: "Fast response" },
          { icon: Phone, text: "24/7 support: +91 99143 10333" },
        ].map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-center gap-2">
            <Icon className="w-3.5 h-3.5 text-secondary flex-shrink-0" />
            <span className="text-muted-foreground font-body text-xs">{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Related Package Card ────────────────────────────────────────────────── */
function RelatedCard({ pkg, index }: { pkg: TourData; index: number }) {
  const router = useRouter();
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      onClick={() => router.push(`/packages/${pkg.slug}`)}
      className="group rounded-2xl overflow-hidden border border-border shadow-card cursor-pointer hover:-translate-y-1 transition-all duration-300 bg-card"
    >
      <div className="relative h-44 overflow-hidden">
        <img
          src={pkg.heroImages[0]}
          alt={pkg.shortTitle}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-card" />
        {pkg.badge && (
          <div className="absolute top-3 left-3 bg-secondary text-primary text-xs font-display font-700 px-2.5 py-1 rounded-full">
            {pkg.badge}
          </div>
        )}
        <div className="absolute bottom-3 left-3">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-3 h-3 ${i < Math.floor(pkg.rating) ? "fill-secondary text-secondary" : "text-white/30"}`} />
            ))}
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-1.5 text-muted-foreground font-body text-xs mb-1">
          <Clock className="w-3 h-3" /> {pkg.duration}
        </div>
        <h3 className="font-display font-700 text-primary text-sm mb-3 leading-snug line-clamp-2">{pkg.shortTitle}</h3>
        <div className="flex items-center justify-end">
          <Link
            href={`/packages/${pkg.slug}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 text-secondary font-body text-xs font-semibold hover:gap-2 transition-all"
          >
            View <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Main Client Component ─────────────────────────────────────────────────
   Receives the already-resolved tour (WordPress or local fallback) and its
   related tours from the server component — no client-side data fetching. */
export default function PackageDetailClient({ pkg, related }: { pkg: TourData; related: TourData[] }) {
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [activeDay, setActiveDay] = useState<number | null>(0);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [activeHeroImage, setActiveHeroImage] = useState(0);

  /* Auto-cycle hero images */
  useEffect(() => {
    if (pkg.heroImages.length <= 1) return;
    const t = setInterval(() => {
      setActiveHeroImage((i) => (i + 1) % pkg.heroImages.length);
    }, 4500);
    return () => clearInterval(t);
  }, [pkg]);

  const hasStructuredItinerary = pkg.itinerary.length > 0;
  const hasItinerary = hasStructuredItinerary;
  const hasInclusionsOrExclusions = pkg.inclusions.length > 0 || pkg.exclusions.length > 0;
  const hasHotels = pkg.hotels.length > 0;
  const hasFaqs = pkg.faqs.length > 0;
  const hasCancellationPolicy = pkg.cancellationPolicy.length > 0;
  const hasGallery = pkg.heroImages.length >= 2;

  const quickFacts = [
    pkg.duration && { icon: Clock, label: "Duration", value: pkg.duration },
    pkg.destinations.length > 0 && { icon: MapPin, label: "Destinations", value: pkg.destinations.join(", ") },
    pkg.hotelCategory && { icon: Hotel, label: "Hotel Category", value: pkg.hotelCategory },
    { icon: Plane, label: "Transfers", value: pkg.transferIncluded ? "Included" : "Not Included" },
    pkg.mealsIncluded && { icon: Utensils, label: "Meals", value: pkg.mealsIncluded },
    { icon: Users, label: "Group Size", value: "Private & Group" },
  ].filter(Boolean) as { icon: React.ElementType; label: string; value: string }[];

  return (
    <div className="min-h-screen bg-background font-body">
      <Navbar onInquiryOpen={() => setInquiryOpen(true)} />

      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section className="relative h-[90vh] min-h-[600px] flex items-end overflow-hidden">
        {/* Cycling hero images */}
        {pkg.heroImages.map((img, i) => (
          <motion.img
            key={i}
            src={img}
            alt={`${pkg.shortTitle} — image ${i + 1}`}
            className="absolute inset-0 w-full h-full object-cover"
            animate={{ opacity: i === activeHeroImage ? 1 : 0 }}
            transition={{ duration: 1.2 }}
          />
        ))}

        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/50 to-transparent" />

        {/* Breadcrumb */}
        <div className="absolute top-28 left-0 right-0">
          <div className="container-custom">
            <nav className="flex items-center gap-2 text-white/70 font-body text-sm" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-secondary transition-colors">Home</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              {pkg.destinationSlug ? (
                <Link href={`/destinations/${pkg.destinationSlug}`} className="hover:text-secondary transition-colors capitalize">
                  {pkg.destinationSlug}
                </Link>
              ) : (
                <span className="text-white/70">Packages</span>
              )}
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-secondary font-semibold">{pkg.shortTitle}</span>
            </nav>
          </div>
        </div>

        {/* Hero content */}
        <div className="relative container-custom pb-14 sm:pb-20 w-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            {pkg.badge && (
              <div className="inline-flex items-center gap-1.5 bg-secondary/20 border border-secondary/40 rounded-full px-3 py-1.5 mb-4 backdrop-blur-sm">
                <Zap className="w-3 h-3 text-secondary" />
                <span className="text-secondary text-xs font-body font-semibold tracking-widest uppercase">{pkg.badge}</span>
              </div>
            )}

            <h1 className="font-display font-900 text-3xl sm:text-4xl lg:text-5xl text-white mb-4 leading-tight">
              {pkg.title}
            </h1>

            {pkg.tagline && (
              <p className="font-body text-white/75 text-base max-w-2xl mb-5 leading-relaxed">{pkg.tagline}</p>
            )}

            {pkg.rating > 0 && <StarRating rating={pkg.rating} count={pkg.reviewCount} />}

            <div className="flex flex-wrap items-center gap-3 mt-5">
              {pkg.duration && (
                <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-3 py-2">
                  <Clock className="w-3.5 h-3.5 text-white/70" />
                  <span className="text-white/80 font-body text-xs">{pkg.duration}</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-3 mt-7">
              <button
                onClick={() => setInquiryOpen(true)}
                className="px-7 py-3.5 bg-gradient-gold text-primary font-display font-700 rounded-full shadow-gold hover:opacity-90 hover:scale-105 transition-all duration-200"
              >
                Enquire Now
              </button>
              {hasItinerary && (
                <a
                  href="#itinerary"
                  className="px-7 py-3.5 bg-white/15 backdrop-blur-sm border border-white/30 text-white font-display font-600 rounded-full hover:bg-white/25 transition-all duration-200"
                >
                  View Itinerary
                </a>
              )}
            </div>
          </motion.div>
        </div>

        {/* Image thumbnails (bottom-right) */}
        {pkg.heroImages.length > 1 && (
          <div className="absolute bottom-5 right-6 hidden sm:flex gap-2">
            {pkg.heroImages.map((img, i) => (
              <button
                key={i}
                onClick={() => { setGalleryIndex(i); setGalleryOpen(true); }}
                className={`w-14 h-10 rounded-lg overflow-hidden border-2 transition-all ${i === activeHeroImage ? "border-secondary" : "border-white/30"}`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
            <button
              onClick={() => setGalleryOpen(true)}
              className="w-14 h-10 rounded-lg bg-black/40 border-2 border-white/30 flex items-center justify-center"
            >
              <ImageIcon className="w-4 h-4 text-white" />
            </button>
          </div>
        )}
      </section>

      {/* ── STICKY MOBILE CTA ───────────────────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 sm:hidden bg-primary border-t border-secondary/20 px-4 py-3 flex gap-2">
        <button
          onClick={() => setInquiryOpen(true)}
          className="flex-1 py-3 bg-gradient-gold text-primary font-display font-700 text-sm rounded-xl shadow-gold"
        >
          Enquire Now
        </button>
        <a
          href={`https://wa.me/919914310333?text=Hi! Interested in ${pkg.shortTitle}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 flex items-center justify-center bg-[#25D366] rounded-xl"
        >
          <MessageCircle className="w-5 h-5 text-white" />
        </a>
      </div>

      {/* ── QUICK OVERVIEW BAR ──────────────────────────────────────────────── */}
      {quickFacts.length > 0 && (
        <section className="bg-primary border-b border-secondary/20">
          <div className="container-custom py-5">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {quickFacts.map((fact) => (
                <QuickFact key={fact.label} icon={fact.icon} label={fact.label} value={fact.value} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── MAIN CONTENT + SIDEBAR ──────────────────────────────────────────── */}
      <div className="container-custom py-12 sm:py-16">
        <div className="grid lg:grid-cols-[1fr_380px] gap-10 items-start">

          {/* LEFT COLUMN */}
          <div className="space-y-16 min-w-0">

            {/* ── OVERVIEW ──────────────────────────────────────────────────── */}
            <section>
              <div className="inline-flex items-center gap-2 bg-secondary/10 border border-secondary/30 rounded-full px-4 py-1.5 mb-4">
                <span className="text-secondary text-xs font-body font-semibold tracking-widest uppercase">Package Overview</span>
              </div>
              <h2 className="font-display font-800 text-2xl sm:text-3xl text-primary mb-5 leading-tight">
                {pkg.title}
              </h2>
              {pkg.contentHtml ? (
                <div
                  className="text-muted-foreground font-body leading-relaxed text-base prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: sanitizeWpHtml(pkg.contentHtml) }}
                />
              ) : (
                <p className="text-muted-foreground font-body leading-relaxed text-base">{pkg.overview}</p>
              )}
            </section>

            {/* ── ITINERARY ─────────────────────────────────────────────────── */}
            {hasItinerary && (
              <section id="itinerary">
                <SectionHeader
                  badge="Day by Day"
                  title="Detailed Itinerary"
                  subtitle={pkg.duration ? `Your complete ${pkg.duration} journey — planned to perfection.` : undefined}
                />
                <div className="space-y-3">
                    {pkg.itinerary.map((day, i) => (
                      <motion.div
                        key={day.day}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.05 }}
                        className="border border-border rounded-2xl overflow-hidden bg-card shadow-card"
                      >
                        <button
                          onClick={() => setActiveDay(activeDay === i ? null : i)}
                          className="w-full flex items-center gap-4 px-5 py-4 hover:bg-muted/40 transition-colors text-left"
                        >
                          <div className="w-14 h-14 rounded-xl bg-gradient-navy text-secondary font-display font-800 text-xs flex flex-col items-center justify-center flex-shrink-0 leading-tight">
                            <span className="text-white/60 text-[10px] uppercase">Day</span>
                            <span className="text-xl font-900">{day.day}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-display font-700 text-primary text-sm sm:text-base leading-snug">{day.title}</h3>
                            <p className="text-muted-foreground font-body text-xs sm:text-sm mt-0.5 line-clamp-1">{day.description}</p>
                          </div>
                          {activeDay === i
                            ? <ChevronUp className="w-5 h-5 text-secondary flex-shrink-0" />
                            : <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                          }
                        </button>
                        <AnimatePresence>
                          {activeDay === i && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.28 }}
                              className="overflow-hidden"
                            >
                              <div className="px-5 pb-5 border-t border-border pt-4 ml-18">
                                <p className="text-muted-foreground font-body text-sm leading-relaxed mb-4">{day.description}</p>
                                <ul className="space-y-2">
                                  {day.activities.map((act) => (
                                    <li key={act} className="flex items-start gap-2.5 font-body text-sm text-foreground">
                                      <CheckCircle2 className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                                      {act}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                </div>
              </section>
            )}

            {/* ── INCLUSIONS & EXCLUSIONS ───────────────────────────────────── */}
            {hasInclusionsOrExclusions && (
              <section>
                <SectionHeader badge="What's Included" title="Package Inclusions & Exclusions" />
                <div className="grid md:grid-cols-2 gap-6">
                  {pkg.inclusions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      className="bg-muted/50 border border-border rounded-2xl p-6"
                    >
                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        </div>
                        <h3 className="font-display font-700 text-primary text-base">✔ What's Included</h3>
                      </div>
                      <ul className="space-y-3">
                        {pkg.inclusions.map((item) => (
                          <li key={item} className="flex items-start gap-2.5 font-body text-sm text-foreground">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}

                  {pkg.exclusions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      className="bg-muted/30 border border-border rounded-2xl p-6"
                    >
                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-9 h-9 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center">
                          <XCircle className="w-5 h-5 text-red-500" />
                        </div>
                        <h3 className="font-display font-700 text-primary text-base">✖ Not Included</h3>
                      </div>
                      <ul className="space-y-3">
                        {pkg.exclusions.map((item) => (
                          <li key={item} className="flex items-start gap-2.5 font-body text-sm text-foreground">
                            <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </div>
              </section>
            )}

            {/* ── HOTELS ────────────────────────────────────────────────────── */}
            {hasHotels && (
              <section>
                <SectionHeader badge="Accommodation" title="Hotel Details" subtitle="Premium properties selected for comfort, location & value." />
                <div className="space-y-4">
                  {pkg.hotels.map((hotel, i) => (
                    <motion.div
                      key={hotel.name}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 }}
                      className="bg-card border border-border rounded-2xl p-6 shadow-card"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/5 border border-border flex items-center justify-center flex-shrink-0">
                          <Hotel className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-3 flex-wrap mb-1">
                            <h3 className="font-display font-700 text-primary text-base">{hotel.name}</h3>
                            <div className="flex items-center gap-0.5">
                              {[...Array(hotel.stars)].map((_, j) => (
                                <Star key={j} className="w-3 h-3 fill-secondary text-secondary" />
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 text-muted-foreground font-body text-xs mb-2">
                            <MapPin className="w-3 h-3" /> {hotel.location}
                          </div>
                          <div className="inline-flex items-center gap-1.5 bg-muted px-2.5 py-1 rounded-full text-xs font-body text-primary mb-3">
                            <BadgeCheck className="w-3 h-3 text-secondary" />
                            Room: {hotel.roomType}
                          </div>
                          {hotel.upgradeOption && (
                            <div className="flex items-start gap-1.5 bg-secondary/5 border border-secondary/20 rounded-xl px-3 py-2">
                              <Info className="w-3.5 h-3.5 text-secondary flex-shrink-0 mt-0.5" />
                              <span className="text-secondary font-body text-xs">{hotel.upgradeOption}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* ── CUSTOMIZATION ─────────────────────────────────────────────── */}
            <section className="bg-gradient-navy rounded-3xl p-8 sm:p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full -mr-32 -mt-32" />
              <div className="relative">
                <div className="inline-flex items-center gap-2 bg-secondary/20 border border-secondary/30 rounded-full px-4 py-1.5 mb-4">
                  <span className="text-secondary text-xs font-body font-semibold tracking-widest uppercase">Customization</span>
                </div>
                <h2 className="font-display font-800 text-2xl sm:text-3xl text-white mb-3 leading-tight">
                  Want to Customize This Package?
                </h2>
                <p className="text-white/70 font-body text-base mb-6 max-w-xl leading-relaxed">
                  Every journey is unique. We can adjust the itinerary, upgrade your hotel, add activities, extend your stay, or build an entirely custom plan — just for you.
                </p>
                <div className="grid sm:grid-cols-2 gap-3 mb-7">
                  {[
                    "Custom itinerary based on your interests",
                    "Hotel category upgrades available",
                    "Add extra activities or excursions",
                    "Extend or shorten your trip duration",
                    "Group discounts for 10+ travelers",
                    "Honeymoon & anniversary specials",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                      <span className="text-white/80 font-body text-sm">{item}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setInquiryOpen(true)}
                  className="px-8 py-3.5 bg-gradient-gold text-primary font-display font-700 rounded-full shadow-gold hover:opacity-90 hover:scale-105 transition-all duration-200"
                >
                  Customize This Package
                </button>
              </div>
            </section>

            {/* ── GALLERY ───────────────────────────────────────────────────── */}
            {hasGallery && (
              <section>
                <SectionHeader badge="Photo Gallery" title="See Your Destination" />
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {pkg.heroImages.concat(pkg.heroImages).slice(0, 6).map((img, i) => (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.06 }}
                      onClick={() => { setGalleryIndex(i % pkg.heroImages.length); setGalleryOpen(true); }}
                      className={`relative overflow-hidden rounded-2xl group ${i === 0 ? "col-span-2 row-span-2" : ""}`}
                    >
                      <img
                        src={img}
                        alt={`${pkg.shortTitle} gallery ${i + 1}`}
                        className={`w-full object-cover group-hover:scale-105 transition-transform duration-700 ${i === 0 ? "h-72" : "h-36"}`}
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-white" />
                      </div>
                    </motion.button>
                  ))}
                </div>
              </section>
            )}

            {/* ── FAQ ───────────────────────────────────────────────────────── */}
            {hasFaqs && (
              <section>
                <SectionHeader
                  badge="FAQs"
                  title="Frequently Asked Questions"
                  subtitle="Everything you need to know about this tour package."
                />
                <div className="space-y-3">
                  {pkg.faqs.map((faq, i) => (
                    <FAQItem key={i} faq={faq} index={i} />
                  ))}
                </div>
              </section>
            )}

            {/* ── CANCELLATION POLICY ───────────────────────────────────────── */}
            {hasCancellationPolicy && (
              <section>
                <SectionHeader badge="Cancellation" title="Cancellation & Refund Policy" />
                <div className="bg-card border border-border rounded-2xl p-6 shadow-card">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-amber-500" />
                    </div>
                    <h3 className="font-display font-700 text-primary text-base">Cancellation Terms</h3>
                  </div>
                  <ul className="space-y-3">
                    {pkg.cancellationPolicy.map((policy, i) => (
                      <li key={i} className="flex items-start gap-3 font-body text-sm text-foreground">
                        <div className="w-5 h-5 rounded-full bg-secondary/10 border border-secondary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-secondary font-display font-700 text-[10px]">{i + 1}</span>
                        </div>
                        {policy}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 flex items-start gap-2 bg-muted/60 rounded-xl px-4 py-3">
                    <Info className="w-4 h-4 text-primary/60 flex-shrink-0 mt-0.5" />
                    <p className="text-muted-foreground font-body text-xs leading-relaxed">
                      All cancellations must be submitted in writing to <a href="mailto:sales@flywingstour.co.in" className="text-secondary hover:underline">sales@flywingstour.co.in</a>. Refunds are processed within 7–14 business days to the original payment method.
                    </p>
                  </div>
                </div>
              </section>
            )}

          </div>

          {/* RIGHT SIDEBAR (desktop) */}
          <div className="hidden lg:block">
            <BookingSidebar pkg={pkg} onBook={() => setInquiryOpen(true)} />
          </div>
        </div>
      </div>

      {/* ── WHY BOOK WITH FLYWINGS ──────────────────────────────────────────── */}
      <section className="section-padding bg-primary">
        <div className="container-custom">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-secondary/20 border border-secondary/30 rounded-full px-4 py-1.5 mb-4">
              <span className="text-secondary text-xs font-body font-semibold tracking-widest uppercase">Why Flywings</span>
            </div>
            <h2 className="font-display font-800 text-3xl sm:text-4xl text-white mb-4">
              Why Book This Package With Flywings?
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Headphones, title: "24/7 Support", desc: "Round-the-clock assistance before, during & after your trip" },
              { icon: Globe, title: "Visa Assistance", desc: "Complete visa guidance, documentation & submission support" },
              { icon: BadgeCheck, title: "Transparent Pricing", desc: "No hidden fees — zero surprises at checkout" },
              { icon: Shield, title: "Secure Booking", desc: "100% safe & encrypted payment processing" },
            ].map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-colors"
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-secondary/20 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="font-display font-700 text-white text-sm mb-2">{title}</h3>
                <p className="text-white/50 font-body text-xs leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RELATED PACKAGES ────────────────────────────────────────────────── */}
      {related.length > 0 && (
        <section className="section-padding bg-muted/30">
          <div className="container-custom">
            <SectionHeader
              badge="You May Also Like"
              title="Related Tour Packages"
              subtitle="Explore more handpicked packages tailored for every kind of traveler."
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((relPkg, i) => (
                <RelatedCard key={relPkg.slug} pkg={relPkg} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FINAL CTA ───────────────────────────────────────────────────────── */}
      <section className="section-padding bg-gradient-navy relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-secondary rounded-full blur-3xl -mr-48 -mt-48" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-secondary rounded-full blur-3xl -ml-36 -mb-36" />
        </div>
        <div className="container-custom relative text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 bg-secondary/20 border border-secondary/30 rounded-full px-4 py-1.5 mb-6">
              <Plane className="w-3.5 h-3.5 text-secondary" />
              <span className="text-secondary text-xs font-body font-semibold tracking-widest uppercase">Let's Go!</span>
            </div>
            <h2 className="font-display font-900 text-3xl sm:text-5xl text-white mb-4 leading-tight">
              Plan Your {pkg.shortTitle}<br className="hidden sm:block" />
              <span className="text-secondary"> With Flywings Today</span>
            </h2>
            <p className="text-white/60 font-body text-lg max-w-xl mx-auto mb-10">
              Talk to our expert travel consultants and get a personalized itinerary crafted just for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setInquiryOpen(true)}
                className="px-8 py-4 bg-gradient-gold text-primary font-display font-700 rounded-full shadow-gold hover:opacity-90 hover:scale-105 transition-all duration-200 text-base"
              >
                Talk To Travel Expert
              </button>
              <a
                href={`https://wa.me/919914310333?text=Hi! I want to book the ${pkg.shortTitle} package. Please share details.`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-[#25D366]/20 border border-[#25D366]/40 text-white font-display font-600 rounded-full hover:bg-[#25D366]/30 transition-all duration-200 text-base flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5 text-[#25D366]" />
                WhatsApp Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />

      {/* Extra bottom padding for mobile sticky CTA */}
      <div className="h-20 sm:hidden" />

      {/* Floating elements */}
      <WhatsAppButton />
      <InquiryModal isOpen={inquiryOpen} onClose={() => setInquiryOpen(false)} />

      {/* Gallery Modal */}
      {galleryOpen && (
        <GalleryModal
          images={pkg.heroImages}
          activeIndex={galleryIndex}
          onClose={() => setGalleryOpen(false)}
        />
      )}
    </div>
  );
}
