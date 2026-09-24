import { StoreHeader } from "@/components/store/header";
export default function StoreLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <><StoreHeader />{children}<footer className="mt-16 border-t px-4 py-8 text-center text-sm text-zinc-500">© {new Date().getFullYear()} Babs Shop · Commande et livraison via WhatsApp</footer></>; }
