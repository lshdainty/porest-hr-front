import '@/lib/api'
import { Toaster } from '@/components/alert/toast'
import { ThemeProvider } from '@/components/shadcn/themeProvider'
import { UserProvider } from '@/contexts/UserContext'
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
      <Toaster />
      <Providers>
        <BrowserRouter basename='/' future={{v7_startTransition: true, v7_relativeSplatPath: true }}>
          <UserProvider>
            <Router />
          </UserProvider>
        </BrowserRouter>
      </Providers>
    </ThemeProvider>
  )
}

export default App