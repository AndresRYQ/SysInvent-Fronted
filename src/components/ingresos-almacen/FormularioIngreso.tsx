
import { useEffect, useState } from 'react'
import { ChevronDown, Save, X } from 'lucide-react'

import type { IngresoAlmacen } from '../../types/ingresoAlmacen'

export type IngresoFormPayload = Pick<
  IngresoAlmacen,
  | 'fechaRegistro'
  | 'numeroIngreso'
  | 'proveedor'
  | 'producto'
  | 'unidadMedida'
  | 'cantidad'
  | 'almacen'
  | 'observacion'
>

interface FormularioIngresoProps {
  abierto: boolean
  ingreso: IngresoAlmacen | null
  numeroIngresoSugerido: string
  onClose: () => void
  onSubmit: (ingreso: IngresoFormPayload) => void
}

interface FormularioIngresoState {
  fechaRegistro: string
  numeroIngreso: string
  proveedor: string
  producto: string
  unidadMedida: string
  cantidad: string
  almacen: string
  observacion: string
}

type CampoRequerido = Exclude<keyof FormularioIngresoState, 'observacion'>

type FormularioIngresoErrores = Record<CampoRequerido, boolean>

const PROVEEDORES = [
  'Ferreteria Industrial SAC',
  'Distribuidora Lima Norte',
  'Importaciones del Sur',
  'Comercial Huaral EIRL',
]

const PRODUCTOS = [
  'Guantes de nitrilo',
  'Mascarillas N95',
  'Cinta de embalaje',
  'Lentes de seguridad',
  'Tornillos hexagonales',
  'Desinfectante industrial',
  'Casco de seguridad',
  'Aceite lubricante',
]

const UNIDADES_MEDIDA = [
  'Caja',
  'Paquete',
  'Rollo',
  'Unidad',
  'Bolsa',
  'Galon',
  'Litro',
]

const ALMACENES = [
  'Almacén Central',
  'Almacén Secundario',
]

const ERRORES_INICIALES: FormularioIngresoErrores = {
  fechaRegistro: false,
  numeroIngreso: false,
  proveedor: false,
  producto: false,
  unidadMedida: false,
  cantidad: false,
  almacen: false,
}

function crearFechaActualISO() {
  return new Date().toISOString().slice(0, 10)
}

function crearFormInicial(
  numeroIngreso: string,
): FormularioIngresoState {
  return {
    fechaRegistro: crearFechaActualISO(),
    numeroIngreso,
    proveedor: '',
    producto: '',
    unidadMedida: '',
    cantidad: '',
    almacen: '',
    observacion: '',
  }
}

function SelectField({
  id,
  label,
  value,
  options,
  error,
  onChange,
}: {
  id: string
  label: string
  value: string
  options: string[]
  error: boolean
  onChange: (value: string) => void
}) {
  const [abierto, setAbierto] = useState(false)

  return (
    <div>
      <label
        className="form-label maestro-label"
        htmlFor={id}
      >
        {label}
        <span className="maestro-required" aria-hidden="true">
          *
        </span>
      </label>

      <div className={`maestro-select-wrap${abierto ? ' is-open' : ''}`}>
        <select
          id={id}
          className={`form-select maestro-control maestro-select-control${error ? ' maestro-control--error' : ''
            }`}
          value={value}
          aria-invalid={error}
          aria-describedby={error ? `${id}Error` : undefined}
          onMouseDown={() => setAbierto(true)}
          onKeyDown={() => setAbierto(true)}
          onFocus={() => setAbierto(true)}
          onBlur={() => setAbierto(false)}
          onChange={(event) => {
            onChange(event.target.value)
            setAbierto(false)
          }}
          required
        >
          <option value="">Seleccione</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown size={16} />
      </div>

      {error && (
        <div
          id={`${id}Error`}
          className="maestro-field-error"
        >
          Campo requerido
        </div>
      )}
    </div>
  )
}

