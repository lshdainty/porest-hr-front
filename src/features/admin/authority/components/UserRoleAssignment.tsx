import { Badge } from "@/components/shadcn/badge";
import { Button } from "@/components/shadcn/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/shadcn/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/shadcn/popover";
import { Role, User } from "@/features/admin/authority/types";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, Plus, X } from "lucide-react";
import { useState } from "react";

interface UserRoleAssignmentProps {
  user: User;
  allRoles: Role[];
  onUpdateUserRoles: (userId: string, roleIds: string[]) => void;
}

const UserRoleAssignment = ({ user, allRoles, onUpdateUserRoles }: UserRoleAssignmentProps) => {
  const [open, setOpen] = useState(false);

  const assignedRoles = allRoles.filter(role => user.roleIds.includes(role.id));
  const availableRoles = allRoles.filter(role => !user.roleIds.includes(role.id));

  const handleAddRole = (roleId: string) => {
    onUpdateUserRoles(user.id, [...user.roleIds, roleId]);
    setOpen(false);
  };

  const handleRemoveRole = (roleId: string) => {
    onUpdateUserRoles(user.id, user.roleIds.filter(id => id !== roleId));
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
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" role="combobox" aria-expanded={open} className="w-[200px] justify-between">
                <Plus className="mr-2 h-4 w-4" />
                Add Role
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search role..." />
                <CommandList>
                  <CommandEmpty>No role found.</CommandEmpty>
                  <CommandGroup>
                    {availableRoles.map((role) => (
                      <CommandItem
                        key={role.id}
                        value={role.name}
                        onSelect={() => handleAddRole(role.id)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            user.roleIds.includes(role.id) ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {role.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-4">
          {assignedRoles.length > 0 ? (
            assignedRoles.map(role => (
              <div key={role.id} className="flex items-center justify-between p-4 border rounded-lg bg-card">
                <div>
                  <div className="font-medium flex items-center gap-2">
                    {role.name}
                    <Badge variant="secondary" className="text-xs font-normal">ID: {role.id}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{role.description}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-muted-foreground hover:text-destructive"
                  onClick={() => handleRemoveRole(role.id)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))
          ) : (
            <div className="text-center py-8 border-2 border-dashed rounded-lg text-muted-foreground">
              No roles assigned to this user.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserRoleAssignment;
