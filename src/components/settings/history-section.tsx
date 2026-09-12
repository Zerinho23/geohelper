import { useMemo, useState } from "react"
import { Clipboard, Download, Search, Trash2 } from "lucide-react"
import toast from "react-hot-toast"
import { Group } from "@/components/settings/settings-primitives"
import { useStore } from "@/lib/store"
import { formatCoords } from "@/lib/coords"
import { ipc } from "@/lib/ipc"

export function HistorySection() {
  const history = useStore((s) => s.history)
  const copyFormat = useStore((s) => s.copyFormat)
  const [query, setQuery] = useState("")
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return history.slice().reverse().filter((round) => !q || `${round.coords.lat},${round.coords.lng}`.includes(q)).slice(0, 12)
  }, [history, query])
  const exportCsv = () => {
    if (!history.length) { toast.error("Todavía no hay coordenadas para exportar."); return }
    const csv = ["ronda,latitud,longitud,fuente,fecha", ...history.map((round) => `${round.index},${round.coords.lat},${round.coords.lng},${round.coords.source},${new Date(round.coords.timestamp).toISOString()}`)].join("\n")
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }))
    const anchor = document.createElement("a")
    anchor.href = url; anchor.download = "geohelper-historial.csv"; anchor.click(); URL.revokeObjectURL(url)
    toast.success("Historial exportado.")
  }
  return (
    <Group icon={<Clipboard className="size-3.5" />} title="Historial de coordenadas">
      <div className="space-y-2">
        <div className="flex items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.025] px-2.5 py-1.5"><Search className="size-3.5 text-muted-foreground" /><input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full bg-transparent text-xs outline-none" placeholder="Buscar latitud o longitud" /></div>
        <div className="max-h-36 space-y-1 overflow-auto">
          {visible.length ? visible.map((round) => <button key={`${round.index}-${round.coords.timestamp}`} className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-[10px] hover:bg-white/[0.05]" onClick={() => { void navigator.clipboard.writeText(formatCoords(round.coords, copyFormat)); toast.success("Coordenadas copiadas.") }}><span className="text-muted-foreground">#{round.index}</span><span className="font-mono">{round.coords.lat.toFixed(4)}, {round.coords.lng.toFixed(4)}</span><Clipboard className="size-3 text-muted-foreground" /></button>) : <p className="py-3 text-center text-[10px] text-muted-foreground">No hay resultados todavía.</p>}
        </div>
        <button onClick={exportCsv} className="flex w-full items-center justify-center gap-1.5 rounded-md border border-white/[0.08] py-1.5 text-xs text-muted-foreground hover:text-foreground"><Download className="size-3.5" /> Exportar CSV</button>
        <button disabled={!history.length} onClick={() => { void ipc.clearHistory().then(() => toast.success("Historial limpiado.")).catch(() => toast.error("No se pudo limpiar el historial.")) }} className="flex w-full items-center justify-center gap-1.5 py-1 text-[10px] text-muted-foreground hover:text-red-300 disabled:opacity-40"><Trash2 className="size-3" /> Limpiar historial</button>
      </div>
    </Group>
  )
}
