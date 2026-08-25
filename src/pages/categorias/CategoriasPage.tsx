import { useEffect, useMemo, useState } from 'react'

import { CategoriaDeleteModal } from '../../components/categorias/CategoriaDeleteModal'
import { CategoriaFormModal } from '../../components/categorias/CategoriaFormModal'
import {
  FiltrosCategorias,
  type FiltrosCategoriasValores,
} from '../../components/categorias/FiltrosCategorias'
import { TablaCategorias } from '../../components/categorias/TablaCategorias'
import { useAuth } from '../../hooks/useAuth'
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
  {
    id: 'CAT-006',
    nombre: 'Oficina',
    estado: true,
    descripcion: 'Utiles y materiales administrativos.',
    fechaRegistro: '15/08/2026',
  },
  {
    id: 'CAT-007',
    nombre: 'Electricos',
    estado: true,
    descripcion: 'Consumibles y partes para instalaciones.',
    fechaRegistro: '16/08/2026',
  },
  {
    id: 'CAT-008',
    nombre: 'Mecanica',
    estado: false,
    descripcion: 'Elementos para soporte de maquinaria.',
    fechaRegistro: '17/08/2026',
  },
  {
    id: 'CAT-009',
    nombre: 'Soldadura',
    estado: true,
    descripcion: 'Materiales para trabajos de union y corte.',
    fechaRegistro: '18/08/2026',
  },
  {
    id: 'CAT-010',
    nombre: 'Lubricantes',
    estado: true,
    descripcion: 'Aceites y grasas para mantenimiento.',
    fechaRegistro: '19/08/2026',
  },
  {
    id: 'CAT-011',
    nombre: 'Jardineria',
    estado: false,
    descripcion: 'Herramientas e insumos para areas verdes.',
    fechaRegistro: '20/08/2026',
  },
  {
    id: 'CAT-012',
    nombre: 'Construccion',
    estado: true,
    descripcion: 'Materiales de obra y acabados.',
    fechaRegistro: '21/08/2026',
  },
  {
    id: 'CAT-013',
    nombre: 'Pinturas',
    estado: true,
    descripcion: 'Recubrimientos y accesorios de aplicacion.',
    fechaRegistro: '22/08/2026',
  },
  {
    id: 'CAT-014',
    nombre: 'Senalizacion',
    estado: true,
    descripcion: 'Elementos visuales de orientacion y seguridad.',
    fechaRegistro: '23/08/2026',
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
  const { sesion, logout } = useAuth()
  const nombreCompleto = sesion?.nombreCompleto ?? 'Usuario sin sesión'
  const nombreUsuario = sesion?.usuario ?? 'usuario'
  const rolUsuario = sesion?.rol ?? 'Sin rol'
  const inicialesUsuario = nombreCompleto
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase() ?? '')
    .join('') || 'US'

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
        <nav className="topbar" aria-label="Navegacion principal">
          <a className="brand" href="/dashboard">
            <span className="brand-mark">🌿</span>
            <span className="brand-name">AGRIHUASA</span>
            <span className="brand-system">FFPMS</span>
          </a>

          <div className="nav-links">
            <a className="nav-link" href="/dashboard">
              Inicio
            </a>
            <a className="nav-link is-active" href="/categorias">
              Categorías
            </a>
            <a className="nav-link" href="/dashboard">
              Reportes
            </a>
          </div>

          <div className="topbar-actions">
            <button
              className="notification-button"
              type="button"
              aria-label="Notificaciones"
            >
              🔔
              <span>3</span>
            </button>

            <button
              className="user-menu"
              type="button"
              onClick={logout}
            >
              <span className="avatar">{inicialesUsuario}</span>
              <span>
                <strong>{nombreCompleto}</strong>
                <small>{rolUsuario}</small>
              </span>
            </button>
          </div>
        </nav>

        <section className="categories-summary-wrapper">
          <div className="categories-summary-card">
            <span className="categories-kicker">Sesión activa</span>
            <h1 className="categories-section-title">
              Módulo de categorías
            </h1>
            <p className="categories-section-copy">
              Usuario activo: <strong>{nombreCompleto}</strong> ·{' '}
              {nombreUsuario} · {rolUsuario}
            </p>
          </div>
        </section>

        <div className="container-xl px-0 categories-page-body">
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
