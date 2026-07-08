import { getPosts, getFeaturedImageUrl } from "@/lib/wordpress";
import { stripWpHtml } from "@/lib/sanitize";
import { SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/seo";

export const revalidate = 3600;

function xmlEscape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** RSS 2.0 feed of blog posts — fails soft to an empty channel if WP is unreachable. */
export async function GET() {
  const posts = (await getPosts()) ?? [];

  const items = posts
    .map((post) => {
      const title = xmlEscape(stripWpHtml(post.title.rendered));
      const description = xmlEscape(
        stripWpHtml(post.excerpt.rendered).slice(0, 300)
      );
      const url = absoluteUrl(`/blog/${post.slug}`);
      const image = getFeaturedImageUrl(post);
      return `    <item>
      <title>${title}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${description}</description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>${
        image ? `\n      <enclosure url="${xmlEscape(image)}" type="image/jpeg" length="0"/>` : ""
      }
    </item>`;
    })
    .join("\n");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${xmlEscape(SITE_NAME)} — Travel Blog</title>
    <link>${SITE_URL}/blog</link>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    <description>Flight booking tips, destination guides, visa advice and tour package updates from ${xmlEscape(SITE_NAME)}.</description>
    <language>en-IN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
