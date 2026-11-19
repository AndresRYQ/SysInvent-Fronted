import type {
  FilaReporteIngreso,
  ResumenReporteIngresos,
} from '../types/reporteIngreso'

function redondearImporte(
  valor: number,
): number {
  return Number(valor.toFixed(2))
}

export function obtenerResumenReporteIngresos(
  filas: FilaReporteIngreso[],
): ResumenReporteIngresos {
  const ingresosUnicos = new Map<
    string,
    FilaReporteIngreso
  >()

  filas.forEach((fila) => {
    if (!ingresosUnicos.has(fila.ingresoId)) {
      ingresosUnicos.set(fila.ingresoId, fila)
    }
  })

  const ingresos =
    Array.from(ingresosUnicos.values())

  const ingresosRegistrados =
    ingresos.filter(
      (ingreso) =>
        ingreso.estado === 'REGISTRADO',
    ).length

  const ingresosAnulados =
    ingresos.filter(
      (ingreso) =>
        ingreso.estado === 'ANULADO',
    ).length

  const totalValorizado = filas
    .filter(
      (fila) =>
        fila.estado === 'REGISTRADO',
    )
    .reduce(
      (total, fila) =>
        total + fila.subtotal,
      0,
    )

  return {
    totalIngresos: ingresos.length,
    ingresosRegistrados,
    ingresosAnulados,
    lineasProductos: filas.length,
    totalValorizado:
      redondearImporte(totalValorizado),
  }
}