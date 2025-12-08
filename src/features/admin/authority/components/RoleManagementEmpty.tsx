import { RequirePermission } from "@/components/auth/RequirePermission";
import { Button } from "@/components/shadcn/button";
import { cn } from "@/lib/utils";
import { Plus, Shield } from "lucide-react";
import { useTranslation } from "react-i18next";

interface RoleManagementEmptyProps {
  className?: string;
  onAddRole?: () => void;
}

const RoleManagementEmpty = ({ className, onAddRole }: RoleManagementEmptyProps) => {
  const { t } = useTranslation('admin');

  return (
    <div className={cn("flex flex-col items-center justify-center gap-4 text-center p-8", className)}>
      <div className="rounded-full bg-muted p-4">
        <Shield className="h-8 w-8 text-muted-foreground" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">{t('authority.noRoles')}</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          {t('authority.noRolesDesc')}
        </p>
      </div>
      <RequirePermission permission="ROLE:MANAGE">
        {onAddRole && (
          <Button onClick={onAddRole} className="gap-2">
            <Plus className="h-4 w-4" />
            {t('authority.addRole')}
          </Button>
        )}
      </RequirePermission>
    </div>
  );
};

export { RoleManagementEmpty };
