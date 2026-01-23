import PermissionGuard from '@/components/auth/PermissionGuard'
import Loading from '@/components/loading/Loading'
import { useUser } from '@/contexts/UserContext'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'

import Layout from '@/components/layout/layout'
import NotFound from '@/components/notFound/NotFound'
import { AuthCallbackPage } from '@/pages/AuthCallbackPage'
import { LoginPage } from '@/pages/LoginPage'
import { PasswordChangePage } from '@/pages/PasswordChangePage'
import { SignUpPage } from '@/pages/SignUpPage'

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
        <Route
          key={route.id}
          path={cleanPath}
          element={
            route.requiredPermissions ? (
              <PermissionGuard requiredPermission={route.requiredPermissions} fallback={<Navigate to="/" replace />}>
                <Outlet />
              </PermissionGuard>
            ) : undefined
          }
        >
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
          element={
            route.requiredPermissions ? (
              <PermissionGuard requiredPermission={route.requiredPermissions} fallback={<Navigate to="/" replace />}>
                <Component />
              </PermissionGuard>
            ) : (
              <Component />
            )
          }
        />
      )
    }
  })

  return elements
}

const Router: React.FC = () => {
  const { isLoading, isAuthenticated, loginUser } = useUser()

  // 초기 세션 확인 중
  if (isLoading) {
    return <Loading />
  }

  // 비밀번호 변경 필요 여부
  const requiresPasswordChange = loginUser?.password_change_required === 'Y'

  const flattenedRoutes = flattenRoutes(routesConfig)
  const routeElements = generateRouteElements(flattenedRoutes)

  return (
    <Routes>
      {/* 로그인 - 이미 인증된 경우 대시보드로 리다이렉트 */}
      <Route
        path='/login'
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage/>}
      />
      {/* SSO 인증 콜백 */}
      <Route
        path='/auth/callback'
        element={<AuthCallbackPage />}
      />
      {/* 회원가입 - SSO에서 처리하므로 리다이렉트 */}
      <Route
        path='/signup'
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <SignUpPage/>}
      />
      {/* 비밀번호 강제 변경 페이지 */}
      <Route
        path='/password-change'
        element={
          !isAuthenticated ? <Navigate to="/login" replace /> :
          !requiresPasswordChange ? <Navigate to="/dashboard" replace /> :
          <PasswordChangePage />
        }
      />

      {/* 보호된 라우트 - 인증 안된 경우 로그인으로, 비밀번호 변경 필요시 비밀번호 변경 페이지로 리다이렉트 */}
      <Route element={
        !isAuthenticated ? <Navigate to="/login" replace /> :
        requiresPasswordChange ? <Navigate to="/password-change" replace /> :
        <Layout/>
      }>
        {routeElements}
      </Route>

      <Route path='/*' element={<NotFound/>} />
    </Routes>
  )
}

export default Router