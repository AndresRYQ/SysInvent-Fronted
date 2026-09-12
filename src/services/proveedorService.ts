import type {
  Proveedor,
  ProveedorFormData,
} from '../types/proveedor'

import { registrarEventoBitacora } from './bitacoraService'

const STORAGE_KEY =
  'agrihusac_proveedores'

const PROVEEDORES_INICIALES:
  Proveedor[] = [
    {
      id: 'PROV-001',
      ruc: '20100070970',
      razonSocial:
        'Ferretería Industrial S.A.C.',
      correo:
        'ventas@ferreteriaindustrial.pe',
      telefono: '987654321',
      direccion:
        'Av. Industrial 450, Lima',
      estado: true,
      fechaRegistro: '10/08/2026',
    },
    {
      id: 'PROV-002',
      ruc: '20548796321',
      razonSocial:
        'Suministros del Norte E.I.R.L.',
      correo:
        'contacto@suministrosnorte.pe',
      telefono: '945678210',
      direccion:
        'Av. Chancay 320, Huaral',
      estado: true,
      fechaRegistro: '11/08/2026',
    },
    {
      id: 'PROV-003',
      ruc: '20601234567',
      razonSocial:
        'Equipos y Repuestos Perú S.A.C.',
      correo:
        'pedidos@equiposrepuestos.pe',
      telefono: '912345678',
      direccion:
        'Jr. Los Talleres 125, Lima',
      estado: true,
      fechaRegistro: '12/08/2026',
    },
    {
      id: 'PROV-004',
      ruc: '20456789123',
      razonSocial:
        'Distribuidora Agrícola Huaral S.R.L.',
      correo:
        'ventas@dahuaral.pe',
      telefono: '901234567',
      direccion:
        'Carretera Huaral 780, Huaral',
      estado: false,
      fechaRegistro: '13/08/2026',
    },
  ]

function copiarProveedores(
  proveedores: Proveedor[],
): Proveedor[] {
  return proveedores.map(
    (proveedor) => ({
      ...proveedor,
    }),
  )
}

function guardarProveedores(
  proveedores: Proveedor[],
): void {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(proveedores),
  )
}

function normalizarTexto(
  valor: string | null | undefined,
): string {
  return (valor ?? '')
    .trim()
    .toLowerCase()
}

function validarDatos(
  datos: ProveedorFormData,
): void {
  const ruc = datos.ruc.trim()
  const razonSocial =
    datos.razonSocial.trim()
  const correo = datos.correo.trim()
  const telefono =
    datos.telefono.trim()
  const direccion =
    datos.direccion.trim()

  if (!/^\d{11}$/.test(ruc)) {
    throw new Error(
      'El RUC debe contener exactamente 11 números.',
    )
  }

  if (razonSocial.length < 2) {
    throw new Error(
      'La razón social debe tener al menos 2 caracteres.',
    )
  }

  if (razonSocial.length > 120) {
    throw new Error(
      'La razón social no puede superar los 120 caracteres.',
    )
  }

  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      correo,
    )
  ) {
    throw new Error(
      'Ingresa un correo electrónico válido.',
    )
  }

  const numerosTelefono =
    telefono.replace(/\D/g, '')

  if (
    numerosTelefono.length < 7 ||
    numerosTelefono.length > 15
  ) {
    throw new Error(
      'Ingresa un número de teléfono válido.',
    )
  }

  if (direccion.length < 5) {
    throw new Error(
      'La dirección debe tener al menos 5 caracteres.',
    )
  }

  if (direccion.length > 200) {
    throw new Error(
      'La dirección no puede superar los 200 caracteres.',
    )
  }
}

function crearSiguienteId(
  proveedores: Proveedor[],
): string {
  const numeroMayor =
    proveedores.reduce(
      (mayor, proveedor) => {
        const numero = Number(
          proveedor.id.replace(
            'PROV-',
            '',
          ),
        )

        return Number.isNaN(numero)
          ? mayor
          : Math.max(mayor, numero)
      },
      0,
    )

  return `PROV-${String(
    numeroMayor + 1,
  ).padStart(3, '0')}`
}

function crearFechaActual(): string {
  return new Intl.DateTimeFormat(
    'es-PE',
  ).format(new Date())
}

export function obtenerProveedores():
  Proveedor[] {
  const datosGuardados =
    localStorage.getItem(STORAGE_KEY)

  if (!datosGuardados) {
    guardarProveedores(
      PROVEEDORES_INICIALES,
    )

    return copiarProveedores(
      PROVEEDORES_INICIALES,
    )
  }

  try {
    const datos = JSON.parse(
      datosGuardados,
    )

    if (!Array.isArray(datos)) {
      throw new Error(
        'Formato inválido',
      )
    }

    return copiarProveedores(
      datos as Proveedor[],
    )
  } catch {
    guardarProveedores(
      PROVEEDORES_INICIALES,
    )

    return copiarProveedores(
      PROVEEDORES_INICIALES,
    )
  }
}

