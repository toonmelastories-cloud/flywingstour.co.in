import type { Metadata } from "next";
import PackageDetailClient from "@/components/PackageDetailClient";
import PackageNotFound from "@/components/PackageNotFound";
import { getDestinationBySlug } from "@/data/destinations";
import { getPackagePreview, getRelatedTours } from "@/lib/tours";

/**
 * A package draft opened from the WordPress editor's "Preview on website"
 * button, rendered in the real page design before it goes live.
 *
 * The link carries an expiry and a signature that WordPress checks, so
 * only someone who clicked Preview in wp-admin can open it. Always
 * rendered fresh and never indexed.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Package preview",
  robots: { index: false, follow: false },
};

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

export default async function PackagePreviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const pkg = await getPackagePreview(id, one(query.exp), one(query.token));

  if (!pkg) {
    return <PackageNotFound />;
  }

  const related = await getRelatedTours(pkg);
  const destinationHref = getDestinationBySlug(pkg.destinationSlug)
    ? `/destinations/${pkg.destinationSlug}`
    : undefined;

  return <PackageDetailClient pkg={pkg} related={related} destinationHref={destinationHref} />;
}
