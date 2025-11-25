import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/shadcn/resizable";
import RoleDetail from "@/features/admin/authority/components/RoleDetail";
import RoleList from "@/features/admin/authority/components/RoleList";
import { MOCK_AUTHORITIES, MOCK_ROLES } from "@/features/admin/authority/mockData";
import { Role } from "@/features/admin/authority/types";
import { useState } from "react";

const RoleManagementPanel = () => {
  const [roles, setRoles] = useState<Role[]>(MOCK_ROLES);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(MOCK_ROLES[0]?.id || null);

  const selectedRole = roles.find(r => r.id === selectedRoleId);

  const handleAddRole = () => {
    const newRole: Role = {
      id: `role-${Date.now()}`,
      name: "New Role",
      description: "",
      authorityIds: []
    };
    setRoles([...roles, newRole]);
    setSelectedRoleId(newRole.id);
  };

  const handleDeleteRole = (roleId: string) => {
    if (confirm("Are you sure you want to delete this role?")) {
      setRoles(roles.filter(r => r.id !== roleId));
      if (selectedRoleId === roleId) {
        setSelectedRoleId(null);
      }
    }
  };

  const handleUpdateRole = (updatedRole: Role) => {
    setRoles(roles.map(r => r.id === updatedRole.id ? updatedRole : r));
  };

  const handleSave = () => {
    console.log("Saving roles:", roles);
    // API call would go here
    alert("Roles saved successfully!");
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
        {selectedRole ? (
          <RoleDetail 
            role={selectedRole} 
            allAuthorities={MOCK_AUTHORITIES}
            onUpdateRole={handleUpdateRole}
            onSave={handleSave}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Select a role to view details
          </div>
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default RoleManagementPanel;
