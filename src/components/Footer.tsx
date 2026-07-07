"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, Youtube, Linkedin, ArrowRight, Send } from "lucide-react";

const quickLinks = ["Home", "About Us", "Services", "Packages", "Destinations", "Contact"];
const services = ["Flight Booking", "Holiday Packages", "Visa Services", "Hotel Booking", "Corporate Travel", "Group Tours", "Honeymoon Packages"];

export default function Footer() {
  const [email, setEmail] = useState("");

  return (
    <footer id="footer" className="bg-navy-dark">
      {/* Main footer */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center shadow-gold">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-navy" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                </svg>
              </div>
              <div>
                <div className="font-display font-800 text-lg leading-none text-gold">FLYWINGS</div>
                <div className="text-[10px] font-body tracking-widest text-gold/60 uppercase leading-none">Tour & Travel</div>
              </div>
            </div>
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
                <Mail className="w-4 h-4 text-gold flex-shrink-0" />
                <a href="mailto:info@flywingstour.in" className="text-white/60 font-body text-sm hover:text-gold transition-colors">
                  info@flywingstour.in
                </a>
              </li>
            </ul>

            {/* Newsletter */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="font-display font-600 text-white text-sm mb-2">Newsletter</div>
              <p className="text-white/50 font-body text-xs mb-3">Get travel deals in your inbox.</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-xs font-body placeholder-white/40 outline-none focus:border-gold transition-colors"
                />
                <button className="w-9 h-9 rounded-lg bg-gradient-gold text-navy flex items-center justify-center hover:opacity-90 transition-opacity">
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
