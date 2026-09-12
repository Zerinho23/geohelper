import { Minus, Square, X } from "lucide-react"
import { getCurrentWindow } from "@tauri-apps/api/window"

export function WindowBar() {
  const window = getCurrentWindow()

  return (
    <div className="window-bar" data-tauri-drag-region>
      <div className="window-bar__brand" data-tauri-drag-region>
        <span className="window-bar__dot" />
        <span>GeoHelper</span>
      </div>
      <div className="window-bar__actions">
        <button type="button" aria-label="Minimizar" onClick={() => void window.minimize()}>
          <Minus className="size-3.5" />
        </button>
        <button type="button" aria-label="Maximizar" onClick={() => void window.toggleMaximize()}>
          <Square className="size-3" />
        </button>
        <button
          type="button"
          aria-label="Cerrar"
          className="window-bar__close"
          onClick={() => void window.close()}
        >
          <X className="size-3.5" />
        </button>
      </div>
    </div>
  )
}
