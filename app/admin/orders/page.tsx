import { desc, eq } from "drizzle-orm";
import { ClipboardList, PackageCheck, Phone } from "lucide-react";
import { updateOrderStatus } from "@/app/admin/actions";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";

const labels = {
  PENDING_WHATSAPP: "A confirmer sur WhatsApp",
  CONFIRMED: "Confirmee",
  FULFILLED: "Livree",
  CANCELLED: "Annulee",
} as const;

const colors = {
  PENDING_WHATSAPP: "bg-amber-100 text-amber-800",
  CONFIRMED: "bg-sky-100 text-sky-800",
  FULFILLED: "bg-emerald-100 text-emerald-800",
  CANCELLED: "bg-red-100 text-red-800",
} as const;

export const dynamic = "force-dynamic";

export default async function OrdersPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const validStatus = status && status in labels ? status as keyof typeof labels : undefined;
  const list = await db.query.orders.findMany({
    where: validStatus ? eq(orders.status, validStatus) : undefined,
    with: { items: true },
    orderBy: (order, { desc }) => [desc(order.createdAt)],
  });

  return <main className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8"><div className="mb-7"><p className="text-sm font-medium text-zinc-500">Administration</p><h1 className="text-2xl font-bold sm:text-3xl">Commandes</h1><p className="mt-1 text-sm text-zinc-500">Suivez les demandes recues avant leur confirmation WhatsApp.</p></div><div className="mb-6 flex gap-2 overflow-x-auto pb-1">{[[undefined, "Toutes"], ...Object.entries(labels)] .map(([value, label]) => <a key={value ?? "all"} href={value ? `/admin/orders?status=${value}` : "/admin/orders"} className={`shrink-0 rounded-full px-3 py-2 text-sm font-medium ${validStatus === value || (!value && !validStatus) ? "bg-zinc-950 text-white" : "border bg-white hover:bg-zinc-50"}`}>{label}</a>)}</div>{list.length ? <div className="space-y-4">{list.map((order) => <article key={order.id} className="rounded-xl border bg-white p-4 sm:p-5"><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h2 className="font-semibold">Commande #{order.id.slice(0, 8).toUpperCase()}</h2><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${colors[order.status]}`}>{labels[order.status]}</span></div><p className="mt-1 text-sm text-zinc-500">{new Intl.DateTimeFormat("fr-SN", { dateStyle: "medium", timeStyle: "short" }).format(order.createdAt)}</p></div><p className="text-xl font-bold">FCFA {Number(order.total).toLocaleString("fr-FR")}</p></div><div className="mt-5 grid gap-5 border-t pt-5 lg:grid-cols-[minmax(0,1fr)_300px]"><div><h3 className="text-sm font-semibold">Articles</h3><ul className="mt-2 space-y-2">{order.items.map((item) => <li key={item.id} className="flex justify-between gap-3 text-sm"><span>{item.productName}{item.variantName ? ` - ${item.variantName}` : ""} x {item.quantity}</span><strong className="shrink-0">FCFA {(Number(item.unitPrice) * item.quantity).toLocaleString("fr-FR")}</strong></li>)}</ul></div><div className="space-y-3 rounded-lg bg-zinc-50 p-4 text-sm"><p className="font-semibold">Informations client</p><dl className="space-y-2"><div><dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">Nom</dt><dd>{order.customerName || "Non renseigne"}</dd></div><div><dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">Telephone</dt><dd className="mt-1 flex flex-wrap gap-2"><a className="font-semibold text-zinc-950 hover:underline" href={`tel:${order.customerPhone?.replace(/[^+\d]/g, "")}`}>{order.customerPhone || "Non renseigne"}</a>{order.customerPhone && <a className="inline-flex items-center gap-1 text-emerald-700 hover:underline" href={`https://wa.me/${order.customerPhone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer"><Phone size={14}/>WhatsApp</a>}</dd></div><div><dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">Adresse</dt><dd className="mt-1 whitespace-pre-line text-zinc-700">{order.customerAddress || "Non renseignee"}</dd></div></dl></div></div><form action={updateOrderStatus} className="mt-5 flex flex-col gap-2 border-t pt-4 sm:flex-row sm:items-center"><input type="hidden" name="id" value={order.id}/><label className="text-sm font-medium" htmlFor={`status-${order.id}`}>Statut</label><select id={`status-${order.id}`} name="status" defaultValue={order.status} className="rounded-lg border bg-white px-3 py-2 text-sm"><option value="PENDING_WHATSAPP">A confirmer sur WhatsApp</option><option value="CONFIRMED">Confirmee</option><option value="FULFILLED">Livree</option><option value="CANCELLED">Annulee</option></select><button className="inline-flex items-center justify-center gap-2 rounded-lg bg-zinc-950 px-4 py-2 text-sm font-medium text-white"><PackageCheck size={16}/>Mettre a jour</button></form></article>)}</div> : <div className="rounded-xl border border-dashed p-10 text-center"><ClipboardList className="mx-auto text-zinc-400" size={32}/><h2 className="mt-3 font-semibold">Aucune commande</h2><p className="mt-1 text-sm text-zinc-500">Les commandes creees avant la redirection WhatsApp apparaitront ici.</p></div>}</main>;
}
