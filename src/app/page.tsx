import type { Metadata } from "next";
import HomeClient from "@/components/HomeClient";
import JsonLd from "@/components/JsonLd";
import type { HomeBlogPost } from "@/components/BlogSection";
import { getPosts, getFeaturedImageUrl } from "@/lib/wordpress";
import { stripWpHtml, estimateReadTime, getCategoryColor } from "@/lib/sanitize";
import { ALL_KEYWORDS, pageMetadata } from "@/lib/seo";

export const revalidate = 300;

// This overrides the `title.default` in the root layout, so the local
// keywords have to be repeated here or the homepage keeps the old
// brand-only title. "travel agency in chandigarh" (3.6k searches,
// difficulty 29) and "travel agent mohali" (390, difficulty 12) are the
// two terms this site can realistically win; the previous title carried
// neither.
export const metadata: Metadata = pageMetadata({
  title: "Travel Agency in Chandigarh & Mohali | Flywings Tour & Packages",
  description:
    "Travel agency in Chandigarh and Mohali since 2005. Tour packages, flight booking, tourist visa help and hotels. Free quote in 24 hours.",
  path: "/",
  keywords: ALL_KEYWORDS,
  titleAbsolute: true,
});

const homeFaqs = [
  {
    question: "Does Flywings book both domestic and international flight tickets?",
    answer:
      "Yes. Flywings Tour & Packages Pvt Ltd books domestic flights across India (Delhi, Mumbai, Bengaluru, Chandigarh and more) and international air tickets worldwide, always at the lowest available fares with free rebooking guidance.",
  },
  {
    question: "Which tour packages does Flywings offer?",
    answer:
      "We offer curated international tour packages to Dubai, Thailand, Bali, Maldives and Singapore, plus domestic packages such as Kashmir. Every package can be customised and includes flights, hotels, transfers and sightseeing.",
  },
  {
    question: "How do I get a quote for flights or a holiday package?",
    answer:
      "Call us at +91 99143 10333, message us on WhatsApp, or submit the inquiry form on the website. Our travel experts respond within 2–4 business hours with a personalised quote.",
  },
  {
    question: "Does Flywings help with visas?",
    answer:
      "Yes, we provide end-to-end visa assistance for 50+ countries — documentation guidance, application filing and tracking — alongside your flight and hotel bookings.",
  },
];

export default async function Home() {
  // Latest 3 posts for the "Latest Travel Insights" section; the
  // section hides itself if WordPress is unreachable.
  const posts = await getPosts();
  const latestPosts: HomeBlogPost[] = (posts ?? []).slice(0, 3).map((post) => {
    const category = post._embedded?.["wp:term"]?.[0]?.[0]?.name ?? "Travel Guide";
    return {
      category,
      categoryColor: getCategoryColor(category),
      image: getFeaturedImageUrl(post) ?? "/assets/hero-bg.jpg",
      readTime: estimateReadTime(post.content.rendered),
      date: new Date(post.date).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      title: stripWpHtml(post.title.rendered),
      excerpt: stripWpHtml(post.excerpt.rendered),
      link: `/blog/${post.slug}`,
    };
  });

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: homeFaqs.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        }}
      />
      <HomeClient latestPosts={latestPosts} />
    </>
  );
}
