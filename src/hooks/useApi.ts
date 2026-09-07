"use client";

/**
 * React Query Hooks — Plug-and-Play API Layer
 *
 * These hooks automatically switch between:
 *   - Static data (default, works offline)
 *   - Your backend API (when NEXT_PUBLIC_USE_API=true)
 *
 * Usage:
 *   const { data, isLoading } = useDestinations();
 *   const { data } = useDestination("dubai");
 *   const { mutate } = useSubmitInquiry();
 */

import { useQuery, useMutation } from "@tanstack/react-query";
import {
  isApiEnabled,
  fetchDestinations, fetchDestination,
  fetchPackages, fetchPackage,
  fetchTestimonials, fetchServices,
  submitInquiry, submitContact, subscribeNewsletter,
  searchFlights, searchHotels, getFlightDetails, getHotelDetails,
  type InquiryPayload, type ContactPayload, type NewsletterPayload,
  type FlightSearchParams, type HotelSearchParams,
} from "@/lib/api";
import { trackLead, logLead, getAttribution } from "@/lib/analytics";

// Static data imports (fallbacks)
import staticDestinations, { getDestinationBySlug, type Destination } from "@/data/destinations";
import { getAllPackages, getPackageBySlug, type PackageData } from "@/data/packages";

// ─── Destinations ───────────────────────────────────────────────

export function useDestinations() {
  return useQuery({
    queryKey: ["destinations"],
    queryFn: async () => {
      if (isApiEnabled()) {
        const res = await fetchDestinations();
        return res.data as Destination[];
      }
      return staticDestinations;
    },
    staleTime: 10 * 60 * 1000, // 10 min cache
  });
}

export function useDestination(slug: string | undefined) {
  return useQuery({
    queryKey: ["destination", slug],
    queryFn: async () => {
      if (!slug) return null;
      if (isApiEnabled()) {
        const res = await fetchDestination(slug);
        return res.data as Destination;
      }
      return getDestinationBySlug(slug) || null;
    },
    enabled: !!slug,
    staleTime: 10 * 60 * 1000,
  });
}

// ─── Packages ───────────────────────────────────────────────────

export function usePackages(filters?: {
  destination?: string;
  budget?: string;
  type?: string;
  search?: string;
}) {
  return useQuery({
    queryKey: ["packages", filters],
    queryFn: async () => {
      if (isApiEnabled()) {
        const res = await fetchPackages(filters);
        return res.data as PackageData[];
      }
      return getAllPackages();
    },
    staleTime: 10 * 60 * 1000,
  });
}

export function usePackage(slug: string | undefined) {
  return useQuery({
    queryKey: ["package", slug],
    queryFn: async () => {
      if (!slug) return null;
      if (isApiEnabled()) {
        const res = await fetchPackage(slug);
        return res.data as PackageData;
      }
      return getPackageBySlug(slug) || null;
    },
    enabled: !!slug,
    staleTime: 10 * 60 * 1000,
  });
}

// ─── Testimonials ───────────────────────────────────────────────

export function useTestimonials() {
  return useQuery({
    queryKey: ["testimonials"],
    queryFn: async () => {
      if (isApiEnabled()) {
        const res = await fetchTestimonials();
        return res.data;
      }
      return null; // Component uses its own static data
    },
    staleTime: 30 * 60 * 1000,
  });
}

// ─── Services ───────────────────────────────────────────────────

export function useServices() {
  return useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      if (isApiEnabled()) {
        const res = await fetchServices();
        return res.data;
      }
      return null; // Component uses its own static data
    },
    staleTime: 30 * 60 * 1000,
  });
}

// ─── Form Submissions (Mutations) ───────────────────────────────

/**
 * Forms deliver leads to the sales inbox via FormSubmit's AJAX API,
 * called DIRECTLY from the visitor's browser — FormSubmit 403-blocks
 * datacenter IPs (e.g. Vercel functions), but browser requests from
 * real users pass. No more simulated success.
 */
const SALES_EMAIL = "sales@flywingstour.co.in";

