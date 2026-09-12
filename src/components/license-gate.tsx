import { useEffect, useState, type ReactNode } from "react"
import { invoke } from "@tauri-apps/api/core"
import { listen } from "@tauri-apps/api/event"
import { openUrl } from "@tauri-apps/plugin-opener"
import { KeyRound } from "lucide-react"
import { DISCORD_URL, GITHUB_URL } from "@/lib/links"

export function LicenseGate({ children }: { children: ReactNode }) {
  const [active, setActive] = useState(false)
  const [checking, setChecking] = useState(true)
  const [busy, setBusy] = useState(false)
  const [key, setKey] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    let disposed = false
    const unlisten = listen("auth-expired", () => {
      setActive(false)
      setError("La sesión terminó. Comprueba tu conexión y vuelve a activar la licencia.")
    })
    void invoke<boolean>("auth_status").then(value => {
      if (!disposed) setActive(value)
    }).catch(() => {
      if (!disposed) setError("No se pudo comprobar la licencia. Reinicia la aplicación.")
    }).finally(() => { if (!disposed) setChecking(false) })
    return () => { disposed = true; void unlisten.then(stop => stop()) }
  }, [])

  if (active) return children
  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-6 text-foreground">
      <section className="w-full max-w-md rounded-2xl border border-blue-500/25 bg-blue-500/5 p-8 shadow-xl backdrop-blur-md">
        <KeyRound className="mb-5 size-9 text-blue-500" />
        <h1 className="text-2xl font-semibold">Activa GeoHelper</h1>
        <p className="mt-3 text-sm text-muted-foreground">Introduce tu licencia para acceder a la aplicación.</p>
        <form className="mt-6 space-y-4" onSubmit={async event => {
          event.preventDefault()
          if (busy || checking) return
          setBusy(true); setError("")
          try {
            await invoke("activate_license", { key: key.trim() })
            setKey(""); setActive(true)
          } catch (err) { setError(typeof err === "string" ? err : "No se pudo activar la licencia.") }
          finally { setBusy(false) }
        }}>
          <label className="block text-sm" htmlFor="license">Clave de licencia</label>
          <input id="license" type="password" autoComplete="off" spellCheck={false} required maxLength={256}
            value={key} onChange={event => setKey(event.target.value)} disabled={busy || checking}
            className="w-full rounded-lg border border-blue-500/30 bg-background px-3 py-3 outline-none focus:ring-2 focus:ring-blue-500" placeholder="Tu clave de activación" />
          {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
          <button disabled={checking || busy || !key.trim()} className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-500 disabled:opacity-50">
            {checking ? "Comprobando…" : busy ? "Validando licencia…" : "Activar y entrar"}
          </button>
        </form>
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">Requiere conexión a Internet. La licencia se comprueba con KeyAuth y el identificador de tu usuario de Windows. La clave no se guarda en este equipo.</p>
        <div className="mt-6 flex justify-between text-sm text-blue-500">
          <button onClick={() => void openUrl(DISCORD_URL)}>Obtener licencia en Discord</button>
          <button onClick={() => void openUrl(GITHUB_URL)}>Mi GitHub</button>
        </div>
      </section>
    </main>
  )
}
