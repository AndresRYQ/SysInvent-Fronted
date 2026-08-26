import type { Proveedor } from '../../types/proveedor';
import Button from '../ui/Button';

interface Props {
  proveedores: Proveedor[];
  onEditar: (proveedor: Proveedor) => void;
  onEliminar: (id: number) => void;
}

export default function TablaProveedores({ proveedores, onEditar, onEliminar }: Props) {
  return (
    <div className="tabla-proveedores">
      <div className="tabla-proveedores__header">
        <h3>Listado de Proveedores</h3>
        <span className="tabla-proveedores__badge">{proveedores.length} registro(s)</span>
      </div>
      <div className="tabla-proveedores__scroll">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Nombre</th>
              <th>RUC</th>
              <th>Teléfono</th>
              <th>Correo</th>
              <th>Dirección</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {proveedores.length === 0 ? (
              <tr>
                <td colSpan={8} className="tabla-proveedores__vacio">
                  No hay proveedores registrados.
                </td>
              </tr>
            ) : (
              proveedores.map((p, i) => (
                <tr key={p.id}>
                  <td>{i + 1}</td>
                  <td className="tabla-proveedores__nombre">{p.nombre}</td>
                  <td>{p.ruc}</td>
                  <td>{p.telefono}</td>
                  <td>{p.correo}</td>
                  <td>{p.direccion}</td>
                  <td>
                    <span className={`tabla-proveedores__estado tabla-proveedores__estado--${p.estado.toLowerCase()}`}>
                      {p.estado}
                    </span>
                  </td>
                  <td className="tabla-proveedores__acciones">
                    <Button variant="ghost" size="sm" onClick={() => onEditar(p)}>Editar</Button>
                    <Button variant="danger" size="sm" onClick={() => onEliminar(p.id)}>Eliminar</Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