export function FormularioIngreso({
  abierto,
  ingreso,
  numeroIngresoSugerido,
  onClose,
  onSubmit,
}: FormularioIngresoProps) {
  const [form, setForm] = useState<FormularioIngresoState>(
    crearFormInicial(numeroIngresoSugerido),
  )
  const [errores, setErrores] =
    useState<FormularioIngresoErrores>(ERRORES_INICIALES)

  useEffect(() => {
    if (!abierto) {
      return
    }

    if (ingreso) {
      setForm({
        fechaRegistro: ingreso.fechaRegistro,
        numeroIngreso: ingreso.numeroIngreso,
        proveedor: ingreso.proveedor,
        producto: ingreso.producto,
        unidadMedida: ingreso.unidadMedida,
        cantidad: String(ingreso.cantidad),
        almacen: ingreso.almacen,
        observacion: ingreso.observacion,
      })
      setErrores(ERRORES_INICIALES)
      return
    }

    setForm(crearFormInicial(numeroIngresoSugerido))
    setErrores(ERRORES_INICIALES)
  }, [abierto, ingreso, numeroIngresoSugerido])

  if (!abierto) {
    return null
  }

  const actualizarCampo = (
    campo: keyof FormularioIngresoState,
    valor: string,
  ) => {
    setForm((actual) => ({
      ...actual,
      [campo]: valor,
    }))

    if (
      campo !== 'observacion' &&
      errores[campo] &&
      valor.trim().length > 0
    ) {
      setErrores((actual) => ({
        ...actual,
        [campo]: false,
      }))
    }
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
        aria-labelledby="ingreso-form-title"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <div className="maestro-modal-header">
          <div className="maestro-modal-header__content">
            <h3
              id="ingreso-form-title"
              className="maestro-modal-title"
            >
              {ingreso
                ? 'Editar ingreso'
                : 'Registrar ingreso'}
            </h3>
          </div>

          <button
            type="button"
            className="btn maestro-modal-close"
            onClick={onClose}
            aria-label="Cerrar modal"
          >
            <X size={18} />
          </button>
        </div>

        <form
          noValidate
          onSubmit={(event) => {
            event.preventDefault()

            const nuevosErrores = {
              fechaRegistro:
                form.fechaRegistro.trim().length === 0,
              numeroIngreso:
                form.numeroIngreso.trim().length === 0,
              proveedor:
                form.proveedor.trim().length === 0,
              producto:
                form.producto.trim().length === 0,
              unidadMedida:
                form.unidadMedida.trim().length === 0,
              cantidad:
                form.cantidad.trim().length === 0 ||
                Number(form.cantidad) <= 0,
              almacen:
                form.almacen.trim().length === 0,
            }

            setErrores(nuevosErrores)

            if (Object.values(nuevosErrores).some(Boolean)) {
              return
            }

            onSubmit({
              fechaRegistro: form.fechaRegistro,
              numeroIngreso: form.numeroIngreso,
              proveedor: form.proveedor,
              producto: form.producto,
              unidadMedida: form.unidadMedida,
              cantidad: Number(form.cantidad),
              almacen: form.almacen,
              observacion: form.observacion.trim(),
            })
          }}
        >
          <div className="maestro-modal-body">
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <label
                  className="form-label maestro-label"
                  htmlFor="ingresoFechaModal"
                >
                  Fecha de registro
                  <span className="maestro-required" aria-hidden="true">
                    *
                  </span>
                </label>

                <input
                  id="ingresoFechaModal"
                  className={`form-control maestro-control${errores.fechaRegistro
                      ? ' maestro-control--error'
                      : ''
                    }`}
                  type="date"
                  value={form.fechaRegistro}
                  aria-invalid={errores.fechaRegistro}
                  aria-describedby={
                    errores.fechaRegistro
                      ? 'ingresoFechaModalError'
                      : undefined
                  }
                  onChange={(event) =>
                    actualizarCampo('fechaRegistro', event.target.value)
                  }
                  required
                />

                {errores.fechaRegistro && (
                  <div
                    id="ingresoFechaModalError"
                    className="maestro-field-error"
                  >
                    Campo requerido
                  </div>
                )}
              </div>

              <div className="col-12 col-md-6">
                <label
                  className="form-label maestro-label"
                  htmlFor="ingresoNumeroModal"
                >
                  Nro. de ingreso
                  <span className="maestro-required" aria-hidden="true">
                    *
                  </span>
                </label>

                <input
                  id="ingresoNumeroModal"
                  className={`form-control maestro-control${errores.numeroIngreso
                      ? ' maestro-control--error'
                      : ''
                    }`}
                  type="text"
                  value={form.numeroIngreso}
                  readOnly
                  aria-invalid={errores.numeroIngreso}
                  aria-describedby={
                    errores.numeroIngreso
                      ? 'ingresoNumeroModalError'
                      : undefined
                  }
                  required
                />

                {errores.numeroIngreso && (
                  <div
                    id="ingresoNumeroModalError"
                    className="maestro-field-error"
                  >
                    Campo requerido
                  </div>
                )}
              </div>

              <div className="col-12 col-md-6">
                <SelectField
                  id="ingresoProveedorModal"
                  label="Proveedor"
                  value={form.proveedor}
                  options={PROVEEDORES}
                  error={errores.proveedor}
                  onChange={(value) =>
                    actualizarCampo('proveedor', value)
                  }
                />
              </div>

              <div className="col-12 col-md-6">
                <SelectField
                  id="ingresoProductoModal"
                  label="Producto"
                  value={form.producto}
                  options={PRODUCTOS}
                  error={errores.producto}
                  onChange={(value) =>
                    actualizarCampo('producto', value)
                  }
                />
              </div>

              <div className="col-12 col-md-4">
                <SelectField
                  id="ingresoUnidadModal"
                  label="Unidad de medida"
                  value={form.unidadMedida}
                  options={UNIDADES_MEDIDA}
                  error={errores.unidadMedida}
                  onChange={(value) =>
                    actualizarCampo('unidadMedida', value)
                  }
                />
              </div>

              <div className="col-12 col-md-4">
                <label
                  className="form-label maestro-label"
                  htmlFor="ingresoCantidadModal"
                >
                  Cantidad
                  <span className="maestro-required" aria-hidden="true">
                    *
                  </span>
                </label>

                <input
                  id="ingresoCantidadModal"
                  className={`form-control maestro-control${errores.cantidad
                      ? ' maestro-control--error'
                      : ''
                    }`}
                  type="number"
                  min="1"
                  value={form.cantidad}
                  aria-invalid={errores.cantidad}
                  aria-describedby={
                    errores.cantidad
                      ? 'ingresoCantidadModalError'
                      : undefined
                  }
                  onChange={(event) =>
                    actualizarCampo('cantidad', event.target.value)
                  }
                  required
                />

                {errores.cantidad && (
                  <div
                    id="ingresoCantidadModalError"
                    className="maestro-field-error"
                  >
                    Campo requerido
                  </div>
                )}
              </div>

              <div className="col-12 col-md-4">
                <SelectField
                  id="ingresoAlmacenModal"
                  label="Almacén"
                  value={form.almacen}
                  options={ALMACENES}
                  error={errores.almacen}
                  onChange={(value) =>
                    actualizarCampo('almacen', value)
                  }
                />
              </div>

              <div className="col-12">
                <label
                  className="form-label maestro-label"
                  htmlFor="ingresoObservacionModal"
                >
                  Observación
                </label>

                <textarea
                  id="ingresoObservacionModal"
                  className="form-control maestro-control maestro-control--textarea"
                  value={form.observacion}
                  onChange={(event) =>
                    actualizarCampo('observacion', event.target.value)
                  }
                  rows={4}
                />
              </div>
            </div>
          </div>

          <div className="maestro-modal-footer">
            <button
              type="button"
              className="btn maestro-btn-danger"
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
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
