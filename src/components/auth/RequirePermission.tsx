import { usePermission } from '@/contexts/PermissionContext';
import { ReactNode } from 'react';

interface RequirePermissionProps {
  permission: string;
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * 특정 권한이 있을 때만 자식 컴포넌트를 렌더링합니다.
 * @param permission - 필요한 권한 코드 (예: "USER:READ", "ROLE:MANAGE")
 * @param children - 권한이 있을 때 렌더링할 컴포넌트
 * @param fallback - 권한이 없을 때 표시할 컴포넌트 (선택사항)
 */
export function RequirePermission({ permission, children, fallback = null }: RequirePermissionProps) {
  const { hasPermission, isLoading } = usePermission();

  if (isLoading) {
    return null;
  }

  if (!hasPermission(permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

interface RequireAnyPermissionProps {
  permissions: string[];
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * 여러 권한 중 하나라도 있으면 자식 컴포넌트를 렌더링합니다.
 * @param permissions - 필요한 권한 코드 배열 (예: ["USER:READ", "USER:EDIT"])
 * @param children - 권한이 있을 때 렌더링할 컴포넌트
 * @param fallback - 권한이 없을 때 표시할 컴포넌트 (선택사항)
 */
export function RequireAnyPermission({ permissions, children, fallback = null }: RequireAnyPermissionProps) {
  const { hasAnyPermission, isLoading } = usePermission();

  if (isLoading) {
    return null;
  }

  if (!hasAnyPermission(permissions)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

interface RequireAllPermissionsProps {
  permissions: string[];
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * 모든 권한이 있을 때만 자식 컴포넌트를 렌더링합니다.
 * @param permissions - 필요한 권한 코드 배열 (예: ["USER:READ", "USER:EDIT"])
 * @param children - 권한이 있을 때 렌더링할 컴포넌트
 * @param fallback - 권한이 없을 때 표시할 컴포넌트 (선택사항)
 */
export function RequireAllPermissions({ permissions, children, fallback = null }: RequireAllPermissionsProps) {
  const { hasAllPermissions, isLoading } = usePermission();

  if (isLoading) {
    return null;
  }

  if (!hasAllPermissions(permissions)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
