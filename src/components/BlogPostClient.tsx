"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, useScroll } from "framer-motion";
import {
  ChevronRight, Clock, MessageCircle, Phone, Headphones,
  ShieldCheck, BadgeCheck, List, Share2, Copy, Check, Stamp, ArrowRight,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import InquiryModal from "@/components/InquiryModal";
import type { BlogPostSummary } from "@/components/BlogListClient";
import { AUTHOR, AUTHOR_PATH } from "@/data/author";
import { CONTACT } from "@/lib/seo";

export interface BlogPostDetail {
  title: string;
  category?: string;
  image: string;
  readTime: string;
  date: string;
}

interface TocItem {
  id: string;
  text: string;
}

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/&[a-z0-9#]+;/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

/**
 * Adds ids to the (already sanitized) WP HTML's h2 headings so the
 * table of contents can anchor-link to them, and returns the heading
 * list. Also splits the article roughly in half at an h2 boundary so a
 * conversion CTA can sit mid-read without breaking a section.
 */
function useArticle(contentHtml: string) {
  return useMemo(() => {
    const toc: TocItem[] = [];
    const withIds = contentHtml.replace(
      /<h2([^>]*)>([\s\S]*?)<\/h2>/g,
      (_, attrs: string, inner: string) => {
        const text = inner.replace(/<[^>]*>/g, "").trim();
        const id = slugify(text) || `section-${toc.length + 1}`;
        toc.push({ id, text });
        return `<h2${attrs} id="${id}">${inner}</h2>`;
      }
    );

    // Split before the middle h2 (skip if the article has < 4 sections).
    let firstHalf = withIds;
    let secondHalf = "";
    if (toc.length >= 4) {
      const midId = toc[Math.floor(toc.length / 2)].id;
      const splitAt = withIds.indexOf(`<h2 id="${midId}"`);
      if (splitAt === -1) {
        const generic = withIds.indexOf(`id="${midId}"`);
        if (generic !== -1) {
          const open = withIds.lastIndexOf("<h2", generic);
          if (open !== -1) {
            firstHalf = withIds.slice(0, open);
            secondHalf = withIds.slice(open);
          }
        }
      } else {
        firstHalf = withIds.slice(0, splitAt);
        secondHalf = withIds.slice(splitAt);
      }
    }
    return { toc, firstHalf, secondHalf };
  }, [contentHtml]);
}

const PROSE_CLASSES =
  "prose prose-neutral max-w-none font-body text-foreground prose-headings:font-display prose-headings:text-primary prose-headings:scroll-mt-28 prose-a:text-secondary prose-img:rounded-2xl prose-img:shadow-card prose-table:text-sm";

function TableOfContents({ toc, activeId }: { toc: TocItem[]; activeId: string }) {
  if (toc.length < 2) return null;
  return (
    <nav
      aria-label="Table of contents"
      className="bg-card rounded-2xl border border-border shadow-card p-5"
    >
      <div className="flex items-center gap-2 mb-3">
        <List className="w-4 h-4 text-secondary" />
        <span className="font-display font-700 text-primary text-sm">In This Guide</span>
      </div>
      <ol className="space-y-1">
        {toc.map((item, i) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={`flex gap-2 py-1.5 text-[13px] font-body leading-snug transition-colors border-l-2 pl-3 ${
                activeId === item.id
                  ? "border-secondary text-primary font-semibold"
                  : "border-border text-muted-foreground hover:text-primary"
              }`}
            >
              <span className="text-secondary/70 font-display font-600">{i + 1}.</span>
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function SidebarCtaCard({ onInquiryOpen }: { onInquiryOpen: () => void }) {
  return (
    <div className="relative bg-gradient-navy rounded-2xl overflow-hidden shadow-navy p-6">
      <div className="absolute top-0 right-0 w-40 h-40 bg-secondary rounded-full blur-3xl opacity-15 -mr-16 -mt-16" />
      <div className="relative">
        <span className="inline-block bg-secondary/20 border border-secondary/30 text-secondary text-[11px] font-body font-semibold tracking-widest uppercase rounded-full px-3 py-1 mb-4">
          Plan This Trip
        </span>
        <h3 className="font-display font-800 text-white text-lg leading-snug mb-2">
          Get a Free Custom Quote in 24 Hours
        </h3>
        <p className="text-white/60 font-body text-xs leading-relaxed mb-5">
          Flights, hotels, visa &amp; sightseeing — one itemised quote, no hidden charges.
        </p>
        <button
          onClick={onInquiryOpen}
          className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-gradient-gold text-primary font-display font-700 text-sm rounded-xl shadow-gold hover:opacity-90 transition-all mb-3"
        >
          <MessageCircle className="w-4 h-4" /> Enquire Now
        </button>
        <a
          href={`tel:${CONTACT.phoneE164}`}
          className="w-full flex items-center justify-center gap-2 px-5 py-3 border border-white/25 text-white font-display font-600 text-sm rounded-xl hover:bg-white/10 transition-all mb-5"
        >
          <Phone className="w-4 h-4" /> {CONTACT.phoneDisplay}
        </a>
        <ul className="space-y-2">
          {[
            { icon: BadgeCheck, text: "Trusted travel agency since 2005" },
            { icon: Stamp, text: "Complete visa assistance included" },
            { icon: Headphones, text: "24/7 human support while you travel" },
            { icon: ShieldCheck, text: "Office in Phase 7, Mohali — walk in anytime" },
          ].map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-start gap-2 text-white/70 font-body text-xs">
              <Icon className="w-3.5 h-3.5 text-secondary flex-shrink-0 mt-0.5" /> {text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ShareRow({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  const share = (network: "whatsapp" | "facebook" | "x") => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(title);
    const links = {
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      x: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
    };
    window.open(links[network], "_blank", "noopener,width=600,height=500");
  };
  const copy = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const btn =
    "flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-card text-muted-foreground hover:text-primary hover:border-secondary/40 transition-all font-body text-xs";
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="flex items-center gap-1.5 text-muted-foreground font-body text-xs mr-1">
        <Share2 className="w-3.5 h-3.5 text-secondary" /> Share:
      </span>
      <button className={btn} onClick={() => share("whatsapp")}>WhatsApp</button>
      <button className={btn} onClick={() => share("facebook")}>Facebook</button>
      <button className={btn} onClick={() => share("x")}>X</button>
      <button className={btn} onClick={copy}>
        {copied ? <Check className="w-3 h-3 text-secondary" /> : <Copy className="w-3 h-3" />}
        {copied ? "Copied" : "Copy link"}
      </button>
    </div>
  );
}

function MidArticleCta({ onInquiryOpen }: { onInquiryOpen: () => void }) {
  return (
    <aside className="not-prose my-10 relative bg-gradient-gold rounded-2xl shadow-gold overflow-hidden p-6 sm:p-8">
      <div className="absolute top-0 right-0 w-40 h-40 bg-navy rounded-full blur-3xl opacity-10 -mr-16 -mt-16" />
      <div className="relative flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8">
        <div className="flex-1">
          <h3 className="font-display font-800 text-primary text-lg sm:text-xl leading-snug mb-1.5">
            Planning this trip? Talk to a real expert — free.
          </h3>
          <p className="text-primary/70 font-body text-sm leading-relaxed">
            Our Mohali team has booked this exact trip hundreds of times. Get a custom itinerary
            and itemised quote within 24 hours.
          </p>
        </div>
        <div className="flex flex-col gap-2.5 flex-shrink-0">
          <button
            onClick={onInquiryOpen}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-navy text-gold font-display font-700 text-sm rounded-xl hover:bg-navy-dark transition-all"
          >
            <MessageCircle className="w-4 h-4" /> Get Free Quote
          </button>
          <a
            href={`tel:${CONTACT.phoneE164}`}
            className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-navy/30 text-navy font-display font-700 text-sm rounded-xl hover:bg-navy/10 transition-all"
          >
            <Phone className="w-4 h-4" /> {CONTACT.phoneDisplay}
          </a>
        </div>
      </div>
    </aside>
  );
}

function AuthorBox() {
  return (
    <div className="not-prose mt-12 bg-muted/40 border border-border rounded-2xl p-6 flex flex-col sm:flex-row gap-5">
      <Link
        href={AUTHOR_PATH}
        className="w-14 h-14 rounded-full bg-gradient-gold flex items-center justify-center flex-shrink-0 shadow-gold hover:scale-105 transition-transform"
      >
        <span className="font-display font-900 text-primary text-lg">{AUTHOR.initials}</span>
      </Link>
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <Link
            href={AUTHOR_PATH}
            className="font-display font-700 text-primary text-sm hover:text-secondary transition-colors"
          >
            {AUTHOR.name}
          </Link>
          <BadgeCheck className="w-4 h-4 text-secondary" />
          <span className="text-muted-foreground font-body text-xs">{AUTHOR.role}</span>
        </div>
        <p className="text-muted-foreground font-body text-xs leading-relaxed mb-2">
          {AUTHOR.shortBio}
        </p>
        <Link
          href={AUTHOR_PATH}
          className="inline-flex items-center gap-1 text-secondary font-body font-semibold text-xs hover:gap-1.5 transition-all"
        >
          View full profile <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
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
  const [activeId, setActiveId] = useState("");
  const { scrollYProgress } = useScroll();
  const { toc, firstHalf, secondHalf } = useArticle(contentHtml);

  // Highlight the section currently being read: the last heading that
  // has scrolled past the top third of the viewport.
  useEffect(() => {
    if (toc.length < 2) return;
    let ticking = false;
    const update = () => {
      ticking = false;
      const marker = window.innerHeight * 0.35;
      let current = toc[0].id;
      for (const { id } of toc) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= marker) current = id;
      }
      setActiveId(current);
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [toc]);

  return (
    <div className="min-h-screen bg-background font-body pb-16 lg:pb-0">
      {/* Reading progress */}
      <motion.div
        style={{ scaleX: scrollYProgress }}
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-gold origin-left z-[60]"
        aria-hidden
      />

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
            className="flex flex-wrap items-center gap-2 text-white/70 font-body text-sm"
          >
            <Link
              href={AUTHOR_PATH}
              className="flex items-center gap-2 hover:text-secondary transition-colors"
            >
              <span className="w-7 h-7 rounded-full bg-gradient-gold flex items-center justify-center">
                <span className="font-display font-800 text-primary text-[11px]">{AUTHOR.initials}</span>
              </span>
              By {AUTHOR.name}
            </Link>
            <span className="text-white/30">•</span>
            <Clock className="w-4 h-4" />
            {post.readTime}
            <span className="text-white/30">•</span>
            {post.date}
          </motion.div>
        </div>
      </section>

      {/* ── CONTENT + SIDEBAR ─────────────────────────────────── */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-12">
            {/* Article */}
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl"
            >
              <div className="mb-8 pb-6 border-b border-border">
                <ShareRow title={post.title} />
              </div>

              {/* Mobile TOC (sidebar is hidden below lg) */}
              <div className="lg:hidden mb-8">
                <TableOfContents toc={toc} activeId={activeId} />
              </div>

              <div className={PROSE_CLASSES} dangerouslySetInnerHTML={{ __html: firstHalf }} />
              {secondHalf && (
                <>
                  <MidArticleCta onInquiryOpen={() => setInquiryOpen(true)} />
                  <div className={PROSE_CLASSES} dangerouslySetInnerHTML={{ __html: secondHalf }} />
                </>
              )}

              <AuthorBox />

              <div className="mt-8 pt-6 border-t border-border">
                <ShareRow title={post.title} />
              </div>
            </motion.article>

            {/* Sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-28 space-y-6">
                <SidebarCtaCard onInquiryOpen={() => setInquiryOpen(true)} />
                <TableOfContents toc={toc} activeId={activeId} />
                {related.length > 0 && (
                  <div className="bg-card rounded-2xl border border-border shadow-card p-5">
                    <span className="font-display font-700 text-primary text-sm block mb-4">
                      Popular Guides
                    </span>
                    <div className="space-y-4">
                      {related.map((r) => (
                        <Link key={r.slug} href={`/blog/${r.slug}`} className="group flex gap-3">
                          <img
                            src={r.image}
                            alt={r.title}
                            className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                            loading="lazy"
                          />
                          <div>
                            <h4 className="font-body font-semibold text-primary text-[13px] leading-snug line-clamp-2 group-hover:text-secondary transition-colors">
                              {r.title}
                            </h4>
                            <span className="flex items-center gap-1 text-muted-foreground font-body text-[11px] mt-1">
                              <Clock className="w-3 h-3" /> {r.readTime}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </aside>
          </div>
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
              <h2 className="font-display font-800 text-3xl sm:text-4xl text-primary mb-4 leading-tight">More Travel Guides</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {related.map((r, i) => (
                <motion.div
                  key={r.slug}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    href={`/blog/${r.slug}`}
                    className="group block rounded-2xl overflow-hidden border border-border shadow-card hover:-translate-y-1 hover:shadow-navy transition-all duration-300 bg-card"
                  >
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={r.image}
                        alt={r.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-card" />
                      {r.category && (
                        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-body font-semibold bg-secondary text-primary">
                          {r.category}
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-1.5 text-muted-foreground font-body text-xs mb-1">
                        <Clock className="w-3 h-3" /> {r.readTime}
                      </div>
                      <h3 className="font-display font-700 text-primary text-sm leading-snug line-clamp-2 group-hover:text-secondary transition-colors">
                        {r.title}
                      </h3>
                    </div>
                  </Link>
                </motion.div>
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
                href={`tel:${CONTACT.phoneE164}`}
                className="flex items-center gap-2 px-8 py-4 border-2 border-white/30 text-white font-display font-600 rounded-full hover:bg-white/10 transition-all duration-200"
              >
                <Phone className="w-5 h-5" />
                Call {CONTACT.phoneDisplay}
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── MOBILE STICKY CTA BAR ─────────────────────────────── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur border-t border-border shadow-navy px-4 py-2.5 flex gap-2.5 pr-24">
        <a
          href={`tel:${CONTACT.phoneE164}`}
          className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 border border-border text-primary font-display font-700 text-xs rounded-xl"
        >
          <Phone className="w-3.5 h-3.5 text-secondary" /> Call Now
        </a>
        <button
          onClick={() => setInquiryOpen(true)}
          className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-gradient-gold text-primary font-display font-700 text-xs rounded-xl shadow-gold"
        >
          <MessageCircle className="w-3.5 h-3.5" /> Free Quote
        </button>
      </div>

      <Footer />
      <WhatsAppButton />
      <InquiryModal isOpen={inquiryOpen} onClose={() => setInquiryOpen(false)} />
    </div>
  );
}
