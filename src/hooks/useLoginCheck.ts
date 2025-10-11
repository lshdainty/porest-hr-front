import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useGetLoginCheck } from '@/api/auth'
import { useLoginUserStore } from '@/store/LoginUser'

export function useLoginCheck() {
  const location = useLocation()
  const isAuthPage = location.pathname.includes('/login') || location.pathname.includes('/signup')

  const { data: loginUser, isLoading } = useGetLoginCheck({
    enabled: !isAuthPage
  })
  const { setLoginUser, clearLoginUser } = useLoginUserStore()

  useEffect(() => {
    if (loginUser) {
      setLoginUser(loginUser)
    }
  }, [loginUser])

  return { loginUser, isLoading }
}