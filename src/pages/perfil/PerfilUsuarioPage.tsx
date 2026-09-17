import {
  useState,
  type FormEvent,
} from 'react'

import {
  Eye,
  EyeOff,
  KeyRound,
  Mail,
  Save,
  ShieldCheck,
  UserCircle,
  UserRound,
} from 'lucide-react'

import { useAuth } from '../../hooks/useAuth'

import {
  actualizarPerfilUsuario,
  obtenerPerfilUsuario,
} from '../../services/perfilUsuarioService'

import type {
  UsuarioLogin,
} from '../../types/auth'

import type {
  PerfilUsuarioFormData,
} from '../../types/usuario'

import '../../styles/DashboardPage.css'
import '../../styles/maestros.css'

function obtenerIniciales(
  nombre: string,
): string {
  const partes = nombre
    .trim()
    .split(/\s+/)
    .filter(Boolean)

  if (partes.length === 0) {
    return 'U'
  }

  return partes
    .slice(0, 2)
    .map((parte) =>
      parte.charAt(0).toUpperCase(),
    )
    .join('')
}

function obtenerMensajeError(
  error: unknown,
): string {
  return error instanceof Error
    ? error.message
    : 'Ocurrió un error inesperado.'
}

function crearFormulario(
  usuario: UsuarioLogin,
): PerfilUsuarioFormData {
  return {
    usuario: usuario.usuario,
    nombreCompleto:
      usuario.nombreCompleto,
    email: usuario.email,
    contrasenaActual: '',
    nuevaContrasena: '',
    confirmarContrasena: '',
  }
}

