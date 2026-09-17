import { useState } from 'react'

import {
  Download,
  LoaderCircle,
} from 'lucide-react'

import {
  obtenerResumenReporteIngresos,
} from '../../../services/reporteIngresoService'

import type {
  FilaReporteIngreso,
} from '../../../types/reporteIngreso'

interface ExportarIngresosExcelButtonProps {
  filas: FilaReporteIngreso[]
}

const VERDE_OSCURO = 'FF0F5132'
const VERDE = 'FF198754'
const VERDE_CLARO = 'FFEAF7EF'
const GRIS_CLARO = 'FFF4F6F5'
const GRIS_BORDE = 'FFD8E1DC'
const TEXTO_OSCURO = 'FF17352B'
const ROJO_CLARO = 'FFFDECEC'
const ROJO = 'FFB42318'
const BLANCO = 'FFFFFFFF'

function crearNombreArchivo(): string {
  const fecha = new Date()
    .toISOString()
    .slice(0, 10)

  return `reporte-ingresos-${fecha}.xlsx`
}

function crearFechaExcel(
  fecha: string,
): Date | string {
  const [anio, mes, dia] =
    fecha.split('-').map(Number)

  if (!anio || !mes || !dia) {
    return fecha
  }

  return new Date(
    anio,
    mes - 1,
    dia,
  )
}

function formatearFechaHora(
  fecha: Date,
): string {
  return new Intl.DateTimeFormat(
    'es-PE',
    {
      dateStyle: 'long',
      timeStyle: 'short',
    },
  ).format(fecha)
}

