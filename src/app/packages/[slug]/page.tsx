import type { Metadata } from "next";
import PackageDetailClient from "@/components/PackageDetailClient";
import PackageNotFound from "@/components/PackageNotFound";
import { getAllTourSlugs, getRelatedTours, getTourData } from "@/lib/tours";

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
  if (!pkg) return {};

  return {
    title: pkg.metaTitle,
    description: pkg.metaDescription,
    openGraph: {
      title: pkg.metaTitle,
      description: pkg.metaDescription,
      type: "website",
    },
  };
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

  return <PackageDetailClient pkg={pkg} related={related} />;
}
