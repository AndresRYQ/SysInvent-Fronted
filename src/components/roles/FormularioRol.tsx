import { Placeholder } from '../../constants/placeholders'
import Alert from '@mui/material/Alert'
import {
  Save,
  ShieldCheck,
  X,
} from 'lucide-react'
import {
  useState,
  type FormEvent,
} from 'react'

import {
  MODULOS_SISTEMA,
} from '../../services/rolService'

import type {
  Rol,
  RolFormData,
} from '../../types/rol'

interface FormularioRolProps {
  rol: Rol | null
  onClose: () => void
  onGuardar: (
    datos: RolFormData,
  ) => string | null
}

export function FormularioRol({
  rol,
  onClose,
  onGuardar,
}: FormularioRolProps) {
  const [datos, setDatos] =
    useState<RolFormData>(() => ({
      nombre: rol?.nombre ?? '',
      descripcion: rol?.descripcion ?? '',
      estado: rol?.estado ?? true,
      modulos: rol?.modulos ?? [],
    }))

  const [error, setError] = useState('')
  const [tipoAlerta, setTipoAlerta] = useState<'warning' | 'error'>('warning')
  const [errores, setErrores] = useState({ nombre: '', descripcion: '' })

  const todosSeleccionados =
    MODULOS_SISTEMA.every((modulo) =>
      datos.modulos.includes(modulo.id),
    )

  const cambiarModulo = (
    moduloId: string,
  ) => {
    setDatos((actual) => ({
      ...actual,
      modulos: actual.modulos.includes(
        moduloId,
      )
        ? actual.modulos.filter(
            (id) => id !== moduloId,
          )
        : [...actual.modulos, moduloId],
    }))
  }

  const manejarEnvio = (
    evento: FormEvent<HTMLFormElement>,
  ) => {
    evento.preventDefault()
    setError('')
    const nuevosErrores = { nombre: '', descripcion: '' }
    const nombre = datos.nombre.trim()
    const descripcion = datos.descripcion.trim()

    if (!nombre) nuevosErrores.nombre = 'Campo requerido'
    else if (nombre.length < 2) nuevosErrores.nombre = 'Debe tener al menos 2 caracteres'
    if (!descripcion) nuevosErrores.descripcion = 'Campo requerido'
    setErrores(nuevosErrores)
    if (nuevosErrores.nombre || nuevosErrores.descripcion) {
      setTipoAlerta('warning')
      setError('Completa correctamente los campos requeridos.')
      return
    }

    if (datos.modulos.length === 0) {
      setTipoAlerta('warning')
      setError(
        'Selecciona al menos un módulo.',
      )
      return
    }

    const mensaje = onGuardar(datos)

    if (mensaje) {
      setTipoAlerta('error')
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
        aria-labelledby="rol-form-title"
      >
        <header className="maestro-modal-header">
          <div className="maestro-modal-header__content">
            <h2
              id="rol-form-title"
              className="maestro-modal-title"
            >
              {rol
                ? 'Editar rol'
                : 'Nuevo rol'}
            </h2>

            <p className="maestro-modal-copy">
              Configura el rol y sus módulos.
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
            <Alert
              severity={tipoAlerta}
            >
              {error}
            </Alert>
          )}

          <div className="row g-3">
            <div className="col-12 col-md-7">
              <label
                className="form-label required"
                htmlFor="rolNombre"
              >
                Nombre del rol

              </label>

              <input
                id="rolNombre"
                className={`form-control${errores.nombre ? ' maestro-control--error' : ''}`}
                value={datos.nombre}
                placeholder={Placeholder.Ingresar}
                maxLength={60}
                onChange={(evento) => {
                  setDatos((actual) => ({
                    ...actual,
                    nombre:
                      evento.target.value,
                  }))
                  setErrores((actual) => ({ ...actual, nombre: '' }))
                }}
              />
              {errores.nombre && <div className="maestro-field-error">{errores.nombre}</div>}
            </div>

            <div className="col-12">
              <label
                className="form-label required"
                htmlFor="rolDescripcion"
              >
                Descripción

              </label>

              <textarea
                id="rolDescripcion"
                className={`form-control${errores.descripcion ? ' maestro-control--error' : ''}`}
                rows={3}
                maxLength={200}
                value={datos.descripcion}
                placeholder={Placeholder.Ingresar}
                onChange={(evento) => {
                  setDatos((actual) => ({
                    ...actual,
                    descripcion:
                      evento.target.value,
                  }))
                  setErrores((actual) => ({ ...actual, descripcion: '' }))
                }}
              />
              {errores.descripcion && <div className="maestro-field-error">{errores.descripcion}</div>}
            </div>

            <div className="col-12">
              <div className="role-permissions-header">
                <div>
                  <span className="form-label">
                    Módulos permitidos
                  </span>

                  <small>
                    {datos.modulos.length} de{' '}
                    {MODULOS_SISTEMA.length}
                  </small>
                </div>

                <label className="role-select-all">
                  <input
                    type="checkbox"
                    checked={todosSeleccionados}
                    onChange={(evento) =>
                      setDatos((actual) => ({
                        ...actual,
                        modulos:
                          evento.target.checked
                            ? MODULOS_SISTEMA.map(
                                (modulo) =>
                                  modulo.id,
                              )
                            : [],
                      }))
                    }
                  />

                  Seleccionar todos
                </label>
              </div>

              <div className="role-permissions-grid">
                {MODULOS_SISTEMA.map(
                  (modulo) => (
                    <label
                      className="role-permission-item"
                      key={modulo.id}
                    >
                      <input
                        type="checkbox"
                        checked={datos.modulos.includes(
                          modulo.id,
                        )}
                        onChange={() =>
                          cambiarModulo(
                            modulo.id,
                          )
                        }
                      />

                      <ShieldCheck size={16} />
                      <span>{modulo.nombre}</span>
                    </label>
                  ),
                )}
              </div>
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
