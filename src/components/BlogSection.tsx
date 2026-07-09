"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";

/** Real posts from WordPress, mapped server-side in app/page.tsx. */
export interface HomeBlogPost {
  category: string;
  categoryColor: string;
  image: string;
  readTime: string;
  date: string;
  title: string;
  excerpt: string;
  link: string;
}

export default function BlogSection({ posts }: { posts: HomeBlogPost[] }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  if (posts.length === 0) return null;

  return (
    <section id="blog" className="section-padding bg-muted/30">
      <div className="container-custom" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap items-end justify-between gap-4 mb-14"
        >
          <div>
            <span className="inline-block px-4 py-1 bg-gold/10 border border-gold/30 text-gold text-xs font-body font-medium tracking-widest uppercase rounded-full mb-4">
              Travel Stories
            </span>
            <h2 className="font-display font-800 text-3xl sm:text-4xl text-navy mb-4">
              Latest Travel Insights
            </h2>
            <p className="text-muted-foreground font-body max-w-xl leading-relaxed">
              Tips, guides and inspiration from our travel experts to help you plan your perfect trip.
            </p>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-navy font-body font-semibold text-sm hover:gap-3 hover:text-gold transition-all shrink-0"
          >
            View All Articles <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <motion.div
              key={post.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
            <Link
              href={post.link}
              className="group block bg-white rounded-2xl overflow-hidden border border-border shadow-card hover:shadow-navy transition-all duration-300 hover:-translate-y-1"
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-body font-semibold ${post.categoryColor}`}>
                  {post.category}
                </span>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-center gap-2 text-muted-foreground font-body text-xs mb-3">
                  <Clock className="w-3.5 h-3.5" />
                  {post.readTime}
                  <span className="text-border">•</span>
                  {post.date}
                </div>
                <h3 className="font-display font-700 text-lg text-navy mb-2 leading-snug group-hover:text-gold transition-colors">
                  {post.title}
                </h3>
                <p className="text-muted-foreground font-body text-sm leading-relaxed mb-4 line-clamp-2">
                  {post.excerpt}
                </p>
                <span className="inline-flex items-center gap-1.5 text-gold font-body font-semibold text-sm group-hover:gap-2.5 transition-all">
                  Read More <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
