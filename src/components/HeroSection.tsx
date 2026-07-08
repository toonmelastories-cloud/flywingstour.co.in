"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, MapPin, Users, ArrowRight, Shield, Clock, Tag, CalendarIcon,
  Phone, CheckCircle2, Loader2, PlaneTakeoff, PlaneLanding,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AIRPORTS, searchAirports, formatAirport, type Airport } from "@/data/airports";

const heroBg = "/assets/hero-bg.jpg";

interface HeroSectionProps {
  onInquiryOpen: () => void;
}

const POPULAR_ROUTES: { label: string; from: string; to: string }[] = [
  { label: "Chandigarh → Dubai", from: "IXC", to: "DXB" },
  { label: "Chandigarh → Bangkok", from: "IXC", to: "BKK" },
  { label: "Amritsar → London", from: "ATQ", to: "LHR" },
  { label: "Delhi → Singapore", from: "DEL", to: "SIN" },
  { label: "Chandigarh → Mumbai", from: "IXC", to: "BOM" },
];

function AirportField({
  label,
  icon: Icon,
  selected,
  query,
  onQueryChange,
  onSelect,
}: {
  label: string;
  icon: typeof MapPin;
  selected: Airport | null;
  query: string;
  onQueryChange: (q: string) => void;
  onSelect: (a: Airport | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const results = searchAirports(query);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="relative col-span-1">
      <div
        className="bg-white/10 hover:bg-white/20 rounded-xl p-3 cursor-text transition-colors"
        onClick={() => inputRef.current?.focus()}
      >
        <div className="flex items-center gap-2 mb-1">
          <Icon className="w-3.5 h-3.5 text-gold" />
          <span className="text-gold text-xs font-body font-medium uppercase tracking-wide">{label}</span>
        </div>
        <input
          ref={inputRef}
          type="text"
          placeholder="City or airport"
          value={query}
          onChange={(e) => {
            onQueryChange(e.target.value);
            onSelect(null);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          className="bg-transparent text-white placeholder-white/50 text-sm font-body w-full outline-none"
        />
      </div>
      {open && !selected && results.length > 0 && (
        <ul className="absolute left-0 right-0 top-full mt-2 z-[100] bg-navy border border-white/20 rounded-xl shadow-navy overflow-hidden max-h-72 overflow-y-auto min-w-[240px]">
          {results.map((a) => (
            <li key={a.code}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onSelect(a);
                  onQueryChange(formatAirport(a));
                  setOpen(false);
                }}
                className="w-full flex items-center justify-between gap-3 px-4 py-2.5 text-left hover:bg-white/10 transition-colors"
              >
                <span>
                  <span className="block text-white text-sm font-body">{a.city}</span>
                  <span className="block text-white/50 text-[11px] font-body">{a.name}, {a.country}</span>
                </span>
                <span className="text-gold font-display font-700 text-xs bg-gold/15 border border-gold/25 rounded-md px-1.5 py-0.5">
                  {a.code}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const trustBadges = [
  { icon: Shield, label: "Trusted Travel Partner", sub: "IATA Certified" },
  { icon: Clock, label: "24/7 Support", sub: "Always Available" },
  { icon: Tag, label: "Best Price Guarantee", sub: "No Hidden Fees" },
];

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
});

export default function HeroSection({ onInquiryOpen }: HeroSectionProps) {
  const [departureDate, setDepartureDate] = useState<Date>();
  const [returnDate, setReturnDate] = useState<Date>();
  const [fromQuery, setFromQuery] = useState("");
  const [toQuery, setToQuery] = useState("");
  const [fromAirport, setFromAirport] = useState<Airport | null>(null);
  const [toAirport, setToAirport] = useState<Airport | null>(null);
  const [travelers, setTravelers] = useState("1 Adult");
  const [step, setStep] = useState<"search" | "phone" | "done">("search");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const applyRoute = (fromCode: string, toCode: string) => {
    const from = AIRPORTS.find((a) => a.code === fromCode) ?? null;
    const to = AIRPORTS.find((a) => a.code === toCode) ?? null;
    setFromAirport(from);
    setToAirport(to);
    setFromQuery(from ? formatAirport(from) : "");
    setToQuery(to ? formatAirport(to) : "");
    setError("");
  };

  const handleSearch = () => {
    if (!fromAirport || !toAirport) {
      setError("Please pick both airports from the list.");
      return;
    }
    if (fromAirport.code === toAirport.code) {
      setError("From and To can't be the same airport.");
      return;
    }
    if (!departureDate) {
      setError("Please select a departure date.");
      return;
    }
    setError("");
    setStep("phone");
  };

  const handleSubmit = async () => {
    const cleanPhone = phone.trim();
    if (cleanPhone.length < 10 || !/^[+\d\s()-]+$/.test(cleanPhone)) {
      setError("Please enter a valid mobile number.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const from = formatAirport(fromAirport!);
      const to = formatAirport(toAirport!);
      // Sent from the browser — FormSubmit blocks server/datacenter IPs
      const res = await fetch("https://formsubmit.co/ajax/sales@flywingstour.co.in", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          Route: `${from} → ${to}`,
          Departure: format(departureDate!, "PPP"),
          Return: returnDate ? format(returnDate, "PPP") : "One-way / not selected",
          Travelers: travelers,
          Phone: cleanPhone,
          Source: "homepage-flight-search",
          _subject: `Fare Request: ${from} → ${to} — Flywings Website`,
          _template: "table",
          _captcha: "false",
        }),
      });
      const json = (await res.json().catch(() => null)) as { success?: string | boolean } | null;
      if (!res.ok || !(json?.success === true || json?.success === "true")) throw new Error();
      const w = window as unknown as { gtag?: (...args: unknown[]) => void };
      w.gtag?.("event", "fare_request", {
        route: `${fromAirport!.code}-${toAirport!.code}`,
      });
      setStep("done");
    } catch {
      setError("Could not send your request — please call us on +91 99143 10333.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="Luxury airplane flying over clouds at sunset"
          className="w-full h-full object-cover object-center"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 bg-navy/30" />
      </div>

      {/* Content */}
      <div className="relative container-custom pt-32 pb-24">
        <div className="max-w-3xl">
          {/* Badge */}
          <motion.div {...fadeUp(0.1)} className="inline-flex items-center gap-2 bg-gold/20 border border-gold/40 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            <span className="text-gold text-xs font-body font-medium tracking-widest uppercase">Premium Travel Since 2005</span>
          </motion.div>

          {/* H1 */}
          <motion.h1
            {...fadeUp(0.2)}
            className="font-display font-900 text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-white leading-tight mb-6"
          >
            Explore The World <br />
            <span className="text-transparent bg-clip-text bg-gradient-gold">With Flywings</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p {...fadeUp(0.35)} className="text-white/80 font-body text-lg sm:text-xl mb-8 max-w-xl leading-relaxed">
            Flights, Holidays, Visa & Complete Travel Solutions — tailored to your dreams.
          </motion.p>

          {/* CTAs */}
          <motion.div {...fadeUp(0.5)} className="flex flex-wrap gap-4 mb-12">
            <button
              onClick={onInquiryOpen}
              className="group flex items-center gap-2 px-7 py-4 bg-gradient-gold text-navy font-display font-700 rounded-full shadow-gold hover:opacity-90 transition-all duration-200 hover:scale-105 text-sm sm:text-base"
            >
              Get a Free Quote
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="#destinations"
              className="flex items-center gap-2 px-7 py-4 border-2 border-white/50 text-white font-display font-600 rounded-full hover:border-gold hover:text-gold transition-all duration-200 text-sm sm:text-base backdrop-blur-sm"
            >
              Explore Packages
            </a>
          </motion.div>
        </div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-6 max-w-5xl"
        >
          {step === "done" ? (
            <div className="flex flex-col items-center text-center py-6">
              <CheckCircle2 className="w-12 h-12 text-gold mb-4" />
              <h3 className="font-display font-800 text-white text-xl mb-2">
                Fare Request Received!
              </h3>
              <p className="text-white/70 font-body text-sm max-w-md mb-5">
                Our ticketing desk will call you shortly with today&apos;s lowest fare for{" "}
                <span className="text-gold font-semibold">
                  {fromAirport ? formatAirport(fromAirport) : ""} → {toAirport ? formatAirport(toAirport) : ""}
                </span>
                . In a hurry?
              </p>
              <a
                href="tel:+919914310333"
                className="flex items-center gap-2 px-6 py-3 bg-gradient-gold text-navy font-display font-700 text-sm rounded-full shadow-gold hover:opacity-90 transition-all"
              >
                <Phone className="w-4 h-4" /> Call +91 99143 10333
              </a>
            </div>
          ) : step === "phone" ? (
            <div className="py-2">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="text-white/60 font-body text-xs uppercase tracking-wide">Your search:</span>
                <span className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3.5 py-1.5 text-white font-body text-xs">
                  <PlaneTakeoff className="w-3.5 h-3.5 text-gold" />
                  {fromAirport ? formatAirport(fromAirport) : ""} → {toAirport ? formatAirport(toAirport) : ""}
                  <span className="text-white/40">·</span>
                  {departureDate ? format(departureDate, "d MMM") : ""}
                  {returnDate ? ` – ${format(returnDate, "d MMM")}` : " (one-way)"}
                  <span className="text-white/40">·</span>
                  {travelers}
                </span>
                <button
                  type="button"
                  onClick={() => setStep("search")}
                  className="text-gold font-body text-xs underline underline-offset-2 hover:opacity-80"
                >
                  Edit
                </button>
              </div>
              <p className="text-white font-body text-sm mb-3">
                <span className="font-semibold text-gold">Almost done —</span> where should we call you
                with today&apos;s lowest fare?
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 bg-white/10 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Phone className="w-3.5 h-3.5 text-gold" />
                    <span className="text-gold text-xs font-body font-medium uppercase tracking-wide">Mobile Number</span>
                  </div>
                  <input
                    type="tel"
                    autoFocus
                    placeholder="+91 98XXX XXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    className="bg-transparent text-white placeholder-white/50 text-sm font-body w-full outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex items-center justify-center gap-2 px-7 py-3 sm:py-0 bg-gradient-gold text-navy font-display font-700 text-sm rounded-xl shadow-gold hover:opacity-90 transition-all disabled:opacity-60"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  Get Lowest Fare
                </button>
              </div>
              <p className="text-white/50 font-body text-[11px] mt-3">
                No spam, no obligation — one call from our Mohali ticketing desk with the best available fare.
              </p>
            </div>
          ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {/* From */}
            <AirportField
              label="From"
              icon={PlaneTakeoff}
              selected={fromAirport}
              query={fromQuery}
              onQueryChange={setFromQuery}
              onSelect={setFromAirport}
            />
            {/* To */}
            <AirportField
              label="To"
              icon={PlaneLanding}
              selected={toAirport}
              query={toQuery}
              onQueryChange={setToQuery}
              onSelect={setToAirport}
            />
            {/* Departure */}
            <div className="col-span-1">
              <Popover>
                <PopoverTrigger asChild>
                  <button className="w-full bg-white/10 hover:bg-white/20 rounded-xl p-3 cursor-pointer transition-colors text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <CalendarIcon className="w-3.5 h-3.5 text-gold" />
                      <span className="text-gold text-xs font-body font-medium uppercase tracking-wide">Departure</span>
                    </div>
                    <span className="text-white/80 text-sm font-body">
                      {departureDate ? format(departureDate, "PPP") : "Select date"}
                    </span>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-[200]" align="start">
                  <Calendar
                    mode="single"
                    selected={departureDate}
                    onSelect={setDepartureDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
            {/* Return */}
            <div className="col-span-1">
              <Popover>
                <PopoverTrigger asChild>
                  <button className="w-full bg-white/10 hover:bg-white/20 rounded-xl p-3 cursor-pointer transition-colors text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <CalendarIcon className="w-3.5 h-3.5 text-gold" />
                      <span className="text-gold text-xs font-body font-medium uppercase tracking-wide">Return</span>
                    </div>
                    <span className="text-white/80 text-sm font-body">
                      {returnDate ? format(returnDate, "PPP") : "Select date"}
                    </span>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-[200]" align="start">
                  <Calendar
                    mode="single"
                    selected={returnDate}
                    onSelect={setReturnDate}
                    disabled={(date) => date < (departureDate || new Date())}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
            {/* Travelers + Search */}
            <div className="col-span-2 sm:col-span-3 lg:col-span-1 flex gap-2">
              <div className="flex-1 bg-white/10 hover:bg-white/20 rounded-xl p-3 cursor-pointer transition-colors">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-3.5 h-3.5 text-gold" />
                  <span className="text-gold text-xs font-body font-medium uppercase tracking-wide">Travelers</span>
                </div>
                <select
                  value={travelers}
                  onChange={(e) => setTravelers(e.target.value)}
                  className="bg-transparent text-white/80 text-sm font-body w-full outline-none"
                >
                  <option value="1 Adult" className="text-navy">1 Adult</option>
                  <option value="2 Adults" className="text-navy">2 Adults</option>
                  <option value="3 Adults" className="text-navy">3 Adults</option>
                  <option value="4+ Adults / Group" className="text-navy">4+ Adults / Group</option>
                </select>
              </div>
              <button
                type="button"
                onClick={handleSearch}
                aria-label="Search fares"
                className="px-4 py-3 bg-gradient-gold text-navy rounded-xl shadow-gold hover:opacity-90 transition-all hover:scale-105 flex items-center justify-center"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>
          )}

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-red-300 font-body text-xs mt-3"
                role="alert"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Popular routes */}
          {step === "search" && (
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <span className="text-white/50 font-body text-[11px] uppercase tracking-wide">Popular:</span>
              {POPULAR_ROUTES.map((r) => (
                <button
                  key={r.label}
                  type="button"
                  onClick={() => applyRoute(r.from, r.to)}
                  className="px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-white/80 font-body text-xs hover:bg-gold/20 hover:border-gold/40 hover:text-gold transition-all"
                >
                  {r.label}
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9 }}
          className="flex flex-wrap gap-4 mt-8"
        >
          {trustBadges.map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2.5">
              <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
                <Icon className="w-4 h-4 text-gold" />
              </div>
              <div>
                <div className="text-white text-xs font-display font-600 leading-none">{label}</div>
                <div className="text-white/60 text-[10px] font-body leading-none mt-0.5">{sub}</div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator — only in the default state and only on tall
          screens, so it never overlaps the trust badges */}
      {step === "search" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="hidden xl:flex absolute bottom-6 left-1/2 -translate-x-1/2 flex-col items-center gap-2 pointer-events-none"
        >
          <span className="text-white/60 text-xs font-body tracking-widest uppercase">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-gold to-transparent" />
        </motion.div>
      )}
    </section>
  );
}
