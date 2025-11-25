import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/shadcn/resizable";
import UserList from "@/features/admin/authority/components/UserList";
import UserRoleAssignment from "@/features/admin/authority/components/UserRoleAssignment";
import { MOCK_ROLES, MOCK_USERS } from "@/features/admin/authority/mockData";
import { User } from "@/features/admin/authority/types";
import { useState } from "react";

const UserManagementPanel = () => {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(MOCK_USERS[0]?.id || null);

  const selectedUser = users.find(u => u.id === selectedUserId);

  const handleUpdateUserRoles = (userId: string, roleIds: string[]) => {
    setUsers(users.map(u => u.id === userId ? { ...u, roleIds } : u));
  };

  return (
    <ResizablePanelGroup direction="horizontal" className="h-full rounded-lg border bg-background">
      <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
        <UserList 
          users={users} 
          selectedUserId={selectedUserId} 
          onSelectUser={setSelectedUserId}
        />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={75}>
        {selectedUser ? (
          <UserRoleAssignment 
            user={selectedUser} 
            allRoles={MOCK_ROLES}
            onUpdateUserRoles={handleUpdateUserRoles}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Select a user to manage roles
          </div>
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default UserManagementPanel;
