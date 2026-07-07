import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Clock } from "lucide-react";
import SiteShell from "@/components/SiteShell";
import { getPosts, getPostBySlug, getFeaturedImageUrl, getYoastMeta } from "@/lib/wordpress";
import { sanitizeWpHtml, stripWpHtml, estimateReadTime } from "@/lib/sanitize";

export const revalidate = 300;
export const dynamicParams = true;

const FALLBACK_IMAGE = "/assets/hero-bg.jpg";

export async function generateStaticParams() {
  const posts = await getPosts();
  return (posts ?? []).map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  const yoast = getYoastMeta(post);
  const title = yoast.title || `${stripWpHtml(post.title.rendered)} | Flywings Blog`;
  const description = yoast.description || stripWpHtml(post.excerpt.rendered).slice(0, 160);

  return {
    title,
    description,
    openGraph: { title, description, type: "article" },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return (
      <SiteShell>
        <div className="flex flex-col items-center justify-center text-center px-4 py-32">
          <div className="text-6xl mb-4">📝</div>
          <h1 className="font-display font-800 text-3xl text-primary mb-3">Article Not Found</h1>
          <p className="text-muted-foreground font-body mb-6">We couldn't find this article. Explore more travel stories below.</p>
          <Link
            href="/blog"
            className="px-6 py-3 bg-gradient-gold text-primary font-display font-700 rounded-full shadow-gold hover:opacity-90 transition-all"
          >
            Back to Blog
          </Link>
        </div>
      </SiteShell>
    );
  }

  const title = stripWpHtml(post.title.rendered);
  const image = getFeaturedImageUrl(post) ?? FALLBACK_IMAGE;
  const category = post._embedded?.["wp:term"]?.[0]?.[0]?.name;
  const date = new Date(post.date).toLocaleDateString("en-IN", {
    year: "numeric", month: "long", day: "numeric",
  });

  return (
    <SiteShell>
      {/* ── HERO ───────────────────────────────────────────────── */}
      <section className="relative h-[50vh] min-h-[380px] flex items-end pb-14 overflow-hidden">
        <img src={image} alt={title} className="absolute inset-0 w-full h-full object-cover" loading="eager" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/50 to-primary/85" />
        <div className="relative container-custom w-full">
          <nav className="flex items-center gap-2 text-sm font-body text-white/70 mb-5" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-secondary transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/blog" className="hover:text-secondary transition-colors">Blog</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-secondary font-medium line-clamp-1">{title}</span>
          </nav>
          {category && (
            <span className="inline-block px-3 py-1 rounded-full text-xs font-body font-semibold bg-secondary text-primary mb-4">
              {category}
            </span>
          )}
          <h1 className="font-display font-900 text-3xl sm:text-4xl lg:text-5xl text-white max-w-3xl leading-tight mb-4">
            {title}
          </h1>
          <div className="flex items-center gap-2 text-white/70 font-body text-sm">
            <Clock className="w-4 h-4" />
            {estimateReadTime(post.content.rendered)}
            <span className="text-white/30">•</span>
            {date}
          </div>
        </div>
      </section>

      {/* ── CONTENT ────────────────────────────────────────────── */}
      <section className="section-padding bg-background">
        <div className="container-custom max-w-3xl mx-auto">
          <div
            className="prose prose-neutral max-w-none font-body text-foreground prose-headings:font-display prose-headings:text-primary prose-a:text-secondary"
            dangerouslySetInnerHTML={{ __html: sanitizeWpHtml(post.content.rendered) }}
          />
        </div>
      </section>
    </SiteShell>
  );
}
