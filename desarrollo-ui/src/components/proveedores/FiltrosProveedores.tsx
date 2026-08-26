import Input from '../ui/Input';
import Select from '../ui/Select';

interface Props {
  busqueda: string;
  filtroEstado: string;
  onBusquedaChange: (valor: string) => void;
  onEstadoChange: (valor: string) => void;
}

export default function FiltrosProveedores({ busqueda, filtroEstado, onBusquedaChange, onEstadoChange }: Props) {
  return (
    <div className="filtros-proveedores">
      <Input
        id="busqueda"
        label="Buscar proveedor"
        placeholder="Buscar por nombre, RUC o correo..."
        value={busqueda}
        onChange={(e) => onBusquedaChange(e.target.value)}
      />
      <Select
        id="filtroEstado"
        label="Estado"
        value={filtroEstado}
        onChange={(e) => onEstadoChange(e.target.value)}
        placeholder="Todos los estados"
        options={[
          { value: 'Activo', label: 'Activo' },
          { value: 'Inactivo', label: 'Inactivo' },
        ]}
      />
    </div>
  );
}
