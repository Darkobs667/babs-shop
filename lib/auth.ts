import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secret = () => new TextEncoder().encode(process.env.AUTH_SECRET);
export const ADMIN_SESSION = "babs_admin_session";

export async function createAdminSession() {
  return new SignJWT({ role: "admin" }).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("7d").sign(secret());
}
export async function isAdmin() {
  const token = (await cookies()).get(ADMIN_SESSION)?.value;
  if (!token) return false;
  try { return (await jwtVerify(token, secret())).payload.role === "admin"; } catch { return false; }
}
