import { Configuration, type Middleware } from './generated'
import { API_URL } from '../services/api'

export const AUTH_TOKEN_KEY = 'sysinvent_token'

const tokenInterceptor: Middleware = {
  async pre({ url, init }) {
    const token = localStorage.getItem(AUTH_TOKEN_KEY)?.replace(/["']+/g, '')

    if (!token) {
      return
    }

    const headers = new Headers(init.headers)

    if (!headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`)
    }

    return { url, init: { ...init, headers } }
  },
}

export const apiConfiguration = new Configuration({
  basePath: API_URL,
  accessToken: () => localStorage.getItem(AUTH_TOKEN_KEY)?.replace(/["']+/g, '') ?? '',
  middleware: [tokenInterceptor],
})
