import type {
  Contacto,
  ContactoFormData,
} from '../types/contacto'

import { registrarEventoBitacora } from './bitacoraService'
import { obtenerProveedores } from './proveedorService'
import { coincidenIds } from '../utils/identificadores'

const STORAGE_KEY =
  'agrihusac_contactos'

type RegistroGuardado = Partial<Contacto> & {
  id?: number | string
  activo?: 0 | 1
  estado?: boolean
}

const CONTACTOS_INICIALES:
  Contacto[] = [
    {
      id: 1,
      proveedorId: 1,
      nombreCompleto:
        'Carlos Mendoza',
      cargo:
        'Ejecutivo de ventas',
      telefono: '987654321',
      correo:
        'carlos.mendoza@ferreteriaindustrial.pe',
      activo: 1,
      fechaRegistro: '10/08/2026',
    },
    {
      id: 2,
      proveedorId: 2,
      nombreCompleto:
        'María Salazar',
      cargo:
        'Representante comercial',
      telefono: '945678210',
      correo:
        'maria.salazar@suministrosnorte.pe',
      activo: 1,
      fechaRegistro: '11/08/2026',
    },
    {
      id: 3,
      proveedorId: 3,
      nombreCompleto:
        'José Ramírez',
      cargo:
        'Coordinador de pedidos',
      telefono: '912345678',
      correo:
        'jose.ramirez@equiposrepuestos.pe',
      activo: 1,
      fechaRegistro: '12/08/2026',
    },
    {
      id: 4,
      proveedorId: 4,
      nombreCompleto:
        'Ana Torres',
      cargo:
        'Asesora comercial',
      telefono: '901234567',
      correo:
        'ana.torres@dahuaral.pe',
      activo: 0,
      fechaRegistro: '13/08/2026',
    },
  ]

function copiarContactos(
  contactos: Contacto[],
): Contacto[] {
  return contactos
    .map((contacto) => ({ ...contacto }))
    .sort((a, b) => a.id - b.id)
}

function normalizarContacto(
  registro: RegistroGuardado,
): Contacto | null {
  const id = typeof registro.id === 'number'
    ? registro.id
    : Number(String(registro.id ?? '').replace(/^CONT-/, ''))

  if (!Number.isInteger(id) || id <= 0 || !registro.nombreCompleto) {
    return null
  }

  return {
    id,
    proveedorId: Number(
      String(registro.proveedorId ?? '')
        .replace(/^PROV-0*/i, ''),
    ),
    nombreCompleto: String(registro.nombreCompleto).trim(),
    cargo: String(registro.cargo ?? '').trim(),
    telefono: String(registro.telefono ?? '').trim(),
    correo: String(registro.correo ?? '').trim().toLowerCase(),
    activo: registro.activo === 0 || registro.activo === 1
      ? registro.activo
      : registro.estado === false ? 0 : 1,
    fechaRegistro: String(registro.fechaRegistro ?? ''),
  }
}

function guardarContactos(
  contactos: Contacto[],
): void {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(contactos),
  )
}

function normalizarTexto(
  valor: string | null | undefined,
): string {
  return (valor ?? '')
    .trim()
    .toLowerCase()
}

function crearFechaActual(): string {
  return new Intl.DateTimeFormat(
    'es-PE',
  ).format(new Date())
}

function crearSiguienteId(
  contactos: Contacto[],
): number {
  return contactos.reduce(
    (mayor, contacto) => Math.max(mayor, contacto.id),
    0,
  ) + 1
}

function validarDatos(
  datos: ContactoFormData,
): void {
  const nombreCompleto =
    datos.nombreCompleto.trim()
  const cargo = datos.cargo.trim()
  const telefono =
    datos.telefono.trim()
  const correo =
    datos.correo.trim()

  if (!datos.proveedorId) {
    throw new Error(
      'Selecciona un proveedor.',
    )
  }

  const proveedorExiste =
    obtenerProveedores().some(
      (proveedor) =>
        String(proveedor.id) ===
        datos.proveedorId,
    )

  if (!proveedorExiste) {
    throw new Error(
      'El proveedor seleccionado no existe.',
    )
  }

  if (nombreCompleto.length < 3) {
    throw new Error(
      'El nombre completo debe tener al menos 3 caracteres.',
    )
  }

  if (nombreCompleto.length > 120) {
    throw new Error(
      'El nombre completo no puede superar los 120 caracteres.',
    )
  }

  if (cargo.length < 2) {
    throw new Error(
      'El cargo debe tener al menos 2 caracteres.',
    )
  }

  if (cargo.length > 80) {
    throw new Error(
      'El cargo no puede superar los 80 caracteres.',
    )
  }

  const numerosTelefono =
    telefono.replace(/\D/g, '')

  if (
    numerosTelefono.length < 7 ||
    numerosTelefono.length > 15
  ) {
    throw new Error(
      'Ingresa un teléfono válido.',
    )
  }

  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      correo,
    )
  ) {
    throw new Error(
      'Ingresa un correo válido.',
    )
  }
}

