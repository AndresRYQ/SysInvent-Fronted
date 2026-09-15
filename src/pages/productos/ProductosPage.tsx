import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  useLocation,
  useNavigate,
} from 'react-router-dom'

import {
  FiltrosProductos,
  type FiltrosProductosValores,
  type OpcionFiltroProducto,
} from '../../components/productos/FiltrosProductos'

import {
  TablaProductos,
  type ProductoFila,
} from '../../components/productos/TablaProductos'

import { ProductoDeleteModal } from '../../components/productos/ProductoDeleteModal'
import { FormularioProducto } from '../../components/productos/FormularioProducto'

import {
  actualizarProducto,
  crearProducto,
  eliminarProducto,
  obtenerProductos,
} from '../../services/productoService'

import { obtenerProveedores } from '../../services/proveedorService'
import { obtenerTiposProducto } from '../../services/tipoProductoService'

import type { Producto } from '../../types/producto'

import '../../styles/DashboardPage.css'
import '../../styles/maestros.css'

const FILTROS_INICIALES: FiltrosProductosValores = {
  busqueda: '',
  tipoProductoId: '',
  categoriaId: '',
  nivelStock: '',
  estado: '',
}

const CATEGORIAS_INICIALES: OpcionFiltroProducto[] = [
  { id: 'CAT-001', nombre: 'Herramientas' },
  {
    id: 'CAT-002',
    nombre: 'Seguridad Industrial',
  },
  { id: 'CAT-003', nombre: 'Ferretería' },
  { id: 'CAT-004', nombre: 'Repuestos' },
  { id: 'CAT-005', nombre: 'Limpieza' },
]

const UNIDADES_INICIALES: OpcionFiltroProducto[] = [
  { id: 'UM-001', nombre: 'Unidad' },
  { id: 'UM-002', nombre: 'Kilogramo' },
  { id: 'UM-003', nombre: 'Litro' },
  { id: 'UM-004', nombre: 'Metro' },
  { id: 'UM-005', nombre: 'Caja' },
]

interface MensajePagina {
  tipo: 'success' | 'danger'
  texto: string
}

interface EstadoNavegacion {
  mensaje?: string
}

function obtenerOpcionesLocales(
  storageKey: string,
  valoresIniciales: OpcionFiltroProducto[],
): OpcionFiltroProducto[] {
  try {
    const datosGuardados =
      localStorage.getItem(storageKey)

    if (!datosGuardados) {
      return valoresIniciales
    }

    const datos = JSON.parse(datosGuardados)

    return Array.isArray(datos)
      ? (datos as OpcionFiltroProducto[])
      : valoresIniciales
  } catch {
    return valoresIniciales
  }
}

function obtenerMensajeError(error: unknown): string {
  return error instanceof Error
    ? error.message
    : 'Ocurrió un error inesperado.'
}

