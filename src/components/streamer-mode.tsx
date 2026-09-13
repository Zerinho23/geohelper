import { createPortal } from "react-dom"
import { useEffect, useState } from "react"
import { invoke } from "@tauri-apps/api/core"
import { listen } from "@tauri-apps/api/event"
import { Video, X } from "lucide-react"

type Mode = { enabled: boolean; automatic: boolean }
export function StreamerMode() {
  const [mode, setMode] = useState<Mode>({ enabled: false, automatic: false })
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(true)
  const [error, setError] = useState("")
  const [hidden, setHidden] = useState(false)
  useEffect(() => {
    void invoke<Mode>("streamer_status")
      .then(setMode)
      .catch(() => setError("No se pudo consultar la protección."))
      .finally(() => setBusy(false))
    const stop = listen<Mode>("streamer-changed", (e) => setMode(e.payload))
    return () => {
      void stop.then((fn) => fn())
    }
  }, [])
  async function update(next: Mode) {
    setBusy(true)
    setError("")
    try {
      setMode(await invoke<Mode>("set_streamer_mode", next))
    } catch {
      setError("No se pudo aplicar la protección. Vuelve a intentarlo.")
    } finally {
      setBusy(false)
    }
  }
  return (
    <>
      <button className="stream-toggle" onClick={() => setOpen(true)}>
        <Video size={15} /> Streamer {mode.enabled ? "ON" : "OFF"}
      </button>
      {open &&
        createPortal(
          <div className="stream-modal" role="dialog" aria-modal="true" aria-label="Modo streamer">
            <div className="stream-card">
              <button className="stream-close" aria-label="Cerrar" onClick={() => setOpen(false)}>
                <X />
              </button>
              <Video size={30} />
              <h2>Modo streamer</h2>
              <p>
                La aplicación sigue visible para ti mientras Windows la excluye de las capturas
                compatibles.
              </p>
              <label>
                <input
                  type="checkbox"
                  checked={mode.enabled}
                  disabled={busy}
                  onChange={(e) => void update({ ...mode, enabled: e.target.checked })}
                />{" "}
                Proteger de capturas
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={mode.automatic}
                  disabled={busy}
                  onChange={(e) => void update({ ...mode, automatic: e.target.checked })}
                />{" "}
                Activar al detectar OBS o Streamlabs abiertos
              </label>
              <p>
                La detección revisa si el programa está abierto. La protección permanece activa
                hasta que la desactives.
              </p>
              <button
                className="stream-toggle"
                onClick={() => {
                  setHidden(true)
                  setOpen(false)
                }}
              >
                Mostrar pantalla de privacidad
              </button>
              <p>
                Comprueba la vista previa antes de transmitir: algunos métodos de captura no admiten
                esta protección.
              </p>
              {error && <p role="alert">{error}</p>}
            </div>
          </div>,
          document.body
        )}
      {hidden &&
        createPortal(
          <div className="stream-modal privacy-screen">
            <Video size={48} />
            <h2>GeoHelper · Pantalla privada</h2>
            <p>Tu contenido está oculto.</p>
            <button className="stream-toggle" onClick={() => setHidden(false)}>
              Volver a la aplicación
            </button>
          </div>,
          document.body
        )}
    </>
  )
}
