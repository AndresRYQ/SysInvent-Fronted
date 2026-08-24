import {  useEffect,  useState,  type FormEvent,} from 'react'
import {  AlertCircle,  Eye,  EyeOff,  LoaderCircle,  LockKeyhole,  UserRound,} from 'lucide-react'
import {  Navigate,  useLocation,  useNavigate,} from 'react-router-dom'
import logoAgrihusac from '../../assets/images/logoagr.png'
import { useAuth } from '../../hooks/useAuth'
import './LoginPage.css'

interface EstadoNavegacion {
  desde?: {
    pathname?: string
  }
}

function calcularSegundosRestantes(
  fechaBloqueo: string | null,
): number {
  if (!fechaBloqueo) {
    return 0
  }

  const diferencia =
    Date.parse(fechaBloqueo) - Date.now()

  return Math.max(
    0,
    Math.ceil(diferencia / 1000),
  )
}

function formatearTiempo(
  segundosTotales: number,
): string {
  const minutos = Math.floor(
    segundosTotales / 60,
  )

  const segundos = segundosTotales % 60

  return `${minutos}:${segundos
    .toString()
    .padStart(2, '0')}`
}

export function LoginPage() {
  const { sesion, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [usuario, setUsuario] =
    useState('')

  const [contrasena, setContrasena] =
    useState('')

  const [
    mostrarContrasena,
    setMostrarContrasena,
  ] = useState(false)

  const [
    mensajeError,
    setMensajeError,
  ] = useState('')

  const [enviando, setEnviando] =
    useState(false)

  const [
    bloqueadoHasta,
    setBloqueadoHasta,
  ] = useState<string | null>(null)

  const [
    segundosBloqueo,
    setSegundosBloqueo,
  ] = useState(0)

  useEffect(() => {
  document.title =
    'Iniciar sesión | AGRIHUSAC'

  const motivoCierre =
    sessionStorage.getItem(
      'agrihusac_motivo_cierre',
    )

  if (motivoCierre === 'inactividad') {
    setMensajeError(
      'Tu sesión se cerró por inactividad. Inicia sesión nuevamente.',
    )
  }

  sessionStorage.removeItem(
    'agrihusac_motivo_cierre',
  )
}, [])

  /*
   * Actualiza el contador del bloqueo
   * una vez por segundo.
   */
  useEffect(() => {
    if (!bloqueadoHasta) {
      setSegundosBloqueo(0)
      return
    }

    const actualizarContador = () => {
      const segundos =
        calcularSegundosRestantes(
          bloqueadoHasta,
        )

      setSegundosBloqueo(segundos)

      if (segundos <= 0) {
        setBloqueadoHasta(null)
        setMensajeError(
          'El bloqueo terminó. Ya puedes intentarlo nuevamente.',
        )
      }
    }

    actualizarContador()

    const intervalo = window.setInterval(
      actualizarContador,
      1000,
    )

    return () => {
      window.clearInterval(intervalo)
    }
  }, [bloqueadoHasta])

  if (sesion) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    )
  }

  const manejarEnvio = (
    evento: FormEvent<HTMLFormElement>,
  ) => {
    evento.preventDefault()

    if (segundosBloqueo > 0) {
      return
    }

    setMensajeError('')

    if (
      !usuario.trim() ||
      !contrasena
    ) {
      setMensajeError(
        'Ingresa tu usuario y contraseña.',
      )
      return
    }

    setEnviando(true)

    window.setTimeout(() => {
      const resultado = login({
        usuario,
        contrasena,
      })

      setEnviando(false)

      if (!resultado.exitoso) {
        setMensajeError(
          resultado.mensaje,
        )

        setBloqueadoHasta(
          resultado.bloqueadoHasta,
        )

        return
      }

      const estado = location.state as
        | EstadoNavegacion
        | null

      const rutaDestino =
        estado?.desde?.pathname ??
        '/dashboard'

      navigate(rutaDestino, {
        replace: true,
      })
    }, 350)
  }

  const formularioBloqueado =
    enviando || segundosBloqueo > 0

  return (
    <main className="login-page">
      <div
        className="login-page__overlay"
        aria-hidden="true"
      />

      <section
        className="login-card"
        aria-labelledby="login-title"
      >
        <img
          className="login-card__logo"
          src={logoAgrihusac}
          alt="AGRIHUSAC - Agroindustrias Huaral S.A.C."
        />

        <h1 id="login-title">
          Iniciar Sesión
        </h1>

        <form
          className="login-form"
          onSubmit={manejarEnvio}
          noValidate
        >
          <label className="login-field">
            <span className="sr-only">
              Usuario
            </span>

            <UserRound
              className="login-field__icon"
              size={23}
              strokeWidth={2.4}
              aria-hidden="true"
            />

            <input
              type="text"
              name="usuario"
              placeholder="Usuario"
              value={usuario}
              maxLength={50}
              autoComplete="username"
              autoFocus
              disabled={segundosBloqueo > 0}
              aria-invalid={
                Boolean(mensajeError)
              }
              onChange={(evento) => {
                setUsuario(
                  evento.target.value,
                )

                if (!bloqueadoHasta) {
                  setMensajeError('')
                }
              }}
            />
          </label>

          <label className="login-field">
            <span className="sr-only">
              Contraseña
            </span>

            <LockKeyhole
              className="login-field__icon"
              size={23}
              strokeWidth={2.4}
              aria-hidden="true"
            />

            <input
              type={
                mostrarContrasena
                  ? 'text'
                  : 'password'
              }
              name="contrasena"
              placeholder="Contraseña"
              value={contrasena}
              maxLength={80}
              autoComplete="current-password"
              disabled={segundosBloqueo > 0}
              aria-invalid={
                Boolean(mensajeError)
              }
              onChange={(evento) => {
                setContrasena(
                  evento.target.value,
                )

                if (!bloqueadoHasta) {
                  setMensajeError('')
                }
              }}
            />

            <button
              type="button"
              className="password-toggle"
              disabled={
                segundosBloqueo > 0
              }
              aria-label={
                mostrarContrasena
                  ? 'Ocultar contraseña'
                  : 'Mostrar contraseña'
              }
              onClick={() =>
                setMostrarContrasena(
                  (valorActual) =>
                    !valorActual,
                )
              }
            >
              {mostrarContrasena ? (
                <EyeOff
                  size={22}
                  aria-hidden="true"
                />
              ) : (
                <Eye
                  size={22}
                  aria-hidden="true"
                />
              )}
            </button>
          </label>

          <div
            className="login-form__message"
            aria-live="polite"
          >
            {mensajeError && (
              <p role="alert">
                <AlertCircle
                  size={17}
                  aria-hidden="true"
                />

                {mensajeError}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={formularioBloqueado}
          >
            {enviando ? (
              <>
                <LoaderCircle
                  className="login-button__spinner"
                  size={21}
                  aria-hidden="true"
                />

                INGRESANDO
              </>
            ) : segundosBloqueo > 0 ? (
              `BLOQUEADO ${formatearTiempo(
                segundosBloqueo,
              )}`
            ) : (
              'INGRESAR'
            )}
          </button>
        </form>
      </section>
    </main>
  )
}