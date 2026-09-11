import { Github } from "lucide-react";
import { EXTERNAL_LINK_PROPS, GITHUB_URL } from "../links";

export default function DownloadButton() {
  return (
    <div className="flex w-full flex-col items-center gap-4 text-center">
      <a
        href={GITHUB_URL}
        {...EXTERNAL_LINK_PROPS}
        className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-xl bg-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/15 transition hover:bg-blue-400 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-400"
      >
        <Github aria-hidden="true" className="size-5 shrink-0" />
        <span>Mi perfil de GitHub</span>
      </a>
      <p className="max-w-sm text-sm leading-relaxed text-zinc-500">
        Las actualizaciones se distribuyen manualmente por Discord.
      </p>
    </div>
  );
}