async function sendViaFormSubmit(
  subject: string,
  fields: Record<string, string>
): Promise<void> {
  const res = await fetch(`https://formsubmit.co/ajax/${SALES_EMAIL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      ...fields,
      _subject: subject,
      _template: "table",
      _captcha: "false",
    }),
  });
  const json = await res.json().catch(() => null);
  const ok = res.ok && (json?.success === true || json?.success === "true");
  if (!ok) throw new Error(json?.message || "Submission failed");
}

/**
 * Builds the FormSubmit body for an enquiry.
 *
 * Qualification fields are only included when the visitor filled them
 * in, so the sales email stays readable instead of listing five empty
 * rows on a minimal submission.
 */
function enquiryFields(data: InquiryPayload, defaultSource: string) {
  const fields: Record<string, string> = {
    Phone: data.phone,
    Email: data.email,
    Source: data.source || defaultSource,
  };
  if (data.name) fields.Name = data.name;
  if (data.destination) fields.Destination = data.destination;
  if (data.travelMonth) fields["Travel month"] = data.travelMonth;
  return fields;
}

/**
 * Fires the GA4 conversion event and writes the lead to the Google
 * Sheet. Runs after delivery succeeds, so the numbers in GA4 and the
 * sheet only ever count leads that actually reached the inbox.
 */
function recordLead(
  event: "inquiry_submit" | "contact_submit" | "newsletter_signup",
  data: Partial<InquiryPayload> & { email: string },
  source: string
) {
  trackLead(event, {
    source,
    destination: data.destination || "not specified",
  });
  logLead({
    type: event,
    name: data.name || "",
    phone: data.phone || "",
    email: data.email,
    destination: data.destination || "",
    travelMonth: data.travelMonth || "",
    source,
    ...getAttribution(),
  });
}

export function useSubmitInquiry() {
  return useMutation({
    mutationFn: async (data: InquiryPayload) => {
      if (isApiEnabled()) {
        return submitInquiry(data);
      }
      await sendViaFormSubmit(
        "New Trip Inquiry — Flywings Website",
        enquiryFields(data, "website")
      );
      return { success: true, data: { id: "fs-" + Date.now() } };
    },
    onSuccess: (_result, data) =>
      recordLead("inquiry_submit", data, data.source || "website"),
  });
}

export function useSubmitContact() {
  return useMutation({
    mutationFn: async (data: ContactPayload) => {
      if (isApiEnabled()) {
        return submitContact(data);
      }
      await sendViaFormSubmit(
        "New Contact Enquiry — Flywings Website",
        enquiryFields(data, "contact-page")
      );
      return { success: true, data: { id: "fs-" + Date.now() } };
    },
    onSuccess: (_result, data) =>
      recordLead("contact_submit", data, data.source || "contact-page"),
  });
}

export function useSubscribeNewsletter() {
  return useMutation({
    mutationFn: async (data: NewsletterPayload) => {
      if (isApiEnabled()) {
        return subscribeNewsletter(data);
      }
      await sendViaFormSubmit("Newsletter Signup — Flywings Website", {
        Email: data.email,
      });
      return { success: true, data: { subscribed: true } };
    },
    onSuccess: (_result, data) =>
      recordLead("newsletter_signup", data, "newsletter"),
  });
}

// ─── Travel APIs (Flights & Hotels) ─────────────────────────────

export function useFlightSearch(params: FlightSearchParams | null) {
  return useQuery({
    queryKey: ["flights", params],
    queryFn: () => searchFlights(params!),
    enabled: !!params && isApiEnabled(),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

export function useHotelSearch(params: HotelSearchParams | null) {
  return useQuery({
    queryKey: ["hotels", params],
    queryFn: () => searchHotels(params!),
    enabled: !!params && isApiEnabled(),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

export function useFlightDetails(id: string | null) {
  return useQuery({
    queryKey: ["flight-details", id],
    queryFn: () => getFlightDetails(id!),
    enabled: !!id && isApiEnabled(),
    staleTime: 2 * 60 * 1000,
  });
}

export function useHotelDetails(id: string | null) {
  return useQuery({
    queryKey: ["hotel-details", id],
    queryFn: () => getHotelDetails(id!),
    enabled: !!id && isApiEnabled(),
    staleTime: 2 * 60 * 1000,
  });
}
