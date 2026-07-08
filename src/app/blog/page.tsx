import type { Metadata } from "next";
import BlogListClient, { type BlogPostSummary } from "@/components/BlogListClient";
import JsonLd from "@/components/JsonLd";
import { getPosts, getFeaturedImageUrl } from "@/lib/wordpress";
import { stripWpHtml, estimateReadTime } from "@/lib/sanitize";
import {
  ORG_ID,
  absoluteUrl,
  breadcrumbJsonLd,
  pageMetadata,
} from "@/lib/seo";

export const revalidate = 300;

export const metadata: Metadata = pageMetadata({
  title: "Travel Blog | Flight Tips & Destination Guides | Flywings",
  titleAbsolute: true,
  description:
    "Expert travel tips from the Flywings team — cheap flight booking hacks, destination guides for Dubai, Thailand, Bali & more, visa advice, and trip planning inspiration for Indian travellers.",
  path: "/blog",
  keywords: [
    "travel blog India",
    "flight booking tips",
    "destination guides",
    "visa advice India",
    "trip planning tips",
  ],
});

const FALLBACK_IMAGE = "/assets/hero-bg.jpg";

export default async function BlogPage() {
  const wpPosts = await getPosts();

  const posts: BlogPostSummary[] = (wpPosts ?? []).map((post) => ({
    slug: post.slug,
    title: stripWpHtml(post.title.rendered),
    excerpt: stripWpHtml(post.excerpt.rendered),
    image: getFeaturedImageUrl(post) ?? FALLBACK_IMAGE,
    category: post._embedded?.["wp:term"]?.[0]?.[0]?.name,
    readTime: estimateReadTime(post.content.rendered),
    date: new Date(post.date).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" }),
  }));

  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Blog",
            "@id": absoluteUrl("/blog#blog"),
            url: absoluteUrl("/blog"),
            name: "Flywings Travel Blog",
            publisher: { "@id": ORG_ID },
            inLanguage: "en-IN",
          },
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
          ]),
        ]}
      />
      <BlogListClient posts={posts} />
    </>
  );
}
