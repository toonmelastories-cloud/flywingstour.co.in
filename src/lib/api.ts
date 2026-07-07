/**
 * Centralized API Service — Plug-and-Play Backend Layer
 *
 * Configure your backend URL and all pages will automatically
 * fetch data from your API instead of using static fallbacks.
 *
 * Setup:
 *   1. Set NEXT_PUBLIC_API_BASE_URL to your backend URL
 *   2. Set NEXT_PUBLIC_USE_API=true
 *   3. Implement the matching endpoints on your backend
 *
 * All functions gracefully fall back to static data when API is disabled or fails.
 *
 * Expected Backend Endpoints:
 *   GET    /api/destinations              → Destination[]
 *   GET    /api/destinations/:slug        → Destination
 *   GET    /api/packages                  → PackageData[]
 *   GET    /api/packages/:slug            → PackageData
 *   GET    /api/testimonials              → Testimonial[]
 *   POST   /api/inquiries                 → { success: boolean }
 *   POST   /api/contact                   → { success: boolean }
 *   GET    /api/services                  → Service[]
 *
 * Travel APIs (flights/hotels):
 *   POST   /api/travel/search-flights     → FlightResult[]
 *   POST   /api/travel/search-hotels      → HotelResult[]
 *   GET    /api/travel/flight/:id         → FlightDetail
 *   GET    /api/travel/hotel/:id          → HotelDetail
 */

// ─── Configuration ──────────────────────────────────────────────
export const API_CONFIG = {
  /** Your backend base URL (no trailing slash) */
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000",

  /** Set to true when your backend is ready */
  USE_API: process.env.NEXT_PUBLIC_USE_API === "true",

  /** Request timeout in ms */
  TIMEOUT: 10000,

  /** Auth token header name (if your backend uses auth) */
  AUTH_HEADER: "Authorization",
};

// ─── Types ──────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface InquiryPayload {
  name: string;
  phone: string;
  email: string;
  destination?: string;
  travelDate?: string;
  travelers?: string;
  message?: string;
  budget?: string;
  contactMethod?: string;
  source?: string; // e.g., "contact-page", "inquiry-modal", "package-detail"
}

export interface ContactPayload extends InquiryPayload {
  subject?: string;
}

export interface NewsletterPayload {
  email: string;
  name?: string;
}

// ─── HTTP Client ────────────────────────────────────────────────

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;

    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { [API_CONFIG.AUTH_HEADER]: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API error: ${response.status}`);
    }

    return await response.json();
  } catch (error: unknown) {
    clearTimeout(timeout);
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Request timed out");
    }
    throw error;
  }
}

// ─── API Functions ──────────────────────────────────────────────

/** Fetch all destinations */
export async function fetchDestinations() {
  return apiRequest<unknown[]>("/api/destinations");
}

/** Fetch single destination by slug */
export async function fetchDestination(slug: string) {
  return apiRequest<unknown>(`/api/destinations/${slug}`);
}

/** Fetch all packages with optional filters */
export async function fetchPackages(filters?: {
  destination?: string;
  budget?: string;
  type?: string;
  search?: string;
}) {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, val]) => {
      if (val && val !== "All" && val !== "All Types" && val !== "All Budgets") {
        params.set(key, val);
      }
    });
  }
  const query = params.toString();
  return apiRequest<unknown[]>(`/api/packages${query ? `?${query}` : ""}`);
}

/** Fetch single package by slug */
export async function fetchPackage(slug: string) {
  return apiRequest<unknown>(`/api/packages/${slug}`);
}

/** Fetch testimonials */
export async function fetchTestimonials() {
  return apiRequest<unknown[]>("/api/testimonials");
}

/** Fetch services */
export async function fetchServices() {
  return apiRequest<unknown[]>("/api/services");
}

/** Submit inquiry form */
export async function submitInquiry(data: InquiryPayload) {
  return apiRequest<{ id: string }>("/api/inquiries", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/** Submit contact form */
export async function submitContact(data: ContactPayload) {
  return apiRequest<{ id: string }>("/api/contact", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/** Subscribe to newsletter */
export async function subscribeNewsletter(data: NewsletterPayload) {
  return apiRequest<{ subscribed: boolean }>("/api/newsletter", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ─── Travel API Functions ───────────────────────────────────────

export interface FlightSearchParams {
  origin: string;
  destination: string;
  date: string;
  returnDate?: string;
  adults?: number;
  children?: number;
  cabinClass?: "economy" | "business" | "first";
}

export interface HotelSearchParams {
  city?: string;
  cityCode?: string;
  checkIn: string;
  checkOut: string;
  adults?: number;
  rooms?: number;
  stars?: number;
  priceMin?: number;
  priceMax?: number;
}

/** Search flights via your backend */
export async function searchFlights(params: FlightSearchParams) {
  return apiRequest<unknown[]>("/api/travel/search-flights", {
    method: "POST",
    body: JSON.stringify(params),
  });
}

/** Search hotels via your backend */
export async function searchHotels(params: HotelSearchParams) {
  return apiRequest<unknown[]>("/api/travel/search-hotels", {
    method: "POST",
    body: JSON.stringify(params),
  });
}

/** Get flight details */
export async function getFlightDetails(id: string) {
  return apiRequest<unknown>(`/api/travel/flight/${id}`);
}

/** Get hotel details */
export async function getHotelDetails(id: string) {
  return apiRequest<unknown>(`/api/travel/hotel/${id}`);
}

// ─── Helper: Check if API is available ──────────────────────────

export function isApiEnabled() {
  return API_CONFIG.USE_API;
}
