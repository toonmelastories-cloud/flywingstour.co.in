"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, Youtube, Linkedin, ArrowRight, Send } from "lucide-react";

const LOGO_URL = "https://wp.flywingstour.co.in/wp-content/uploads/2026/07/flywings-logo-white-1.png";

const quickLinks = ["Home", "About Us", "Services", "Packages", "Destinations", "Contact"];
const services = ["Flight Booking", "Holiday Packages", "Visa Services", "Hotel Booking", "Corporate Travel", "Group Tours", "Honeymoon Packages"];

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
            <img src={LOGO_URL} alt="Flywings Tour and Travel" className="h-[58px] w-auto mb-5" />
            <p className="text-white/60 font-body text-sm leading-relaxed mb-6">
              India's trusted travel partner since 2005. Creating unforgettable journeys for 50,000+ travelers across 180+ destinations worldwide.
            </p>
            {/* Social */}
            <div className="flex gap-2">
              {[
                { icon: Facebook, href: "#" },
                { icon: Instagram, href: "#" },
                { icon: Twitter, href: "#" },
                { icon: Youtube, href: "#" },
                { icon: Linkedin, href: "#" },
              ].map(({ icon: Icon, href }) => (
                <a
                  key={href + Icon.name}
                  href={href}
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
                <li key={link}>
                  <a href="#" className="text-white/60 font-body text-sm hover:text-gold transition-colors flex items-center gap-2 group">
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-1 transition-all text-gold" />
                    {link}
                  </a>
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
                <li key={svc}>
                  <a href="#" className="text-white/60 font-body text-sm hover:text-gold transition-colors flex items-center gap-2 group">
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-1 transition-all text-gold" />
                    {svc}
                  </a>
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
            © 2025 Flywings Tour & Travel. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-white/40 font-body text-xs hover:text-gold transition-colors">Privacy Policy</a>
            <span className="text-white/20">|</span>
            <a href="#" className="text-white/40 font-body text-xs hover:text-gold transition-colors">Terms of Service</a>
            <span className="text-white/20">|</span>
            <a href="#" className="text-white/40 font-body text-xs hover:text-gold transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
