"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
export function VisitTracker() { const pathname = usePathname(); useEffect(() => { if (!pathname.startsWith("/admin")) void fetch("/api/visit", { method: "POST", keepalive: true }); }, [pathname]); return null; }
