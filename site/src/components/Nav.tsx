import Image from "next/image";
import { EXTERNAL_LINK_PROPS, GITHUB_URL, DISCORD_URL } from "../links";
import NavMobileMenu from "./NavMobileMenu";
import StickyHeader from "./StickyHeader";

export default function Nav() {
  return (
    <StickyHeader>
      <header className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#top" className="flex items-center gap-2.5">
          <Image src="/logo.png" width={32} height={36} alt="" className="h-9 w-auto object-contain" />
          <span className="text-[15px] font-semibold tracking-tight text-zinc-100">GeoHelper</span>
        </a>

        <nav className="hidden items-center gap-1 text-sm md:flex">
          <a
            href="#features"
            className="rounded-md px-3 py-1.5 text-zinc-400 transition hover:text-zinc-200"
          >
            Características
          </a>
          <a
            href="#customize"
            className="rounded-md px-3 py-1.5 text-zinc-400 transition hover:text-zinc-200"
          >
            Personalizar
          </a>
          <a
            href="#get-started"
            className="rounded-md px-3 py-1.5 text-zinc-400 transition hover:text-zinc-200"
          >
            Cómo empezar
          </a>
          <a
            href={GITHUB_URL}
            {...EXTERNAL_LINK_PROPS}
            className="rounded-md px-3 py-1.5 text-zinc-400 transition hover:text-zinc-200"
          >
            GitHub
          </a>
          <a
            href={DISCORD_URL}
            {...EXTERNAL_LINK_PROPS}
            className="ml-2 inline-flex items-center gap-2 rounded-md bg-blue-500 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-blue-400"
          >
            Discord
          </a>
        </nav>

        <NavMobileMenu />
      </header>
    </StickyHeader>
  );
}
