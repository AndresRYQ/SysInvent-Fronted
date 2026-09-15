import { useEffect, useMemo, useState } from 'react'
import { X } from 'lucide-react'
import { SnackbarAlert, useSnackbar } from '../../components/common/SnackbarAlert'
import { FiltrosProveedores, type FiltrosProveedoresValores } from '../../components/proveedores/FiltrosProveedores'
import { FormularioProveedor } from '../../components/proveedores/FormularioProveedor'
import { ProveedorDeleteModal } from '../../components/proveedores/ProveedorDeleteModal'
import { TablaProveedores } from '../../components/proveedores/TablaProveedores'
import { actualizarProveedor, crearProveedor, eliminarProveedor, obtenerProveedores, reactivarProveedor } from '../../services/proveedorService'
import type { Proveedor, ProveedorFormData } from '../../types/proveedor'
import '../../styles/DashboardPage.css'
import '../../styles/maestros.css'

const INICIALES: FiltrosProveedoresValores = { busqueda: '', estado: '' }
function filtrar(lista: Proveedor[], f: FiltrosProveedoresValores) { const b = f.busqueda.trim().toLowerCase(); return lista.filter((p) => (!b || p.ruc.includes(b) || p.razonSocial.toLowerCase().includes(b) || p.correo.toLowerCase().includes(b)) && (!f.estado || (f.estado === 'activo' ? p.activo === 1 : p.activo === 0))) }

export function ProveedoresPage() {
  const [lista, setLista] = useState<Proveedor[]>(() => obtenerProveedores())
  const [filtros, setFiltros] = useState(INICIALES)
  const [aplicados, setAplicados] = useState(INICIALES)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [formOpen, setFormOpen] = useState(false)
  const [formProveedor, setFormProveedor] = useState<Proveedor | null>(null)
  const [soloLectura, setSoloLectura] = useState(false)
  const [formError, setFormError] = useState('')
  const [objetivo, setObjetivo] = useState<Proveedor | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [reactivarOpen, setReactivarOpen] = useState(false)
  const { mensaje, abierta, mostrarAlerta, cerrarAlerta, limpiarAlerta } = useSnackbar()
  const filtrados = useMemo(() => filtrar(lista, aplicados), [lista, aplicados])
  const paginados = useMemo(() => filtrados.slice((page - 1) * pageSize, page * pageSize), [filtrados, page, pageSize])
  useEffect(() => { setPage((p) => Math.min(p, Math.max(1, Math.ceil(filtrados.length / pageSize)))) }, [filtrados.length, pageSize])
  const recargar = () => setLista(obtenerProveedores())
  const cerrarForm = () => { setFormOpen(false); setFormProveedor(null); setSoloLectura(false); setFormError('') }
  const abrirForm = (proveedor: Proveedor | null, lectura = false) => { setFormProveedor(proveedor); setSoloLectura(lectura); setFormError(''); setFormOpen(true) }
  const guardar = (datos: ProveedorFormData) => { try { const editando = Boolean(formProveedor); editando ? actualizarProveedor(formProveedor!.id, datos) : crearProveedor(datos); recargar(); cerrarForm(); setPage(1); mostrarAlerta('success', editando ? 'Proveedor actualizado correctamente.' : 'Proveedor registrado correctamente.') } catch (e) { setFormError(e instanceof Error ? e.message : 'Ocurrió un error inesperado.') } }
  const cerrar = () => { setConfirmOpen(false); setReactivarOpen(false); setObjetivo(null) }
  const confirmar = () => { if (!objetivo) return; const reactivando = reactivarOpen; try { reactivando ? reactivarProveedor(objetivo.id) : eliminarProveedor(objetivo.id); recargar(); setPage(1); mostrarAlerta('success', reactivando ? 'Proveedor reactivado correctamente.' : 'Proveedor eliminado correctamente.') } catch (e) { mostrarAlerta('error', e instanceof Error ? e.message : 'No se pudo actualizar el proveedor.') } finally { cerrar() } }
  return <div className="proveedores-page"><main className="dashboard-shell maestro-page-shell"><div className="container-xl px-0 maestro-page-body"><section className="maestro-topbar"><div className="maestro-topbar__copy"><h1>Proveedores</h1><p>Administración de proveedores y datos de contacto comercial.</p></div></section><div className="maestro-panel"><FiltrosProveedores valores={filtros} onChange={(campo, valor) => setFiltros((a) => ({ ...a, [campo]: valor }))} onBuscar={() => { setAplicados({ ...filtros }); setPage(1) }} onLimpiar={() => { setFiltros(INICIALES); setAplicados(INICIALES); setPage(1) }} /></div><div className="maestro-panel"><TablaProveedores proveedores={paginados} totalItems={filtrados.length} page={page} pageSize={pageSize} onAgregar={() => abrirForm(null)} onEditar={(p) => abrirForm(p)} onVisualizar={(p) => abrirForm(p, true)} onEliminar={(p) => { setObjetivo(p); setConfirmOpen(true) }} onReactivar={(p) => { setObjetivo(p); setReactivarOpen(true) }} onPageChange={setPage} onPageSizeChange={(s) => { setPageSize(s); setPage(1) }} /></div></div></main><SnackbarAlert mensaje={mensaje} abierta={abierta} onClose={cerrarAlerta} onExited={limpiarAlerta} />{formOpen && <div className="maestro-modal-backdrop" role="presentation"><div className="maestro-modal-card maestro-modal-card--provider" role="dialog" aria-modal="true" aria-labelledby="proveedor-form-modal-title"><div className="maestro-modal-header"><div className="maestro-modal-header__content"><h3 id="proveedor-form-modal-title" className="maestro-modal-title">{soloLectura ? 'Visualizar proveedor' : formProveedor ? 'Editar proveedor' : 'Registrar proveedor'}</h3></div><button type="button" className="btn maestro-modal-close" onClick={cerrarForm} aria-label="Cerrar modal"><X size={18} /></button></div><FormularioProveedor proveedor={formProveedor} soloLectura={soloLectura} error={formError} onSubmit={guardar} onCancelar={cerrarForm} /></div></div>}<ProveedorDeleteModal abierto={confirmOpen || reactivarOpen} proveedor={objetivo} modo={reactivarOpen ? 'reactivar' : 'desactivar'} onClose={cerrar} onConfirm={confirmar} /></div>
}
