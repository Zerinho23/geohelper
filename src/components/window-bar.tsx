import { Minus, Square, X } from "lucide-react"
import { getCurrentWindow } from "@tauri-apps/api/window"
import type { PointerEvent } from "react"

export function WindowBar() {
  const window = getCurrentWindow()

  function startDrag(event: PointerEvent<HTMLDivElement>) {
    if (event.button === 0) void window.startDragging()
  }

  return (
    <div className="window-bar" data-tauri-drag-region onPointerDown={startDrag}>
      <div className="window-bar__brand" data-tauri-drag-region onPointerDown={startDrag}>
        <span className="window-bar__dot" />
        <span>GeoHelper</span>
      </div>
      <div className="window-bar__actions">
        <button
          type="button"
          aria-label="Minimizar"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={() => void window.minimize()}
        >
          <Minus className="size-3.5" />
        </button>
        <button
          type="button"
          aria-label="Maximizar"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={() => void window.toggleMaximize()}
        >
          <Square className="size-3" />
        </button>
        <button
          type="button"
          aria-label="Cerrar"
          className="window-bar__close"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={() => void window.close()}
        >
          <X className="size-3.5" />
        </button>
      </div>
    </div>
  )
}
