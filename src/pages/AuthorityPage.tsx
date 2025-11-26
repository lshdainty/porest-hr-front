import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shadcn/tabs";
import { ProtectedPage } from "@/components/auth/ProtectedPage";
import PermissionManagementPanel from "@/features/admin/authority/components/PermissionManagementPanel";
import RoleManagementPanel from "@/features/admin/authority/components/RoleManagementPanel";
import UserManagementPanel from "@/features/admin/authority/components/UserManagementPanel";
import { Key, Shield, Users } from "lucide-react";

const Authority = () => {
  return (
    <ProtectedPage permission="ROLE:MANAGE">
      <div className="h-full flex flex-col p-4 sm:p-6 md:p-8 gap-6 overflow-hidden">
        <div className="flex items-center gap-2 flex-shrink-0">
          <Shield className="w-8 h-8" />
          <h1 className="text-3xl font-bold">권한 관리</h1>
        </div>

        <Tabs defaultValue="roles" className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="roles" className="flex-1 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Roles
              </TabsTrigger>
              <TabsTrigger value="permissions" className="flex-1 flex items-center gap-2">
                <Key className="w-4 h-4" />
                Permissions
              </TabsTrigger>
              <TabsTrigger value="users" className="flex-1 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Users
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="roles" className="flex-1 mt-0 min-h-0">
            <RoleManagementPanel />
          </TabsContent>

          <TabsContent value="permissions" className="flex-1 mt-0 min-h-0">
            <PermissionManagementPanel />
          </TabsContent>

          <TabsContent value="users" className="flex-1 mt-0 min-h-0">
            <UserManagementPanel />
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedPage>
  );
};

export default Authority;
