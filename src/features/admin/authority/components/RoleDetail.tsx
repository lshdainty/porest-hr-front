import { RequirePermission } from "@/components/auth/RequirePermission";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";
import { Textarea } from "@/components/shadcn/textarea";
import { usePermission } from "@/contexts/PermissionContext";
import PermissionMatrix from "@/features/admin/authority/components/PermissionMatrix";
import { Authority, Role } from "@/features/admin/authority/types";
import { ArrowLeft, Save } from "lucide-react";

interface RoleDetailProps {
  role: Role;
  allAuthorities: Authority[];
  onUpdateRole: (updatedRole: Role) => void;
  onSave: () => void;
  onBack?: () => void;
}

const RoleDetail = ({ role, allAuthorities, onUpdateRole, onSave, onBack }: RoleDetailProps) => {
  const { hasPermission } = usePermission();
  const canManageRoles = hasPermission("ROLE:MANAGE");

  // 새 역할인지 확인
  const isNewRole = (role as any).isNew;

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateRole({ ...role, role_code: e.target.value });
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateRole({ ...role, role_name: e.target.value });
  };

  const handleDescChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdateRole({ ...role, description: e.target.value });
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

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b bg-background sticky top-0 z-20">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-2">
            {onBack && (
              <Button variant="outline" size="icon" onClick={onBack} className="mr-2 md:hidden shrink-0">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Role Details</h2>
              <p className="text-muted-foreground">Manage role information and permissions.</p>
            </div>
          </div>
          <RequirePermission permission="ROLE:MANAGE">
            <Button onClick={onSave} className="gap-2">
              <Save className="w-4 h-4" />
              Save Changes
            </Button>
          </RequirePermission>
        </div>

        <div className="grid gap-4 max-w-2xl">
          <div className="grid gap-2">
            <Label htmlFor="role-code">Role Code</Label>
            <Input
              id="role-code"
              value={role.role_code}
              onChange={handleCodeChange}
              placeholder="e.g. ROLE_HR_MANAGER"
              disabled={!isNewRole}
              className={!isNewRole ? "bg-muted" : ""}
            />
            {!isNewRole && (
              <p className="text-xs text-muted-foreground">Role code cannot be changed after creation.</p>
            )}
            {isNewRole && (
              <p className="text-xs text-muted-foreground">Use uppercase letters, numbers, and underscores (e.g. ROLE_ADMIN).</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="role-name">Role Name</Label>
            <Input
              id="role-name"
              value={role.role_name}
              onChange={handleNameChange}
              placeholder="e.g. HR Manager"
              disabled={!canManageRoles}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="role-desc">Description</Label>
            <Textarea
              id="role-desc"
              value={role.description}
              onChange={handleDescChange}
              placeholder="Describe the role's responsibilities..."
              className="resize-none"
              disabled={!canManageRoles}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 bg-muted/10 pb-20">
        <h3 className="text-lg font-semibold mb-4">Permissions</h3>
        <PermissionMatrix
          authorities={allAuthorities}
          selectedAuthorityIds={(role.permissions || []).filter(p => p && p.code).map(p => p.code)}
          onToggleAuthority={handleToggleAuthority}
          disabled={!canManageRoles}
        />
      </div>
    </div>
  );
};

export default RoleDetail;
