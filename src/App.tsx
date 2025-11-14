import { CustomQueryClientProviders } from '@/ClientProviders'
import { Toaster } from '@/components/alert/toast'
import { AxiosInterceptorProvider } from '@/components/global/AxiosInterceptorProvider'
import { LoginCheckProvider } from '@/components/global/LoginCheckProvider'
import { ThemeProvider } from '@/components/shadcn/themeProvider'
import Router from '@/Router'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { BrowserRouter } from 'react-router-dom'
/*
  react19에서 antd 호환성 해결
  https://ant.design/docs/react/v5-for-19
*/
import '@ant-design/v5-patch-for-react-19'

const App: React.FC = () => {
  return (
    <ThemeProvider defaultTheme='light' storageKey='vite-ui-theme'>
      <Toaster />
      <CustomQueryClientProviders>
        <BrowserRouter basename='/' future={{v7_startTransition: true, v7_relativeSplatPath: true }}>
          <AxiosInterceptorProvider>
            <LoginCheckProvider>
              <Router />
              <ReactQueryDevtools />
            </LoginCheckProvider>
          </AxiosInterceptorProvider>
        </BrowserRouter>
      </CustomQueryClientProviders>
    </ThemeProvider>
  )
}

export default App