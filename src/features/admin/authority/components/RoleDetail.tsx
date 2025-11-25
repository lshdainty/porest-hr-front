import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";
import { Textarea } from "@/components/shadcn/textarea";
import { RequirePermission } from "@/components/auth/RequirePermission";
import { usePermission } from "@/contexts/PermissionContext";
import PermissionMatrix from "@/features/admin/authority/components/PermissionMatrix";
import { Authority, Role } from "@/features/admin/authority/types";
import { Save } from "lucide-react";

interface RoleDetailProps {
  role: Role;
  allAuthorities: Authority[];
  onUpdateRole: (updatedRole: Role) => void;
  onSave: () => void;
}

const RoleDetail = ({ role, allAuthorities, onUpdateRole, onSave }: RoleDetailProps) => {
  const { hasPermission } = usePermission();
  const canManageRoles = hasPermission("ROLE:MANAGE");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateRole({ ...role, role_name: e.target.value });
  };

  const handleDescChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdateRole({ ...role, description: e.target.value });
  };

  const handleToggleAuthority = (authCode: string, checked: boolean) => {
    // This logic needs to be handled by the parent or we need to find the full authority object
    // For now, let's assume the parent handles the API call and we just pass the updated role object
    // But wait, Role has permissions: Authority[], not string[]
    // So we need to find the authority object from allAuthorities

    let newPermissions = [...role.permissions];
    if (checked) {
        const authToAdd = allAuthorities.find(a => a.code === authCode);
        if (authToAdd) {
            newPermissions.push(authToAdd);
        }
    } else {
        newPermissions = newPermissions.filter(p => p.code !== authCode);
    }

    onUpdateRole({ ...role, permissions: newPermissions });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b bg-background sticky top-0 z-10">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Role Details</h2>
            <p className="text-muted-foreground">Manage role information and permissions.</p>
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

      <div className="flex-1 overflow-auto p-6 bg-muted/10">
        <h3 className="text-lg font-semibold mb-4">Permissions</h3>
        <PermissionMatrix
          authorities={allAuthorities}
          selectedAuthorityIds={role.permissions.map(p => p.code)}
          onToggleAuthority={handleToggleAuthority}
          disabled={!canManageRoles}
        />
      </div>
    </div>
  );
};

export default RoleDetail;
