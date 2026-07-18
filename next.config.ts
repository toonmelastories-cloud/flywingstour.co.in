import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    // Old pre-rebuild/pre-migration URLs that Google still has indexed
    // (found via `site:flywingstour.co.in`) — they 404 today. 308s tell
    // Google to drop the old URL and re-index the new one instead of
    // continuing to show a dead link in search results.
    return [
      { source: "/contact-us", destination: "/contact", permanent: true },
      {
        source: "/google-flights-international-booking-process",
        destination: "/blog",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
