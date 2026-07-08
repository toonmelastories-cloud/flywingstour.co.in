import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

/**
 * Open crawl policy: every page is public marketing content, so all
 * search engines (Google, Bing, Yahoo/Slurp, DuckDuckGo, Yandex,
 * Baidu, Naver, Seznam…) crawl under the wildcard rule.
 *
 * AI/answer-engine crawlers (GPTBot, ClaudeBot, PerplexityBot,
 * Google-Extended, etc.) are deliberately allowed too — being citable
 * in AI answers is the AEO half of the strategy.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // _next assets are fetchable but pointless to crawl as pages
        disallow: ["/_next/"],
      },
      // Explicit allows for answer-engine crawlers so a future stricter
      // wildcard rule can't silently lock them out.
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "OAI-SearchBot", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "Claude-Web", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "Applebot-Extended", allow: "/" },
      { userAgent: "Bytespider", allow: "/" },
      { userAgent: "cohere-ai", allow: "/" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
