"use client";
import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteProduct } from "@/app/admin/actions";
export function DeleteProductButton({ id }: { id: string }) { const [pending, startTransition] = useTransition(); const [error, setError] = useState(""); return <div>{error && <p className="mb-1 text-xs text-red-700">{error}</p>}<button disabled={pending} onClick={() => { if (!window.confirm("Supprimer définitivement ce produit ?")) return; startTransition(async () => { try { await deleteProduct(id); } catch { setError("Suppression impossible."); } }); }} className="inline-flex items-center gap-1.5 rounded-md p-2 text-red-700 hover:bg-red-50 disabled:opacity-50" aria-label="Supprimer le produit"><Trash2 size={17} />{pending ? "…" : "Supprimer"}</button></div>; }
