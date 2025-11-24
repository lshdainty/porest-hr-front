import { useUser } from '@/contexts/UserContext';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

// 권한 타입 정의
export type Permission = string;

interface PermissionContextType {
  permissions: Permission[];
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  hasAllPermissions: (permissions: Permission[]) => boolean;
  isLoading: boolean;
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

interface PermissionProviderProps {
  children: ReactNode;
}

// Mock Permissions for development
const MOCK_PERMISSIONS: Record<string, Permission[]> = {
  'ADMIN': [
    // User Management
    'user:read', 'user:invite', 'user:update', 'user:delete', 'user:invite:resend', 'user:policy:assign',
    // Vacation Management
    'vacation:read:mine', 'vacation:read:all', 'vacation:request', 'vacation:cancel', 
    'vacation:approval', 'vacation:grant', 'vacation:revoke', 'vacation:policy:manage',
    // Work Management
    'work:read:mine', 'work:read:all', 'work:create', 'work:update', 'work:delete', 'work:import', 'work:export',
    // Company & Basic Info
    'company:manage', 'holiday:manage', 'authority:manage'
  ],
  'USER': [
    // Vacation Management
    'vacation:read:mine', 'vacation:request', 'vacation:cancel',
    // Work Management
    'work:read:mine', 'work:create', 'work:update', 'work:delete'
  ]
};

export function PermissionProvider({ children }: PermissionProviderProps) {
  const { loginUser, isLoading: isUserLoading } = useUser();
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isUserLoading) {
      return;
    }

    if (loginUser) {
      // 1. API에서 권한이 넘어오는 경우 (추후 구현)
      if (loginUser.permissions && loginUser.permissions.length > 0) {
        setPermissions(loginUser.permissions);
      } 
      // 2. 권한이 없으면 Role 기반으로 Mock Data 할당
      else {
        const role = loginUser.user_role || 'USER'; // 기본값 USER
        // user_role이 'ROLE_ADMIN' 형태일 수도 있고 'ADMIN'일 수도 있음. 
        // 프로젝트 컨벤션에 따라 조정 필요. 여기서는 포함 여부로 체크
        const mockPerms = Object.entries(MOCK_PERMISSIONS).find(([key]) => role.includes(key))?.[1] || MOCK_PERMISSIONS['USER'];
        setPermissions(mockPerms);
      }
    } else {
      setPermissions([]);
    }
    setIsLoading(false);
  }, [loginUser, isUserLoading]);

  const hasPermission = (permission: Permission): boolean => {
    return permissions.includes(permission);
  };

  const hasAnyPermission = (requiredPermissions: Permission[]): boolean => {
    return requiredPermissions.some(perm => permissions.includes(perm));
  };

  const hasAllPermissions = (requiredPermissions: Permission[]): boolean => {
    return requiredPermissions.every(perm => permissions.includes(perm));
  };

  const value = {
    permissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isLoading: isLoading || isUserLoading
  };

  return <PermissionContext.Provider value={value}>{children}</PermissionContext.Provider>;
}

export function usePermission() {
  const context = useContext(PermissionContext);
  if (context === undefined) {
    throw new Error('usePermission must be used within a PermissionProvider');
  }
  return context;
}
