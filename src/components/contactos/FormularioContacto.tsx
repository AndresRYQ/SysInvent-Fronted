import {
  useEffect,
  useState,
} from 'react'

import {
  Save,
  X,
} from 'lucide-react'

import type {
  Contacto,
  ContactoFormData,
} from '../../types/contacto'

import type { Proveedor } from '../../types/proveedor'

interface FormularioContactoProps {
  abierto: boolean
  contacto: Contacto | null
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
  estado: true,
}

const ERRORES_INICIALES:
  ErroresFormulario = {
    proveedorId: '',
    nombreCompleto: '',
    cargo: '',
    telefono: '',
    correo: '',
  }

export function FormularioContacto({
  abierto,
  contacto,
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
        estado: contacto.estado,
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
      className="maestro-modal-backdrop"
      role="presentation"
      onClick={onClose}
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
              {contacto
                ? 'Editar contacto'
                : 'Registrar contacto'}
            </h3>

            <p className="maestro-modal-copy mb-0">
              Registra el contacto comercial
              asociado a un proveedor.
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
              estado: form.estado,
            })
          }}
        >
          <div className="maestro-modal-body">
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
                className="form-label maestro-label"
                htmlFor="contactoProveedor"
              >
                Proveedor
                <span className="maestro-required">
                  *
                </span>
              </label>

              <select
                id="contactoProveedor"
                className={`form-select maestro-control${
                  errores.proveedorId
                    ? ' maestro-control--error'
                    : ''
                }`}
                value={form.proveedorId}
                onChange={(event) => {
                  setForm((actual) => ({
                    ...actual,
                    proveedorId:
                      event.target.value,
                  }))

                  setErrores((actual) => ({
                    ...actual,
                    proveedorId: '',
                  }))
                }}
              >
                <option value="">
                  Selecciona un proveedor
                </option>

                {proveedores.map(
                  (proveedor) => (
                    <option
                      key={proveedor.id}
                      value={proveedor.id}
                    >
                      {proveedor.razonSocial}
                    </option>
                  ),
                )}
              </select>

              {errores.proveedorId && (
                <div className="maestro-field-error">
                  {errores.proveedorId}
                </div>
              )}
            </div>

            <div className="row g-3">
              <div className="col-12 col-md-6">
                <label
                  className="form-label maestro-label"
                  htmlFor="contactoNombre"
                >
                  Nombre completo
                  <span className="maestro-required">
                    *
                  </span>
                </label>

                <input
                  id="contactoNombre"
                  className={`form-control maestro-control${
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
                  className="form-label maestro-label"
                  htmlFor="contactoCargo"
                >
                  Cargo
                  <span className="maestro-required">
                    *
                  </span>
                </label>

                <input
                  id="contactoCargo"
                  className={`form-control maestro-control${
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
                  className="form-label maestro-label"
                  htmlFor="contactoTelefono"
                >
                  Teléfono
                  <span className="maestro-required">
                    *
                  </span>
                </label>

                <input
                  id="contactoTelefono"
                  className={`form-control maestro-control${
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
                  className="form-label maestro-label"
                  htmlFor="contactoCorreo"
                >
                  Correo
                  <span className="maestro-required">
                    *
                  </span>
                </label>

                <input
                  id="contactoCorreo"
                  className={`form-control maestro-control${
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

              <div className="col-12">
                <label
                  className="form-label maestro-label"
                  htmlFor="contactoEstado"
                >
                  Estado
                </label>

                <select
                  id="contactoEstado"
                  className="form-select maestro-control"
                  value={
                    form.estado
                      ? 'activo'
                      : 'inactivo'
                  }
                  onChange={(event) =>
                    setForm((actual) => ({
                      ...actual,
                      estado:
                        event.target.value ===
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

          <div className="maestro-modal-footer">
            <button
              type="button"
              className="btn maestro-btn-secondary"
              onClick={onClose}
            >
              <X size={18} />
              Cancelar
            </button>

            <button
              type="submit"
              className="btn maestro-btn-primary"
            >
              <Save size={18} />

              {contacto
                ? 'Guardar cambios'
                : 'Registrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}