"use server";
import { compare } from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { ADMIN_SESSION, createAdminSession } from "@/lib/auth";

export async function login(_: { error?: string }, formData: FormData) {
  const result = z.object({ email: z.string().email(), password: z.string().min(8) }).safeParse(Object.fromEntries(formData));
  if (!result.success) return { error: "Identifiants invalides." };
  const valid = result.data.email === process.env.ADMIN_EMAIL && await compare(result.data.password, process.env.ADMIN_PASSWORD_HASH ?? "");
  if (!valid) return { error: "Identifiants invalides." };
  const store = await cookies();
  store.set(ADMIN_SESSION, await createAdminSession(), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7 });
  redirect("/admin");
}
