import { useEffect, useMemo, useState } from 'react'
import { SnackbarAlert, useSnackbar } from '../../components/common/SnackbarAlert'
import { FiltrosTiposDocumento, type FiltrosTiposDocumentoValores } from '../../components/tipos-documento/FiltrosTiposDocumento'
import { TablaTiposDocumento } from '../../components/tipos-documento/TablaTiposDocumento'
import { TipoDocumentoDeleteModal } from '../../components/tipos-documento/TipoDocumentoDeleteModal'
import { TipoDocumentoFormModal } from '../../components/tipos-documento/TipoDocumentoFormModal'
import { actualizarTipoDocumento, crearTipoDocumento, eliminarTipoDocumento, listarTiposDocumento, reactivarTipoDocumento } from '../../services/tipoDocumentoService'
import type { TipoDocumento, TipoDocumentoFormData } from '../../types/tipoDocumento'
import '../../styles/DashboardPage.css'
import '../../styles/maestros.css'

const INICIALES: FiltrosTiposDocumentoValores = { nombre: '', estado: '' }

function filtrar(lista: TipoDocumento[], filtros: FiltrosTiposDocumentoValores) {
  return lista.filter((tipo) => (
    !filtros.estado || (filtros.estado === 'activo' ? tipo.activo === 1 : tipo.activo === 0)
  ))
}

export function TiposDocumentoPage() {
  const [lista, setLista] = useState<TipoDocumento[]>([])
  const [totalItems, setTotalItems] = useState(0)
  const [recarga, setRecarga] = useState(0)
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

  useEffect(() => {
    let activo = true
    listarTiposDocumento({
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
        mostrarAlerta('error', e instanceof Error ? e.message : 'No se pudieron cargar los tipos de documento.')
      })
    return () => { activo = false }
  }, [aplicados.nombre, page, pageSize, recarga])

  const recargar = () => {
    setPage(1)
    setRecarga((actual) => actual + 1)
  }

  const cerrarForm = () => {
    setFormOpen(false)
    setSeleccionado(null)
    setSoloLectura(false)
    setError('')
  }

  const guardar = async (datos: TipoDocumentoFormData) => {
    try {
      const editando = Boolean(seleccionado)
      const respuesta = editando
        ? await actualizarTipoDocumento(seleccionado!.id, datos)
        : await crearTipoDocumento(datos)
      recargar()
      cerrarForm()
      mostrarAlerta('success', respuesta.message ?? (editando
        ? 'Tipo de documento actualizado correctamente.'
        : 'Tipo de documento registrado correctamente.'))
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
      const respuesta = reactivando
        ? await reactivarTipoDocumento(objetivo.id)
        : await eliminarTipoDocumento(objetivo.id)
      recargar()
      mostrarAlerta('success', respuesta.message ?? (reactivando
        ? 'Tipo de documento reactivado correctamente.'
        : 'Tipo de documento desactivado correctamente.'))
    } catch (e) {
      mostrarAlerta('error', e instanceof Error ? e.message : 'No se pudo actualizar el tipo de documento.')
    } finally {
      cerrarConfirmacion()
    }
  }

  return (
    <div className="tipos-documento-page">
      <main className="dashboard-shell maestro-page-shell">
        <div className="container-xl px-0 maestro-page-body">
          <section className="maestro-topbar">
            <div className="maestro-topbar__copy">
              <h1>Tipos de documento</h1>
              <p>Administración de los documentos utilizados en las operaciones del almacén.</p>
            </div>
          </section>

          <div className="maestro-panel">
            <FiltrosTiposDocumento
              valores={filtros}
              onChange={(campo, valor) => setFiltros((actual) => ({ ...actual, [campo]: valor }))}
              onBuscar={() => { setAplicados({ ...filtros }); setPage(1) }}
              onLimpiar={() => { setFiltros(INICIALES); setAplicados(INICIALES); setPage(1) }}
            />
          </div>

          <div className="maestro-panel">
            <TablaTiposDocumento
              tiposDocumento={filtrados}
              totalItems={aplicados.estado ? filtrados.length : totalItems}
              page={page}
              pageSize={pageSize}
              onAgregar={() => { setSeleccionado(null); setSoloLectura(false); setError(''); setFormOpen(true) }}
              onEditar={(item) => { setSeleccionado(item); setSoloLectura(false); setError(''); setFormOpen(true) }}
              onVisualizar={(item) => { setSeleccionado(item); setSoloLectura(true); setError(''); setFormOpen(true) }}
              onEliminar={(item) => { setObjetivo(item); setDeleteOpen(true) }}
              onReactivar={(item) => { setObjetivo(item); setReactivarOpen(true) }}
              onPageChange={setPage}
              onPageSizeChange={(size) => { setPageSize(size); setPage(1) }}
            />
          </div>
        </div>
      </main>

      <SnackbarAlert mensaje={mensaje} abierta={abierta} onClose={cerrarAlerta} onExited={limpiarAlerta} />
      <TipoDocumentoFormModal abierto={formOpen} tipoDocumento={seleccionado} error={error} soloLectura={soloLectura} onClose={cerrarForm} onSubmit={guardar} />
      <TipoDocumentoDeleteModal abierto={deleteOpen || reactivarOpen} tipoDocumento={objetivo} modo={reactivarOpen ? 'reactivar' : 'desactivar'} onClose={cerrarConfirmacion} onConfirm={confirmar} />
    </div>
  )
}
