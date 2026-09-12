import {
  useEffect,
  useState,
  type FormEvent,
} from 'react'

import {
  Building2,
  Save,
  X,
} from 'lucide-react'

import type {
  Proveedor,
  ProveedorFormData,
} from '../../types/proveedor'

interface FormularioProveedorProps {
  proveedor?: Proveedor | null
  error: string
  onSubmit: (
    datos: ProveedorFormData,
  ) => void
  onCancelar: () => void
}

interface ErroresFormulario {
  ruc: string
  razonSocial: string
  correo: string
  telefono: string
  direccion: string
}

const FORM_INICIAL: ProveedorFormData = {
  ruc: '',
  razonSocial: '',
  correo: '',
  telefono: '',
  direccion: '',
  estado: true,
}

const ERRORES_INICIALES: ErroresFormulario = {
  ruc: '',
  razonSocial: '',
  correo: '',
  telefono: '',
  direccion: '',
}

export function FormularioProveedor({
  proveedor,
  error,
  onSubmit,
  onCancelar,
}: FormularioProveedorProps) {
  const [form, setForm] =
    useState<ProveedorFormData>(FORM_INICIAL)

  const [errores, setErrores] =
    useState<ErroresFormulario>(
      ERRORES_INICIALES,
    )

  useEffect(() => {
    if (proveedor) {
      setForm({
        ruc: proveedor.ruc,
        razonSocial: proveedor.razonSocial,
        correo: proveedor.correo,
        telefono: proveedor.telefono,
        direccion: proveedor.direccion,
        estado: proveedor.estado,
      })
    } else {
      setForm(FORM_INICIAL)
    }

    setErrores(ERRORES_INICIALES)
  }, [proveedor])

  function validarFormulario(): boolean {
    const nuevosErrores: ErroresFormulario = {
      ruc: '',
      razonSocial: '',
      correo: '',
      telefono: '',
      direccion: '',
    }

    const ruc = form.ruc.trim()
    const razonSocial =
      form.razonSocial.trim()
    const correo = form.correo.trim()
    const telefono = form.telefono.trim()
    const direccion = form.direccion.trim()

    if (!/^\d{11}$/.test(ruc)) {
      nuevosErrores.ruc =
        'El RUC debe contener exactamente 11 números'
    }

    if (razonSocial.length < 2) {
      nuevosErrores.razonSocial =
        'Debe tener al menos 2 caracteres'
    } else if (razonSocial.length > 120) {
      nuevosErrores.razonSocial =
        'No puede superar los 120 caracteres'
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        correo,
      )
    ) {
      nuevosErrores.correo =
        'Ingresa un correo electrónico válido'
    }

    const numerosTelefono =
      telefono.replace(/\D/g, '')

    if (
      numerosTelefono.length < 7 ||
      numerosTelefono.length > 15
    ) {
      nuevosErrores.telefono =
        'Ingresa un número de teléfono válido'
    }

    if (direccion.length < 5) {
      nuevosErrores.direccion =
        'Debe tener al menos 5 caracteres'
    } else if (direccion.length > 200) {
      nuevosErrores.direccion =
        'No puede superar los 200 caracteres'
    }

    setErrores(nuevosErrores)

    return Object.values(
      nuevosErrores,
    ).every((mensaje) => !mensaje)
  }

  function manejarEnvio(
    event: FormEvent<HTMLFormElement>,
  ): void {
    event.preventDefault()

    if (!validarFormulario()) {
      return
    }

    onSubmit({
      ruc: form.ruc.trim(),
      razonSocial:
        form.razonSocial.trim(),
      correo: form.correo
        .trim()
        .toLowerCase(),
      telefono: form.telefono.trim(),
      direccion: form.direccion.trim(),
      estado: form.estado,
    })
  }

  return (
    <form
      className="card border-0 shadow-sm"
      noValidate
      onSubmit={manejarEnvio}
    >
      <div className="card-header bg-white border-bottom p-4">
        <div className="d-flex align-items-center gap-3">
          <span className="maestro-cell-icon">
            <Building2 size={20} />
          </span>

          <div>
            <h2 className="h5 mb-1">
              Información del proveedor
            </h2>

            <p className="text-muted mb-0">
              Registra los datos fiscales y de contacto.
            </p>
          </div>
        </div>
      </div>

      <div className="card-body p-4">
        {error && (
          <div
            className="alert alert-danger"
            role="alert"
          >
            {error}
          </div>
        )}

        <div className="row g-4">
          <div className="col-12 col-lg-4">
            <label
              className="form-label maestro-label"
              htmlFor="proveedorRuc"
            >
              RUC
              <span className="maestro-required">
                *
              </span>
            </label>

            <input
              id="proveedorRuc"
              className={`form-control maestro-control${
                errores.ruc
                  ? ' maestro-control--error'
                  : ''
              }`}
              type="text"
              inputMode="numeric"
              maxLength={11}
              placeholder="Ej. 20123456789"
              value={form.ruc}
              aria-invalid={Boolean(
                errores.ruc,
              )}
              onChange={(event) => {
                const value =
                  event.target.value.replace(
                    /\D/g,
                    '',
                  )

                setForm((actual) => ({
                  ...actual,
                  ruc: value,
                }))

                setErrores((actual) => ({
                  ...actual,
                  ruc: '',
                }))
              }}
            />

            {errores.ruc && (
              <div className="maestro-field-error">
                {errores.ruc}
              </div>
            )}
          </div>

          <div className="col-12 col-lg-8">
            <label
              className="form-label maestro-label"
              htmlFor="proveedorRazonSocial"
            >
              Razón social
              <span className="maestro-required">
                *
              </span>
            </label>

            <input
              id="proveedorRazonSocial"
              className={`form-control maestro-control${
                errores.razonSocial
                  ? ' maestro-control--error'
                  : ''
              }`}
              type="text"
              maxLength={120}
              placeholder="Nombre legal del proveedor"
              value={form.razonSocial}
              aria-invalid={Boolean(
                errores.razonSocial,
              )}
              onChange={(event) => {
                setForm((actual) => ({
                  ...actual,
                  razonSocial:
                    event.target.value,
                }))

                setErrores((actual) => ({
                  ...actual,
                  razonSocial: '',
                }))
              }}
            />

            {errores.razonSocial && (
              <div className="maestro-field-error">
                {errores.razonSocial}
              </div>
            )}
          </div>

          <div className="col-12 col-lg-6">
            <label
              className="form-label maestro-label"
              htmlFor="proveedorCorreo"
            >
              Correo electrónico
              <span className="maestro-required">
                *
              </span>
            </label>

            <input
              id="proveedorCorreo"
              className={`form-control maestro-control${
                errores.correo
                  ? ' maestro-control--error'
                  : ''
              }`}
              type="email"
              maxLength={120}
              placeholder="ventas@proveedor.com"
              value={form.correo}
              aria-invalid={Boolean(
                errores.correo,
              )}
              onChange={(event) => {
                setForm((actual) => ({
                  ...actual,
                  correo: event.target.value,
                }))

                setErrores((actual) => ({
                  ...actual,
                  correo: '',
                }))
              }}
            />

            {errores.correo && (
              <div className="maestro-field-error">
                {errores.correo}
              </div>
            )}
          </div>

          <div className="col-12 col-lg-6">
            <label
              className="form-label maestro-label"
              htmlFor="proveedorTelefono"
            >
              Teléfono
              <span className="maestro-required">
                *
              </span>
            </label>

            <input
              id="proveedorTelefono"
              className={`form-control maestro-control${
                errores.telefono
                  ? ' maestro-control--error'
                  : ''
              }`}
              type="tel"
              maxLength={20}
              placeholder="Ej. 987654321"
              value={form.telefono}
              aria-invalid={Boolean(
                errores.telefono,
              )}
              onChange={(event) => {
                setForm((actual) => ({
                  ...actual,
                  telefono:
                    event.target.value,
                }))

                setErrores((actual) => ({
                  ...actual,
                  telefono: '',
                }))
              }}
            />

            {errores.telefono && (
              <div className="maestro-field-error">
                {errores.telefono}
              </div>
            )}
          </div>

          <div className="col-12">
            <label
              className="form-label maestro-label"
              htmlFor="proveedorDireccion"
            >
              Dirección
              <span className="maestro-required">
                *
              </span>
            </label>

            <textarea
              id="proveedorDireccion"
              className={`form-control maestro-control maestro-control--textarea${
                errores.direccion
                  ? ' maestro-control--error'
                  : ''
              }`}
              rows={3}
              maxLength={200}
              placeholder="Dirección fiscal del proveedor"
              value={form.direccion}
              aria-invalid={Boolean(
                errores.direccion,
              )}
              onChange={(event) => {
                setForm((actual) => ({
                  ...actual,
                  direccion:
                    event.target.value,
                }))

                setErrores((actual) => ({
                  ...actual,
                  direccion: '',
                }))
              }}
            />

            <div className="d-flex justify-content-between">
              <div>
                {errores.direccion && (
                  <span className="maestro-field-error">
                    {errores.direccion}
                  </span>
                )}
              </div>

              <small className="text-muted">
                {form.direccion.length}/200
              </small>
            </div>
          </div>

          <div className="col-12 col-lg-4">
            <label
              className="form-label maestro-label"
              htmlFor="proveedorEstado"
            >
              Estado
            </label>

            <select
              id="proveedorEstado"
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

      <div className="card-footer bg-white border-top p-4">
        <div className="d-flex flex-wrap justify-content-end gap-2">
          <button
            type="button"
            className="btn maestro-btn-secondary"
            onClick={onCancelar}
          >
            <X size={18} />
            Cancelar
          </button>

          <button
            type="submit"
            className="btn maestro-btn-primary"
          >
            <Save size={18} />
            {proveedor
              ? 'Guardar cambios'
              : 'Registrar proveedor'}
          </button>
        </div>
      </div>
    </form>
  )
}