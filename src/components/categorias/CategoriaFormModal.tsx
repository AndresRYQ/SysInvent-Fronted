import { useEffect, useState } from 'react'
import { Save, X } from 'lucide-react'
import type { Categoria, CategoriaFormData } from '../../types/categoria'

interface Props {
  abierto: boolean
  categoria: Categoria | null
  error: string
  soloLectura?: boolean
  onClose: () => void
  onSubmit: (datos: CategoriaFormData) => void
}

const FORM_INICIAL: CategoriaFormData = { nombre: '', descripcion: '' }

export function CategoriaFormModal({ abierto, categoria, error, soloLectura = false, onClose, onSubmit }: Props) {
  const [form, setForm] = useState<CategoriaFormData>(FORM_INICIAL)
  const [errores, setErrores] = useState({ nombre: '', descripcion: '' })

  useEffect(() => {
    if (!abierto) return
    setForm(categoria ? { nombre: categoria.nombre, descripcion: categoria.descripcion } : FORM_INICIAL)
    setErrores({ nombre: '', descripcion: '' })
  }, [abierto, categoria])

  if (!abierto) return null

  const actualizar = (campo: keyof CategoriaFormData, valor: string) => {
    setForm((actual) => ({ ...actual, [campo]: valor }))
    setErrores((actual) => ({ ...actual, [campo]: '' }))
  }

  const validar = () => {
    const nuevos = { nombre: '', descripcion: '' }
    const nombre = form.nombre.trim()
    const descripcion = form.descripcion.trim()
    if (!nombre) nuevos.nombre = 'Campo requerido'
    else if (nombre.length < 2) nuevos.nombre = 'Debe tener al menos 2 caracteres'
    else if (nombre.length > 80) nuevos.nombre = 'No puede superar los 80 caracteres'
    if (!descripcion) nuevos.descripcion = 'Campo requerido'
    else if (descripcion.length > 200) nuevos.descripcion = 'No puede superar los 200 caracteres'
    setErrores(nuevos)
    return !nuevos.nombre && !nuevos.descripcion
  }

  return (
    <div className="maestro-modal-backdrop" role="presentation">
      <div className="maestro-modal-card" role="dialog" aria-modal="true" aria-labelledby="categoria-form-title">
        <div className="maestro-modal-header">
          <div className="maestro-modal-header__content">
            <h3 id="categoria-form-title" className="maestro-modal-title">
              {categoria ? 'Editar categoría' : 'Registrar categoría'}
            </h3>
          </div>
          <button type="button" className="btn maestro-modal-close" onClick={onClose} aria-label="Cerrar modal"><X size={18} /></button>
        </div>

        <form noValidate onSubmit={(event) => {
          event.preventDefault()
          if (!soloLectura && validar()) onSubmit({ nombre: form.nombre.trim(), descripcion: form.descripcion.trim() })
        }}>
          <div className="maestro-modal-body">
            {error && <div className="alert alert-danger py-2" role="alert">{error}</div>}
            <div className="mb-3">
              <label className="form-label required" htmlFor="categoriaNombreModal">Nombre de la categoría</label>
              <input id="categoriaNombreModal" className={`form-control${errores.nombre ? ' maestro-control--error' : ''}`} value={form.nombre} placeholder="Ingresar" disabled={soloLectura} maxLength={80} onChange={(event) => actualizar('nombre', event.target.value)} />
              {errores.nombre && <div className="maestro-field-error">{errores.nombre}</div>}
            </div>
            <div>
              <label className="form-label required" htmlFor="categoriaDescripcionModal">Descripción</label>
              <textarea id="categoriaDescripcionModal" className={`form-control${errores.descripcion ? ' maestro-control--error' : ''}`} value={form.descripcion} placeholder="Ingresar" disabled={soloLectura} maxLength={200} rows={2} onChange={(event) => actualizar('descripcion', event.target.value)} />
              <div className="d-flex justify-content-between">
                <div>{errores.descripcion && <span className="maestro-field-error">{errores.descripcion}</span>}</div>
                <small className="text-muted">{form.descripcion.length}/200</small>
              </div>
            </div>
          </div>
          {!soloLectura && <div className="maestro-modal-footer">
            <button type="button" className="btn maestro-btn-danger" onClick={onClose}><X size={18} />Cancelar</button>
            <button type="submit" className="btn maestro-btn-primary"><Save size={18} />{categoria ? 'Guardar cambios' : 'Registrar'}</button>
          </div>}
        </form>
      </div>
    </div>
  )
}

