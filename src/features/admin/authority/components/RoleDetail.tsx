import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";
import { Textarea } from "@/components/shadcn/textarea";
import PermissionMatrix from "@/features/admin/authority/components/PermissionMatrix";
import { Authority, Role } from "@/features/admin/authority/types";
import { Save } from "lucide-react";

interface RoleDetailProps {
  role: Role;
  allAuthorities: Authority[];
  onUpdateRole: (updatedRole: Role) => void;
  onSave: () => void;
}

const RoleDetail = ({ role, allAuthorities, onUpdateRole, onSave }: RoleDetailProps) => {
  
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateRole({ ...role, name: e.target.value });
  };

  const handleDescChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdateRole({ ...role, description: e.target.value });
  };

  const handleToggleAuthority = (authId: string, checked: boolean) => {
    const newAuthorityIds = checked
      ? [...role.authorityIds, authId]
      : role.authorityIds.filter(id => id !== authId);
    
    onUpdateRole({ ...role, authorityIds: newAuthorityIds });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b bg-background sticky top-0 z-10">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Role Details</h2>
            <p className="text-muted-foreground">Manage role information and permissions.</p>
          </div>
          <Button onClick={onSave} className="gap-2">
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        </div>

        <div className="grid gap-4 max-w-2xl">
          <div className="grid gap-2">
            <Label htmlFor="role-name">Role Name</Label>
            <Input 
              id="role-name" 
              value={role.name} 
              onChange={handleNameChange} 
              placeholder="e.g. HR Manager"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="role-desc">Description</Label>
            <Textarea 
              id="role-desc" 
              value={role.description} 
              onChange={handleDescChange} 
              placeholder="Describe the role's responsibilities..."
              className="resize-none"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 bg-muted/10">
        <h3 className="text-lg font-semibold mb-4">Permissions</h3>
        <PermissionMatrix 
          authorities={allAuthorities} 
          selectedAuthorityIds={role.authorityIds} 
          onToggleAuthority={handleToggleAuthority}
        />
      </div>
    </div>
  );
};

export default RoleDetail;
