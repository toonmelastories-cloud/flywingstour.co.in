"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone } from "lucide-react";
import Link from "next/link";

interface NavbarProps {
  onInquiryOpen: () => void;
}

const LOGO_URL = "https://wp.flywingstour.co.in/wp-content/uploads/2026/07/flywings-logo-white.png";

const navLinks = [
  { label: "Home", href: "/", external: false },
  { label: "Services", href: "/services", external: false },
  { label: "Destinations", href: "/destinations", external: false },
  { label: "Packages", href: "/packages", external: false },
  { label: "Blog", href: "/blog", external: false },
  { label: "About", href: "/about", external: false },
  { label: "Contact", href: "/contact", external: false },
];

export default function Navbar({ onInquiryOpen }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-navy shadow-navy backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <img src={LOGO_URL} alt="Flywings Tour and Travel" className="h-12 w-auto" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) =>
              link.external ? (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-body font-medium text-white/80 hover:text-gold transition-colors duration-200 relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold transition-all duration-300 group-hover:w-full" />
                </a>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm font-body font-medium text-white/80 hover:text-gold transition-colors duration-200 relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold transition-all duration-300 group-hover:w-full" />
                </Link>
              )
            )}
          </nav>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <a
            href="tel:+919914310333"
              className="flex items-center gap-2 text-gold text-sm font-body font-medium hover:text-gold-light transition-colors"
            >
              <Phone className="w-4 h-4" />
              +91 99143 10333
            </a>
            <button
              onClick={onInquiryOpen}
              className="px-5 py-2.5 bg-gradient-gold text-navy font-display font-700 text-sm rounded-full shadow-gold hover:opacity-90 transition-all duration-200 hover:scale-105"
            >
              Get Free Quote
            </button>
          </div>

          {/* Mobile menu */}
          <button
            className="lg:hidden text-gold p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-navy-dark border-t border-gold/20 overflow-hidden"
          >
            <div className="container-custom py-4 flex flex-col gap-2">
              {navLinks.map((link) =>
                link.external ? (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/80 hover:text-gold py-3 border-b border-white/10 font-body text-sm transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-white/80 hover:text-gold py-3 border-b border-white/10 font-body text-sm transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                )
              )}
              <button
                onClick={() => { onInquiryOpen(); setMenuOpen(false); }}
                className="mt-4 w-full py-3 bg-gradient-gold text-navy font-display font-700 text-sm rounded-full shadow-gold"
              >
                Get Free Quote
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
