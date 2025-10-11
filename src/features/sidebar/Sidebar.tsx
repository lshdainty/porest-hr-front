import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from '@/components/shadcn/sidebar';
import { Header } from '@/components/sidebar/Header';
import { Footer } from '@/components/sidebar/Footer';
import { Content } from '@/components/sidebar/Content';

// 설정 파일에서 import
import { treeData, routeMapping, pathToIdMapping } from '@/config/routes.config';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader>
        <Header />
      </SidebarHeader>
      <SidebarContent>
        <Content
          treeData={treeData}
          routeMapping={routeMapping}
          pathToIdMapping={pathToIdMapping}
        />
      </SidebarContent>
      <SidebarFooter>
        <Footer />
      </SidebarFooter>
    </Sidebar>
  )
}
