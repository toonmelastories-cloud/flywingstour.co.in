"use client";

import { useState } from "react";
import { useSubmitInquiry } from "@/hooks/useApi";
import { travelMonthOptions, destinationSuggestions } from "@/lib/leadForm";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Phone, User, MapPin, Calendar, Send, CheckCircle } from "lucide-react";

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  /**
   * Pre-fills the destination when the modal is opened from a page that
   * already implies one, e.g. a package or destination detail page. The
   * visitor can still change it.
   */
  defaultDestination?: string;
  /** Overrides the lead source so GA4 and the sheet show where it opened. */
  source?: string;
}

export default function InquiryModal({
  isOpen,
  onClose,
  defaultDestination = "",
  source = "inquiry-modal",
}: InquiryModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const inquiryMutation = useSubmitInquiry();
  const emptyForm = {
    name: "",
    phone: "",
    email: "",
    destination: defaultDestination,
    travelMonth: "",
  };
  const [form, setForm] = useState(emptyForm);
  const months = travelMonthOptions();
  const destinationList = destinationSuggestions();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    inquiryMutation.mutate(
      { ...form, source },
      {
        onSuccess: () => {
          setSubmitted(true);
          setTimeout(() => {
            setSubmitted(false);
            setForm(emptyForm);
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
            className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
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
                <p className="text-white/60 font-body text-sm">Leave your details and our expert will call you within 24 hours.</p>
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
                  <div>
                    <label htmlFor="inq-name" className="block text-navy font-body font-medium text-xs mb-1.5">Your Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                      <input
                        id="inq-name"
                        type="text"
                        autoComplete="name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="So we know who we are calling"
                        maxLength={80}
                        className="w-full pl-9 pr-3 py-2.5 border border-border rounded-xl text-navy font-body text-sm outline-none focus:border-gold transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="inq-phone" className="block text-navy font-body font-medium text-xs mb-1.5">Phone Number *</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                      <input
                        id="inq-phone"
                        required
                        type="tel"
                        autoComplete="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="+91 XXXXX XXXXX"
                        className="w-full pl-9 pr-3 py-2.5 border border-border rounded-xl text-navy font-body text-sm outline-none focus:border-gold transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="inq-email" className="block text-navy font-body font-medium text-xs mb-1.5">Email Address *</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                      <input
                        id="inq-email"
                        required
                        type="email"
                        autoComplete="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="you@example.com"
                        className="w-full pl-9 pr-3 py-2.5 border border-border rounded-xl text-navy font-body text-sm outline-none focus:border-gold transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="inq-destination" className="block text-navy font-body font-medium text-xs mb-1.5">Where do you want to go?</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                      <input
                        id="inq-destination"
                        type="text"
                        list="fw-inq-destinations"
                        value={form.destination}
                        onChange={(e) => setForm({ ...form, destination: e.target.value })}
                        placeholder="Dubai, Kashmir, Bali, or just ask us"
                        maxLength={80}
                        className="w-full pl-9 pr-3 py-2.5 border border-border rounded-xl text-navy font-body text-sm outline-none focus:border-gold transition-colors"
                      />
                      <datalist id="fw-inq-destinations">
                        {destinationList.map((d) => <option key={d} value={d} />)}
                      </datalist>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="inq-month" className="block text-navy font-body font-medium text-xs mb-1.5">When are you travelling?</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                      <select
                        id="inq-month"
                        value={form.travelMonth}
                        onChange={(e) => setForm({ ...form, travelMonth: e.target.value })}
                        className="w-full pl-9 pr-3 py-2.5 border border-border rounded-xl text-navy font-body text-sm outline-none focus:border-gold transition-colors bg-white"
                      >
                        <option value="">Select a month</option>
                        {months.map((m) => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
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
