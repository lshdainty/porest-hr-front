import { Dialog, DialogContent } from "@/components/shadcn/dialog";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/shadcn/resizable";
import { UserList } from "@/features/admin/authority/components/UserList";
import { UserListSkeleton } from "@/features/admin/authority/components/UserListSkeleton";
import { UserRoleAssignment } from "@/features/admin/authority/components/UserRoleAssignment";
import { UserRoleAssignmentSkeleton } from "@/features/admin/authority/components/UserRoleAssignmentSkeleton";
import { Authority, Role, User } from "@/features/admin/authority/types";
import { usePermissionsQuery } from "@/hooks/queries/usePermissions";
import { useRolesQuery } from "@/hooks/queries/useRoles";
import { usePutUserMutation, useUsersQuery } from "@/hooks/queries/useUsers";
import { useIsMobile } from "@/hooks/useMobile";
import { fetchGetUser } from "@/lib/api/user";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

const UserManagementPanel = () => {
  const { t } = useTranslation('admin');
  const { data: usersData = [], isLoading: isUsersLoading, refetch: refetchUsers } = useUsersQuery();
  const { data: roles = [], isLoading: isRolesLoading } = useRolesQuery();
  const { data: authorities = [], isLoading: isPermissionsLoading } = usePermissionsQuery();
  const { mutateAsync: updateUser } = usePutUserMutation();
  const isMobile = useIsMobile();

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

      // Check window width directly to avoid race condition with useIsMobile hook
      // which defaults to false (desktop) on first render
      const isDesktop = window.innerWidth >= 768;

      if (isDesktop && mappedUsers.length > 0 && !selectedUserId) {
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
        country_code: userDetails.country_code,
        dashboard: userDetails.dashboard
      });
      
      // Refetch users to reflect changes
      await refetchUsers();

      toast.success(t('authority.userRolesUpdated'));
    } catch (error) {
      console.error("Failed to update user roles:", error);
      toast.error(t('authority.userRolesUpdateFailed'));
    }
  };

  if (isMobile) {
    return (
      <div className="h-full bg-background">
        {isLoading ? (
          <UserListSkeleton />
        ) : (
          <UserList
            users={users}
            selectedUserId={selectedUserId}
            onSelectUser={setSelectedUserId}
          />
        )}

        <Dialog
          open={!!selectedUserId}
          onOpenChange={(open) => {
            if (!open) setSelectedUserId(null);
          }}
        >
          <DialogContent className="w-full h-full max-w-none m-0 p-0 rounded-none border-none bg-background [&>button]:hidden">
            {selectedUser && (
              <UserRoleAssignment
                user={selectedUser}
                allRoles={domainRoles}
                onUpdateUserRole={handleUpdateUserRole}
                onBack={() => setSelectedUserId(null)}
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
        {isLoading ? (
          <UserListSkeleton />
        ) : (
          <UserList
            users={users}
            selectedUserId={selectedUserId}
            onSelectUser={setSelectedUserId}
          />
        )}
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={75}>
        {isLoading ? (
          <UserRoleAssignmentSkeleton />
        ) : selectedUser ? (
          <UserRoleAssignment
            user={selectedUser}
            allRoles={domainRoles}
            onUpdateUserRole={handleUpdateUserRole}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            {t('authority.selectUserToManage')}
          </div>
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export { UserManagementPanel };
