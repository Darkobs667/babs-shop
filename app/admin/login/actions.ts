"use server";
import { compare } from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { ADMIN_SESSION, createAdminSession } from "@/lib/auth";

export type LoginState = { error: string };

export async function login(_: LoginState, formData: FormData): Promise<LoginState> {
  const result = z.object({ email: z.string().email(), password: z.string().min(8) }).safeParse(Object.fromEntries(formData));
  if (!result.success) return { error: "Identifiants invalides." };
  const valid = result.data.email.trim().toLowerCase() === process.env.ADMIN_EMAIL?.trim().toLowerCase()
    && await compare(result.data.password, process.env.ADMIN_PASSWORD_HASH ?? "");
  if (!valid) return { error: "Identifiants invalides." };
  const store = await cookies();
  store.set(ADMIN_SESSION, await createAdminSession(), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7 });
  redirect("/admin");
}
