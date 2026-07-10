"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  MapPin, PenLine, BookOpen, BadgeCheck, Clock, ArrowRight,
  Sparkles, Phone, MessageCircle,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import InquiryModal from "@/components/InquiryModal";
import type { BlogPostSummary } from "@/components/BlogListClient";
import { AUTHOR } from "@/data/author";
import { CONTACT } from "@/lib/seo";

export default function AuthorClient({ posts }: { posts: BlogPostSummary[] }) {
  const [inquiryOpen, setInquiryOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background font-body">
      <Navbar onInquiryOpen={() => setInquiryOpen(true)} />

      {/* ── HERO ───────────────────────────────────────────────── */}
      <section className="relative bg-gradient-navy pt-36 pb-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-secondary rounded-full blur-3xl -mr-48 -mt-48" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-secondary rounded-full blur-3xl -ml-36 -mb-36" />
        </div>
        <div className="container-custom relative">
          <motion.nav
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-white/50 font-body text-xs mb-10"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="hover:text-secondary transition-colors">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-secondary transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-secondary">{AUTHOR.name}</span>
          </motion.nav>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-gold flex items-center justify-center shadow-gold flex-shrink-0 ring-4 ring-white/10"
            >
              <span className="font-display font-900 text-primary text-4xl">{AUTHOR.initials}</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="inline-flex items-center gap-2 bg-secondary/20 border border-secondary/30 rounded-full px-4 py-1.5 mb-4">
                <PenLine className="w-3.5 h-3.5 text-secondary" />
                <span className="text-secondary text-xs font-body font-semibold tracking-widest uppercase">
                  {AUTHOR.tagline}
                </span>
              </div>
              <h1 className="font-display font-900 text-4xl sm:text-5xl text-white mb-3 leading-tight flex items-center gap-3">
                {AUTHOR.name}
                <BadgeCheck className="w-7 h-7 text-secondary" />
              </h1>
              <p className="text-white/70 font-body text-lg mb-3">{AUTHOR.role} · Flywings Tour & Packages Pvt Ltd</p>
              <p className="flex items-center gap-1.5 text-white/50 font-body text-sm">
                <MapPin className="w-4 h-4 text-secondary" /> {AUTHOR.location}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── BIO ────────────────────────────────────────────────── */}
      <section className="section-padding bg-background">
        <div className="container-custom max-w-3xl mx-auto">
          <h2 className="font-display font-800 text-2xl sm:text-3xl text-primary mb-6">
            About {AUTHOR.name.split(" ")[0]}
          </h2>
          <div className="space-y-4 text-muted-foreground font-body leading-relaxed">
            {AUTHOR.bio.map((para) => (
              <p key={para.slice(0, 40)}>{para}</p>
            ))}
          </div>

          {/* Expertise */}
          <div className="mt-10">
            <h3 className="font-display font-700 text-primary text-lg mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-secondary" /> Writes About
            </h3>
            <div className="flex flex-wrap gap-2">
              {AUTHOR.expertise.map((topic) => (
                <span
                  key={topic}
                  className="px-4 py-2 rounded-full bg-secondary/10 border border-secondary/25 text-primary font-body text-sm"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── WRITING PRINCIPLES ─────────────────────────────────── */}
      <section className="section-padding bg-muted/40">
        <div className="container-custom">
          <h2 className="font-display font-800 text-2xl sm:text-3xl text-primary mb-10 text-center">
            How Every Guide Gets Written
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {AUTHOR.principles.map(({ title, text }, i) => (
              <div key={title} className="bg-card rounded-2xl border border-border shadow-card p-6">
                <span className="inline-flex w-9 h-9 rounded-full bg-gradient-gold text-primary font-display font-800 items-center justify-center shadow-gold mb-4">
                  {i + 1}
                </span>
                <h3 className="font-display font-700 text-primary text-base mb-2">{title}</h3>
                <p className="text-muted-foreground font-body text-sm leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ARTICLES ───────────────────────────────────────────── */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
            <h2 className="font-display font-800 text-2xl sm:text-3xl text-primary flex items-center gap-2">
              <BookOpen className="w-7 h-7 text-secondary" /> Guides by {AUTHOR.name.split(" ")[0]}
            </h2>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-primary font-body font-semibold text-sm hover:gap-3 hover:text-secondary transition-all"
            >
              View All Articles <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {posts.length === 0 ? (
            <p className="text-muted-foreground font-body">New guides are on the way — check back soon.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, i) => (
                <motion.div
                  key={post.slug}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: Math.min(i * 0.08, 0.4) }}
                >
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group block rounded-2xl overflow-hidden border border-border shadow-card hover:-translate-y-1 hover:shadow-navy transition-all duration-300 bg-card"
                  >
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                      {post.category && (
                        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-body font-semibold bg-secondary text-primary">
                          {post.category}
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-1.5 text-muted-foreground font-body text-xs mb-1">
                        <Clock className="w-3 h-3" /> {post.readTime}
                        {post.date && (
                          <>
                            <span className="text-border">•</span> {post.date}
                          </>
                        )}
                      </div>
                      <h3 className="font-display font-700 text-primary text-sm leading-snug line-clamp-2 group-hover:text-secondary transition-colors">
                        {post.title}
                      </h3>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────── */}
      <section className="section-padding bg-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-80 h-80 bg-secondary rounded-full blur-3xl -mr-40 -mt-40" />
        </div>
        <div className="container-custom relative text-center">
          <h2 className="font-display font-800 text-3xl sm:text-4xl text-white mb-4">
            Planning a Trip You Read About?
          </h2>
          <p className="text-white/60 font-body max-w-xl mx-auto mb-8">
            The team behind these guides books the trips too — flights, hotels, visas and full
            packages, with a custom quote in 24 hours.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setInquiryOpen(true)}
              className="flex items-center gap-2 px-8 py-4 bg-gradient-gold text-primary font-display font-700 rounded-full shadow-gold hover:opacity-90 hover:scale-105 transition-all duration-200"
            >
              <MessageCircle className="w-5 h-5" /> Get a Free Quote
            </button>
            <a
              href={`tel:${CONTACT.phoneE164}`}
              className="flex items-center gap-2 px-8 py-4 border-2 border-secondary/60 text-secondary font-display font-700 rounded-full hover:bg-secondary/10 transition-all duration-200"
            >
              <Phone className="w-4 h-4" /> {CONTACT.phoneDisplay}
            </a>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
      <InquiryModal isOpen={inquiryOpen} onClose={() => setInquiryOpen(false)} />
    </div>
  );
}
