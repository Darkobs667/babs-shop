import { count, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { orders, products } from "@/lib/db/schema";
export default async function AdminDashboard() {
  const [[productCount], [pendingCount], [revenue]] = await Promise.all([db.select({ value: count() }).from(products), db.select({ value: count() }).from(orders).where(eq(orders.status, "PENDING_WHATSAPP")), db.select({ value: sql<string>`coalesce(sum(${orders.total}), 0)` }).from(orders).where(eq(orders.status, "CONFIRMED"))]);
  return <main className="p-8"><h1 className="text-3xl font-bold">Tableau de bord</h1><div className="mt-6 grid gap-4 sm:grid-cols-3"><Metric label="Produits" value={productCount.value} /><Metric label="Commandes WhatsApp à traiter" value={pendingCount.value} /><Metric label="Ventes confirmées" value={`₦${Number(revenue.value).toLocaleString("en-NG")}`} /></div></main>;
}
function Metric({ label, value }: { label: string; value: string | number }) { return <div className="rounded-lg border p-5"><p className="text-sm text-zinc-500">{label}</p><p className="mt-2 text-2xl font-bold">{value}</p></div>; }