export function ExportarIngresosExcelButton({
  filas,
}: ExportarIngresosExcelButtonProps) {
  const [exportando, setExportando] =
    useState(false)

  const [error, setError] =
    useState<string | null>(null)

  async function exportar(): Promise<void> {
    if (filas.length === 0) {
      setError(
        'No existen registros para exportar.',
      )
      return
    }

    setExportando(true)
    setError(null)

    try {
      const { Workbook } =
        await import('exceljs')

      const libro = new Workbook()
      const fechaGeneracion = new Date()

      libro.creator =
        'Sistema de Inventario'
      libro.lastModifiedBy =
        'Sistema de Inventario'
      libro.created = fechaGeneracion
      libro.modified = fechaGeneracion

      libro.title =
        'Reporte de ingresos de almacén'
      libro.subject =
        'Ingresos registrados en almacén'
      libro.company =
        'Sistema de Inventario'

      const hoja = libro.addWorksheet(
        'Ingresos',
        {
          properties: {
            tabColor: {
              argb: VERDE,
            },
          },
          views: [
            {
              state: 'frozen',
              ySplit: 5,
            },
          ],
          pageSetup: {
            orientation: 'landscape',
            fitToPage: true,
            fitToWidth: 1,
            fitToHeight: 0,
            paperSize: 9,
            margins: {
              left: 0.25,
              right: 0.25,
              top: 0.5,
              bottom: 0.5,
              header: 0.2,
              footer: 0.2,
            },
          },
        },
      )

      hoja.headerFooter.oddHeader =
        '&C&BReporte de ingresos de almacén'

      hoja.headerFooter.oddFooter =
        '&LGenerado por Sistema de Inventario&C&P de &N&R&D'

      const anchos = [
        20,
        14,
        14,
        23,
        21,
        35,
        28,
        23,
        21,
        34,
        23,
        20,
        14,
        17,
        17,
        45,
      ]

      anchos.forEach(
        (ancho, indice) => {
          hoja.getColumn(
            indice + 1,
          ).width = ancho
        },
      )

      hoja.mergeCells('A1:P1')
      hoja.getCell('A1').value =
        'REPORTE DE INGRESOS DE ALMACÉN'

      hoja.getRow(1).height = 34

      for (
        let columna = 1;
        columna <= 16;
        columna += 1
      ) {
        const celda =
          hoja.getRow(1).getCell(
            columna,
          )

        celda.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: {
            argb: VERDE_OSCURO,
          },
        }

        celda.font = {
          name: 'Aptos Display',
          size: 18,
          bold: true,
          color: {
            argb: BLANCO,
          },
        }

        celda.alignment = {
          vertical: 'middle',
          horizontal: 'center',
        }
      }

      hoja.mergeCells('A2:P2')

      hoja.getCell('A2').value =
        'Detalle de productos recibidos, proveedores y valorización'

      hoja.getRow(2).height = 25

      for (
        let columna = 1;
        columna <= 16;
        columna += 1
      ) {
        const celda =
          hoja.getRow(2).getCell(
            columna,
          )

        celda.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: {
            argb: VERDE_CLARO,
          },
        }

        celda.font = {
          name: 'Aptos',
          size: 11,
          italic: true,
          color: {
            argb: TEXTO_OSCURO,
          },
        }

        celda.alignment = {
          vertical: 'middle',
          horizontal: 'center',
        }
      }

      hoja.mergeCells('A3:P3')

      hoja.getCell('A3').value =
        `Generado: ${formatearFechaHora(
          fechaGeneracion,
        )} | Registros exportados: ${
          filas.length
        }`

      hoja.getRow(3).height = 22

      hoja.getCell('A3').font = {
        name: 'Aptos',
        size: 10,
        color: {
          argb: 'FF52665E',
        },
      }

      hoja.getCell('A3').alignment = {
        vertical: 'middle',
        horizontal: 'right',
      }

      const encabezados = [
        'Nro. ingreso',
        'Fecha',
        'Estado',
        'Tipo de documento',
        'Nro. documento',
        'Proveedor',
        'Contacto',
        'Tipo de producto',
        'Código de producto',
        'Producto',
        'Categoría',
        'Unidad de medida',
        'Cantidad',
        'Precio unitario',
        'Subtotal',
        'Observación',
      ]

      const filaEncabezados =
        hoja.getRow(5)

      filaEncabezados.values =
        encabezados

      filaEncabezados.height = 30

      filaEncabezados.eachCell(
        (celda) => {
          celda.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {
              argb: VERDE,
            },
          }

          celda.font = {
            name: 'Aptos',
            size: 10,
            bold: true,
            color: {
              argb: BLANCO,
            },
          }

          celda.alignment = {
            vertical: 'middle',
            horizontal: 'center',
            wrapText: true,
          }

          celda.border = {
            top: {
              style: 'thin',
              color: {
                argb: VERDE_OSCURO,
              },
            },
            left: {
              style: 'thin',
              color: {
                argb: VERDE_OSCURO,
              },
            },
            bottom: {
              style: 'thin',
              color: {
                argb: VERDE_OSCURO,
              },
            },
            right: {
              style: 'thin',
              color: {
                argb: VERDE_OSCURO,
              },
            },
          }
        },
      )

      filas.forEach(
        (fila, indice) => {
          const filaExcel = hoja.addRow([
            fila.numeroIngreso,
            crearFechaExcel(
              fila.fechaIngreso,
            ),
            fila.estado ===
            'REGISTRADO'
              ? 'Registrado'
              : 'Anulado',
            fila.tipoDocumento,
            fila.numeroDocumento,
            fila.proveedor,
            fila.contacto,
            fila.tipoProducto,
            fila.codigoProducto,
            fila.producto,
            fila.categoria,
            fila.unidadMedida,
            fila.cantidad,
            fila.precioUnitario,
            fila.subtotal,
            fila.observacion,
          ])

          filaExcel.height = 24

          filaExcel.eachCell(
            {
              includeEmpty: true,
            },
            (celda) => {
              celda.font = {
                name: 'Aptos',
                size: 10,
                color: {
                  argb: TEXTO_OSCURO,
                },
              }

              celda.alignment = {
                vertical: 'middle',
                wrapText: true,
              }

              celda.border = {
                top: {
                  style: 'thin',
                  color: {
                    argb: GRIS_BORDE,
                  },
                },
                left: {
                  style: 'thin',
                  color: {
                    argb: GRIS_BORDE,
                  },
                },
                bottom: {
                  style: 'thin',
                  color: {
                    argb: GRIS_BORDE,
                  },
                },
                right: {
                  style: 'thin',
                  color: {
                    argb: GRIS_BORDE,
                  },
                },
              }

              if (indice % 2 !== 0) {
                celda.fill = {
                  type: 'pattern',
                  pattern: 'solid',
                  fgColor: {
                    argb: GRIS_CLARO,
                  },
                }
              }
            },
          )

          filaExcel.getCell(2).numFmt =
            'dd/mm/yyyy'

          filaExcel.getCell(2).alignment = {
            vertical: 'middle',
            horizontal: 'center',
          }

          filaExcel.getCell(3).alignment = {
            vertical: 'middle',
            horizontal: 'center',
          }

          filaExcel.getCell(13).numFmt =
            '#,##0.00'

          filaExcel.getCell(13).alignment = {
            vertical: 'middle',
            horizontal: 'right',
          }

          filaExcel.getCell(14).numFmt =
            '"S/." #,##0.00'

          filaExcel.getCell(14).alignment = {
            vertical: 'middle',
            horizontal: 'right',
          }

          filaExcel.getCell(15).numFmt =
            '"S/." #,##0.00'

          filaExcel.getCell(15).alignment = {
            vertical: 'middle',
            horizontal: 'right',
          }

          const celdaEstado =
            filaExcel.getCell(3)

          if (
            fila.estado ===
            'REGISTRADO'
          ) {
            celdaEstado.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {
                argb: VERDE_CLARO,
              },
            }

            celdaEstado.font = {
              name: 'Aptos',
              size: 10,
              bold: true,
              color: {
                argb: VERDE_OSCURO,
              },
            }
          } else {
            celdaEstado.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {
                argb: ROJO_CLARO,
              },
            }

            celdaEstado.font = {
              name: 'Aptos',
              size: 10,
              bold: true,
              color: {
                argb: ROJO,
              },
            }
          }
        },
      )

      const ultimaFila =
        hoja.rowCount

      hoja.autoFilter = {
        from: {
          row: 5,
          column: 1,
        },
        to: {
          row: ultimaFila,
          column: 16,
        },
      }

      const resumen =
        obtenerResumenReporteIngresos(
          filas,
        )

      const hojaResumen =
        libro.addWorksheet(
          'Resumen',
          {
            properties: {
              tabColor: {
                argb: VERDE_OSCURO,
              },
            },
            views: [
              {
                state: 'frozen',
                ySplit: 4,
              },
            ],
            pageSetup: {
              orientation: 'portrait',
              fitToPage: true,
              fitToWidth: 1,
              fitToHeight: 1,
            },
          },
        )

      hojaResumen.getColumn(1).width = 34
      hojaResumen.getColumn(2).width = 23

      hojaResumen.mergeCells('A1:B1')

      hojaResumen.getCell('A1').value =
        'RESUMEN EJECUTIVO'

      hojaResumen.getRow(1).height = 34

      for (
        let columna = 1;
        columna <= 2;
        columna += 1
      ) {
        const celda =
          hojaResumen
            .getRow(1)
            .getCell(columna)

        celda.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: {
            argb: VERDE_OSCURO,
          },
        }

        celda.font = {
          name: 'Aptos Display',
          size: 17,
          bold: true,
          color: {
            argb: BLANCO,
          },
        }

        celda.alignment = {
          vertical: 'middle',
          horizontal: 'center',
        }
      }

      hojaResumen.mergeCells('A2:B2')

      hojaResumen.getCell('A2').value =
        'Indicadores según los filtros aplicados'

      hojaResumen.getCell('A2').font = {
        name: 'Aptos',
        size: 10,
        italic: true,
        color: {
          argb: TEXTO_OSCURO,
        },
      }

      hojaResumen.getCell('A2').alignment = {
        vertical: 'middle',
        horizontal: 'center',
      }

      const encabezadoResumen =
        hojaResumen.getRow(4)

      encabezadoResumen.values = [
        'Indicador',
        'Resultado',
      ]

      encabezadoResumen.height = 28

      encabezadoResumen.eachCell(
        (celda) => {
          celda.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {
              argb: VERDE,
            },
          }

          celda.font = {
            name: 'Aptos',
            size: 10,
            bold: true,
            color: {
              argb: BLANCO,
            },
          }

          celda.alignment = {
            vertical: 'middle',
            horizontal: 'center',
          }
        },
      )

      const indicadores: Array<
        [string, number]
      > = [
        [
          'Total de ingresos',
          resumen.totalIngresos,
        ],
        [
          'Ingresos registrados',
          resumen.ingresosRegistrados,
        ],
        [
          'Ingresos anulados',
          resumen.ingresosAnulados,
        ],
        [
          'Líneas de productos',
          resumen.lineasProductos,
        ],
        [
          'Total valorizado',
          resumen.totalValorizado,
        ],
      ]

      indicadores.forEach(
        (
          [indicador, valor],
          indice,
        ) => {
          const filaResumen =
            hojaResumen.addRow([
              indicador,
              valor,
            ])

          filaResumen.height = 26

          filaResumen.eachCell(
            (celda) => {
              celda.font = {
                name: 'Aptos',
                size: 11,
                color: {
                  argb: TEXTO_OSCURO,
                },
              }

              celda.border = {
                top: {
                  style: 'thin',
                  color: {
                    argb: GRIS_BORDE,
                  },
                },
                left: {
                  style: 'thin',
                  color: {
                    argb: GRIS_BORDE,
                  },
                },
                bottom: {
                  style: 'thin',
                  color: {
                    argb: GRIS_BORDE,
                  },
                },
                right: {
                  style: 'thin',
                  color: {
                    argb: GRIS_BORDE,
                  },
                },
              }

              if (indice % 2 !== 0) {
                celda.fill = {
                  type: 'pattern',
                  pattern: 'solid',
                  fgColor: {
                    argb: GRIS_CLARO,
                  },
                }
              }
            },
          )

          filaResumen.getCell(1).font = {
            name: 'Aptos',
            size: 11,
            bold: true,
            color: {
              argb: TEXTO_OSCURO,
            },
          }

          filaResumen.getCell(2).alignment = {
            vertical: 'middle',
            horizontal: 'right',
          }
        },
      )

      hojaResumen.getCell('B9').numFmt =
        '"S/." #,##0.00'

      hojaResumen.mergeCells('A11:B11')

      hojaResumen.getCell('A11').value =
        `Reporte generado el ${formatearFechaHora(
          fechaGeneracion,
        )}`

      hojaResumen.getCell('A11').font = {
        name: 'Aptos',
        size: 9,
        italic: true,
        color: {
          argb: 'FF667085',
        },
      }

      hojaResumen.getCell('A11').alignment = {
        horizontal: 'right',
      }

      const contenido =
        await libro.xlsx.writeBuffer()

      const archivo = new Blob(
        [contenido],
        {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        },
      )

      const url =
        URL.createObjectURL(archivo)

      const enlace =
        document.createElement('a')

      enlace.href = url
      enlace.download =
        crearNombreArchivo()

      document.body.appendChild(enlace)
      enlace.click()
      enlace.remove()

      window.setTimeout(
        () => URL.revokeObjectURL(url),
        1000,
      )
    } catch {
      setError(
        'No se pudo generar el archivo Excel.',
      )
    } finally {
      setExportando(false)
    }
  }

  return (
    <div>
      <button
        type="button"
        className="btn maestro-toolbar-btn"
        disabled={
          exportando ||
          filas.length === 0
        }
        onClick={() => void exportar()}
      >
        {exportando ? (
          <LoaderCircle size={18} />
        ) : (
          <Download size={18} />
        )}

        {exportando
          ? 'Generando...'
          : 'Exportar Excel'}
      </button>

      {error && (
        <div className="small text-danger mt-2">
          {error}
        </div>
      )}
    </div>
  )
}