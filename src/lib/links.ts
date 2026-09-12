import packageJson from "../../package.json"

export const REPO = "Zerinho23/geohelper"
export const GITHUB_URL = "https://github.com/Zerinho23"
export const RELEASES_URL = `https://github.com/${REPO}/releases`
export const LATEST_RELEASE_URL = `${RELEASES_URL}/latest`
export const DISCORD_URL = "https://discord.gg/RBKzQvRQS7"
export const VERSION = packageJson.version

export function compareVersions(a: string, b: string): number {
  const an = a
    .replace(/^v/, "")
    .split(".")
    .map((n) => parseInt(n, 10) || 0)
  const bn = b
    .replace(/^v/, "")
    .split(".")
    .map((n) => parseInt(n, 10) || 0)
  const len = Math.max(an.length, bn.length)
  for (let i = 0; i < len; i++) {
    const av = an[i] ?? 0
    const bv = bn[i] ?? 0
    if (av !== bv) return av - bv
  }
  return 0
}

export function isVersionInstalled(changelogVersion: string): boolean {
  return compareVersions(changelogVersion, VERSION) <= 0
}
