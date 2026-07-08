"use client";

import { useState } from "react";
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

export default function HomeClient() {
  const [inquiryOpen, setInquiryOpen] = useState(false);

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
