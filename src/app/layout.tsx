import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Flywings Tour and Travel | Best Travel Agency",
  description:
    "Flywings Tour and Travel — India's trusted travel agency for flight booking, holiday packages, visa services, and complete travel solutions. Best prices guaranteed.",
  authors: [{ name: "Flywings Tour and Travel" }],
  openGraph: {
    type: "website",
    title: "Flywings Tour and Travel | Best Travel Agency India",
    description:
      "India's trusted travel agency for flight booking, holiday packages, visa services, and complete travel solutions.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Flywings Tour and Travel",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
