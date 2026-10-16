import { Configuration } from './generated'
import { API_URL } from '../services/api'

export const apiConfiguration = new Configuration({
  basePath: API_URL,
  accessToken: () => localStorage.getItem('sysinvent_token') ?? '',
})
