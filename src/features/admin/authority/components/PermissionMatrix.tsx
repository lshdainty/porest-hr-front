import { Checkbox } from "@/components/shadcn/checkbox";
import { Label } from "@/components/shadcn/label";
import { Authority } from "@/features/admin/authority/types";
import { useMemo } from "react";

interface PermissionMatrixProps {
  authorities: Authority[];
  selectedAuthorityIds: string[];
  onToggleAuthority: (authorityId: string, checked: boolean) => void;
  disabled?: boolean;
}

const PermissionMatrix = ({ authorities, selectedAuthorityIds, onToggleAuthority, disabled = false }: PermissionMatrixProps) => {

  const groupedAuthorities = useMemo(() => {
    const groups: { [key: string]: Authority[] } = {};
    if (!authorities || !Array.isArray(authorities)) {
      return groups;
    }
    authorities.forEach(auth => {
      if (!auth || !auth.resource) return;
      if (!groups[auth.resource]) {
        groups[auth.resource] = [];
      }
      groups[auth.resource].push(auth);
    });
    return groups;
  }, [authorities]);

  const hasAuthorities = Object.keys(groupedAuthorities).length > 0;

  return (
    <div className="space-y-6">
      {hasAuthorities ? (
        Object.entries(groupedAuthorities).map(([group, groupAuths]) => (
          <div key={group} className="border rounded-lg p-4 bg-card">
            <h4 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wider">{group}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groupAuths.map((auth) => (
                <div key={auth.code} className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => onToggleAuthority(auth.code, !selectedAuthorityIds?.includes(auth.code))}>
                  <Checkbox
                    id={auth.code}
                    checked={selectedAuthorityIds?.includes(auth.code) || false}
                    onCheckedChange={(checked) => onToggleAuthority(auth.code, checked as boolean)}
                    disabled={disabled}
                    className="mt-1"
                  />
                  <div className="grid gap-1.5 leading-none flex-1">
                    <Label
                      htmlFor={auth.code}
                      className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      onClick={(e) => e.stopPropagation()} 
                    >
                      {auth.name}
                    </Label>
                    <p className="text-sm text-muted-foreground leading-snug">
                      {auth.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="flex items-center justify-center p-8 border rounded-lg bg-muted/30">
          <p className="text-muted-foreground">No permissions available</p>
        </div>
      )}
    </div>
  );
};

export default PermissionMatrix;
