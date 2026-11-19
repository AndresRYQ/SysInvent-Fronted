import {
  Configuration,
  type Middleware,
} from './generated'
import {
  API_URL,
  type ApiError,
} from '../services/api'
import {
  AUTH_TOKEN_KEY,
  notificarSesionNoAutorizada,
} from '../services/authSession'

const tokenInterceptor: Middleware = {
  async pre({ url, init }) {
    const token = localStorage
      .getItem(AUTH_TOKEN_KEY)
      ?.replace(/["']+/g, '')

    if (!token) {
      return
    }

    const headers = new Headers(init.headers)

    if (!headers.has('Authorization')) {
      headers.set(
        'Authorization',
        `Bearer ${token}`,
      )
    }

    return {
      url,
      init: {
        ...init,
        headers,
      },
    }
  },
}

const responseInterceptor: Middleware = {
  async post({ response }) {
    if (response.status === 401) {
      notificarSesionNoAutorizada()
    }

    if (response.ok) {
      return
    }

    let data: unknown

    try {
      data = await response.clone().json()
    } catch {
      data = await response.clone().text()
    }

    const record =
      data &&
      typeof data === 'object'
        ? (data as Record<string, unknown>)
        : null

    const message =
      record?.message != null
        ? String(record.message)
        : response.statusText ||
          `Error HTTP ${response.status}`

    const error = new Error(message) as ApiError
    error.status = response.status
    error.data = data

    throw error
  },
}

export const apiConfiguration =
  new Configuration({
    basePath: API_URL,
    accessToken: () =>
      localStorage
        .getItem(AUTH_TOKEN_KEY)
        ?.replace(/["']+/g, '') ?? '',
    middleware: [
      tokenInterceptor,
      responseInterceptor,
    ],
  })