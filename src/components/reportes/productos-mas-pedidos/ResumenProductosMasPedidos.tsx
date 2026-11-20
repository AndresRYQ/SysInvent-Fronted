import { Boxes, ClipboardList, ListTree, Trophy, WalletCards } from 'lucide-react'

import { MetricCard } from '../../common/MetricCard'
import type { ResumenProductosMasPedidos as Resumen } from '../../../types/reporteProductoMasPedido'

interface ResumenProductosMasPedidosProps { resumen: Resumen }

function formatearCantidad(valor: number): string {
  return new Intl.NumberFormat('es-PE', { minimumFractionDigits: 0, maximumFractionDigits: 3 }).format(valor)
}

function formatearMoneda(valor: number): string {
  return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN', minimumFractionDigits: 2 }).format(valor)
}

export function ResumenProductosMasPedidos({ resumen }: ResumenProductosMasPedidosProps) {
  const cards = [
    { label: 'Producto más pedido', value: resumen.productoMasPedido, detail: `${formatearCantidad(resumen.cantidadProductoMasPedido)} ${resumen.unidadProductoMasPedido}`, tone: 'orange', status: 'positive' as const, icon: <Trophy size={27} /> },
    { label: 'Productos', value: resumen.totalProductos, detail: 'Productos registrados', tone: 'blue', icon: <Boxes size={27} /> },
    { label: 'Vales', value: resumen.totalVales, detail: 'Vales registrados', tone: 'green', icon: <ClipboardList size={27} /> },
    { label: 'Distribuciones', value: resumen.totalDistribuciones, detail: 'Distribuciones realizadas', tone: 'teal', icon: <ListTree size={27} /> },
    { label: 'Valorizado', value: formatearMoneda(resumen.totalValorizado), detail: 'Valor acumulado', tone: 'violet', status: 'positive' as const, icon: <WalletCards size={27} /> },
  ]

  return <section className="report-metric-grid report-metric-grid--products">{cards.map((card) => <MetricCard key={card.label} {...card} />)}</section>
}
