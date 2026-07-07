"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import DestinationsSection from "@/components/DestinationsSection";
import WhyChooseUs from "@/components/WhyChooseUs";
import TourPackages from "@/components/TourPackages";
import Testimonials from "@/components/Testimonials";
import BlogSection from "@/components/BlogSection";

import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import InquiryModal from "@/components/InquiryModal";

export default function Home() {
  const [inquiryOpen, setInquiryOpen] = useState(false);

  // SEO meta tags
  useEffect(() => {
    document.title = "Best Travel Agency | Flywings Tour and Travel";
    const setMeta = (name: string, content: string, property?: string) => {
      const el = document.querySelector(
        property ? `meta[property="${name}"]` : `meta[name="${name}"]`
      ) || document.createElement("meta");
      if (property) el.setAttribute("property", name);
      else el.setAttribute("name", name);
      el.setAttribute("content", content);
      if (!el.parentNode) document.head.appendChild(el);
    };

    setMeta("description", "Flywings Tour and Travel — India's trusted travel agency for flight booking, holiday packages, visa services, and complete travel solutions. Best prices guaranteed.");
    setMeta("keywords", "travel agency India, flight booking, holiday packages, visa services, tour packages, Flywings travel");
    setMeta("og:title", "Flywings Tour and Travel | Best Travel Agency India", "property");
    setMeta("og:description", "Explore the world with Flywings. Flights, Holidays, Visa & Complete Travel Solutions at best prices.", "property");
    setMeta("og:type", "website", "property");
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", "Flywings Tour and Travel");

    // Travel schema markup
    const schema = {
      "@context": "https://schema.org",
      "@type": "TravelAgency",
      "name": "Flywings Tour and Travel",
      "description": "India's premium travel agency offering flights, holiday packages, visa services, and complete travel solutions.",
      "url": "https://flywings.in",
      "telephone": "+919914310333",
      "email": "info@flywingstour.in",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "SCF 29, First Floor, Phase 7, S.A.S Nagar Mohali",
        "addressLocality": "Mohali",
        "postalCode": "160062",
        "addressCountry": "IN",
      },
      "priceRange": "₹₹",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "5234",
      },
    };

    const schemaScript = document.getElementById("travel-schema") || document.createElement("script");
    schemaScript.setAttribute("type", "application/ld+json");
    schemaScript.id = "travel-schema";
    schemaScript.textContent = JSON.stringify(schema);
    if (!schemaScript.parentNode) document.head.appendChild(schemaScript);
  }, []);

  return (
    <div className="min-h-screen bg-background font-body">
      <Navbar onInquiryOpen={() => setInquiryOpen(true)} />
      <main>
        <HeroSection onInquiryOpen={() => setInquiryOpen(true)} />
        <ServicesSection />
        <DestinationsSection />
        <WhyChooseUs />
        <TourPackages onBook={() => setInquiryOpen(true)} />
        <Testimonials />
        <BlogSection />

        <CTASection onInquiryOpen={() => setInquiryOpen(true)} />
      </main>
      <Footer />
      <WhatsAppButton />
      <InquiryModal isOpen={inquiryOpen} onClose={() => setInquiryOpen(false)} />
    </div>
  );
}
