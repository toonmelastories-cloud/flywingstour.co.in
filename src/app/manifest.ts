import type { MetadataRoute } from "next";
import { SITE_LOGO_URL, SITE_NAME, SITE_SHORT_NAME } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: SITE_SHORT_NAME,
    description:
      "Domestic & international flight tickets, tour packages, visa assistance and hotel bookings — trusted travel agency in Mohali since 2005.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0b1f3a",
    categories: ["travel", "business"],
    icons: [
      {
        src: SITE_LOGO_URL,
        sizes: "any",
        type: "image/png",
      },
    ],
  };
}
