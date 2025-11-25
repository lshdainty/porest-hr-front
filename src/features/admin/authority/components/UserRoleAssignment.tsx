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
  onUpdateUserRole: (userId: string, roleCode: string) => void;
}

const UserRoleAssignment = ({ user, allRoles, onUpdateUserRole }: UserRoleAssignmentProps) => {
  const [open, setOpen] = useState(false);

  // Assuming user has only one role code in the array
  const currentRoleCode = user.role_codes[0];
  const currentRole = allRoles.find(r => r.role_code === currentRoleCode);

  const handleSelectRole = (roleCode: string) => {
    onUpdateUserRole(user.id, roleCode);
    setOpen(false);
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
          <h3 className="text-lg font-semibold">Assigned Role</h3>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 border rounded-lg bg-card">
            <div>
              <div className="font-medium flex items-center gap-2">
                {currentRole ? currentRole.role_name : "No Role Assigned"}
                {currentRole && <Badge variant="secondary" className="text-xs font-normal">{currentRole.role_code}</Badge>}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {currentRole ? currentRole.description : "Assign a role to this user."}
              </p>
            </div>
            
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={open} className="w-[200px] justify-between">
                  {currentRole ? "Change Role" : "Assign Role"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput placeholder="Search role..." />
                  <CommandList>
                    <CommandEmpty>No role found.</CommandEmpty>
                    <CommandGroup>
                      {allRoles.map((role) => (
                        <CommandItem
                          key={role.role_code}
                          value={role.role_name}
                          onSelect={() => handleSelectRole(role.role_code)}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              currentRoleCode === role.role_code ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {role.role_name}
                        </CommandItem>
                      ))}
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
