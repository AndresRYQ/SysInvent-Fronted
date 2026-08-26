import { useState } from 'react';
import type { Proveedor } from '../../types/proveedor';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';

interface Props {
  proveedor?: Proveedor;
  onGuardar: (data: Omit<Proveedor, 'id'>) => void;
  onCancelar: () => void;
}

const estadoInicial = {
  nombre: '',
  ruc: '',
  telefono: '',
  correo: '',
  direccion: '',
  estado: 'Activo' as const,
};

export default function FormularioProveedor({ proveedor, onGuardar, onCancelar }: Props) {
  const [form, setForm] = useState(proveedor ?? estadoInicial);
  const [errores, setErrores] = useState<Record<string, string>>({});

  const actualizar = (campo: string, valor: string) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
    if (errores[campo]) setErrores((prev) => ({ ...prev, [campo]: '' }));
  };

  const validar = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.nombre.trim()) e.nombre = 'El nombre es obligatorio';
    if (!form.ruc.trim()) e.ruc = 'El RUC es obligatorio';
    else if (form.ruc.length < 10) e.ruc = 'El RUC debe tener 13 dígitos';
    if (!form.telefono.trim()) e.telefono = 'El teléfono es obligatorio';
    if (!form.correo.trim()) e.correo = 'El correo es obligatorio';
    else if (!/\S+@\S+\.\S+/.test(form.correo)) e.correo = 'Correo inválido';
    if (!form.direccion.trim()) e.direccion = 'La dirección es obligatoria';
    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validar()) onGuardar(form);
  };

  return (
    <form className="form-proveedor" onSubmit={handleSubmit}>
      <div className="form-proveedor__grid">
        <Input
          id="nombre"
          label="Nombre del Proveedor"
          placeholder="Ej: Distribuidora Central S.A."
          value={form.nombre}
          onChange={(e) => actualizar('nombre', e.target.value)}
          error={errores.nombre}
        />
        <Input
          id="ruc"
          label="RUC"
          placeholder="13 dígitos"
          maxLength={13}
          value={form.ruc}
          onChange={(e) => actualizar('ruc', e.target.value)}
          error={errores.ruc}
        />
        <Input
          id="telefono"
          label="Teléfono"
          placeholder="Ej: 02-2345678"
          value={form.telefono}
          onChange={(e) => actualizar('telefono', e.target.value)}
          error={errores.telefono}
        />
        <Input
          id="correo"
          label="Correo Electrónico"
          type="email"
          placeholder="correo@empresa.com"
          value={form.correo}
          onChange={(e) => actualizar('correo', e.target.value)}
          error={errores.correo}
        />
        <Input
          id="direccion"
          label="Dirección"
          placeholder="Av. Principal 123, Quito"
          value={form.direccion}
          onChange={(e) => actualizar('direccion', e.target.value)}
          error={errores.direccion}
          className="ui-field--full"
        />
        <Select
          id="estado"
          label="Estado"
          value={form.estado}
          onChange={(e) => actualizar('estado', e.target.value)}
          options={[
            { value: 'Activo', label: 'Activo' },
            { value: 'Inactivo', label: 'Inactivo' },
          ]}
        />
      </div>
      <div className="form-proveedor__acciones">
        <Button type="button" variant="secondary" onClick={onCancelar}>Cancelar</Button>
        <Button type="submit">{proveedor ? 'Actualizar' : 'Registrar'}</Button>
      </div>
    </form>
  );
}
