import {
  useEffect,
  useState,
} from 'react'

import {
  Save,
  X,
} from 'lucide-react'
import Select from 'react-select'
import { crearEstilosSelect } from '../../styles/reactSelectStyles'

import type {
  Contacto,
  ContactoFormData,
} from '../../types/contacto'

import type { Proveedor } from '../../types/proveedor'

interface FormularioContactoProps {
  abierto: boolean
  contacto: Contacto | null
  soloLectura?: boolean
  proveedores: Proveedor[]
  error: string
  onClose: () => void
  onSubmit: (
    datos: ContactoFormData,
  ) => void
}

interface ErroresFormulario {
  proveedorId: string
  nombreCompleto: string
  cargo: string
  telefono: string
  correo: string
}

const FORM_INICIAL: ContactoFormData = {
  proveedorId: '',
  nombreCompleto: '',
  cargo: '',
  telefono: '',
  correo: '',
}

const ERRORES_INICIALES:
  ErroresFormulario = {
    proveedorId: '',
    nombreCompleto: '',
    cargo: '',
    telefono: '',
    correo: '',
  }

const estilosSelect = (tieneError: boolean) =>
  crearEstilosSelect({ tieneError, zIndex: 20 })

export function FormularioContacto({
  abierto,
  contacto,
  soloLectura = false,
  proveedores,
  error,
  onClose,
  onSubmit,
}: FormularioContactoProps) {
  const [form, setForm] =
    useState<ContactoFormData>(
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

    if (contacto) {
      setForm({
        proveedorId:
          contacto.proveedorId,
        nombreCompleto:
          contacto.nombreCompleto,
        cargo: contacto.cargo,
        telefono: contacto.telefono,
        correo: contacto.correo,
      })
    } else {
      setForm(FORM_INICIAL)
    }

    setErrores(ERRORES_INICIALES)
  }, [abierto, contacto])

  if (!abierto) {
    return null
  }

  function validarFormulario(): boolean {
    const nuevosErrores:
      ErroresFormulario = {
        proveedorId: '',
        nombreCompleto: '',
        cargo: '',
        telefono: '',
        correo: '',
      }

    const nombre =
      form.nombreCompleto.trim()
    const cargo = form.cargo.trim()
    const telefono =
      form.telefono.trim()
    const correo =
      form.correo.trim()

    if (!form.proveedorId) {
      nuevosErrores.proveedorId =
        'Selecciona un proveedor'
    }

    if (!nombre) {
      nuevosErrores.nombreCompleto =
        'Campo requerido'
    } else if (nombre.length < 3) {
      nuevosErrores.nombreCompleto =
        'Debe tener al menos 3 caracteres'
    } else if (nombre.length > 120) {
      nuevosErrores.nombreCompleto =
        'No puede superar los 120 caracteres'
    }

    if (!cargo) {
      nuevosErrores.cargo =
        'Campo requerido'
    } else if (cargo.length < 2) {
      nuevosErrores.cargo =
        'Debe tener al menos 2 caracteres'
    } else if (cargo.length > 80) {
      nuevosErrores.cargo =
        'No puede superar los 80 caracteres'
    }

    const numerosTelefono =
      telefono.replace(/\D/g, '')

    if (!telefono) {
      nuevosErrores.telefono =
        'Campo requerido'
    } else if (
      numerosTelefono.length < 7 ||
      numerosTelefono.length > 15
    ) {
      nuevosErrores.telefono =
        'Ingresa un teléfono válido'
    }

    if (!correo) {
      nuevosErrores.correo =
        'Campo requerido'
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        correo,
      )
    ) {
      nuevosErrores.correo =
        'Ingresa un correo válido'
    }

    setErrores(nuevosErrores)

    return Object.values(
      nuevosErrores,
    ).every((mensaje) => !mensaje)
  }

  return (
    <div
      className="maestro-modal-backdrop contactos-page"
      role="presentation"
    >
      <div
        className="maestro-modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="contacto-form-title"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <div className="maestro-modal-header">
          <div className="maestro-modal-header__content">
            <h3
              id="contacto-form-title"
              className="maestro-modal-title"
            >
              {soloLectura ? 'Visualizar contacto' : contacto
                ? 'Editar contacto'
                : 'Registrar contacto'}
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
              proveedorId:
                form.proveedorId,
              nombreCompleto:
                form.nombreCompleto.trim(),
              cargo: form.cargo.trim(),
              telefono:
                form.telefono.trim(),
              correo:
                form.correo
                  .trim()
                  .toLowerCase(),
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

            <div className="mb-3">
              <label
                className="form-label required"
                htmlFor="contactoProveedor"
              >
                Proveedor

              </label>

              <Select
                inputId="contactoProveedor"
                options={proveedores.map((proveedor) => ({
                  value: String(proveedor.id),
                  label: proveedor.razonSocial,
                }))}
                value={proveedores
                  .map((proveedor) => ({
                    value: String(proveedor.id),
                    label: proveedor.razonSocial,
                  }))
                  .find((opcion) => opcion.value === form.proveedorId) ?? null}
                onChange={(opcion) => {
                  setForm((actual) => ({
                    ...actual,
                    proveedorId:
                      opcion?.value ?? '',
                  }))

                setErrores((actual) => ({
                  ...actual,
                  proveedorId: '',
                }))
                }}
                placeholder="Seleccionar"
                isClearable
                isSearchable
                styles={estilosSelect(Boolean(errores.proveedorId))}
              />

              {errores.proveedorId && (
                <div className="maestro-field-error">
                  {errores.proveedorId}
                </div>
              )}
            </div>

            <div className="row g-3">
              <div className="col-12 col-md-6">
                <label
                  className="form-label required"
                  htmlFor="contactoNombre"
                >
                  Nombre completo

                </label>

                <input
                  id="contactoNombre"
                  className={`form-control${
                    errores.nombreCompleto
                      ? ' maestro-control--error'
                      : ''
                  }`}
                  type="text"
                  maxLength={120}
                  value={
                    form.nombreCompleto
                  }
                  placeholder="Ej. Carlos Mendoza"
                  onChange={(event) => {
                    setForm((actual) => ({
                      ...actual,
                      nombreCompleto:
                        event.target.value,
                    }))

                    setErrores(
                      (actual) => ({
                        ...actual,
                        nombreCompleto: '',
                      }),
                    )
                  }}
                />

                {errores.nombreCompleto && (
                  <div className="maestro-field-error">
                    {
                      errores.nombreCompleto
                    }
                  </div>
                )}
              </div>

              <div className="col-12 col-md-6">
                <label
                  className="form-label required"
                  htmlFor="contactoCargo"
                >
                  Cargo

                </label>

                <input
                  id="contactoCargo"
                  className={`form-control${
                    errores.cargo
                      ? ' maestro-control--error'
                      : ''
                  }`}
                  type="text"
                  maxLength={80}
                  value={form.cargo}
                  placeholder="Ej. Ejecutivo de ventas"
                  onChange={(event) => {
                    setForm((actual) => ({
                      ...actual,
                      cargo:
                        event.target.value,
                    }))

                    setErrores(
                      (actual) => ({
                        ...actual,
                        cargo: '',
                      }),
                    )
                  }}
                />

                {errores.cargo && (
                  <div className="maestro-field-error">
                    {errores.cargo}
                  </div>
                )}
              </div>

              <div className="col-12 col-md-6">
                <label
                  className="form-label required"
                  htmlFor="contactoTelefono"
                >
                  Teléfono

                </label>

                <input
                  id="contactoTelefono"
                  className={`form-control${
                    errores.telefono
                      ? ' maestro-control--error'
                      : ''
                  }`}
                  type="tel"
                  maxLength={20}
                  value={form.telefono}
                  placeholder="Ej. 987654321"
                  onChange={(event) => {
                    setForm((actual) => ({
                      ...actual,
                      telefono:
                        event.target.value,
                    }))

                    setErrores(
                      (actual) => ({
                        ...actual,
                        telefono: '',
                      }),
                    )
                  }}
                />

                {errores.telefono && (
                  <div className="maestro-field-error">
                    {errores.telefono}
                  </div>
                )}
              </div>

              <div className="col-12 col-md-6">
                <label
                  className="form-label required"
                  htmlFor="contactoCorreo"
                >
                  Correo

                </label>

                <input
                  id="contactoCorreo"
                  className={`form-control${
                    errores.correo
                      ? ' maestro-control--error'
                      : ''
                  }`}
                  type="email"
                  maxLength={120}
                  value={form.correo}
                  placeholder="contacto@empresa.com"
                  onChange={(event) => {
                    setForm((actual) => ({
                      ...actual,
                      correo:
                        event.target.value,
                    }))

                    setErrores(
                      (actual) => ({
                        ...actual,
                        correo: '',
                      }),
                    )
                  }}
                />

                {errores.correo && (
                  <div className="maestro-field-error">
                    {errores.correo}
                  </div>
                )}
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

              {contacto
                ? 'Guardar cambios'
                : 'Registrar'}
            </button>
          </div>}
        </form>
      </div>
    </div>
  )
}
