"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { CONTACT } from "@/lib/seo";

/**
 * Floating WhatsApp button.
 *
 * The message is built from the page the visitor is on, so the sales
 * team can see the intent before they reply. A bare "Hello Flywings"
 * from the Sikkim guide and one from the Dubai package page used to look
 * identical in the inbox, which meant every conversation started by
 * asking what the person wanted. Now it opens with the answer.
 *
 * The click itself is tracked globally by <LeadTracking>, so there is no
 * handler here.
 */

/** "sri-lanka-tour-package-from-chandigarh" → "Sri Lanka Tour Package From Chandigarh" */
function slugToWords(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function messageForPath(pathname: string): string {
  const [, section, slug] = pathname.split("/");

  if (slug) {
    const name = slugToWords(slug);
    switch (section) {
      case "blog":
        return `Hi Flywings! I'm reading your "${name}" article and would like to know more.`;
      case "packages":
        return `Hi Flywings! I'm looking at the ${name} package. Please share details and pricing.`;
      case "destinations":
        return `Hi Flywings! I'm planning a trip to ${name}. Please share package options.`;
      case "services":
        return `Hi Flywings! I need help with ${name}.`;
    }
  }

  switch (section) {
    case "packages":
      return "Hi Flywings! I'm browsing your tour packages and would like some help choosing.";
    case "destinations":
      return "Hi Flywings! I'm browsing destinations and would like some suggestions.";
    case "blog":
      return "Hi Flywings! I was reading your travel blog and would like to plan a trip.";
    case "india-tour-packages-from-chandigarh":
      return "Hi Flywings! I'm interested in a domestic tour package from Chandigarh.";
    case "international-tour-packages-from-chandigarh":
      return "Hi Flywings! I'm interested in an international tour package from Chandigarh.";
    case "contact":
    case "about":
    case "":
    default:
      return "Hi Flywings! I would like to enquire about your travel packages.";
  }
}

export default function WhatsAppButton() {
  const pathname = usePathname() || "/";
  const href = `https://wa.me/${CONTACT.phoneE164.replace(
    "+",
    ""
  )}?text=${encodeURIComponent(messageForPath(pathname))}`;

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 2, type: "spring", stiffness: 200 }}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200"
      aria-label="Contact us on WhatsApp"
    >
      {/* Ping animation */}
      <span className="absolute w-full h-full rounded-full bg-[#25D366] opacity-40 animate-ping" />
      <MessageCircle className="w-6 h-6 relative z-10 fill-white" />
    </motion.a>
  );
}
