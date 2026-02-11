import { useLoginCheckQuery } from '@/entities/session/api/sessionQueries'
import type { GetLoginCheck } from '@/entities/session/model/types'
import { sessionApi } from '@/entities/session/api/sessionApi'
import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

// 로그인 체크를 건너뛸 경로
const AUTH_PATHS = ['/login', '/logout', '/signup', '/auth/callback']

// Context 타입 정의
interface UserContextType {
  loginUser: GetLoginCheck | null
  isLoading: boolean
  isAuthenticated: boolean
  setLoginUser: (user: GetLoginCheck | null) => void
  clearLoginUser: () => void
  refreshUser: () => Promise<void>
  logout: () => void
}

// Context 생성 (초기값 undefined)
const UserContext = createContext<UserContextType | undefined>(undefined)

// Provider Props
interface UserProviderProps {
  children: ReactNode
}

// UserProvider 컴포넌트
export function UserProvider({ children }: UserProviderProps) {
  const [loginUser, setLoginUserState] = useState<GetLoginCheck | null>(null)
  const location = useLocation()

  // 현재 경로가 인증 페이지인지 확인
  const isAuthPage = AUTH_PATHS.includes(location.pathname)

  // 인증 페이지가 아닐 때 로그인 체크 쿼리 실행 (HttpOnly 쿠키 기반)
  const shouldCheckLogin = !isAuthPage
  const { data, isLoading, refetch } = useLoginCheckQuery(shouldCheckLogin)

  // 세션 데이터가 변경되면 상태 업데이트
  useEffect(() => {
    if (data) {
      setLoginUserState(data)
    } else if (!isLoading && shouldCheckLogin) {
      // 로딩이 끝났는데 데이터가 없으면 null로 설정
      setLoginUserState(null)
    }
  }, [data, isLoading, shouldCheckLogin])

  // 로그인 유저 설정 함수
  const setLoginUser = (user: GetLoginCheck | null) => {
    setLoginUserState(user)
  }

  // 로그인 유저 초기화 함수
  const clearLoginUser = () => {
    setLoginUserState(null)
  }

  // 로그아웃 함수 (HttpOnly 쿠키 삭제)
  const logout = async () => {
    try {
      await sessionApi.logout()
    } catch (e) {
      // 로그아웃 실패해도 로그인 페이지로 이동
    }
    setLoginUserState(null)
    window.location.href = '/login'
  }

  // 유저 정보 새로고침 (프로필 수정 후 등)
  const refreshUser = async () => {
    try {
      const result = await refetch()
      if (result.data) {
        setLoginUserState(result.data)
      } else {
        setLoginUserState(null)
      }
    } catch (error) {
      setLoginUserState(null)
    }
  }

  const value: UserContextType = {
    loginUser,
    isLoading: shouldCheckLogin ? isLoading : false,
    isAuthenticated: !!loginUser && loginUser.is_login === 'Y',
    setLoginUser,
    clearLoginUser,
    refreshUser,
    logout,
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

// Custom Hook - Context 사용을 위한 Hook
export function useUser() {
  const context = useContext(UserContext)

  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }

  return context
}
