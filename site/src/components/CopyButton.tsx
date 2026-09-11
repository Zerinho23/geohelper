"use client";
import { useState } from "react";
import { Copy, Check } from "lucide-react";
export default function CopyButton({text}:{text:string}){
 const [status,setStatus]=useState("");
 async function copy(){try{await navigator.clipboard.writeText(text);setStatus("Copiado");}catch{setStatus("No se pudo copiar. Selecciona el texto y cópialo manualmente.");}}
 return <span className="inline-flex flex-col items-end gap-1"><button type="button" onClick={copy} aria-label="Copiar opciones de lanzamiento" title="Copiar opciones de lanzamiento" className="shrink-0 rounded border border-white/10 p-2 text-zinc-300 hover:text-white">{status==="Copiado"?<Check className="size-4 text-blue-400"/>:<Copy className="size-4"/>}</button><span role="status" className="max-w-40 text-xs text-zinc-400">{status}</span></span>;
}
