import type { Metadata } from "next";
import PackagesClient from "@/components/PackagesClient";
import { getAllTours } from "@/lib/tours";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Tour Packages | Dubai, Thailand, Bali & More | Flywings",
  description:
    "Browse best-value international tour packages from India — Dubai, Thailand, Bali, Kashmir, Maldives, Singapore. Flights, hotels & tours included. Book with Flywings.",
};

export default async function PackagesPage() {
  const packages = await getAllTours();
  return <PackagesClient packages={packages} />;
}
