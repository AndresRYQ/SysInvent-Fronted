import { useNavigate } from 'react-router-dom';
import type { Proveedor } from '../../types/proveedor';
import FormularioProveedor from '../../components/proveedores/FormularioProveedor';
import '../../styles/proveedores.css';

const proveedorEjemplo: Proveedor = {
  id: 1,
  nombre: 'Distribuidora El Sol S.A.C.',
  ruc: '20512345678',
  telefono: '01-2345678',
  correo: 'info@elsol.com.pe',
  direccion: 'Av. Principal 123, Lima',
  estado: 'Activo',
};

export default function EditarProveedorPage() {
  const navigate = useNavigate();

  const handleGuardar = (_data: Omit<Proveedor, 'id'>) => {
    navigate('/proveedores');
  };

  return (
    <div className="proveedores-page">
      <div className="proveedores-page__header">
        <div>
          <h2>Editar Proveedor</h2>
          <p className="proveedores-page__subtitulo">Modificar la información del proveedor</p>
        </div>
      </div>
      <FormularioProveedor proveedor={proveedorEjemplo} onGuardar={handleGuardar} onCancelar={() => navigate('/proveedores')} />
    </div>
  );
}
