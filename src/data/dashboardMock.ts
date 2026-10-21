import type { ResumenDashboard } from '../services/dashboardService'

/** Datos temporales para validar visualmente el panel principal. */
export const DASHBOARD_MOCK: ResumenDashboard = {
  productosActivos: 24,
  productosStockBajo: 3,
  productosSinStock: 1,
  ingresosDelMes: 12,
  valesDelMes: 18,
  movimientosHoy: 7,
  alertas: [
    {
      id: 'mock-stock-bajo',
      titulo: 'Productos con stock bajo',
      detalle: '3 productos requieren reposición.',
      tono: 'warning',
    },
    {
      id: 'mock-sin-stock',
      titulo: 'Productos sin stock',
      detalle: '1 producto no tiene stock disponible.',
      tono: 'danger',
    },
    {
      id: 'mock-ultima-actualizacion',
      titulo: 'Último movimiento',
      detalle: 'VC-2026-0003 registrado el 20/10/2026.',
      tono: 'info',
    },
  ],
  movimientosRecientes: [
    {
      id: 'MOV-MOCK-001',
      fecha: '20/10/2026',
      tipo: 'Ingreso',
      documento: 'ING-2026-0012',
      producto: 'Filtro de aceite hidráulico',
      cantidad: 10,
      responsable: 'Carlos Mendoza',
    },
    {
      id: 'MOV-MOCK-002',
      fecha: '20/10/2026',
      tipo: 'Vale',
      documento: 'VC-2026-0003',
      producto: 'Filtro de aceite hidráulico',
      cantidad: 3,
      responsable: 'Luis Ramírez',
    },
    {
      id: 'MOV-MOCK-003',
      fecha: '19/10/2026',
      tipo: 'Ingreso',
      documento: 'ING-2026-0011',
      producto: 'Grasa multipropósito',
      cantidad: 25,
      responsable: 'Ana Torres',
    },
    {
      id: 'MOV-MOCK-004',
      fecha: '18/10/2026',
      tipo: 'Vale',
      documento: 'VC-2026-0002',
      producto: 'Cable eléctrico THW 12 AWG',
      cantidad: 30,
      responsable: 'Ana Torres',
    },
  ],
}
