import {
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Boxes,
  Download,
  ListFilter,
} from 'lucide-react'
import Select from 'react-select'
import { Placeholder } from '../../constants/placeholders'
import { TablePagination } from '../../components/ui/TablePagination'
import { DatePickerInput } from '../../components/ui/DatePickerInput'
import { PageLoadingOverlay } from '../../components/common/PageLoadingOverlay'
import { MetricCard } from '../../components/common/MetricCard'
import { ValidadorRangoFechas } from '../../utils/ValidadorRangoFechas'
import { listarControlAlmacen } from '../../services/kardexService'
import {
  listarReporteKardexApi,
  type FilaReporteKardex,
} from '../../services/reportesApiService'
import type { ControlAlmacenProducto } from '../../types/kardex'
import '../../styles/DashboardPage.css'
import '../../styles/maestros.css'
import './ReportesKardexPage.css'
import { crearEstilosSelect } from '../../styles/reactSelectStyles'

const filtrosIniciales = {
  producto: '',
  tipo: '',
  desde: '',
  hasta: '',
}

function fechaVisible(fecha: string): string {
  if (!fecha) return '-'

  return fecha
    .slice(0, 10)
    .split('-')
    .reverse()
    .join('/')
}

export function ReportesKardexPage() {
  const [filtros, setFiltros] =
    useState(filtrosIniciales)

  const [movimientos, setMovimientos] =
    useState<FilaReporteKardex[]>([])

  const [productos, setProductos] =
    useState<ControlAlmacenProducto[]>([])

  const [cargando, setCargando] =
    useState(true)

  const [errorCarga, setErrorCarga] =
    useState<string | null>(null)

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] =
    useState(10)

  const rangoInvalido = Boolean(
    ValidadorRangoFechas.validar(
      filtros.desde,
      filtros.hasta,
    ),
  )

  useEffect(() => {
    let activo = true

    if (rangoInvalido) {
      setMovimientos([])
      setCargando(false)

      return () => {
        activo = false
      }
    }

    setCargando(true)

    Promise.all([
      listarControlAlmacen({
        pagina: 1,
        tamPagina: 100,
      }),
      listarReporteKardexApi({
        productoId:
          filtros.producto || undefined,
        fechaDesde:
          filtros.desde || undefined,
        fechaHasta:
          filtros.hasta || undefined,
      }),
    ])
      .then(([control, resultado]) => {
        if (!activo) return

        setProductos(control.datos)
        setMovimientos(resultado)
        setErrorCarga(null)
        setCargando(false)
      })
      .catch((error: unknown) => {
        if (!activo) return

        setProductos([])
        setMovimientos([])
        setErrorCarga(
          error instanceof Error
            ? error.message
            : 'No se pudo cargar el reporte Kardex.',
        )
        setCargando(false)
      })

    return () => {
      activo = false
    }
  }, [
    filtros.producto,
    filtros.desde,
    filtros.hasta,
    rangoInvalido,
  ])

  const movimientosFiltrados =
    useMemo(
      () =>
        filtros.tipo
          ? movimientos.filter(
              (movimiento) =>
                movimiento.tipo ===
                filtros.tipo,
            )
          : movimientos,
      [filtros.tipo, movimientos],
    )

  const productosVisibles =
    useMemo(
      () =>
        filtros.producto
          ? productos.filter(
              (producto) =>
                String(
                  producto.productoId,
                ) === filtros.producto,
            )
          : productos,
      [filtros.producto, productos],
    )

  const movimientosPaginados =
    useMemo(() => {
      const inicio =
        (page - 1) * pageSize

      return movimientosFiltrados.slice(
        inicio,
        inicio + pageSize,
      )
    }, [
      movimientosFiltrados,
      page,
      pageSize,
    ])

  function cambiarFiltro(
    campo: keyof typeof filtros,
    valor: string,
  ): void {
    setFiltros((actual) => ({
      ...actual,
      [campo]: valor,
    }))
    setPage(1)
  }

  function limpiar(): void {
    setFiltros(filtrosIniciales)
    setPage(1)
  }

  function exportar(): void {
    const filas = movimientosFiltrados.map(
      (movimiento) => {
        const producto =
          productos.find(
            (item) =>
              item.productoId ===
              movimiento.productoId,
          )

        return [
          movimiento.id,
          movimiento.codigoProducto,
          movimiento.producto,
          producto?.unidadMedidaNombre ?? '',
          fechaVisible(movimiento.fecha),
          movimiento.tipo,
          movimiento.ingreso,
          movimiento.salida,
          movimiento.stock,
          movimiento.numeroDocumento,
          movimiento.responsable,
        ]
      },
    )

    const csv = [
      [
        'Movimiento',
        'Código',
        'Producto',
        'Unidad',
        'Fecha',
        'Tipo',
        'Ingreso',
        'Salida',
        'Stock',
        'Documento',
        'Responsable',
      ],
      ...filas,
    ]
      .map((fila) =>
        fila
          .map(
            (valor) =>
              `"${String(valor).replaceAll(
                '"',
                '""',
              )}"`,
          )
          .join(';'),
      )
      .join('\r\n')

    const url = URL.createObjectURL(
      new Blob(
        ['\uFEFF', csv],
        {
          type: 'text/csv;charset=utf-8;',
        },
      ),
    )

    const enlace =
      document.createElement('a')

    enlace.href = url
    enlace.download = 'reporte-kardex.csv'
    enlace.click()

    setTimeout(
      () => URL.revokeObjectURL(url),
      1000,
    )
  }

  return (
    <div className="dashboard-shell maestro-page-shell kardex-page">
      <PageLoadingOverlay
        visible={cargando}
        mensaje="Cargando reporte Kardex..."
      />

      <header className="maestro-topbar kardex-heading">
        <div className="maestro-topbar__copy">
          <span className="maestro-kicker">
            Inventario / Reportes
          </span>
          <h1>Reporte Kardex</h1>
          <p>
            Consulta las entradas, salidas y
            existencias reales de los productos.
          </p>
        </div>

        <button
          className="btn btn-maestro-primary"
          onClick={exportar}
          disabled={
            movimientosFiltrados.length === 0
          }
        >
          <Download size={18} />
          Exportar CSV
        </button>
      </header>

      {errorCarga && (
        <div
          className="alert alert-danger"
          role="alert"
        >
          {errorCarga}
        </div>
      )}

      <section
        className="kardex-summary"
        aria-label="Resumen de la consulta"
      >
        {[
          {
            label:
              'Movimientos encontrados',
            valor:
              movimientosFiltrados.length,
            Icon: ListFilter,
            tone: 'green',
          },
          {
            label:
              'Movimientos de entrada',
            valor:
              movimientosFiltrados.filter(
                (movimiento) =>
                  movimiento.tipo ===
                  'Entrada',
              ).length,
            Icon: ArrowDownToLine,
            tone: 'teal',
          },
          {
            label:
              'Movimientos de salida',
            valor:
              movimientosFiltrados.filter(
                (movimiento) =>
                  movimiento.tipo ===
                  'Salida',
              ).length,
            Icon: ArrowUpFromLine,
            tone: 'blue',
          },
        ].map(
          ({ label, valor, Icon, tone }) => (
            <MetricCard
              key={label}
              label={label}
              value={valor}
              detail="Movimientos registrados"
              tone={tone}
              status="positive"
              icon={<Icon size={27} aria-hidden="true" />}
            />
          ),
        )}
      </section>

      <section
        className="maestro-filter-card kardex-panel"
        aria-labelledby="kardex-filtros"
      >
        <h2 id="kardex-filtros">
          Filtrar movimientos
        </h2>

        <div className="kardex-filters">
          <label>
            Producto
            <Select
              inputId="kardexProducto"
              classNamePrefix="maestro-select"
              options={productos.map(
                (producto) => ({
                  value: String(
                    producto.productoId,
                  ),
                  label: producto.nombre,
                }),
              )}
              value={
                productos
                  .map((producto) => ({
                    value: String(
                      producto.productoId,
                    ),
                    label:
                      producto.nombre,
                  }))
                  .find(
                    (opcion) =>
                      opcion.value ===
                      filtros.producto,
                  ) ?? null
              }
              onChange={(opcion) =>
                cambiarFiltro(
                  'producto',
                  opcion?.value ?? '',
                )
              }
              placeholder={
                Placeholder.Seleccionar
              }
              isClearable
              isSearchable
              menuPortalTarget={document.body}
              styles={crearEstilosSelect({
                zIndex: 20,
              })}
            />
          </label>

          <label>
            Tipo de movimiento
            <Select
              inputId="kardexTipoMovimiento"
              classNamePrefix="maestro-select"
              options={[
                {
                  value: 'Entrada',
                  label: 'Entrada',
                },
                {
                  value: 'Salida',
                  label: 'Salida',
                },
              ]}
              value={
                [
                  {
                    value: 'Entrada',
                    label: 'Entrada',
                  },
                  {
                    value: 'Salida',
                    label: 'Salida',
                  },
                ].find(
                  (opcion) =>
                    opcion.value ===
                    filtros.tipo,
                ) ?? null
              }
              onChange={(opcion) =>
                cambiarFiltro(
                  'tipo',
                  opcion?.value ?? '',
                )
              }
              placeholder={
                Placeholder.Seleccionar
              }
              isClearable
              isSearchable={false}
              menuPortalTarget={document.body}
              styles={crearEstilosSelect({
                zIndex: 20,
              })}
            />
          </label>

          <label>
            Fecha desde
            <DatePickerInput
              id="kardexDesde"
              value={filtros.desde}
              maxValue={filtros.hasta}
              rangoEstricto
              onChange={(valor) =>
                cambiarFiltro(
                  'desde',
                  valor,
                )
              }
            />
          </label>

          <label>
            Fecha hasta
            <DatePickerInput
              id="kardexHasta"
              value={filtros.hasta}
              minValue={filtros.desde}
              rangoEstricto
              onChange={(valor) =>
                cambiarFiltro(
                  'hasta',
                  valor,
                )
              }
            />
          </label>

          <button
            className="btn btn-maestro-info"
            onClick={limpiar}
          >
            Limpiar filtros
          </button>
        </div>

        {rangoInvalido && (
          <p
            id="error-fechas"
            className="text-danger mt-3 mb-0"
            role="alert"
          >
            La fecha desde debe ser anterior
            a la fecha hasta.
          </p>
        )}
      </section>

      <section
        className="table-card kardex-panel"
        aria-labelledby="stock-actual"
      >
        <h2 id="stock-actual">
          <Boxes
            size={20}
            aria-hidden="true"
          />
          Stock actual por producto
        </h2>

        <p className="kardex-note">
          Existencias actuales registradas en
          el sistema.
        </p>

        <div className="kardex-stock-grid">
          {productosVisibles.map(
            (producto) => (
              <article
                className="kardex-stock"
                key={producto.productoId}
              >
                <span>
                  {producto.nombre}
                  <small>
                    {producto.codigo}
                  </small>
                </span>
                <strong>
                  {producto.stockDisponible}
                  {' '}
                  <small>
                    {producto.unidadMedidaNombre ??
                      ''}
                  </small>
                </strong>
              </article>
            ),
          )}
        </div>
      </section>

      <section
        className="table-card kardex-panel"
        aria-labelledby="movimientos-titulo"
      >
        <h2 id="movimientos-titulo">
          Kardex de movimientos
        </h2>

        <p
          className="kardex-note"
          aria-live="polite"
        >
          {movimientosFiltrados.length}
          {' '}
          movimiento(s) encontrados.
        </p>

        <div className="table-responsive">
          <table className="table align-middle kardex-table">
            <caption className="visually-hidden">
              Entradas, salidas y saldo por
              producto
            </caption>

            <thead>
              <tr>
                {[
                  'Producto',
                  'Fecha',
                  'Tipo de movimiento',
                  'Ingreso',
                  'Salida',
                  'Stock',
                  'Responsable',
                ].map((titulo) => (
                  <th
                    scope="col"
                    key={titulo}
                  >
                    {titulo}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {movimientosPaginados.map(
                (movimiento) => {
                  const producto =
                    productos.find(
                      (item) =>
                        item.productoId ===
                        movimiento.productoId,
                    )

                  return (
                    <tr key={movimiento.id}>
                      <td>
                        <strong>
                          {movimiento.producto}
                        </strong>
                        <small>
                          {movimiento.codigoProducto}
                          {' · '}
                          {producto?.unidadMedidaNombre ??
                            ''}
                        </small>
                      </td>

                      <td>
                        {fechaVisible(
                          movimiento.fecha,
                        )}
                        <small>
                          {movimiento.numeroDocumento}
                        </small>
                      </td>

                      <td>
                        <span
                          className={`kardex-badge ${
                            movimiento.tipo ===
                            'Entrada'
                              ? 'kardex-badge--entrada'
                              : 'kardex-badge--salida'
                          }`}
                        >
                          {movimiento.tipo ===
                          'Entrada' ? (
                            <ArrowDownToLine
                              size={14}
                            />
                          ) : (
                            <ArrowUpFromLine
                              size={14}
                            />
                          )}
                          {movimiento.tipo}
                        </span>
                      </td>

                      <td className="kardex-number">
                        {movimiento.ingreso || '—'}
                      </td>

                      <td className="kardex-number">
                        {movimiento.salida || '—'}
                      </td>

                      <td className="kardex-number">
                        <strong>
                          {movimiento.stock}
                        </strong>
                      </td>

                      <td>
                        {movimiento.responsable}
                      </td>
                    </tr>
                  )
                },
              )}
            </tbody>
          </table>
        </div>

        {movimientosFiltrados.length === 0 &&
          !cargando && (
            <div
              className="kardex-empty"
              role="status"
            >
              <ListFilter size={30} />
              <h3>
                No hay movimientos para mostrar
              </h3>
              <p>
                {rangoInvalido
                  ? 'Corrige el rango de fechas para consultar el Kardex.'
                  : 'Prueba con otro producto o ajusta los filtros.'}
              </p>
            </div>
          )}

        <TablePagination
          totalItems={
            movimientosFiltrados.length
          }
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size)
            setPage(1)
          }}
        />
      </section>
    </div>
  )
}
