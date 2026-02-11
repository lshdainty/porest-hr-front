import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/shadcn/dropdownMenu';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/shared/ui/shadcn/sidebar';
import { TreeDataItem, TreeView } from '@/shared/ui/shadcn/treeView';
import { cn } from '@/shared/lib';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface ContentProps {
  groups: Array<{ label: string; treeData: TreeDataItem[] }>;
  routeMapping: Record<string, string>;
  pathToIdMapping: Record<string, string>;
}

function addClickHandlers(
  items: TreeDataItem[],
  navigate: (path: string) => void,
  routeMapping: Record<string, string>
): TreeDataItem[] {
  return items.map(item => ({
    ...item,
    onClick: item.children ? undefined : () => {
      const route = routeMapping[item.id];
      if (route) {
        navigate(route);
      }
    },
    children: item.children ? addClickHandlers(item.children, navigate, routeMapping) : undefined,
  }));
}

function getAllSubItems(item: TreeDataItem, routeMapping: Record<string, string>) {
  const subItems: { id: string; name: string; url: string; }[] = [];

  const traverse = (node: TreeDataItem) => {
    if (node.children) {
      node.children.forEach(child => {
        if (child.children) {
          traverse(child);
        } else {
          const url = routeMapping[child.id];
          if (url) {
            subItems.push({
              id: child.id,
              name: child.name,
              url: url,
            });
          }
        }
      });
    } else {
      const url = routeMapping[node.id];
      if (url) {
        subItems.push({
          id: node.id,
          name: node.name,
          url: url,
        });
      }
    }
  };

  traverse(item);
  return subItems;
}

export function SidebarContentNav({ groups, routeMapping, pathToIdMapping }: ContentProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { state, isMobile } = useSidebar();
  const [selectedItemId, setSelectedItemId] = useState<string>('');

  // 현재 경로에 따라 선택된 아이템 설정
  useEffect(() => {
    const currentId = pathToIdMapping[location.pathname];
    if (currentId) {
      setSelectedItemId(currentId);
    }
  }, [location.pathname, pathToIdMapping]);

  // 각 그룹의 클릭 핸들러가 추가된 트리 데이터
  const enhancedGroups = groups.map(group => ({
    label: group.label,
    treeData: addClickHandlers(group.treeData, navigate, routeMapping),
  }));

  const handleSelectChange = (item: TreeDataItem | undefined) => {
    if (item && !item.children) {
      const route = routeMapping[item.id];
      if (route) {
        navigate(route);
      }
    }
  };

  const isItemActive = (itemId: string) => {
    const route = routeMapping[itemId];
    return route === location.pathname;
  };

  const isParentActive = (item: TreeDataItem): boolean => {
    if (item.children) {
      return item.children.some(child => {
        if (child.children) {
          return isParentActive(child);
        }
        return isItemActive(child.id);
      });
    }
    return isItemActive(item.id);
  };

  return (
    <>
      {enhancedGroups.map((group) => (
        <SidebarGroup key={group.label}>
          <SidebarGroupLabel>{group.label}</SidebarGroupLabel>

          {/* Collapsed 상태 (데스크톱): 메인 탭 아이콘만 표시 */}
          {state === 'collapsed' && !isMobile && (
            <SidebarMenu>
              {group.treeData.map((item) => {
                const subItems = getAllSubItems(item, routeMapping);
                const isActive = isParentActive(item);

                return (
                  <SidebarMenuItem key={item.id}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                          tooltip={item.name}
                          isActive={isActive}
                        >
                          {item.icon && <item.icon />}
                        </SidebarMenuButton>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        side="right"
                        align="start"
                        className="w-56"
                      >
                        <DropdownMenuLabel>{item.name}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                          {subItems.map((subItem) => (
                            <DropdownMenuItem
                              key={subItem.id}
                              onClick={() => navigate(subItem.url)}
                            >
                              <span>{subItem.name}</span>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          )}

          {/* Expanded 상태 또는 모바일: 전체 트리 구조 표시 */}
          {(state === 'expanded' || isMobile) && (
            <TreeView
              data={group.treeData}
              initialSelectedItemId={selectedItemId}
              onSelectChange={handleSelectChange}
              expandAll={false}
              className={cn('p-0 w-full')}
            />
          )}
        </SidebarGroup>
      ))}
    </>
  );
}
