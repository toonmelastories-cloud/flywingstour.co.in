"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, Clock, MessageCircle, Phone } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import InquiryModal from "@/components/InquiryModal";
import type { BlogPostSummary } from "@/components/BlogListClient";

export interface BlogPostDetail {
  title: string;
  category?: string;
  image: string;
  readTime: string;
  date: string;
}

function RelatedCard({ post, index }: { post: BlogPostSummary; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
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
          <div className="absolute inset-0 bg-gradient-card" />
          {post.category && (
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-body font-semibold bg-secondary text-primary">
              {post.category}
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-center gap-1.5 text-muted-foreground font-body text-xs mb-1">
            <Clock className="w-3 h-3" /> {post.readTime}
          </div>
          <h3 className="font-display font-700 text-primary text-sm leading-snug line-clamp-2 group-hover:text-secondary transition-colors">
            {post.title}
          </h3>
        </div>
      </Link>
    </motion.div>
  );
}

export default function BlogPostClient({
  post,
  contentHtml,
  related,
}: {
  post: BlogPostDetail;
  contentHtml: string;
  related: BlogPostSummary[];
}) {
  const [inquiryOpen, setInquiryOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background font-body">
      <Navbar onInquiryOpen={() => setInquiryOpen(true)} />

      {/* ── HERO ───────────────────────────────────────────────── */}
      <section className="relative h-[55vh] min-h-[420px] flex items-end pb-14 overflow-hidden">
        <img src={post.image} alt={post.title} className="absolute inset-0 w-full h-full object-cover" loading="eager" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/50 to-primary/70" />
        <div className="relative container-custom w-full">
          <motion.nav
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2 text-sm font-body text-white/70 mb-5"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="hover:text-secondary transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/blog" className="hover:text-secondary transition-colors">Blog</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-secondary font-medium line-clamp-1">{post.title}</span>
          </motion.nav>

          {post.category && (
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-block px-3 py-1 rounded-full text-xs font-body font-semibold mb-4 bg-secondary text-primary"
            >
              {post.category}
            </motion.span>
          )}

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-display font-900 text-3xl sm:text-4xl lg:text-5xl text-white max-w-3xl leading-tight mb-4"
          >
            {post.title}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex items-center gap-2 text-white/70 font-body text-sm"
          >
            <Clock className="w-4 h-4" />
            {post.readTime}
            <span className="text-white/30">•</span>
            {post.date}
          </motion.div>
        </div>
      </section>

      {/* ── CONTENT ────────────────────────────────────────────── */}
      <section className="section-padding bg-background">
        <div className="container-custom max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="prose prose-neutral max-w-none font-body text-foreground prose-headings:font-display prose-headings:text-primary prose-a:text-secondary"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
        </div>
      </section>

      {/* ── RELATED ARTICLES ──────────────────────────────────── */}
      {related.length > 0 && (
        <section className="section-padding bg-muted/30">
          <div className="container-custom">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-secondary/10 border border-secondary/30 rounded-full px-4 py-1.5 mb-4">
                <span className="text-secondary text-xs font-body font-semibold tracking-widest uppercase">You May Also Like</span>
              </div>
              <h2 className="font-display font-800 text-3xl sm:text-4xl text-primary mb-4 leading-tight">More Travel Stories</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {related.map((r, i) => (
                <RelatedCard key={r.slug} post={r} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FINAL CTA ──────────────────────────────────────────── */}
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
            <h2 className="font-display font-900 text-3xl sm:text-4xl text-white mb-4 leading-tight">
              Ready to Plan Your Next Trip?
            </h2>
            <p className="text-white/60 font-body text-lg max-w-xl mx-auto mb-10">
              Talk to our expert travel consultants and get a personalized itinerary crafted just for you.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => setInquiryOpen(true)}
                className="flex items-center gap-2 px-8 py-4 bg-gradient-gold text-primary font-display font-700 rounded-full shadow-gold hover:opacity-90 hover:scale-105 transition-all duration-200"
              >
                <MessageCircle className="w-5 h-5" />
                Enquire Now
              </button>
              <a
                href="tel:+919914310333"
                className="flex items-center gap-2 px-8 py-4 border-2 border-white/30 text-white font-display font-600 rounded-full hover:bg-white/10 transition-all duration-200"
              >
                <Phone className="w-5 h-5" />
                Call +91 99143 10333
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
      <InquiryModal isOpen={inquiryOpen} onClose={() => setInquiryOpen(false)} />
    </div>
  );
}
