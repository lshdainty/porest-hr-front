import Logo from '@/assets/img/porest.svg';
import LogoDark from '@/assets/img/porest_dark.svg';
import LogoIcon from '@/assets/img/porest_logo.svg';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/shadcn/sidebar';
import { useTheme } from '@/components/shadcn/themeProvider';

export function Header() {
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