export function obtenerContactos():
  Contacto[] {
  const datosGuardados =
    localStorage.getItem(STORAGE_KEY)

  if (!datosGuardados) {
    guardarContactos(
      CONTACTOS_INICIALES,
    )

    return copiarContactos(
      CONTACTOS_INICIALES,
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

    const normalizados = datos
      .map((registro) => normalizarContacto(registro as RegistroGuardado))
      .filter((contacto): contacto is Contacto => Boolean(contacto))

    guardarContactos(normalizados)
    return copiarContactos(normalizados)
  } catch {
    guardarContactos(
      CONTACTOS_INICIALES,
    )

    return copiarContactos(
      CONTACTOS_INICIALES,
    )
  }
}

export function obtenerContactoPorId(
  id: number,
): Contacto | null {
  const contacto =
    obtenerContactos().find(
      (item) => item.id === id,
    )

  return contacto
    ? { ...contacto }
    : null
}

export function crearContacto(
  datos: ContactoFormData,
): Contacto {
  validarDatos(datos)

  const contactos =
    obtenerContactos()

  const correoDuplicado =
    contactos.some(
      (contacto) =>
        coincidenIds(
          contacto.proveedorId,
          datos.proveedorId,
          'PROV-',
        ) &&
        normalizarTexto(
          contacto.correo,
        ) ===
          normalizarTexto(
            datos.correo,
          ),
    )

  if (correoDuplicado) {
    throw new Error(
      'Este correo ya está registrado para el proveedor seleccionado.',
    )
  }

  const nuevoContacto: Contacto = {
    id: crearSiguienteId(contactos),
    proveedorId: Number(
      datos.proveedorId.replace(/^PROV-0*/i, ''),
    ),
    nombreCompleto:
      datos.nombreCompleto.trim(),
    cargo: datos.cargo.trim(),
    telefono:
      datos.telefono.trim(),
    correo:
      datos.correo
        .trim()
        .toLowerCase(),
    activo: 1,
    fechaRegistro:
      crearFechaActual(),
  }

  guardarContactos([
    nuevoContacto,
    ...contactos,
  ])

  registrarEventoBitacora({
    modulo: 'Contactos',
    accion: 'CREAR',
    detalle:
      `Se creó el contacto "${nuevoContacto.nombreCompleto}".`,
    registroId:
      String(nuevoContacto.id),
  })

  return { ...nuevoContacto }
}

export function actualizarContacto(
  id: number,
  datos: ContactoFormData,
): Contacto {
  validarDatos(datos)

  const contactos =
    obtenerContactos()

  const contactoActual =
    contactos.find(
      (contacto) =>
        contacto.id === id,
    )

  if (!contactoActual) {
    throw new Error(
      'El contacto no existe.',
    )
  }

  const correoDuplicado =
    contactos.some(
      (contacto) =>
        contacto.id !== id &&
        coincidenIds(
          contacto.proveedorId,
          datos.proveedorId,
          'PROV-',
        ) &&
        normalizarTexto(
          contacto.correo,
        ) ===
          normalizarTexto(
            datos.correo,
          ),
    )

  if (correoDuplicado) {
    throw new Error(
      'Este correo ya está registrado para el proveedor seleccionado.',
    )
  }

  const contactoActualizado:
    Contacto = {
      ...contactoActual,
    proveedorId: Number(
      datos.proveedorId.replace(/^PROV-0*/i, ''),
    ),
      nombreCompleto:
        datos.nombreCompleto.trim(),
      cargo: datos.cargo.trim(),
      telefono:
        datos.telefono.trim(),
      correo:
        datos.correo
          .trim()
          .toLowerCase(),
      activo: contactoActual.activo,
    }

  guardarContactos(
    contactos.map((contacto) =>
      contacto.id === id
        ? contactoActualizado
        : contacto,
    ),
  )

  registrarEventoBitacora({
    modulo: 'Contactos',
    accion: 'EDITAR',
    detalle:
      `Se actualizó el contacto "${contactoActualizado.nombreCompleto}".`,
    registroId:
      String(contactoActualizado.id),
  })

  return {
    ...contactoActualizado,
  }
}

export function desactivarContacto(
  id: number,
): void {
  const contactos =
    obtenerContactos()

  const contacto = contactos.find(
    (item) => item.id === id,
  )

  if (!contacto) {
    throw new Error(
      'El contacto no existe.',
    )
  }

  guardarContactos(
    contactos.map((item) =>
      item.id === id ? { ...item, activo: 0 } : item,
    ),
  )

  registrarEventoBitacora({
    modulo: 'Contactos',
    accion: 'EDITAR',
    detalle:
      `Se desactivó el contacto "${contacto.nombreCompleto}".`,
    registroId: String(contacto.id),
  })
}

export function reactivarContacto(id: number): void {
  const contactos = obtenerContactos()
  const contacto = contactos.find((item) => item.id === id)

  if (!contacto) {
    throw new Error('El contacto no existe.')
  }

  guardarContactos(
    contactos.map((item) =>
      item.id === id ? { ...item, activo: 1 } : item,
    ),
  )
}
