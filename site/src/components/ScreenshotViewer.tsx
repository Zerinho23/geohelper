"use client";
import Image from "next/image";
import { useRef } from "react";
import { X, ZoomIn } from "lucide-react";
export default function ScreenshotViewer({src,label,priority=false}:{src:string;label:string;priority?:boolean}) {
 const dialog=useRef<HTMLDialogElement>(null);
 return <>
 <button type="button" onClick={()=>dialog.current?.showModal()} aria-label={"Ampliar "+label.toLowerCase()} className="group relative block w-full overflow-hidden rounded-xl border border-white/10 bg-zinc-950">
 <Image src={src} alt={label} width={1568} height={1004} priority={priority} className="block h-auto w-full"/>
 <span className="absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-zinc-950/85 px-3 py-2 text-xs text-white backdrop-blur-md"><ZoomIn aria-hidden="true" className="size-4"/>Ampliar imagen</span>
 </button>
 <dialog ref={dialog} onClick={e=>{if(e.target===e.currentTarget)dialog.current?.close();}} aria-label={label} className="image-dialog m-auto max-h-[95dvh] w-[96vw] max-w-[1500px] rounded-2xl border border-white/15 bg-zinc-950 p-3 text-white shadow-2xl backdrop:bg-black/85 backdrop:backdrop-blur-md">
 <div className="mb-3 flex items-center justify-between gap-4"><p className="text-sm">{label}</p><button type="button" autoFocus onClick={()=>dialog.current?.close()} aria-label="Cerrar imagen" className="rounded-lg border border-white/15 p-2 hover:bg-white/10"><X className="size-5"/></button></div>
 <Image src={src} alt={label} width={1568} height={1004} className="max-h-[80dvh] w-full object-contain"/>
 <p className="mt-2 text-center text-xs text-zinc-400">Pulsa Esc o el botón de cierre para volver.</p>
 </dialog>
 </>;
}
