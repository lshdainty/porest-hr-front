import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/shadcn/resizable";
import UserList from "@/features/admin/authority/components/UserList";
import UserRoleAssignment from "@/features/admin/authority/components/UserRoleAssignment";
import { Authority, Role, User } from "@/features/admin/authority/types";
import { usePermissionsQuery } from "@/hooks/queries/usePermissions";
import { useRolesQuery } from "@/hooks/queries/useRoles";
import { usePutUserMutation, useUsersQuery } from "@/hooks/queries/useUsers";
import { fetchGetUser } from "@/lib/api/user";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const UserManagementPanel = () => {
  const { data: usersData = [], isLoading: isUsersLoading, refetch: refetchUsers } = useUsersQuery();
  const { data: roles = [], isLoading: isRolesLoading } = useRolesQuery();
  const { data: authorities = [], isLoading: isPermissionsLoading } = usePermissionsQuery();
  const { mutateAsync: updateUser } = usePutUserMutation();

  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // Map API roles to Domain roles
  const domainRoles: Role[] = useMemo(() => roles.map(r => ({
    ...r,
    permissions: r.permissions
      .map(code => authorities.find(a => a.code === code))
      .filter((a): a is Authority => a !== undefined)
  })), [roles, authorities]);

  useEffect(() => {
    if (usersData) {
      const mappedUsers: User[] = usersData.map(u => ({
        id: u.user_id,
        name: u.user_name,
        email: u.user_email,
        role_codes: u.roles?.map(r => r.role_code) || [], 
        department: u.main_department_name_kr || undefined,
        position: u.user_role_name
      }));
      setUsers(mappedUsers);

      if (mappedUsers.length > 0 && !selectedUserId) {
        setSelectedUserId(mappedUsers[0].id);
      }
    }
  }, [usersData, selectedUserId]);

  const selectedUser = users.find(u => u.id === selectedUserId);
  const isLoading = isUsersLoading || isRolesLoading || isPermissionsLoading;

  const handleUpdateUserRole = async (userId: string, roleCodes: string[]) => {
    try {
      // 1. Fetch full user details (still need direct call here as we need fresh data for update)
      const userDetails = await fetchGetUser(userId);
      
      await updateUser({
        user_id: userDetails.user_id,
        user_name: userDetails.user_name,
        user_email: userDetails.user_email,
        user_birth: userDetails.user_birth,
        user_roles: roleCodes,
        user_origin_company_type: userDetails.user_origin_company_type,
        user_work_time: userDetails.user_work_time,
        lunar_yn: userDetails.lunar_yn,
        profile_url: userDetails.profile_url,
        // profile_uuid is optional now
        dashboard: userDetails.dashboard
      });
      
      // Refetch users to reflect changes
      await refetchUsers();

      toast.success("User roles updated successfully");
    } catch (error) {
      console.error("Failed to update user roles:", error);
      toast.error("Failed to update user roles");
    }
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
            allRoles={domainRoles}
            onUpdateUserRole={handleUpdateUserRole}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            {isLoading ? "Loading..." : "Select a user to manage roles"}
          </div>
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default UserManagementPanel;
