"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { Clock, ArrowRight, Search, Filter, MessageCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import InquiryModal from "@/components/InquiryModal";
import { getCategoryColor } from "@/lib/sanitize";

export interface BlogPostSummary {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  category?: string;
  readTime: string;
  date: string;
}

function PostCard({ post, index, isInView }: { post: BlogPostSummary; index: number; isInView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: Math.min(index * 0.07, 0.4) }}
    >
      <Link
        href={`/blog/${post.slug}`}
        className="group block bg-card rounded-2xl overflow-hidden border border-border shadow-card hover:shadow-navy transition-all duration-300 hover:-translate-y-1"
      >
        <div className="relative h-52 overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent" />
          {post.category && (
            <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-body font-semibold ${getCategoryColor(post.category)}`}>
              {post.category}
            </span>
          )}
        </div>
        <div className="p-5">
          <div className="flex items-center gap-2 text-muted-foreground font-body text-xs mb-3">
            <Clock className="w-3.5 h-3.5" />
            {post.readTime}
            <span className="text-border">•</span>
            {post.date}
          </div>
          <h3 className="font-display font-700 text-primary text-lg mb-2 leading-snug group-hover:text-secondary transition-colors line-clamp-2">
            {post.title}
          </h3>
          <p className="text-muted-foreground font-body text-sm leading-relaxed mb-4 line-clamp-2">
            {post.excerpt}
          </p>
          <span className="inline-flex items-center gap-1.5 text-secondary font-body font-semibold text-sm group-hover:gap-2.5 transition-all">
            Read More <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

export default function BlogListClient({ posts }: { posts: BlogPostSummary[] }) {
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  const categories = useMemo(() => {
    const unique = Array.from(new Set(posts.map((p) => p.category).filter(Boolean))) as string[];
    return ["All", ...unique];
  }, [posts]);

  const filtered = posts.filter((post) => {
    const matchSearch =
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchCategory = activeCategory === "All" || post.category === activeCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="min-h-screen bg-background font-body">
      <Navbar onInquiryOpen={() => setInquiryOpen(true)} />

      {/* ── HERO ───────────────────────────────────────────────── */}
      <section className="relative bg-gradient-navy pt-36 pb-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-secondary rounded-full blur-3xl -mr-48 -mt-48" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-secondary rounded-full blur-3xl -ml-36 -mb-36" />
        </div>
        <div className="container-custom relative text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <nav className="flex items-center justify-center gap-2 text-white/50 font-body text-xs mb-6">
              <Link href="/" className="hover:text-secondary transition-colors">Home</Link>
              <span>/</span>
              <span className="text-secondary">Blog</span>
            </nav>
            <div className="inline-flex items-center gap-2 bg-secondary/20 border border-secondary/30 rounded-full px-4 py-1.5 mb-4">
              <span className="text-secondary text-xs font-body font-semibold tracking-widest uppercase">Travel Stories</span>
            </div>
            <h1 className="font-display font-900 text-4xl sm:text-5xl text-white mb-4 leading-tight">
              Latest Travel Insights
            </h1>
            <p className="text-white/65 font-body text-lg max-w-xl mx-auto mb-8 leading-relaxed">
              Tips, guides and inspiration from our travel experts to help you plan your perfect trip.
            </p>
            {posts.length > 0 && (
              <div className="max-w-md mx-auto relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-full bg-white text-primary font-body text-sm outline-none focus:ring-2 focus:ring-secondary/50 shadow-lg"
                />
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* ── CATEGORY FILTERS ───────────────────────────────────── */}
      {categories.length > 1 && (
        <section className="bg-card border-b border-border sticky top-20 z-30">
          <div className="container-custom py-3">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
              <Filter className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setActiveCategory(c)}
                  className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-body font-semibold transition-all ${
                    activeCategory === c
                      ? "bg-primary text-secondary shadow-navy"
                      : "bg-muted text-muted-foreground hover:bg-muted/70"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── POSTS GRID ─────────────────────────────────────────── */}
      <section className="section-padding bg-background">
        <div className="container-custom" ref={ref}>
          {posts.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">📝</div>
              <h3 className="font-display font-700 text-primary text-xl mb-2">No articles yet</h3>
              <p className="text-muted-foreground font-body text-sm">We're working on our first stories — check back soon.</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="font-display font-700 text-primary text-xl mb-2">No articles found</h3>
              <p className="text-muted-foreground font-body text-sm mb-6">Try a different search term or category.</p>
              <button
                onClick={() => { setSearch(""); setActiveCategory("All"); }}
                className="px-6 py-3 bg-gradient-gold text-primary font-display font-700 rounded-full shadow-gold hover:opacity-90 transition-all"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <p className="text-muted-foreground font-body text-sm mb-8">
                Showing <span className="font-semibold text-primary">{filtered.length}</span> article{filtered.length !== 1 ? "s" : ""}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
                {filtered.map((post, i) => (
                  <PostCard key={post.slug} post={post} index={i} isInView={isInView} />
                ))}
              </div>
            </>
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
            Have a Travel Question?
          </h2>
          <p className="text-white/60 font-body max-w-xl mx-auto mb-8">
            Our travel experts are here to help you plan the perfect trip. Get in touch and we'll get back to you shortly.
          </p>
          <button
            onClick={() => setInquiryOpen(true)}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-gold text-primary font-display font-700 rounded-full shadow-gold hover:opacity-90 hover:scale-105 transition-all duration-200"
          >
            <MessageCircle className="w-5 h-5" />
            Enquire Now
          </button>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
      <InquiryModal isOpen={inquiryOpen} onClose={() => setInquiryOpen(false)} />
    </div>
  );
}
