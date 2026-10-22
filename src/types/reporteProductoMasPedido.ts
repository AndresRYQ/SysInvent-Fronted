export interface FiltrosProductosMasPedidos {
  busqueda: string
  fechaDesde: string
  fechaHasta: string
  tipoProductoId: string
  categoriaId: string
  destinoId: string
}

export interface FilaProductoMasPedido {
  posicion: number
  productoId: number
  codigoProducto: string
  producto: string
  tipoProductoId: string
  tipoProducto: string
  categoriaId: string
  categoria: string
  unidadMedida: string
  cantidadSolicitada: number
  numeroVales: number
  numeroDistribuciones: number
  destinosAtendidos: number
  totalValorizado: number
  participacion: number
}

export interface ResumenProductosMasPedidos {
  totalProductos: number
  totalVales: number
  totalDistribuciones: number
  totalValorizado: number
  productoMasPedido: string
  cantidadProductoMasPedido: number
  unidadProductoMasPedido: string
}

