import { sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { dailyVisits } from "@/lib/db/schema";

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (origin && host && new URL(origin).host !== host) return new Response(null, { status: 403 });
  const day = new Date().toISOString().slice(0, 10);
  await db.insert(dailyVisits).values({ day, views: 1 }).onConflictDoUpdate({ target: dailyVisits.day, set: { views: sql`${dailyVisits.views} + 1`, updatedAt: new Date() } });
  return new Response(null, { status: 204 });
}
