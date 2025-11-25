import { Button } from "@/components/shadcn/button";
import { ScrollArea } from "@/components/shadcn/scrollArea";
import { Authority } from "@/features/admin/authority/types";
import { cn } from "@/lib/utils";
import { Key, Plus, Trash2 } from "lucide-react";

interface PermissionListProps {
  permissions: Authority[];
  selectedPermissionCode: string | null;
  onSelectPermission: (code: string) => void;
  onAddPermission: () => void;
  onDeletePermission: (code: string) => void;
}

const PermissionList = ({ 
  permissions, 
  selectedPermissionCode, 
  onSelectPermission, 
  onAddPermission, 
  onDeletePermission 
}: PermissionListProps) => {
  return (
    <div className="flex flex-col h-full border-r">
      <div className="p-4 border-b flex items-center justify-between bg-muted/30">
        <h3 className="font-semibold flex items-center gap-2">
          <Key className="w-4 h-4" />
          Permissions
        </h3>
        <Button variant="ghost" size="icon" onClick={onAddPermission} title="Add Permission">
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {permissions.map((permission) => (
            <div
              key={permission.code}
              className={cn(
                "flex items-center justify-between p-3 rounded-md cursor-pointer transition-colors text-sm",
                selectedPermissionCode === permission.code
                  ? "bg-primary/10 text-primary font-medium"
                  : "hover:bg-muted"
              )}
              onClick={() => onSelectPermission(permission.code)}
            >
              <div className="flex flex-col overflow-hidden">
                <span className="truncate font-medium">{permission.name}</span>
                <span className="truncate text-xs text-muted-foreground">{permission.code}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeletePermission(permission.code);
                }}
              >
                <Trash2 className="w-3 h-3 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default PermissionList;
