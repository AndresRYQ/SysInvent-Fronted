import { useEffect, useMemo, useState } from 'react'
import { CategoriaDeleteModal } from '../../components/categorias/CategoriaDeleteModal'
import { CategoriaFormModal } from '../../components/categorias/CategoriaFormModal'
import { FiltrosCategorias, type FiltrosCategoriasValores } from '../../components/categorias/FiltrosCategorias'
import { TablaCategorias } from '../../components/categorias/TablaCategorias'
import { SnackbarAlert, useSnackbar } from '../../components/common/SnackbarAlert'
import { actualizarCategoria, crearCategoria, eliminarCategoria, listarCategorias, reactivarCategoria } from '../../services/categoriaService'
import type { Categoria, CategoriaFormData } from '../../types/categoria'
import '../../styles/DashboardPage.css'
import '../../styles/maestros.css'

const FILTROS_INICIALES: FiltrosCategoriasValores = { nombre: '', estado: '' }

function filtrarCategorias(categorias: Categoria[], filtros: FiltrosCategoriasValores) {
  return categorias.filter((categoria) => (
    !filtros.estado || (filtros.estado === 'activo' ? categoria.activo === 1 : categoria.activo === 0)
  ))
}

export function CategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [totalItems, setTotalItems] = useState(-1)
  const [recarga, setRecarga] = useState(0)
  const [filtros, setFiltros] = useState(FILTROS_INICIALES)
  const [filtrosAplicados, setFiltrosAplicados] = useState(FILTROS_INICIALES)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [modalFormOpen, setModalFormOpen] = useState(false)
  const [modoVisualizacion, setModoVisualizacion] = useState(false)
  const [categoriaEnEdicion, setCategoriaEnEdicion] = useState<Categoria | null>(null)
  const [errorFormulario, setErrorFormulario] = useState('')
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false)
  const [categoriaAEliminar, setCategoriaAEliminar] = useState<Categoria | null>(null)
  const [modalReactivarOpen, setModalReactivarOpen] = useState(false)
  const [categoriaAReactivar, setCategoriaAReactivar] = useState<Categoria | null>(null)
  const { mensaje, abierta, mostrarAlerta, cerrarAlerta, limpiarAlerta } = useSnackbar()

  const filtradas = useMemo(() => filtrarCategorias(categorias, filtrosAplicados), [categorias, filtrosAplicados])

  useEffect(() => {
    let activo = true
    setTotalItems(-1)
    listarCategorias({ nombre: filtrosAplicados.nombre, pagina: page, tamPagina: pageSize })
      .then((resultado) => {
        if (!activo) return
        setCategorias(resultado.datos)
        setTotalItems(resultado.paginacion.totalElementos ?? resultado.datos.length)
      })
      .catch((e) => {
        if (!activo) return
        mostrarAlerta('error', e instanceof Error ? e.message : 'No se pudieron cargar las categorías.')
      })
    return () => { activo = false }
  }, [filtrosAplicados.nombre, page, pageSize, recarga])

  const recargar = () => {
    setPage(1)
    setRecarga((actual) => actual + 1)
  }

  const cerrarFormulario = () => {
    setModalFormOpen(false)
    setCategoriaEnEdicion(null)
    setModoVisualizacion(false)
    setErrorFormulario('')
  }

  const guardarCategoria = async (datos: CategoriaFormData) => {
    try {
      const editando = Boolean(categoriaEnEdicion)
      const respuesta = editando
        ? await actualizarCategoria(categoriaEnEdicion!.id, datos)
        : await crearCategoria(datos)
      recargar()
      cerrarFormulario()
      mostrarAlerta('success', respuesta.message ?? (editando ? 'Categoría actualizada correctamente.' : 'Categoría registrada correctamente.'))
    } catch (error) {
      setErrorFormulario(error instanceof Error ? error.message : 'Ocurrió un error inesperado.')
    }
  }

  const cerrarConfirmacionEliminar = () => {
    setModalDeleteOpen(false)
    setCategoriaAEliminar(null)
  }

  const confirmarEliminacion = async () => {
    if (!categoriaAEliminar) return
    try {
      const respuesta = await eliminarCategoria(categoriaAEliminar.id)
      recargar()
      cerrarConfirmacionEliminar()
      mostrarAlerta('success', respuesta.message ?? 'Categoría desactivada correctamente.')
    } catch (error) {
      cerrarConfirmacionEliminar()
      mostrarAlerta('error', error instanceof Error ? error.message : 'No se pudo desactivar la categoría.')
    }
  }

  const confirmarReactivacion = async () => {
    if (!categoriaAReactivar) return
    try {
      const respuesta = await reactivarCategoria(categoriaAReactivar.id)
      recargar()
      mostrarAlerta('success', respuesta.message ?? 'Categoría reactivada correctamente.')
    } catch (error) {
      mostrarAlerta('error', error instanceof Error ? error.message : 'No se pudo reactivar la categoría.')
    } finally {
      setModalReactivarOpen(false)
      setCategoriaAReactivar(null)
    }
  }

  return (
    <div className="categorias-page">
      <main className="dashboard-shell maestro-page-shell">
        <div className="container-xl px-0 maestro-page-body">
          <section className="maestro-topbar"><div className="maestro-topbar__copy"><h1>Categorías</h1><p>Administración de las categorías utilizadas en el inventario.</p></div></section>
          <div className="maestro-panel">
            <FiltrosCategorias valores={filtros} onChange={(campo, valor) => setFiltros((actual) => ({ ...actual, [campo]: valor }))} onBuscar={() => { setFiltrosAplicados({ ...filtros }); setPage(1) }} onLimpiar={() => { setFiltros(FILTROS_INICIALES); setFiltrosAplicados(FILTROS_INICIALES); setPage(1) }} />
          </div>
          <div className="maestro-panel">
            <TablaCategorias categorias={filtradas} totalItems={filtrosAplicados.estado ? filtradas.length : totalItems} page={page} pageSize={pageSize} onAgregar={() => { setCategoriaEnEdicion(null); setModoVisualizacion(false); setErrorFormulario(''); setModalFormOpen(true) }} onEditar={(item) => { setCategoriaEnEdicion(item); setModoVisualizacion(false); setErrorFormulario(''); setModalFormOpen(true) }} onVisualizar={(item) => { setCategoriaEnEdicion(item); setModoVisualizacion(true); setErrorFormulario(''); setModalFormOpen(true) }} onEliminar={(item) => { setCategoriaAEliminar(item); setModalDeleteOpen(true) }} onReactivar={(item) => { setCategoriaAReactivar(item); setModalReactivarOpen(true) }} onPageChange={setPage} onPageSizeChange={(size) => { setPageSize(size); setPage(1) }} />
          </div>
        </div>
      </main>
      <SnackbarAlert mensaje={mensaje} abierta={abierta} onClose={cerrarAlerta} onExited={limpiarAlerta} />
      <CategoriaFormModal abierto={modalFormOpen} categoria={categoriaEnEdicion} error={errorFormulario} soloLectura={modoVisualizacion} onClose={cerrarFormulario} onSubmit={guardarCategoria} />
      <CategoriaDeleteModal abierto={modalDeleteOpen} categoria={categoriaAEliminar} onClose={cerrarConfirmacionEliminar} onConfirm={confirmarEliminacion} />
      <CategoriaDeleteModal abierto={modalReactivarOpen} categoria={categoriaAReactivar} modo="reactivar" onClose={() => { setModalReactivarOpen(false); setCategoriaAReactivar(null) }} onConfirm={confirmarReactivacion} />
    </div>
  )
}
