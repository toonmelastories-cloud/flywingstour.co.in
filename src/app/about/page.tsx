import type { Metadata } from "next";
import AboutClient from "@/components/AboutClient";
import JsonLd from "@/components/JsonLd";
import { ORG_ID, absoluteUrl, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "About Flywings Tour & Packages Pvt Ltd | Travel Experts Since 2005",
  titleAbsolute: true,
  description:
    "Flywings Tour & Packages Pvt Ltd is a Mohali-based travel agency trusted since 2005 for domestic & international air ticketing, tour packages, visa assistance and corporate travel. Meet the team behind 5,000+ happy travellers.",
  path: "/about",
  keywords: [
    "about Flywings Tour & Packages Pvt Ltd",
    "trusted travel agency Mohali",
    "air ticket booking experts",
    "tour package specialists India",
    "travel consultants Punjab",
  ],
  image: "/assets/about-hero.jpg",
});

export default function About() {
  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "AboutPage",
            "@id": absoluteUrl("/about#webpage"),
            url: absoluteUrl("/about"),
            name: "About Flywings Tour & Packages Pvt Ltd",
            about: { "@id": ORG_ID },
            inLanguage: "en-IN",
          },
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "About Us", path: "/about" },
          ]),
        ]}
      />
      <AboutClient />
    </>
  );
}
