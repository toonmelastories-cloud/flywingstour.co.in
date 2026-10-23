import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DestinationDetailClient from "@/components/DestinationDetailClient";
import JsonLd from "@/components/JsonLd";
import { stripLinks } from "@/components/LinkedText";
import destinations, { getDestinationBySlug, originFor } from "@/data/destinations";
import { getOffersForDestination, getToursForDestination } from "@/lib/tours";
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

  // What is actually on sale here, so the cards below link somewhere
  // instead of only opening a form. Offers cover the destinations we
  // sell without a package page of their own, Vietnam today.
  const [packages, offers] = await Promise.all([
    getToursForDestination(destination.slug),
    getOffersForDestination(destination.name),
  ]);

  const startingPrice = parsePrice(destination.startingPrice);

  return (
    <>
      <JsonLd
        data={[
          touristDestinationJsonLd(destination),
          {
            "@context": "https://schema.org",
            "@type": "TouristTrip",
            name: `${destination.name} Tour Packages from ${originFor(destination)}`,
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
          // FAQ answers can contain [label](/href) links; schema gets plain text.
          faqJsonLd(destination.faqs.map((f) => ({ ...f, answer: stripLinks(f.answer) }))),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Destinations", path: "/destinations" },
            { name: destination.name, path: `/destinations/${destination.slug}` },
          ]),
        ]}
      />
      <DestinationDetailClient destination={destination} packages={packages} offers={offers} />
    </>
  );
}
