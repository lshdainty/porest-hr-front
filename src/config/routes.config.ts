import {
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
} from 'lucide-react';

// 컴포넌트 직접 import
import { TreeDataItem } from '@/components/shadcn/treeView';

import ApplicationPage from '@/pages/ApplicationPage';
import AuthorityPage from '@/pages/AuthorityPage';
import CalendarPage from '@/pages/CalendarPage';
import CompanyPage from '@/pages/CompanyPage';
import DashboardPage from '@/pages/DashboardPage';
import DuesPage from '@/pages/DuesPage';
import HistoryPage from '@/pages/HistoryPage';
import HolidayPage from '@/pages/HolidayPage';
import PolicyPage from '@/pages/PolicyPage';
import ReportPage from '@/pages/ReportPage';
import RulePage from '@/pages/RulePage';
import SchedulePage from '@/pages/SchedulePage';
import TodoPage from '@/pages/TodoPage';
import UsersDepartmentPage from '@/pages/UsersDepartmentPage';
import UsersManagementPage from '@/pages/UsersManagementPage';
import VacationPage from '@/pages/VacationPage';

import React from 'react';

export interface RouteConfig {
  id: string;
  name: string;
  path: string;
  icon?: any;
  children?: RouteConfig[];
  component?: React.ComponentType; // 문자열 대신 실제 컴포넌트
  isDefault?: boolean;
  hideInSidebar?: boolean; // 사이드바에 표시하지 않을 라우트
  requiredPermissions?: string[]; // 접근에 필요한 권한 목록
}

export interface RouteGroup {
  label: string;
  routes: RouteConfig[];
}

