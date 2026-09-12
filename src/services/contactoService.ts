import type {
  Contacto,
  ContactoFormData,
} from '../types/contacto'

import { registrarEventoBitacora } from './bitacoraService'
import { obtenerProveedores } from './proveedorService'

const STORAGE_KEY =
  'agrihusac_contactos'

const INGRESOS_STORAGE_KEY =
  'agrihusac_ingresos_almacen'

const CONTACTOS_INICIALES:
  Contacto[] = [
    {
      id: 'CONT-001',
      proveedorId: 'PROV-001',
      nombreCompleto:
        'Carlos Mendoza',
      cargo:
        'Ejecutivo de ventas',
      telefono: '987654321',
      correo:
        'carlos.mendoza@ferreteriaindustrial.pe',
      estado: true,
      fechaRegistro: '10/08/2026',
    },
    {
      id: 'CONT-002',
      proveedorId: 'PROV-002',
      nombreCompleto:
        'María Salazar',
      cargo:
        'Representante comercial',
      telefono: '945678210',
      correo:
        'maria.salazar@suministrosnorte.pe',
      estado: true,
      fechaRegistro: '11/08/2026',
    },
    {
      id: 'CONT-003',
      proveedorId: 'PROV-003',
      nombreCompleto:
        'José Ramírez',
      cargo:
        'Coordinador de pedidos',
      telefono: '912345678',
      correo:
        'jose.ramirez@equiposrepuestos.pe',
      estado: true,
      fechaRegistro: '12/08/2026',
    },
    {
      id: 'CONT-004',
      proveedorId: 'PROV-004',
      nombreCompleto:
        'Ana Torres',
      cargo:
        'Asesora comercial',
      telefono: '901234567',
      correo:
        'ana.torres@dahuaral.pe',
      estado: false,
      fechaRegistro: '13/08/2026',
    },
  ]

function copiarContactos(
  contactos: Contacto[],
): Contacto[] {
  return contactos.map(
    (contacto) => ({
      ...contacto,
    }),
  )
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
): string {
  const numeroMayor =
    contactos.reduce(
      (mayor, contacto) => {
        const numero = Number(
          contacto.id.replace(
            'CONT-',
            '',
          ),
        )

        return Number.isNaN(numero)
          ? mayor
          : Math.max(mayor, numero)
      },
      0,
    )

  return `CONT-${String(
    numeroMayor + 1,
  ).padStart(3, '0')}`
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

function contactoEstaEnUso(
  contactoId: string,
): boolean {
  try {
    const datosGuardados =
      localStorage.getItem(
        INGRESOS_STORAGE_KEY,
      )

    if (!datosGuardados) {
      return false
    }

    const ingresos = JSON.parse(
      datosGuardados,
    )

    if (!Array.isArray(ingresos)) {
      return false
    }

    return ingresos.some(
      (ingreso) =>
        typeof ingreso === 'object' &&
        ingreso !== null &&
        ingreso.contactoId ===
          contactoId,
    )
  } catch {
    return false
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

    return copiarContactos(
      datos as Contacto[],
    )
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
  id: string,
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
        contacto.proveedorId ===
          datos.proveedorId &&
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
    proveedorId:
      datos.proveedorId,
    nombreCompleto:
      datos.nombreCompleto.trim(),
    cargo: datos.cargo.trim(),
    telefono:
      datos.telefono.trim(),
    correo:
      datos.correo
        .trim()
        .toLowerCase(),
    estado: datos.estado,
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
      nuevoContacto.id,
  })

  return { ...nuevoContacto }
}

export function actualizarContacto(
  id: string,
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
        contacto.proveedorId ===
          datos.proveedorId &&
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
      proveedorId:
        datos.proveedorId,
      nombreCompleto:
        datos.nombreCompleto.trim(),
      cargo: datos.cargo.trim(),
      telefono:
        datos.telefono.trim(),
      correo:
        datos.correo
          .trim()
          .toLowerCase(),
      estado: datos.estado,
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
      contactoActualizado.id,
  })

  return {
    ...contactoActualizado,
  }
}

export function eliminarContacto(
  id: string,
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

  if (contactoEstaEnUso(id)) {
    throw new Error(
      'No puedes eliminar este contacto porque está asignado a uno o más ingresos de almacén. Puedes desactivarlo.',
    )
  }

  guardarContactos(
    contactos.filter(
      (item) => item.id !== id,
    ),
  )

  registrarEventoBitacora({
    modulo: 'Contactos',
    accion: 'ELIMINAR',
    detalle:
      `Se eliminó el contacto "${contacto.nombreCompleto}".`,
    registroId: contacto.id,
  })
}
