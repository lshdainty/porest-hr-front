import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";
import { Textarea } from "@/components/shadcn/textarea";
import { Authority } from "@/features/admin/authority/types";
import { Save } from "lucide-react";

interface PermissionDetailProps {
  permission: Authority;
  onUpdatePermission: (updatedPermission: Authority) => void;
  onSave: () => void;
}

const PermissionDetail = ({ permission, onUpdatePermission, onSave }: PermissionDetailProps) => {
  
  const handleChange = (field: keyof Authority, value: string) => {
    onUpdatePermission({ ...permission, [field]: value });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b bg-background sticky top-0 z-10">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Permission Details</h2>
            <p className="text-muted-foreground">Manage permission information.</p>
          </div>
          <Button onClick={onSave} className="gap-2">
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        </div>

        <div className="grid gap-4 max-w-2xl">
          <div className="grid gap-2">
            <Label htmlFor="perm-code">Code</Label>
            <Input 
              id="perm-code" 
              value={permission.code} 
              disabled
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">Permission code cannot be changed after creation.</p>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="perm-name">Name</Label>
            <Input 
              id="perm-name" 
              value={permission.name} 
              onChange={(e) => handleChange('name', e.target.value)} 
              placeholder="e.g. User Read"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="perm-resource">Resource Type</Label>
              <Input 
                id="perm-resource" 
                value={permission.resourceType} 
                onChange={(e) => handleChange('resourceType', e.target.value)} 
                placeholder="e.g. USER"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="perm-action">Action Type</Label>
              <Input 
                id="perm-action" 
                value={permission.actionType} 
                onChange={(e) => handleChange('actionType', e.target.value)} 
                placeholder="e.g. READ"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="perm-desc">Description</Label>
            <Textarea 
              id="perm-desc" 
              value={permission.description} 
              onChange={(e) => handleChange('description', e.target.value)} 
              placeholder="Describe the permission..."
              className="resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermissionDetail;