export const routesConfig: RouteGroup[] = [
  {
    label: 'SKC',
    routes: [
      {
        id: 'home',
        name: 'Home',
        path: '/',
        icon: Home,
        children: [
          {
            id: 'dashboard',
            name: 'Dashboard',
            path: '/dashboard',
            icon: LayoutDashboard,
            component: DashboardPage, // 직접 컴포넌트 참조
            isDefault: true,
          },
          {
            id: 'calendar',
            name: 'Calendar',
            path: '/calendar',
            icon: CalendarDays,
            component: CalendarPage,
          }
        ],
      },
      {
        id: 'vacation',
        name: 'Vacation',
        path: '/vacation',
        icon: TreePalm,
        children: [
          {
            id: 'vacation-history',
            name: 'History',
            path: '/vacation/history',
            icon: ChartNoAxesCombined,
            component: HistoryPage,
            isDefault: true,
            requiredPermissions: ['VACATION:READ'],
          },
          {
            id: 'vacation-application',
            name: 'Application',
            path: '/vacation/application',
            icon: MessageSquarePlus,
            component: ApplicationPage,
            requiredPermissions: ['VACATION:REQUEST'],
          },
        ],
      },
      {
        id: 'work',
        name: 'Work',
        path: '/work',
        icon: Briefcase,
        requiredPermissions: ['WORK:READ'],
        children: [
          {
            id: 'work-report',
            name: 'Report',
            path: '/work/report',
            icon: NotebookPen,
            component: ReportPage,
            isDefault: true,
          },
          {
            id: 'work-schedule',
            name: 'Schedule',
            path: '/work/schedule',
            icon: ChartGantt,
            component: SchedulePage,
          },
        ],
      },
      {
        id: 'culture',
        name: 'Culture',
        path: '/culture',
        icon: HeartHandshake,
        children: [
          {
            id: 'culture-dues',
            name: 'Dues',
            path: '/culture/dues',
            icon: CircleDollarSign,
            component: DuesPage,
            isDefault: true,
            requiredPermissions: ['DUES:READ'],
          },
          {
            id: 'culture-regulation',
            name: 'Regulation',
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
    label: 'Admin',
    routes: [
      {
        id: 'admin',
        name: 'Admin',
        path: '/admin',
        icon: ShieldUser,
        children: [
          {
            id: 'admin-company',
            name: 'Company',
            path: '/admin/company',
            icon: Building2,
            component: CompanyPage,
            isDefault: true,
            requiredPermissions: ['COMPANY:MANAGE'],
          },
          {
            id: 'admin-users',
            name: 'Users',
            path: '/admin/users',
            icon: UserIcon,
            isDefault: true,
            requiredPermissions: ['USER:MANAGE'],
            children: [
              {
                id: 'admin-users-management',
                name: 'Invite & Management',
                path: '/admin/users/management',
                icon: UserRoundCog,
                component: UsersManagementPage,
                isDefault: true,
              },
              {
                id: 'users-department',
                name: 'Department',
                path: '/admin/users/department',
                icon: Network,
                component: UsersDepartmentPage,
                isDefault: true,
              }
            ],
          },
          {
            id: 'admin-vacation',
            name: 'Vacation',
            path: '/admin/vacation',
            icon: TreePalm,
            requiredPermissions: ['VACATION:APPROVE'],
            children: [
              {
                id: 'admin-vacation-approval',
                name: 'Approval & Grant',
                path: '/admin/vacation/approval',
                icon: ChartLine,
                component: VacationPage,
                requiredPermissions: ['VACATION:APPROVE'],
                isDefault: true,
              },
              {
                id: 'admin-vacation-policy',
                name: 'Policy',
                path: '/admin/vacation/policy',
                icon: ShieldEllipsis,
                requiredPermissions: ['VACATION:MANAGE'],
                component: PolicyPage,
              },
            ],
          },
          {
            id: 'admin-authority',
            name: 'Role & Authority',
            path: '/admin/authority',
            icon: ShieldCheck,
            requiredPermissions: ['ROLE:MANAGE'],
            isDefault: true,
            component: AuthorityPage
          },
          {
            id: 'admin-holiday',
            name: 'Holiday',
            path: '/admin/holiday',
            icon: CalendarCog,
            component: HolidayPage,
            isDefault: true,
            requiredPermissions: ['HOLIDAY:MANAGE'],
          },
        ],
      }
    ]
  },
  {
    label: 'Demo',
    routes: [
      {
        id: 'todo',
        name: 'Todo (Feature Arch)',
        path: '/todo',
        icon: ListTodo,
        component: TodoPage,
      }
    ]
  }
];

// 모든 그룹의 routes를 하나의 배열로 합치는 헬퍼 함수
export const flattenRoutes = (groups: RouteGroup[]): RouteConfig[] => {
  return groups.flatMap(group => group.routes);
};

export const createRouteMapping = (routes: RouteConfig[]): Record<string, string> => {
  const mapping: Record<string, string> = {};
  
  const traverse = (routeList: RouteConfig[]) => {
    routeList.forEach(route => {
      if (route.path && !route.children) {
        mapping[route.id] = route.path;
      }
      if (route.children) {
        traverse(route.children);
      }
    });
  };
  
  traverse(routes);
  return mapping;
};

export const createPathToIdMapping = (routes: RouteConfig[]): Record<string, string> => {
  const mapping: Record<string, string> = {};
  
  const traverse = (routeList: RouteConfig[]) => {
    routeList.forEach(route => {
      if (route.path && !route.children) {
        mapping[route.path] = route.id;
      }
      if (route.children) {
        traverse(route.children);
      }
    });
  };
  
  traverse(routes);
  return mapping;
};

export const convertToTreeData = (routes: RouteConfig[]): TreeDataItem[] => {
  return routes
    .filter(route => !route.hideInSidebar)
    .map(route => ({
      id: route.id,
      name: route.name,
      icon: route.icon,
      children: route.children ? convertToTreeData(route.children) : undefined,
    }));
};

export const createBreadcrumbMapping = (routes: RouteConfig[]): Record<string, string> => {
  const mapping: Record<string, string> = {};
  
  const traverse = (routeList: RouteConfig[]) => {
    routeList.forEach(route => {
      const pathSegments = route.path.split('/').filter(Boolean);
      const lastSegment = pathSegments[pathSegments.length - 1];
      if (lastSegment) {
        mapping[lastSegment] = route.name;
      }
      
      if (route.children) {
        traverse(route.children);
      }
    });
  };
  
  traverse(routes);
  return mapping;
};

export const createDefaultRedirects = (routes: RouteConfig[]): Record<string, string> => {
  const redirects: Record<string, string> = {};
  
  const traverse = (routeList: RouteConfig[]) => {
    routeList.forEach(route => {
      if (route.children) {
        const defaultChild = route.children.find(child => child.isDefault);
        if (defaultChild) {
          redirects[route.path] = defaultChild.path;
        }
        traverse(route.children);
      }
    });
  };
  
  traverse(routes);
  return redirects;
};

// 그룹 정보를 포함하여 TreeData로 변환하는 함수
export const convertGroupsToTreeData = (groups: RouteGroup[]): Array<{ label: string; treeData: TreeDataItem[] }> => {
  return groups.map(group => ({
    label: group.label,
    treeData: convertToTreeData(group.routes),
  }));
};

// 기존 함수들은 flattenRoutes를 사용하여 호환성 유지
const flattenedRoutes = flattenRoutes(routesConfig);

export const routeMapping = createRouteMapping(flattenedRoutes);
export const pathToIdMapping = createPathToIdMapping(flattenedRoutes);
export const treeData = convertToTreeData(flattenedRoutes);
export const breadcrumbMapping = createBreadcrumbMapping(flattenedRoutes);
export const defaultRedirects = createDefaultRedirects(flattenedRoutes);

// 그룹별 트리 데이터 export (새로운 방식)
export const groupedTreeData = convertGroupsToTreeData(routesConfig);
