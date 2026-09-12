import { useEffect, useMemo } from "react"
import L from "leaflet"
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet"

import { MAP_PROVIDERS } from "@/lib/map-providers"
import { useStore } from "@/lib/store"
import { useDisplayStore } from "@/lib/display-store"
import { GoogleMapView } from "./google-map-view"
import { useI18n } from "@/lib/i18n"

export function MapPanel() {
  const current = useStore((s) => s.current)
  const providerId = useStore((s) => s.mapProvider)
  const apiKey = useStore((s) => s.googleApiKey)
  const setMapProvider = useStore((s) => s.setMapProvider)
  const spanish = useI18n((s) => s.locale === "es")
  const provider = MAP_PROVIDERS[providerId] || MAP_PROVIDERS["carto-dark"]

  const markerColor = useStore((s) => s.markerColor)
  const markerBorderColor = useStore((s) => s.markerBorderColor)
  const markerSize = useStore((s) => s.markerSize)

  // Build the icon HTML once per relevant inputs. CSS for hover/transition
  // lives in index.css under .geohelper-marker so we don't inject a fresh
  // <style> tag with every render.
  const pinIcon = useMemo(() => {
    const borderWidth = Math.max(2, Math.round(markerSize / 8))
    return L.divIcon({
      className: "",
      iconSize: [markerSize, markerSize],
      iconAnchor: [markerSize / 2, markerSize / 2],
      html:
        `<div class="geohelper-marker" ` +
        `style="width:${markerSize}px;height:${markerSize}px;">` +
        `<div class="geohelper-marker__dot" ` +
        `style="background:${markerColor};border:${borderWidth}px solid ${markerBorderColor};"></div>` +
        `</div>`,
    })
  }, [markerSize, markerColor, markerBorderColor])

  return (
    <div className="relative flex-1 min-h-0">
      <div className="absolute right-4 top-4 z-[1000] rounded-xl border border-blue-400/20 bg-slate-950/85 p-2 shadow-xl backdrop-blur-md">
        <label className="flex items-center gap-3 text-xs text-slate-200">
          {spanish ? "Estilo del mapa" : "Map style"}
          <select
            aria-label={spanish ? "Estilo del mapa" : "Map style"}
            value={providerId}
            onChange={(event) => setMapProvider(event.target.value as keyof typeof MAP_PROVIDERS)}
            className="rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-white"
          >
            {Object.entries(MAP_PROVIDERS).map(([id, item]) => (
              <option key={id} value={id} disabled={item.kind === "google" && !apiKey.trim()}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      {provider.kind === "google" ? (
        <GoogleMapView
          apiKey={apiKey}
          mapTypeId={provider.mapTypeId}
          styles={provider.styles}
          center={current ? { lat: current.lat, lng: current.lng } : null}
        />
      ) : (
        <MapContainer
          center={[20, 0]}
          zoom={2}
          scrollWheelZoom
          worldCopyJump
          className="absolute inset-0"
          maxBounds={[
            [-85, -10000],
            [85, 10000],
          ]}
          maxBoundsViscosity={1.0}
        >
          <TileLayer
            key={providerId}
            url={provider.url}
            attribution={provider.attribution}
            maxZoom={provider.maxZoom}
            subdomains={provider.subdomains ?? "abc"}
          />
          {current && (
            <>
              <Marker position={[current.lat, current.lng]} icon={pinIcon} />
              <PanTo lat={current.lat} lng={current.lng} />
            </>
          )}
          <ResetMapWhenNoCoords active={!current} />
          <InvalidateMapSize />
        </MapContainer>
      )}
    </div>
  )
}

function PanTo({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap()

  useEffect(() => {
    // Project target coordinate to pixel space at current zoom level
    const targetPoint = map.project([lat, lng], map.getZoom())
    const halfHeight = map.getSize().y / 2

    // Project map boundaries (-85 to 85 degrees latitude) to pixel space
    const southWestPixel = map.project([-85, -180], map.getZoom())
    const northEastPixel = map.project([85, 180], map.getZoom())

    // Clamp Y-coordinate so map doesn't show areas beyond the poles
    const minY = northEastPixel.y + halfHeight
    const maxY = southWestPixel.y - halfHeight

    let clampedY = targetPoint.y
    if (minY < maxY) {
      clampedY = Math.max(minY, Math.min(maxY, targetPoint.y))
    }

    // Unproject back to lat/lng coordinates
    const clampedCenter = map.unproject([targetPoint.x, clampedY], map.getZoom())

    map.flyTo(clampedCenter, map.getZoom(), { animate: true, duration: 0.6 })
  }, [lat, lng, map])

  return null
}

/** Leaflet keeps the last panned viewport; snap back when coords clear (e.g. exit layout edit). */
function ResetMapWhenNoCoords({ active }: { active: boolean }) {
  const map = useMap()

  useEffect(() => {
    if (!active) return
    map.flyTo([20, 0], 2, { animate: true, duration: 0.45 })
  }, [active, map])

  return null
}

function InvalidateMapSize() {
  const map = useMap()
  const sidebarWidth = useDisplayStore((s) => s.sidebarWidth)
  const editing = useDisplayStore((s) => s.editing)
  const mapVisible = useDisplayStore((s) => s.mapVisible)
  const resizing = useDisplayStore((s) => s.resizing)

  useEffect(() => {
    if (resizing) return

    // 1. Invalidate size immediately for fast visual feedback
    map.invalidateSize({ animate: false })

    // 2. Invalidate size after layout transitions settle
    const timer = setTimeout(() => {
      map.invalidateSize({ animate: true })
    }, 400)

    return () => clearTimeout(timer)
  }, [sidebarWidth, editing, mapVisible, resizing, map])

  return null
}
