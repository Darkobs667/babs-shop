"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_SESSION } from "@/lib/auth";
export async function logout() { (await cookies()).delete(ADMIN_SESSION); redirect("/admin/login"); }
