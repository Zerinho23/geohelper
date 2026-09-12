import { useEffect, useState } from "react"
import { invoke } from "@tauri-apps/api/core"
import { Activity, RefreshCw, ShieldCheck, UserRound } from "lucide-react"
import { Group, InfoRow } from "@/components/settings/settings-primitives"
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store"
import { connectionDetails, connectionTone } from "@/lib/connection-status"
import { ipc } from "@/lib/ipc"

type AuthProfile = { username: string; subscription: string; expiry: number }

export function AccountSection() {
  const [profile, setProfile] = useState<AuthProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const conn = useStore((s) => s.conn)
  const sticky = useStore((s) => s.lastDisconnectReason)
  const tone = connectionTone(conn, sticky)
  const details = connectionDetails(conn, sticky)

  useEffect(() => {
    void invoke<AuthProfile | null>("auth_profile").then(setProfile).finally(() => setLoading(false))
  }, [])

  const expiry = profile ? new Date(profile.expiry * 1000).toLocaleDateString("es-ES") : "—"
  const toneClass = tone.tone === "ok" ? "text-emerald-400" : tone.tone === "bad" ? "text-red-300" : "text-amber-300"
  return (
    <Group icon={<UserRound className="size-3.5" />} title="Tu cuenta">
      <div className="space-y-3">
        <div className="flex items-center gap-3 rounded-xl border border-blue-400/15 bg-blue-500/[0.06] p-3">
          <div className="flex size-9 items-center justify-center rounded-full bg-blue-500/15 text-blue-300"><UserRound className="size-4" /></div>
          <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{loading ? "Cargando cuenta…" : profile?.username ?? "Cuenta activa"}</p><p className="text-[10px] text-muted-foreground">{profile?.subscription ?? "GeoHelper"}</p></div>
          <ShieldCheck className="size-4 text-emerald-400" />
        </div>
        <div className="space-y-1.5 rounded-lg bg-white/[0.025] p-3">
          <InfoRow label="Licencia válida hasta" value={expiry} />
          <InfoRow label="Conexión" value={<span className={toneClass}>{tone.title}</span>} />
        </div>
        <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
          <div className="flex items-center gap-2 text-[11px] font-medium"><Activity className={`size-3.5 ${toneClass}`} /> Diagnóstico de conexión</div>
          <p className="mt-1.5 text-[10px] leading-relaxed text-muted-foreground">{details.body || "GeoHelper está listo para detectar GeoGuessr."}</p>
          <div className="mt-2 flex gap-2 text-[10px] text-muted-foreground"><span className={conn.kind === "connected" ? "text-emerald-400" : "text-amber-300"}>●</span> Puerto CDP 34788 <span className="ml-auto">{conn.kind === "connected" ? "Detectado" : "Esperando"}</span></div>
          <Button variant="outline" size="sm" className="mt-3 h-7 w-full gap-1.5 text-xs" onClick={() => ipc.reconnect()}><RefreshCw className="size-3" /> Volver a comprobar</Button>
        </div>
      </div>
    </Group>
  )
}
