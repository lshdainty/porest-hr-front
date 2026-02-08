import Logo from '@/shared/assets/img/porest.svg';
import LogoDark from '@/shared/assets/img/porest_dark.svg';
import LogoIcon from '@/shared/assets/img/porest_logo.svg';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/shared/ui/shadcn/sidebar';
import { useTheme } from '@/shared/ui/shadcn/themeProvider';

export function SidebarHeaderNav() {
  const { theme } = useTheme();
  const { state } = useSidebar();

  const handleLogo = () => {
    if (state === 'collapsed') {
      return LogoIcon;
    }
    return theme === 'light' ? Logo : LogoDark;
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          className='data-[slot=sidebar-menu-button]:!p-0'
        >
          <img src={handleLogo()} alt='logo' className='h-10'></img>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
