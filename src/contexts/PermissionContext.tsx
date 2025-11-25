import { useUser } from '@/contexts/UserContext';
import { useMyPermissionsQuery } from '@/hooks/queries/usePermissions';
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



export function PermissionProvider({ children }: PermissionProviderProps) {
  const { isLoading: isUserLoading } = useUser();
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { data: permissionsData, isLoading: isPermissionsLoading } = useMyPermissionsQuery();

  useEffect(() => {
    if (permissionsData) {
      setPermissions(permissionsData);
    } else {
      setPermissions([]);
    }
    setIsLoading(false);
  }, [permissionsData]);

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
    isLoading: isLoading || isUserLoading || isPermissionsLoading
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
