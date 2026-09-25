import { sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { dailyVisits } from "@/lib/db/schema";
import { rateLimit, requestIp } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (origin && host && new URL(origin).host !== host) return new Response(null, { status: 403 });
  const throttle = rateLimit(`visit:${requestIp(request.headers)}`, 60, 60 * 60 * 1000);
  if (throttle.limited) return new Response(null, { status: 429, headers: { "Retry-After": String(throttle.retryAfter) } });
  const day = new Date().toISOString().slice(0, 10);
  await db.insert(dailyVisits).values({ day, views: 1 }).onConflictDoUpdate({ target: dailyVisits.day, set: { views: sql`${dailyVisits.views} + 1`, updatedAt: new Date() } });
  return new Response(null, { status: 204 });
}
