import { EnvWatermark } from '@/shared/ui/env-watermark/EnvWatermark'
import { Toaster } from '@/shared/ui/shadcn/sonner'
import { ThemeProvider } from '@/shared/ui/shadcn/themeProvider'
import { PermissionProvider } from '@/entities/session'
import { UserProvider } from '@/entities/session'
import { apiClient } from '@/shared/api'
import { QueryProvider } from '@/app/providers'
import { AppRouter } from '@/app/router'
import { BrowserRouter } from 'react-router-dom'
/*
  react19에서 antd 호환성 해결
  https://ant.design/docs/react/v5-for-19
*/
import '@ant-design/v5-patch-for-react-19'

// interceptor 초기화를 위해 api import 유지
void apiClient

export function App() {
  return (
    <ThemeProvider defaultTheme='light' storageKey='vite-ui-theme'>
      <EnvWatermark />
      <Toaster position="top-center" />
      <QueryProvider>
        <BrowserRouter basename='/'>
          <UserProvider>
            <PermissionProvider>
              <AppRouter />
            </PermissionProvider>
          </UserProvider>
        </BrowserRouter>
      </QueryProvider>
    </ThemeProvider>
  )
}
