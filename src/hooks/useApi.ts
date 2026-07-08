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

export function useSubmitInquiry() {
  return useMutation({
    mutationFn: async (data: InquiryPayload) => {
      if (isApiEnabled()) {
        return submitInquiry(data);
      }
      await sendViaFormSubmit("New Trip Inquiry — Flywings Website", {
        Phone: data.phone,
        Email: data.email,
        Source: data.source || "website",
      });
      return { success: true, data: { id: "fs-" + Date.now() } };
    },
  });
}

export function useSubmitContact() {
  return useMutation({
    mutationFn: async (data: ContactPayload) => {
      if (isApiEnabled()) {
        return submitContact(data);
      }
      await sendViaFormSubmit("New Contact Enquiry — Flywings Website", {
        Phone: data.phone,
        Email: data.email,
        Source: data.source || "contact-page",
      });
      return { success: true, data: { id: "fs-" + Date.now() } };
    },
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
