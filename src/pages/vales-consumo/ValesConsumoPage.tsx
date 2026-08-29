import { useState } from 'react'
import {
  ArrowLeft,
  CalendarDays,
  ChevronDown,
  ClipboardList,
  Package,
  Plus,
  Save,
  Trash2,
  UserRound,
} from 'lucide-react'

import { useAuth } from '../../hooks/useAuth'
import './ValesConsumoPage.css'

type ProductoVale = {
  id: number
  producto: string
  stock: number
  cantidad: number
  unidad: string
}

const PRODUCTOS_INICIALES: ProductoVale[] = [
  {
    id: 1,
    producto: 'Guantes de nitrilo reforzado',
    stock: 240,
    cantidad: 12,
    unidad: 'Caja',
  },
]

const PRODUCTOS_DISPONIBLES = [
  { nombre: 'Guantes de nitrilo reforzado', stock: 240, unidad: 'Caja' },
  { nombre: 'Mascarilla descartable', stock: 680, unidad: 'Paquete' },
  { nombre: 'Cinta de embalaje transparente', stock: 86, unidad: 'Rollo' },
  { nombre: 'Lentes de seguridad', stock: 112, unidad: 'Unidad' },
]

export function ValesConsumoPage() {
  const { sesion } = useAuth()
  const [productos, setProductos] = useState(PRODUCTOS_INICIALES)
  const [productoSeleccionado, setProductoSeleccionado] = useState('')
  const [mensaje, setMensaje] = useState('')
  const nombreCompleto = sesion?.nombreCompleto ?? 'Usuario sin sesión'

  const agregarProducto = () => {
    const producto = PRODUCTOS_DISPONIBLES.find(
      (item) => item.nombre === productoSeleccionado,
    )

    if (!producto) {
      return
    }

    setProductos((actuales) => [
      ...actuales,
      {
        id: Date.now(),
        producto: producto.nombre,
        stock: producto.stock,
        cantidad: 1,
        unidad: producto.unidad,
      },
    ])
    setProductoSeleccionado('')
  }

  const actualizarCantidad = (id: number, cantidad: number) => {
    setProductos((actuales) =>
      actuales.map((item) =>
        item.id === id
          ? { ...item, cantidad: Math.max(1, Math.min(item.stock, cantidad)) }
          : item,
      ),
    )
  }

  const guardarVale = () => {
    setMensaje('Vale listo para registrar. Revisa los datos antes de confirmar.')
  }

  return (
    <main className="dashboard-shell voucher-shell">
      <section className="voucher-heading">
        <a className="back-link" href="/dashboard"><ArrowLeft size={16} /> Volver al inicio</a>
        <div className="heading-row">
          <div>
            <span className="voucher-eyebrow"><ClipboardList size={15} /> Salida de almacén</span>
            <h1>Nuevo vale de consumo</h1>
            <p>Registra los productos que salen del almacén y asigna el costo a un centro responsable.</p>
          </div>
          <div className="voucher-code"><span>N° de vale</span><strong>VC-2026-0087</strong><small>Borrador</small></div>
        </div>
      </section>

      <form className="voucher-content" onSubmit={(event) => { event.preventDefault(); guardarVale() }}>
        <section className="voucher-card request-card">
          <div className="card-heading"><div><span className="section-number">01</span><div><h2>Datos de la solicitud</h2><p>Información general del movimiento de almacén.</p></div></div><ClipboardList size={21} /></div>
          <div className="field-grid">
            <label className="field"><span>Fecha de solicitud</span><div className="input-icon"><input type="date" defaultValue="2026-08-26" required /><CalendarDays size={17} /></div></label>
            <label className="field"><span>Solicitado por</span><div className="input-icon"><input defaultValue={nombreCompleto} required /><UserRound size={17} /></div></label>
            <label className="field"><span>Número de guía <em>Opcional</em></span><input placeholder="Ej. G-000458" /></label>
            <label className="field"><span>Centro de costo</span><div className="select-wrap"><select defaultValue=""><option value="" disabled>Selecciona un centro</option><option>Producción agrícola</option><option>Mantenimiento</option><option>Administración</option></select><ChevronDown size={17} /></div></label>
          </div>
          <label className="field field-full"><span>Motivo de la salida</span><textarea placeholder="Describe brevemente el uso de los productos..." rows={3} /></label>
        </section>

        <section className="voucher-card products-card">
          <div className="card-heading"><div><span className="section-number">02</span><div><h2>Productos a retirar</h2><p>Verifica el stock disponible antes de confirmar la salida.</p></div></div><span className="stock-legend"><i /> Stock disponible</span></div>
          <div className="product-adder">
            <label className="field"><span>Agregar producto</span><div className="select-wrap"><select value={productoSeleccionado} onChange={(event) => setProductoSeleccionado(event.target.value)}><option value="">Busca un producto del almacén</option>{PRODUCTOS_DISPONIBLES.map((item) => <option key={item.nombre}>{item.nombre}</option>)}</select><ChevronDown size={17} /></div></label>
            <button className="add-product" type="button" onClick={agregarProducto} disabled={!productoSeleccionado}><Plus size={17} /> Agregar producto</button>
          </div>
          <div className="product-table-wrap"><table className="product-table"><thead><tr><th>Producto</th><th>Stock actual</th><th>Cantidad</th><th>Unidad de medida</th><th aria-label="Acciones" /></tr></thead><tbody>{productos.map((item) => <tr key={item.id}><td><span className="product-name"><span className="product-icon"><Package size={16} /></span>{item.producto}</span></td><td><span className="stock-value">{item.stock} <small>disponibles</small></span></td><td><input className="quantity-input" type="number" min="1" max={item.stock} value={item.cantidad} onChange={(event) => actualizarCantidad(item.id, Number(event.target.value))} aria-label={`Cantidad de ${item.producto}`} /></td><td><span className="unit-chip">{item.unidad}</span></td><td><button className="remove-product" type="button" onClick={() => setProductos((actuales) => actuales.filter((producto) => producto.id !== item.id))} aria-label={`Eliminar ${item.producto}`}><Trash2 size={17} /></button></td></tr>)}</tbody></table></div>
          <div className="table-foot"><span>{productos.length} {productos.length === 1 ? 'producto' : 'productos'} en el vale</span><strong>Total de unidades: {productos.reduce((total, item) => total + item.cantidad, 0)}</strong></div>
        </section>

        <div className="voucher-actions"><span className="form-message" role="status">{mensaje}</span><a className="cancel-button" href="/dashboard">Cancelar</a><button className="save-button" type="submit"><Save size={18} /> Guardar vale</button></div>
      </form>
    </main>
  )
}
