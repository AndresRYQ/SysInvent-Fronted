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

    if (!datos.nombre.trim()) {
      setError(
        'El nombre del rol es obligatorio.',
      )
      return
    }

    if (!datos.descripcion.trim()) {
      setError(
        'La descripción es obligatoria.',
      )
      return
    }

    if (datos.modulos.length === 0) {
      setError(
        'Selecciona al menos un módulo.',
      )
      return
    }

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
            <div
              className="alert alert-danger py-2"
              role="alert"
            >
              {error}
            </div>
          )}

          <div className="row g-3">
            <div className="col-12 col-md-7">
              <label
                className="form-label"
                htmlFor="rolNombre"
              >
                Nombre del rol
                <span className="maestro-required">
                  *
                </span>
              </label>

              <input
                id="rolNombre"
                className="form-control"
                value={datos.nombre}
                maxLength={60}
                onChange={(evento) =>
                  setDatos((actual) => ({
                    ...actual,
                    nombre:
                      evento.target.value,
                  }))
                }
              />
            </div>

            <div className="col-12 col-md-5">
              <label
                className="form-label"
                htmlFor="rolEstado"
              >
                Estado
              </label>

              <select
                id="rolEstado"
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

            <div className="col-12">
              <label
                className="form-label"
                htmlFor="rolDescripcion"
              >
                Descripción
                <span className="maestro-required">
                  *
                </span>
              </label>

              <textarea
                id="rolDescripcion"
                className="form-control"
                rows={3}
                maxLength={200}
                value={datos.descripcion}
                onChange={(evento) =>
                  setDatos((actual) => ({
                    ...actual,
                    descripcion:
                      evento.target.value,
                  }))
                }
              />
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
            className="btn maestro-btn-secondary"
            onClick={onClose}
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="btn maestro-btn-primary"
          >
            <Save size={17} />
            Guardar
          </button>
        </footer>
      </form>
    </div>
  )
}
