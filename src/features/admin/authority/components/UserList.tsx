import { Input } from "@/components/shadcn/input";
import { ScrollArea } from "@/components/shadcn/scrollArea";
import { User } from "@/features/admin/authority/types";
import { cn } from "@/lib/utils";
import { Search, User as UserIcon } from "lucide-react";
import { useState } from "react";

interface UserListProps {
  users: User[];
  selectedUserId: string | null;
  onSelectUser: (userId: string) => void;
}

const UserList = ({ users, selectedUserId, onSelectUser }: UserListProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full border-r">
      <div className="p-4 border-b space-y-3 bg-muted/30">
        <h3 className="font-semibold flex items-center gap-2">
          <UserIcon className="w-4 h-4" />
          Users
        </h3>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search users..." 
            className="pl-8" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                className={cn(
                  "flex items-center justify-between p-3 rounded-md cursor-pointer transition-colors text-sm",
                  selectedUserId === user.id
                    ? "bg-primary/10 text-primary font-medium"
                    : "hover:bg-muted"
                )}
                onClick={() => onSelectUser(user.id)}
              >
                <div className="flex flex-col overflow-hidden">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No users found.
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export { UserList };
