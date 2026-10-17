import { useEffect, useMemo, useState } from 'react'
import { FiltrosTiposProducto, type FiltrosTiposProductoValores } from '../../components/tipos-productos/FiltrosTiposProducto'
import { SnackbarAlert, useSnackbar } from '../../components/common/SnackbarAlert'
import { TablaTiposProducto } from '../../components/tipos-productos/TablaTiposProducto'
import { TipoProductoDeleteModal } from '../../components/tipos-productos/TipoProductoDeleteModal'
import { TipoProductoFormModal } from '../../components/tipos-productos/TipoProductoFormModal'
import { actualizarTipoProducto, crearTipoProducto, eliminarTipoProducto, listarTiposProducto, reactivarTipoProducto } from '../../services/tipoProductoService'
import type { TipoProducto, TipoProductoFormData } from '../../types/tipoProducto'
import '../../styles/DashboardPage.css'
import '../../styles/maestros.css'

const FILTROS_INICIALES: FiltrosTiposProductoValores = { nombre: '', estado: '' }

function filtrarTiposProducto(tiposProducto: TipoProducto[], filtros: FiltrosTiposProductoValores) {
  return tiposProducto.filter((tipoProducto) => (
    !filtros.estado || (filtros.estado === 'activo' ? tipoProducto.activo === 1 : tipoProducto.activo === 0)
  ))
}

