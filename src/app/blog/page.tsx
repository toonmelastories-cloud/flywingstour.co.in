import type { Metadata } from "next";
import BlogListClient, { type BlogPostSummary } from "@/components/BlogListClient";
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

  return <BlogListClient posts={posts} />;
}
