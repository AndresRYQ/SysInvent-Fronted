import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import { CategoriaDeleteModal } from '../../components/categorias/CategoriaDeleteModal'
import { CategoriaFormModal } from '../../components/categorias/CategoriaFormModal'
import { SnackbarAlert, useSnackbar } from '../../components/common/SnackbarAlert'

import {
  FiltrosCategorias,
  type FiltrosCategoriasValores,
} from '../../components/categorias/FiltrosCategorias'

import { TablaCategorias } from '../../components/categorias/TablaCategorias'

import {
  actualizarCategoria,
  crearCategoria,
  eliminarCategoria,
  obtenerCategorias,
  reactivarCategoria,
} from '../../services/categoriaService'

import type {
  Categoria,
  CategoriaFormData,
} from '../../types/categoria'

import '../../styles/DashboardPage.css'
import '../../styles/maestros.css'

const FILTROS_INICIALES: FiltrosCategoriasValores = {
  nombre: '',
  estado: '',
}

function filtrarCategorias(
  categorias: Categoria[],
  filtros: FiltrosCategoriasValores,
): Categoria[] {
  const nombre = filtros.nombre
    .trim()
    .toLowerCase()

  return categorias.filter((categoria) => {
    const coincideNombre =
      !nombre ||
      categoria.nombre
        .toLowerCase()
        .includes(nombre)

    const coincideEstado =
      !filtros.estado ||
      (filtros.estado === 'activo' &&
        categoria.activo === 1) ||
      (filtros.estado === 'inactivo' &&
        categoria.activo === 0)

    return coincideNombre && coincideEstado
  })
}

function obtenerMensajeError(error: unknown): string {
  return error instanceof Error
    ? error.message
    : 'Ocurrió un error inesperado.'
}

