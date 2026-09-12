import type { Update } from "@tauri-apps/plugin-updater"
import { check } from "@tauri-apps/plugin-updater"

export type UpdateInfo = {
  latest: string
  publishedAt: string
  url: string
  hasUpdate: boolean
  checkedAt: number
}

export type UpdateCheckResult =
  | { ok: true; info: UpdateInfo | null; handle: Update | null }
  | { ok: false; error: string }

export async function checkForUpdate(): Promise<UpdateCheckResult> {
  try {
    const update = await check()
    if (!update) return { ok: true, info: null, handle: null }

    return {
      ok: true,
      info: {
        latest: update.version,
        publishedAt: update.date ?? "",
        url: update.body ?? "",
        hasUpdate: true,
        checkedAt: Date.now(),
      },
      handle: update,
    }
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}
