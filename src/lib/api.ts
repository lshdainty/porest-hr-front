import config from '@/config/config'
import axios, { type AxiosError, type AxiosResponse } from 'axios'

const baseURL = config.apiBaseUrl

const api = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 세션 쿠키 포함하여 요청 (Spring security에서 반환한 JSESSIONID, VALUE)
})

interface CustomHeaders {
  [key: string]: any
}

interface ApiResponse<T = any> {
  code: number
  message: string
  count: number
  data: T
}

interface ApiErrorResponse {
  code: number
  message: string
  count: number
  data?: {
    code: number
    message: string
    url: string
  }
}

api.interceptors.request.use(
  (config: any) => {
    const headers = config.headers as CustomHeaders

    // login, logout API는 /api/v1 없이 호출
    if (config.url.includes('/oauth2')) {
      config.baseURL = import.meta.env.VITE_BASE_URL
    }

    // 세션 쿠키는 withCredentials로 자동 포함됨
    return config
  },
  (err: AxiosError) => {
    console.log('axios request error : ', err)
    return Promise.reject(err)
  }
)

api.interceptors.response.use(
  (resp: AxiosResponse) => {
    // 성공 응답은 그대로 data 부분만 반환
    return resp.data
  },
  async (err: AxiosError<ApiErrorResponse>) => {
    console.log('axios response error : ', err)

    // 401 Unauthorized 에러 발생 시 로그인 페이지로 리다이렉트
    if (err.response?.status === 401) {
      // 현재 페이지가 로그인 페이지가 아닐 때만 리다이렉트
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(err)
  }
)

export { api }

export type { ApiResponse }
