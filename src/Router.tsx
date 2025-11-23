import Loading from '@/components/loading/Loading'
import { useUser } from '@/contexts/UserContext'
import { Navigate, Route, Routes } from 'react-router-dom'

import NotFound from '@/components/notFound/NotFound'
import SignUp from '@/features/auth/SignUp'
import Layout from '@/features/layout/layout'
import LoginPage from '@/pages/LoginPage'

// 설정 파일에서 import
import { RouteConfig, flattenRoutes, routesConfig } from '@/config/routes.config'
import React from 'react'

// 라우트 요소들을 재귀적으로 생성하는 함수
const generateRouteElements = (routes: RouteConfig[], parentPath = ''): React.ReactNode[] => {
  const elements: React.ReactNode[] = [];

  routes.forEach(route => {
    const fullPath = route.path.replace(parentPath, '') || route.path;
    const cleanPath = fullPath.startsWith('/') ? fullPath.substring(1) : fullPath;

    if (route.children && route.children.length > 0) {
      const childElements = generateRouteElements(route.children, route.path);
      const defaultChild = route.children.find(child => child.isDefault);

      elements.push(
        <Route key={route.id} path={cleanPath}>
          {childElements}
          {defaultChild && (
            <Route
              key={`${route.id}-redirect`}
              path=""
              element={<Navigate replace to={defaultChild.path.replace(route.path, '').replace('/', '')} />}
            />
          )}
        </Route>
      )
    } else if (route.component) {
      // 직접 컴포넌트 참조 사용
      const Component = route.component
      elements.push(
        <Route
          key={route.id}
          path={cleanPath}
          element={<Component />}
        />
      )
    }
  })

  return elements
}

const Router: React.FC = () => {
  const { isLoading, isAuthenticated } = useUser()

  // 초기 세션 확인 중
  if (isLoading) {
    return <Loading />
  }

  const flattenedRoutes = flattenRoutes(routesConfig)
  const routeElements = generateRouteElements(flattenedRoutes)

  return (
    <Routes>
      {/* 로그인/회원가입 - 이미 인증된 경우 대시보드로 리다이렉트 */}
      <Route
        path='/login'
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage/>}
      />
      <Route
        path='/signup'
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <SignUp/>}
      />

      {/* 보호된 라우트 - 인증 안된 경우 로그인으로 리다이렉트 */}
      <Route element={isAuthenticated ? <Layout/> : <Navigate to="/login" replace />}>
        {routeElements}
      </Route>

      <Route path='/*' element={<NotFound/>} />
    </Routes>
  )
}

export default Router