/**
 * Server-rendered JSON-LD structured data. Rendering in the RSC payload
 * (instead of injecting via useEffect) means every crawler — including
 * ones that never execute JavaScript — sees the schema in the raw HTML.
 */
export default function JsonLd({ data }: { data: object | object[] }) {
  const items = Array.isArray(data) ? data : [data];
  return (
    <>
      {items.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          // "<" is escaped so user-sourced strings can't break out of the tag
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(item).replace(/</g, "\\u003c"),
          }}
        />
      ))}
    </>
  );
}
