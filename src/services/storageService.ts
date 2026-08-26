export const STORAGE_KEYS = {
  usuarios: 'agrihusac_usuarios',
  sesion: 'agrihusac_sesion',
  intentosLogin: 'agrihusac_intentos_login',
} as const

export function obtenerStorage<T>(
    clave: string,
    valorInicial: T,
): T {
    try {
        const datosGuardados = localStorage.getItem(clave)

        if (!datosGuardados) {
            return valorInicial
    }

    return JSON.parse(datosGuardados) as T
    } catch (error) {
        console.error(`Error al leer localStorage: ${clave}`, error)
        return valorInicial
    }
}

export function guardarStorage<T>(
    clave: string,
    datos: T,
): void {
    try {
        localStorage.setItem(clave, JSON.stringify(datos))
    } catch (error) {
        console.error(`Error al guardar en localStorage: ${clave}`, error)
    }
}

export function eliminarStorage(clave: string): void {
    try {
        localStorage.removeItem(clave)
    } catch (error) {
        console.error(`Error al eliminar de localStorage: ${clave}`, error)
    }
}