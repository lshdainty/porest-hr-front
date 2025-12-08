import QueryAsyncBoundary from "@/components/common/QueryAsyncBoundary";
import { Dialog, DialogContent } from "@/components/shadcn/dialog";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/shadcn/resizable";
import { RoleDetail } from "@/features/admin/authority/components/RoleDetail";
import { RoleList } from "@/features/admin/authority/components/RoleList";
import { RoleManagementEmpty } from "@/features/admin/authority/components/RoleManagementEmpty";
import { RoleManagementPanelSkeleton } from "@/features/admin/authority/components/RoleManagementPanelSkeleton";
import { Authority, Role } from "@/features/admin/authority/types";
import { usePermissionsQuery } from "@/hooks/queries/usePermissions";
import {
  useDeleteRoleMutation,
  usePostRoleMutation,
  usePutRoleMutation,
  usePutRolePermissionsMutation,
  useRolesQuery
} from "@/hooks/queries/useRoles";
import { useIsMobile } from "@/hooks/useMobile";
import { PermissionResp } from "@/lib/api/permission";
import { RoleResp } from "@/lib/api/role";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

interface RoleManagementPanelInnerProps {
  roles: RoleResp[];
  authorities: PermissionResp[];
}

const RoleManagementPanelInner = ({ roles, authorities }: RoleManagementPanelInnerProps) => {
  const { t } = useTranslation('admin');
  const isMobile = useIsMobile();

  const { refetch: refetchRoles } = useRolesQuery();
  const { mutateAsync: createRole } = usePostRoleMutation();
  const { mutateAsync: deleteRole } = useDeleteRoleMutation();
  const { mutateAsync: updateRoleMutation } = usePutRoleMutation();
  const { mutateAsync: updateRolePermissionsMutation } = usePutRolePermissionsMutation();

  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  // Temporary role constant
  const TEMP_ROLE_CODE = "NEW_ROLE_TEMP";

  // Map API roles to Domain roles
  const domainRoles: Role[] = useMemo(() => roles.map(r => ({
    ...r,
    permissions: r.permissions
      .map((code: string) => authorities.find((a: PermissionResp) => a.code === code))
      .filter((a): a is Authority => a !== undefined)
  })), [roles, authorities]);

  // Combine server roles with the temporary role if it exists
  const displayRoles = useMemo(() => {
    const list = [...domainRoles];
    if (editingRole && (editingRole as any).isNew) {
      if (!list.find(r => r.role_code === editingRole.role_code)) {
        list.push(editingRole);
      }
    }
    return list;
  }, [domainRoles, editingRole]);

  useEffect(() => {
    if (!isMobile && domainRoles.length > 0 && selectedRoleId === null) {
      setSelectedRoleId(domainRoles[0].role_code);
    }
  }, [domainRoles, selectedRoleId, isMobile]);

  const selectedRole = useMemo(() =>
    displayRoles.find(r => r.role_code === selectedRoleId),
    [displayRoles, selectedRoleId]
  );

  useEffect(() => {
    if (selectedRole) {
      if ((selectedRole as any).isNew) {
        if (editingRole?.role_code !== selectedRole.role_code) {
          setEditingRole(selectedRole);
        }
      } else {
        setEditingRole(prev => {
          if (prev?.role_code === selectedRole.role_code) {
            return prev;
          }
          return selectedRole;
        });
      }
    } else {
      setEditingRole(null);
    }
  }, [selectedRole]);

  const handleAddRole = () => {
    const tempRole: Role & { isNew?: boolean } = {
      role_code: TEMP_ROLE_CODE,
      role_name: t('authority.newRole'),
      desc: "",
      permissions: [],
      isNew: true
    };

    setEditingRole(tempRole);
    setSelectedRoleId(TEMP_ROLE_CODE);
  };

  const handleDeleteRole = async (roleCode: string) => {
    const isServerRole = roles.some(r => r.role_code === roleCode);

    if (!isServerRole) {
      const firstRole = roles[0];
      setSelectedRoleId(firstRole ? firstRole.role_code : null);
      setEditingRole(null);
      return;
    }

    if (confirm(t('authority.confirmDeleteRole'))) {
      try {
        await deleteRole(roleCode);
        await refetchRoles();

        if (selectedRoleId === roleCode) {
          const remainingRoles = roles.filter(r => r.role_code !== roleCode);
          setSelectedRoleId(remainingRoles[0]?.role_code || null);
        }
        toast.success(t('authority.roleDeleted'));
      } catch (error) {
        console.error("Failed to delete role:", error);
        toast.error(t('authority.roleDeleteFailed'));
      }
    }
  };

  const handleUpdateRole = (updatedRole: Role) => {
    setEditingRole(updatedRole);

    if (selectedRoleId !== updatedRole.role_code) {
      setSelectedRoleId(updatedRole.role_code);
    }
  };

  const handleSave = async (roleToSave?: Role) => {
    const role = roleToSave || editingRole;
    if (!role) return;

    if (!role.role_code || !role.role_name) {
      toast.error(t('authority.roleCodeNameRequired'));
      return;
    }

    if ((role as any).isNew && role.role_code === TEMP_ROLE_CODE) {
      toast.error(t('authority.enterValidRoleCode'));
      return;
    }

    try {
      const isNewRole = (role as any).isNew;

      if (isNewRole) {
        await createRole({
          role_code: role.role_code,
          role_name: role.role_name,
          desc: role.desc,
          permission_codes: role.permissions.map(p => p.code)
        });

        setSelectedRoleId(role.role_code);
        toast.success(t('authority.roleCreated'));
      } else {
        await updateRoleMutation({
          roleCode: role.role_code,
          data: {
            desc: role.desc
          }
        });

        await updateRolePermissionsMutation({
          roleCode: role.role_code,
          data: {
            permission_codes: role.permissions.map(p => p.code)
          }
        });

        toast.success(t('authority.roleUpdated'));
      }

      await refetchRoles();
    } catch (error) {
      console.error("Failed to save role:", error);
      toast.error(t('authority.roleSaveFailed'));
    }
  };

  const handleBackToList = () => {
    setSelectedRoleId(null);
    setEditingRole(null);
  };

  if (isMobile) {
    return (
      <div className="h-full bg-background">
        <RoleList
          roles={displayRoles}
          selectedRoleId={selectedRoleId}
          onSelectRole={setSelectedRoleId}
          onAddRole={handleAddRole}
          onDeleteRole={handleDeleteRole}
        />

        <Dialog
          open={!!selectedRoleId && !!editingRole}
          onOpenChange={(open) => {
            if (!open) handleBackToList();
          }}
        >
          <DialogContent className="w-full h-full max-w-none m-0 p-0 rounded-none border-none bg-background [&>button]:hidden">
            {editingRole && (
              <RoleDetail
                role={editingRole}
                allAuthorities={authorities}
                onUpdateRole={handleUpdateRole}
                onSave={handleSave}
                onBack={handleBackToList}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <ResizablePanelGroup direction="horizontal" className="h-full rounded-lg border bg-background">
      <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
        <RoleList
          roles={displayRoles}
          selectedRoleId={selectedRoleId}
          onSelectRole={setSelectedRoleId}
          onAddRole={handleAddRole}
          onDeleteRole={handleDeleteRole}
        />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={75}>
        {editingRole ? (
          <RoleDetail
            role={editingRole}
            allAuthorities={authorities}
            onUpdateRole={handleUpdateRole}
            onSave={handleSave}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            {t('authority.selectRoleToView')}
          </div>
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

const RoleManagementPanel = () => {
  const { data: roles = [], isLoading: isRolesLoading, error: rolesError } = useRolesQuery();
  const { data: authorities = [], isLoading: isPermissionsLoading, error: permissionsError } = usePermissionsQuery();

  const isLoading = isRolesLoading || isPermissionsLoading;
  const error = rolesError || permissionsError;

  return (
    <QueryAsyncBoundary
      queryState={{ isLoading, error, data: roles }}
      loadingComponent={<RoleManagementPanelSkeleton />}
      emptyComponent={<RoleManagementEmpty className="h-full" />}
      isEmpty={(data) => !data || data.length === 0}
    >
      <RoleManagementPanelInner roles={roles} authorities={authorities} />
    </QueryAsyncBoundary>
  );
};

export { RoleManagementPanel };
