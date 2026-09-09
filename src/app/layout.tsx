import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import Providers from "./providers";
import JsonLd from "@/components/JsonLd";
import LeadTracking from "@/components/LeadTracking";
import {
  ALL_KEYWORDS,
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  SITE_URL,
  organizationJsonLd,
  webSiteJsonLd,
} from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    // Leads with "travel agency in chandigarh" (3.6k searches, difficulty
    // 29) and "travel agent mohali" (390, difficulty 12): the two local
    // terms this site can realistically win. The previous title, "Flights
    // & Tour Packages", carried no local keyword at all.
    default: "Travel Agency in Chandigarh & Mohali | Flywings Tour & Packages",
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Trusted travel agency in Chandigarh and Mohali since 2005. Tour packages, domestic & international flight booking, tourist visa assistance and hotels. Free consultation, quote in 24 hours.",
  keywords: ALL_KEYWORDS,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "Travel",
  formatDetection: { telephone: true, email: true, address: true },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "/",
    languages: { "en-IN": "/", "x-default": "/" },
    types: { "application/rss+xml": "/rss.xml" },
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE_NAME,
    locale: "en_IN",
    title: "Travel Agency in Chandigarh & Mohali | Flywings Tour & Packages",
    description:
      "Tour packages, domestic & international flight booking, tourist visa assistance, hotels and corporate travel. Mohali office, trading since 2005.",
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — flights and tour packages`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Travel Agency in Chandigarh & Mohali | Flywings Tour & Packages",
    description:
      "Tour packages, flight booking and tourist visa assistance from a Mohali travel agency trading since 2005.",
    images: [DEFAULT_OG_IMAGE],
  },
  verification: {
    // Populate via env once the site is registered in each console.
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    other: {
      ...(process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
        ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
        : {}),
      ...(process.env.NEXT_PUBLIC_YANDEX_SITE_VERIFICATION
        ? { "yandex-verification": process.env.NEXT_PUBLIC_YANDEX_SITE_VERIFICATION }
        : {}),
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN">
      <body>
        <JsonLd data={[organizationJsonLd(), webSiteJsonLd()]} />
        {/* Tracks every phone / WhatsApp / mailto click site-wide. */}
        <LeadTracking />
        <Providers>{children}</Providers>
      </body>
      <GoogleAnalytics
        gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-TLNBFYH8SZ"}
      />
    </html>
  );
}