export function CategoriasPage() {
  const [categorias, setCategorias] =
    useState<Categoria[]>(() =>
      obtenerCategorias(),
    )

  const [filtros, setFiltros] =
    useState<FiltrosCategoriasValores>(
      FILTROS_INICIALES,
    )

  const [
    filtrosAplicados,
    setFiltrosAplicados,
  ] = useState<FiltrosCategoriasValores>(
    FILTROS_INICIALES,
  )

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const [modalFormOpen, setModalFormOpen] =
    useState(false)
  const [modoVisualizacion, setModoVisualizacion] = useState(false)

  const [
    categoriaEnEdicion,
    setCategoriaEnEdicion,
  ] = useState<Categoria | null>(null)

  const [errorFormulario, setErrorFormulario] =
    useState('')

  // Se conserva temporalmente la setter para la integración futura de notificaciones.
  const { mensaje, abierta, mostrarAlerta, cerrarAlerta, limpiarAlerta } = useSnackbar()

  const [
    modalDeleteOpen,
    setModalDeleteOpen,
  ] = useState(false)

  const [
    categoriaAEliminar,
    setCategoriaAEliminar,
  ] = useState<Categoria | null>(null)

  const [modalReactivarOpen, setModalReactivarOpen] = useState(false)
  const [categoriaAReactivar, setCategoriaAReactivar] = useState<Categoria | null>(null)

  const categoriasFiltradas = useMemo(
    () =>
      filtrarCategorias(
        categorias,
        filtrosAplicados,
      ),
    [categorias, filtrosAplicados],
  )

  const totalItems = categoriasFiltradas.length

  const categoriasPaginadas = useMemo(() => {
    const startIndex = (page - 1) * pageSize

    return categoriasFiltradas.slice(
      startIndex,
      startIndex + pageSize,
    )
  }, [
    categoriasFiltradas,
    page,
    pageSize,
  ])

  useEffect(() => {
    const totalPages = Math.max(
      1,
      Math.ceil(totalItems / pageSize),
    )

    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [page, pageSize, totalItems])

  function recargarCategorias(): void {
    setCategorias(obtenerCategorias())
  }

  function abrirFormularioNuevo(): void {
    setErrorFormulario('')
    setCategoriaEnEdicion(null)
    setModoVisualizacion(false)
    setModalFormOpen(true)
  }

  function abrirFormularioEdicion(
    categoria: Categoria,
  ): void {
    setErrorFormulario('')
    setCategoriaEnEdicion(categoria)
    setModoVisualizacion(false)
    setModalFormOpen(true)
  }

  function abrirVisualizacion(categoria: Categoria): void {
    setErrorFormulario('')
    setCategoriaEnEdicion(categoria)
    setModoVisualizacion(true)
    setModalFormOpen(true)
  }

  function cerrarFormulario(): void {
    setModalFormOpen(false)
    setCategoriaEnEdicion(null)
    setModoVisualizacion(false)
    setErrorFormulario('')
  }

  function guardarCategoria(
    datos: CategoriaFormData,
  ): void {
    try {
      if (categoriaEnEdicion) {
        actualizarCategoria(
          categoriaEnEdicion.id,
          datos,
        )

        mostrarAlerta('success', 'Categoría actualizada correctamente.')
      } else {
        crearCategoria(datos)

        mostrarAlerta('success', 'Categoría registrada correctamente.')
      }

      recargarCategorias()
      cerrarFormulario()
      setPage(1)
    } catch (error) {
      setErrorFormulario(
        obtenerMensajeError(error),
      )
    }
  }

  function abrirConfirmacionEliminar(
    categoria: Categoria,
  ): void {
    setCategoriaAEliminar(categoria)
    setModalDeleteOpen(true)
  }

  function cerrarConfirmacionEliminar(): void {
    setModalDeleteOpen(false)
    setCategoriaAEliminar(null)
  }

  function reactivar(categoria: Categoria): void {
    setCategoriaAReactivar(categoria)
    setModalReactivarOpen(true)
  }

  function confirmarReactivacion(): void {
    if (!categoriaAReactivar) return
    try {
      reactivarCategoria(categoriaAReactivar.id)
      recargarCategorias()
      mostrarAlerta('success', 'Categoría reactivada correctamente.')
    } catch (error) {
      mostrarAlerta('error', obtenerMensajeError(error))
    } finally {
      setModalReactivarOpen(false)
      setCategoriaAReactivar(null)
    }
  }

  function confirmarEliminacion(): void {
    if (!categoriaAEliminar) {
      return
    }

    try {
      eliminarCategoria(
        categoriaAEliminar.id,
      )

      recargarCategorias()
      cerrarConfirmacionEliminar()

      mostrarAlerta('success', 'Categoría eliminada correctamente.')
    } catch (error) {
      cerrarConfirmacionEliminar()

      mostrarAlerta('error', obtenerMensajeError(error))
    }
  }

  return (
    <div className="categorias-page">
      <main className="dashboard-shell maestro-page-shell">
        <div className="container-xl px-0 maestro-page-body">
          <section className="maestro-topbar">
            <div className="maestro-topbar__copy">
              <h1>Categorías</h1>

              <p>
                Administración de categorías para
                clasificar los productos del almacén.
              </p>
            </div>
          </section>

          <div className="maestro-panel">
            <FiltrosCategorias
              valores={filtros}
              onChange={(campo, valor) =>
                setFiltros((actual) => ({
                  ...actual,
                  [campo]: valor,
                }))
              }
              onBuscar={() => {
                setFiltrosAplicados({
                  ...filtros,
                })
                setPage(1)
              }}
              onLimpiar={() => {
                setFiltros(FILTROS_INICIALES)
                setFiltrosAplicados(
                  FILTROS_INICIALES,
                )
                setPage(1)
              }}
            />
          </div>

          <div className="maestro-panel">
            <TablaCategorias
              categorias={categoriasPaginadas}
              totalItems={totalItems}
              page={page}
              pageSize={pageSize}
              onAgregar={
                abrirFormularioNuevo
              }
              onEditar={
                abrirFormularioEdicion
              }
              onVisualizar={abrirVisualizacion}
              onEliminar={
                abrirConfirmacionEliminar
              }
              onReactivar={reactivar}
              onPageChange={setPage}
              onPageSizeChange={(
                nextPageSize,
              ) => {
                setPageSize(nextPageSize)
                setPage(1)
              }}
            />
          </div>
        </div>
      </main>

      <CategoriaFormModal
        abierto={modalFormOpen}
        categoria={categoriaEnEdicion}
        error={errorFormulario}
        soloLectura={modoVisualizacion}
        onClose={cerrarFormulario}
        onSubmit={guardarCategoria}
      />

      <SnackbarAlert
        mensaje={mensaje}
        abierta={abierta}
        onClose={cerrarAlerta}
        onExited={limpiarAlerta}
      />

      <CategoriaDeleteModal
        abierto={modalDeleteOpen}
        categoria={categoriaAEliminar}
        onClose={
          cerrarConfirmacionEliminar
        }
        onConfirm={confirmarEliminacion}
      />

      <CategoriaDeleteModal
        abierto={modalReactivarOpen}
        categoria={categoriaAReactivar}
        modo="reactivar"
        onClose={() => {
          setModalReactivarOpen(false)
          setCategoriaAReactivar(null)
        }}
        onConfirm={confirmarReactivacion}
      />
    </div>
  )
}
