export const productosKardex = [
  { id: 'PRD-001', nombre: 'Guantes de nitrilo', unidad: 'Caja' },
  { id: 'PRD-002', nombre: 'Mascarillas N95', unidad: 'Paquete' },
  { id: 'PRD-003', nombre: 'Cinta de embalaje', unidad: 'Rollo' },
  { id: 'PRD-004', nombre: 'Lentes de seguridad', unidad: 'Unidad' },
]

// Datos de demostración: cada producto inicia con saldo cero.
const registros = [
  { fecha: '2026-08-05', productoId: 'PRD-001', ingreso: 50, salida: 0, responsable: 'Jorge Ramírez' },
  { fecha: '2026-08-08', productoId: 'PRD-002', ingreso: 100, salida: 0, responsable: 'Ana Torres' },
  { fecha: '2026-08-10', productoId: 'PRD-003', ingreso: 200, salida: 0, responsable: 'Jorge Ramírez' },
  { fecha: '2026-08-12', productoId: 'PRD-004', ingreso: 75, salida: 0, responsable: 'Ana Torres' },
  { fecha: '2026-08-15', productoId: 'PRD-001', ingreso: 0, salida: 12, responsable: 'Luis Mendoza' },
  { fecha: '2026-08-18', productoId: 'PRD-002', ingreso: 0, salida: 30, responsable: 'Luis Mendoza' },
  { fecha: '2026-08-20', productoId: 'PRD-003', ingreso: 0, salida: 45, responsable: 'Ana Torres' },
  { fecha: '2026-08-22', productoId: 'PRD-004', ingreso: 0, salida: 20, responsable: 'Jorge Ramírez' },
  { fecha: '2026-09-01', productoId: 'PRD-001', ingreso: 25, salida: 0, responsable: 'Ana Torres' },
  { fecha: '2026-09-02', productoId: 'PRD-002', ingreso: 0, salida: 15, responsable: 'Luis Mendoza' },
  { fecha: '2026-09-03', productoId: 'PRD-003', ingreso: 50, salida: 0, responsable: 'Jorge Ramírez' },
  { fecha: '2026-09-04', productoId: 'PRD-001', ingreso: 0, salida: 8, responsable: 'Luis Mendoza' },
]

const saldos: Record<string, number> = {}
export const movimientosKardex = registros.map((registro, index) => {
  saldos[registro.productoId] = (saldos[registro.productoId] ?? 0) + registro.ingreso - registro.salida
  return { ...registro, id: `MOV-${String(index + 1).padStart(3, '0')}`, tipo: registro.ingreso > 0 ? 'Entrada' : 'Salida', stock: saldos[registro.productoId] }
})

export const stockActualKardex = productosKardex.map((producto) => ({ ...producto, stock: saldos[producto.id] ?? 0 }))
