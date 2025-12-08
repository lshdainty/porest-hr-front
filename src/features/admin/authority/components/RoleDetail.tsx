import { RequirePermission } from "@/components/auth/RequirePermission";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";
import { Textarea } from "@/components/shadcn/textarea";
import { usePermission } from "@/contexts/PermissionContext";
import { MobilePermissionDrawer } from "@/features/admin/authority/components/MobilePermissionDrawer";
import { PermissionMatrix } from "@/features/admin/authority/components/PermissionMatrix";
import { Authority, Role } from "@/features/admin/authority/types";
import { useIsMobile } from "@/hooks/useMobile";
import { ArrowLeft, Save } from "lucide-react";
import { useTranslation } from "react-i18next";

interface RoleDetailProps {
  role: Role;
  allAuthorities: Authority[];
  onUpdateRole: (updatedRole: Role) => void;
  onSave: (role?: Role) => void;
  onBack?: () => void;
}

const RoleDetail = ({ role, allAuthorities, onUpdateRole, onSave, onBack }: RoleDetailProps) => {
  const { t } = useTranslation('admin');
  const { hasPermission } = usePermission();
  const canManageRoles = hasPermission("ROLE:MANAGE");
  const isMobile = useIsMobile();

  // 새 역할인지 확인
  const isNewRole = (role as any).isNew;

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateRole({ ...role, role_code: e.target.value });
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateRole({ ...role, role_name: e.target.value });
  };

  const handleDescChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdateRole({ ...role, desc: e.target.value });
  };

  const handleToggleAuthority = (authCode: string, checked: boolean) => {
    const currentPermissions = role.permissions || [];
    let newPermissions = [...currentPermissions];

    if (checked) {
        const authToAdd = allAuthorities.find(a => a.code === authCode);
        if (authToAdd && !newPermissions.some(p => p.code === authCode)) {
            newPermissions.push(authToAdd);
        }
    } else {
        newPermissions = newPermissions.filter(p => p.code !== authCode);
    }

    onUpdateRole({ ...role, permissions: newPermissions });
  };

  const handleToggleGroup = (authCodes: string[], checked: boolean) => {
    const currentPermissions = role.permissions || [];
    let newPermissions = [...currentPermissions];

    if (checked) {
      // Add all codes that are not already present
      const authsToAdd = allAuthorities.filter(a => authCodes.includes(a.code));
      authsToAdd.forEach(auth => {
        if (!newPermissions.some(p => p.code === auth.code)) {
          newPermissions.push(auth);
        }
      });
    } else {
      // Remove all codes
      newPermissions = newPermissions.filter(p => !authCodes.includes(p.code));
    }

    onUpdateRole({ ...role, permissions: newPermissions });
  };

  const handleMobileSave = async (newPermissionCodes: string[]) => {
    // Map codes back to Authority objects
    const newPermissions = allAuthorities.filter(a => newPermissionCodes.includes(a.code));
    
    const updatedRole = { ...role, permissions: newPermissions };
    
    // Update local state
    onUpdateRole(updatedRole);
    
    // Save to server
    await onSave(updatedRole);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 md:p-6 border-b bg-background sticky top-0 z-20">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-2">
            {onBack && (
              <Button variant="outline" size="icon" onClick={onBack} className="mr-2 md:hidden shrink-0">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <div>
              <h2 className="text-2xl font-bold tracking-tight">{t('authority.roleDetail')}</h2>
              {!isMobile && (
                <p className="text-muted-foreground">{t('authority.roleDetailDesc')}</p>
              )}
            </div>
          </div>
          <RequirePermission permission="ROLE:MANAGE">
            <Button onClick={() => onSave()} className="gap-2">
              <Save className="w-4 h-4" />
              {t('authority.saveChanges')}
            </Button>
          </RequirePermission>
        </div>

        <div className="grid gap-4 max-w-2xl">
          <div className="grid gap-2">
            <Label htmlFor="role-code">{t('authority.roleCode')}</Label>
            <Input
              id="role-code"
              value={role.role_code}
              onChange={handleCodeChange}
              placeholder={t('authority.roleCodePlaceholder')}
              disabled={!isNewRole}
              className={!isNewRole ? "bg-muted" : ""}
            />
            {!isNewRole && (
              <p className="text-xs text-muted-foreground">{t('authority.roleCodeDisabledHint')}</p>
            )}
            {isNewRole && (
              <p className="text-xs text-muted-foreground">{t('authority.roleCodeHint')}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="role-name">{t('authority.roleName')}</Label>
            <Input
              id="role-name"
              value={role.role_name}
              onChange={handleNameChange}
              placeholder={t('authority.roleNamePlaceholder')}
              disabled={!canManageRoles}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="role-desc">{t('authority.roleDesc')}</Label>
            <Textarea
              id="role-desc"
              value={role.desc}
              onChange={handleDescChange}
              placeholder={t('authority.roleDescPlaceholder')}
              className="resize-none"
              disabled={!canManageRoles}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-muted/10 pb-20">
        <h3 className="text-lg font-semibold mb-4">{t('authority.permissions')}</h3>
        {isMobile ? (
          <MobilePermissionDrawer
            authorities={allAuthorities}
            selectedAuthorityIds={(role.permissions || []).filter(p => p && p.code).map(p => p.code)}
            onSave={handleMobileSave}
            disabled={!canManageRoles}
          />
        ) : (
          <PermissionMatrix
            authorities={allAuthorities}
            selectedAuthorityIds={(role.permissions || []).filter(p => p && p.code).map(p => p.code)}
            onToggleAuthority={handleToggleAuthority}
            onToggleGroup={handleToggleGroup}
            disabled={!canManageRoles}
          />
        )}
      </div>
    </div>
  );
};

export { RoleDetail };
