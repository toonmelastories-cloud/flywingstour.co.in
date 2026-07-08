import type { Metadata } from "next";
import ServicesClient from "@/components/ServicesClient";
import JsonLd from "@/components/JsonLd";
import {
  KEYWORDS,
  ORG_ID,
  breadcrumbJsonLd,
  faqJsonLd,
  pageMetadata,
} from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Flight Booking, Tour Packages & Visa Services | Flywings",
  titleAbsolute: true,
  description:
    "Flywings travel services: domestic & international air ticket booking at the cheapest fares, customised tour packages, visa assistance for 50+ countries, hotel reservations & corporate travel management across India.",
  path: "/services",
  keywords: [...KEYWORDS.flights, ...KEYWORDS.services],
  image: "/assets/services-hero.jpg",
});

const servicesFaqs = [
  {
    question: "How can I book flights with Flywings?",
    answer:
      "You can book domestic or international flights by contacting our travel experts via phone (+91 99143 10333), WhatsApp, or the inquiry form. We find the best fares for your route and confirm instantly.",
  },
  {
    question: "Do you provide visa assistance?",
    answer:
      "Yes, Flywings provides professional visa assistance for tourist and business visas to 50+ countries. Our experts guide you through documentation, appointment booking, and submission.",
  },
  {
    question: "Can I customize my holiday package?",
    answer:
      "Absolutely! All our holiday packages are fully customizable. Our consultants create a bespoke itinerary based on your budget, travel dates, and preferences.",
  },
  {
    question: "Do you offer international tours?",
    answer:
      "Yes, we offer international tours to 100+ destinations worldwide including Dubai, Thailand, Bali, Singapore, Maldives, and Europe. Both group and private tours are available.",
  },
  {
    question: "What is included in your holiday packages?",
    answer:
      "Our packages typically include flights, hotel accommodation, airport transfers, sightseeing, and select meals depending on the package. All inclusions are clearly listed with no hidden charges.",
  },
  {
    question: "Do you offer corporate travel management?",
    answer:
      "Yes, Flywings provides end-to-end corporate travel management including bulk air ticket bookings, travel policy management, dedicated account managers, and 24/7 priority support.",
  },
];

export default function Services() {
  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Service",
            serviceType: "Travel Agency Services",
            name: "Flight Booking, Tour Packages, Visa & Hotel Services",
            provider: { "@id": ORG_ID },
            areaServed: { "@type": "Country", name: "India" },
          },
          faqJsonLd(servicesFaqs),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
          ]),
        ]}
      />
      <ServicesClient />
    </>
  );
}
