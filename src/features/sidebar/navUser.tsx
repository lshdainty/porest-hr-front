import { Avatar, AvatarFallback, AvatarImage } from '@/components/shadcn/avatar';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/shadcn/sidebar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/shadcn/dropdownMenu';
import { EllipsisVertical, CircleUser, CreditCard, MessageSquareDot, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePostLogout } from '@/api/auth';
import { useGetLoginUserInfo } from '@/api/user';
import { useEffect, useState } from 'react';

export function NavUser({
  user: propUser
}: {
  user?: {
    name: string
    email: string
    image: string
  }
}) {
  const { isMobile } = useSidebar()
  const navigate = useNavigate()
  const logoutMutation = usePostLogout()
  const { data: serverUser } = useGetLoginUserInfo()
  const [currentUser, setCurrentUser] = useState(propUser)

  useEffect(() => {
    // 서버에서 가져온 사용자 정보가 있으면 우선 사용
    if (serverUser) {
      setCurrentUser({
        name: serverUser.name,
        email: serverUser.email,
        image: serverUser.email || '/default-avatar.png'
      })
    } else if (propUser) {
      setCurrentUser(propUser)
    } else {
      // localStorage에서 사용자 정보 가져오기
      const storedUserInfo = localStorage.getItem('userInfo')
      if (storedUserInfo) {
        try {
          const userInfo = JSON.parse(storedUserInfo)
          setCurrentUser({
            name: userInfo.name,
            email: userInfo.email,
            image: userInfo.email || '/default-avatar.png'
          })
        } catch (error) {
          console.error('Failed to parse user info from localStorage:', error)
        }
      }
    }
  }, [serverUser, propUser])

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        navigate('/login')
      }
    })
  }

  if (!currentUser) {
    return null
  }

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
                <AvatarImage src={currentUser.image} alt={currentUser.name} />
                <AvatarFallback className='rounded-lg'>CN</AvatarFallback>
              </Avatar>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-medium'>{currentUser.name}</span>
                <span className='text-muted-foreground truncate text-xs'>
                  {currentUser.email}
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
                  <AvatarImage src={currentUser.image} alt={currentUser.name} />
                  <AvatarFallback className='rounded-lg'>CN</AvatarFallback>
                </Avatar>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-medium'>{currentUser.name}</span>
                  <span className='text-muted-foreground truncate text-xs'>
                    {currentUser.email}
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
