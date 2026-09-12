import { useEffect, useState, type ReactNode } from "react"
import { invoke } from "@tauri-apps/api/core"
import { listen } from "@tauri-apps/api/event"
import { openUrl } from "@tauri-apps/plugin-opener"
import { ArrowRight, Eye, EyeOff, Globe2, ShieldCheck } from "lucide-react"
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
  return (
    <main
      className="flex h-screen flex-col items-center overflow-y-auto bg-[#060a12] p-6 text-white"
      style={{
        backgroundImage: "radial-gradient(ellipse at 15% 40%, #102c50 0%, transparent 55%)",
      }}
    >
      <div className="my-auto grid w-full max-w-5xl shrink-0 overflow-hidden rounded-3xl border border-white/10 bg-[#0a1120]/80 shadow-2xl backdrop-blur-md md:grid-cols-2">
        <section className="relative flex flex-col justify-center border-b border-white/10 p-9 md:border-b-0 md:border-r md:p-12">
          <img src={logo} alt="" className="mb-7 h-24 w-24 object-contain" />
          <p className="mb-3 text-xs font-semibold tracking-[0.25em] text-blue-400">
            EXPLORA. APRENDE. MEJORA.
          </p>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight">
            Bienvenido a<br />
            <span className="text-blue-400">GeoHelper</span>
          </h1>
          <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">
            Tu próximo descubrimiento empieza aquí. Accede a tu cuenta y continúa explorando el
            mundo.
          </p>
          <div className="mt-9 flex items-center gap-3 text-sm text-slate-300">
            <Globe2 className="size-5 text-blue-400" /> El mundo, una ubicación a la vez.
          </div>
          <div className="mt-10 flex gap-5 text-xs text-slate-400">
            <button onClick={() => void openUrl(DISCORD_URL)} className="hover:text-blue-300">
              Comunidad en Discord
            </button>
            <button onClick={() => void openUrl(GITHUB_URL)} className="hover:text-blue-300">
              Mi GitHub
            </button>
          </div>
        </section>
        <section className="p-9 md:p-12">
          <div className="mb-7 flex size-11 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10">
            <ShieldCheck className="size-6 text-blue-400" />
          </div>
          <h2 className="text-2xl font-semibold">
            {register ? "Crea tu cuenta" : "Iniciar sesión"}
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            {register
              ? "Vincula tu licencia una sola vez para empezar."
              : "Qué bueno verte de nuevo."}
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
        </section>
      </div>
    </main>
  )
}
