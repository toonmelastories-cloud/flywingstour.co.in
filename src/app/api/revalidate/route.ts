import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

/**
 * On-demand cache invalidation for WordPress-driven pages.
 *
 * WordPress pings this endpoint from a save_post hook (see the theme's
 * functions.php), so publishing or editing a post in wp-admin refreshes
 * the frontend within seconds instead of waiting on time-based ISR —
 * which proved unreliable on Vercel for build-time-seeded fetch entries.
 *
 * Usage: GET or POST /api/revalidate?secret=<REVALIDATE_SECRET>
 */

function handle(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json(
      { revalidated: false, message: "REVALIDATE_SECRET is not configured" },
      { status: 503 }
    );
  }

  const provided = new URL(request.url).searchParams.get("secret");
  if (provided !== secret) {
    return NextResponse.json(
      { revalidated: false, message: "Invalid secret" },
      { status: 401 }
    );
  }

  // Invalidate every fetch tagged "wordpress"… ("max" = serve stale
  // while the fresh version renders in the background)
  revalidateTag("wordpress", "max");
  // …and the pages/routes built from that data.
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/blog/[slug]", "page");
  revalidatePath("/packages");
  revalidatePath("/packages/[slug]", "page");
  // /sitemap.xml and /rss.xml are no longer listed here: both are now
  // `dynamic = "force-dynamic"` and rebuild on every request. They used
  // to be ISR routes, and because almost nobody visits them, the one
  // visitor who did (Googlebot) was always served the stale copy while
  // the refresh ran in the background. Ten posts stayed out of the
  // sitemap for weeks that way.

  return NextResponse.json({ revalidated: true, now: Date.now() });
}

export async function GET(request: Request) {
  return handle(request);
}

export async function POST(request: Request) {
  return handle(request);
}
