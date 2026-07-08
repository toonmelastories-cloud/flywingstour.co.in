import type { Metadata } from "next";
import HomeClient from "@/components/HomeClient";
import JsonLd from "@/components/JsonLd";
import { ALL_KEYWORDS, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title:
    "Flywings Tour and Travel | Flight Tickets & Tour Packages from India",
  description:
    "Book domestic & international flight tickets at the lowest fares, plus curated tour packages to Dubai, Thailand, Bali, Maldives, Singapore & Kashmir. Trusted travel agency in Mohali since 2005 — visa assistance, hotels & 24/7 support.",
  path: "/",
  keywords: ALL_KEYWORDS,
});

const homeFaqs = [
  {
    question: "Does Flywings book both domestic and international flight tickets?",
    answer:
      "Yes. Flywings Tour and Travel books domestic flights across India (Delhi, Mumbai, Bengaluru, Chandigarh and more) and international air tickets worldwide, always at the lowest available fares with free rebooking guidance.",
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

export default function Home() {
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
      <HomeClient />
    </>
  );
}
