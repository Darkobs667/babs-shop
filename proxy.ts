import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { ADMIN_SESSION } from "@/lib/auth";

function loginRedirect(request: NextRequest) {
  const url = new URL("/admin/login", request.url);
  url.searchParams.set("next", request.nextUrl.pathname);
  return NextResponse.redirect(url);
}

/** Next.js 16 proxy: protege toutes les pages de l'espace administration. */
export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/admin/login") return NextResponse.next();

  const token = request.cookies.get(ADMIN_SESSION)?.value;
  if (!token) return loginRedirect(request);

  try {
    const secret = new TextEncoder().encode(process.env.AUTH_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload.role === "admin" ? NextResponse.next() : loginRedirect(request);
  } catch {
    return loginRedirect(request);
  }
}

export const config = { matcher: ["/admin/:path*"] };
