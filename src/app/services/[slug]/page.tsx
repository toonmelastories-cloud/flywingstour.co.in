import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, CheckCircle2, Phone, ArrowRight } from "lucide-react";
import JsonLd from "@/components/JsonLd";
import PageChrome from "@/components/PageChrome";
import servicePages, { getServicePageBySlug } from "@/data/servicePages";
import {
  ORG_ID,
  absoluteUrl,
  breadcrumbJsonLd,
  faqJsonLd,
  pageMetadata,
} from "@/lib/seo";

export function generateStaticParams() {
  return servicePages.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const svc = getServicePageBySlug(slug);
  if (!svc) return { title: "Service Not Found" };

  return pageMetadata({
    title: svc.metaTitle,
    titleAbsolute: true,
    description: svc.metaDescription,
    path: `/services/${svc.slug}`,
    keywords: svc.keywords,
    image: svc.heroImage,
  });
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const svc = getServicePageBySlug(slug);
  if (!svc) notFound();

  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Service",
            "@id": absoluteUrl(`/services/${svc.slug}#service`),
            name: `${svc.heroTitle} ${svc.heroAccent}`,
            serviceType: svc.name,
            description: svc.metaDescription,
            url: absoluteUrl(`/services/${svc.slug}`),
            image: absoluteUrl(svc.heroImage),
            provider: { "@id": ORG_ID },
            areaServed: [
              { "@type": "City", name: "Chandigarh" },
              { "@type": "City", name: "Mohali" },
              { "@type": "Country", name: "India" },
            ],
          },
          faqJsonLd(svc.faqs),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
            { name: svc.name, path: `/services/${svc.slug}` },
          ]),
        ]}
      />

      <PageChrome>
      <main>
        {/* ── Hero ── */}
        <section className="relative h-[55vh] min-h-[460px] flex items-end pb-14 overflow-hidden">
          <img
            src={svc.heroImage}
            alt={svc.heroAlt}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/50 via-primary/50 to-primary/85" />

          <div className="relative container-custom w-full">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm font-body text-white/70 mb-5">
              <Link href="/" className="hover:text-secondary transition-colors">Home</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link href="/services" className="hover:text-secondary transition-colors">Services</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-secondary font-medium">{svc.name}</span>
            </nav>

            <h1 className="font-display font-900 text-4xl sm:text-5xl text-white max-w-3xl leading-tight mb-4">
              {svc.heroTitle} <span className="text-secondary">{svc.heroAccent}</span>
            </h1>
            <p className="font-body text-white/80 text-lg sm:text-xl max-w-2xl leading-relaxed mb-8">
              {svc.heroSubtitle}
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="tel:+919914310333"
                className="inline-flex items-center gap-2 bg-gradient-gold text-navy font-display font-700 text-sm px-7 py-3.5 rounded-full hover:opacity-90 transition-opacity"
              >
                <Phone className="w-4 h-4" /> +91 99143 10333
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 border border-white/40 text-white font-display font-600 text-sm px-7 py-3.5 rounded-full hover:bg-white/10 transition-colors"
              >
                Get a Free Quote <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── Intro ── */}
        <section className="section-padding">
          <div className="container-custom max-w-4xl">
            {svc.intro.map((para) => (
              <p key={para.slice(0, 32)} className="text-muted-foreground font-body text-lg leading-relaxed mb-6">
                {para}
              </p>
            ))}
          </div>
        </section>

        {/* ── Features ── */}
        <section className="section-padding bg-muted/30">
          <div className="container-custom">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1 bg-gold/10 border border-gold/30 text-gold text-xs font-body font-medium tracking-widest uppercase rounded-full mb-4">
                {svc.name}
              </span>
              <h2 className="font-display font-800 text-3xl sm:text-4xl text-navy">
                {svc.featuresTitle}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {svc.features.map((f) => (
                <div key={f.title} className="bg-white rounded-2xl border border-border shadow-card p-6">
                  <CheckCircle2 className="w-7 h-7 text-gold mb-4" />
                  <h3 className="font-display font-700 text-lg text-navy mb-2">{f.title}</h3>
                  <p className="text-muted-foreground font-body text-sm leading-relaxed">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Why + Steps ── */}
        <section className="section-padding">
          <div className="container-custom grid grid-cols-1 lg:grid-cols-2 gap-14">
            <div>
              <h2 className="font-display font-800 text-2xl sm:text-3xl text-navy mb-7">{svc.whyTitle}</h2>
              <ul className="space-y-4">
                {svc.whyPoints.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground font-body text-base leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-display font-800 text-2xl sm:text-3xl text-navy mb-7">How It Works</h2>
              <ol className="space-y-6">
                {svc.steps.map((step, i) => (
                  <li key={step.title} className="flex items-start gap-4">
                    <span className="w-10 h-10 rounded-full bg-gradient-gold text-navy font-display font-800 text-base flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="font-display font-700 text-lg text-navy mb-1">{step.title}</h3>
                      <p className="text-muted-foreground font-body text-sm leading-relaxed">{step.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* ── FAQs ── */}
        <section className="section-padding bg-muted/30">
          <div className="container-custom max-w-4xl">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1 bg-gold/10 border border-gold/30 text-gold text-xs font-body font-medium tracking-widest uppercase rounded-full mb-4">
                FAQs
              </span>
              <h2 className="font-display font-800 text-3xl text-navy">Frequently Asked Questions</h2>
            </div>
            <div className="space-y-5">
              {svc.faqs.map((faq) => (
                <div key={faq.question} className="bg-white rounded-2xl border border-border shadow-card p-6">
                  <h3 className="font-display font-700 text-lg text-navy mb-2">{faq.question}</h3>
                  <p className="text-muted-foreground font-body text-sm leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Related + CTA ── */}
        <section className="section-padding">
          <div className="container-custom text-center">
            <h2 className="font-display font-800 text-3xl sm:text-4xl text-navy mb-4">
              Plan It <span className="text-gold">With Flywings</span>
            </h2>
            <p className="text-muted-foreground font-body text-lg max-w-2xl mx-auto mb-8">
              Free consultation, itemised quotes within 24 hours, and a human desk in Mohali
              that answers — since 2005.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              <a
                href="tel:+919914310333"
                className="inline-flex items-center gap-2 bg-gradient-gold text-navy font-display font-700 text-sm px-7 py-3.5 rounded-full hover:opacity-90 transition-opacity"
              >
                <Phone className="w-4 h-4" /> Call +91 99143 10333
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-navy text-white font-display font-600 text-sm px-7 py-3.5 rounded-full hover:bg-navy/90 transition-colors"
              >
                Send an Enquiry <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {svc.related.map((r) => (
                <Link
                  key={r.href}
                  href={r.href}
                  className="inline-flex items-center gap-1.5 bg-gold/10 border border-gold/30 text-navy font-body text-sm px-4 py-2 rounded-full hover:bg-gold/20 transition-colors"
                >
                  {r.label} <ArrowRight className="w-3.5 h-3.5 text-gold" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      </PageChrome>
    </>
  );
}
