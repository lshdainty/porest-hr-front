import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/shadcn/resizable";
import PermissionDetail from "@/features/admin/authority/components/PermissionDetail";
import PermissionList from "@/features/admin/authority/components/PermissionList";
import { Authority } from "@/features/admin/authority/types";
import {
    useDeletePermissionMutation,
    usePermissionsQuery,
    usePostPermissionMutation,
    usePutPermissionMutation
} from "@/hooks/queries/usePermissions";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const PermissionManagementPanel = () => {
  const { data: permissions = [], isLoading } = usePermissionsQuery();
  const { mutateAsync: createPermission } = usePostPermissionMutation();
  const { mutateAsync: deletePermission } = useDeletePermissionMutation();
  const { mutateAsync: updatePermissionMutation } = usePutPermissionMutation();

  const [selectedPermissionCode, setSelectedPermissionCode] = useState<string | null>(null);
  const [editingPermission, setEditingPermission] = useState<Authority | null>(null);

  useEffect(() => {
    if (permissions.length > 0 && !selectedPermissionCode) {
      setSelectedPermissionCode(permissions[0].code);
    }
  }, [permissions, selectedPermissionCode]);

  const selectedPermission = permissions.find(p => p.code === selectedPermissionCode);

  useEffect(() => {
    if (selectedPermission) {
      setEditingPermission(selectedPermission);
    } else {
      setEditingPermission(null);
    }
  }, [selectedPermission]);

  const handleAddPermission = async () => {
    const timestamp = Date.now();
    const newCode = `PERM_${timestamp}`;
    
    try {
      await createPermission({
        code: newCode,
        name: "New Permission",
        description: "Newly created permission",
        resourceType: "OTHER",
        actionType: "READ"
      });
      
      setSelectedPermissionCode(newCode);
      toast.success("Permission created successfully");
    } catch (error) {
      console.error("Failed to create permission:", error);
      toast.error("Failed to create permission");
    }
  };

  const handleDeletePermission = async (code: string) => {
    if (confirm("Are you sure you want to delete this permission?")) {
      try {
        await deletePermission(code);
        
        if (selectedPermissionCode === code) {
          const remainingPermissions = permissions.filter(p => p.code !== code);
          setSelectedPermissionCode(remainingPermissions[0]?.code || null);
        }
        toast.success("Permission deleted successfully");
      } catch (error) {
        console.error("Failed to delete permission:", error);
        toast.error("Failed to delete permission");
      }
    }
  };

  const handleUpdatePermission = (updatedPermission: Authority) => {
    setEditingPermission(updatedPermission);
  };

  const handleSave = async () => {
    if (!editingPermission) return;

    try {
      await updatePermissionMutation({
        permissionCode: editingPermission.code,
        data: {
          name: editingPermission.name,
          description: editingPermission.description,
          resourceType: editingPermission.resourceType,
          actionType: editingPermission.actionType
        }
      });

      toast.success("Permission saved successfully");
    } catch (error) {
      console.error("Failed to save permission:", error);
      toast.error("Failed to save permission");
    }
  };

  return (
    <ResizablePanelGroup direction="horizontal" className="h-full rounded-lg border bg-background">
      <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
        <PermissionList 
          permissions={permissions} 
          selectedPermissionCode={selectedPermissionCode} 
          onSelectPermission={setSelectedPermissionCode}
          onAddPermission={handleAddPermission}
          onDeletePermission={handleDeletePermission}
        />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={75}>
        {editingPermission ? (
          <PermissionDetail 
            permission={editingPermission} 
            onUpdatePermission={handleUpdatePermission}
            onSave={handleSave}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            {isLoading ? "Loading..." : "Select a permission to view details"}
          </div>
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default PermissionManagementPanel;
