
const DEFAULT_LOCAL_API_URL = 'http://localhost:8080'
const DEFAULT_PRODUCTION_API_URL = 'https://sysinvent-backend.onrender.com'

export const API_URL =
  (import.meta.env.VITE_API_URL ||
    (import.meta.env.DEV
      ? DEFAULT_LOCAL_API_URL
      : DEFAULT_PRODUCTION_API_URL)).replace(/\/+$/, '')

const AUTH_TOKEN_KEY = 'sysinvent_token'

export interface ApiError extends Error {
  status?: number
  isConnectionError?: boolean
  data?: unknown
}

export interface ApiResponseDiagnostic {
  status: number
  statusText: string
  headers: Record<string, string>
  body: unknown
}

export function toApiError(error: unknown): ApiError {
  const response = (error as { response?: Response } | null)?.response

  if (response instanceof Response) {
    const apiError = new Error(
      error instanceof Error ? error.message : response.statusText,
    ) as ApiError

    apiError.status = response.status
    return apiError
  }

  return error as ApiError
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
  onResponse?: (diagnostic: ApiResponseDiagnostic) => void,
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

    onResponse?.({
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      body: data,
    })

    if (!response.ok) {
      const message =
        typeof data === 'object' && data
          ? 'message' in data
            ? String(data.message)
            : 'mensaje' in data
              ? String(data.mensaje)
              : response.statusText
          : response.statusText
      const error = new Error(message) as ApiError

      error.status = response.status
      error.data = data
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
