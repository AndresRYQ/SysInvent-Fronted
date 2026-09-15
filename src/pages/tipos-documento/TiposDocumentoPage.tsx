import { useEffect, useMemo, useState } from 'react'
import { SnackbarAlert, useSnackbar } from '../../components/common/SnackbarAlert'
import { FiltrosTiposDocumento, type FiltrosTiposDocumentoValores } from '../../components/tipos-documento/FiltrosTiposDocumento'
import { TablaTiposDocumento } from '../../components/tipos-documento/TablaTiposDocumento'
import { TipoDocumentoDeleteModal } from '../../components/tipos-documento/TipoDocumentoDeleteModal'
import { TipoDocumentoFormModal } from '../../components/tipos-documento/TipoDocumentoFormModal'
import { actualizarTipoDocumento, crearTipoDocumento, eliminarTipoDocumento, obtenerTiposDocumento, reactivarTipoDocumento } from '../../services/tipoDocumentoService'
import type { TipoDocumento, TipoDocumentoFormData } from '../../types/tipoDocumento'
import '../../styles/DashboardPage.css'
import '../../styles/maestros.css'

const INICIALES: FiltrosTiposDocumentoValores = { nombre: '', estado: '' }
function filtrar(lista: TipoDocumento[], filtros: FiltrosTiposDocumentoValores) { const nombre = filtros.nombre.trim().toLowerCase(); return lista.filter((item) => (!nombre || item.nombre.toLowerCase().includes(nombre)) && (!filtros.estado || (filtros.estado === 'activo' ? item.activo === 1 : item.activo === 0))) }

export function TiposDocumentoPage() {
  const [lista, setLista] = useState<TipoDocumento[]>(() => obtenerTiposDocumento())
  const [filtros, setFiltros] = useState(INICIALES)
  const [aplicados, setAplicados] = useState(INICIALES)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [formOpen, setFormOpen] = useState(false)
  const [soloLectura, setSoloLectura] = useState(false)
  const [seleccionado, setSeleccionado] = useState<TipoDocumento | null>(null)
  const [error, setError] = useState('')
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [reactivarOpen, setReactivarOpen] = useState(false)
  const [objetivo, setObjetivo] = useState<TipoDocumento | null>(null)
  const { mensaje, abierta, mostrarAlerta, cerrarAlerta, limpiarAlerta } = useSnackbar()
  const filtrados = useMemo(() => filtrar(lista, aplicados), [lista, aplicados])
  const paginados = useMemo(() => filtrados.slice((page - 1) * pageSize, page * pageSize), [filtrados, page, pageSize])
  useEffect(() => { setPage((actual) => Math.min(actual, Math.max(1, Math.ceil(filtrados.length / pageSize)))) }, [filtrados.length, pageSize])
  const recargar = () => setLista(obtenerTiposDocumento())
  const cerrarForm = () => { setFormOpen(false); setSeleccionado(null); setSoloLectura(false); setError('') }
  const guardar = (datos: TipoDocumentoFormData) => { try { const editando = Boolean(seleccionado); editando ? actualizarTipoDocumento(seleccionado!.id, datos) : crearTipoDocumento(datos); recargar(); cerrarForm(); setPage(1); mostrarAlerta('success', editando ? 'Tipo de documento actualizado correctamente.' : 'Tipo de documento registrado correctamente.') } catch (e) { setError(e instanceof Error ? e.message : 'Ocurrió un error inesperado.') } }
  const cerrarConfirmacion = () => { setDeleteOpen(false); setReactivarOpen(false); setObjetivo(null) }
  const confirmar = () => { if (!objetivo) return; const reactivando = reactivarOpen; try { reactivando ? reactivarTipoDocumento(objetivo.id) : eliminarTipoDocumento(objetivo.id); recargar(); setPage(1); mostrarAlerta('success', reactivando ? 'Tipo de documento reactivado correctamente.' : 'Tipo de documento eliminado correctamente.') } catch (e) { mostrarAlerta('error', e instanceof Error ? e.message : 'No se pudo actualizar el tipo de documento.') } finally { cerrarConfirmacion() } }
  return <div className="tipos-documento-page"><main className="dashboard-shell maestro-page-shell"><div className="container-xl px-0 maestro-page-body"><section className="maestro-topbar"><div className="maestro-topbar__copy"><h1>Tipos de documento</h1><p>Administración de los documentos utilizados en las operaciones del almacén.</p></div></section><div className="maestro-panel"><FiltrosTiposDocumento valores={filtros} onChange={(campo, valor) => setFiltros((actual) => ({ ...actual, [campo]: valor }))} onBuscar={() => { setAplicados({ ...filtros }); setPage(1) }} onLimpiar={() => { setFiltros(INICIALES); setAplicados(INICIALES); setPage(1) }} /></div><div className="maestro-panel"><TablaTiposDocumento tiposDocumento={paginados} totalItems={filtrados.length} page={page} pageSize={pageSize} onAgregar={() => { setSeleccionado(null); setSoloLectura(false); setError(''); setFormOpen(true) }} onEditar={(item) => { setSeleccionado(item); setSoloLectura(false); setError(''); setFormOpen(true) }} onVisualizar={(item) => { setSeleccionado(item); setSoloLectura(true); setError(''); setFormOpen(true) }} onEliminar={(item) => { setObjetivo(item); setDeleteOpen(true) }} onReactivar={(item) => { setObjetivo(item); setReactivarOpen(true) }} onPageChange={setPage} onPageSizeChange={(size) => { setPageSize(size); setPage(1) }} /></div></div></main><SnackbarAlert mensaje={mensaje} abierta={abierta} onClose={cerrarAlerta} onExited={limpiarAlerta} /><TipoDocumentoFormModal abierto={formOpen} tipoDocumento={seleccionado} error={error} soloLectura={soloLectura} onClose={cerrarForm} onSubmit={guardar} /><TipoDocumentoDeleteModal abierto={deleteOpen || reactivarOpen} tipoDocumento={objetivo} modo={reactivarOpen ? 'reactivar' : 'desactivar'} onClose={cerrarConfirmacion} onConfirm={confirmar} /></div>
}
