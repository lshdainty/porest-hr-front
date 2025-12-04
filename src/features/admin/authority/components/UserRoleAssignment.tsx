import { Badge } from "@/components/shadcn/badge";
import { Button } from "@/components/shadcn/button";
import { Checkbox } from "@/components/shadcn/checkbox";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/shadcn/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/shadcn/popover";
import MobileRoleSelector from "@/features/admin/authority/components/MobileRoleSelector";
import { Role, User } from "@/features/admin/authority/types";
import { useIsMobile } from "@/hooks/useMobile";
import { ArrowLeft, ChevronsUpDown } from "lucide-react";
import { useState } from "react";

interface UserRoleAssignmentProps {
  user: User;
  allRoles: Role[];
  onUpdateUserRole: (userId: string, roleCodes: string[]) => Promise<void>;
  onBack?: () => void;
}

const UserRoleAssignment = ({ user, allRoles, onUpdateUserRole, onBack }: UserRoleAssignmentProps) => {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

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
      <div className="p-4 md:p-6 border-b bg-background">
        <div className="flex items-start gap-2 mb-1">
          {onBack && (
            <Button variant="outline" size="icon" onClick={onBack} className="mr-2 md:hidden shrink-0 h-8 w-8 mt-1">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{user.name}</h2>
            <p className="text-muted-foreground mb-4">{user.email}</p>
          </div>
        </div>
        
        <div className="flex gap-4 text-sm text-muted-foreground pl-0 md:pl-0">
          <div>
            <span className="font-medium text-foreground">Department:</span> {user.department || '-'}
          </div>
          <div>
            <span className="font-medium text-foreground">Position:</span> {user.position || '-'}
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Assigned Roles</h3>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg bg-card gap-4">
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
            
            {isMobile ? (
              <div className="w-full">
                <MobileRoleSelector
                  allRoles={allRoles}
                  selectedRoleCodes={currentRoleCodes}
                  onSave={(newRoleCodes) => onUpdateUserRole(user.id, newRoleCodes)}
                />
              </div>
            ) : (
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
                              <Checkbox
                                checked={isSelected}
                                className="mr-2"
                              />
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRoleAssignment;
