import type { Metadata } from "next";
import AuthorClient from "@/components/AuthorClient";
import JsonLd from "@/components/JsonLd";
import type { BlogPostSummary } from "@/components/BlogListClient";
import { getPosts, getFeaturedImageUrl } from "@/lib/wordpress";
import { stripWpHtml, estimateReadTime } from "@/lib/sanitize";
import { AUTHOR, AUTHOR_PATH } from "@/data/author";
import {
  ORG_ID,
  SITE_URL,
  absoluteUrl,
  breadcrumbJsonLd,
  pageMetadata,
} from "@/lib/seo";

export const revalidate = 300;

const FALLBACK_IMAGE = "/assets/hero-bg.jpg";

export const metadata: Metadata = pageMetadata({
  title: `${AUTHOR.name} — ${AUTHOR.role} | Flywings`,
  titleAbsolute: true,
  description: AUTHOR.shortBio,
  path: AUTHOR_PATH,
  keywords: [
    "Sukhjinder Kaur travel writer",
    "travel content writer tourism industry",
    "travel blog author Chandigarh",
    "Flywings travel guides author",
  ],
});

export default async function AuthorPage() {
  const posts = await getPosts();
  const summaries: BlogPostSummary[] = (posts ?? []).map((post) => ({
    slug: post.slug,
    title: stripWpHtml(post.title.rendered),
    excerpt: stripWpHtml(post.excerpt.rendered),
    image: getFeaturedImageUrl(post) ?? FALLBACK_IMAGE,
    category: post._embedded?.["wp:term"]?.[0]?.[0]?.name,
    readTime: estimateReadTime(post.content.rendered),
    date: new Date(post.date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
  }));

  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Person",
            "@id": `${SITE_URL}${AUTHOR_PATH}#person`,
            name: AUTHOR.name,
            url: absoluteUrl(AUTHOR_PATH),
            jobTitle: AUTHOR.role,
            description: AUTHOR.shortBio,
            knowsAbout: [...AUTHOR.expertise],
            worksFor: { "@id": ORG_ID },
            workLocation: {
              "@type": "Place",
              address: { "@type": "PostalAddress", addressLocality: "Mohali", addressRegion: "Punjab", addressCountry: "IN" },
            },
          },
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: AUTHOR.name, path: AUTHOR_PATH },
          ]),
        ]}
      />
      <AuthorClient posts={summaries} />
    </>
  );
}
