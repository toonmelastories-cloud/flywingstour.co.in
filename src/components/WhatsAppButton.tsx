"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  return (
    <motion.a
      href="https://wa.me/919914310333?text=Hello%20Flywings!%20I%20would%20like%20to%20inquire%20about%20your%20travel%20packages."
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
