import { Badge } from "@/components/shadcn/badge";
import { Button } from "@/components/shadcn/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/shadcn/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/shadcn/popover";
import { Role, User } from "@/features/admin/authority/types";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";

interface UserRoleAssignmentProps {
  user: User;
  allRoles: Role[];
  onUpdateUserRole: (userId: string, roleCodes: string[]) => void;
}

const UserRoleAssignment = ({ user, allRoles, onUpdateUserRole }: UserRoleAssignmentProps) => {
  const [open, setOpen] = useState(false);

  // User can have multiple roles
  const currentRoleCodes = user.role_codes || [];
  const currentRoles = allRoles.filter(r => currentRoleCodes.includes(r.role_code));

  const handleToggleRole = (roleCode: string) => {
    const newRoleCodes = currentRoleCodes.includes(roleCode)
      ? currentRoleCodes.filter(code => code !== roleCode)
      : [...currentRoleCodes, roleCode];
    
    onUpdateUserRole(user.id, newRoleCodes);
    // Keep popover open for multiple selection
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b bg-background">
        <h2 className="text-2xl font-bold tracking-tight mb-1">{user.name}</h2>
        <p className="text-muted-foreground mb-4">{user.email}</p>
        
        <div className="flex gap-4 text-sm text-muted-foreground">
          <div>
            <span className="font-medium text-foreground">Department:</span> {user.department || '-'}
          </div>
          <div>
            <span className="font-medium text-foreground">Position:</span> {user.position || '-'}
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Assigned Roles</h3>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 border rounded-lg bg-card">
            <div className="flex-1">
              <div className="font-medium flex flex-wrap items-center gap-2 mb-2">
                {currentRoles.length > 0 ? (
                  currentRoles.map(role => (
                    <Badge key={role.role_code} variant="secondary" className="text-xs font-normal">
                      {role.role_name} ({role.role_code})
                    </Badge>
                  ))
                ) : (
                  <span className="text-muted-foreground">No Roles Assigned</span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {currentRoles.length > 0 
                  ? "Manage the roles assigned to this user." 
                  : "Assign roles to this user to grant permissions."}
              </p>
            </div>
            
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={open} className="w-[200px] justify-between ml-4">
                  {currentRoles.length > 0 ? `${currentRoles.length} Roles Selected` : "Assign Roles"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[250px] p-0">
                <Command>
                  <CommandInput placeholder="Search role..." />
                  <CommandList>
                    <CommandEmpty>No role found.</CommandEmpty>
                    <CommandGroup>
                      {allRoles.map((role) => {
                        const isSelected = currentRoleCodes.includes(role.role_code);
                        return (
                          <CommandItem
                            key={role.role_code}
                            value={role.role_name}
                            onSelect={() => handleToggleRole(role.role_code)}
                          >
                            <div className={cn(
                              "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                              isSelected ? "bg-primary text-primary-foreground" : "opacity-50 [&_svg]:invisible"
                            )}>
                              <Check className={cn("h-4 w-4")} />
                            </div>
                            <span>{role.role_name}</span>
                            <span className="ml-auto text-xs text-muted-foreground">{role.role_code}</span>
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRoleAssignment;
