export const AUTH_TOKEN_KEY = 'sysinvent_token'

export const AUTH_SESSION_INVALID_EVENT =
  'sysinvent:session-invalid'

export function notificarSesionNoAutorizada(): void {
  const existeToken =
    localStorage.getItem(AUTH_TOKEN_KEY) !== null

  if (!existeToken) {
    return
  }

  localStorage.removeItem(AUTH_TOKEN_KEY)

  window.dispatchEvent(
    new Event(AUTH_SESSION_INVALID_EVENT),
  )
}