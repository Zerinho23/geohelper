import { useEffect, useState } from "react"
import { invoke } from "@tauri-apps/api/core"
import { listen } from "@tauri-apps/api/event"
import { Video } from "lucide-react"
import toast from "react-hot-toast"

type Mode = { enabled: boolean }
export function StreamerMode() {
  const [enabled, setEnabled] = useState(false)
  const [busy, setBusy] = useState(true)
  useEffect(() => {
    let disposed = false
    void invoke<Mode>("streamer_status")
      .then((mode) => {
        if (!disposed) setEnabled(mode.enabled)
      })
      .catch(() => toast.error("No se pudo consultar el modo streamer."))
      .finally(() => {
        if (!disposed) setBusy(false)
      })
    const stop = listen<Mode>("streamer-changed", (e) => setEnabled(e.payload.enabled))
    return () => {
      disposed = true
      void stop.then((fn) => fn()).catch(() => {})
    }
  }, [])
  async function toggle() {
    if (busy) return
    setBusy(true)
    try {
      const mode = await invoke<Mode>("set_streamer_mode", { enabled: !enabled })
      setEnabled(mode.enabled)
      toast.success(mode.enabled ? "Modo streamer activado" : "Modo streamer desactivado")
    } catch {
      toast.error("No se pudo cambiar el modo streamer. Inténtalo de nuevo.")
    } finally {
      setBusy(false)
    }
  }
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      aria-label="Modo streamer"
      disabled={busy}
      className="stream-toggle stream-switch"
      title="Mantiene GeoHelper visible para ti y lo excluye de capturas compatibles. Comprueba la vista previa de tu grabador."
      onClick={() => void toggle()}
    >
      <Video size={15} /> Streamer
      <span className="stream-switch-track" aria-hidden="true">
        <span />
      </span>
      <span className="sr-only">{enabled ? "Activado" : "Desactivado"}</span>
    </button>
  )
}
