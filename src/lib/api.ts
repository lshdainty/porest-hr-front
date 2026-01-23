import { toast } from '@/components/shadcn/sonner'
import config from '@/config/config'
import axios, { type AxiosError, type AxiosResponse } from 'axios'

const baseURL = config.apiBaseUrl

// JWT 토큰 저장 키
const TOKEN_KEY = 'access_token'

const api = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * JWT 토큰 저장
 * @param token - JWT 토큰
 */
export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

/**
 * JWT 토큰 조회
 * @returns JWT 토큰 또는 null
 */
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

/**
 * JWT 토큰 삭제
 */
export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

/**
 * JWT 토큰 존재 여부 확인
 * @returns 토큰 존재 여부
 */
export function hasToken(): boolean {
  return !!getToken()
}

interface ApiResponse<T = any> {
  success: boolean
  code: string
  message: string
  data: T
}

interface ApiErrorResponse {
  success: boolean
  code: string
  message: string
  data: null
}

api.interceptors.request.use(
  (config: any) => {
    // JWT 토큰을 Authorization 헤더에 추가
    const token = getToken()
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }

    // i18n 언어 설정을 Accept-Language 헤더로 전달 (서버 다국어 지원)
    const language = localStorage.getItem('i18nextLng')
    if (language) {
      config.headers['Accept-Language'] = language
    }

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

    const message = err.response?.data?.message || err.message || 'An unknown error occurred.'
    toast.error(message)

    // 401 Unauthorized 에러 발생 시 토큰 삭제 후 로그인 페이지로 리다이렉트
    if (err.response?.status === 401) {
      removeToken()
      // 현재 페이지가 로그인/콜백 페이지가 아닐 때만 리다이렉트
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/auth/callback')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(err)
  }
)

export { api }

export type { ApiResponse }
