import { Placeholder } from '../../constants/placeholders'
import { CharacterCounter } from '../common/CharacterCounter'
import {
  useEffect,
  useState,
} from 'react'

import {
  Save,
  X,
} from 'lucide-react'

import type {
  ParteEquipo,
  ParteEquipoFormData,
} from '../../types/parteEquipo'

interface FormularioParteEquipoProps {
  abierto: boolean
  parteEquipo: ParteEquipo | null
  soloLectura?: boolean
  error: string
  onClose: () => void
  onSubmit: (
    datos: ParteEquipoFormData,
  ) => void
}

interface ErroresFormulario {
  codigo: string
  nombre: string
  descripcion: string
}

const FORM_INICIAL:
  ParteEquipoFormData = {
    codigo: '',
    nombre: '',
    descripcion: '',
    estado: true,
  }

const ERRORES_INICIALES:
  ErroresFormulario = {
    codigo: '',
    nombre: '',
    descripcion: '',
  }

export function FormularioParteEquipo({
  abierto,
  parteEquipo,
  soloLectura = false,
  error,
  onClose,
  onSubmit,
}: FormularioParteEquipoProps) {
  const [form, setForm] =
    useState<ParteEquipoFormData>(
      FORM_INICIAL,
    )

  const [errores, setErrores] =
    useState<ErroresFormulario>(
      ERRORES_INICIALES,
    )

  useEffect(() => {
    if (!abierto) {
      return
    }

    if (parteEquipo) {
      setForm({
        codigo: parteEquipo.codigo,
        nombre: parteEquipo.nombre,
        descripcion:
          parteEquipo.descripcion,
        estado: parteEquipo.estado,
      })
    } else {
      setForm(FORM_INICIAL)
    }

    setErrores(ERRORES_INICIALES)
  }, [abierto, parteEquipo])

  if (!abierto) {
    return null
  }

  function validarFormulario(): boolean {
    const nuevosErrores:
      ErroresFormulario = {
        codigo: '',
        nombre: '',
        descripcion: '',
      }

    const codigo = form.codigo
      .trim()
      .toUpperCase()

    const nombre = form.nombre.trim()
    const descripcion =
      form.descripcion.trim()

    if (!codigo) {
      nuevosErrores.codigo =
        'Campo requerido'
    } else if (
      !/^[A-Z0-9-]{3,50}$/.test(
        codigo,
      )
    ) {
      nuevosErrores.codigo =
        'Usa entre 3 y 50 letras, números o guiones'
    }

    if (!nombre) {
      nuevosErrores.nombre =
        'Campo requerido'
    } else if (nombre.length < 2) {
      nuevosErrores.nombre =
        'Debe tener al menos 2 caracteres'
    } else if (nombre.length > 150) {
      nuevosErrores.nombre =
        'No puede superar los 150 caracteres'
    }

    if (!descripcion) {
      nuevosErrores.descripcion =
        'Campo requerido'
    } else if (
      descripcion.length < 5
    ) {
      nuevosErrores.descripcion =
        'Debe tener al menos 5 caracteres'
    } else if (
      descripcion.length > 255
    ) {
      nuevosErrores.descripcion =
        'No puede superar los 255 caracteres'
    }

    setErrores(nuevosErrores)

    return Object.values(
      nuevosErrores,
    ).every((mensaje) => !mensaje)
  }

  return (
    <div
      className="maestro-modal-backdrop"
      role="presentation"
    >
      <div
        className="maestro-modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="parte-equipo-form-title"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <div className="maestro-modal-header">
          <div className="maestro-modal-header__content">
            <h3
              id="parte-equipo-form-title"
              className="maestro-modal-title"
            >
              {soloLectura ? 'Visualizar parte de equipo' : parteEquipo
                ? 'Editar parte de equipo'
                : 'Registrar parte de equipo'}
            </h3>

          </div>

          <button
            type="button"
            className="btn maestro-modal-close"
            onClick={onClose}
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>
        </div>

        <form
          noValidate
          onSubmit={(event) => {
            event.preventDefault()

            if (!validarFormulario()) {
              return
            }

            onSubmit({
              codigo:
                form.codigo
                  .trim()
                  .toUpperCase(),
              nombre:
                form.nombre.trim(),
              descripcion:
                form.descripcion.trim(),
            })
          }}
        >
          <div className={`maestro-modal-body${soloLectura ? ' modo-visualizacion' : ''}`}>
            <fieldset disabled={soloLectura}>
            {error && (
              <div
                className="alert alert-danger py-2"
                role="alert"
              >
                {error}
              </div>
            )}

            <div className="row g-3">
              <div className="col-12 col-md-5">
                <label
                  className="form-label required"
                  htmlFor="parteEquipoCodigo"
                >
                  Código

                </label>

                <input
                  id="parteEquipoCodigo"
                  className={`form-control${
                    errores.codigo
                      ? ' maestro-control--error'
                      : ''
                  }`}
                  type="text"
                  maxLength={50}
                  value={form.codigo}
                  placeholder={Placeholder.Ingresar}
                  onChange={(event) => {
                    setForm((actual) => ({
                      ...actual,
                      codigo:
                        event.target.value
                          .toUpperCase(),
                    }))

                    setErrores(
                      (actual) => ({
                        ...actual,
                        codigo: '',
                      }),
                    )
                  }}
                />
                <CharacterCounter value={form.codigo} maxLength={50} />

                {errores.codigo && (
                  <div className="maestro-field-error">
                    {errores.codigo}
                  </div>
                )}
              </div>

              <div className="col-12 col-md-7">
                <label
                  className="form-label required"
                  htmlFor="parteEquipoNombre"
                >
                  Nombre

                </label>

                <input
                  id="parteEquipoNombre"
                  className={`form-control${
                    errores.nombre
                      ? ' maestro-control--error'
                      : ''
                  }`}
                  type="text"
                  maxLength={150}
                  value={form.nombre}
                  placeholder={Placeholder.Ingresar}
                  onChange={(event) => {
                    setForm((actual) => ({
                      ...actual,
                      nombre:
                        event.target.value,
                    }))

                    setErrores(
                      (actual) => ({
                        ...actual,
                        nombre: '',
                      }),
                    )
                  }}
                />
                <CharacterCounter value={form.nombre} maxLength={150} />

                {errores.nombre && (
                  <div className="maestro-field-error">
                    {errores.nombre}
                  </div>
                )}
              </div>

              <div className="col-12">
                <label
                  className="form-label required"
                  htmlFor="parteEquipoDescripcion"
                >
                  Descripción

                </label>

                <textarea
                  id="parteEquipoDescripcion"
                  className={`form-control${
                    errores.descripcion
                      ? ' maestro-control--error'
                      : ''
                  }`}
                  rows={4}
                  maxLength={255}
                  value={
                    form.descripcion
                  }
                  onChange={(event) => {
                    setForm((actual) => ({
                      ...actual,
                      descripcion:
                        event.target.value,
                    }))

                    setErrores(
                      (actual) => ({
                        ...actual,
                        descripcion: '',
                      }),
                    )
                  }}
                />

                <div className="d-flex justify-content-between">
                  <div>
                    {errores.descripcion && (
                      <span className="maestro-field-error">
                        {
                          errores.descripcion
                        }
                      </span>
                    )}
                  </div>

                  <CharacterCounter value={form.descripcion} maxLength={255} />
                </div>
              </div>

            </div>
            </fieldset>
          </div>

          {!soloLectura && <div className="maestro-modal-footer">
            <button
              type="button"
              className="btn btn-maestro-danger"
              onClick={onClose}
            >
              <X size={18} />
              Cancelar
            </button>

            <button
              type="submit"
              className="btn btn-maestro-primary"
            >
              <Save size={18} />

              {parteEquipo
                ? 'Guardar cambios'
                : 'Registrar'}
            </button>
          </div>}
        </form>
      </div>
    </div>
  )
}
