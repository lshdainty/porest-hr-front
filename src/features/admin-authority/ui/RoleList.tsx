import { RequirePermission } from "@/shared/ui/require-permission/RequirePermission";
import { Button } from "@/shared/ui/shadcn/button";
import { ScrollArea } from "@/shared/ui/shadcn/scrollArea";
import { Role } from "@/features/admin-authority/types";
import { cn } from "@/shared/lib";
import { Plus, Shield, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

interface RoleListProps {
  roles: Role[];
  selectedRoleId: string | null;
  onSelectRole: (roleId: string) => void;
  onAddRole: () => void;
  onDeleteRole: (roleId: string) => void;
}

const RoleList = ({ roles, selectedRoleId, onSelectRole, onAddRole, onDeleteRole }: RoleListProps) => {
  const { t } = useTranslation('admin');

  return (
    <div className="flex flex-col h-full border-r">
      <div className="p-4 border-b flex items-center justify-between bg-muted/30">
        <h3 className="font-semibold flex items-center gap-2">
          <Shield className="w-4 h-4" />
          {t('authority.roles')}
        </h3>
        <RequirePermission permission="ROLE:MANAGE">
          <Button variant="ghost" size="icon" onClick={onAddRole} title={t('authority.addRole')}>
            <Plus className="w-4 h-4" />
          </Button>
        </RequirePermission>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {roles.map((role) => (
            <div
              key={role.role_code}
              className={cn(
                "flex items-center justify-between p-3 rounded-md cursor-pointer transition-colors text-sm",
                selectedRoleId === role.role_code
                  ? "bg-primary/10 text-primary font-medium"
                  : "hover:bg-muted"
              )}
              onClick={() => onSelectRole(role.role_code)}
            >
              <span className="truncate">{role.role_name}</span>
              <RequirePermission permission="ROLE:MANAGE">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteRole(role.role_code);
                  }}
                >
                  <Trash2 className="w-3 h-3 text-destructive" />
                </Button>
              </RequirePermission>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export { RoleList };
