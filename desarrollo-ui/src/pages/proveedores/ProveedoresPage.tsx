import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Proveedor } from '../../types/proveedor';
import Button from '../../components/ui/Button';
import FiltrosProveedores from '../../components/proveedores/FiltrosProveedores';
import TablaProveedores from '../../components/proveedores/TablaProveedores';
import '../../styles/proveedores.css';

const datosIniciales: Proveedor[] = [
  {
    id: 1,
    nombre: 'Distribuidora El Sol S.A.C.',
    ruc: '20512345678',
    telefono: '01-2345678',
    correo: 'info@elsol.com.pe',
    direccion: 'Av. Principal 123, Lima',
    estado: 'Activo',
  },
  {
    id: 2,
    nombre: 'Importaciones del Norte S.A.C.',
    ruc: '20623456789',
    telefono: '076-2876543',
    correo: 'ventas@delnorte.com.pe',
    direccion: 'Calle Comercio 456, Trujillo',
    estado: 'Activo',
  },
  {
    id: 3,
    nombre: 'Mayorista La Estrella E.I.R.L.',
    ruc: '20434567890',
    telefono: '054-2456789',
    correo: 'contacto@laestrella.com.pe',
    direccion: 'Av. Industrial 789, Arequipa',
    estado: 'Inactivo',
  },
];

export default function ProveedoresPage() {
  const navigate = useNavigate();
  const [proveedores, setProveedores] = useState<Proveedor[]>(datosIniciales);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');

  const filtrados = proveedores.filter((p) => {
    const coincideBusqueda =
      !busqueda ||
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.ruc.includes(busqueda) ||
      p.correo.toLowerCase().includes(busqueda.toLowerCase());
    const coincideEstado = !filtroEstado || p.estado === filtroEstado;
    return coincideBusqueda && coincideEstado;
  });

  const handleEditar = (proveedor: Proveedor) => {
    navigate(`/proveedores/editar/${proveedor.id}`);
  };

  const handleEliminar = (id: number) => {
    if (confirm('¿Está seguro de eliminar este proveedor? Esta acción no se puede deshacer.')) {
      setProveedores((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="proveedores-page">
      <div className="proveedores-page__header">
        <div>
          <h2>Gestión de Proveedores</h2>
          <p className="proveedores-page__subtitulo">Administración de proveedores del almacén</p>
        </div>
        <Button onClick={() => navigate('/proveedores/nuevo')}>
          + Nuevo Proveedor
        </Button>
      </div>

      <FiltrosProveedores
        busqueda={busqueda}
        filtroEstado={filtroEstado}
        onBusquedaChange={setBusqueda}
        onEstadoChange={setFiltroEstado}
      />

      <TablaProveedores
        proveedores={filtrados}
        onEditar={handleEditar}
        onEliminar={handleEliminar}
      />
    </div>
  );
}
