import {
  Bell,
  Briefcase,
  Building2,
  CalendarCog,
  CalendarDays,
  ChartGantt,
  ChartLine,
  ChartNoAxesCombined,
  CircleDollarSign,
  HeartHandshake,
  Home,
  LayoutDashboard,
  ListTodo,
  MessageSquarePlus,
  Network,
  NotebookPen,
  Scale,
  ShieldCheck,
  ShieldEllipsis,
  ShieldUser,
  TreePalm,
  Users as UserIcon,
  UserRoundCog
} from 'lucide-react'

// 컴포넌트 직접 import
import { TreeDataItem } from '@/components/shadcn/treeView'

import ApplicationPage from '@/pages/ApplicationPage'
import AuthorityPage from '@/pages/AuthorityPage'
import { CalendarPage } from '@/pages/CalendarPage'
import CompanyPage from '@/pages/CompanyPage'
import { DashboardPage } from '@/pages/DashboardPage'
import DuesPage from '@/pages/DuesPage'
import { HistoryPage } from '@/pages/HistoryPage'
import HolidayPage from '@/pages/HolidayPage'
import { NoticePage } from '@/pages/NoticePage'
import PolicyPage from '@/pages/PolicyPage'
import UserNoticePage from '@/pages/UserNoticePage'
import { ReportPage } from '@/pages/ReportPage'
import RulePage from '@/pages/RulePage'
import { SchedulePage } from '@/pages/SchedulePage'
import TodoPage from '@/pages/TodoPage'
import UsersDepartmentPage from '@/pages/UsersDepartmentPage'
import UsersManagementPage from '@/pages/UsersManagementPage'
import VacationPage from '@/pages/VacationPage'
import WorkCodePage from '@/pages/WorkCodePage'

import React from 'react'

export interface RouteConfig {
  id: string
  nameKey: string // 다국어 키 (sidebar 네임스페이스 기준)
  path: string
  icon?: React.ComponentType<{ className?: string }>
  children?: RouteConfig[]
  component?: React.ComponentType
  isDefault?: boolean
  hideInSidebar?: boolean
  requiredPermissions?: string[]
}

export interface RouteGroup {
  labelKey: string // 다국어 키
  routes: RouteConfig[]
}

export const routesConfig: RouteGroup[] = [
  {
    labelKey: 'group.skc',
    routes: [
      {
        id: 'home',
        nameKey: 'menu.home',
        path: '/',
        icon: Home,
        children: [
          {
            id: 'dashboard',
            nameKey: 'menu.dashboard',
            path: '/dashboard',
            icon: LayoutDashboard,
            component: DashboardPage,
            isDefault: true,
          },
          {
            id: 'calendar',
            nameKey: 'menu.calendar',
            path: '/calendar',
            icon: CalendarDays,
            component: CalendarPage,
          },
          {
            id: 'notice',
            nameKey: 'menu.notice',
            path: '/notice',
            icon: Bell,
            component: UserNoticePage,
            requiredPermissions: ['NOTICE:READ'],
          }
        ],
      },
      {
        id: 'vacation',
        nameKey: 'menu.vacation',
        path: '/vacation',
        icon: TreePalm,
        children: [
          {
            id: 'vacation-history',
            nameKey: 'menu.vacationHistory',
            path: '/vacation/history',
            icon: ChartNoAxesCombined,
            component: HistoryPage,
            isDefault: true,
            requiredPermissions: ['VACATION:READ'],
          },
          {
            id: 'vacation-application',
            nameKey: 'menu.vacationApplication',
            path: '/vacation/application',
            icon: MessageSquarePlus,
            component: ApplicationPage,
            requiredPermissions: ['VACATION:REQUEST'],
          },
        ],
      },
      {
        id: 'work',
        nameKey: 'menu.work',
        path: '/work',
        icon: Briefcase,
        requiredPermissions: ['WORK:READ'],
        children: [
          {
            id: 'work-report',
            nameKey: 'menu.workReport',
            path: '/work/report',
            icon: NotebookPen,
            component: ReportPage,
            isDefault: true,
          },
          {
            id: 'work-schedule',
            nameKey: 'menu.workSchedule',
            path: '/work/schedule',
            icon: ChartGantt,
            component: SchedulePage,
          },
        ],
      },
      {
        id: 'culture',
        nameKey: 'menu.culture',
        path: '/culture',
        icon: HeartHandshake,
        children: [
          {
            id: 'culture-dues',
            nameKey: 'menu.cultureDues',
            path: '/culture/dues',
            icon: CircleDollarSign,
            component: DuesPage,
            isDefault: true,
            requiredPermissions: ['DUES:READ'],
          },
          {
            id: 'culture-regulation',
            nameKey: 'menu.cultureRegulation',
            path: '/culture/regulation',
            icon: Scale,
            component: RulePage,
            requiredPermissions: ['REGULATION:READ']
          },
        ],
      }
    ],
  },
  {
    labelKey: 'group.admin',
    routes: [
      {
        id: 'admin',
        nameKey: 'menu.admin',
        path: '/admin',
        icon: ShieldUser,
        children: [
          {
            id: 'admin-company',
            nameKey: 'menu.adminCompany',
            path: '/admin/company',
            icon: Building2,
            component: CompanyPage,
            isDefault: true,
            requiredPermissions: ['COMPANY:MANAGE'],
          },
          {
            id: 'admin-users',
            nameKey: 'menu.adminUsers',
            path: '/admin/users',
            icon: UserIcon,
            isDefault: true,
            requiredPermissions: ['USER:MANAGE'],
            children: [
              {
                id: 'admin-users-management',
                nameKey: 'menu.adminUsersManagement',
                path: '/admin/users/management',
                icon: UserRoundCog,
                component: UsersManagementPage,
                isDefault: true,
              },
              {
                id: 'users-department',
                nameKey: 'menu.adminUsersDepartment',
                path: '/admin/users/department',
                icon: Network,
                component: UsersDepartmentPage,
                isDefault: true,
              }
            ],
          },
          {
            id: 'admin-vacation',
            nameKey: 'menu.adminVacation',
            path: '/admin/vacation',
            icon: TreePalm,
            requiredPermissions: ['VACATION:APPROVE'],
            children: [
              {
                id: 'admin-vacation-approval',
                nameKey: 'menu.adminVacationApproval',
                path: '/admin/vacation/approval',
                icon: ChartLine,
                component: VacationPage,
                requiredPermissions: ['VACATION:APPROVE'],
                isDefault: true,
              },
              {
                id: 'admin-vacation-policy',
                nameKey: 'menu.adminVacationPolicy',
                path: '/admin/vacation/policy',
                icon: ShieldEllipsis,
                requiredPermissions: ['VACATION:MANAGE'],
                component: PolicyPage,
              },
            ],
          },
          {
            id: 'admin-authority',
            nameKey: 'menu.adminAuthority',
            path: '/admin/authority',
            icon: ShieldCheck,
            requiredPermissions: ['ROLE:MANAGE'],
            isDefault: true,
            component: AuthorityPage
          },
          {
            id: 'admin-holiday',
            nameKey: 'menu.adminHoliday',
            path: '/admin/holiday',
            icon: CalendarCog,
            component: HolidayPage,
            isDefault: true,
            requiredPermissions: ['HOLIDAY:MANAGE'],
          },
          {
            id: 'admin-work',
            nameKey: 'menu.adminWork',
            path: '/admin/work',
            icon: Briefcase,
            component: WorkCodePage,
            requiredPermissions: ['WORK:MANAGE'],
          },
          {
            id: 'admin-notice',
            nameKey: 'menu.adminNotice',
            path: '/admin/notice',
            icon: Bell,
            component: NoticePage,
            requiredPermissions: ['NOTICE:READ'],
          },
        ],
      }
    ]
  },
  {
    labelKey: 'group.demo',
    routes: [
      {
        id: 'todo',
        nameKey: 'menu.todo',
        path: '/todo',
        icon: ListTodo,
        component: TodoPage,
      }
    ]
  }
]

