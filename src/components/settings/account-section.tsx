import { useEffect, useState } from "react"
import { invoke } from "@tauri-apps/api/core"
import { Activity, Clipboard, ExternalLink, RefreshCw, ShieldCheck, UserRound } from "lucide-react"
import { openUrl } from "@tauri-apps/plugin-opener"
import toast from "react-hot-toast"
import { Group, InfoRow } from "@/components/settings/settings-primitives"
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store"
import { connectionDetails, connectionTone } from "@/lib/connection-status"
import { ipc } from "@/lib/ipc"
import { DISCORD_URL } from "@/lib/links"

type AuthProfile = { username: string; subscription: string; expiry: number }

export function AccountSection() {
  const [profile, setProfile] = useState<AuthProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const conn = useStore((s) => s.conn)
  const sticky = useStore((s) => s.lastDisconnectReason)
  const tone = connectionTone(conn, sticky)
  const details = connectionDetails(conn, sticky)

  useEffect(() => {
    void invoke<AuthProfile | null>("auth_profile")
      .then(setProfile)
      .finally(() => setLoading(false))
  }, [])

  const expiry = profile ? new Date(profile.expiry * 1000).toLocaleDateString("es-ES") : "—"
  const copyDiagnosis = () => {
    const text = `GeoHelper\nCuenta: ${profile?.username ?? "desconocida"}\nConexión: ${tone.title}\nCDP: 34788 (${conn.kind})\nDetalle: ${details.body || "sin errores"}`
    void navigator.clipboard.writeText(text).then(() => toast.success("Diagnóstico copiado."))
  }
  const toneClass =
    tone.tone === "ok"
      ? "text-emerald-400"
      : tone.tone === "bad"
        ? "text-red-300"
        : "text-amber-300"
  return (
    <Group icon={<UserRound className="size-3.5" />} title="Tu cuenta">
      <div className="space-y-3">
        <div className="flex items-center gap-3 rounded-xl border border-blue-400/15 bg-blue-500/[0.06] p-3">
          <div className="flex size-9 items-center justify-center rounded-full bg-blue-500/15 text-blue-300">
            <UserRound className="size-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">
              {loading ? "Cargando cuenta…" : (profile?.username ?? "Cuenta activa")}
            </p>
            <p className="text-[10px] text-muted-foreground">
              {profile?.subscription ?? "GeoHelper"}
            </p>
          </div>
          <ShieldCheck className="size-4 text-emerald-400" />
        </div>
        <div className="space-y-1.5 rounded-lg bg-white/[0.025] p-3">
          <InfoRow label="Licencia válida hasta" value={expiry} />
          <InfoRow label="Conexión" value={<span className={toneClass}>{tone.title}</span>} />
        </div>
        <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
          <div className="flex items-center gap-2 text-[11px] font-medium">
            <Activity className={`size-3.5 ${toneClass}`} /> Diagnóstico de conexión
          </div>
          <p className="mt-1.5 text-[10px] leading-relaxed text-muted-foreground">
            {details.body || "GeoHelper está listo para detectar GeoGuessr."}
          </p>
          <div className="mt-2 flex gap-2 text-[10px] text-muted-foreground">
            <span className={conn.kind === "connected" ? "text-emerald-400" : "text-amber-300"}>
              ●
            </span>{" "}
            Puerto CDP 34788{" "}
            <span className="ml-auto">{conn.kind === "connected" ? "Detectado" : "Esperando"}</span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-7 gap-1.5 text-[10px]"
              onClick={() => ipc.reconnect()}
            >
              <RefreshCw className="size-3" /> Comprobar
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-7 gap-1.5 text-[10px]"
              onClick={copyDiagnosis}
            >
              <Clipboard className="size-3" /> Copiar informe
            </Button>
          </div>
        </div>
        <button
          onClick={() => void openUrl(DISCORD_URL)}
          className="flex w-full items-center justify-center gap-1.5 text-[11px] text-blue-400 hover:text-blue-300"
        >
          <ExternalLink className="size-3" /> Renovar licencia o pedir ayuda en Discord
        </button>
      </div>
    </Group>
  )
}
