"use client";

import { useState, type ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import InquiryModal from "@/components/InquiryModal";

/**
 * Site chrome (navbar, footer, WhatsApp button, inquiry modal) for
 * server-rendered pages. The older pages are full client components
 * that compose this chrome themselves; server pages wrap their content
 * in <PageChrome> to match — content stays in the RSC payload, only
 * the chrome hydrates.
 */
export default function PageChrome({ children }: { children: ReactNode }) {
  const [inquiryOpen, setInquiryOpen] = useState(false);

  return (
    <>
      <Navbar onInquiryOpen={() => setInquiryOpen(true)} />
      {children}
      <Footer />
      <WhatsAppButton />
      <InquiryModal isOpen={inquiryOpen} onClose={() => setInquiryOpen(false)} />
    </>
  );
}
