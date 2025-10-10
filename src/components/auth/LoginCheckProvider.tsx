import { ReactNode } from 'react'
import { useLoginCheck } from '@/hooks/useLoginCheck'
import Loading from '@/components/loading/Loading'

interface LoginCheckProviderProps {
  children: ReactNode
}

export const LoginCheckProvider = ({ children }: LoginCheckProviderProps) => {
  const { isLoading, isError } = useLoginCheck()

  console.log('[LoginCheckProvider] isLoading:', isLoading, 'isError:', isError)

  if (isLoading) {
    return <Loading />
  }

  return <>{children}</>
}
