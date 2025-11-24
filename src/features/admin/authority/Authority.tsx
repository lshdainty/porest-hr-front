import { useState } from "react";
import { Button } from "@/components/shadcn/button";
import { Switch } from "@/components/shadcn/switch";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/shadcn/resizable";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shadcn/table';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/shadcn/command";
import { ChevronRight, ChevronDown } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
}

interface PagePermissions {
  admin: boolean;
  read: boolean;
  write: boolean;
  delete: boolean;
}

interface UserPermissions {
  [pageUrl: string]: PagePermissions;
}

interface AllPermissions {
  [userId: string]: UserPermissions;
}

interface TreeNode {
  id: string;
  title: string;
  url: string;
  nodes?: TreeNode[];
  level: number;
}

const navDatas = [
  {
    title: 'Home',
    url: '/',
    items: [
        { title: 'Dashboard', url: '/dashboard' },
        { title: 'Calendar', url: '/calendar' }
    ],
  },
  {
    title: 'Work',
    url: '/work',
    items: [
        { title: 'Report', url: '/work/report' },
    ],
  },
  {
    title: 'Culture',
    url: '/culture',
    items: [
        { title: 'Dues', url: '/culture/dues' },
        { title: 'Rule', url: '/culture/rule' },
    ],
  },
  {
    title: 'Admin',
    url: '/admin',
    items: [
        { title: 'User', url: '/admin/user' },
        { title: 'Company', url: '/admin/company' },
        { title: 'Vacation', url: '/admin/vacation' },
        { title: 'Authority', url: '/admin/authority' },
        { title: 'Holiday', url: '/admin/holiday' },
    ],
  },
];

const transformToTreeData = (navs: typeof navDatas, level = 0): TreeNode[] => {
  return navs.map(nav => ({
    id: nav.url,
    title: nav.title,
    url: nav.url,
    level,
    nodes: nav.items ? nav.items.map(item => ({ id: item.url, title: item.title, url: item.url, level: level + 1, nodes: [] })) : [],
  }));
}

const treeData = transformToTreeData(navDatas);

const mockUsers: User[] = [
  { id: "user-1", name: "유저 A (Admin)", email: "admin@example.com" },
  { id: "user-2", name: "유저 B (Normal)", email: "user.b@example.com" },
  { id: "user-3", name: "유저 C (Read-only)", email: "user.c@example.com" },
];

const getAllPageUrls = (nodes: TreeNode[]) => {
  const urls: {title: string, url: string}[] = [];
  nodes.forEach(node => {
    urls.push({title: node.title, url: node.url});
    if (node.nodes) {
        urls.push(...getAllPageUrls(node.nodes));
    }
  });
  return urls;
}

const allPages = getAllPageUrls(treeData);

const initialPermissions: AllPermissions = {};
mockUsers.forEach(user => {
  initialPermissions[user.id] = {};
  allPages.forEach(page => {
    const isAdmin = user.name.includes("Admin");
    const isNormal = user.name.includes("Normal");

    let permissions: PagePermissions = { admin: false, read: false, write: false, delete: false };

    if (isAdmin) {
      permissions = { admin: true, read: true, write: true, delete: true };
    } else if (isNormal) {
      if (!page.url.startsWith('/admin')) {
        permissions = { admin: false, read: true, write: true, delete: false };
      }
    } else { // Read-only user
        permissions = { admin: false, read: true, write: false, delete: false };
    }
    initialPermissions[user.id][page.url] = permissions;
  });
});

const Authority = () => {
  const [permissions, setPermissions] = useState<AllPermissions>(initialPermissions);
  const [selectedUser, setSelectedUser] = useState<User | null>(mockUsers[0]);
  const [expanded, setExpanded] = useState<string[]>(treeData.map(n => n.id));

  const toggleExpand = (id: string) => {
    setExpanded(current => 
      current.includes(id) ? current.filter(item => item !== id) : [...current, id]
    );
  };

  const handlePermissionChange = (userId: string, pageUrl: string, key: keyof PagePermissions, value: boolean) => {
    setPermissions(prev => {
      const newPermissions = { ...prev };
      const userPermissions = { ...newPermissions[userId] };
      const pagePermissions = { ...userPermissions[pageUrl] };

      pagePermissions[key] = value;

      if (key === 'admin') {
        pagePermissions.read = value;
        pagePermissions.write = value;
        pagePermissions.delete = value;
      }
      else if (!value) {
        pagePermissions.admin = false;
      }

      userPermissions[pageUrl] = pagePermissions;
      newPermissions[userId] = userPermissions;
      return newPermissions;
    });
  };

  const handleSave = () => {
    console.log("Saving permissions:", JSON.stringify(permissions, null, 2));
  };

  const renderTree = (nodes: TreeNode[]): React.ReactNode[] => {
    return nodes.flatMap(node => {
      const isExpanded = expanded.includes(node.id);
      const perms = selectedUser && permissions[selectedUser.id]?.[node.url];

      const row = perms ? (
        <TableRow
          key={node.id}
          onClick={() => toggleExpand(node.id)}
          className='hover:bg-muted/50 cursor-pointer'
        >
          <TableCell style={{ paddingLeft: `${node.level * 20 + 16}px` }}>
            <div className="flex items-center">
              {node.nodes && node.nodes.length > 0 && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleExpand(node.id);
                  }}
                  className="mr-2 p-1"
                >
                  {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
              )}
              {node.title}
            </div>
          </TableCell>
          <TableCell>
            <div className="flex items-center justify-end">
              {(["admin", "read", "write", "delete"] as const).map(permKey => (
                <div key={permKey} className="w-20 flex justify-center">
                  <Switch
                    checked={perms[permKey]}
                    onCheckedChange={(value) => selectedUser && handlePermissionChange(selectedUser.id, node.url, permKey, value)}
                    disabled={permKey !== 'admin' && perms.admin}
                  />
                </div>
              ))}
            </div>
          </TableCell>
        </TableRow>
      ) : null;

      const children = isExpanded && node.nodes ? renderTree(node.nodes) : [];
      return [row, ...children].filter(Boolean);
    });
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">권한 관리</h1>
        <Button onClick={handleSave}>저장</Button>
      </div>
        <ResizablePanelGroup direction="horizontal" className="flex-grow rounded-lg border">

          <ResizablePanel defaultSize={20} minSize={20}>
            <Command className="h-full">
              <CommandInput placeholder="사용자 검색..." />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Users">
                  {mockUsers.map((user) => (
                    <CommandItem key={user.id} onSelect={() => setSelectedUser(user)}>
                      {user.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={75}>
              <div className="flex flex-col h-full p-4">
                {selectedUser ? (
                  <>
                    <h2 className="text-2xl font-bold mb-4">{selectedUser.name}님의 권한</h2>
                    <div className="border rounded-lg overflow-hidden">
                      <Table className="w-full">
                        <TableHeader>
                          <TableRow className='bg-muted hover:bg-muted text-foreground'>
                            <TableHead className="w-[40%] pl-4">페이지</TableHead>
                            <TableHead>
                              <div className="flex justify-end">
                                <div className="w-20 text-center">Admin</div>
                                <div className="w-20 text-center">Read</div>
                                <div className="w-20 text-center">Write</div>
                                <div className="w-20 text-center">Delete</div>
                              </div>
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {renderTree(treeData)}
                        </TableBody>
                      </Table>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p>왼쪽 목록에서 사용자를 선택해주세요.</p>
                  </div>
                )}
            </div>
          </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

export default Authority
