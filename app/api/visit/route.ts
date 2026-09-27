import { NextRequest, NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { dailyVisits } from "@/lib/db/schema";
import { rateLimit, requestIp } from "@/lib/rate-limit";

const VISIT_COOKIE = "babs_visit_day";

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (origin && host && new URL(origin).host !== host) return new NextResponse(null, { status: 403 });

  // Une visite maximum par navigateur et par jour UTC. Le cookie est anonyme,
  // HTTP-only et ne contient qu'une date, pas d'identifiant personnel.
  const day = new Date().toISOString().slice(0, 10);
  if (request.cookies.get(VISIT_COOKIE)?.value === day) return new NextResponse(null, { status: 204 });

  const throttle = rateLimit(`visit:${requestIp(request.headers)}`, 60, 60 * 60 * 1000);
  if (throttle.limited) return new NextResponse(null, { status: 429, headers: { "Retry-After": String(throttle.retryAfter) } });

  await db.insert(dailyVisits).values({ day, views: 1 }).onConflictDoUpdate({
    target: dailyVisits.day,
    set: { views: sql`${dailyVisits.views} + 1`, updatedAt: new Date() },
  });
  const response = new NextResponse(null, { status: 204 });
  const tomorrow = new Date();
  tomorrow.setUTCHours(24, 0, 0, 0);
  response.cookies.set(VISIT_COOKIE, day, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: tomorrow,
  });
  return response;
}
