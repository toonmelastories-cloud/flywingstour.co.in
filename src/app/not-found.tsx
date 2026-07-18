import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-6 text-xl text-muted-foreground">
          This page moved or doesn&apos;t exist — but the rest of the site is right here.
        </p>
        <div className="flex flex-wrap justify-center gap-3 text-sm">
          <a href="/" className="text-primary underline hover:text-primary/90">Home</a>
          <a href="/packages" className="text-primary underline hover:text-primary/90">Packages</a>
          <a href="/blog" className="text-primary underline hover:text-primary/90">Blog</a>
          <a href="/contact" className="text-primary underline hover:text-primary/90">Contact</a>
        </div>
      </div>
    </div>
  );
}
