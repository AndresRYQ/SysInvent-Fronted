import { Placeholder } from '../../constants/placeholders'
import Select from 'react-select'
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
import { crearEstilosSelect } from '../../styles/reactSelectStyles'

interface ErroresFormulario {
  usuario: string
  nombreCompleto: string
  nombres: string
  apePaterno: string
  apeMaterno: string
  email: string
  contrasena: string
  rol: string
}

interface FormularioUsuarioProps {
  usuario: UsuarioLogin | null
  roles: Rol[]
  onClose: () => void
  onGuardar: (
  datos: UsuarioFormData,
  ) =>
    | string
    | null
    | Promise<string | null>
}

export function FormularioUsuario({
  usuario,
  roles,
  onClose,
  onGuardar,
}: FormularioUsuarioProps) {
  const [datos, setDatos] =
    useState<UsuarioFormData>(() => ({
      usuario:
        usuario?.dni ??
        usuario?.usuario ??
        '',
      nombreCompleto:
        usuario?.nombreCompleto ?? '',
      email: usuario?.email ?? '',
      contrasena: '',
      rol: usuario?.rol ?? '',
      estado: usuario?.estado ?? true,

      dni:
        usuario?.dni ??
        usuario?.usuario ??
        '',
      nombres: usuario?.nombres ?? '',
      apePaterno:
        usuario?.apePaterno ?? '',
      apeMaterno:
        usuario?.apeMaterno ?? '',
      rolId: usuario?.rolId ?? null,
    }))

  const [error, setError] = useState('')
  const [errores, setErrores] =
    useState<ErroresFormulario>({
      usuario: '',
      nombreCompleto: '',
      nombres: '',
      apePaterno: '',
      apeMaterno: '',
      email: '',
      contrasena: '',
      rol: '',
    })

  const rolesDisponibles = roles.filter(
    (rol) =>
      rol.estado ||
      rol.nombre === usuario?.rol,
  )

const manejarEnvio = async (
  evento: FormEvent<HTMLFormElement>,
) => {
    evento.preventDefault()
    setError('')
    const nuevosErrores: ErroresFormulario = {
      usuario: '',
      nombreCompleto: '',
      nombres: '',
      apePaterno: '',
      apeMaterno: '',
      email: '',
      contrasena: '',
      rol: '',
    }

    const dni =
      (datos.dni ?? datos.usuario).trim()

    if (!dni) {
      nuevosErrores.usuario =
        'Campo requerido'
    } else if (!/^\d{8}$/.test(dni)) {
      nuevosErrores.usuario =
        'El DNI debe contener 8 números'
    }

    if (!(datos.nombres ?? '').trim()) {
      nuevosErrores.nombres =
        'Campo requerido'
    }

    if (!(datos.apePaterno ?? '').trim()) {
      nuevosErrores.apePaterno =
        'Campo requerido'
    }

    if (!(datos.apeMaterno ?? '').trim()) {
      nuevosErrores.apeMaterno =
        'Campo requerido'
    }

    if (!datos.email.trim()) {
      nuevosErrores.email =
        'Campo requerido'
    } else if (
      !/^\S+@\S+\.\S+$/.test(
        datos.email.trim(),
      )
    ) {
      nuevosErrores.email =
        'Ingresa un correo válido'
    }

    if (!datos.rolId) {
      nuevosErrores.rol =
        'Campo requerido'
    }

    if (!usuario && !datos.contrasena) {
      nuevosErrores.contrasena =
        'Campo requerido'
    } else if (
      datos.contrasena &&
      datos.contrasena.length < 12
    ) {
      nuevosErrores.contrasena =
        'Debe tener al menos 12 caracteres'
    }
    setErrores(nuevosErrores)
    if (Object.values(nuevosErrores).some(Boolean)) {
      return
    }

   const mensaje = await onGuardar(datos)

    if (mensaje) {
      setError(mensaje)
    }
  }

  return (
    <div
      className="maestro-modal-backdrop"
      role="presentation"
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
                htmlFor="usuarioDni"
              >
                DNI
              </label>

              <div className="input-group">
                <span className="input-group-text">
                  <UserRound size={16} />
                </span>

                <input
                  id="usuarioDni"
                  className={`form-control${errores.usuario ? ' maestro-control--error' : ''}`}
                  value={
                    datos.dni ??
                    datos.usuario
                  }
                  placeholder="Ingrese 8 números"
                  inputMode="numeric"
                  maxLength={8}
                  disabled={Boolean(usuario)}
                  autoComplete="username"
                  onChange={(evento) => {
                    const valor =
                      evento.target.value.replace(
                        /\D/g,
                        '',
                      )

                    setDatos((actual) => ({
                      ...actual,
                      usuario: valor,
                      dni: valor,
                    }))

                    setErrores((actual) => ({
                      ...actual,
                      usuario: '',
                    }))
                  }}
                />
              </div>

              {errores.usuario && (
                <div className="maestro-field-error">
                  {errores.usuario}
                </div>
              )}
            </div>

            <div className="col-12 col-md-6">
              <label
                className="form-label required"
                htmlFor="usuarioNombres"
              >
                Nombres
              </label>

              <input
                id="usuarioNombres"
                className={`form-control${errores.nombres ? ' maestro-control--error' : ''}`}
                value={datos.nombres ?? ''}
                placeholder={Placeholder.Ingresar}
                maxLength={80}
                onChange={(evento) => {
                  setDatos((actual) => ({
                    ...actual,
                    nombres:
                      evento.target.value,
                  }))

                  setErrores((actual) => ({
                    ...actual,
                    nombres: '',
                  }))
                }}
              />

              {errores.nombres && (
                <div className="maestro-field-error">
                  {errores.nombres}
                </div>
              )}
            </div>

            <div className="col-12 col-md-6">
              <label
                className="form-label required"
                htmlFor="usuarioApePaterno"
              >
                Apellido paterno
              </label>

              <input
                id="usuarioApePaterno"
                className={`form-control${errores.apePaterno ? ' maestro-control--error' : ''}`}
                value={datos.apePaterno ?? ''}
                placeholder={Placeholder.Ingresar}
                maxLength={60}
                onChange={(evento) => {
                  setDatos((actual) => ({
                    ...actual,
                    apePaterno:
                      evento.target.value,
                  }))

                  setErrores((actual) => ({
                    ...actual,
                    apePaterno: '',
                  }))
                }}
              />

              {errores.apePaterno && (
                <div className="maestro-field-error">
                  {errores.apePaterno}
                </div>
              )}
            </div>

            <div className="col-12 col-md-6">
              <label
                className="form-label required"
                htmlFor="usuarioApeMaterno"
              >
                Apellido materno
              </label>

              <input
                id="usuarioApeMaterno"
                className={`form-control${errores.apeMaterno ? ' maestro-control--error' : ''}`}
                value={datos.apeMaterno ?? ''}
                placeholder={Placeholder.Ingresar}
                maxLength={60}
                onChange={(evento) => {
                  setDatos((actual) => ({
                    ...actual,
                    apeMaterno:
                      evento.target.value,
                  }))

                  setErrores((actual) => ({
                    ...actual,
                    apeMaterno: '',
                  }))
                }}
              />

              {errores.apeMaterno && (
                <div className="maestro-field-error">
                  {errores.apeMaterno}
                </div>
              )}
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
                className={`form-control${errores.email ? ' maestro-control--error' : ''}`}
                type="email"
                value={datos.email}
                placeholder={Placeholder.Ingresar}
                maxLength={120}
                autoComplete="email"
                onChange={(evento) => {
                  setDatos((actual) => ({
                    ...actual,
                    email:
                      evento.target.value,
                  }))
                  setErrores((actual) => ({ ...actual, email: '' }))
                }}
              />
              {errores.email && <div className="maestro-field-error">{errores.email}</div>}
            </div>

            <div className="col-12 col-md-6">
              <label
                className="form-label required"
                htmlFor="usuarioRol"
              >
                Rol

              </label>

              <Select
                inputId="usuarioRol"
                classNamePrefix="maestro-select"
                options={rolesDisponibles.map(
                  (rol) => ({
                    value: Number(rol.id),
                    label: rol.nombre,
                  }),
                )}
                value={
                  rolesDisponibles
                    .map((rol) => ({
                      value: Number(rol.id),
                      label: rol.nombre,
                    }))
                    .find(
                      (opcion) =>
                        opcion.value ===
                        datos.rolId,
                    ) ?? null
                }
                onChange={(opcion) => {
                  const rolSeleccionado =
                    rolesDisponibles.find(
                      (rol) =>
                        Number(rol.id) ===
                        opcion?.value,
                    )

                  setDatos((actual) => ({
                    ...actual,
                    rolId:
                      opcion?.value ?? null,
                    rol:
                      rolSeleccionado?.nombre ??
                      '',
                  }))

                  setErrores((actual) => ({
                    ...actual,
                    rol: '',
                  }))
                }}
                placeholder={Placeholder.Seleccionar}
                isSearchable={false}
                menuPortalTarget={document.body}
                styles={crearEstilosSelect({
                  tieneError: Boolean(errores.rol),
                  zIndex: 1300,
                })}
              />
              {errores.rol && <div className="maestro-field-error">{errores.rol}</div>}
            </div>

            <div className="col-12 col-md-6">
              <label
                className={usuario ? 'form-label' : 'form-label required'}
                htmlFor="usuarioContrasena"
              >
                Contraseña
              </label>

              <input
                id="usuarioContrasena"
                className={`form-control${errores.contrasena ? ' maestro-control--error' : ''}`}
                type="password"
                value={datos.contrasena}
                minLength={12}
                maxLength={80}
                autoComplete="new-password"
                placeholder={Placeholder.Ingresar}
                onChange={(evento) => {
                  setDatos((actual) => ({
                    ...actual,
                    contrasena:
                      evento.target.value,
                  }))
                  setErrores((actual) => ({ ...actual, contrasena: '' }))
                }}
              />
              {errores.contrasena && <div className="maestro-field-error">{errores.contrasena}</div>}
            </div>
          </div>
        </div>

        <footer className="maestro-modal-footer">
          <button
            type="button"
            className="btn btn-maestro-danger"
            onClick={onClose}
          >
            <X size={17} />
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
