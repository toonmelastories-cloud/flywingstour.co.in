import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd, pageMetadata, CONTACT, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description:
    "How Flywings Tour & Packages Pvt Ltd collects, uses and protects your personal information — enquiry data, bookings, newsletter and website analytics.",
  path: "/privacy-policy",
});

const sections = [
  {
    title: "1. Information We Collect",
    body: [
      "When you enquire or book with us, we collect the details needed to arrange your travel: your name, phone number, email address, and — for bookings that require them — passport details, date of birth, address and travel preferences. Website forms (enquiry, contact, fare request, newsletter) collect only the fields shown on the form.",
      "Like most websites, we also collect standard analytics data (pages visited, approximate location, device type) through Google Analytics cookies to understand how visitors use the site.",
    ],
  },
  {
    title: "2. How We Use Your Information",
    body: [
      "Your information is used to respond to enquiries, prepare quotes, book flights, hotels, visas and packages on your behalf, send booking documents, provide on-trip support, and — only if you subscribe — send occasional travel deals by email. We do not sell, rent or trade your personal information to anyone.",
    ],
  },
  {
    title: "3. Sharing with Service Providers",
    body: [
      "To deliver your booking we necessarily share relevant details with the suppliers who provide it: airlines, hotels, transport operators, visa processing centres/embassies and payment processors. Each receives only the information required for your booking.",
      "Website enquiry and newsletter submissions are delivered to our inbox via the FormSubmit form service, and site analytics run on Google Analytics. Both process data as third-party services under their own privacy policies.",
    ],
  },
  {
    title: "4. Data Security & Retention",
    body: [
      "We take reasonable technical and organisational measures to protect your information, and retain booking records only as long as needed for service, legal and accounting purposes under Indian law. Passport copies and visa documents are used solely for the application concerned.",
    ],
  },
  {
    title: "5. Your Rights",
    body: [
      "You may ask us at any time what information we hold about you, request corrections, unsubscribe from the newsletter (every email includes an unsubscribe option), or ask for deletion of your data where no legal retention requirement applies. Write to us at sales@flywingstour.co.in and we will respond promptly.",
    ],
  },
  {
    title: "6. Cookies",
    body: [
      "This website uses cookies for analytics (Google Analytics) and essential site functionality. You can disable cookies in your browser settings; the site will continue to work, though analytics will not record your visit.",
    ],
  },
  {
    title: "7. Updates to This Policy",
    body: [
      "We may update this policy from time to time as our services or legal requirements change. The latest version will always be available on this page.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Privacy Policy", path: "/privacy-policy" },
          ]),
        ]}
      />
      <main className="section-padding pt-36">
        <div className="container-custom max-w-3xl">
          <span className="inline-block px-4 py-1 bg-gold/10 border border-gold/30 text-gold text-xs font-body font-medium tracking-widest uppercase rounded-full mb-4">
            Legal
          </span>
          <h1 className="font-display font-800 text-3xl sm:text-4xl text-navy mb-3">Privacy Policy</h1>
          <p className="text-muted-foreground font-body text-sm mb-10">
            {SITE_NAME} · Effective July 2026
          </p>
          <p className="text-muted-foreground font-body text-base leading-relaxed mb-10">
            {SITE_NAME} (&ldquo;Flywings&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) operates from {CONTACT.streetAddress},{" "}
            {CONTACT.locality}, {CONTACT.region}. This policy explains what personal information we collect
            through this website and our offices, how we use it to arrange your travel, and the choices you have.
          </p>
          {sections.map((s) => (
            <section key={s.title} className="mb-8">
              <h2 className="font-display font-700 text-xl text-navy mb-3">{s.title}</h2>
              {s.body.map((p) => (
                <p key={p.slice(0, 32)} className="text-muted-foreground font-body text-base leading-relaxed mb-3">
                  {p}
                </p>
              ))}
            </section>
          ))}
          <p className="text-muted-foreground font-body text-base leading-relaxed mt-10">
            Questions about this policy or your data? Email{" "}
            <a href="mailto:sales@flywingstour.co.in" className="text-gold hover:underline">sales@flywingstour.co.in</a>{" "}
            or call <a href="tel:+919914310333" className="text-gold hover:underline">+91 99143 10333</a>. See also our{" "}
            <Link href="/terms-and-conditions" className="text-gold hover:underline">Terms &amp; Conditions</Link> and{" "}
            <Link href="/cancellation-refund-policy" className="text-gold hover:underline">Cancellation &amp; Refund Policy</Link>.
          </p>
        </div>
      </main>
    </>
  );
}
