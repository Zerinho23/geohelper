"use client";
import { useState } from "react";
import ScreenshotViewer from "./ScreenshotViewer";
const shots=[{src:"/paris.png",label:"Vista normal"},{src:"/edit-mode.png",label:"Modo edición"}];
export default function HeroScreenshot(){
 const [selected,setSelected]=useState(0);
 return <section aria-label="Capturas de GeoHelper" className="relative mx-auto max-w-6xl px-6 pb-28">
 <div role="group" aria-label="Seleccionar captura" className="mb-5 flex justify-center gap-2">{shots.map((shot,index)=><button key={shot.src} type="button" aria-pressed={selected===index} onClick={()=>setSelected(index)} className={"rounded-full border px-4 py-2 text-sm transition "+(selected===index?"border-blue-500/40 bg-blue-500/15 text-blue-300":"border-white/10 text-zinc-400 hover:text-white")}>{shot.label}</button>)}</div>
 <ScreenshotViewer src={shots[selected].src} label={shots[selected].label} priority/>
 <p className="mt-4 text-center text-xs leading-relaxed text-zinc-400">Imágenes de referencia. La apariencia puede variar según la versión y tu configuración.</p>
 </section>;
}
