import { StreamerMode } from "@/components/streamer-mode"
import { MessageCircle } from "lucide-react"
import { useState } from "react"
import { ArrowLeft } from "lucide-react"
import { openUrl } from "@tauri-apps/plugin-opener"

import { AboutSection } from "@/components/settings/about-section"
import { AccountSection } from "@/components/settings/account-section"
import { HistorySection } from "@/components/settings/history-section"
import { AppearanceSection } from "@/components/settings/appearance-section"
import { Divider, SocialIcon } from "@/components/settings/settings-primitives"
import { SourcesSection } from "@/components/settings/sources-section"
import { GithubIcon } from "@/components/brand-icons"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useGoogleApiKeyValidation } from "@/hooks/use-google-api-key-validation"
import { GITHUB_URL, DISCORD_URL } from "@/lib/links"
import { useDisplayStore } from "@/lib/display-store"
import { useStore } from "@/lib/store"
import { useT } from "@/lib/i18n"

export function SettingsSidebar() {
  const t = useT()
  const close = useStore((s) => s.closeSettings)
  const sidebarWidth = useDisplayStore((s) => s.sidebarWidth)

  const mapProvider = useStore((s) => s.mapProvider)
  const setMapProvider = useStore((s) => s.setMapProvider)
  const geocodeProvider = useStore((s) => s.geocodeProvider)
  const setGeocodeProvider = useStore((s) => s.setGeocodeProvider)

  const apiKey = useStore((s) => s.googleApiKey)
  const setApiKey = useStore((s) => s.setGoogleApiKey)
  const alwaysOnTop = useStore((s) => s.alwaysOnTop)
  const setAlwaysOnTop = useStore((s) => s.setAlwaysOnTop)

  const [reveal, setReveal] = useState(false)
  const { validation: keyValidation, validate: runKeyValidation } =
    useGoogleApiKeyValidation(apiKey)

  const hasKey = apiKey.trim().length > 0

  function updateKey(value: string) {
    const trimmed = value.trim()
    setApiKey(trimmed)
    if (!trimmed) {
      if (mapProvider.startsWith("google-")) setMapProvider("osm")
      if (geocodeProvider === "google") setGeocodeProvider("nominatim")
    }
  }

  return (
    <aside
      className="flex h-full shrink-0 flex-col overflow-hidden border-r border-sidebar-border bg-sidebar"
      style={{ width: sidebarWidth }}
    >
      <header className="flex items-center gap-2 border-b border-white/[0.04] p-3.5">
        <Button size="icon" variant="ghost" className="size-7" onClick={close}>
          <ArrowLeft className="size-4" />
        </Button>
        <div className="text-[15px] font-semibold tracking-tight">{t("settings.title")}</div>
      </header>

      <ScrollArea className="flex-1">
        <div className="p-4">
          <StreamerMode />
        </div>
        <AccountSection />
        <Divider />
        <HistorySection />
        <Divider />
        <SourcesSection
          mapProvider={mapProvider}
          geocodeProvider={geocodeProvider}
          hasKey={hasKey}
          draft={apiKey}
          reveal={reveal}
          keyValidation={keyValidation}
          setMapProvider={setMapProvider}
          setGeocodeProvider={setGeocodeProvider}
          setReveal={setReveal}
          updateKey={updateKey}
          runKeyValidation={runKeyValidation}
        />
        <Divider />
        <AppearanceSection alwaysOnTop={alwaysOnTop} setAlwaysOnTop={setAlwaysOnTop} />
        <Divider />
        <AboutSection />
      </ScrollArea>

      <footer className="flex items-center justify-center gap-1 border-t border-white/[0.04] px-4 py-3.5">
        <SocialIcon title="GitHub" onClick={() => openUrl(GITHUB_URL)}>
          <GithubIcon className="size-4" />
        </SocialIcon>
        <SocialIcon title="Discord" onClick={() => openUrl(DISCORD_URL)}>
          <MessageCircle className="size-4" />
        </SocialIcon>
      </footer>
    </aside>
  )
}