export function obtenerProveedorPorId(
  id: string,
): Proveedor | null {
  const proveedor =
    obtenerProveedores().find(
      (item) => item.id === id,
    )

  return proveedor
    ? { ...proveedor }
    : null
}

export function crearProveedor(
  datos: ProveedorFormData,
): Proveedor {
  validarDatos(datos)

  const proveedores =
    obtenerProveedores()

  const rucDuplicado =
    proveedores.some(
      (proveedor) =>
        proveedor.ruc.trim() ===
        datos.ruc.trim(),
    )

  if (rucDuplicado) {
    throw new Error(
      'Ya existe un proveedor con ese RUC.',
    )
  }

  const razonSocialDuplicada =
    proveedores.some(
      (proveedor) =>
        normalizarTexto(
          proveedor.razonSocial,
        ) ===
        normalizarTexto(
          datos.razonSocial,
        ),
    )

  if (razonSocialDuplicada) {
    throw new Error(
      'Ya existe un proveedor con esa razón social.',
    )
  }

  const nuevoProveedor: Proveedor = {
    id: crearSiguienteId(
      proveedores,
    ),
    ruc: datos.ruc.trim(),
    razonSocial:
      datos.razonSocial.trim(),
    correo:
      datos.correo
        .trim()
        .toLowerCase(),
    telefono:
      datos.telefono.trim(),
    direccion:
      datos.direccion.trim(),
    estado: datos.estado,
    fechaRegistro:
      crearFechaActual(),
  }

  guardarProveedores([
    nuevoProveedor,
    ...proveedores,
  ])

  registrarEventoBitacora({
    modulo: 'Proveedores',
    accion: 'CREAR',
    detalle:
      `Se creó el proveedor "${nuevoProveedor.razonSocial}" con RUC ${nuevoProveedor.ruc}.`,
    registroId:
      nuevoProveedor.id,
  })

  return { ...nuevoProveedor }
}

export function actualizarProveedor(
  id: string,
  datos: ProveedorFormData,
): Proveedor {
  validarDatos(datos)

  const proveedores =
    obtenerProveedores()

  const proveedorActual =
    proveedores.find(
      (proveedor) =>
        proveedor.id === id,
    )

  if (!proveedorActual) {
    throw new Error(
      'El proveedor no existe.',
    )
  }

  const rucDuplicado =
    proveedores.some(
      (proveedor) =>
        proveedor.id !== id &&
        proveedor.ruc.trim() ===
          datos.ruc.trim(),
    )

  if (rucDuplicado) {
    throw new Error(
      'Ya existe otro proveedor con ese RUC.',
    )
  }

  const razonSocialDuplicada =
    proveedores.some(
      (proveedor) =>
        proveedor.id !== id &&
        normalizarTexto(
          proveedor.razonSocial,
        ) ===
          normalizarTexto(
            datos.razonSocial,
          ),
    )

  if (razonSocialDuplicada) {
    throw new Error(
      'Ya existe otro proveedor con esa razón social.',
    )
  }

  const proveedorActualizado:
    Proveedor = {
      ...proveedorActual,
      ruc: datos.ruc.trim(),
      razonSocial:
        datos.razonSocial.trim(),
      correo:
        datos.correo
          .trim()
          .toLowerCase(),
      telefono:
        datos.telefono.trim(),
      direccion:
        datos.direccion.trim(),
      estado: datos.estado,
    }

  guardarProveedores(
    proveedores.map((proveedor) =>
      proveedor.id === id
        ? proveedorActualizado
        : proveedor,
    ),
  )

  registrarEventoBitacora({
    modulo: 'Proveedores',
    accion: 'EDITAR',
    detalle:
      `Se actualizó el proveedor "${proveedorActualizado.razonSocial}".`,
    registroId:
      proveedorActualizado.id,
  })

  return { ...proveedorActualizado }
}

export function eliminarProveedor(
  id: string,
): void {
  const proveedores =
    obtenerProveedores()

  const proveedorAEliminar =
    proveedores.find(
      (proveedor) =>
        proveedor.id === id,
    )

  if (!proveedorAEliminar) {
    throw new Error(
      'El proveedor no existe.',
    )
  }

  guardarProveedores(
    proveedores.filter(
      (proveedor) =>
        proveedor.id !== id,
    ),
  )

  registrarEventoBitacora({
    modulo: 'Proveedores',
    accion: 'ELIMINAR',
    detalle:
      `Se eliminó el proveedor "${proveedorAEliminar.razonSocial}".`,
    registroId:
      proveedorAEliminar.id,
  })
}