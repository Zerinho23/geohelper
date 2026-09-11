import { Info } from "lucide-react"
import { Group, InfoRow } from "./settings-primitives"
import { VERSION } from "@/lib/links"
import { useT } from "@/lib/i18n"

export function AboutSection() {
  const t = useT()
  return (
    <Group icon={<Info className="size-3.5" />} title={t("settings.about.title")}>
      <div className="space-y-2">
        <InfoRow label={t("settings.about.installed")} value={`v${VERSION}`} />
        <p className="text-xs text-muted-foreground">{t("settings.about.manualUpdates")}</p>
      </div>
    </Group>
  )
}
