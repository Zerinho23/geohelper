import { useEffect, useState, type ReactNode } from "react"
import { invoke } from "@tauri-apps/api/core"
import { listen } from "@tauri-apps/api/event"
import { openUrl } from "@tauri-apps/plugin-opener"
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Globe2,
  LockKeyhole,
  MapPinned,
  Radar,
  ShieldCheck,
  Sparkles,
} from "lucide-react"
import toast from "react-hot-toast"
import logo from "@/assets/logo.png"
import { DISCORD_URL, GITHUB_URL } from "@/lib/links"

export function LicenseGate({ children }: { children: ReactNode }) {
  const [active, setActive] = useState(false)
  const [checking, setChecking] = useState(true)
  const [busy, setBusy] = useState(false)
  const [register, setRegister] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmation, setConfirmation] = useState("")
  const [key, setKey] = useState("")
  const [remember, setRemember] = useState(true)
  const [savedUser, setSavedUser] = useState<string | null>(null)
  const [reveal, setReveal] = useState(false)
  const [error, setError] = useState("")
  const useSaved = !register && savedUser === username && !password

  useEffect(() => {
    let disposed = false
    const loadAccount = async () => {
      const saved = await invoke<string | null>("remembered_account")
      if (!disposed) {
        setSavedUser(saved)
        if (saved) setUsername(saved)
      }
    }
    const expired = listen("auth-expired", () => {
      setActive(false)
      setRegister(false)
      setPassword("")
      setError("La sesión terminó. Comprueba tu conexión y vuelve a iniciar sesión.")
    })
    const logout = listen("auth-logout", () => {
      setActive(false)
      setRegister(false)
      setPassword("")
      setError("")
      void loadAccount().catch(() => setSavedUser(null))
    })
    void Promise.all([invoke<boolean>("auth_status"), loadAccount()])
      .then(([value]) => {
        if (!disposed) setActive(value)
      })
      .catch(() => {
        if (!disposed)
          setError(
            "No se pudo recuperar la cuenta guardada. Puedes escribir tus datos para entrar."
          )
      })
      .finally(() => {
        if (!disposed) setChecking(false)
      })
    return () => {
      disposed = true
      void expired.then((stop) => stop())
      void logout.then((stop) => stop())
    }
  }, [])

  if (active) return children
  const inputClass =
    "mt-2 w-full rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm text-white outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50"
  const benefits = [
    { icon: MapPinned, title: "Ubicación precisa", text: "Coordenadas y datos en tiempo real" },
    { icon: Radar, title: "Conexión directa", text: "Diseñado para GeoGuessr en Steam" },
    { icon: LockKeyhole, title: "Acceso protegido", text: "Tu cuenta vinculada a KeyAuth" },
  ]

  return (
    <main
      className="relative box-border flex h-screen flex-col items-center overflow-hidden bg-[#050913] p-0 text-white"
      style={{
        backgroundImage:
          "radial-gradient(circle at 8% 18%, rgba(37,99,235,.22), transparent 28%), radial-gradient(circle at 92% 82%, rgba(14,165,233,.12), transparent 30%)",
      }}
    >
      <div className="auth-grid pointer-events-none absolute inset-0 opacity-[0.07]" />
      <div className="auth-orb auth-orb-one pointer-events-none absolute" />
      <div className="auth-orb auth-orb-two pointer-events-none absolute" />
      <div className="auth-particles pointer-events-none absolute inset-0" />
      <div className="auth-shell relative grid h-full min-h-0 w-full max-w-none shrink-0 overflow-hidden border-blue-300/15 bg-[#091323]/90 shadow-[0_35px_100px_rgba(0,0,0,.55)] backdrop-blur-xl md:grid-cols-[1.08fr_.92fr]">
        <section className="auth-left relative flex min-h-0 flex-col overflow-hidden border-b border-white/10 p-8 md:border-b-0 md:border-r md:p-12 lg:p-14">
          <div className="absolute -right-36 top-28 size-[430px] rounded-full border border-blue-400/10" />
          <div className="absolute -right-24 top-40 size-[310px] rounded-full border border-blue-400/10" />
          <div className="absolute right-4 top-48 size-44 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="auth-globe pointer-events-none absolute right-[-12%] top-[24%] hidden size-[520px] lg:block">
            <div className="auth-globe-ring auth-globe-ring-one" />
            <div className="auth-globe-ring auth-globe-ring-two" />
            <div className="auth-globe-core" />
            <div className="auth-globe-scan" />
            <span className="auth-globe-dot auth-globe-dot-one" />
            <span className="auth-globe-dot auth-globe-dot-two" />
            <span className="auth-globe-dot auth-globe-dot-three" />
          </div>

          <div className="relative z-10 flex items-center gap-3">
            <img src={logo} alt="" className="h-12 w-12 object-contain" />
            <div>
              <p className="text-lg font-semibold tracking-tight">GeoHelper</p>
              <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-blue-400">
                Desktop Companion
              </p>
            </div>
          </div>

          <div className="relative z-10 my-auto py-10">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1.5 text-[11px] font-medium text-blue-300">
              <Sparkles className="size-3.5" /> EXPLORA. APRENDE. MEJORA.
            </div>
            <h1 className="auth-title max-w-xl text-4xl font-semibold leading-[1.1] tracking-tight lg:text-5xl">
              Bienvenido a <span className="text-blue-400">GeoHelper</span>
            </h1>
            <p className="mt-5 max-w-lg text-[15px] leading-7 text-slate-400">
              Convierte cada partida en una experiencia más clara. Consulta ubicaciones, datos del
              país y coordenadas desde una sola aplicación.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {benefits.map(({ icon: Icon, title, text }) => (
                <div
                  key={title}
                  className="auth-feature rounded-2xl border border-white/[0.07] bg-white/[0.035] p-4 transition hover:border-blue-400/20 hover:bg-blue-500/[0.06]"
                >
                  <div className="mb-3 flex size-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                    <Icon className="size-[18px]" />
                  </div>
                  <p className="text-xs font-semibold text-slate-200">{title}</p>
                  <p className="mt-1.5 text-[11px] leading-4 text-slate-500">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 flex flex-wrap items-center justify-between gap-5 border-t border-white/[0.07] pt-6">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
              </span>
              Servicios disponibles
            </div>
            <div className="flex gap-5 text-xs text-slate-400">
              <button onClick={() => void openUrl(DISCORD_URL)} className="hover:text-blue-300">
                Discord
              </button>
              <button onClick={() => void openUrl(GITHUB_URL)} className="hover:text-blue-300">
                GitHub
              </button>
            </div>
          </div>
        </section>

        <section className="auth-right relative flex min-h-0 flex-col p-8 md:p-10 lg:p-12">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Globe2 className="size-4 text-blue-400" /> Acceso seguro
            </div>
            <div className="rounded-full border border-emerald-400/15 bg-emerald-400/[0.06] px-3 py-1 text-[10px] font-medium text-emerald-300">
              <span className="mr-1.5">●</span> KEYAUTH PROTEGIDO
            </div>
          </div>

          <div className="auth-form-panel my-auto w-full max-w-md self-center rounded-[28px] border border-white/[0.08] bg-white/[0.035] p-6 py-7 shadow-2xl shadow-black/20 backdrop-blur-md md:p-8">
            <div className="mb-6 flex size-12 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 shadow-lg shadow-blue-500/5">
              <ShieldCheck className="size-6 text-blue-400" />
            </div>
            <h2 className="text-3xl font-semibold tracking-tight">
              {register ? "Crea tu cuenta" : "Iniciar sesión"}
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              {register
                ? "Vincula tu licencia una sola vez para empezar."
                : `Qué bueno verte de nuevo${savedUser ? `, ${savedUser}` : ""}.`}
            </p>
            <form
              className="mt-7 space-y-4"
              onSubmit={async (event) => {
                event.preventDefault()
                if (busy || checking) return
                if (register && password !== confirmation) {
                  setError("Las contraseñas no coinciden.")
                  return
                }
                setBusy(true)
                setError("")
                try {
                  const warning = await invoke<string | null>("authenticate_account", {
                    username,
                    password,
                    key: register ? key.trim() : null,
                    remember,
                    useSaved,
                  })
                  setSavedUser(remember && !warning ? username.trim() : null)
                  setKey("")
                  setPassword("")
                  setConfirmation("")
                  setActive(true)
                  if (warning) toast.error(warning)
                } catch (err) {
                  setError(typeof err === "string" ? err : "No se pudo iniciar sesión.")
                } finally {
                  setBusy(false)
                }
              }}
            >
              <label className="block text-sm text-slate-300" htmlFor="username">
                Usuario
                <input
                  id="username"
                  autoComplete="username"
                  required
                  maxLength={128}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={busy || checking}
                  className={inputClass}
                  placeholder="Tu nombre de usuario"
                />
              </label>
              <label className="block text-sm text-slate-300" htmlFor="password">
                Contraseña
              </label>
              <div className="relative !mt-2">
                <input
                  id="password"
                  type={reveal ? "text" : "password"}
                  autoComplete={register ? "new-password" : "current-password"}
                  required={!useSaved}
                  maxLength={256}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={busy || checking}
                  className={`${inputClass} !mt-0 pr-12`}
                  placeholder={useSaved ? "Contraseña guardada en Windows" : "Tu contraseña"}
                />
                <button
                  type="button"
                  aria-label={reveal ? "Ocultar contraseña" : "Mostrar contraseña"}
                  onClick={() => setReveal(!reveal)}
                  className="absolute right-4 top-3.5 text-slate-400"
                >
                  {reveal ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {register && (
                <>
                  <label className="block text-sm text-slate-300" htmlFor="confirm">
                    Confirmar contraseña
                    <input
                      id="confirm"
                      type="password"
                      autoComplete="new-password"
                      required
                      maxLength={256}
                      value={confirmation}
                      onChange={(e) => setConfirmation(e.target.value)}
                      disabled={busy}
                      className={inputClass}
                      placeholder="Repite tu contraseña"
                    />
                  </label>
                  <label className="block text-sm text-slate-300" htmlFor="license">
                    Licencia de activación
                    <input
                      id="license"
                      type="password"
                      autoComplete="off"
                      required
                      maxLength={256}
                      value={key}
                      onChange={(e) => setKey(e.target.value)}
                      disabled={busy}
                      className={inputClass}
                      placeholder="Solo se pide al registrarte"
                    />
                  </label>
                </>
              )}
              <div className="flex items-center justify-between gap-3 text-xs text-slate-400">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={remember}
                    disabled={busy}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="accent-blue-500"
                  />{" "}
                  Recordarme
                </label>
                {savedUser && (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={async () => {
                      try {
                        await invoke("forget_account")
                        setSavedUser(null)
                        setPassword("")
                        setRemember(false)
                      } catch {
                        setError("No se pudo olvidar la cuenta. Inténtalo de nuevo.")
                      }
                    }}
                    className="text-blue-400"
                  >
                    Olvidar cuenta
                  </button>
                )}
              </div>
              {error && (
                <p
                  role="alert"
                  className="rounded-lg border border-red-400/20 bg-red-400/5 p-3 text-sm text-red-300"
                >
                  {error}
                </p>
              )}
              <button
                disabled={checking || busy}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/15 transition hover:bg-blue-500 disabled:opacity-50"
              >
                {checking
                  ? "Preparando…"
                  : busy
                    ? "Conectando…"
                    : register
                      ? "Crear cuenta"
                      : "Entrar"}
                <ArrowRight className="size-4" />
              </button>
            </form>
            <p className="mt-6 text-center text-sm text-slate-400">
              {register ? "¿Ya tienes cuenta? " : "¿No tienes cuenta? "}
              <button
                disabled={busy}
                onClick={() => {
                  setRegister(!register)
                  setError("")
                  setKey("")
                  setPassword("")
                  setConfirmation("")
                  setReveal(false)
                }}
                className="font-medium text-blue-400 hover:text-blue-300"
              >
                {register ? "Inicia sesión" : "Regístrate"}
              </button>
            </p>
            <p className="mt-6 text-center text-xs leading-5 text-slate-500">
              {register ? "¿Necesitas una licencia? " : "¿Necesitas ayuda para acceder? "}
              <button
                onClick={() => void openUrl(DISCORD_URL)}
                className="text-slate-400 underline underline-offset-4"
              >
                Visita nuestro Discord
              </button>
            </p>
          </div>

          <div className="mt-7 flex items-center justify-center gap-2 border-t border-white/[0.07] pt-5 text-[11px] text-slate-500">
            <Check className="size-3.5 text-emerald-400" /> Tus credenciales se protegen con Windows
          </div>
        </section>
      </div>
    </main>
  )
}
