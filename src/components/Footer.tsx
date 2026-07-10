"use client";

import { useState } from "react";
import Link from "next/link";
import { Phone, Mail, MapPin, Facebook, Instagram, ArrowRight, Send } from "lucide-react";
import { SOCIAL_PROFILES } from "@/lib/seo";

const LOGO_URL = "https://wp.flywingstour.co.in/wp-content/uploads/2026/07/flywings-logo-white-1.png";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Packages", href: "/packages" },
  { label: "Destinations", href: "/destinations" },
  { label: "Contact", href: "/contact" },
];
const services = [
  { label: "Flight Booking", href: "/services" },
  { label: "Holiday Packages", href: "/packages" },
  { label: "Visa Services", href: "/services" },
  { label: "Hotel Booking", href: "/services" },
  { label: "Corporate Travel", href: "/services" },
  { label: "Group Tours", href: "/packages" },
  { label: "Honeymoon Packages", href: "/packages" },
];

// lucide-react has no Pinterest glyph — simple-icons path, same 24px viewBox.
function PinterestIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z" />
    </svg>
  );
}

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);

  const handleSubscribe = async () => {
    if (!email.trim() || subscribing) return;
    setSubscribing(true);
    try {
      // Sent from the browser — FormSubmit blocks server/datacenter IPs
      const res = await fetch("https://formsubmit.co/ajax/sales@flywingstour.co.in", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          Email: email.trim(),
          _subject: "Newsletter Signup — Flywings Website",
          _template: "table",
          _captcha: "false",
        }),
      });
      const json = await res.json().catch(() => null);
      if (res.ok && (json?.success === true || json?.success === "true")) {
        setSubscribed(true);
        setEmail("");
      }
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <footer id="footer" className="bg-navy-dark">
      {/* Main footer */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <img src={LOGO_URL} alt="Flywings Tour & Packages Pvt Ltd" className="h-[58px] w-auto mb-5" />
            <p className="text-white/60 font-body text-sm leading-relaxed mb-6">
              India's trusted travel partner since 2005. Creating unforgettable journeys for 50,000+ travelers across 180+ destinations worldwide.
            </p>
            {/* Social */}
            <div className="flex gap-2">
              {[
                { icon: Facebook, href: SOCIAL_PROFILES.facebook, label: "Facebook" },
                { icon: Instagram, href: SOCIAL_PROFILES.instagram, label: "Instagram" },
                { icon: PinterestIcon, href: SOCIAL_PROFILES.pinterest, label: "Pinterest" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener"
                  aria-label={`Flywings on ${label}`}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-gold hover:text-navy text-white/60 flex items-center justify-center transition-all duration-200 hover:scale-110"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-700 text-white text-base mb-5 relative">
              Quick Links
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gold" />
            </h4>
            <ul className="space-y-2.5 mt-4">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-white/60 font-body text-sm hover:text-gold transition-colors flex items-center gap-2 group">
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-1 transition-all text-gold" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display font-700 text-white text-base mb-5 relative">
              Our Services
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gold" />
            </h4>
            <ul className="space-y-2.5 mt-4">
              {services.map((svc) => (
                <li key={svc.label}>
                  <Link href={svc.href} className="text-white/60 font-body text-sm hover:text-gold transition-colors flex items-center gap-2 group">
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-1 transition-all text-gold" />
                    {svc.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + Newsletter */}
          <div>
            <h4 className="font-display font-700 text-white text-base mb-5 relative">
              Contact Us
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gold" />
            </h4>
            <ul className="space-y-3 mt-4 mb-6">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                <span className="text-white/60 font-body text-sm leading-relaxed">
                  SCF 29, First Floor, Phase 7, S.A.S Nagar Mohali — 160062
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gold flex-shrink-0" />
                <a href="tel:+919914310333" className="text-white/60 font-body text-sm hover:text-gold transition-colors">
                  +91 99143 10333
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gold flex-shrink-0" />
                <a href="tel:+911724736185" className="text-white/60 font-body text-sm hover:text-gold transition-colors">
                  0172-4736185
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gold flex-shrink-0" />
                <a href="mailto:sales@flywingstour.co.in" className="text-white/60 font-body text-sm hover:text-gold transition-colors">
                  sales@flywingstour.co.in
                </a>
              </li>
            </ul>

            {/* Newsletter */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="font-display font-600 text-white text-sm mb-2">Newsletter</div>
              <p className="text-white/50 font-body text-xs mb-3">
                {subscribed ? "Subscribed! ✓ You'll hear from us soon." : "Get travel deals in your inbox."}
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
                  placeholder="Your email"
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-xs font-body placeholder-white/40 outline-none focus:border-gold transition-colors"
                />
                <button
                  onClick={handleSubscribe}
                  disabled={subscribing}
                  aria-label="Subscribe to newsletter"
                  className="w-9 h-9 rounded-lg bg-gradient-gold text-navy flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container-custom py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/40 font-body text-xs text-center">
            © 2026 Flywings Tour & Packages Pvt Ltd. All rights reserved.
            <span className="text-white/20 mx-2">|</span>
            Design &amp; Developed by{" "}
            <span className="text-gold/80 font-semibold">S Kaur</span>
          </p>
          <div className="flex items-center gap-4">
            <Link href="/contact" className="text-white/40 font-body text-xs hover:text-gold transition-colors">Contact</Link>
            <span className="text-white/20">|</span>
            <Link href="/blog" className="text-white/40 font-body text-xs hover:text-gold transition-colors">Blog</Link>
            <span className="text-white/20">|</span>
            <a href="/sitemap.xml" className="text-white/40 font-body text-xs hover:text-gold transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
