import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from '@/shared/ui/shadcn/sidebar'
import { SidebarContentNav } from '@/widgets/sidebar/ui/SidebarContent'
import { SidebarFooterNav } from '@/widgets/sidebar/ui/SidebarFooter'
import { SidebarHeaderNav } from '@/widgets/sidebar/ui/SidebarHeader'

// 설정 파일에서 import
import {
  convertGroupsToTreeData,
  pathToIdMapping,
  RouteConfig,
  RouteGroup,
  routeMapping,
  routesConfig
} from '@/app/config/routes.config'
import { usePermission } from '@/entities/session'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

// 라우트 필터링 함수
const filterRoute = (route: RouteConfig, hasAnyPermission: (permissions: string[]) => boolean): RouteConfig | null => {
  // 1. 본인 권한 체크
  if (route.requiredPermissions && !hasAnyPermission(route.requiredPermissions)) {
    return null
  }

  // 2. 자식 라우트 체크
  if (route.children) {
    const filteredChildren = route.children
      .map(child => filterRoute(child, hasAnyPermission))
      .filter((child): child is RouteConfig => child !== null)

    // 자식이 있었는데 모두 필터링되었고, 본인이 컴포넌트를 가지지 않는 경우 (단순 폴더) -> 숨김
    if (route.children.length > 0 && filteredChildren.length === 0 && !route.component) {
      return null
    }

    return { ...route, children: filteredChildren }
  }

  return route
}

const filterGroups = (groups: RouteGroup[], hasAnyPermission: (permissions: string[]) => boolean) => {
  return groups.map(group => ({
    ...group,
    routes: group.routes
      .map(route => filterRoute(route, hasAnyPermission))
      .filter((route): route is RouteConfig => route !== null)
  })).filter(group => group.routes.length > 0)
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { hasAnyPermission } = usePermission()
  const { t } = useTranslation('sidebar')

  const filteredGroupedTreeData = useMemo(() => {
    const filteredRoutes = filterGroups(routesConfig, hasAnyPermission)
    return convertGroupsToTreeData(filteredRoutes, t)
  }, [hasAnyPermission, t])

  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader>
        <SidebarHeaderNav />
      </SidebarHeader>
      <SidebarContent>
        <SidebarContentNav
          groups={filteredGroupedTreeData}
          routeMapping={routeMapping}
          pathToIdMapping={pathToIdMapping}
        />
      </SidebarContent>
      <SidebarFooter>
        <SidebarFooterNav />
      </SidebarFooter>
    </Sidebar>
  )
}
