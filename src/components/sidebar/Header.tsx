import Logo from '@/assets/img/porest.svg';
import LogoDark from '@/assets/img/porest_dark.svg';
import { useTheme } from '@/components/shadcn/themeProvider';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/shadcn/sidebar';

export function Header() {
  const { theme } = useTheme();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          className='data-[slot=sidebar-menu-button]:!p-0'
        >
          <img src={ theme == 'light' ? Logo : LogoDark } alt='logo' className='h-10'></img>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}