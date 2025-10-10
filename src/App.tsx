import { BrowserRouter } from 'react-router-dom'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ClientProviders } from '@/ClientProviders'
import { ThemeProvider } from '@/components/shadcn/themeProvider'
import { AxiosInterceptorProvider } from '@/api/AxiosInterceptorProvider'
import { LoginCheckProvider } from '@/components/auth/LoginCheckProvider'
import Router from '@/Router'
import { Toaster } from '@/components/alert/toast'
/*
  react19에서 antd 호환성 해결
  https://ant.design/docs/react/v5-for-19
*/
import '@ant-design/v5-patch-for-react-19'

const App: React.FC = () => {
  return (
    <ThemeProvider defaultTheme='light' storageKey='vite-ui-theme'>
      <ClientProviders>
        <BrowserRouter basename='/web' future={{v7_startTransition: true, v7_relativeSplatPath: true }}>
          <AxiosInterceptorProvider>
            <LoginCheckProvider>
              <Router />
              <Toaster />
              <ReactQueryDevtools />
            </LoginCheckProvider>
          </AxiosInterceptorProvider>
        </BrowserRouter>
      </ClientProviders>
    </ThemeProvider>
  )
}

export default App