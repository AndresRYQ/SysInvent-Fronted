import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import { CategoriaDeleteModal } from '../../components/categorias/CategoriaDeleteModal'
import { CategoriaFormModal } from '../../components/categorias/CategoriaFormModal'

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

interface MensajePagina {
  tipo: 'success' | 'danger'
  texto: string
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
        categoria.estado) ||
      (filtros.estado === 'inactivo' &&
        !categoria.estado)

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

  const [
    categoriaEnEdicion,
    setCategoriaEnEdicion,
  ] = useState<Categoria | null>(null)

  const [errorFormulario, setErrorFormulario] =
    useState('')

  const [
    modalDeleteOpen,
    setModalDeleteOpen,
  ] = useState(false)

  const [
    categoriaAEliminar,
    setCategoriaAEliminar,
  ] = useState<Categoria | null>(null)

  const [mensaje, setMensaje] =
    useState<MensajePagina | null>(null)

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
    setMensaje(null)
    setErrorFormulario('')
    setCategoriaEnEdicion(null)
    setModalFormOpen(true)
  }

  function abrirFormularioEdicion(
    categoria: Categoria,
  ): void {
    setMensaje(null)
    setErrorFormulario('')
    setCategoriaEnEdicion(categoria)
    setModalFormOpen(true)
  }

  function cerrarFormulario(): void {
    setModalFormOpen(false)
    setCategoriaEnEdicion(null)
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

        setMensaje({
          tipo: 'success',
          texto:
            'Categoría actualizada correctamente.',
        })
      } else {
        crearCategoria(datos)

        setMensaje({
          tipo: 'success',
          texto:
            'Categoría registrada correctamente.',
        })
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
    setMensaje(null)
    setCategoriaAEliminar(categoria)
    setModalDeleteOpen(true)
  }

  function cerrarConfirmacionEliminar(): void {
    setModalDeleteOpen(false)
    setCategoriaAEliminar(null)
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

      setMensaje({
        tipo: 'success',
        texto:
          'Categoría eliminada correctamente.',
      })
    } catch (error) {
      cerrarConfirmacionEliminar()

      setMensaje({
        tipo: 'danger',
        texto: obtenerMensajeError(error),
      })
    }
  }

  return (
    <>
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

          {mensaje && (
            <div
              className={`alert alert-${mensaje.tipo} alert-dismissible fade show`}
              role="alert"
            >
              {mensaje.texto}

              <button
                type="button"
                className="btn-close"
                aria-label="Cerrar"
                onClick={() => setMensaje(null)}
              />
            </div>
          )}

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
              onEliminar={
                abrirConfirmacionEliminar
              }
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
        onClose={cerrarFormulario}
        onSubmit={guardarCategoria}
      />

      <CategoriaDeleteModal
        abierto={modalDeleteOpen}
        categoria={categoriaAEliminar}
        onClose={
          cerrarConfirmacionEliminar
        }
        onConfirm={confirmarEliminacion}
      />
    </>
  )
}