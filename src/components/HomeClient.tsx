"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import type { HomeBlogPost } from "@/components/BlogSection";

// Below-the-fold sections are code-split into their own chunks so the
// initial bundle parses/hydrates faster (INP/TBT). They still render on
// the server, so crawlers see the full page content.
const ServicesSection = dynamic(() => import("@/components/ServicesSection"));
const DestinationsSection = dynamic(() => import("@/components/DestinationsSection"));
const WhyChooseUs = dynamic(() => import("@/components/WhyChooseUs"));
const TourPackages = dynamic(() => import("@/components/TourPackages"));
const Testimonials = dynamic(() => import("@/components/Testimonials"));
const BlogSection = dynamic(() => import("@/components/BlogSection"));
const CTASection = dynamic(() => import("@/components/CTASection"));
const Footer = dynamic(() => import("@/components/Footer"));
const WhatsAppButton = dynamic(() => import("@/components/WhatsAppButton"), { ssr: false });
// Only fetched the first time a visitor opens it — pure interaction UI.
const InquiryModal = dynamic(() => import("@/components/InquiryModal"), { ssr: false });

export default function HomeClient({ latestPosts }: { latestPosts: HomeBlogPost[] }) {
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [inquiryRequested, setInquiryRequested] = useState(false);

  const openInquiry = () => {
    setInquiryRequested(true);
    setInquiryOpen(true);
  };

  return (
    <div className="min-h-screen bg-background font-body">
      <Navbar onInquiryOpen={openInquiry} />
      <main>
        <HeroSection onInquiryOpen={openInquiry} />
        <ServicesSection />
        <DestinationsSection />
        <WhyChooseUs />
        <TourPackages onBook={openInquiry} />
        <Testimonials />
        <BlogSection posts={latestPosts} />

        <CTASection onInquiryOpen={openInquiry} />
      </main>
      <Footer />
      <WhatsAppButton />
      {inquiryRequested && (
        <InquiryModal isOpen={inquiryOpen} onClose={() => setInquiryOpen(false)} />
      )}
    </div>
  );
}
