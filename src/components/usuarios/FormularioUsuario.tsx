import { Placeholder } from '../../constants/placeholders'
import Select from 'react-select'
import { Save, UserRound, X } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import type { UsuarioLogin } from '../../types/auth'
import type { Rol } from '../../types/rol'
import type { UsuarioFormData } from '../../types/usuario'
import { crearEstilosSelect } from '../../styles/reactSelectStyles'

interface ErroresFormulario {
  dni: string
  nombres: string
  apePaterno: string
  apeMaterno: string
  email: string
  rol: string
}

interface FormularioUsuarioProps {
  usuario: UsuarioLogin | null
  roles: Rol[]
  onClose: () => void
  onGuardar: (datos: UsuarioFormData) => string | null | Promise<string | null>
}

export function FormularioUsuario({ usuario, roles, onClose, onGuardar }: FormularioUsuarioProps) {
  const [datos, setDatos] = useState<UsuarioFormData>(() => ({
    usuario: usuario?.usuario ?? '',
    dni: usuario?.dni ?? usuario?.usuario ?? '',
    nombres: usuario?.nombres ?? '',
    apePaterno: usuario?.apePaterno ?? '',
    apeMaterno: usuario?.apeMaterno ?? '',
    nombreCompleto: usuario?.nombreCompleto ?? '',
    email: usuario?.email ?? '',
    contrasena: '',
    rol: usuario?.rol ?? '',
    rolId: usuario?.rolId ?? null,
    estado: usuario?.estado ?? true,
  }))

  const [error, setError] = useState('')
  const [errores, setErrores] = useState<ErroresFormulario>({
    dni: '', nombres: '', apePaterno: '', apeMaterno: '', email: '', rol: '',
  })

  const rolesDisponibles = roles.filter((rol) => rol.estado || rol.nombre === usuario?.rol)

  const actualizarCampo = (
    campo: 'dni' | 'nombres' | 'apePaterno' | 'apeMaterno' | 'email',
    valor: string,
  ) => {
    setDatos((actual) => ({ ...actual, [campo]: valor }))
    setErrores((actual) => ({ ...actual, [campo]: '' }))
  }

  const manejarEnvio = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault()
    setError('')

    const nuevosErrores: ErroresFormulario = {
      dni: '', nombres: '', apePaterno: '', apeMaterno: '', email: '', rol: '',
    }

    if (!/^\d{8}$/.test(datos.dni?.trim() ?? '')) {
      nuevosErrores.dni = 'El DNI debe contener 8 números'
    }
    if (!datos.nombres?.trim()) nuevosErrores.nombres = 'Campo requerido'
    if (!datos.apePaterno?.trim()) nuevosErrores.apePaterno = 'Campo requerido'
    if (!datos.apeMaterno?.trim()) nuevosErrores.apeMaterno = 'Campo requerido'
    if (!datos.email.trim()) nuevosErrores.email = 'Campo requerido'
    else if (!/^\S+@\S+\.\S+$/.test(datos.email.trim())) {
      nuevosErrores.email = 'Ingresa un correo válido'
    }
    if (!datos.rolId) nuevosErrores.rol = 'Campo requerido'

    setErrores(nuevosErrores)
    if (Object.values(nuevosErrores).some(Boolean)) return

    const mensaje = await onGuardar({
      ...datos,
      dni: datos.dni?.trim(),
      usuario: datos.dni?.trim() ?? '',
      nombres: datos.nombres?.trim(),
      apePaterno: datos.apePaterno?.trim(),
      apeMaterno: datos.apeMaterno?.trim(),
      nombreCompleto: [datos.nombres, datos.apePaterno, datos.apeMaterno]
        .filter(Boolean)
        .join(' '),
      email: datos.email.trim(),
    })

    if (mensaje) setError(mensaje)
  }

  const renderError = (mensaje: string) => mensaje && (
    <div className="maestro-field-error">{mensaje}</div>
  )

  return (
    <div className="maestro-modal-backdrop" role="presentation">
      <form className="maestro-modal-card" onSubmit={manejarEnvio} role="dialog" aria-modal="true" aria-labelledby="usuario-form-title">
        <header className="maestro-modal-header">
          <div className="maestro-modal-header__content">
            <h2 id="usuario-form-title" className="maestro-modal-title">
              {usuario ? 'Editar usuario' : 'Nuevo usuario'}
            </h2>
            <p className="maestro-modal-copy">Registra los datos y asigna un rol.</p>
          </div>
          <button type="button" className="btn maestro-modal-close" onClick={onClose} aria-label="Cerrar">
            <X size={18} />
          </button>
        </header>

        <div className="maestro-modal-body">
          {error && <div className="alert alert-danger py-2" role="alert">{error}</div>}
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label className="form-label required" htmlFor="usuarioDni">DNI</label>
              <div className="input-group">
                <span className="input-group-text"><UserRound size={16} /></span>
                <input id="usuarioDni" className={`form-control${errores.dni ? ' maestro-control--error' : ''}${usuario ? ' bg-light' : ''}`} value={datos.dni} placeholder="Ingresa 8 dígitos" inputMode="numeric" maxLength={8} readOnly={Boolean(usuario)} onChange={(evento) => actualizarCampo('dni', evento.target.value.replace(/\D/g, ''))} />
              </div>
              {renderError(errores.dni)}
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label required" htmlFor="usuarioNombres">Nombres</label>
              <input id="usuarioNombres" className={`form-control${errores.nombres ? ' maestro-control--error' : ''}`} value={datos.nombres} placeholder={Placeholder.Ingresar} maxLength={100} onChange={(evento) => actualizarCampo('nombres', evento.target.value)} />
              {renderError(errores.nombres)}
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label required" htmlFor="usuarioApePaterno">Apellido paterno</label>
              <input id="usuarioApePaterno" className={`form-control${errores.apePaterno ? ' maestro-control--error' : ''}`} value={datos.apePaterno} placeholder={Placeholder.Ingresar} maxLength={100} onChange={(evento) => actualizarCampo('apePaterno', evento.target.value)} />
              {renderError(errores.apePaterno)}
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label required" htmlFor="usuarioApeMaterno">Apellido materno</label>
              <input id="usuarioApeMaterno" className={`form-control${errores.apeMaterno ? ' maestro-control--error' : ''}`} value={datos.apeMaterno} placeholder={Placeholder.Ingresar} maxLength={100} onChange={(evento) => actualizarCampo('apeMaterno', evento.target.value)} />
              {renderError(errores.apeMaterno)}
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label required" htmlFor="usuarioEmail">Correo</label>
              <input id="usuarioEmail" className={`form-control${errores.email ? ' maestro-control--error' : ''}`} type="email" value={datos.email} placeholder={Placeholder.Ingresar} maxLength={120} autoComplete="email" onChange={(evento) => actualizarCampo('email', evento.target.value)} />
              {renderError(errores.email)}
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label required" htmlFor="usuarioRol">Rol</label>
              <Select
                inputId="usuarioRol"
                classNamePrefix="maestro-select"
                options={rolesDisponibles.map((rol) => ({ value: rol.id, label: rol.nombre }))}
                value={rolesDisponibles.map((rol) => ({ value: rol.id, label: rol.nombre })).find((opcion) => Number(opcion.value) === datos.rolId) ?? null}
                onChange={(opcion) => {
                  const rolSeleccionado = rolesDisponibles.find((rol) => rol.id === opcion?.value)
                  setDatos((actual) => ({ ...actual, rolId: opcion ? Number(opcion.value) : null, rol: rolSeleccionado?.nombre ?? '' }))
                  setErrores((actual) => ({ ...actual, rol: '' }))
                }}
                placeholder={Placeholder.Seleccionar}
                isSearchable={false}
                menuPortalTarget={document.body}
                styles={crearEstilosSelect({ tieneError: Boolean(errores.rol), zIndex: 1300 })}
              />
              {renderError(errores.rol)}
            </div>
          </div>
        </div>

        <footer className="maestro-modal-footer">
          <button type="button" className="btn btn-maestro-danger" onClick={onClose}><X size={17} />Cancelar</button>
          <button type="submit" className="btn btn-maestro-primary"><Save size={17} />Guardar</button>
        </footer>
      </form>
    </div>
  )
}
