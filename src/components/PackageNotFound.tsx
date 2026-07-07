"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import InquiryModal from "@/components/InquiryModal";

export default function PackageNotFound() {
  const [inquiryOpen, setInquiryOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar onInquiryOpen={() => setInquiryOpen(true)} />
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4 pt-32">
        <div className="text-6xl mb-4">✈️</div>
        <h1 className="font-display font-800 text-3xl text-primary mb-3">Package Not Found</h1>
        <p className="text-muted-foreground font-body mb-6">We couldn't find this tour package. Explore our popular packages below.</p>
        <Link
          href="/"
          className="px-6 py-3 bg-gradient-gold text-primary font-display font-700 rounded-full shadow-gold hover:opacity-90 transition-all"
        >
          Back to Home
        </Link>
      </div>
      <Footer />
      <InquiryModal isOpen={inquiryOpen} onClose={() => setInquiryOpen(false)} />
    </div>
  );
}
