import type { MetadataRoute } from "next";
import destinations from "@/data/destinations";
import servicePages from "@/data/servicePages";
import { getAllTours } from "@/lib/tours";
import { getPosts } from "@/lib/wordpress";
import { absoluteUrl } from "@/lib/seo";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: absoluteUrl("/packages"), lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl("/international-tour-packages-from-chandigarh"), lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/destinations"), lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/services"), lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/blog"), lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: absoluteUrl("/author/sukhjinder-kaur"), lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: absoluteUrl("/about"), lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/contact"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/privacy-policy"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/terms-and-conditions"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/cancellation-refund-policy"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const servicePageRoutes: MetadataRoute.Sitemap = servicePages.map((s) => ({
    url: absoluteUrl(`/services/${s.slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
    images: [absoluteUrl(s.heroImage)],
  }));

  const destinationRoutes: MetadataRoute.Sitemap = destinations.map((d) => ({
    url: absoluteUrl(`/destinations/${d.slug}`),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.9,
    images: [absoluteUrl(d.heroImage)],
  }));

  // Tour packages (WordPress + local fallback) and blog posts fail soft:
  // if WP is unreachable the sitemap still ships with everything else.
  const [tours, posts] = await Promise.all([getAllTours(), getPosts()]);

  const packageRoutes: MetadataRoute.Sitemap = tours.map((pkg) => ({
    url: absoluteUrl(`/packages/${pkg.slug}`),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.9,
    images: pkg.heroImages.slice(0, 1).map((img) => absoluteUrl(img)),
  }));

  const blogRoutes: MetadataRoute.Sitemap = (posts ?? []).map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: post.modified ? new Date(post.modified) : new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...servicePageRoutes, ...destinationRoutes, ...packageRoutes, ...blogRoutes];
}
