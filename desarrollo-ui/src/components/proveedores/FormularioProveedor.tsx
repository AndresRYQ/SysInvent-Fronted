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
    if (!form.nombre.trim()) e.nombre = 'El nombre o razón social es obligatorio';
    if (!form.ruc.trim()) e.ruc = 'El número de RUC es obligatorio';
    else if (form.ruc.length !== 11) e.ruc = 'El RUC debe tener exactamente 11 dígitos';
    if (!form.telefono.trim()) e.telefono = 'El número de teléfono es obligatorio';
    if (!form.correo.trim()) e.correo = 'El correo electrónico es obligatorio';
    else if (!/\S+@\S+\.\S+/.test(form.correo)) e.correo = 'Ingrese un correo electrónico válido';
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
          label="Razón Social / Nombre"
          placeholder="Ej: Distribuidora Central S.A.C."
          value={form.nombre}
          onChange={(e) => actualizar('nombre', e.target.value)}
          error={errores.nombre}
        />
        <Input
          id="ruc"
          label="RUC"
          placeholder="Ej: 20512345678"
          maxLength={11}
          value={form.ruc}
          onChange={(e) => actualizar('ruc', e.target.value)}
          error={errores.ruc}
        />
        <Input
          id="telefono"
          label="Teléfono"
          placeholder="Ej: 01-1234567"
          value={form.telefono}
          onChange={(e) => actualizar('telefono', e.target.value)}
          error={errores.telefono}
        />
        <Input
          id="correo"
          label="Correo Electrónico"
          type="email"
          placeholder="correo@empresa.com.pe"
          value={form.correo}
          onChange={(e) => actualizar('correo', e.target.value)}
          error={errores.correo}
        />
        <Input
          id="direccion"
          label="Dirección"
          placeholder="Ej: Av. Principal 123, distrito, Lima"
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
        <Button type="submit">{proveedor ? 'Guardar Cambios' : 'Registrar Proveedor'}</Button>
      </div>
    </form>
  );
}
