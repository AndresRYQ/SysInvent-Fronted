import { useMemo, useState, type FormEvent } from 'react'
import {
  CheckCircle2,
  KeyRound,
  LockKeyhole,
  Mail,
  Save,
  ShieldCheck,
  UserRound,
} from 'lucide-react'

import { useAuth } from '../../hooks/useAuth'
import { obtenerUsuarios, actualizarUsuario } from '../../services/usuarioService'
import type { UsuarioLogin } from '../../types/auth'
import '../../styles/DashboardPage.css'
import './PerfilUsuarioPage.css'

type Mensaje = {
  tipo: 'success' | 'danger'
  texto: string
}

export function PerfilUsuarioPage() {
  const { sesion } = useAuth()
  const usuarioInicial = useMemo(
    () =>
      obtenerUsuarios().find((usuario) => usuario.id === sesion?.id) ??
      null,
    [sesion?.id],
  )
  const [usuario, setUsuario] = useState<UsuarioLogin | null>(usuarioInicial)
  const [nombreCompleto, setNombreCompleto] = useState(
    usuarioInicial?.nombreCompleto ?? sesion?.nombreCompleto ?? '',
  )
  const [email, setEmail] = useState(usuarioInicial?.email ?? '')
  const [contrasenaActual, setContrasenaActual] = useState('')
  const [nuevaContrasena, setNuevaContrasena] = useState('')
  const [confirmarContrasena, setConfirmarContrasena] = useState('')
  const [mensaje, setMensaje] = useState<Mensaje | null>(null)

  const iniciales =
    (nombreCompleto || sesion?.nombreCompleto || 'US')
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((parte) => parte[0]?.toUpperCase() ?? '')
      .join('') || 'US'

  const guardarCambios = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMensaje(null)

    if (!usuario) {
      setMensaje({
        tipo: 'danger',
        texto: 'No se encontró la información del usuario actual.',
      })
      return
    }

    if (!nombreCompleto.trim() || !email.trim()) {
      setMensaje({
        tipo: 'danger',
        texto: 'Completa tu nombre y correo electrónico.',
      })
      return
    }

    const quiereCambiarContrasena =
      Boolean(contrasenaActual || nuevaContrasena || confirmarContrasena)

    if (quiereCambiarContrasena) {
      if (contrasenaActual !== usuario.contrasena) {
        setMensaje({
          tipo: 'danger',
          texto: 'La contraseña actual no es correcta.',
        })
        return
      }

      if (nuevaContrasena.length < 6) {
        setMensaje({
          tipo: 'danger',
          texto: 'La nueva contraseña debe tener al menos 6 caracteres.',
        })
        return
      }

      if (nuevaContrasena !== confirmarContrasena) {
        setMensaje({
          tipo: 'danger',
          texto: 'La confirmación de contraseña no coincide.',
        })
        return
      }
    }

    try {
      const actualizado = actualizarUsuario(usuario.id, {
        usuario: usuario.usuario,
        nombreCompleto,
        email,
        contrasena: quiereCambiarContrasena ? nuevaContrasena : '',
        rol: usuario.rol,
        estado: usuario.estado,
      })

      setUsuario(actualizado)
      setContrasenaActual('')
      setNuevaContrasena('')
      setConfirmarContrasena('')
      setMensaje({
        tipo: 'success',
        texto: 'Los datos de tu perfil se actualizaron correctamente.',
      })
    } catch (error) {
      setMensaje({
        tipo: 'danger',
        texto:
          error instanceof Error
            ? error.message
            : 'No se pudieron guardar los cambios.',
      })
    }
  }

  return (
    <main className="dashboard-shell perfil-page">
      <div className="perfil-page__body">
        <section className="perfil-hero">
          <div>
            <span className="perfil-kicker">Cuenta y seguridad</span>
            <h1>Perfil de usuario</h1>
            <p>
              Consulta y administra tu información personal y las opciones de
              seguridad de tu cuenta.
            </p>
          </div>
          <div className="perfil-hero__status">
            <CheckCircle2 size={18} />
            Sesión activa
          </div>
        </section>

        {mensaje && (
          <div className={`perfil-alert perfil-alert--${mensaje.tipo}`} role="alert">
            {mensaje.texto}
          </div>
        )}

        <form className="perfil-layout" onSubmit={guardarCambios} noValidate>
          <section className="perfil-card perfil-account-card">
            <div className="perfil-card__header">
              <div>
                <span className="perfil-kicker">Información personal</span>
                <h2>Datos de la cuenta</h2>
              </div>
              <UserRound size={22} />
            </div>

            <div className="perfil-user-summary">
              <div className="perfil-avatar" aria-hidden="true">{iniciales}</div>
              <div>
                <strong>{nombreCompleto || 'Usuario'}</strong>
                <span>@{usuario?.usuario ?? sesion?.usuario}</span>
              </div>
            </div>

            <div className="perfil-form-grid">
              <label className="perfil-field">
                <span>Nombre completo</span>
                <div className="perfil-input-wrap">
                  <UserRound size={17} />
                  <input
                    value={nombreCompleto}
                    onChange={(event) => setNombreCompleto(event.target.value)}
                    maxLength={100}
                  />
                </div>
              </label>

              <label className="perfil-field">
                <span>Correo electrónico</span>
                <div className="perfil-input-wrap">
                  <Mail size={17} />
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </div>
              </label>

              <div className="perfil-readonly-field">
                <span>Usuario</span>
                <strong>{usuario?.usuario ?? sesion?.usuario ?? '—'}</strong>
              </div>

              <div className="perfil-readonly-field">
                <span>Rol asignado</span>
                <strong><ShieldCheck size={16} />{usuario?.rol ?? sesion?.rol ?? '—'}</strong>
              </div>
            </div>
          </section>

          <section className="perfil-card perfil-security-card">
            <div className="perfil-card__header">
              <div>
                <span className="perfil-kicker">Protección de cuenta</span>
                <h2>Cambiar contraseña</h2>
              </div>
              <LockKeyhole size={22} />
            </div>
            <p className="perfil-card__description">
              Actualiza tu contraseña periódicamente para mantener segura tu
              cuenta.
            </p>

            <label className="perfil-field">
              <span>Contraseña actual</span>
              <div className="perfil-input-wrap">
                <KeyRound size={17} />
                <input
                  type="password"
                  value={contrasenaActual}
                  onChange={(event) => setContrasenaActual(event.target.value)}
                  placeholder="Ingresa tu contraseña actual"
                />
              </div>
            </label>

            <label className="perfil-field">
              <span>Nueva contraseña</span>
              <div className="perfil-input-wrap">
                <LockKeyhole size={17} />
                <input
                  type="password"
                  value={nuevaContrasena}
                  onChange={(event) => setNuevaContrasena(event.target.value)}
                  placeholder="Mínimo 6 caracteres"
                />
              </div>
            </label>

            <label className="perfil-field">
              <span>Confirmar nueva contraseña</span>
              <div className="perfil-input-wrap">
                <LockKeyhole size={17} />
                <input
                  type="password"
                  value={confirmarContrasena}
                  onChange={(event) => setConfirmarContrasena(event.target.value)}
                  placeholder="Repite la nueva contraseña"
                />
              </div>
            </label>

            <div className="perfil-security-note">
              <ShieldCheck size={17} />
              <span>Usa una contraseña personal y evita compartirla.</span>
            </div>
          </section>

          <div className="perfil-actions">
            <button type="submit" className="perfil-save-button">
              <Save size={18} />
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}
