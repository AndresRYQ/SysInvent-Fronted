import { useEffect, useState } from 'react'
import { Save, X } from 'lucide-react'
import { Placeholder } from '../../constants/placeholders'
import type { TipoDocumento, TipoDocumentoFormData } from '../../types/tipoDocumento'

interface Props {
  abierto: boolean
  tipoDocumento: TipoDocumento | null
  error: string
  soloLectura?: boolean
  onClose: () => void
  onSubmit: (datos: TipoDocumentoFormData) => void
}

export function TipoDocumentoFormModal({ abierto, tipoDocumento, error, soloLectura = false, onClose, onSubmit }: Props) {
  const [form, setForm] = useState<TipoDocumentoFormData>({ nombre: '', descripcion: '' })
  const [errores, setErrores] = useState({ nombre: '', descripcion: '' })

  useEffect(() => {
    if (abierto) {
      setForm(tipoDocumento ? { nombre: tipoDocumento.nombre, descripcion: tipoDocumento.descripcion } : { nombre: '', descripcion: '' })
      setErrores({ nombre: '', descripcion: '' })
    }
  }, [abierto, tipoDocumento])

  if (!abierto) return null

  const cambiar = (campo: keyof TipoDocumentoFormData, valor: string) => {
    setForm((actual) => ({ ...actual, [campo]: valor }))
    setErrores((actual) => ({ ...actual, [campo]: '' }))
  }

  const validar = () => {
    const nuevosErrores = { nombre: '', descripcion: '' }
    const nombre = form.nombre.trim()
    const descripcion = form.descripcion.trim()
    if (!nombre) nuevosErrores.nombre = 'Campo requerido'
    else if (nombre.length < 2) nuevosErrores.nombre = 'Debe tener al menos 2 caracteres'
    if (!descripcion) nuevosErrores.descripcion = 'Campo requerido'
    setErrores(nuevosErrores)
    return !nuevosErrores.nombre && !nuevosErrores.descripcion
  }

  return (
    <div className="maestro-modal-backdrop" role="presentation">
      <div className="maestro-modal-card" role="dialog" aria-modal="true">
        <div className="maestro-modal-header">
          <div className="maestro-modal-header__content"><h3 className="maestro-modal-title">{soloLectura ? 'Visualizar tipo de documento' : tipoDocumento ? 'Editar tipo de documento' : 'Registrar tipo de documento'}</h3></div>
          <button type="button" className="btn maestro-modal-close" onClick={onClose} aria-label="Cerrar modal"><X size={18} /></button>
        </div>
        <form noValidate onSubmit={(event) => { event.preventDefault(); if (!soloLectura && validar()) onSubmit({ nombre: form.nombre.trim(), descripcion: form.descripcion.trim() }) }}>
          <div className="maestro-modal-body">
            {error && <div className="alert alert-danger py-2">{error}</div>}
            <div className="mb-3">
              <label className="form-label required" htmlFor="tipoDocumentoNombreModal">Nombre del tipo de documento</label>
              <input id="tipoDocumentoNombreModal" className={`form-control${errores.nombre ? ' maestro-control--error' : ''}`} value={form.nombre} placeholder={Placeholder.Ingresar} disabled={soloLectura} maxLength={80} onChange={(event) => cambiar('nombre', event.target.value)} />
              {errores.nombre && <div className="maestro-field-error">{errores.nombre}</div>}
            </div>
            <label className="form-label required" htmlFor="tipoDocumentoDescripcionModal">Descripción</label>
            <textarea id="tipoDocumentoDescripcionModal" className={`form-control${errores.descripcion ? ' maestro-control--error' : ''}`} value={form.descripcion} placeholder={Placeholder.Ingresar} disabled={soloLectura} maxLength={250} rows={2} onChange={(event) => cambiar('descripcion', event.target.value)} />
            <div className="d-flex justify-content-between"><span className="maestro-field-error">{errores.descripcion}</span><small className="text-muted">{form.descripcion.length}/250</small></div>
          </div>
          {!soloLectura && <div className="maestro-modal-footer"><button type="button" className="btn btn-maestro-danger" onClick={onClose}><X size={18} />Cancelar</button><button type="submit" className="btn btn-maestro-primary"><Save size={18} />{tipoDocumento ? 'Guardar cambios' : 'Registrar'}</button></div>}
        </form>
      </div>
    </div>
  )
}