export function TiposProductoPage() {
  const [tiposProducto, setTiposProducto] = useState<TipoProducto[]>([])
  const [totalItems, setTotalItems] = useState(0)
  const [recarga, setRecarga] = useState(0)
  const [filtros, setFiltros] = useState(FILTROS_INICIALES)
  const [filtrosAplicados, setFiltrosAplicados] = useState(FILTROS_INICIALES)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [modalFormOpen, setModalFormOpen] = useState(false)
  const [modoVisualizacion, setModoVisualizacion] = useState(false)
  const [tipoProductoEnEdicion, setTipoProductoEnEdicion] = useState<TipoProducto | null>(null)
  const [errorFormulario, setErrorFormulario] = useState('')
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false)
  const [tipoProductoAEliminar, setTipoProductoAEliminar] = useState<TipoProducto | null>(null)
  const [modalReactivarOpen, setModalReactivarOpen] = useState(false)
  const [tipoProductoAReactivar, setTipoProductoAReactivar] = useState<TipoProducto | null>(null)
  const { mensaje, abierta, mostrarAlerta, cerrarAlerta, limpiarAlerta } = useSnackbar()

  const filtrados = useMemo(() => filtrarTiposProducto(tiposProducto, filtrosAplicados), [tiposProducto, filtrosAplicados])

  useEffect(() => {
    let activo = true
    listarTiposProducto({
      nombre: filtrosAplicados.nombre,
      pagina: page,
      tamPagina: pageSize,
    })
      .then((resultado) => {
        if (!activo) return
        setTiposProducto(resultado.datos)
        setTotalItems(resultado.paginacion.totalElementos ?? resultado.datos.length)
      })
      .catch((e) => {
        if (!activo) return
        mostrarAlerta('error', e instanceof Error ? e.message : 'No se pudieron cargar los tipos de producto.')
      })
    return () => { activo = false }
  }, [filtrosAplicados.nombre, page, pageSize, recarga])

  const recargar = () => {
    setPage(1)
    setRecarga((actual) => actual + 1)
  }

  const cerrarFormulario = () => {
    setModalFormOpen(false)
    setTipoProductoEnEdicion(null)
    setModoVisualizacion(false)
    setErrorFormulario('')
  }

  const guardarTipoProducto = async (datos: TipoProductoFormData) => {
    try {
      const editando = Boolean(tipoProductoEnEdicion)
      const respuesta = editando
        ? await actualizarTipoProducto(tipoProductoEnEdicion!.id, datos)
        : await crearTipoProducto(datos)
      recargar()
      cerrarFormulario()
      mostrarAlerta('success', respuesta.message ?? (editando
        ? 'Tipo de producto actualizado correctamente.'
        : 'Tipo de producto registrado correctamente.'))
    } catch (error) {
      setErrorFormulario(error instanceof Error ? error.message : 'Ocurrió un error inesperado.')
    }
  }

  const cerrarConfirmacionEliminar = () => {
    setModalDeleteOpen(false)
    setTipoProductoAEliminar(null)
  }

  const confirmarEliminacion = async () => {
    if (!tipoProductoAEliminar) return
    try {
      const respuesta = await eliminarTipoProducto(tipoProductoAEliminar.id)
      recargar()
      cerrarConfirmacionEliminar()
      mostrarAlerta('success', respuesta.message ?? 'Tipo de producto desactivado correctamente.')
    } catch (error) {
      cerrarConfirmacionEliminar()
      mostrarAlerta('error', error instanceof Error ? error.message : 'No se pudo desactivar el tipo de producto.')
    }
  }

  const confirmarReactivacion = async () => {
    if (!tipoProductoAReactivar) return
    try {
      const respuesta = await reactivarTipoProducto(tipoProductoAReactivar.id)
      recargar()
      mostrarAlerta('success', respuesta.message ?? 'Tipo de producto reactivado correctamente.')
    } catch (error) {
      mostrarAlerta('error', error instanceof Error ? error.message : 'No se pudo reactivar el tipo de producto.')
    } finally {
      setModalReactivarOpen(false)
      setTipoProductoAReactivar(null)
    }
  }

  return (
    <div className="tipos-producto-page">
      <main className="dashboard-shell maestro-page-shell">
        <div className="container-xl px-0 maestro-page-body">
          <section className="maestro-topbar"><div className="maestro-topbar__copy"><h1>Tipos de producto</h1><p>Administración de los tipos de producto utilizados en el inventario.</p></div></section>
          <div className="maestro-panel">
            <FiltrosTiposProducto
              valores={filtros}
              onChange={(campo, valor) => setFiltros((actual) => ({ ...actual, [campo]: valor }))}
              onBuscar={() => { setFiltrosAplicados({ ...filtros }); setPage(1) }}
              onLimpiar={() => { setFiltros(FILTROS_INICIALES); setFiltrosAplicados(FILTROS_INICIALES); setPage(1) }}
            />
          </div>
          <div className="maestro-panel">
            <TablaTiposProducto
              tiposProducto={filtrados}
              totalItems={filtrosAplicados.estado ? filtrados.length : totalItems}
              page={page}
              pageSize={pageSize}
              onAgregar={() => { setTipoProductoEnEdicion(null); setModoVisualizacion(false); setErrorFormulario(''); setModalFormOpen(true) }}
              onEditar={(item) => { setTipoProductoEnEdicion(item); setModoVisualizacion(false); setErrorFormulario(''); setModalFormOpen(true) }}
              onVisualizar={(item) => { setTipoProductoEnEdicion(item); setModoVisualizacion(true); setErrorFormulario(''); setModalFormOpen(true) }}
              onEliminar={(item) => { setTipoProductoAEliminar(item); setModalDeleteOpen(true) }}
              onReactivar={(item) => { setTipoProductoAReactivar(item); setModalReactivarOpen(true) }}
              onPageChange={setPage}
              onPageSizeChange={(size) => { setPageSize(size); setPage(1) }}
            />
          </div>
        </div>
      </main>
      <SnackbarAlert mensaje={mensaje} abierta={abierta} onClose={cerrarAlerta} onExited={limpiarAlerta} />
      <TipoProductoFormModal abierto={modalFormOpen} tipoProducto={tipoProductoEnEdicion} error={errorFormulario} soloLectura={modoVisualizacion} onClose={cerrarFormulario} onSubmit={guardarTipoProducto} />
      <TipoProductoDeleteModal abierto={modalDeleteOpen} tipoProducto={tipoProductoAEliminar} onClose={cerrarConfirmacionEliminar} onConfirm={confirmarEliminacion} />
      <TipoProductoDeleteModal abierto={modalReactivarOpen} tipoProducto={tipoProductoAReactivar} modo="reactivar" onClose={() => { setModalReactivarOpen(false); setTipoProductoAReactivar(null) }} onConfirm={confirmarReactivacion} />
    </div>
  )
}
