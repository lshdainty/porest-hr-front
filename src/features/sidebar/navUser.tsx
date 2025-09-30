import { Avatar, AvatarFallback, AvatarImage } from '@/components/shadcn/avatar';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/shadcn/sidebar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/shadcn/dropdownMenu';
import { EllipsisVertical, CircleUser, CreditCard, MessageSquareDot, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePostLogout } from '@/api/auth';
import { useAuthStore } from '@/store/AuthStore';

const defaultUser = {
  user_name: 'Guest',
  user_email: 'guest@example.com',
  user_id: '',
  user_role: '',
  is_login: 'N'
}

export function NavUser() {
  const { isMobile } = useSidebar()
  const navigate = useNavigate()
  const logoutMutation = usePostLogout()
  const user = useAuthStore((state) => state.user)

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        navigate('/login')
      }
    })
  }

  const currentUser = user || defaultUser
  const avatarUrl = (user as any)?.user_image || '/default-avatar.png'

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <Avatar className='h-8 w-8 rounded-lg grayscale'>
                <AvatarImage src={avatarUrl} alt={currentUser.user_name} />
                <AvatarFallback className='rounded-lg'>{currentUser.user_name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-medium'>{currentUser.user_name}</span>
                <span className='text-muted-foreground truncate text-xs'>
                  {currentUser.user_email}
                </span>
              </div>
              <EllipsisVertical className='ml-auto size-4' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
            side={isMobile ? 'bottom' : 'right'}
            align='end'
            sideOffset={4}
          >
            <DropdownMenuLabel className='p-0 font-normal'>
              <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                <Avatar className='h-8 w-8 rounded-lg'>
                  <AvatarImage src={avatarUrl} alt={currentUser.user_name} />
                  <AvatarFallback className='rounded-lg'>{currentUser.user_name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-medium'>{currentUser.user_name}</span>
                  <span className='text-muted-foreground truncate text-xs'>
                    {currentUser.user_email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <CircleUser />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <MessageSquareDot />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} disabled={logoutMutation.isPending}>
              <LogOut />
              {logoutMutation.isPending ? 'Logging out...' : 'Log out'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
