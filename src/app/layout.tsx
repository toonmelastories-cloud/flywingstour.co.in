import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import Providers from "./providers";
import JsonLd from "@/components/JsonLd";
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
    default:
      "Flywings Tour and Travel | Flight Tickets & Tour Packages from India",
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Book domestic & international flight tickets at the lowest fares, plus curated tour packages to Dubai, Thailand, Bali, Maldives & more. Trusted travel agency in Mohali since 2005 — visa assistance, hotels & 24/7 support.",
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
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE_NAME,
    locale: "en_IN",
    title: "Flywings Tour and Travel | Flight Tickets & Tour Packages from India",
    description:
      "Domestic & international air ticketing, tour packages, visa assistance, hotels & corporate travel — best fares, 24/7 support.",
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
    title: "Flywings Tour and Travel | Flights & Tour Packages",
    description:
      "Domestic & international air tickets at the lowest fares + curated tour packages. Trusted since 2005.",
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
        <Providers>{children}</Providers>
      </body>
      <GoogleAnalytics
        gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-TLNBFYH8SZ"}
      />
    </html>
  );
}
