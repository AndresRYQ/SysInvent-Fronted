import { useEffect, useMemo, useState } from 'react'

import {
  FiltrosCategorias,
  type FiltrosCategoriasValores,
} from '../../components/categorias/FiltrosCategorias'
import { TablaCategorias } from '../../components/categorias/TablaCategorias'
import type { Categoria } from '../../types/categoria'
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

export function CategoriasPage() {
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

  const categoriasFiltradas = useMemo(
    () =>
      filtrarCategorias(
        CATEGORIAS_MOCK,
        filtrosAplicados,
      ),
    [filtrosAplicados],
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
    <main className="categories-page app-shell">
      <div className="container-xl px-0">
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
              window.alert(
                'Accion Agregar categoria lista para conectar con formulario o modal.',
              )
            }}
            onEditar={(categoria) => {
              window.alert(
                `Editar categoria: ${categoria.nombre}`,
              )
            }}
            onEliminar={(categoria) => {
              window.alert(
                `Eliminar categoria: ${categoria.nombre}`,
              )
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
  )
}