export function ProductosPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const [productos, setProductos] =
    useState<Producto[]>(() =>
      obtenerProductos(),
    )

  const [tiposProducto] = useState(() =>
    obtenerTiposProducto(),
  )

  const [proveedores] = useState(() =>
    obtenerProveedores(),
  )

  const [categorias] = useState(() =>
    obtenerOpcionesLocales(
      'agrihusac_categorias',
      CATEGORIAS_INICIALES,
    ),
  )

  const [unidadesMedida] = useState(() =>
    obtenerOpcionesLocales(
      'agrihusac_unidades_medida',
      UNIDADES_INICIALES,
    ),
  )

  const [filtros, setFiltros] =
    useState<FiltrosProductosValores>(
      FILTROS_INICIALES,
    )

  const [
    filtrosAplicados,
    setFiltrosAplicados,
  ] = useState<FiltrosProductosValores>(
    FILTROS_INICIALES,
  )

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const [
    productoAEliminar,
    setProductoAEliminar,
  ] = useState<Producto | null>(null)

  const [modalDeleteOpen, setModalDeleteOpen] =
    useState(false)

  const [modalFormOpen, setModalFormOpen] = useState(false)
  const [productoEnEdicion, setProductoEnEdicion] = useState<Producto | null>(null)
  const [modoVisualizacion, setModoVisualizacion] = useState(false)
  const [errorFormulario, setErrorFormulario] = useState('')

  const [mensaje, setMensaje] =
    useState<MensajePagina | null>(null)

  useEffect(() => {
    const estado =
      location.state as EstadoNavegacion | null

    if (!estado?.mensaje) {
      return
    }

    setMensaje({
      tipo: 'success',
      texto: estado.mensaje,
    })

    navigate(location.pathname, {
      replace: true,
      state: null,
    })
  }, [
    location.pathname,
    location.state,
    navigate,
  ])

  const productosConDetalle = useMemo<
    ProductoFila[]
  >(() => {
    return productos.map((producto) => ({
      ...producto,

      tipoProductoNombre:
        tiposProducto.find(
          (tipo) =>
          String(tipo.id) ===
            String(producto.tipoProductoId),
        )?.nombre ?? 'Sin tipo',

      categoriaNombre:
        categorias.find(
          (categoria) =>
            categoria.id ===
            producto.categoriaId,
        )?.nombre ?? 'Sin categoría',

      unidadMedidaNombre:
        unidadesMedida.find(
          (unidad) =>
            unidad.id ===
            producto.unidadMedidaId,
        )?.nombre ?? 'Sin unidad',

      proveedorNombre:
        proveedores.find(
          (proveedor) =>
            String(proveedor.id) ===
            producto.proveedorId,
        )?.razonSocial ?? 'Sin proveedor',
    }))
  }, [
    productos,
    tiposProducto,
    categorias,
    unidadesMedida,
    proveedores,
  ])

  const productosFiltrados = useMemo(() => {
    const busqueda =
      filtrosAplicados.busqueda
        .trim()
        .toLowerCase()

    return productosConDetalle.filter(
      (producto) => {
        const coincideBusqueda =
          !busqueda ||
          producto.codigo
            .toLowerCase()
            .includes(busqueda) ||
          producto.nombre
            .toLowerCase()
            .includes(busqueda) ||
          producto.descripcion
            .toLowerCase()
            .includes(busqueda)

        const coincideTipo =
          !filtrosAplicados.tipoProductoId ||
          producto.tipoProductoId ===
            filtrosAplicados.tipoProductoId

        const coincideCategoria =
          !filtrosAplicados.categoriaId ||
          producto.categoriaId ===
            filtrosAplicados.categoriaId

        const stockBajo =
          producto.stockActual <=
          producto.stockMinimo

        const coincideStock =
          !filtrosAplicados.nivelStock ||
          (filtrosAplicados.nivelStock ===
            'bajo' &&
            stockBajo) ||
          (filtrosAplicados.nivelStock ===
            'normal' &&
            !stockBajo)

        const coincideEstado =
          !filtrosAplicados.estado ||
          (filtrosAplicados.estado ===
            'activo' &&
            producto.estado) ||
          (filtrosAplicados.estado ===
            'inactivo' &&
            !producto.estado)

        return (
          coincideBusqueda &&
          coincideTipo &&
          coincideCategoria &&
          coincideStock &&
          coincideEstado
        )
      },
    )
  }, [
    productosConDetalle,
    filtrosAplicados,
  ])

  const totalItems = productosFiltrados.length

  const productosPaginados = useMemo(() => {
    const startIndex = (page - 1) * pageSize

    return productosFiltrados.slice(
      startIndex,
      startIndex + pageSize,
    )
  }, [
    productosFiltrados,
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

  function confirmarEliminacion(): void {
    if (!productoAEliminar) {
      return
    }

    try {
      eliminarProducto(
        productoAEliminar.id,
      )

      setProductos(obtenerProductos())
      setModalDeleteOpen(false)
      setProductoAEliminar(null)

      setMensaje({
        tipo: 'success',
        texto:
          'Producto eliminado correctamente.',
      })
    } catch (error) {
      setModalDeleteOpen(false)
      setProductoAEliminar(null)

      setMensaje({
        tipo: 'danger',
        texto: obtenerMensajeError(error),
      })
    }
  }

  function cerrarFormulario(): void {
    setModalFormOpen(false)
    setProductoEnEdicion(null)
    setModoVisualizacion(false)
    setErrorFormulario('')
  }

  function guardarProducto(datos: import('../../types/producto').ProductoFormData): void {
    try {
      productoEnEdicion ? actualizarProducto(productoEnEdicion.id, datos) : crearProducto(datos)
      setProductos(obtenerProductos())
      cerrarFormulario()
    } catch (error) {
      setErrorFormulario(obtenerMensajeError(error))
    }
  }

  return (
    <>
      <div className="productos-page">
      <main className="dashboard-shell maestro-page-shell">
        <div className="container-xl px-0 maestro-page-body">
          <section className="maestro-topbar">
            <div className="maestro-topbar__copy">
              <h1>Productos</h1>

              <p>
                Administración del catálogo de productos
                y configuración de inventario.
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
            <FiltrosProductos
              valores={filtros}
              tiposProducto={tiposProducto}
              categorias={categorias}
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
            <TablaProductos
              productos={productosPaginados}
              totalItems={totalItems}
              page={page}
              pageSize={pageSize}
              onAgregar={() => { setProductoEnEdicion(null); setModoVisualizacion(false); setErrorFormulario(''); setModalFormOpen(true) }}
              onEditar={(producto) => { setProductoEnEdicion(producto); setModoVisualizacion(false); setErrorFormulario(''); setModalFormOpen(true) }}
              onVisualizar={(producto) => { setProductoEnEdicion(producto); setModoVisualizacion(true); setErrorFormulario(''); setModalFormOpen(true) }}
              onEliminar={(producto) => {
                setMensaje(null)
                setProductoAEliminar(producto)
                setModalDeleteOpen(true)
              }}
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
      </div>

      <ProductoDeleteModal
        abierto={modalDeleteOpen}
        producto={productoAEliminar}
        onClose={() => {
          setModalDeleteOpen(false)
          setProductoAEliminar(null)
        }}
        onConfirm={confirmarEliminacion}
      />
      {modalFormOpen && <div className="maestro-modal-backdrop productos-page" role="presentation"><div className="maestro-modal-card maestro-modal-card--product" role="dialog" aria-modal="true"><div className="maestro-modal-header"><h3 className="maestro-modal-title">{modoVisualizacion ? 'Visualizar producto' : productoEnEdicion ? 'Editar producto' : 'Registrar producto'}</h3><button type="button" className="btn maestro-modal-close" onClick={cerrarFormulario} aria-label="Cerrar modal">×</button></div><FormularioProducto producto={productoEnEdicion} soloLectura={modoVisualizacion} error={errorFormulario} onSubmit={guardarProducto} onCancelar={cerrarFormulario} /></div></div>}
    </>
  )
}
