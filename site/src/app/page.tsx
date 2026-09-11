import Image from "next/image";
import ScreenshotViewer from "../components/ScreenshotViewer";
import {
  Box,
  ChevronDown,
  Code2,
  Download,
  KeyRound,
  Layout,
  MapPin,
  Palette,
  Shield,
  Terminal,
  Zap,
} from "lucide-react";

import { FAQ_ENTRIES } from "../faq";
import {
  EXTERNAL_LINK_PROPS,
  GITHUB_URL,
  DISCORD_URL,
} from "../links";
import Nav from "../components/Nav";
import DownloadButton from "../components/DownloadButton";
import HeroScreenshot from "../components/HeroScreenshot";
import CopyButton from "../components/CopyButton";
import Reveal from "../components/Reveal";


export default function Page() {
  return (
    <div className="relative overflow-x-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[800px] hero-glow" />
      <Nav />
      <Hero />
      <HeroScreenshot />
      <Features />
      <Customizer />
      <GetStarted />
      <Faq />
      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <Reveal className="relative z-30">
      <section
        id="top"
        className="relative mx-auto max-w-3xl px-6 pt-16 pb-12 text-center sm:pt-24"
      >
        <p className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">GeoGuessr en Steam · Práctica individual</p>

        <h1 className="text-[2.75rem] font-semibold leading-[1.08] tracking-tight text-zinc-100 sm:text-5xl md:text-6xl">
          Coordenadas en tiempo real para{" "}
          <span className="text-blue-400">GeoGuessr</span>.
        </h1>

        <p className="mx-auto mt-6 max-w-lg text-[17px] leading-relaxed text-zinc-400">
          Explora la ubicación de cada ronda con una aplicación de escritorio
          para GeoGuessr en Steam. Consulta coordenadas, lugares y mapas
          durante tus sesiones de práctica individual.
        </p>

        <div className="mt-10 flex justify-center">
          <DownloadButton />
        </div>

        <p className="mt-8 font-mono text-xs text-zinc-400">
          Para GeoGuessr en Steam · Práctica individual · Licencia MIT
        </p>
      </section>
    </Reveal>
  );
}

function Features() {
  const items: Array<{ title: string; body: string; icon: React.ReactNode }> = [
    {
      icon: <KeyRound className="size-[18px]" />,
      title: "Mapas para empezar",
      body: "Empieza con OpenStreetMap. Google Maps es opcional y requiere tu propia clave.",
    },
    {
      icon: <Zap className="size-[18px]" />,
      title: "En tu escritorio",
      body: "Una aplicación de escritorio construida con Tauri y Rust, con una interfaz que puedes personalizar.",
    },
    {
      icon: <Box className="size-[18px]" />,
      title: "Versiones disponibles",
      body: "Consulta en Discord los paquetes disponibles y los requisitos de cada versión para tu sistema.",
    },
    {
      icon: <MapPin className="size-[18px]" />,
      title: "Conoce cada ubicación",
      body: "País, bandera, región, barrio, carretera y código postal, cuando los datos están disponibles.",
    },
    {
      icon: <Shield className="size-[18px]" />,
      title: "Conexión con el juego",
      body: "Lee la información que expone el juego mediante su conexión local de depuración.",
    },
    {
      icon: <Code2 className="size-[18px]" />,
      title: "Código abierto",
      body: "El proyecto se distribuye bajo licencia MIT. Puedes consultar, modificar y estudiar su código.",
    },
  ];

  return (
    <Reveal>
      <section id="features" className="relative mx-auto max-w-5xl px-6 pb-28">
        <h2 className="mb-3 text-2xl font-semibold tracking-tight text-zinc-100 sm:text-3xl">
          Todo a mano para practicar.
        </h2>
        <p className="mb-10 max-w-lg text-zinc-400">
          Información de la ronda y herramientas para explorar cada lugar.
        </p>
        <div className="grid gap-px overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.03] sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => (
            <div
              key={it.title}
              className="bg-zinc-950 p-6 transition hover:bg-white/[0.02]"
            >
              <div className="mb-3 inline-flex size-8 items-center justify-center rounded-md bg-blue-500/10 text-blue-400">
                {it.icon}
              </div>
              <h3 className="text-[15px] font-medium text-zinc-200">{it.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-zinc-400">{it.body}</p>
            </div>
          ))}
        </div>
      </section>
    </Reveal>
  );
}

