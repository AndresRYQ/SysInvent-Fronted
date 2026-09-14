import { CheckCircle2, FileInput, Package, Truck } from 'lucide-react'

interface ResumenReporteIngresosProps {
  totalIngresos: number
  ingresosRegistrados: number
  proveedores: number
  unidades: number
}

export function ResumenReporteIngresos({ totalIngresos, ingresosRegistrados, proveedores, unidades }: ResumenReporteIngresosProps) {
  return <div className="income-report-summary">
    <article><span className="income-summary-icon income-summary-icon--green"><FileInput size={20} /></span><div><small>Total de ingresos</small><strong>{totalIngresos}</strong><span>En el periodo consultado</span></div></article>
    <article><span className="income-summary-icon income-summary-icon--blue"><CheckCircle2 size={20} /></span><div><small>Ingresos registrados</small><strong>{ingresosRegistrados}</strong><span>Entradas activas</span></div></article>
    <article><span className="income-summary-icon income-summary-icon--orange"><Truck size={20} /></span><div><small>Proveedores</small><strong>{proveedores}</strong><span>Con entregas registradas</span></div></article>
    <article><span className="income-summary-icon income-summary-icon--violet"><Package size={20} /></span><div><small>Unidades ingresadas</small><strong>{unidades}</strong><span>Productos recibidos</span></div></article>
  </div>
}