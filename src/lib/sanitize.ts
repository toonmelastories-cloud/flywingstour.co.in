import sanitizeHtmlLib from "sanitize-html";

/** Sanitizes WordPress `content.rendered` / `excerpt.rendered` HTML before rendering. */
export function sanitizeWpHtml(html: string): string {
  return sanitizeHtmlLib(html, {
    allowedTags: [
      "p", "br", "hr", "span", "div",
      "h1", "h2", "h3", "h4", "h5", "h6",
      "strong", "b", "em", "i", "u", "s", "blockquote", "pre", "code",
      "ul", "ol", "li",
      "a", "img", "figure", "figcaption",
      "table", "thead", "tbody", "tr", "th", "td",
    ],
    allowedAttributes: {
      a: ["href", "name", "target", "rel"],
      img: ["src", "alt", "width", "height", "loading"],
      "*": ["class"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    transformTags: {
      a: sanitizeHtmlLib.simpleTransform("a", { rel: "noopener noreferrer" }),
    },
  });
}

/** Rough reading-time estimate from HTML content, WordPress-style ("4 min read"). */
export function estimateReadTime(html: string): string {
  const words = html.replace(/<[^>]*>/g, " ").trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

const CATEGORY_COLORS = [
  "bg-emerald-500/10 text-emerald-600",
  "bg-pink-500/10 text-pink-600",
  "bg-blue-500/10 text-blue-600",
  "bg-amber-500/10 text-amber-600",
  "bg-violet-500/10 text-violet-600",
  "bg-teal-500/10 text-teal-600",
];

/** Deterministic color pair for a WP category name, so pills stay visually consistent across renders. */
export function getCategoryColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return CATEGORY_COLORS[hash % CATEGORY_COLORS.length];
}

/** Strips all HTML tags and decodes the handful of entities WordPress commonly emits. */
export function stripWpHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, "“")
    .replace(/&#8221;/g, "”")
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .trim();
}
