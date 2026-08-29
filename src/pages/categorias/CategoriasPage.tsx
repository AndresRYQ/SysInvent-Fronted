import { useEffect, useMemo, useState } from 'react'

import { CategoriaDeleteModal } from '../../components/categorias/CategoriaDeleteModal'
import { CategoriaFormModal } from '../../components/categorias/CategoriaFormModal'
import {
  FiltrosCategorias,
  type FiltrosCategoriasValores,
} from '../../components/categorias/FiltrosCategorias'
import { TablaCategorias } from '../../components/categorias/TablaCategorias'
import type { Categoria } from '../../types/categoria'
import '../../styles/DashboardPage.css'
import './CategoriasPage.css'

const FILTROS_INICIALES: FiltrosCategoriasValores = {
  nombre: '',
  estado: '',
}

const CATEGORIAS_MOCK: Categoria[] = [
  {
    id: 'CAT-001',
    nombre: 'Herramientas',
    estado: true,
    descripcion: 'Implementos y accesorios de uso tecnico.',
    fechaRegistro: '10/08/2026',
  },
  {
    id: 'CAT-002',
    nombre: 'Seguridad Industrial',
    estado: true,
    descripcion: 'Equipos para proteccion personal.',
    fechaRegistro: '11/08/2026',
  },
  {
    id: 'CAT-003',
    nombre: 'Ferreteria',
    estado: true,
    descripcion: 'Materiales y piezas de soporte operativo.',
    fechaRegistro: '12/08/2026',
  },
  {
    id: 'CAT-004',
    nombre: 'Repuestos',
    estado: true,
    descripcion: 'Piezas de reemplazo para mantenimiento.',
    fechaRegistro: '13/08/2026',
  },
  {
    id: 'CAT-005',
    nombre: 'Limpieza',
    estado: false,
    descripcion: 'Insumos para orden e higiene del almacen.',
    fechaRegistro: '14/08/2026',
  },
]

function filtrarCategorias(
  categorias: Categoria[],
  filtros: FiltrosCategoriasValores,
) {
  const nombre = filtros.nombre
    .trim()
    .toLowerCase()

  return categorias.filter((categoria) => {
    const coincideNombre =
      nombre.length === 0 ||
      categoria.nombre
        .toLowerCase()
        .includes(nombre)

    const coincideEstado =
      filtros.estado.length === 0 ||
      (filtros.estado === 'activo' &&
        categoria.estado) ||
      (filtros.estado === 'inactivo' &&
        !categoria.estado)

    return coincideNombre && coincideEstado
  })
}

function crearFechaActual() {
  return new Intl.DateTimeFormat('es-PE').format(
    new Date(),
  )
}

export function CategoriasPage() {
  const [categorias, setCategorias] =
    useState<Categoria[]>(CATEGORIAS_MOCK)
  const [filtros, setFiltros] =
    useState<FiltrosCategoriasValores>(
      FILTROS_INICIALES,
    )
  const [filtrosAplicados, setFiltrosAplicados] =
    useState<FiltrosCategoriasValores>(
      FILTROS_INICIALES,
    )
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [modalFormOpen, setModalFormOpen] =
    useState(false)
  const [categoriaEnEdicion, setCategoriaEnEdicion] =
    useState<Categoria | null>(null)
  const [modalDeleteOpen, setModalDeleteOpen] =
    useState(false)
  const [categoriaAEliminar, setCategoriaAEliminar] =
    useState<Categoria | null>(null)

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
    const endIndex = startIndex + pageSize

    return categoriasFiltradas.slice(
      startIndex,
      endIndex,
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

  return (
    <>
      <main className="dashboard-shell categories-page-shell">
        <div className="container-xl px-0 categories-page-body">
          <section className="categories-topbar">
            <div className="categories-topbar__copy">
              <h1>Categorías</h1>
              <p>Mantenimiento de categorías</p>
            </div>
          </section>

          <div className="categories-panel">
            <FiltrosCategorias
              valores={filtros}
              onChange={(campo, valor) =>
                setFiltros((actual) => ({
                  ...actual,
                  [campo]: valor,
                }))
              }
              onBuscar={() => {
                setFiltrosAplicados(filtros)
                setPage(1)
              }}
              onLimpiar={() => {
                setFiltros(FILTROS_INICIALES)
                setFiltrosAplicados(FILTROS_INICIALES)
                setPage(1)
              }}
            />
          </div>

          <div className="categories-panel">
            <TablaCategorias
              categorias={categoriasPaginadas}
              totalItems={totalItems}
              page={page}
              pageSize={pageSize}
              onAgregar={() => {
                setCategoriaEnEdicion(null)
                setModalFormOpen(true)
              }}
              onEditar={(categoria) => {
                setCategoriaEnEdicion(categoria)
                setModalFormOpen(true)
              }}
              onEliminar={(categoria) => {
                setCategoriaAEliminar(categoria)
                setModalDeleteOpen(true)
              }}
              onPageChange={(nextPage) =>
                setPage(nextPage)
              }
              onPageSizeChange={(nextPageSize) => {
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
        onClose={() => {
          setModalFormOpen(false)
          setCategoriaEnEdicion(null)
        }}
        onSubmit={(payload) => {
          if (categoriaEnEdicion) {
            setCategorias((actual) =>
              actual.map((categoria) =>
                categoria.id ===
                categoriaEnEdicion.id
                  ? {
                      ...categoria,
                      ...payload,
                    }
                  : categoria,
              ),
            )
          } else {
            setCategorias((actual) => {
              const nextId = String(
                actual.length + 1,
              ).padStart(3, '0')

              return [
                {
                  id: `CAT-${nextId}`,
                  fechaRegistro:
                    crearFechaActual(),
                  estado: true,
                  ...payload,
                },
                ...actual,
              ]
            })
          }

          setModalFormOpen(false)
          setCategoriaEnEdicion(null)
        }}
      />

      <CategoriaDeleteModal
        abierto={modalDeleteOpen}
        categoria={categoriaAEliminar}
        onClose={() => {
          setModalDeleteOpen(false)
          setCategoriaAEliminar(null)
        }}
        onConfirm={() => {
          if (categoriaAEliminar) {
            setCategorias((actual) =>
              actual.filter(
                (categoria) =>
                  categoria.id !==
                  categoriaAEliminar.id,
              ),
            )
          }

          setModalDeleteOpen(false)
          setCategoriaAEliminar(null)
        }}
      />
    </>
  )
}
