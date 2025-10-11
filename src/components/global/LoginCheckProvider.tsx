import { ReactNode } from 'react'
import { useLoginCheck } from '@/hooks/useLoginCheck'
import Loading from '@/components/loading/Loading'

interface LoginCheckProviderProps {
  children: ReactNode
}

export const LoginCheckProvider = ({ children }: LoginCheckProviderProps) => {
  const { isLoading } = useLoginCheck()
  
  if (isLoading) {
    return <Loading />
  }

  return <>{children}</>
}
