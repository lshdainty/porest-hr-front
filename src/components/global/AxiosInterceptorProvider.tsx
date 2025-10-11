import { type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import globalRouter from '@/lib/globalRouter'

interface AxiosInterceptorProviderProps {
  children: ReactNode
}

export const AxiosInterceptorProvider = ({ children }: AxiosInterceptorProviderProps) => {
  const navigate = useNavigate()
  globalRouter.navigate = navigate
  return <>{children}</>
}