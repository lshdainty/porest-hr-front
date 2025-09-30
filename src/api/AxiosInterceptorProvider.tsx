import { useEffect, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '@/api/index'
import { toast } from '@/components/alert/toast'
import { useAuthStore } from '@/store/AuthStore'
import type { AxiosError, AxiosResponse } from 'axios'

interface CustomHeaders {
  [key: string]: any
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

interface AxiosInterceptorProviderProps {
  children: ReactNode
}

export const AxiosInterceptorProvider = ({ children }: AxiosInterceptorProviderProps) => {
  const navigate = useNavigate()
  const logout = useAuthStore((state) => state.actions.logout)

  useEffect(() => {
    // Request interceptor
    const requestInterceptor = api.interceptors.request.use(
      (config: any) => {
        const headers = config.headers as CustomHeaders

        // login, logout API는 /api/v1 없이 호출
        if (config.url === '/login' || config.url === '/logout') {
          config.baseURL = import.meta.env.VITE_BASE_URL
        }

        // 세션 쿠키는 withCredentials로 자동 포함됨
        return config
      },
      (err: AxiosError) => {
        console.log('Request Error: ', err)
        return Promise.reject(err)
      }
    )

    // Response interceptor
    const responseInterceptor = api.interceptors.response.use(
      (resp: AxiosResponse) => {
        // 성공 응답은 그대로 data 부분만 반환
        return resp.data
      },
      async (err: AxiosError<ApiErrorResponse>) => {
        console.log('API Error : ', err)

        // 네트워크 에러나 요청 자체가 실패한 경우
        if (!err.response) {
          // 로그인 관련 API가 아닌 경우, 세션 만료로 간주하여 로그인으로 리다이렉트
          if (err.config?.url !== '/login' && err.config?.url !== '/logout') {
            logout()

            if (window.location.pathname !== '/login' && !window.location.pathname.includes('/login')) {
              toast.error('서버 연결이 끊어졌습니다. 다시 로그인해주세요.')
              navigate('/login')
              return Promise.reject(new Error('서버 연결이 끊어졌습니다.'))
            }
          }

          toast.error('네트워크 오류가 발생했습니다.')
          return Promise.reject(new Error('네트워크 오류가 발생했습니다.'))
        }

        const { status, data } = err.response

        // 401, 403 에러 처리 (세션 만료 또는 인증 실패)
        if (status === 401 || status === 403) {
          // 로그인 API는 별도 처리하므로 제외
          if (err.config?.url === '/login') {
            // 로그인 API의 경우 서버 메시지를 그대로 전달
            const errorMessage = data?.message || '로그인에 실패했습니다.'
            return Promise.reject(new Error(errorMessage))
          }

          // AuthStore에서 로그아웃 처리 (로그인 API가 아닌 경우)
          logout()

          // 현재 페이지가 로그인 페이지가 아닌 경우에만 리다이렉트
          if (window.location.pathname !== '/login' && !window.location.pathname.includes('/login')) {
            navigate('/login')
          }

          toast.error('세션이 만료되었습니다. 다시 로그인해주세요.')
          return Promise.reject(new Error('세션이 만료되었습니다.'))
        }

        // 기타 HTTP 에러 처리
        if (status >= 400) {
          // Java에서 온 에러 응답 구조에 따라 메시지 추출
          const errorMessage = data?.data?.message || data?.message || '서버 오류가 발생했습니다.'
          toast.error(errorMessage)
          return Promise.reject(new Error(errorMessage))
        }

        // 기본 에러 처리
        const errorMessage = err.message || '알 수 없는 오류가 발생했습니다.'
        toast.error(errorMessage)
        return Promise.reject(new Error(errorMessage))
      }
    )

    // Cleanup: 컴포넌트 언마운트 시 interceptor 제거
    return () => {
      api.interceptors.request.eject(requestInterceptor)
      api.interceptors.response.eject(responseInterceptor)
    }
  }, [navigate, logout])

  return <>{children}</>
}