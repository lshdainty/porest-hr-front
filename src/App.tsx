import { Toaster } from '@/components/shadcn/sonner'
import { ThemeProvider } from '@/components/shadcn/themeProvider'
import { PermissionProvider } from '@/contexts/PermissionContext'
import { UserProvider } from '@/contexts/UserContext'
import { api } from '@/lib/api'
import Providers from '@/providers'
import Router from '@/Router'
import { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
/*
  react19에서 antd 호환성 해결
  https://ant.design/docs/react/v5-for-19
*/
import '@ant-design/v5-patch-for-react-19'

const App: React.FC = () => {
  // 앱 시작 시 CSRF 토큰 발급
  useEffect(() => {
    // CSRF 토큰 발급용 API 호출
    // 서버가 응답 헤더(Set-Cookie)로 XSRF-TOKEN 쿠키를 브라우저에 심어줍니다.
    api.get('/csrf-token')
  }, [])

  return (
    <ThemeProvider defaultTheme='light' storageKey='vite-ui-theme'>
      <Toaster position="top-center" />
      <Providers>
        <BrowserRouter basename='/'>
          <UserProvider>
            <PermissionProvider>
              <Router />
            </PermissionProvider>
          </UserProvider>
        </BrowserRouter>
      </Providers>
    </ThemeProvider>
  )
}

export default App