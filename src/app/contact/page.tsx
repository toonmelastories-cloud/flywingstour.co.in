import type { Metadata } from "next";
import ContactClient from "@/components/ContactClient";
import JsonLd from "@/components/JsonLd";
import { contactFaqs } from "@/data/contact-faqs";
import {
  ORG_ID,
  absoluteUrl,
  breadcrumbJsonLd,
  faqJsonLd,
  pageMetadata,
} from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contact Flywings | Flight & Tour Package Enquiries",
  titleAbsolute: true,
  description:
    "Contact Flywings Tour & Packages Pvt Ltd for domestic & international flight bookings, tour packages, and visa consultation. Call +91 99143 10333, WhatsApp us, or visit our Mohali (Punjab) office. Free consultation, response within 2–4 hours.",
  path: "/contact",
  keywords: [
    "contact travel agency Mohali",
    "flight booking enquiry",
    "air ticket agent contact",
    "tour package enquiry India",
    "visa consultation Mohali",
    "travel agent Chandigarh contact",
  ],
  image: "/assets/contact-hero.jpg",
});

export default function Contact() {
  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "ContactPage",
            "@id": absoluteUrl("/contact#webpage"),
            url: absoluteUrl("/contact"),
            name: "Contact Flywings Tour & Packages Pvt Ltd",
            about: { "@id": ORG_ID },
            inLanguage: "en-IN",
          },
          faqJsonLd(
            contactFaqs.map((f) => ({ question: f.q, answer: f.a }))
          ),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Contact", path: "/contact" },
          ]),
        ]}
      />
      <ContactClient />
    </>
  );
}
