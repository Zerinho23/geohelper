import { Github } from "lucide-react";
import { EXTERNAL_LINK_PROPS, GITHUB_URL } from "../links";

export default function DownloadButton() {
  return (
    <div className="inline-flex flex-col items-center gap-2">
      <a href={GITHUB_URL} {...EXTERNAL_LINK_PROPS} className="inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-5 py-3 font-semibold text-white transition hover:bg-indigo-400">
        <Github className="size-[18px]" /> GitHub
      </a>
      <p className="text-sm text-zinc-400">Las actualizaciones se distribuyen manualmente por Discord.</p>
    </div>
  );
}
