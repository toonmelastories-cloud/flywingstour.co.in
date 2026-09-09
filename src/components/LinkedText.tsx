import Link from "next/link";

/** Strips `[label](/href)` markdown-link syntax down to plain `label` text — for JSON-LD and other plain-text contexts that can't render a <Link>. */
export function stripLinks(text: string): string {
  return text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
}

/**
 * Renders plain copy that may contain `[label](/href)` markdown-style
 * links as real text with embedded Next.js `<Link>`s. Data files (FAQ
 * answers, intro paragraphs) are plain strings, not HTML, so a raw
 * `<a href>` in the copy would render as literal text — this is the
 * lightweight bridge that lets a sentence like "see our full guide"
 * carry a real internal link without switching those fields to HTML.
 */
export default function LinkedText({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return (
    <>
      {parts.map((part, i) => {
        const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (!match) return <span key={i}>{part}</span>;
        const [, label, href] = match;
        return (
          <Link key={i} href={href} className="text-gold underline underline-offset-2 hover:text-gold/80">
            {label}
          </Link>
        );
      })}
    </>
  );
}
