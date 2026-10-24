import { useEffect, useMemo, useState } from 'react'
import { SnackbarAlert, useSnackbar } from '../../components/common/SnackbarAlert'
import { FiltrosUnidadesMedida, type FiltrosUnidadesMedidaValores } from '../../components/unidades-medida/FiltrosUnidadesMedida'
import { TablaUnidadesMedida } from '../../components/unidades-medida/TablaUnidadesMedida'
import { UnidadMedidaDeleteModal } from '../../components/unidades-medida/UnidadMedidaDeleteModal'
import { UnidadMedidaFormModal } from '../../components/unidades-medida/UnidadMedidaFormModal'
import { actualizarUnidadMedida, crearUnidadMedida, eliminarUnidadMedida, listarUnidadesMedida, reactivarUnidadMedida } from '../../services/unidadMedidaService'
import type { UnidadMedida, UnidadMedidaFormData } from '../../types/unidadMedida'
import '../../styles/DashboardPage.css'
import '../../styles/maestros.css'
import { PageLoadingOverlay } from '../../components/common/PageLoadingOverlay'

const INICIALES: FiltrosUnidadesMedidaValores = { nombre: '', estado: '' }

function filtrar(lista: UnidadMedida[], filtros: FiltrosUnidadesMedidaValores) {
  return lista.filter((unidad) => (
    !filtros.estado || (filtros.estado === 'activo' ? unidad.activo === 1 : unidad.activo === 0)
  ))
}

export function UnidadesMedidaPage() {
  const [lista, setLista] = useState<UnidadMedida[]>([])
  const [totalItems, setTotalItems] = useState(-1)
  const [recarga, setRecarga] = useState(0)
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

  useEffect(() => {
    let activo = true
    setTotalItems(-1)
    listarUnidadesMedida({
      nombre: aplicados.nombre,
      pagina: page,
      tamPagina: pageSize,
    })
      .then((resultado) => {
        if (!activo) return
        setLista(resultado.datos)
        setTotalItems(resultado.paginacion.totalElementos ?? resultado.datos.length)
      })
      .catch((e) => {
        if (!activo) return
        setTotalItems(0)
        mostrarAlerta('error', e instanceof Error ? e.message : 'No se pudieron cargar las unidades de medida.')
      })
    return () => { activo = false }
  }, [aplicados.nombre, page, pageSize, recarga])

  const recargar = () => {
    setPage(1)
    setRecarga((actual) => actual + 1)
  }

  const cerrarForm = () => {
    setFormOpen(false)
    setSeleccionada(null)
    setSoloLectura(false)
    setError('')
  }

  const guardar = async (datos: UnidadMedidaFormData) => {
    try {
      const editando = Boolean(seleccionada)
      const respuesta = editando
        ? await actualizarUnidadMedida(seleccionada!.id, datos)
        : await crearUnidadMedida(datos)
      recargar()
      cerrarForm()
      mostrarAlerta('success', respuesta.message ?? (editando
        ? 'Unidad de medida actualizada correctamente.'
        : 'Unidad de medida registrada correctamente.'))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ocurrió un error inesperado.')
    }
  }

  const cerrarConfirmacion = () => {
    setConfirmOpen(false)
    setReactivarOpen(false)
    setObjetivo(null)
  }

  const confirmar = async () => {
    if (!objetivo) return
    const reactivando = reactivarOpen
    try {
      const respuesta = reactivando
        ? await reactivarUnidadMedida(objetivo.id)
        : await eliminarUnidadMedida(objetivo.id)
      recargar()
      mostrarAlerta('success', respuesta.message ?? (reactivando
        ? 'Unidad de medida reactivada correctamente.'
        : 'Unidad de medida desactivada correctamente.'))
    } catch (e) {
      mostrarAlerta('error', e instanceof Error ? e.message : 'No se pudo actualizar la unidad de medida.')
    } finally {
      cerrarConfirmacion()
    }
  }

  return (
    <div className="unidades-medida-page">
      <main className="dashboard-shell maestro-page-shell">
        <PageLoadingOverlay visible={totalItems < 0} mensaje="Cargando unidades de medida..." />
        <div className="container-xl px-0 maestro-page-body">
          <section className="maestro-topbar">
            <div className="maestro-topbar__copy">
              <h1>Unidades de medida</h1>
              <p>Administración de unidades utilizadas para controlar las existencias.</p>
            </div>
          </section>

          <div className="maestro-panel">
            <FiltrosUnidadesMedida
              valores={filtros}
              onChange={(campo, valor) => setFiltros((actual) => ({ ...actual, [campo]: valor }))}
              onBuscar={() => { setAplicados({ ...filtros }); setPage(1) }}
              onLimpiar={() => { setFiltros(INICIALES); setAplicados(INICIALES); setPage(1) }}
            />
          </div>

          <div className="maestro-panel">
            <TablaUnidadesMedida
              unidades={filtrados}
              totalItems={aplicados.estado ? filtrados.length : totalItems}
              page={page}
              pageSize={pageSize}
              onAgregar={() => { setSeleccionada(null); setSoloLectura(false); setError(''); setFormOpen(true) }}
              onEditar={(item) => { setSeleccionada(item); setSoloLectura(false); setError(''); setFormOpen(true) }}
              onVisualizar={(item) => { setSeleccionada(item); setSoloLectura(true); setError(''); setFormOpen(true) }}
              onEliminar={(item) => { setObjetivo(item); setConfirmOpen(true) }}
              onReactivar={(item) => { setObjetivo(item); setReactivarOpen(true) }}
              onPageChange={setPage}
              onPageSizeChange={(size) => { setPageSize(size); setPage(1) }}
            />
          </div>
        </div>
      </main>

      <SnackbarAlert mensaje={mensaje} abierta={abierta} onClose={cerrarAlerta} onExited={limpiarAlerta} />
      <UnidadMedidaFormModal abierto={formOpen} unidadMedida={seleccionada} error={error} soloLectura={soloLectura} onClose={cerrarForm} onSubmit={guardar} />
      <UnidadMedidaDeleteModal abierto={confirmOpen || reactivarOpen} unidadMedida={objetivo} modo={reactivarOpen ? 'reactivar' : 'desactivar'} onClose={cerrarConfirmacion} onConfirm={confirmar} />
    </div>
  )
}
