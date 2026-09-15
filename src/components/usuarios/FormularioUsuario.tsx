import { Placeholder } from '../../constants/placeholders'
import {
  Save,
  UserRound,
  X,
} from 'lucide-react'

import {
  useState,
  type FormEvent,
} from 'react'

import type {
  UsuarioLogin,
} from '../../types/auth'

import type {
  Rol,
} from '../../types/rol'

import type {
  UsuarioFormData,
} from '../../types/usuario'

interface FormularioUsuarioProps {
  usuario: UsuarioLogin | null
  roles: Rol[]
  onClose: () => void
  onGuardar: (
    datos: UsuarioFormData,
  ) => string | null
}

export function FormularioUsuario({
  usuario,
  roles,
  onClose,
  onGuardar,
}: FormularioUsuarioProps) {
  const [datos, setDatos] =
    useState<UsuarioFormData>(() => ({
      usuario: usuario?.usuario ?? '',
      nombreCompleto:
        usuario?.nombreCompleto ?? '',
      email: usuario?.email ?? '',
      contrasena: '',
      rol: usuario?.rol ?? '',
      estado: usuario?.estado ?? true,
    }))

  const [error, setError] = useState('')

  const rolesDisponibles = roles.filter(
    (rol) =>
      rol.estado ||
      rol.nombre === usuario?.rol,
  )

  const manejarEnvio = (
    evento: FormEvent<HTMLFormElement>,
  ) => {
    evento.preventDefault()
    setError('')

    const mensaje = onGuardar(datos)

    if (mensaje) {
      setError(mensaje)
    }
  }

  return (
    <div
      className="maestro-modal-backdrop"
      role="presentation"
      onMouseDown={(evento) => {
        if (
          evento.target ===
          evento.currentTarget
        ) {
          onClose()
        }
      }}
    >
      <form
        className="maestro-modal-card"
        onSubmit={manejarEnvio}
        role="dialog"
        aria-modal="true"
        aria-labelledby="usuario-form-title"
      >
        <header className="maestro-modal-header">
          <div className="maestro-modal-header__content">
            <h2
              id="usuario-form-title"
              className="maestro-modal-title"
            >
              {usuario
                ? 'Editar usuario'
                : 'Nuevo usuario'}
            </h2>

            <p className="maestro-modal-copy">
              Registra los datos y asigna
              un rol.
            </p>
          </div>

          <button
            type="button"
            className="btn maestro-modal-close"
            onClick={onClose}
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>
        </header>

        <div className="maestro-modal-body">
          {error && (
            <div
              className="alert alert-danger py-2"
              role="alert"
            >
              {error}
            </div>
          )}

          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label
                className="form-label required"
                htmlFor="usuarioNombre"
              >
                Usuario

              </label>

              <div className="input-group">
                <span className="input-group-text">
                  <UserRound size={16} />
                </span>

                <input
                  id="usuarioNombre"
                  className="form-control"
                  value={datos.usuario}
                  maxLength={50}
                  autoComplete="username"
                  onChange={(evento) =>
                    setDatos((actual) => ({
                      ...actual,
                      usuario:
                        evento.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="col-12 col-md-6">
              <label
                className="form-label required"
                htmlFor="usuarioNombreCompleto"
              >
                Nombre completo

              </label>

              <input
                id="usuarioNombreCompleto"
                className="form-control"
                value={datos.nombreCompleto}
                maxLength={100}
                onChange={(evento) =>
                  setDatos((actual) => ({
                    ...actual,
                    nombreCompleto:
                      evento.target.value,
                  }))
                }
              />
            </div>

            <div className="col-12 col-md-6">
              <label
                className="form-label required"
                htmlFor="usuarioEmail"
              >
                Correo

              </label>

              <input
                id="usuarioEmail"
                className="form-control"
                type="email"
                value={datos.email}
                maxLength={120}
                autoComplete="email"
                onChange={(evento) =>
                  setDatos((actual) => ({
                    ...actual,
                    email:
                      evento.target.value,
                  }))
                }
              />
            </div>

            <div className="col-12 col-md-6">
              <label
                className="form-label required"
                htmlFor="usuarioRol"
              >
                Rol

              </label>

              <select
                id="usuarioRol"
                className="form-select"
                value={datos.rol}
                onChange={(evento) =>
                  setDatos((actual) => ({
                    ...actual,
                    rol:
                      evento.target.value,
                  }))
                }
              >
                <option value="">
                  Selecciona un rol
                </option>

                {rolesDisponibles.map((rol) => (
                  <option
                    value={rol.nombre}
                    key={rol.id}
                  >
                    {rol.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12 col-md-6">
              <label
                className="form-label required"
                htmlFor="usuarioContrasena"
              >
                Contraseña
              </label>

              <input
                id="usuarioContrasena"
                className="form-control"
                type="password"
                value={datos.contrasena}
                minLength={6}
                maxLength={80}
                autoComplete="new-password"
                placeholder={Placeholder.Ingresar}
                onChange={(evento) =>
                  setDatos((actual) => ({
                    ...actual,
                    contrasena:
                      evento.target.value,
                  }))
                }
              />
            </div>

            <div className="col-12 col-md-6">
              <label
                className="form-label"
                htmlFor="usuarioEstado"
              >
                Estado
              </label>

              <select
                id="usuarioEstado"
                className="form-select"
                value={
                  datos.estado
                    ? 'activo'
                    : 'inactivo'
                }
                onChange={(evento) =>
                  setDatos((actual) => ({
                    ...actual,
                    estado:
                      evento.target.value ===
                      'activo',
                  }))
                }
              >
                <option value="activo">
                  Activo
                </option>
                <option value="inactivo">
                  Inactivo
                </option>
              </select>
            </div>
          </div>
        </div>

        <footer className="maestro-modal-footer">
          <button
            type="button"
            className="btn btn-maestro-info"
            onClick={onClose}
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="btn btn-maestro-primary"
          >
            <Save size={17} />
            Guardar
          </button>
        </footer>
      </form>
    </div>
  )
}
