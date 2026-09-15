import { useState } from 'react'

import {
  Download,
  LoaderCircle,
} from 'lucide-react'

import type {
  Cell,
} from 'exceljs'

import type {
  FilaProductoMasPedido,
  ResumenProductosMasPedidos,
} from '../../../types/reporteProductoMasPedido'

interface ExportarProductosMasPedidosButtonProps {
  filas: FilaProductoMasPedido[]
  resumen: ResumenProductosMasPedidos
}

const VERDE_OSCURO = 'FF0F5132'
const VERDE = 'FF198754'
const VERDE_CLARO = 'FFEAF7EF'
const GRIS_CLARO = 'FFF4F6F5'
const GRIS_BORDE = 'FFD8E1DC'
const TEXTO_OSCURO = 'FF17352B'
const BLANCO = 'FFFFFFFF'
const ORO = 'FFFFD966'
const PLATA = 'FFD9E1F2'
const BRONCE = 'FFF4B183'

function crearNombreArchivo(): string {
  const fecha = new Date()
    .toISOString()
    .slice(0, 10)

  return `productos-mas-pedidos-${fecha}.xlsx`
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

function aplicarBorde(
  celda: Cell,
): void {
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
}

export function ExportarProductosMasPedidosButton({
  filas,
  resumen,
}: ExportarProductosMasPedidosButtonProps) {
  const [exportando, setExportando] =
    useState(false)

  const [error, setError] =
    useState<string | null>(null)

  async function exportar(): Promise<void> {
    if (filas.length === 0) {
      setError(
        'No existen productos para exportar.',
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
        'Productos más pedidos'
      libro.subject =
        'Ranking de productos consumidos'
      libro.company =
        'Sistema de Inventario'

      const hoja = libro.addWorksheet(
        'Ranking',
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
        '&C&BProductos más pedidos'

      hoja.headerFooter.oddFooter =
        '&LSistema de Inventario&C&P de &N&R&D'

      const anchos = [
        12,
        20,
        35,
        24,
        24,
        20,
        18,
        13,
        17,
        14,
        17,
        19,
      ]

      anchos.forEach(
        (ancho, indice) => {
          hoja.getColumn(
            indice + 1,
          ).width = ancho
        },
      )

      hoja.mergeCells('A1:L1')

      hoja.getCell('A1').value =
        'RANKING DE PRODUCTOS MÁS PEDIDOS'

      hoja.getRow(1).height = 34

      for (
        let columna = 1;
        columna <= 12;
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

      hoja.mergeCells('A2:L2')

      hoja.getCell('A2').value =
        'Ranking calculado desde vales de consumo registrados'

      hoja.getRow(2).height = 25

      for (
        let columna = 1;
        columna <= 12;
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

      hoja.mergeCells('A3:L3')

      hoja.getCell('A3').value =
        `Generado: ${formatearFechaHora(
          fechaGeneracion,
        )} | Productos en el ranking: ${
          filas.length
        }`

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
        'Posición',
        'Código',
        'Producto',
        'Tipo de producto',
        'Categoría',
        'Unidad de medida',
        'Cantidad solicitada',
        'Vales',
        'Distribuciones',
        'Destinos',
        'Participación',
        'Total valorizado',
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
            fila.posicion,
            fila.codigoProducto,
            fila.producto,
            fila.tipoProducto,
            fila.categoria,
            fila.unidadMedida,
            fila.cantidadSolicitada,
            fila.numeroVales,
            fila.numeroDistribuciones,
            fila.destinosAtendidos,
            fila.participacion,
            fila.totalValorizado,
          ])

          filaExcel.height = 25

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

              aplicarBorde(celda)

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

          filaExcel.getCell(1).alignment = {
            vertical: 'middle',
            horizontal: 'center',
          }

          filaExcel.getCell(1).font = {
            name: 'Aptos',
            size: 11,
            bold: true,
            color: {
              argb: TEXTO_OSCURO,
            },
          }

          if (fila.posicion === 1) {
            filaExcel.getCell(1).fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {
                argb: ORO,
              },
            }
          } else if (
            fila.posicion === 2
          ) {
            filaExcel.getCell(1).fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {
                argb: PLATA,
              },
            }
          } else if (
            fila.posicion === 3
          ) {
            filaExcel.getCell(1).fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {
                argb: BRONCE,
              },
            }
          }

          filaExcel.getCell(7).numFmt =
            '#,##0.000'

          filaExcel.getCell(7).alignment = {
            vertical: 'middle',
            horizontal: 'right',
          }

          for (
            let columna = 8;
            columna <= 10;
            columna += 1
          ) {
            filaExcel.getCell(
              columna,
            ).alignment = {
              vertical: 'middle',
              horizontal: 'center',
            }
          }

          filaExcel.getCell(11).numFmt =
            '0.00"%"'

          filaExcel.getCell(11).alignment = {
            vertical: 'middle',
            horizontal: 'right',
          }

          filaExcel.getCell(12).numFmt =
            '"S/." #,##0.00'

          filaExcel.getCell(12).alignment = {
            vertical: 'middle',
            horizontal: 'right',
          }
        },
      )

      hoja.autoFilter = {
        from: {
          row: 5,
          column: 1,
        },
        to: {
          row: hoja.rowCount,
          column: 12,
        },
      }

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

      hojaResumen.getColumn(1).width = 37
      hojaResumen.getColumn(2).width = 32

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
        [string, string | number]
      > = [
        [
          'Productos en el ranking',
          resumen.totalProductos,
        ],
        [
          'Vales considerados',
          resumen.totalVales,
        ],
        [
          'Distribuciones consideradas',
          resumen.totalDistribuciones,
        ],
        [
          'Producto más pedido',
          resumen.productoMasPedido,
        ],
        [
          'Cantidad del producto líder',
          `${resumen.cantidadProductoMasPedido} ${resumen.unidadProductoMasPedido}`,
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

          filaResumen.height = 27

          filaResumen.eachCell(
            (celda) => {
              celda.font = {
                name: 'Aptos',
                size: 11,
                color: {
                  argb: TEXTO_OSCURO,
                },
              }

              aplicarBorde(celda)

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
        },
      )

      hojaResumen.getCell('B10').numFmt =
        '"S/." #,##0.00'

      hojaResumen.mergeCells('A12:B12')

      hojaResumen.getCell('A12').value =
        `Reporte generado el ${formatearFechaHora(
          fechaGeneracion,
        )}`

      hojaResumen.getCell('A12').font = {
        name: 'Aptos',
        size: 9,
        italic: true,
        color: {
          argb: 'FF667085',
        },
      }

      hojaResumen.getCell('A12').alignment = {
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

