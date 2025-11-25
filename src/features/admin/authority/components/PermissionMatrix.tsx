import { Checkbox } from "@/components/shadcn/checkbox";
import { Label } from "@/components/shadcn/label";
import { Authority } from "@/features/admin/authority/types";
import { useMemo } from "react";

interface PermissionMatrixProps {
  authorities: Authority[];
  selectedAuthorityIds: string[];
  onToggleAuthority: (authorityId: string, checked: boolean) => void;
}

const PermissionMatrix = ({ authorities, selectedAuthorityIds, onToggleAuthority }: PermissionMatrixProps) => {
  
  const groupedAuthorities = useMemo(() => {
    const groups: { [key: string]: Authority[] } = {};
    authorities.forEach(auth => {
      if (!groups[auth.group]) {
        groups[auth.group] = [];
      }
      groups[auth.group].push(auth);
    });
    return groups;
  }, [authorities]);

  return (
    <div className="space-y-6">
      {Object.entries(groupedAuthorities).map(([group, groupAuths]) => (
        <div key={group} className="border rounded-lg p-4 bg-card">
          <h4 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wider">{group}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groupAuths.map((auth) => (
              <div key={auth.id} className="flex items-start space-x-3 p-2 rounded hover:bg-muted/50 transition-colors">
                <Checkbox 
                  id={auth.id} 
                  checked={selectedAuthorityIds.includes(auth.id)}
                  onCheckedChange={(checked) => onToggleAuthority(auth.id, checked as boolean)}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label 
                    htmlFor={auth.id} 
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {auth.name}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {auth.code}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PermissionMatrix;
