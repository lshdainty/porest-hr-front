import { Badge } from "@/components/shadcn/badge";
import { Button } from "@/components/shadcn/button";
import { Checkbox } from "@/components/shadcn/checkbox";
import { Input } from "@/components/shadcn/input";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/shadcn/sheet";
import { Role } from "@/features/admin/authority/types";
import { ChevronsUpDown, Search } from "lucide-react";
import { useState } from "react";

interface MobileRoleSelectorProps {
  allRoles: Role[];
  selectedRoleCodes: string[];
  onSave: (roleCodes: string[]) => void;
  disabled?: boolean;
}

const MobileRoleSelector = ({
  allRoles,
  selectedRoleCodes,
  onSave,
  disabled = false,
}: MobileRoleSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [localSelectedRoleCodes, setLocalSelectedRoleCodes] = useState<string[]>(selectedRoleCodes);

  // Sync local state when opening the sheet
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      setLocalSelectedRoleCodes(selectedRoleCodes);
    }
    setOpen(newOpen);
  };

  const handleToggleLocal = (roleCode: string) => {
    setLocalSelectedRoleCodes(prev => 
      prev.includes(roleCode)
        ? prev.filter(code => code !== roleCode)
        : [...prev, roleCode]
    );
  };

  const handleSave = () => {
    onSave(localSelectedRoleCodes);
    setOpen(false);
  };

  const selectedCount = selectedRoleCodes.length;

  const filteredRoles = allRoles.filter(
    (role) =>
      role.role_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.role_code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button variant="outline" className="w-full justify-between" disabled={disabled}>
          <span className="flex items-center gap-2">
            {selectedCount > 0 ? `${selectedCount} Roles Selected` : "Assign Roles"}
          </span>
          <ChevronsUpDown className="h-4 w-4 opacity-50" />
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[85vh] flex flex-col p-0 rounded-t-[10px]">
        <SheetHeader className="px-6 pt-6 pb-4 border-b">
          <SheetTitle>Assign Roles</SheetTitle>
          <SheetDescription>
            Select roles to assign to this user. Tap Done to save changes.
          </SheetDescription>
        </SheetHeader>
        
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search roles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 bg-muted/10">
          <div className="space-y-2">
            {filteredRoles.length > 0 ? (
              filteredRoles.map((role) => {
                const isSelected = localSelectedRoleCodes.includes(role.role_code);
                return (
                  <div
                    key={role.role_code}
                    className="flex items-center space-x-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors cursor-pointer active:bg-muted"
                    onClick={() => handleToggleLocal(role.role_code)}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => handleToggleLocal(role.role_code)}
                      onClick={(e) => e.stopPropagation()}
                      className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{role.role_name}</span>
                        <Badge variant="outline" className="text-[10px] font-normal">
                          {role.role_code}
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No roles found matching "{searchQuery}"
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t bg-background">
          <Button className="w-full" onClick={handleSave}>
            Done
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileRoleSelector;
