import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from '@/components/shadcn/sidebar';
import { NavLogo } from '@/features/sidebar/navLogo';
import { NavUser } from '@/features/sidebar/navUser';
import { NavContent } from '@/features/sidebar/navContent';

// 설정 파일에서 import
import { treeData, routeMapping, pathToIdMapping } from '@/config/routes.config';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader>
        <NavLogo />
      </SidebarHeader>
      <SidebarContent>
        <NavContent
          treeData={treeData}
          routeMapping={routeMapping}
          pathToIdMapping={pathToIdMapping}
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
