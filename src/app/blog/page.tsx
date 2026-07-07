import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Clock, ArrowRight } from "lucide-react";
import SiteShell from "@/components/SiteShell";
import { getPosts, getFeaturedImageUrl } from "@/lib/wordpress";
import { stripWpHtml, estimateReadTime } from "@/lib/sanitize";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Travel Blog | Flywings Tour and Travel",
  description:
    "Travel tips, destination guides, and inspiration from the Flywings Tour and Travel team to help you plan your perfect trip.",
};

const FALLBACK_IMAGE = "/assets/hero-bg.jpg";

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <SiteShell>
      {/* ── HERO ───────────────────────────────────────────────── */}
      <section className="relative bg-gradient-navy pt-36 pb-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-secondary rounded-full blur-3xl -mr-48 -mt-48" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-secondary rounded-full blur-3xl -ml-36 -mb-36" />
        </div>
        <div className="container-custom relative text-center">
          <nav className="flex items-center justify-center gap-2 text-white/50 font-body text-xs mb-6">
            <Link href="/" className="hover:text-secondary transition-colors">Home</Link>
            <span>/</span>
            <span className="text-secondary">Blog</span>
          </nav>
          <div className="inline-flex items-center gap-2 bg-secondary/20 border border-secondary/30 rounded-full px-4 py-1.5 mb-4">
            <MapPin className="w-3.5 h-3.5 text-secondary" />
            <span className="text-secondary text-xs font-body font-semibold tracking-widest uppercase">Travel Stories</span>
          </div>
          <h1 className="font-display font-900 text-4xl sm:text-5xl text-white mb-4 leading-tight">
            Latest Travel Insights
          </h1>
          <p className="text-white/65 font-body text-lg max-w-xl mx-auto leading-relaxed">
            Tips, guides and inspiration from our travel experts to help you plan your perfect trip.
          </p>
        </div>
      </section>

      {/* ── POSTS GRID ─────────────────────────────────────────── */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          {!posts || posts.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">📝</div>
              <h3 className="font-display font-700 text-primary text-xl mb-2">No articles yet</h3>
              <p className="text-muted-foreground font-body text-sm">We're working on our first stories — check back soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => {
                const title = stripWpHtml(post.title.rendered);
                const excerpt = stripWpHtml(post.excerpt.rendered);
                const image = getFeaturedImageUrl(post) ?? FALLBACK_IMAGE;
                const category = post._embedded?.["wp:term"]?.[0]?.[0]?.name;
                const date = new Date(post.date).toLocaleDateString("en-IN", {
                  year: "numeric", month: "short", day: "numeric",
                });

                return (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group bg-white rounded-2xl overflow-hidden border border-border shadow-card hover:shadow-navy transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                      {category && (
                        <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-body font-semibold bg-secondary/90 text-primary">
                          {category}
                        </span>
                      )}
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 text-muted-foreground font-body text-xs mb-3">
                        <Clock className="w-3.5 h-3.5" />
                        {estimateReadTime(post.content.rendered)}
                        <span className="text-border">•</span>
                        {date}
                      </div>
                      <h3 className="font-display font-700 text-lg text-navy mb-2 leading-snug group-hover:text-gold transition-colors line-clamp-2">
                        {title}
                      </h3>
                      <p className="text-muted-foreground font-body text-sm leading-relaxed mb-4 line-clamp-2">
                        {excerpt}
                      </p>
                      <span className="inline-flex items-center gap-1.5 text-gold font-body font-semibold text-sm group-hover:gap-2.5 transition-all">
                        Read More <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </SiteShell>
  );
}
