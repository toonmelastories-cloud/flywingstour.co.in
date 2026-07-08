import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DestinationDetailClient from "@/components/DestinationDetailClient";
import JsonLd from "@/components/JsonLd";
import destinations, { getDestinationBySlug } from "@/data/destinations";
import {
  ORG_ID,
  absoluteUrl,
  breadcrumbJsonLd,
  faqJsonLd,
  pageMetadata,
  parsePrice,
  touristDestinationJsonLd,
} from "@/lib/seo";

export function generateStaticParams() {
  return destinations.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const destination = getDestinationBySlug(slug);
  if (!destination) return { title: "Destination Not Found" };

  return pageMetadata({
    title: destination.metaTitle,
    titleAbsolute: true,
    description: destination.metaDescription,
    path: `/destinations/${destination.slug}`,
    keywords: [
      `${destination.name} tour package`,
      `${destination.name} tour package from India`,
      `${destination.name} holiday package`,
      `${destination.name} trip cost from India`,
      `flights to ${destination.name}`,
      `${destination.name} packages with flights`,
    ],
    image: destination.heroImage,
  });
}

export default async function DestinationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const destination = getDestinationBySlug(slug);
  if (!destination) notFound();

  const startingPrice = parsePrice(destination.startingPrice);

  return (
    <>
      <JsonLd
        data={[
          touristDestinationJsonLd(destination),
          {
            "@context": "https://schema.org",
            "@type": "TouristTrip",
            name: `${destination.name} Tour Packages from India`,
            description: destination.metaDescription,
            url: absoluteUrl(`/destinations/${destination.slug}`),
            provider: { "@id": ORG_ID },
            touristType: ["Couples", "Families", "Honeymooners"],
            ...(startingPrice
              ? {
                  offers: destination.packages.map((pkg) => ({
                    "@type": "Offer",
                    name: pkg.title,
                    price: parsePrice(pkg.price),
                    priceCurrency: "INR",
                    availability: "https://schema.org/InStock",
                    url: absoluteUrl(`/destinations/${destination.slug}`),
                    seller: { "@id": ORG_ID },
                  })),
                }
              : {}),
          },
          faqJsonLd(destination.faqs),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Destinations", path: "/destinations" },
            { name: destination.name, path: `/destinations/${destination.slug}` },
          ]),
        ]}
      />
      <DestinationDetailClient destination={destination} />
    </>
  );
}
