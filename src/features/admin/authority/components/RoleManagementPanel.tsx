import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/shadcn/resizable";
import RoleDetail from "@/features/admin/authority/components/RoleDetail";
import RoleList from "@/features/admin/authority/components/RoleList";
import { Role } from "@/features/admin/authority/types";
import { usePermissionsQuery } from "@/hooks/queries/usePermissions";
import {
    useDeleteRoleMutation,
    usePostRoleMutation,
    usePutRoleMutation,
    usePutRolePermissionsMutation,
    useRolesQuery
} from "@/hooks/queries/useRoles";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const RoleManagementPanel = () => {
  const { data: roles = [], isLoading: isRolesLoading } = useRolesQuery();
  const { data: authorities = [], isLoading: isPermissionsLoading } = usePermissionsQuery();
  
  const { mutateAsync: createRole } = usePostRoleMutation();
  const { mutateAsync: deleteRole } = useDeleteRoleMutation();
  const { mutateAsync: updateRoleMutation } = usePutRoleMutation(); // Renamed to avoid conflict with local state update
  const { mutateAsync: updateRolePermissionsMutation } = usePutRolePermissionsMutation(); // Renamed

  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [editingRole, setEditingRole] = useState<Role | null>(null); // Local state for the role being edited

  useEffect(() => {
    if (roles.length > 0 && !selectedRoleId) {
      setSelectedRoleId(roles[0].role_code);
    }
  }, [roles, selectedRoleId]);

  const selectedRole = roles.find(r => r.role_code === selectedRoleId);

  // Update editingRole whenever selectedRole changes
  useEffect(() => {
    if (selectedRole) {
      setEditingRole(selectedRole);
    } else {
      setEditingRole(null);
    }
  }, [selectedRole]);

  const isLoading = isRolesLoading || isPermissionsLoading;

  const handleAddRole = async () => {
    const timestamp = Date.now();
    const newRoleCode = `ROLE_${timestamp}`;
    const newRoleName = "New Role";
    
    try {
      await createRole({
        role_code: newRoleCode,
        role_name: newRoleName,
        description: "Newly created role"
      });
      
      setSelectedRoleId(newRoleCode);
      toast.success("Role created successfully");
    } catch (error) {
      console.error("Failed to create role:", error);
      toast.error("Failed to create role");
    }
  };

  const handleDeleteRole = async (roleCode: string) => {
    if (confirm("Are you sure you want to delete this role?")) {
      try {
        await deleteRole(roleCode);
        
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
  };

  const handleSave = async () => {
    if (!editingRole) return;

    try {
      // 1. Update Role Info (description only, based on API definition)
      await updateRoleMutation({
        roleCode: editingRole.role_code,
        data: {
          description: editingRole.description
        }
      });

      // 2. Update Permissions
      await updateRolePermissionsMutation({
        roleCode: editingRole.role_code,
        data: {
          permission_codes: editingRole.permissions.map(p => p.code)
        }
      });

      toast.success("Role saved successfully");
      // React Query's invalidation will refetch roles and permissions automatically
    } catch (error) {
      console.error("Failed to save role:", error);
      toast.error("Failed to save role");
    }
  };

  return (
    <ResizablePanelGroup direction="horizontal" className="h-full rounded-lg border bg-background">
      <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
        <RoleList 
          roles={roles} 
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
