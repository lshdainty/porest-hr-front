import { Permission, usePermission } from '@/entities/session';
import React, { Activity } from 'react';

interface PermissionGuardProps {
  requiredPermission: Permission | Permission[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requireAll?: boolean; // true: 모든 권한 필요, false: 하나라도 있으면 됨 (기본값)
}

const PermissionGuard: React.FC<PermissionGuardProps> = ({
  requiredPermission,
  children,
  fallback = null,
  requireAll = false
}) => {
  const { hasAnyPermission, hasAllPermissions, isLoading } = usePermission();

  if (isLoading) {
    return null; // 또는 로딩 스피너
  }

  const permissions = Array.isArray(requiredPermission) ? requiredPermission : [requiredPermission];

  const isAllowed = requireAll
    ? hasAllPermissions(permissions)
    : hasAnyPermission(permissions);

  return (
    <>
      <Activity mode={isAllowed ? 'visible' : 'hidden'}>
        {children}
      </Activity>
      {!isAllowed && fallback}
    </>
  );
};

export default PermissionGuard;
