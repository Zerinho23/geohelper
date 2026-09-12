import { Info } from "lucide-react"
import { invoke } from "@tauri-apps/api/core"
import toast from "react-hot-toast"
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
        <button
          className="mt-3 text-sm text-blue-400"
          onClick={() => {
            void invoke("logout_account").catch(() => toast.error("No se pudo cerrar la sesión."))
          }}
        >
          Cerrar sesión
        </button>
      </div>
    </Group>
  )
}
