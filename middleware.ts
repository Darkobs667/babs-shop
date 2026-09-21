import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { ADMIN_SESSION } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get(ADMIN_SESSION)?.value;
  if (!token) return NextResponse.redirect(new URL("/admin/login", request.url));
  try {
    const secret = new TextEncoder().encode(process.env.AUTH_SECRET);
    const { payload } = await jwtVerify(token, secret);
    if (payload.role !== "admin") throw new Error("not admin");
    return NextResponse.next();
  } catch { return NextResponse.redirect(new URL("/admin/login", request.url)); }
}
export const config = { matcher: ["/admin/((?!login).*)"] };
