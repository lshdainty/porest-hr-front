import { Dialog, DialogContent } from "@/components/shadcn/dialog";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/shadcn/resizable";
import RoleDetail from "@/features/admin/authority/components/RoleDetail";
import RoleList from "@/features/admin/authority/components/RoleList";
import { Authority, Role } from "@/features/admin/authority/types";
import { usePermissionsQuery } from "@/hooks/queries/usePermissions";
import {
  useDeleteRoleMutation,
  usePostRoleMutation,
  usePutRoleMutation,
  usePutRolePermissionsMutation,
  useRolesQuery
} from "@/hooks/queries/useRoles";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { useIsMobile } from "@/hooks/useMobile";

const RoleManagementPanel = () => {
  const isMobile = useIsMobile();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { data: roles = [], isLoading: isRolesLoading, refetch: refetchRoles } = useRolesQuery();
  const { data: authorities = [], isLoading: isPermissionsLoading } = usePermissionsQuery();

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
      .map(code => authorities.find(a => a.code === code))
      .filter((a): a is Authority => a !== undefined)
  })), [roles, authorities]);

  // Combine server roles with the temporary role if it exists
  const displayRoles = useMemo(() => {
    const list = [...domainRoles];
    if (editingRole && (editingRole as any).isNew) {
        // Only add if it's not already in the list (though with unique ID it shouldn't be)
        if (!list.find(r => r.role_code === editingRole.role_code)) {
            list.push(editingRole);
        }
    }
    return list;
  }, [domainRoles, editingRole]);

  useEffect(() => {
    if (isMounted && !isMobile && domainRoles.length > 0 && selectedRoleId === null) {
      setSelectedRoleId(domainRoles[0].role_code);
    }
  }, [domainRoles, selectedRoleId, isMobile, isMounted]);

  const selectedRole = useMemo(() => 
    displayRoles.find(r => r.role_code === selectedRoleId),
    [displayRoles, selectedRoleId]
  );

  // Update editingRole whenever selectedRole changes, BUT only if it's an existing role
  // If we selected the temp role, we don't want to overwrite it with "undefined" or re-fetch
  useEffect(() => {
    if (selectedRole) {
      if ((selectedRole as any).isNew) {
        // It's the new role, we might not need to do anything if editingRole is already set
        // But if we clicked it from the list, we want to ensure editingRole matches
        if (editingRole?.role_code !== selectedRole.role_code) {
          setEditingRole(selectedRole);
        }
      } else {
        // Existing role from server (already mapped to Domain Role)
        // Only update if the role code is different to avoid loop if object ref changes but content is same-ish
        // OR if we strictly trust memoization now.
        // Let's check if we really need to update.
        setEditingRole(prev => {
          if (prev?.role_code === selectedRole.role_code) {
            return prev; // Return same object to avoid re-render if code matches
          }
          return selectedRole;
        });
      }
    } else {
      // If nothing selected, clear editing
      setEditingRole(null);
    }
  }, [selectedRole]); // Removed authorities from deps as selectedRole is already mapped

  const isLoading = isRolesLoading || isPermissionsLoading;

  const handleAddRole = () => {
    // 임시 새 역할 객체 생성 (API 호출 없이)
    const tempRole: Role & { isNew?: boolean } = {
      role_code: TEMP_ROLE_CODE,
      role_name: "New Role",
      desc: "",
      permissions: [],
      isNew: true // 새 역할 플래그
    };

    setEditingRole(tempRole);
    setSelectedRoleId(TEMP_ROLE_CODE); 
  };

  const handleDeleteRole = async (roleCode: string) => {
    // Check if it's a server role
    const isServerRole = roles.some(r => r.role_code === roleCode);

    if (!isServerRole) {
      // Just remove the temp role from UI
      const firstRole = roles[0];
      setSelectedRoleId(firstRole ? firstRole.role_code : null);
      setEditingRole(null);
      return;
    }

    if (confirm("Are you sure you want to delete this role?")) {
      try {
        await deleteRole(roleCode);
        
        // Explicitly refetch roles
        await refetchRoles();

        // If the deleted role was selected, select the first available role or null
        if (selectedRoleId === roleCode) {
          const remainingRoles = roles.filter(r => r.role_code !== roleCode);
          setSelectedRoleId(remainingRoles[0]?.role_code || null);
        }
        toast.success("Role deleted successfully");
      } catch (error) {
        console.error("Failed to delete role:", error);
        toast.error("Failed to delete role");
      }
    }
  };

  // This function now updates the local `editingRole` state
  const handleUpdateRole = (updatedRole: Role) => {
    setEditingRole(updatedRole);
    
    // If the role code changed, we must update selectedRoleId to keep it selected
    if (selectedRoleId !== updatedRole.role_code) {
        setSelectedRoleId(updatedRole.role_code);
    }
  };

  const handleSave = async (roleToSave?: Role) => {
    const role = roleToSave || editingRole;
    if (!role) return;

    // 입력 값 검증
    if (!role.role_code || !role.role_name) {
      toast.error("Role code and name are required");
      return;
    }

    // For new roles, ensure code doesn't conflict with existing (besides the temp one)
    if ((role as any).isNew && role.role_code === TEMP_ROLE_CODE) {
      toast.error("Please enter a valid Role Code");
      return;
    }

    try {
      const isNewRole = (role as any).isNew;

      if (isNewRole) {
        // 새 역할 생성
        await createRole({
          role_code: role.role_code,
          role_name: role.role_name,
          desc: role.desc,
          permission_codes: role.permissions.map(p => p.code)
        });

        setSelectedRoleId(role.role_code);
        toast.success("Role created successfully");
      } else {
        // 기존 역할 수정
        // 1. Update Role Info (desc only, based on API definition)
        await updateRoleMutation({
          roleCode: role.role_code,
          data: {
            desc: role.desc
          }
        });

        // 2. Update Permissions
        await updateRolePermissionsMutation({
          roleCode: role.role_code,
          data: {
            permission_codes: role.permissions.map(p => p.code)
          }
        });

        toast.success("Role updated successfully");
      }
      
      // Explicitly refetch roles
      await refetchRoles();
    } catch (error) {
      console.error("Failed to save role:", error);
      toast.error("Failed to save role");
    }
  };

  if (!isMounted) {
    return null;
  }

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
        {editingRole ? ( // Use editingRole for RoleDetail
          <RoleDetail 
            role={editingRole} 
            allAuthorities={authorities}
            onUpdateRole={handleUpdateRole} // This updates the local editingRole state
            onSave={handleSave}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            {isLoading ? "Loading..." : "Select a role to view details"}
          </div>
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default RoleManagementPanel;
