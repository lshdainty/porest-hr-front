import { Avatar, AvatarFallback, AvatarImage } from '@/components/shadcn/avatar';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/shadcn/sidebar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/shadcn/dropdownMenu';
import { EllipsisVertical, CircleUser, CreditCard, MessageSquareDot, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { usePostLogout, AuthQueryKey } from '@/api/auth';
import { useLoginUserStore } from '@/store/LoginUser';

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
  const queryClient = useQueryClient()
  const logoutMutation = usePostLogout()
  const { loginUser, clearLoginUser } = useLoginUserStore()

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        // 전역 store 초기화
        clearLoginUser()
        // React Query 캐시 제거 (재요청 없이 캐시만 삭제)
        queryClient.removeQueries({
          queryKey: [AuthQueryKey.GET_LOGIN_CHECK]
        })
        navigate('/login')
      }
    })
  }

  const user = loginUser ? {
    user_name: loginUser.user_name,
    user_email: loginUser.user_email,
    user_id: loginUser.user_id,
    user_role: loginUser.user_role,
  } : defaultUser

  const avatarUrl = '/default-avatar.png'

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
                <AvatarImage src={avatarUrl} alt={user.user_name} />
                <AvatarFallback className='rounded-lg'>{user.user_name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-medium'>{user.user_name}</span>
                <span className='text-muted-foreground truncate text-xs'>
                  {user.user_email}
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
                  <AvatarImage src={avatarUrl} alt={user.user_name} />
                  <AvatarFallback className='rounded-lg'>{user.user_name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-medium'>{user.user_name}</span>
                  <span className='text-muted-foreground truncate text-xs'>
                    {user.user_email}
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
