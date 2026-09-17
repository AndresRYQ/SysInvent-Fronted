import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  FileSpreadsheet,
} from 'lucide-react'

import { ExportarValesExcelButton } from '../../components/reportes/vales/ExportarValesExcelButton'
import { FiltrosReporteVales } from '../../components/reportes/vales/FiltrosReporteVales'
import { ResumenReporteVales } from '../../components/reportes/vales/ResumenReporteVales'
import { TablaReporteVales } from '../../components/reportes/vales/TablaReporteVales'
import { TablePagination } from '../../components/ui/TablePagination'

import { obtenerCentrosCosto } from '../../services/centroCostoService'
import { obtenerDestinos } from '../../services/destinoService'
import { obtenerPartesEquipo } from '../../services/parteEquipoService'
import { obtenerProductos } from '../../services/productoService'

import {
  filtrarReporteVales,
  obtenerFilasReporteVales,
  obtenerResumenReporteVales,
} from '../../services/reporteValeService'

import { obtenerTiposProducto } from '../../services/tipoProductoService'

import type {
  FiltrosReporteVales as Filtros,
} from '../../types/reporteVale'

import '../../styles/DashboardPage.css'
import '../../styles/maestros.css'

const FILTROS_INICIALES: Filtros = {
  busqueda: '',
  fechaDesde: '',
  fechaHasta: '',
  centroCostoId: '',
  destinoId: '',
  parteEquipoId: '',
  tipoProductoId: '',
  productoId: '',
  estado: '',
}

export function ReporteValesPage() {
  const [filas] = useState(
    () => obtenerFilasReporteVales(),
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

  const centrosCosto = useMemo(
    () =>
      obtenerCentrosCosto()
        .map((centro) => ({
          id: String(centro.id),
          nombre: centro.nombre,
        }))
        .sort((primero, segundo) =>
          primero.nombre.localeCompare(
            segundo.nombre,
            'es',
          ),
        ),
    [],
  )

  const destinos = useMemo(
    () =>
      obtenerDestinos()
        .map((destino) => ({
          id: String(destino.id),
          nombre: destino.nombre,
        }))
        .sort((primero, segundo) =>
          primero.nombre.localeCompare(
            segundo.nombre,
            'es',
          ),
        ),
    [],
  )

  const partesEquipo = useMemo(
    () =>
      obtenerPartesEquipo()
        .map((parte) => ({
          id: String(parte.id),
          codigo: parte.codigo,
          nombre: parte.nombre,
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
          ).replace(/^TP-0*/, ''),
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
      filtrarReporteVales(
        filas,
        filtrosAplicados,
      ),
    [filas, filtrosAplicados],
  )

  const resumen = useMemo(
    () =>
      obtenerResumenReporteVales(
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
              <h1>Reporte de vales</h1>

              <p>
                Consulta las salidas, destinos,
                partes de equipo y productos
                entregados mediante vales de
                consumo.
              </p>
            </div>

            <FileSpreadsheet
              size={36}
              className="text-success"
            />
          </div>
        </section>

        <div className="maestro-panel">
          <ResumenReporteVales
            resumen={resumen}
          />
        </div>

        <div className="maestro-panel">
          <FiltrosReporteVales
            valores={filtros}
            centrosCosto={centrosCosto}
            destinos={destinos}
            partesEquipo={partesEquipo}
            tiposProducto={tiposProducto}
            productos={productos}
            onChange={cambiarFiltro}
            onBuscar={buscar}
            onLimpiar={limpiar}
          />
        </div>

        <div className="maestro-panel">
          <section className="table-card card border-0 shadow-sm">
            <div className="card-body p-0">
              <div className="table-header">
                <div>
                  <span className="maestro-kicker">
                    <FileSpreadsheet
                      size={16}
                    />

                    Detalle de vales
                  </span>

                  <p className="maestro-section-copy small mb-0 mt-1">
                    {totalItems}{' '}
                    distribución(es)
                    encontrada(s)
                  </p>
                </div>

                <ExportarValesExcelButton
                  filas={filasFiltradas}
                />
              </div>

              <TablaReporteVales
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
