import { Ban, Boxes, CircleCheckBig, ClipboardList, WalletCards } from 'lucide-react'

import { MetricCard } from '../../common/MetricCard'
import type { ResumenReporteIngresos as Resumen } from '../../../types/reporteIngreso'

interface ResumenReporteIngresosProps { resumen: Resumen }

function formatearMoneda(valor: number): string {
  return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN', minimumFractionDigits: 2 }).format(valor)
}

export function ResumenReporteIngresos({ resumen }: ResumenReporteIngresosProps) {
  const cards = [
    { label: 'Total de ingresos', value: resumen.totalIngresos, detail: 'Documentos registrados', tone: 'blue', icon: <ClipboardList size={27} /> },
    { label: 'Registrados', value: resumen.ingresosRegistrados, detail: 'Ingresos confirmados', tone: 'green', status: 'positive' as const, icon: <CircleCheckBig size={27} /> },
    { label: 'Anulados', value: resumen.ingresosAnulados, detail: 'Ingresos anulados', tone: 'orange', status: 'alert' as const, icon: <Ban size={27} /> },
    { label: 'Líneas de productos', value: resumen.lineasProductos, detail: 'Productos registrados', tone: 'violet', icon: <Boxes size={27} /> },
    { label: 'Total valorizado', value: formatearMoneda(resumen.totalValorizado), detail: 'Valor acumulado', tone: 'teal', status: 'positive' as const, icon: <WalletCards size={27} /> },
  ]

  return <section className="report-metric-grid">{cards.map((card) => <MetricCard key={card.label} {...card} />)}</section>
}
