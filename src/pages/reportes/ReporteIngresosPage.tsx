import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  FileSpreadsheet,
} from 'lucide-react'

import { ExportarIngresosExcelButton } from '../../components/reportes/ingresos/ExportarIngresosExcelButton'
import { FiltrosReporteIngresos } from '../../components/reportes/ingresos/FiltrosReporteIngresos'
import { ResumenReporteIngresos } from '../../components/reportes/ingresos/ResumenReporteIngresos'
import { TablaReporteIngresos } from '../../components/reportes/ingresos/TablaReporteIngresos'
import { TablePagination } from '../../components/ui/TablePagination'

import { obtenerProductos } from '../../services/productoService'
import { obtenerProveedores } from '../../services/proveedorService'

import {
  filtrarReporteIngresos,
  obtenerFilasReporteIngresos,
  obtenerResumenReporteIngresos,
} from '../../services/reporteIngresoService'

import { obtenerTiposProducto } from '../../services/tipoProductoService'

import type {
  FiltrosReporteIngresos as Filtros,
} from '../../types/reporteIngreso'

import '../../styles/DashboardPage.css'
import '../../styles/maestros.css'

const FILTROS_INICIALES: Filtros = {
  busqueda: '',
  fechaDesde: '',
  fechaHasta: '',
  proveedorId: '',
  tipoProductoId: '',
  productoId: '',
  estado: '',
}

export function ReporteIngresosPage() {
  const [filas] = useState(
    () => obtenerFilasReporteIngresos(),
  )

  const [filtros, setFiltros] =
    useState<Filtros>({
      ...FILTROS_INICIALES,
    })

  const [
    filtrosAplicados,
    setFiltrosAplicados,
  ] = useState<Filtros>({
    ...FILTROS_INICIALES,
  })

  const [page, setPage] = useState(1)

  const [pageSize, setPageSize] =
    useState(10)

  const proveedores = useMemo(
    () =>
      obtenerProveedores()
        .map((proveedor) => ({
          id: String(proveedor.id),
          nombre:
            proveedor.razonSocial,
        }))
        .sort((primero, segundo) =>
          primero.nombre.localeCompare(
            segundo.nombre,
            'es',
          ),
        ),
    [],
  )

  const tiposProducto = useMemo(
    () =>
      obtenerTiposProducto()
        .map((tipo) => ({
          id: String(tipo.id),
          nombre: tipo.nombre,
        }))
        .sort((primero, segundo) =>
          primero.nombre.localeCompare(
            segundo.nombre,
            'es',
          ),
        ),
    [],
  )

  const productos = useMemo(
    () =>
      obtenerProductos()
        .map((producto) => ({
          id: String(producto.id),
          codigo: producto.codigo,
          nombre: producto.nombre,
          tipoProductoId: String(
            producto.tipoProductoId,
          ),
        }))
        .sort((primero, segundo) =>
          primero.nombre.localeCompare(
            segundo.nombre,
            'es',
          ),
        ),
    [],
  )

  const filasFiltradas = useMemo(
    () =>
      filtrarReporteIngresos(
        filas,
        filtrosAplicados,
      ),
    [filas, filtrosAplicados],
  )

  const resumen = useMemo(
    () =>
      obtenerResumenReporteIngresos(
        filasFiltradas,
      ),
    [filasFiltradas],
  )

  const totalItems =
    filasFiltradas.length

  const filasPaginadas = useMemo(
    () => {
      const inicio =
        (page - 1) * pageSize

      return filasFiltradas.slice(
        inicio,
        inicio + pageSize,
      )
    },
    [
      filasFiltradas,
      page,
      pageSize,
    ],
  )

  useEffect(() => {
    const totalPaginas = Math.max(
      1,
      Math.ceil(
        totalItems / pageSize,
      ),
    )

    if (page > totalPaginas) {
      setPage(totalPaginas)
    }
  }, [
    page,
    pageSize,
    totalItems,
  ])

  function cambiarFiltro(
    campo: keyof Filtros,
    valor: string,
  ): void {
    setFiltros((actual) => ({
      ...actual,
      [campo]: valor,
    }))
  }

  function buscar(): void {
    setFiltrosAplicados({
      ...filtros,
    })

    setPage(1)
  }

  function limpiar(): void {
    setFiltros({
      ...FILTROS_INICIALES,
    })

    setFiltrosAplicados({
      ...FILTROS_INICIALES,
    })

    setPage(1)
  }

  return (
    <main className="dashboard-shell maestro-page-shell">
      <div className="container-xl px-0 maestro-page-body">
        <section className="maestro-topbar">
          <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap">
            <div className="maestro-topbar__copy">
              <h1>Reporte de ingresos</h1>

              <p>
                Consulta los productos ingresados
                al almacÃ©n y exporta los resultados
                a Excel.
              </p>
            </div>

            <FileSpreadsheet
              size={36}
              className="text-success"
            />
          </div>
        </section>

        <div className="maestro-panel">
          <ResumenReporteIngresos
            resumen={resumen}
          />
        </div>

        <div className="maestro-panel">
          <FiltrosReporteIngresos
            valores={filtros}
            proveedores={proveedores}
            tiposProducto={tiposProducto}
            productos={productos}
            onChange={cambiarFiltro}
            onBuscar={buscar}
            onLimpiar={limpiar}
          />
        </div>

        <div className="maestro-panel">
          <section className="maestro-table-card card border-0 shadow-sm">
            <div className="card-body p-0">
              <div className="maestro-table-header">
                <div>
                  <span className="maestro-kicker">
                    <FileSpreadsheet
                      size={16}
                    />

                    Detalle de ingresos
                  </span>

                  <p className="maestro-section-copy small mb-0 mt-1">
                    {totalItems}{' '}
                    resultado(s) encontrado(s)
                  </p>
                </div>

                <ExportarIngresosExcelButton
                  filas={filasFiltradas}
                />
              </div>

              <TablaReporteIngresos
                filas={filasPaginadas}
              />

              <TablePagination
                totalItems={totalItems}
                page={page}
                pageSize={pageSize}
                onPageChange={setPage}
                onPageSizeChange={(
                  nuevoTamano,
                ) => {
                  setPageSize(nuevoTamano)
                  setPage(1)
                }}
              />
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
