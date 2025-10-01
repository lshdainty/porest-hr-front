import {
  Home,
  Briefcase,
  HeartHandshake,
  ShieldUser,
  LayoutDashboard,
  CalendarDays,
  CircleDollarSign,
  Scale,
  Users as UserIcon,
  ShieldCheck,
  CalendarCog,
  TreePalm,
  MessageSquarePlus,
  ChartNoAxesCombined,
  Building2,
  NotebookPen,
  ChartGantt,
  Settings,
  UserRoundCog,
  ShieldPlus,
  ChartLine,
  ShieldEllipsis,
} from 'lucide-react';

// 컴포넌트 직접 import
import Dashboard from '@/features/home/dashboard/Dashboard';
import Calendar from '@/features/home/calendar/Calendar';
import History from '@/features/vacation/history/History';
import Application from '@/features/vacation/application/Application';
import Dues from '@/features/culture/dues/Dues';
import Rule from '@/features/culture/rule/Rule';
import Report from '@/features/work/report/Report';
import Schedule from '@/features/work/schedule/Schedule';
import Users from '@/features/admin/users/Users';
import Vacation from '@/features/admin/vacation/Vacation';
import Policy from '@/features/admin/vacation/Policy';
import Authority from '@/features/admin/authority/Authority';
import Holiday from '@/features/admin/holiday/Holiday';
import Company from '@/features/admin/company/Company'

import { TreeDataItem } from '@/components/shadcn/treeView';
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

export const routesConfig: RouteConfig[] = [
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
      },
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
        component: Application,
      },
    ],
  },
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
        component: Report,
        isDefault: true,
      },
      {
        id: 'work-schedule',
        name: 'Schedule',
        path: '/work/schedule',
        icon: ChartGantt,
        component: Schedule,
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
        component: Dues,
        isDefault: true,
      },
      {
        id: 'culture-rule',
        name: 'Rule',
        path: '/culture/rule',
        icon: Scale,
        component: Rule,
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
            component: Users,
            isDefault: true,
          },
          {
            id: 'admin-users-vacation-policy',
            name: 'Vacation Policy',
            path: '/admin/users/vacation/policy',
            icon: ShieldPlus,
            component: Users,
          },
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
            component: Authority,
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
];

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

export const routeMapping = createRouteMapping(routesConfig);
export const pathToIdMapping = createPathToIdMapping(routesConfig);
export const treeData = convertToTreeData(routesConfig);
export const breadcrumbMapping = createBreadcrumbMapping(routesConfig);
export const defaultRedirects = createDefaultRedirects(routesConfig);
