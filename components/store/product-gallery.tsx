"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";

type ProductImage = { url: string; alt: string };

export function ProductGallery({ images, name }: { images: ProductImage[]; name: string }) {
  const [active, setActive] = useState(0);
  const rail = useRef<HTMLDivElement>(null);

  const goTo = (index: number) => {
    const next = Math.max(0, Math.min(index, images.length - 1));
    rail.current?.children[next]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
    setActive(next);
  };

  if (!images.length) return <div className="grid aspect-square place-items-center rounded-xl bg-zinc-100 text-sm text-zinc-500">Image bientot disponible</div>;

  return <section aria-label={`Galerie de ${name}`} className="space-y-3">
    <div className="relative">
      <div ref={rail} onScroll={(event) => { const width = event.currentTarget.clientWidth; if (width) setActive(Math.round(event.currentTarget.scrollLeft / width)); }} className="flex aspect-square snap-x snap-mandatory overflow-x-auto scroll-smooth rounded-xl bg-zinc-100 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {images.map((image, index) => <figure key={`${image.url}-${index}`} className="h-full w-full shrink-0 snap-start"><img src={image.url} alt={image.alt || `${name} - photo ${index + 1}`} className="h-full w-full object-cover" /></figure>)}
      </div>
      {images.length > 1 && <><button type="button" onClick={() => goTo(active - 1)} disabled={active === 0} aria-label="Image precedente" className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-sm transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"><ChevronLeft size={20} /></button><button type="button" onClick={() => goTo(active + 1)} disabled={active === images.length - 1} aria-label="Image suivante" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-sm transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"><ChevronRight size={20} /></button></>}
    </div>
    {images.length > 1 && <div className="flex items-center justify-center gap-1.5" aria-label="Navigation de la galerie">{images.map((image, index) => <button key={`${image.url}-dot-${index}`} type="button" onClick={() => goTo(index)} aria-label={`Voir l'image ${index + 1}`} aria-current={active === index} className={`h-2 rounded-full transition-all ${active === index ? "w-5 bg-zinc-950" : "w-2 bg-zinc-300 hover:bg-zinc-500"}`} />)}</div>}
    {images.length > 1 && <p className="text-center text-xs text-zinc-500">Faites glisser les images horizontalement</p>}
  </section>;
}
