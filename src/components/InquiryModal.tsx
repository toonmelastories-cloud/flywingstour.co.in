"use client";

import { useState } from "react";
import { useSubmitInquiry } from "@/hooks/useApi";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";
import { DatePicker } from "@/components/DatePicker";
import { format, parse } from "date-fns";

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InquiryModal({ isOpen, onClose }: InquiryModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const inquiryMutation = useSubmitInquiry();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    destination: "",
    travelDate: "",
    travelers: "2",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    inquiryMutation.mutate(
      { ...form, source: "inquiry-modal" },
      {
        onSuccess: () => {
          setSubmitted(true);
          setTimeout(() => {
            setSubmitted(false);
            setForm({ name: "", email: "", phone: "", destination: "", travelDate: "", travelers: "2", message: "" });
            onClose();
          }, 2500);
        },
      }
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-navy/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="bg-gradient-navy px-7 pt-7 pb-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-gold/10 -mr-10 -mt-10" />
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="relative">
                <div className="inline-flex items-center gap-2 bg-gold/20 border border-gold/40 rounded-full px-3 py-1 mb-3">
                  <span className="text-gold text-xs font-body font-medium">Free Consultation</span>
                </div>
                <h2 className="font-display font-800 text-2xl text-white mb-1">Plan Your Dream Trip</h2>
                <p className="text-white/60 font-body text-sm">Fill out the form and our expert will call you within 24 hours.</p>
              </div>
            </div>

            {/* Form / Success */}
            <div className="p-7">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                  <h3 className="font-display font-800 text-xl text-navy mb-2">Inquiry Sent!</h3>
                  <p className="text-muted-foreground font-body text-sm">
                    Thank you! Our travel expert will contact you shortly.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-navy font-body font-medium text-xs mb-1.5">Full Name *</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                        <input
                          required
                          type="text"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          placeholder="John Doe"
                          className="w-full pl-8 pr-3 py-2.5 border border-border rounded-xl text-navy font-body text-sm outline-none focus:border-gold transition-colors"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-navy font-body font-medium text-xs mb-1.5">Phone *</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                        <input
                          required
                          type="tel"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          placeholder="+91 XXXXX"
                          className="w-full pl-8 pr-3 py-2.5 border border-border rounded-xl text-navy font-body text-sm outline-none focus:border-gold transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-navy font-body font-medium text-xs mb-1.5">Email Address *</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                      <input
                        required
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="you@example.com"
                        className="w-full pl-8 pr-3 py-2.5 border border-border rounded-xl text-navy font-body text-sm outline-none focus:border-gold transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-navy font-body font-medium text-xs mb-1.5">Destination</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                        <input
                          type="text"
                          value={form.destination}
                          onChange={(e) => setForm({ ...form, destination: e.target.value })}
                          placeholder="e.g. Dubai"
                          className="w-full pl-8 pr-3 py-2.5 border border-border rounded-xl text-navy font-body text-sm outline-none focus:border-gold transition-colors"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-navy font-body font-medium text-xs mb-1.5">Travel Date</label>
                      <DatePicker
                        value={form.travelDate ? parse(form.travelDate, "yyyy-MM-dd", new Date()) : undefined}
                        onChange={(date) => setForm({ ...form, travelDate: date ? format(date, "yyyy-MM-dd") : "" })}
                        placeholder="Select travel date"
                        minDate={new Date()}
                        buttonClassName="h-[42px] rounded-xl border-border text-navy focus:border-gold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-navy font-body font-medium text-xs mb-1.5">Number of Travelers</label>
                    <select
                      value={form.travelers}
                      onChange={(e) => setForm({ ...form, travelers: e.target.value })}
                      className="w-full px-3 py-2.5 border border-border rounded-xl text-navy font-body text-sm outline-none focus:border-gold transition-colors"
                    >
                      {["1", "2", "3", "4", "5", "6", "7", "8+"].map((n) => (
                        <option key={n} value={n}>{n} {n === "1" ? "Traveler" : "Travelers"}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-navy font-body font-medium text-xs mb-1.5">Special Requests</label>
                    <textarea
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      rows={3}
                      placeholder="Any specific requirements, preferences, or questions..."
                      className="w-full px-3 py-2.5 border border-border rounded-xl text-navy font-body text-sm outline-none focus:border-gold transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-navy text-gold font-display font-700 rounded-xl hover:opacity-90 transition-all hover:scale-[1.01] shadow-navy"
                  >
                    <Send className="w-4 h-4" />
                    Send My Free Inquiry
                  </button>

                  <p className="text-center text-muted-foreground font-body text-xs">
                    🔒 Your information is 100% secure and will never be shared.
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
