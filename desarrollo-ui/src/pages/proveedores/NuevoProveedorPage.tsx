import { useNavigate } from 'react-router-dom';
import type { Proveedor } from '../../types/proveedor';
import FormularioProveedor from '../../components/proveedores/FormularioProveedor';
import '../../styles/proveedores.css';

export default function NuevoProveedorPage() {
  const navigate = useNavigate();

  const handleGuardar = (_data: Omit<Proveedor, 'id'>) => {
    navigate('/proveedores');
  };

  return (
    <div className="proveedores-page">
      <div className="proveedores-page__header">
        <div>
          <h2>Registrar Proveedor</h2>
          <p className="proveedores-page__subtitulo">Complete los datos del nuevo proveedor</p>
        </div>
      </div>
      <FormularioProveedor onGuardar={handleGuardar} onCancelar={() => navigate('/proveedores')} />
    </div>
  );
}
