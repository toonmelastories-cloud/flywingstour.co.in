import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import PackageDetailClient from "@/components/PackageDetailClient";
import PackageNotFound from "@/components/PackageNotFound";
import JsonLd from "@/components/JsonLd";
import { getDestinationBySlug } from "@/data/destinations";
import { findTour, getAllTourSlugs, getRelatedTours } from "@/lib/tours";
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
  const found = await findTour(slug);
  if (!found || !("tour" in found)) return { title: "Package Not Found" };
  const pkg = found.tour;

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
    // Private-link packages (a custom quote for one client) stay out of Google.
    noIndex: pkg.listed === false,
  });
}

export default async function PackageDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const found = await findTour(slug);

  if (!found) {
    return <PackageNotFound />;
  }
  // Renamed in WordPress: the old link moves to the new one. Taken down:
  // the visitor lands on the destination instead of a dead page.
  if ("redirect" in found) {
    permanentRedirect(found.redirect);
  }

  const pkg = found.tour;
  const related = await getRelatedTours(pkg);
  const destinationHref = getDestinationBySlug(pkg.destinationSlug)
    ? `/destinations/${pkg.destinationSlug}`
    : undefined;

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
      <PackageDetailClient pkg={pkg} related={related} destinationHref={destinationHref} />
    </>
  );
}
