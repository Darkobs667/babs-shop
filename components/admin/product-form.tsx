"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Save } from "lucide-react";
import { saveProduct } from "@/app/admin/actions";
import { ProductImageUpload } from "./product-image-upload";

type Variant = { name: string; sku: string; price: number | null; stock: number };
type ProductFormProps = { product?: { id: string; name: string; slug: string; description: string; price: string; categoryId: string | null; published: number; featured: number; images: { url: string }[]; variants: { name: string; sku: string | null; price: string | null; stock: number }[] }; categories: { id: string; name: string }[] };

const slugify = (value: string) => value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [images, setImages] = useState(product?.images.map(({ url }) => url) ?? []);
  const [variants, setVariants] = useState<Variant[]>(product?.variants.map((variant) => ({ ...variant, sku: variant.sku ?? "", price: variant.price === null ? null : Number(variant.price) })) ?? []);
  const [error, setError] = useState("");
  const title = useMemo(() => product ? "Modifier le produit" : "Nouveau produit", [product]);

  const updateVariant = (index: number, patch: Partial<Variant>) => setVariants((items) => items.map((item, i) => i === index ? { ...item, ...patch } : item));
  const submit = (formData: FormData) => {
    setError("");
    const price = Number(formData.get("price"));
    startTransition(async () => {
      try {
        const saved = await saveProduct({ id: product?.id, name, slug, description: String(formData.get("description") ?? ""), price, categoryId: String(formData.get("categoryId") || "") || null, categoryName: String(formData.get("categoryName") || "").trim() || undefined, published: formData.get("published") === "on", featured: formData.get("featured") === "on", imageUrls: images, variants });
        router.push(`/admin/products/${saved.id}/edit`);
        router.refresh();
      } catch (cause) { setError(cause instanceof Error ? cause.message : "Impossible d’enregistrer le produit."); }
    });
  };

  return <main className="mx-auto max-w-5xl p-4 sm:p-6 lg:p-8"><div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-medium text-zinc-500">Administration / Produits</p><h1 className="text-2xl font-bold sm:text-3xl">{title}</h1></div><button form="product-form" disabled={pending} className="inline-flex items-center justify-center gap-2 rounded-lg bg-zinc-950 px-4 py-2.5 font-medium text-white disabled:opacity-60"><Save size={18} />{pending ? "Enregistrement…" : "Enregistrer"}</button></div>
    <form id="product-form" action={submit} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]"><section className="space-y-6"><fieldset className="space-y-4 rounded-xl border p-4 sm:p-6"><legend className="px-1 text-lg font-semibold">Informations</legend><label className="block text-sm font-medium">Nom<input required value={name} onChange={(event) => { setName(event.target.value); if (!product) setSlug(slugify(event.target.value)); }} className="mt-1.5 w-full rounded-lg border px-3 py-2.5" /></label><label className="block text-sm font-medium">Lien du produit (slug)<input required value={slug} onChange={(event) => setSlug(slugify(event.target.value))} pattern="[a-z0-9]+(?:-[a-z0-9]+)*" className="mt-1.5 w-full rounded-lg border px-3 py-2.5" /></label><label className="block text-sm font-medium">Description<textarea name="description" defaultValue={product?.description} rows={6} className="mt-1.5 w-full resize-y rounded-lg border px-3 py-2.5" /></label></fieldset>
      <fieldset className="space-y-4 rounded-xl border p-4 sm:p-6"><legend className="px-1 text-lg font-semibold">Variantes et stock</legend><p className="text-sm text-zinc-500">Sans variante, le prix principal est utilisé. Ajoute une variante pour chaque taille, couleur ou format.</p>{variants.map((variant, index) => <div key={index} className="grid gap-3 rounded-lg bg-zinc-50 p-3 sm:grid-cols-2"><input required value={variant.name} onChange={(event) => updateVariant(index, { name: event.target.value })} placeholder="Ex. Noir / M" className="rounded-lg border bg-white px-3 py-2" /><input value={variant.sku} onChange={(event) => updateVariant(index, { sku: event.target.value })} placeholder="SKU (facultatif)" className="rounded-lg border bg-white px-3 py-2" /><input type="number" min="0" step="1" value={variant.stock} onChange={(event) => updateVariant(index, { stock: Number(event.target.value) })} placeholder="Stock" className="rounded-lg border bg-white px-3 py-2" /><input type="number" min="0" step="1" value={variant.price ?? ""} onChange={(event) => updateVariant(index, { price: event.target.value === "" ? null : Number(event.target.value) })} placeholder="Prix spécifique (FCFA)" className="rounded-lg border bg-white px-3 py-2" /><button type="button" onClick={() => setVariants((items) => items.filter((_, i) => i !== index))} className="justify-self-start text-sm font-medium text-red-700">Supprimer</button></div>)}<button type="button" onClick={() => setVariants((items) => [...items, { name: "", sku: "", price: null, stock: 0 }])} className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium"><Plus size={16} />Ajouter une variante</button></fieldset>
      <fieldset className="space-y-3 rounded-xl border p-4 sm:p-6"><legend className="px-1 text-lg font-semibold">Images</legend><ProductImageUpload value={images} onChange={setImages} /></fieldset></section>
      <aside className="space-y-6"><fieldset className="space-y-4 rounded-xl border p-4 sm:p-6 lg:sticky lg:top-6"><legend className="px-1 text-lg font-semibold">Prix et catégorie</legend><label className="block text-sm font-medium">Prix de base (FCFA)<input required name="price" type="number" min="0" step="1" defaultValue={product?.price} className="mt-1.5 w-full rounded-lg border px-3 py-2.5" /></label><label className="flex items-center gap-3 rounded-lg bg-zinc-50 p-3 text-sm font-medium"><input name="published" type="checkbox" defaultChecked={Boolean(product?.published)} className="h-4 w-4" />Publier dans le catalogue</label><label className="flex items-center gap-3 rounded-lg bg-zinc-50 p-3 text-sm font-medium"><input name="featured" type="checkbox" defaultChecked={Boolean(product?.featured)} className="h-4 w-4" />Mettre à la une sur l’accueil</label><label className="block text-sm font-medium">Catégorie existante<select name="categoryId" defaultValue={product?.categoryId ?? ""} className="mt-1.5 w-full rounded-lg border bg-white px-3 py-2.5"><option value="">Aucune catégorie</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label><label className="block text-sm font-medium">Ou nouvelle catégorie<input name="categoryName" placeholder="Ex. Robes" className="mt-1.5 w-full rounded-lg border px-3 py-2.5" /></label><p className="text-xs leading-5 text-zinc-500">Une nouvelle catégorie remplace la sélection existante.</p>{error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}</fieldset></aside></form></main>;
}
