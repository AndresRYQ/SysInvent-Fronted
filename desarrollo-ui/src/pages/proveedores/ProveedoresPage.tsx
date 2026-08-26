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
    nombre: 'Distribuidora El Sol S.A.',
    ruc: '1792345678001',
    telefono: '02-2345678',
    correo: 'info@elsol.com.ec',
    direccion: 'Av. Principal 123, Quito',
    estado: 'Activo',
  },
  {
    id: 2,
    nombre: 'Importaciones del Norte Cía. Ltda.',
    ruc: '1804567890001',
    telefono: '06-2876543',
    correo: 'ventas@delnorte.com.ec',
    direccion: 'Calle Comercio 456, Guayaquil',
    estado: 'Activo',
  },
  {
    id: 3,
    nombre: 'Mayorista La Estrella',
    ruc: '0912345678001',
    telefono: '04-2456789',
    correo: 'contacto@laestrella.com.ec',
    direccion: 'Av. Industrial 789, Cuenca',
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
    if (confirm('¿Estás seguro de eliminar este proveedor?')) {
      setProveedores((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="proveedores-page">
      <div className="proveedores-page__header">
        <div>
          <h2>Módulo de Proveedores</h2>
          <p className="proveedores-page__subtitulo">Gestión y administración de proveedores del almacén</p>
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