function Customizer() {
  const bullets = [
    { icon: <Layout className="size-4" />, text: "Arrastra para ordenar las secciones" },
    { icon: <Palette className="size-4" />, text: "Personaliza colores, estilos y tamaños" },
    { icon: <Code2 className="size-4" />, text: "Muestra solo la información que necesitas" },
  ];

  return (
    <Reveal>
      <section id="customize" className="relative mx-auto max-w-5xl px-6 pb-28">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-100 sm:text-3xl">
            Hazlo tuyo.
          </h2>
          <p className="mt-4 leading-relaxed text-zinc-400">
            Pulsa el lápiz para entrar en el modo de edición. Reordena las
            secciones, cambia los colores y tamaños del texto y oculta
            lo que no necesites.
          </p>
          <ul className="mx-auto mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm">
            {bullets.map((b) => (
              <li key={b.text} className="flex items-center gap-2 text-zinc-400">
                <span className="text-blue-400">{b.icon}</span>
                {b.text}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative mt-10 overflow-hidden rounded-xl border border-white/[0.06] bg-zinc-950 shadow-2xl shadow-black/40">
          <ScreenshotViewer src="/edit-mode.png" label="Modo edición de GeoHelper" />
        </div>
      </section>
    </Reveal>
  );
}

function GetStarted() {
  const flags = "--remote-debugging-port=34788 --remote-allow-origins=*";

  return (
    <Reveal>
      <section id="get-started" className="relative mx-auto max-w-5xl px-6 pb-28">
        <h2 className="mb-3 text-2xl font-semibold tracking-tight text-zinc-100 sm:text-3xl">
          Empieza en tres pasos.
        </h2>
        <p className="mb-8 text-zinc-400">Prepara el programa antes de tu próxima sesión.</p>
        <div className="grid gap-px overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.03] sm:grid-cols-3">
          <Step n="01" title="Obtén GeoHelper" icon={<Download className="size-5" />}>
            Consulta los paquetes disponibles en{" "}
            <a
              href={DISCORD_URL}
              {...EXTERNAL_LINK_PROPS}
              className="underline decoration-blue-500/40 underline-offset-2 hover:text-zinc-100"
            >
              Discord
            </a>{" "}
            y sigue las instrucciones de instalación de tu versión.
          </Step>

          <Step
            n="02"
            title="Configura Steam"
            icon={<Terminal className="size-5" />}
          >
            <p>En Steam, abre GeoGuessr → Propiedades → Opciones de lanzamiento y pega:</p>
            <div className="mt-3 flex items-start gap-2 rounded-md border border-white/[0.06] bg-black/40 px-3 py-2">
              <code className="flex-1 break-all font-mono text-[11px] text-blue-300">{flags}</code>
              <CopyButton text={flags} />
            </div>
          </Step>

          <Step n="03" title="Abre el juego" icon={<MapPin className="size-5" />}>
            Abre GeoGuessr y GeoHelper. Cuando se establezca la conexión, podrás ver la información de la ronda.
          </Step>
        </div>
      </section>
    </Reveal>
  );
}

function Step({
  n,
  title,
  icon,
  children,
}: {
  n: string;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="relative bg-zinc-950 p-6">
      <div className="mb-4 inline-flex size-8 items-center justify-center rounded-md bg-blue-500/10 text-blue-400">
        {icon}
      </div>
      <div className="absolute right-4 top-4 font-mono text-[10px] tracking-widest text-zinc-700">
        {n}
      </div>
      <strong className="block text-[15px] font-medium text-zinc-200">{title}</strong>
      <div className="mt-2 text-sm leading-relaxed text-zinc-400">{children}</div>
    </div>
  );
}

function Faq() {
  return (
    <Reveal>
      <section className="relative mx-auto max-w-3xl px-6 pb-24">
        <h2 className="mb-8 text-2xl font-semibold tracking-tight text-zinc-100 sm:text-3xl">
          Preguntas frecuentes.
        </h2>
        <div className="divide-y divide-white/[0.04] rounded-xl border border-white/[0.06]">
          {FAQ_ENTRIES.map((it) => (
            <details key={it.q} className="group px-5 py-4">
              <summary className="flex cursor-pointer items-center justify-between gap-4 text-zinc-200">
                <span className="text-[15px] font-medium">{it.q}</span>
                <ChevronDown className="size-4 shrink-0 text-zinc-400 transition group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">{it.a}</p>
            </details>
          ))}
        </div>
      </section>
    </Reveal>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/[0.04]">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-8 text-sm text-zinc-400">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" width={24} height={28} alt="" className="h-6 w-auto object-contain" />
          <span>GeoHelper</span>
        </div>
        <div className="flex items-center gap-5">
          <a href={GITHUB_URL} {...EXTERNAL_LINK_PROPS} className="transition hover:text-zinc-300">
            GitHub
          </a>
          <a
            href="https://opensource.org/licenses/MIT"
            {...EXTERNAL_LINK_PROPS}
            className="transition hover:text-zinc-300"
          >
            Licencia MIT
          </a>
        </div>
      </div>
    </footer>
  );
}
