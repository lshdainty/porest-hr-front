import { toast } from '@/components/shadcn/sonner'
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

/**
 * 쿠키에서 특정 이름의 값을 읽어오는 유틸리티 함수
 * @param name - 쿠키 이름
 * @returns 쿠키 값 또는 null
 */
function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null
  }
  return null
}

// interface CustomHeaders {
//   [key: string]: any
// }

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
    // const headers = config.headers as CustomHeaders

    // oAuth2 API는 /api/v1 없이 호출
    if (config.url.includes('/oauth2')) {
      config.baseURL = import.meta.env.VITE_BASE_URL
    }

    // CSRF 토큰을 쿠키에서 읽어서 헤더에 추가 (Double Submit Cookie 패턴)
    // Spring Security는 'XSRF-TOKEN' 쿠키를 생성하고, 'X-XSRF-TOKEN' 헤더를 검증합니다.
    const csrfToken = getCookie('XSRF-TOKEN')
    if (csrfToken) {
      config.headers['X-XSRF-TOKEN'] = csrfToken
    }

    // i18n 언어 설정을 Accept-Language 헤더로 전달 (서버 다국어 지원)
    const language = localStorage.getItem('i18nextLng')
    if (language) {
      config.headers['Accept-Language'] = language
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

    const message = err.response?.data?.message || err.message || 'An unknown error occurred.'
    toast.error(message)

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
