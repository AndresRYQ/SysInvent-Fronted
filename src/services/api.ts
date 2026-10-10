
export const API_URL =
  import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

const AUTH_TOKEN_KEY = 'sysinvent_token'

export interface ApiError extends Error {
  status?: number
  isConnectionError?: boolean
}

function buildUrl(endpoint: string): string {
  if (/^https?:\/\//i.test(endpoint)) {
    return endpoint
  }

  return `${API_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers)

  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json')
  }

  const token = localStorage.getItem(AUTH_TOKEN_KEY)

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  try {
    const response = await fetch(buildUrl(endpoint), {
      ...options,
      headers,
    })

    const contentType = response.headers.get('content-type') ?? ''
    const data = contentType.includes('application/json')
      ? await response.json()
      : await response.text()

    if (!response.ok) {
      const error = new Error(
        typeof data === 'object' && data && 'message' in data
          ? String(data.message)
          : response.statusText,
      ) as ApiError

      error.status = response.status
      throw error
    }

    return data as T
  } catch (error) {
    if (error instanceof TypeError) {
      const apiError = new Error(
        'No se pudo conectar con el servidor',
      ) as ApiError

      apiError.isConnectionError = true
      throw apiError
    }

    throw error
  }
}
