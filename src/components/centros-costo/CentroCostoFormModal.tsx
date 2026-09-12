import { useEffect, useState } from 'react'
import { Save, X } from 'lucide-react'
import type { CentroCosto, CentroCostoFormData } from '../../types/centroCosto'

interface Props {
  abierto: boolean
  centroCosto: CentroCosto | null
  error: string
  soloLectura?: boolean
  onClose: () => void
  onSubmit: (datos: CentroCostoFormData) => void
}

const FORM_INICIAL: CentroCostoFormData = { nombre: '', descripcion: '' }

export function CentroCostoFormModal({ abierto, centroCosto, error, soloLectura = false, onClose, onSubmit }: Props) {
  const [form, setForm] = useState<CentroCostoFormData>(FORM_INICIAL)
  const [errores, setErrores] = useState({ nombre: false, descripcion: false })

  useEffect(() => {
    if (!abierto) return
    setForm(centroCosto ? { nombre: centroCosto.nombre, descripcion: centroCosto.descripcion } : FORM_INICIAL)
    setErrores({ nombre: false, descripcion: false })
  }, [abierto, centroCosto])

  if (!abierto) return null

  const actualizar = (campo: keyof CentroCostoFormData, valor: string) => {
    setForm((actual) => ({ ...actual, [campo]: valor }))
    if (valor.trim()) setErrores((actual) => ({ ...actual, [campo]: false }))
  }

  return (
    <div className="maestro-modal-backdrop" role="presentation">
      <div className="maestro-modal-card" role="dialog" aria-modal="true" aria-labelledby="centro-costo-form-title">
        <div className="maestro-modal-header">
          <div className="maestro-modal-header__content">
            <h3 id="centro-costo-form-title" className="maestro-modal-title">
              {soloLectura ? 'Visualizar centro de costo' : centroCosto ? 'Editar centro de costo' : 'Registrar centro de costo'}
            </h3>
          </div>
          <button type="button" className="btn maestro-modal-close" onClick={onClose} aria-label="Cerrar modal"><X size={18} /></button>
        </div>

        <form noValidate onSubmit={(event) => {
          event.preventDefault()
          if (soloLectura) return
          const nuevosErrores = { nombre: !form.nombre.trim(), descripcion: !form.descripcion.trim() }
          setErrores(nuevosErrores)
          if (!nuevosErrores.nombre && !nuevosErrores.descripcion) onSubmit({ nombre: form.nombre.trim(), descripcion: form.descripcion.trim() })
        }}>
          <div className="maestro-modal-body">
            {error && <div className="alert alert-danger py-2" role="alert">{error}</div>}
            <div className="mb-3">
              <label className="form-label maestro-label" htmlFor="centroCostoNombreModal">Nombre de centro de costo{!soloLectura && <span className="maestro-required">*</span>}</label>
              <input id="centroCostoNombreModal" className={`form-control maestro-control${errores.nombre ? ' maestro-control--error' : ''}`} value={form.nombre} placeholder="Ingresar" disabled={soloLectura} onChange={(event) => actualizar('nombre', event.target.value)} />
              {errores.nombre && <div className="maestro-field-error">Campo requerido</div>}
            </div>
            <div>
              <label className="form-label maestro-label" htmlFor="centroCostoDescripcionModal">Descripción{!soloLectura && <span className="maestro-required">*</span>}</label>
              <textarea id="centroCostoDescripcionModal" className={`form-control maestro-control maestro-control--textarea${errores.descripcion ? ' maestro-control--error' : ''}`} value={form.descripcion} placeholder="Ingresar" disabled={soloLectura} rows={2} onChange={(event) => actualizar('descripcion', event.target.value)} />
              {errores.descripcion && <div className="maestro-field-error">Campo requerido</div>}
            </div>
          </div>
          {!soloLectura && <div className="maestro-modal-footer">
            <button type="button" className="btn maestro-btn-danger" onClick={onClose}><X size={18} />Cancelar</button>
            <button type="submit" className="btn maestro-btn-primary"><Save size={18} />Guardar</button>
          </div>}
        </form>
      </div>
    </div>
  )
}
