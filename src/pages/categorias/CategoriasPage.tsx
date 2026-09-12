import { useEffect, useMemo, useState } from 'react'

import { CategoriaDeleteModal } from '../../components/categorias/CategoriaDeleteModal'
import { CategoriaFormModal } from '../../components/categorias/CategoriaFormModal'
import {
  FiltrosCategorias,
  type FiltrosCategoriasValores,
} from '../../components/categorias/FiltrosCategorias'
import { TablaCategorias } from '../../components/categorias/TablaCategorias'
import {
  guardarStorage,
  obtenerStorage,
  STORAGE_KEYS,
} from '../../services/storageService'
import type { Categoria } from '../../types/categoria'
import '../../styles/DashboardPage.css'
import '../../styles/maestros.css'

const FILTROS_INICIALES: FiltrosCategoriasValores = {
  nombre: '',
  estado: '',
}

const CATEGORIAS_MOCK: Categoria[] = [
  {
    id: 'CAT-001',
    nombre: 'Herramientas',
    estado: true,
    descripcion: 'Implementos y accesorios de uso técnico.',
    fechaRegistro: '10/08/2026',
  },
  {
    id: 'CAT-002',
    nombre: 'Seguridad Industrial',
    estado: true,
    descripcion: 'Equipos para protección personal.',
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
    descripcion: 'Insumos para orden e higiene del almacén.',
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

  return categorias
    .filter((categoria) => {
    const coincideNombre =
      nombre.length === 0 ||
      categoria.nombre
        .toLowerCase()
        .includes(nombre)

    const coincideEstado =
      filtros.estado.length === 0 ||
      (filtros.estado === 'activo' &&
        categoria.activo === 1) ||
      (filtros.estado === 'inactivo' &&
        categoria.activo === 0)

    return coincideNombre && coincideEstado
    })
    .sort((a, b) => a.id - b.id)
}

export function CategoriasPage() {
  const [categorias, setCategorias] =
    useState<Categoria[]>(() =>
      obtenerStorage<Categoria[]>(
        STORAGE_KEYS.categorias,
        [],
      ).map((categoria) => ({
        ...categoria,
        id: Number(
          String(categoria.id).replace('CAT-', ''),
        ),
      })),
    )
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
  const [modalSoloLectura, setModalSoloLectura] =
    useState(false)
  const [modalReactivarOpen, setModalReactivarOpen] =
    useState(false)
  const [categoriaAReactivar, setCategoriaAReactivar] =
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
    guardarStorage(
      STORAGE_KEYS.categorias,
      categorias,
    )
  }, [categorias])

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
      <main className="dashboard-shell maestro-page-shell">
        <div className="container-xl px-0 maestro-page-body">
          <section className="maestro-topbar">
            <div className="maestro-topbar__copy">
              <h1>Categorías</h1>
              <p>Mantenimiento de categorías</p>
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

          <div className="maestro-panel">
            <TablaCategorias
              categorias={categoriasPaginadas}
              totalItems={totalItems}
              page={page}
              pageSize={pageSize}
              onAgregar={() => {
                setCategoriaEnEdicion(null)
                setModalSoloLectura(false)
                setModalFormOpen(true)
              }}
              onEditar={(categoria) => {
                setCategoriaEnEdicion(categoria)
                setModalSoloLectura(false)
                setModalFormOpen(true)
              }}
              onVisualizar={(categoria) => {
                setCategoriaEnEdicion(categoria)
                setModalSoloLectura(true)
                setModalFormOpen(true)
              }}
              onEliminar={(categoria) => {
                setCategoriaAEliminar(categoria)
                setModalDeleteOpen(true)
              }}
              onReactivar={(categoria) => {
                setCategoriaAReactivar(categoria)
                setModalReactivarOpen(true)
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
        soloLectura={modalSoloLectura}
        onClose={() => {
          setModalFormOpen(false)
          setCategoriaEnEdicion(null)
          setModalSoloLectura(false)
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
              const ultimoId = actual.reduce(
                (maximo, categoria) =>
                  Number.isNaN(categoria.id)
                    ? maximo
                    : Math.max(maximo, categoria.id),
                0,
              )

              return [
                {
                  id: ultimoId + 1,
                  activo: 1,
                  ...payload,
                },
                ...actual,
              ]
            })
          }

          setModalFormOpen(false)
          setCategoriaEnEdicion(null)
          setModalSoloLectura(false)
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
              actual.map((categoria) =>
                categoria.id !== categoriaAEliminar.id
                  ? categoria
                  : { ...categoria, activo: 0 },
              ),
            )
          }

          setModalDeleteOpen(false)
          setCategoriaAEliminar(null)
        }}
      />

      <CategoriaDeleteModal
        abierto={modalReactivarOpen}
        categoria={categoriaAReactivar}
        accion="reactivar"
        onClose={() => {
          setModalReactivarOpen(false)
          setCategoriaAReactivar(null)
        }}
        onConfirm={() => {
          if (categoriaAReactivar) {
            setCategorias((actual) =>
              actual.map((categoria) =>
                categoria.id === categoriaAReactivar.id
                  ? { ...categoria, activo: 1 }
                  : categoria,
              ),
            )
          }

          setModalReactivarOpen(false)
          setCategoriaAReactivar(null)
        }}
      />
    </>
  )
}

