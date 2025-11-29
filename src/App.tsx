import { Toaster } from '@/components/shadcn/sonner'
import { ThemeProvider } from '@/components/shadcn/themeProvider'
import { PermissionProvider } from '@/contexts/PermissionContext'
import { UserProvider } from '@/contexts/UserContext'
import '@/lib/api'
import Providers from '@/providers'
import Router from '@/Router'
import { BrowserRouter } from 'react-router-dom'
/*
  react19에서 antd 호환성 해결
  https://ant.design/docs/react/v5-for-19
*/
import '@ant-design/v5-patch-for-react-19'

const App: React.FC = () => {
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