"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import InquiryModal from "@/components/InquiryModal";

/** Shared interactive shell (Navbar + Footer + WhatsApp + Inquiry modal) for
 *  pages whose main content can otherwise stay a Server Component. */
export default function SiteShell({ children }: { children: React.ReactNode }) {
  const [inquiryOpen, setInquiryOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background font-body">
      <Navbar onInquiryOpen={() => setInquiryOpen(true)} />
      <main>{children}</main>
      <Footer />
      <WhatsAppButton />
      <InquiryModal isOpen={inquiryOpen} onClose={() => setInquiryOpen(false)} />
    </div>
  );
}
