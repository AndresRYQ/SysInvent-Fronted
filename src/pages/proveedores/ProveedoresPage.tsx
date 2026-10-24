import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { SnackbarAlert, useSnackbar } from '../../components/common/SnackbarAlert'
import { FiltrosProveedores, type FiltrosProveedoresValores } from '../../components/proveedores/FiltrosProveedores'
import { FormularioProveedor } from '../../components/proveedores/FormularioProveedor'
import { ProveedorDeleteModal } from '../../components/proveedores/ProveedorDeleteModal'
import { TablaProveedores } from '../../components/proveedores/TablaProveedores'
import {
  actualizarProveedor,
  crearProveedor,
  eliminarProveedor,
  listarProveedores,
  reactivarProveedor,
} from '../../services/proveedorService'
import type { Proveedor, ProveedorFormData } from '../../types/proveedor'
import '../../styles/DashboardPage.css'
import '../../styles/maestros.css'
import { PageLoadingOverlay } from '../../components/common/PageLoadingOverlay'

const INICIALES: FiltrosProveedoresValores = { busqueda: '', estado: '' }

function filtrarEstado(lista: Proveedor[], estado: string): Proveedor[] {
  if (!estado) return lista
  return lista.filter((proveedor) => estado === 'activo' ? proveedor.activo === 1 : proveedor.activo === 0)
}

export function ProveedoresPage() {
  const [lista, setLista] = useState<Proveedor[]>([])
  const [totalItems, setTotalItems] = useState(-1)
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

  useEffect(() => {
    let cancelado = false
    listarProveedores({ nombre: aplicados.busqueda, pagina: page, tamPagina: pageSize })
      .then((respuesta) => {
        if (cancelado) return
        const datos = filtrarEstado(respuesta.datos, aplicados.estado)
        setLista(datos)
        setTotalItems(respuesta.paginacion.totalElementos ?? datos.length)
      })
      .catch((error) => {
        if (!cancelado) {
          setTotalItems(0)
          mostrarAlerta('error', error instanceof Error ? error.message : 'No se pudieron cargar los proveedores.')
        }
      })
    return () => { cancelado = true }
  }, [aplicados, page, pageSize])

  const recargar = () => {
    void listarProveedores({ nombre: aplicados.busqueda, pagina: page, tamPagina: pageSize })
      .then((respuesta) => {
        const datos = filtrarEstado(respuesta.datos, aplicados.estado)
        setLista(datos)
        setTotalItems(respuesta.paginacion.totalElementos ?? datos.length)
      })
  }

  const cerrarForm = () => { setFormOpen(false); setFormProveedor(null); setSoloLectura(false); setFormError('') }
  const abrirForm = (proveedor: Proveedor | null, lectura = false) => { setFormProveedor(proveedor); setSoloLectura(lectura); setFormError(''); setFormOpen(true) }

  const guardar = async (datos: ProveedorFormData): Promise<void> => {
    try {
      const editando = Boolean(formProveedor)
      const respuesta = editando
        ? await actualizarProveedor(formProveedor!.id, datos)
        : await crearProveedor(datos)
      recargar()
      cerrarForm()
      setPage(1)
      mostrarAlerta('success', respuesta.message ?? (editando ? 'Proveedor actualizado correctamente.' : 'Proveedor registrado correctamente.'))
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Ocurrió un error inesperado.')
    }
  }

  const cerrar = () => { setConfirmOpen(false); setReactivarOpen(false); setObjetivo(null) }

  const confirmar = async (): Promise<void> => {
    if (!objetivo) return
    const reactivando = reactivarOpen
    try {
      const respuesta = reactivando
        ? await reactivarProveedor(objetivo.id)
        : await eliminarProveedor(objetivo.id)
      recargar()
      setPage(1)
      mostrarAlerta('success', respuesta.message ?? (reactivando ? 'Proveedor reactivado correctamente.' : 'Proveedor eliminado correctamente.'))
    } catch (error) {
      mostrarAlerta('error', error instanceof Error ? error.message : 'No se pudo actualizar el proveedor.')
    } finally {
      cerrar()
    }
  }

  return <div className="proveedores-page">
    <main className="dashboard-shell maestro-page-shell">
      <PageLoadingOverlay visible={totalItems < 0} mensaje="Cargando proveedores..." />
      <div className="container-xl px-0 maestro-page-body">
        <section className="maestro-topbar"><div className="maestro-topbar__copy"><h1>Proveedores</h1><p>Administración de proveedores y datos de contacto comercial.</p></div></section>
        <div className="maestro-panel">
          <FiltrosProveedores valores={filtros} onChange={(campo, valor) => setFiltros((actual) => ({ ...actual, [campo]: valor }))} onBuscar={() => { setAplicados({ ...filtros }); setPage(1) }} onLimpiar={() => { setFiltros(INICIALES); setAplicados(INICIALES); setPage(1) }} />
        </div>
        <div className="maestro-panel">
          <TablaProveedores proveedores={lista} totalItems={totalItems} page={page} pageSize={pageSize} onAgregar={() => abrirForm(null)} onEditar={(proveedor) => abrirForm(proveedor)} onVisualizar={(proveedor) => abrirForm(proveedor, true)} onEliminar={(proveedor) => { setObjetivo(proveedor); setConfirmOpen(true) }} onReactivar={(proveedor) => { setObjetivo(proveedor); setReactivarOpen(true) }} onPageChange={setPage} onPageSizeChange={(size) => { setPageSize(size); setPage(1) }} />
        </div>
      </div>
    </main>
    <SnackbarAlert mensaje={mensaje} abierta={abierta} onClose={cerrarAlerta} onExited={limpiarAlerta} />
    {formOpen && <div className="maestro-modal-backdrop" role="presentation"><div className="maestro-modal-card maestro-modal-card--provider" role="dialog" aria-modal="true" aria-labelledby="proveedor-form-modal-title"><div className="maestro-modal-header"><div className="maestro-modal-header__content"><h3 id="proveedor-form-modal-title" className="maestro-modal-title">{soloLectura ? 'Visualizar proveedor' : formProveedor ? 'Editar proveedor' : 'Registrar proveedor'}</h3></div><button type="button" className="btn maestro-modal-close" onClick={cerrarForm} aria-label="Cerrar modal"><X size={18} /></button></div><FormularioProveedor proveedor={formProveedor} soloLectura={soloLectura} error={formError} onSubmit={guardar} onCancelar={cerrarForm} /></div></div>}
    <ProveedorDeleteModal abierto={confirmOpen || reactivarOpen} proveedor={objetivo} modo={reactivarOpen ? 'reactivar' : 'desactivar'} onClose={cerrar} onConfirm={confirmar} />
  </div>
}