export function PerfilUsuarioPage() {
  const {
    sesion,
    actualizarSesionUsuario,
  } = useAuth()

  const [perfil, setPerfil] =
    useState<UsuarioLogin | null>(
      () =>
        sesion
          ? obtenerPerfilUsuario(
              sesion.id,
            )
          : null,
    )

  const [formulario, setFormulario] =
    useState<PerfilUsuarioFormData>(
      () =>
        perfil
          ? crearFormulario(perfil)
          : {
              usuario: '',
              nombreCompleto: '',
              email: '',
              contrasenaActual: '',
              nuevaContrasena: '',
              confirmarContrasena: '',
            },
    )

  const [
    mostrarContrasenas,
    setMostrarContrasenas,
  ] = useState(false)

  const [guardando, setGuardando] =
    useState(false)

  const [error, setError] =
    useState<string | null>(null)

  const [mensaje, setMensaje] =
    useState<string | null>(null)

  function cambiarCampo(
    campo: keyof PerfilUsuarioFormData,
    valor: string,
  ): void {
    setFormulario((actual) => ({
      ...actual,
      [campo]: valor,
    }))

    setError(null)
    setMensaje(null)
  }

  function guardar(
    event: FormEvent<HTMLFormElement>,
  ): void {
    event.preventDefault()

    if (!sesion || !perfil) {
      setError(
        'No se encontró la sesión actual.',
      )
      return
    }

    setGuardando(true)
    setError(null)
    setMensaje(null)

    try {
      const actualizado =
        actualizarPerfilUsuario(
          sesion.id,
          formulario,
        )

      setPerfil(actualizado)

      actualizarSesionUsuario(
        actualizado,
      )

      setFormulario(
        crearFormulario(
          actualizado,
        ),
      )

      setMensaje(
        'Tu perfil se actualizó correctamente.',
      )
    } catch (errorActual) {
      setError(
        obtenerMensajeError(
          errorActual,
        ),
      )
    } finally {
      setGuardando(false)
    }
  }

  if (!sesion || !perfil) {
    return (
      <main className="dashboard-shell maestro-page-shell">
        <div className="container-xl px-0 maestro-page-body">
          <div
            className="alert alert-danger"
            role="alert"
          >
            No fue posible cargar el perfil
            del usuario autenticado.
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="dashboard-shell maestro-page-shell">
      <div className="container-xl px-0 maestro-page-body">
        <section className="maestro-topbar">
          <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap">
            <div className="maestro-topbar__copy">
              <h1>Perfil de usuario</h1>

              <p>
                Consulta y actualiza los datos
                de tu cuenta.
              </p>
            </div>

            <UserCircle
              size={36}
              className="text-success"
            />
          </div>
        </section>

        <div className="maestro-panel">
          <div className="row g-4">
            <div className="col-12 col-lg-4">
              <section className="card border-0 shadow-sm h-100">
                <div className="card-body p-4">
                  <div className="text-center">
                    <div
                      className="d-inline-flex align-items-center justify-content-center rounded-circle text-white fw-bold mb-3"
                      style={{
                        width: '92px',
                        height: '92px',
                        fontSize: '1.8rem',
                        background:
                          'linear-gradient(135deg, #0f5132, #198754)',
                      }}
                    >
                      {obtenerIniciales(
                        perfil.nombreCompleto,
                      )}
                    </div>

                    <h2 className="h5 mb-1">
                      {perfil.nombreCompleto}
                    </h2>

                    <p className="text-secondary mb-4">
                      @{perfil.usuario}
                    </p>
                  </div>

                  <div className="d-flex flex-column gap-3">
                    <div className="d-flex align-items-center gap-3">
                      <Mail
                        size={19}
                        className="text-success"
                      />

                      <div>
                        <small className="d-block text-secondary">
                          Correo
                        </small>

                        <span>
                          {perfil.email}
                        </span>
                      </div>
                    </div>

                    <div className="d-flex align-items-center gap-3">
                      <ShieldCheck
                        size={19}
                        className="text-success"
                      />

                      <div>
                        <small className="d-block text-secondary">
                          Rol
                        </small>

                        <span>
                          {perfil.rol}
                        </span>
                      </div>
                    </div>

                    <div className="d-flex align-items-center gap-3">
                      <UserRound
                        size={19}
                        className="text-success"
                      />

                      <div>
                        <small className="d-block text-secondary">
                          Estado
                        </small>

                        <span
                          className={
                            perfil.estado
                              ? 'maestro-status maestro-status--active mt-1'
                              : 'maestro-status maestro-status--inactive mt-1'
                          }
                        >
                          {perfil.estado
                            ? 'Activo'
                            : 'Inactivo'}
                        </span>
                      </div>
                    </div>

                    <div className="d-flex align-items-center gap-3">
                      <KeyRound
                        size={19}
                        className="text-success"
                      />

                      <div>
                        <small className="d-block text-secondary">
                          Identificador
                        </small>

                        <span>
                          {perfil.id}
                        </span>
                      </div>
                    </div>
                  </div>

                  <hr className="my-4" />

                  <p className="small text-secondary mb-0">
                    El rol y el estado solo pueden
                    ser modificados desde el módulo
                    Usuarios por una persona con
                    permisos.
                  </p>
                </div>
              </section>
            </div>

            <div className="col-12 col-lg-8">
              <section className="maestro-table-card card border-0 shadow-sm">
                <div className="card-body p-4">
                  <div className="mb-4">
                    <span className="maestro-kicker">
                      <UserRound size={17} />
                      Información personal
                    </span>

                    <p className="text-secondary small mb-0 mt-2">
                      Confirma tu contraseña actual
                      para guardar cualquier cambio.
                    </p>
                  </div>

                  {error && (
                    <div
                      className="alert alert-danger"
                      role="alert"
                    >
                      {error}
                    </div>
                  )}

                  {mensaje && (
                    <div
                      className="alert alert-success"
                      role="status"
                    >
                      {mensaje}
                    </div>
                  )}

                  <form onSubmit={guardar}>
                    <div className="row g-3">
                      <div className="col-12 col-md-6">
                        <label
                          className="form-label maestro-label"
                          htmlFor="perfilUsuario"
                        >
                          Usuario
                        </label>

                        <input
                          id="perfilUsuario"
                          className="form-control maestro-control"
                          value={
                            formulario.usuario
                          }
                          autoComplete="username"
                          maxLength={60}
                          required
                          onChange={(event) =>
                            cambiarCampo(
                              'usuario',
                              event.target.value,
                            )
                          }
                        />
                      </div>

                      <div className="col-12 col-md-6">
                        <label
                          className="form-label maestro-label"
                          htmlFor="perfilNombre"
                        >
                          Nombre completo
                        </label>

                        <input
                          id="perfilNombre"
                          className="form-control maestro-control"
                          value={
                            formulario.nombreCompleto
                          }
                          maxLength={120}
                          required
                          onChange={(event) =>
                            cambiarCampo(
                              'nombreCompleto',
                              event.target.value,
                            )
                          }
                        />
                      </div>

                      <div className="col-12">
                        <label
                          className="form-label maestro-label"
                          htmlFor="perfilCorreo"
                        >
                          Correo electrónico
                        </label>

                        <input
                          id="perfilCorreo"
                          type="email"
                          className="form-control maestro-control"
                          value={
                            formulario.email
                          }
                          autoComplete="email"
                          maxLength={150}
                          required
                          onChange={(event) =>
                            cambiarCampo(
                              'email',
                              event.target.value,
                            )
                          }
                        />
                      </div>
                    </div>

                    <hr className="my-4" />

                    <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap mb-3">
                      <div>
                        <span className="maestro-kicker">
                          <KeyRound size={17} />
                          Seguridad
                        </span>

                        <p className="text-secondary small mb-0 mt-2">
                          Deja la nueva contraseña
                          vacía si no deseas cambiarla.
                        </p>
                      </div>

                      <button
                        type="button"
                        className="btn maestro-btn-secondary"
                        onClick={() =>
                          setMostrarContrasenas(
                            (actual) => !actual,
                          )
                        }
                      >
                        {mostrarContrasenas ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}

                        {mostrarContrasenas
                          ? 'Ocultar'
                          : 'Mostrar'}
                      </button>
                    </div>

                    <div className="row g-3">
                      <div className="col-12">
                        <label
                          className="form-label maestro-label"
                          htmlFor="perfilContrasenaActual"
                        >
                          Contraseña actual
                        </label>

                        <input
                          id="perfilContrasenaActual"
                          type={
                            mostrarContrasenas
                              ? 'text'
                              : 'password'
                          }
                          className="form-control maestro-control"
                          value={
                            formulario
                              .contrasenaActual
                          }
                          autoComplete="current-password"
                          required
                          onChange={(event) =>
                            cambiarCampo(
                              'contrasenaActual',
                              event.target.value,
                            )
                          }
                        />
                      </div>

                      <div className="col-12 col-md-6">
                        <label
                          className="form-label maestro-label"
                          htmlFor="perfilNuevaContrasena"
                        >
                          Nueva contraseña
                        </label>

                        <input
                          id="perfilNuevaContrasena"
                          type={
                            mostrarContrasenas
                              ? 'text'
                              : 'password'
                          }
                          className="form-control maestro-control"
                          value={
                            formulario
                              .nuevaContrasena
                          }
                          autoComplete="new-password"
                          minLength={6}
                          onChange={(event) =>
                            cambiarCampo(
                              'nuevaContrasena',
                              event.target.value,
                            )
                          }
                        />
                      </div>

                      <div className="col-12 col-md-6">
                        <label
                          className="form-label maestro-label"
                          htmlFor="perfilConfirmarContrasena"
                        >
                          Confirmar contraseña
                        </label>

                        <input
                          id="perfilConfirmarContrasena"
                          type={
                            mostrarContrasenas
                              ? 'text'
                              : 'password'
                          }
                          className="form-control maestro-control"
                          value={
                            formulario
                              .confirmarContrasena
                          }
                          autoComplete="new-password"
                          minLength={6}
                          onChange={(event) =>
                            cambiarCampo(
                              'confirmarContrasena',
                              event.target.value,
                            )
                          }
                        />
                      </div>
                    </div>

                    <div className="d-flex justify-content-end mt-4">
                      <button
                        type="submit"
                        className="btn maestro-btn-primary"
                        disabled={guardando}
                      >
                        <Save size={18} />

                        {guardando
                          ? 'Guardando...'
                          : 'Guardar cambios'}
                      </button>
                    </div>
                  </form>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}