// 모든 그룹의 routes를 하나의 배열로 합치는 헬퍼 함수
export const flattenRoutes = (groups: RouteGroup[]): RouteConfig[] => {
  return groups.flatMap(group => group.routes)
}

export const createRouteMapping = (routes: RouteConfig[]): Record<string, string> => {
  const mapping: Record<string, string> = {}

  const traverse = (routeList: RouteConfig[]) => {
    routeList.forEach(route => {
      if (route.path && !route.children) {
        mapping[route.id] = route.path
      }
      if (route.children) {
        traverse(route.children)
      }
    })
  }

  traverse(routes)
  return mapping
}

export const createPathToIdMapping = (routes: RouteConfig[]): Record<string, string> => {
  const mapping: Record<string, string> = {}

  const traverse = (routeList: RouteConfig[]) => {
    routeList.forEach(route => {
      if (route.path && !route.children) {
        mapping[route.path] = route.id
      }
      if (route.children) {
        traverse(route.children)
      }
    })
  }

  traverse(routes)
  return mapping
}

// t 함수를 받아서 TreeData로 변환하는 함수
export const convertToTreeData = (
  routes: RouteConfig[],
  t: (key: string) => string
): TreeDataItem[] => {
  return routes
    .filter(route => !route.hideInSidebar)
    .map(route => ({
      id: route.id,
      name: t(route.nameKey),
      icon: route.icon,
      children: route.children ? convertToTreeData(route.children, t) : undefined,
    }))
}

// nameKey를 사용해서 breadcrumb 매핑 생성
export const createBreadcrumbMapping = (
  routes: RouteConfig[],
  t: (key: string) => string
): Record<string, string> => {
  const mapping: Record<string, string> = {}

  const traverse = (routeList: RouteConfig[]) => {
    routeList.forEach(route => {
      const pathSegments = route.path.split('/').filter(Boolean)
      const lastSegment = pathSegments[pathSegments.length - 1]
      if (lastSegment) {
        mapping[lastSegment] = t(route.nameKey)
      }

      if (route.children) {
        traverse(route.children)
      }
    })
  }

  traverse(routes)
  return mapping
}

export const createDefaultRedirects = (routes: RouteConfig[]): Record<string, string> => {
  const redirects: Record<string, string> = {}

  const traverse = (routeList: RouteConfig[]) => {
    routeList.forEach(route => {
      if (route.children) {
        const defaultChild = route.children.find(child => child.isDefault)
        if (defaultChild) {
          redirects[route.path] = defaultChild.path
        }
        traverse(route.children)
      }
    })
  }

  traverse(routes)
  return redirects
}

// 그룹 정보를 포함하여 TreeData로 변환하는 함수
export const convertGroupsToTreeData = (
  groups: RouteGroup[],
  t: (key: string) => string
): Array<{ label: string; treeData: TreeDataItem[] }> => {
  return groups.map(group => ({
    label: t(group.labelKey),
    treeData: convertToTreeData(group.routes, t),
  }))
}

// 기존 함수들은 flattenRoutes를 사용하여 호환성 유지
const flattenedRoutes = flattenRoutes(routesConfig)

export const routeMapping = createRouteMapping(flattenedRoutes)
export const pathToIdMapping = createPathToIdMapping(flattenedRoutes)
export const defaultRedirects = createDefaultRedirects(flattenedRoutes)
