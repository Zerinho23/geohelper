import type { Update } from "@tauri-apps/plugin-updater"

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
  // Updates are distributed manually through Discord.
  return { ok: true, info: null, handle: null }
}
