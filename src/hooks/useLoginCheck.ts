import { useEffect } from 'react'
import { useGetLoginUserInfo } from '@/api/auth'
import { useLoginUserStore } from '@/store/LoginUser'

export function useLoginCheck() {
  const { data: loginUser, isLoading, isError } = useGetLoginUserInfo()
  const { setLoginUser, clearLoginUser } = useLoginUserStore()

  useEffect(() => {
    if (loginUser) {
      setLoginUser(loginUser)
    }
  }, [loginUser, setLoginUser, clearLoginUser])

  return { loginUser, isLoading, isError }
}