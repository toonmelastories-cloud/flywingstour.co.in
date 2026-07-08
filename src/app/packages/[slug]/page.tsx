import type { Metadata } from "next";
import PackageDetailClient from "@/components/PackageDetailClient";
import PackageNotFound from "@/components/PackageNotFound";
import JsonLd from "@/components/JsonLd";
import { getAllTourSlugs, getRelatedTours, getTourData } from "@/lib/tours";
import {
  breadcrumbJsonLd,
  faqJsonLd,
  pageMetadata,
  touristTripJsonLd,
} from "@/lib/seo";

export const revalidate = 300;
export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await getAllTourSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pkg = await getTourData(slug);
  if (!pkg) return { title: "Package Not Found" };

  return pageMetadata({
    title: pkg.metaTitle,
    titleAbsolute: true,
    description: pkg.metaDescription,
    path: `/packages/${pkg.slug}`,
    keywords:
      pkg.keywords.length > 0
        ? pkg.keywords
        : [`${pkg.shortTitle} package`, `${pkg.shortTitle} from India`],
    image: pkg.heroImages[0],
  });
}

export default async function PackageDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pkg = await getTourData(slug);

  if (!pkg) {
    return <PackageNotFound />;
  }

  const related = getRelatedTours(pkg);

  return (
    <>
      <JsonLd
        data={[
          touristTripJsonLd(pkg),
          ...(pkg.faqs.length > 0 ? [faqJsonLd(pkg.faqs)] : []),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Tour Packages", path: "/packages" },
            { name: pkg.shortTitle, path: `/packages/${pkg.slug}` },
          ]),
        ]}
      />
      <PackageDetailClient pkg={pkg} related={related} />
    </>
  );
}
