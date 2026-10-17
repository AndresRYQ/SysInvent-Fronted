import { useEffect, useMemo, useState } from 'react'
import { FiltrosPartesEquipo, type FiltrosPartesEquipoValores } from '../../components/partes-equipo/FiltrosPartesEquipo'
import { SnackbarAlert, useSnackbar } from '../../components/common/SnackbarAlert'
import { FormularioParteEquipo } from '../../components/partes-equipo/FormularioParteEquipo'
import { ParteEquipoDeleteModal } from '../../components/partes-equipo/ParteEquipoDeleteModal'
import { TablaPartesEquipo } from '../../components/partes-equipo/TablaPartesEquipo'
import { actualizarParteEquipo, crearParteEquipo, eliminarParteEquipo, listarPartesEquipo, reactivarParteEquipo } from '../../services/parteEquipoService'
import type { ParteEquipo, ParteEquipoFormData } from '../../types/parteEquipo'
import '../../styles/DashboardPage.css'
import '../../styles/maestros.css'

const FILTROS_INICIALES: FiltrosPartesEquipoValores = { busqueda: '', estado: '' }

function filtrarPartesEquipo(partes: ParteEquipo[], filtros: FiltrosPartesEquipoValores) {
  return partes.filter((parte) => (
    !filtros.estado || (filtros.estado === 'activo' ? parte.estado : !parte.estado)
  ))
}

export function PartesEquipoPage() {
  const [partes, setPartes] = useState<ParteEquipo[]>([])
  const [totalItems, setTotalItems] = useState(0)
  const [recarga, setRecarga] = useState(0)
  const [filtros, setFiltros] = useState(FILTROS_INICIALES)
  const [aplicados, setAplicados] = useState(FILTROS_INICIALES)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [formOpen, setFormOpen] = useState(false)
  const [soloLectura, setSoloLectura] = useState(false)
  const [seleccionado, setSeleccionado] = useState<ParteEquipo | null>(null)
  const [error, setError] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [modoConfirmacion, setModoConfirmacion] = useState<'desactivar' | 'reactivar'>('desactivar')
  const [objetivo, setObjetivo] = useState<ParteEquipo | null>(null)
  const { mensaje, abierta, mostrarAlerta, cerrarAlerta, limpiarAlerta } = useSnackbar()

  const filtrados = useMemo(() => filtrarPartesEquipo(partes, aplicados), [partes, aplicados])

  useEffect(() => {
    let activo = true
    listarPartesEquipo({ nombre: aplicados.busqueda, pagina: page, tamPagina: pageSize })
      .then((resultado) => {
        if (!activo) return
        setPartes(resultado.datos)
        setTotalItems(resultado.paginacion.totalElementos ?? resultado.datos.length)
      })
      .catch((e) => {
        if (!activo) return
        mostrarAlerta('error', e instanceof Error ? e.message : 'No se pudieron cargar las partes de equipo.')
      })
    return () => { activo = false }
  }, [aplicados.busqueda, page, pageSize, recarga])

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

  const guardar = async (datos: ParteEquipoFormData) => {
    try {
      const editando = Boolean(seleccionado)
      const respuesta = editando ? await actualizarParteEquipo(seleccionado!.id, datos) : await crearParteEquipo(datos)
      recargar()
      cerrarFormulario()
      mostrarAlerta('success', respuesta.message ?? (editando ? 'Parte de equipo actualizada correctamente.' : 'Parte de equipo registrada correctamente.'))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ocurrió un error inesperado.')
    }
  }

  const cerrarConfirmacion = () => {
    setConfirmOpen(false)
    setObjetivo(null)
  }

  const confirmar = async () => {
    if (!objetivo) return
    try {
      const respuesta = modoConfirmacion === 'reactivar' ? await reactivarParteEquipo(objetivo.id) : await eliminarParteEquipo(objetivo.id)
      recargar()
      mostrarAlerta('success', respuesta.message ?? (modoConfirmacion === 'reactivar' ? 'Parte de equipo reactivada correctamente.' : 'Parte de equipo desactivada correctamente.'))
    } catch (e) {
      mostrarAlerta('error', e instanceof Error ? e.message : 'No se pudo actualizar la parte de equipo.')
    } finally {
      cerrarConfirmacion()
    }
  }

  return (
    <div className="partes-equipo-page">
      <main className="dashboard-shell maestro-page-shell">
        <div className="container-xl px-0 maestro-page-body">
          <section className="maestro-topbar"><div className="maestro-topbar__copy"><h1>Partes de equipo</h1><p>Administración de partes y componentes utilizados por los equipos del almacén.</p></div></section>
          <div className="maestro-panel"><FiltrosPartesEquipo valores={filtros} onChange={(campo, valor) => setFiltros((actual) => ({ ...actual, [campo]: valor }))} onBuscar={() => { setAplicados({ ...filtros }); setPage(1) }} onLimpiar={() => { setFiltros(FILTROS_INICIALES); setAplicados(FILTROS_INICIALES); setPage(1) }} /></div>
          <div className="maestro-panel"><TablaPartesEquipo partesEquipo={filtrados} totalItems={aplicados.estado ? filtrados.length : totalItems} page={page} pageSize={pageSize} onAgregar={() => { setSeleccionado(null); setSoloLectura(false); setError(''); setFormOpen(true) }} onEditar={(item) => { setSeleccionado(item); setSoloLectura(false); setError(''); setFormOpen(true) }} onVisualizar={(item) => { setSeleccionado(item); setSoloLectura(true); setError(''); setFormOpen(true) }} onEliminar={(item) => { setObjetivo(item); setModoConfirmacion('desactivar'); setConfirmOpen(true) }} onReactivar={(item) => { setObjetivo(item); setModoConfirmacion('reactivar'); setConfirmOpen(true) }} onPageChange={setPage} onPageSizeChange={(size) => { setPageSize(size); setPage(1) }} /></div>
        </div>
      </main>
      <FormularioParteEquipo abierto={formOpen} parteEquipo={seleccionado} error={error} soloLectura={soloLectura} onClose={cerrarFormulario} onSubmit={guardar} />
      <SnackbarAlert mensaje={mensaje} abierta={abierta} onClose={cerrarAlerta} onExited={limpiarAlerta} />
      <ParteEquipoDeleteModal abierto={confirmOpen} parteEquipo={objetivo} onClose={cerrarConfirmacion} onConfirm={confirmar} modo={modoConfirmacion} />
    </div>
  )
}
