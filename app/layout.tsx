import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { VisitTracker } from "@/components/store/visit-tracker";
import "./globals.css";

export const metadata: Metadata = { title: { default: "Babs Shop", template: "%s | Babs Shop" }, description: "Découvrez notre catalogue et commandez simplement sur WhatsApp." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr"><body>{children}<VisitTracker /><Analytics /></body></html>;
}
