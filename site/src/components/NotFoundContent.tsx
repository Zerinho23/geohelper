import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Github } from "lucide-react";

import { EXTERNAL_LINK_PROPS, GITHUB_URL } from "../links";

export default function NotFoundContent() {
  return (
    <main className="min-h-dvh bg-zinc-950 text-zinc-100">
      <div className="grid min-h-dvh place-items-center px-6">
        <section className="w-full max-w-md text-center">
          <Image src="/logo.png" width={48} height={56} alt="" className="mx-auto mb-6 h-14 w-auto" />
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-blue-400">
            404
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            Página no encontrada
          </h1>
          <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-zinc-500">
            La página que buscas no existe o ha cambiado de dirección.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-5 py-3 font-semibold text-white transition hover:bg-blue-400"
            >
              <ArrowLeft className="size-4" />
              Volver al inicio
            </Link>
            <a
              href={GITHUB_URL}
              {...EXTERNAL_LINK_PROPS}
              className="inline-flex items-center gap-2 rounded-lg border border-white/[0.08] px-5 py-3 text-zinc-300 transition hover:border-white/[0.15] hover:text-white"
            >
              <Github className="size-4" />
              GitHub
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
