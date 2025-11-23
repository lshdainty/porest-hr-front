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
  IdCardLanyard,
  LayoutDashboard,
  ListTodo,
  MessageSquarePlus,
  NotebookPen,
  Scale,
  Settings,
  ShieldCheck,
  ShieldEllipsis,
  ShieldUser,
  TreePalm,
  Users as UserIcon,
  UserRoundCog
} from 'lucide-react';

// 컴포넌트 직접 import
import { TreeDataItem } from '@/components/shadcn/treeView';
import Authority from '@/features/admin/authority/Authority';
import Company from '@/features/admin/company/Company';
import Holiday from '@/features/admin/holiday/Holiday';
import UsersDepartment from '@/features/admin/users/department/Department.tsx';
import UsersManagement from '@/features/admin/users/management/Management.tsx';
import Policy from '@/features/admin/vacation/Policy';
import Vacation from '@/features/admin/vacation/Vacation';
import Calendar from '@/features/home/calendar/Calendar';
import Dashboard from '@/features/home/dashboard/Dashboard';
import History from '@/features/vacation/history/History';
import ApplicationPage from '@/pages/ApplicationPage';
import DuesPage from '@/pages/DuesPage';
import ReportPage from '@/pages/ReportPage';
import RulePage from '@/pages/RulePage';
import SchedulePage from '@/pages/SchedulePage';
import TodoPage from '@/pages/TodoPage';
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
}

export interface RouteGroup {
  label: string;
  routes: RouteConfig[];
}

export const routesConfig: RouteGroup[] = [
  {
    label: 'Platform',
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
            component: Dashboard, // 직접 컴포넌트 참조
            isDefault: true,
          },
          {
            id: 'calendar',
            name: 'Calendar',
            path: '/calendar',
            icon: CalendarDays,
            component: Calendar,
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
            component: History,
            isDefault: true,
          },
          {
            id: 'vacation-application',
            name: 'Application',
            path: '/vacation/application',
            icon: MessageSquarePlus,
            component: ApplicationPage,
          },
        ],
      },
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
            component: Company,
            isDefault: true,
          },
          {
            id: 'admin-users',
            name: 'Users',
            path: '/admin/users',
            icon: UserIcon,
            isDefault: true,
            children: [
              {
                id: 'admin-users-management',
                name: 'Management',
                path: '/admin/users/management',
                icon: UserRoundCog,
                component: UsersManagement,
                isDefault: true,
              },
              {
                id: 'admin-users-department',
                name: 'department',
                path: '/admin/users/department',
                icon: IdCardLanyard,
                component: UsersDepartment,
                isDefault: true,
              }
            ],
          },
          {
            id: 'admin-vacation',
            name: 'Vacation',
            path: '/admin/vacation',
            icon: TreePalm,
            children: [
              {
                id: 'admin-vacation-stats',
                name: 'Stats',
                path: '/admin/vacation/stats',
                icon: ChartLine,
                component: Vacation,
                isDefault: true,
              },
              {
                id: 'admin-vacation-policy',
                name: 'Policy',
                path: '/admin/vacation/policy',
                icon: ShieldEllipsis,
                component: Policy,
              },
            ],
          },
          {
            id: 'admin-authority',
            name: 'Authority',
            path: '/admin/authority',
            icon: ShieldCheck,
            children: [
              {
                id: 'admin-authority-mgmt',
                name: 'Management',
                path: '/admin/authority/mgmt',
                icon: Settings,
                component: Authority,
                isDefault: true,
              },
              {
                id: 'admin-authority-dashboard',
                name: 'Dashboard',
                path: '/admin/authority/dashboard',
                icon: LayoutDashboard,
                component: () => {return null},
              },
            ],
          },
          {
            id: 'admin-holiday',
            name: 'Holiday',
            path: '/admin/holiday',
            icon: CalendarCog,
            component: Holiday,
            isDefault: true,
          },
        ],
      },
    ],
  },
  {
    label: 'SKC',
    routes: [
      {
        id: 'work',
        name: 'Work',
        path: '/work',
        icon: Briefcase,
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
          },
          {
            id: 'culture-rule',
            name: 'Rule',
            path: '/culture/rule',
            icon: Scale,
            component: RulePage,
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
