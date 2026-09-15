import { useEffect, useMemo, useState } from 'react'
import { SnackbarAlert, useSnackbar } from '../../components/common/SnackbarAlert'
import { FiltrosUnidadesMedida, type FiltrosUnidadesMedidaValores } from '../../components/unidades-medida/FiltrosUnidadesMedida'
import { TablaUnidadesMedida } from '../../components/unidades-medida/TablaUnidadesMedida'
import { UnidadMedidaDeleteModal } from '../../components/unidades-medida/UnidadMedidaDeleteModal'
import { UnidadMedidaFormModal } from '../../components/unidades-medida/UnidadMedidaFormModal'
import { actualizarUnidadMedida, crearUnidadMedida, eliminarUnidadMedida, obtenerUnidadesMedida, reactivarUnidadMedida } from '../../services/unidadMedidaService'
import type { UnidadMedida, UnidadMedidaFormData } from '../../types/unidadMedida'
import '../../styles/DashboardPage.css'
import '../../styles/maestros.css'

const INICIALES: FiltrosUnidadesMedidaValores = { nombre: '', estado: '' }
function filtrar(lista: UnidadMedida[], filtros: FiltrosUnidadesMedidaValores) { const n = filtros.nombre.trim().toLowerCase(); return lista.filter((i) => (!n || i.nombre.toLowerCase().includes(n)) && (!filtros.estado || (filtros.estado === 'activo' ? i.activo === 1 : i.activo === 0))) }

export function UnidadesMedidaPage() {
  const [lista, setLista] = useState<UnidadMedida[]>(() => obtenerUnidadesMedida())
  const [filtros, setFiltros] = useState(INICIALES)
  const [aplicados, setAplicados] = useState(INICIALES)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [formOpen, setFormOpen] = useState(false)
  const [soloLectura, setSoloLectura] = useState(false)
  const [seleccionada, setSeleccionada] = useState<UnidadMedida | null>(null)
  const [error, setError] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [reactivarOpen, setReactivarOpen] = useState(false)
  const [objetivo, setObjetivo] = useState<UnidadMedida | null>(null)
  const { mensaje, abierta, mostrarAlerta, cerrarAlerta, limpiarAlerta } = useSnackbar()
  const filtrados = useMemo(() => filtrar(lista, aplicados), [lista, aplicados])
  const paginados = useMemo(() => filtrados.slice((page - 1) * pageSize, page * pageSize), [filtrados, page, pageSize])
  useEffect(() => { setPage((p) => Math.min(p, Math.max(1, Math.ceil(filtrados.length / pageSize)))) }, [filtrados.length, pageSize])
  const recargar = () => setLista(obtenerUnidadesMedida())
  const cerrarForm = () => { setFormOpen(false); setSeleccionada(null); setSoloLectura(false); setError('') }
  const guardar = (datos: UnidadMedidaFormData) => { try { const editando = Boolean(seleccionada); editando ? actualizarUnidadMedida(seleccionada!.id, datos) : crearUnidadMedida(datos); recargar(); cerrarForm(); setPage(1); mostrarAlerta('success', editando ? 'Unidad de medida actualizada correctamente.' : 'Unidad de medida registrada correctamente.') } catch (e) { setError(e instanceof Error ? e.message : 'Ocurrió un error inesperado.') } }
  const cerrarConfirmacion = () => { setConfirmOpen(false); setReactivarOpen(false); setObjetivo(null) }
  const confirmar = () => { if (!objetivo) return; const reactivando = reactivarOpen; try { reactivando ? reactivarUnidadMedida(objetivo.id) : eliminarUnidadMedida(objetivo.id); recargar(); setPage(1); mostrarAlerta('success', reactivando ? 'Unidad de medida reactivada correctamente.' : 'Unidad de medida eliminada correctamente.') } catch (e) { mostrarAlerta('error', e instanceof Error ? e.message : 'No se pudo actualizar la unidad de medida.') } finally { cerrarConfirmacion() } }
  return <div className="unidades-medida-page"><main className="dashboard-shell maestro-page-shell"><div className="container-xl px-0 maestro-page-body"><section className="maestro-topbar"><div className="maestro-topbar__copy"><h1>Unidades de medida</h1><p>Administración de unidades utilizadas para controlar las existencias.</p></div></section><div className="maestro-panel"><FiltrosUnidadesMedida valores={filtros} onChange={(campo, valor) => setFiltros((a) => ({ ...a, [campo]: valor }))} onBuscar={() => { setAplicados({ ...filtros }); setPage(1) }} onLimpiar={() => { setFiltros(INICIALES); setAplicados(INICIALES); setPage(1) }} /></div><div className="maestro-panel"><TablaUnidadesMedida unidades={paginados} totalItems={filtrados.length} page={page} pageSize={pageSize} onAgregar={() => { setSeleccionada(null); setSoloLectura(false); setError(''); setFormOpen(true) }} onEditar={(i) => { setSeleccionada(i); setSoloLectura(false); setError(''); setFormOpen(true) }} onVisualizar={(i) => { setSeleccionada(i); setSoloLectura(true); setError(''); setFormOpen(true) }} onEliminar={(i) => { setObjetivo(i); setConfirmOpen(true) }} onReactivar={(i) => { setObjetivo(i); setReactivarOpen(true) }} onPageChange={setPage} onPageSizeChange={(s) => { setPageSize(s); setPage(1) }} /></div></div></main><SnackbarAlert mensaje={mensaje} abierta={abierta} onClose={cerrarAlerta} onExited={limpiarAlerta} /><UnidadMedidaFormModal abierto={formOpen} unidadMedida={seleccionada} error={error} soloLectura={soloLectura} onClose={cerrarForm} onSubmit={guardar} /><UnidadMedidaDeleteModal abierto={confirmOpen || reactivarOpen} unidadMedida={objetivo} modo={reactivarOpen ? 'reactivar' : 'desactivar'} onClose={cerrarConfirmacion} onConfirm={confirmar} /></div>
}
