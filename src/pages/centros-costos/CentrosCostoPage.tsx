import { useEffect, useMemo, useState } from 'react'
import { CentroCostoDeleteModal } from '../../components/centros-costo/CentroCostoDeleteModal'
import { CentroCostoFormModal } from '../../components/centros-costo/CentroCostoFormModal'
import { FiltrosCentrosCosto, type FiltrosCentrosCostoValores } from '../../components/centros-costo/FiltrosCentrosCosto'
import { TablaCentrosCosto } from '../../components/centros-costo/TablaCentrosCosto'
import { SnackbarAlert, useSnackbar } from '../../components/common/SnackbarAlert'
import { actualizarCentroCosto, crearCentroCosto, eliminarCentroCosto, listarCentrosCosto, reactivarCentroCosto } from '../../services/centroCostoService'
import type { CentroCosto, CentroCostoFormData } from '../../types/centroCosto'
import '../../styles/DashboardPage.css'
import '../../styles/maestros.css'

const FILTROS_INICIALES: FiltrosCentrosCostoValores = { nombre: '', estado: '' }

function filtrarCentrosCosto(centros: CentroCosto[], filtros: FiltrosCentrosCostoValores) {
  return centros.filter((centro) => (
    !filtros.estado || (filtros.estado === 'activo' ? centro.activo === 1 : centro.activo === 0)
  ))
}

export function CentrosCostoPage() {
  const [centros, setCentros] = useState<CentroCosto[]>([])
  const [totalItems, setTotalItems] = useState(-1)
  const [recarga, setRecarga] = useState(0)
  const [filtros, setFiltros] = useState(FILTROS_INICIALES)
  const [aplicados, setAplicados] = useState(FILTROS_INICIALES)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [formOpen, setFormOpen] = useState(false)
  const [soloLectura, setSoloLectura] = useState(false)
  const [seleccionado, setSeleccionado] = useState<CentroCosto | null>(null)
  const [error, setError] = useState('')
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [reactivarOpen, setReactivarOpen] = useState(false)
  const [objetivo, setObjetivo] = useState<CentroCosto | null>(null)
  const { mensaje, abierta, mostrarAlerta, cerrarAlerta, limpiarAlerta } = useSnackbar()

  const filtrados = useMemo(() => filtrarCentrosCosto(centros, aplicados), [centros, aplicados])

  useEffect(() => {
    let activo = true
    listarCentrosCosto({ nombre: aplicados.nombre, pagina: page, tamPagina: pageSize })
      .then((resultado) => {
        if (!activo) return
        setCentros(resultado.datos)
        setTotalItems(resultado.paginacion.totalElementos ?? resultado.datos.length)
      })
      .catch((e) => {
        if (!activo) return
        mostrarAlerta('error', e instanceof Error ? e.message : 'No se pudieron cargar los centros de costo.')
      })
    return () => { activo = false }
  }, [aplicados.nombre, page, pageSize, recarga])

  const recargar = () => {
    setPage(1)
    setRecarga((actual) => actual + 1)
  }

  const cerrarFormulario = () => {
    setFormOpen(false)
    setSeleccionado(null)
    setSoloLectura(false)
    setError('')
  }

  const guardar = async (datos: CentroCostoFormData) => {
    try {
      const editando = Boolean(seleccionado)
      const respuesta = editando
        ? await actualizarCentroCosto(seleccionado!.id, datos)
        : await crearCentroCosto(datos)
      recargar()
      cerrarFormulario()
      mostrarAlerta('success', respuesta.message ?? (editando ? 'Centro de costo actualizado correctamente.' : 'Centro de costo registrado correctamente.'))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ocurrió un error inesperado.')
    }
  }

  const cerrarConfirmacion = () => {
    setDeleteOpen(false)
    setReactivarOpen(false)
    setObjetivo(null)
  }

  const confirmar = async () => {
    if (!objetivo) return
    const reactivando = reactivarOpen
    try {
      const respuesta = reactivando ? await reactivarCentroCosto(objetivo.id) : await eliminarCentroCosto(objetivo.id)
      recargar()
      mostrarAlerta('success', respuesta.message ?? (reactivando ? 'Centro de costo reactivado correctamente.' : 'Centro de costo desactivado correctamente.'))
    } catch (e) {
      mostrarAlerta('error', e instanceof Error ? e.message : 'No se pudo actualizar el centro de costo.')
    } finally {
      cerrarConfirmacion()
    }
  }

  return (
    <div className="centro-costo-page">
      <main className="dashboard-shell maestro-page-shell">
        <div className="container-xl px-0 maestro-page-body">
          <section className="maestro-topbar"><div className="maestro-topbar__copy"><h1>Centros de costo</h1><p>Administración de áreas responsables del consumo de materiales.</p></div></section>
          <div className="maestro-panel"><FiltrosCentrosCosto valores={filtros} onChange={(campo, valor) => setFiltros((actual) => ({ ...actual, [campo]: valor }))} onBuscar={() => { setAplicados({ ...filtros }); setPage(1) }} onLimpiar={() => { setFiltros(FILTROS_INICIALES); setAplicados(FILTROS_INICIALES); setPage(1) }} /></div>
          <div className="maestro-panel"><TablaCentrosCosto centrosCosto={filtrados} totalItems={aplicados.estado ? filtrados.length : totalItems} page={page} pageSize={pageSize} onAgregar={() => { setSeleccionado(null); setSoloLectura(false); setError(''); setFormOpen(true) }} onEditar={(item) => { setSeleccionado(item); setSoloLectura(false); setError(''); setFormOpen(true) }} onVisualizar={(item) => { setSeleccionado(item); setSoloLectura(true); setError(''); setFormOpen(true) }} onEliminar={(item) => { setObjetivo(item); setDeleteOpen(true) }} onReactivar={(item) => { setObjetivo(item); setReactivarOpen(true) }} onPageChange={setPage} onPageSizeChange={(size) => { setPageSize(size); setPage(1) }} /></div>
        </div>
      </main>
      <SnackbarAlert mensaje={mensaje} abierta={abierta} onClose={cerrarAlerta} onExited={limpiarAlerta} />
      <CentroCostoFormModal abierto={formOpen} centroCosto={seleccionado} error={error} soloLectura={soloLectura} onClose={cerrarFormulario} onSubmit={guardar} />
      <CentroCostoDeleteModal abierto={deleteOpen || reactivarOpen} centroCosto={objetivo} modo={reactivarOpen ? 'reactivar' : 'eliminar'} onClose={cerrarConfirmacion} onConfirm={confirmar} />
    </div>
  )
}
