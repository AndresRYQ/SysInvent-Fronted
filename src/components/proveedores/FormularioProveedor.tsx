import {
  useEffect,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from 'react'

import { Save, X } from 'lucide-react'

import type {
  Proveedor,
  ProveedorFormData,
} from '../../types/proveedor'

interface FormularioProveedorProps {
  proveedor?: Proveedor | null
  soloLectura?: boolean
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
  soloLectura = false,
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
      numerosTelefono.length !== 9
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
    })
  }

  return (
    <form
      className="card border-0 shadow-sm"
      noValidate
      onSubmit={manejarEnvio}
    >
      <div className="maestro-modal-body">
        {error && (
          <div
            className="alert alert-danger"
            role="alert"
          >
            {error}
          </div>
        )}

        <fieldset disabled={soloLectura}>
        <div className="row g-4">
          <div className="col-12 col-lg-4">
            <label
              className="form-label"
              htmlFor="proveedorRuc"
            >
              RUC
            </label>

            <input
              id="proveedorRuc"
              className={`form-control${
                !soloLectura ? ' required' : ''
              }${
                errores.ruc
                  ? ' maestro-control--error'
                  : ''
              }`}
              type="text"
              inputMode="numeric"
              maxLength={11}
              placeholder="Ingresar"
              value={form.ruc}
              aria-invalid={Boolean(
                errores.ruc,
              )}
              onKeyDown={permitirSoloNumeros}
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
              className="form-label"
              htmlFor="proveedorRazonSocial"
            >
              Razón social
            </label>

            <input
              id="proveedorRazonSocial"
              className={`form-control${
                !soloLectura ? ' required' : ''
              }${
                errores.razonSocial
                  ? ' maestro-control--error'
                  : ''
              }`}
              type="text"
              maxLength={120}
              placeholder="Ingresar"
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
              className="form-label"
              htmlFor="proveedorCorreo"
            >
              Correo electrónico
            </label>

            <input
              id="proveedorCorreo"
              className={`form-control${
                !soloLectura ? ' required' : ''
              }${
                errores.correo
                  ? ' maestro-control--error'
                  : ''
              }`}
              type="email"
              maxLength={120}
              placeholder="Ingresar"
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
              className="form-label"
              htmlFor="proveedorTelefono"
            >
              Teléfono
            </label>

            <input
              id="proveedorTelefono"
              className={`form-control${
                !soloLectura ? ' required' : ''
              }${
                errores.telefono
                  ? ' maestro-control--error'
                  : ''
              }`}
              type="tel"
              inputMode="numeric"
              maxLength={9}
              placeholder="Ingresar"
              value={form.telefono}
              aria-invalid={Boolean(
                errores.telefono,
              )}
              onKeyDown={permitirSoloNumeros}
              onChange={(event) => {
                const value = event.target.value.replace(/\D/g, '')

                setForm((actual) => ({
                  ...actual,
                  telefono: value,
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
              className="form-label"
              htmlFor="proveedorDireccion"
            >
              Dirección
            </label>

            <textarea
              id="proveedorDireccion"
              className={`form-control${
                !soloLectura ? ' required' : ''
              }${
                errores.direccion
                  ? ' maestro-control--error'
                  : ''
              }`}
              rows={3}
              maxLength={200}
              placeholder="Ingresar"
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

        </div>
        </fieldset>
      </div>

      {!soloLectura && <div className="maestro-modal-footer">
          <button
            type="button"
            className="btn btn-maestro-danger"
            onClick={onCancelar}
          >
            <X size={18} />
            Cancelar
          </button>

          <button
            type="submit"
            className="btn btn-maestro-primary"
          >
            <Save size={18} />
            {proveedor
              ? 'Guardar cambios'
              : 'Registrar proveedor'}
          </button>
      </div>}
    </form>
  )
}

const teclasEdicionNumerica = new Set([
  'Backspace', 'Delete', 'Tab', 'ArrowLeft',
  'ArrowRight', 'Home', 'End',
])

function permitirSoloNumeros(event: KeyboardEvent<HTMLInputElement>): void {
  if (!/^\d$/.test(event.key) && !teclasEdicionNumerica.has(event.key) && !event.ctrlKey && !event.metaKey) {
    event.preventDefault()
  }
}
