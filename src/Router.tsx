import { Routes, Route, Navigate } from 'react-router-dom';

import Login from '@/features/login/login';
import Layout from '@/features/layout/layout';
import NotFound from '@/components/notFound/NotFound';

// 설정 파일에서 import
import { routesConfig, RouteConfig } from '@/config/routes.config';
import React from 'react';

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
      );
    } else if (route.component) {
      // 직접 컴포넌트 참조 사용
      const Component = route.component;
      elements.push(
        <Route
          key={route.id}
          path={cleanPath}
          element={<Component />}
        />
      );
    }
  });

  return elements;
};

const Router: React.FC = () => {
  const routeElements = generateRouteElements(routesConfig);

  return (
    <Routes>
      <Route path='/login' element={<Login/>} />
      <Route element={<Layout/>}>
        {routeElements}
      </Route>
      <Route path='/*' element={<NotFound/>} />
    </Routes>
  );
}

export default Router;