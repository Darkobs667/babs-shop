"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { UploadDropzone } from "@/components/uploadthing";

type Props = { value: string[]; onChange: (urls: string[]) => void };
export function ProductImageUpload({ value, onChange }: Props) {
  return <div className="space-y-3">
    <UploadDropzone endpoint="productImage" onClientUploadComplete={(files) => onChange([...value, ...files.map((file) => file.ufsUrl)])} onUploadError={(error) => window.alert(error.message)} />
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {value.map((url) => <div key={url} className="group relative aspect-square overflow-hidden rounded-md border">
        <Image src={url} alt="Aperçu produit" fill className="object-cover" sizes="(max-width: 640px) 50vw, 25vw" />
        <button type="button" aria-label="Supprimer l'image" onClick={() => onChange(value.filter((item) => item !== url))} className="absolute right-1 top-1 rounded-full bg-black/70 p-1 text-white"><X size={14} /></button>
      </div>)}
    </div>
  </div>;
}
