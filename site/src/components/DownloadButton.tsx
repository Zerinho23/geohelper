import { MessageCircle, Github } from "lucide-react";
import { DISCORD_URL, GITHUB_URL } from "../links";
export default function DownloadButton() {
  return <div className="flex w-full flex-col items-center gap-4 text-center">
    <a href={DISCORD_URL} className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/15 transition hover:bg-blue-500"><MessageCircle aria-hidden="true" className="size-5 shrink-0" />Obtener GeoHelper en Discord</a>
    <p className="max-w-sm text-sm leading-relaxed text-zinc-400">Las versiones y actualizaciones se distribuyen manualmente por Discord.</p>
    <a href={GITHUB_URL} className="inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"><Github aria-hidden="true" className="size-4" />Mi perfil de GitHub</a>
  </div>;
}
