import type { Metadata } from "next";
import BlogPostClient from "@/components/BlogPostClient";
import BlogPostNotFound from "@/components/BlogPostNotFound";
import JsonLd from "@/components/JsonLd";
import type { BlogPostSummary } from "@/components/BlogListClient";
import { getPosts, getPostBySlug, getFeaturedImageUrl, getYoastMeta } from "@/lib/wordpress";
import { sanitizeWpHtml, stripWpHtml, estimateReadTime } from "@/lib/sanitize";
import { blogPostingJsonLd, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

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
  if (!post) return { title: "Post Not Found" };

  const yoast = getYoastMeta(post);
  const title = yoast.title || stripWpHtml(post.title.rendered);
  const description = yoast.description || stripWpHtml(post.excerpt.rendered).slice(0, 160);
  const image = yoast.ogImage || getFeaturedImageUrl(post) || FALLBACK_IMAGE;

  return pageMetadata({
    title,
    // Yoast titles already include the site name; plain WP titles don't.
    titleAbsolute: Boolean(yoast.title),
    description,
    path: `/blog/${post.slug}`,
    image,
    ogType: "article",
    publishedTime: post.date,
    modifiedTime: post.modified,
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return <BlogPostNotFound />;
  }

  const allPosts = await getPosts();
  const related: BlogPostSummary[] = (allPosts ?? [])
    .filter((p) => p.slug !== slug)
    .slice(0, 3)
    .map((p) => ({
      slug: p.slug,
      title: stripWpHtml(p.title.rendered),
      excerpt: stripWpHtml(p.excerpt.rendered),
      image: getFeaturedImageUrl(p) ?? FALLBACK_IMAGE,
      category: p._embedded?.["wp:term"]?.[0]?.[0]?.name,
      readTime: estimateReadTime(p.content.rendered),
      date: new Date(p.date).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" }),
    }));

  const title = stripWpHtml(post.title.rendered);
  const image = getFeaturedImageUrl(post) ?? FALLBACK_IMAGE;

  return (
    <>
      <JsonLd
        data={[
          blogPostingJsonLd({
            slug: post.slug,
            title,
            description: stripWpHtml(post.excerpt.rendered).slice(0, 160),
            image,
            datePublished: post.date,
            dateModified: post.modified,
          }),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: title, path: `/blog/${post.slug}` },
          ]),
        ]}
      />
      <BlogPostClient
        post={{
          title,
          category: post._embedded?.["wp:term"]?.[0]?.[0]?.name,
          image,
          readTime: estimateReadTime(post.content.rendered),
          date: new Date(post.date).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" }),
        }}
        contentHtml={sanitizeWpHtml(post.content.rendered)}
        related={related}
      />
    </>
  );
}
