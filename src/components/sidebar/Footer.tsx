'use client'

import { AuthQueryKey, usePostLogout } from '@/api/auth';
import { useGetUser, usePutUser, type PutUserReq } from '@/api/user';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/shadcn/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/shadcn/dropdownMenu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/shadcn/sidebar'
import UserEditDialog from '@/components/user/UserEditDialog'
import config from '@/config/config'
import { useUser } from '@/contexts/UserContext'
import { useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { CircleUser, EllipsisVertical, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const defaultUser = {
  user_name: 'Guest',
  user_email: 'guest@example.com',
  user_id: '',
  user_role: '',
  is_login: 'N',
  profile_url: '/default-avatar.png'
}

export function Footer() {
  const { isMobile } = useSidebar()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const logoutMutation = usePostLogout()
  const { loginUser, clearLoginUser } = useUser()
  const { mutate: putUser } = usePutUser()

  // Dialog 상태 관리
  const [showEditDialog, setShowEditDialog] = useState(false)

  // 로그인한 사용자의 상세 정보 가져오기
  const { data: userData } = useGetUser({
    user_id: loginUser?.user_id || ''
  })

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

  const handleUpdateUser = (user: PutUserReq) => {
    putUser({
      user_id: user.user_id,
      user_name: user.user_name,
      user_email: user.user_email,
      user_birth: dayjs(user.user_birth).format('YYYYMMDD'),
      user_origin_company_type: user.user_origin_company_type,
      user_department_type: user.user_department_type,
      user_work_time: user.user_work_time,
      user_role_type: user.user_role_type,
      lunar_yn: user.lunar_yn,
      profile_url: user.profile_url,
      profile_uuid: user.profile_uuid
    })
  }

  const user = loginUser ? {
    user_name: loginUser.user_name,
    user_email: loginUser.user_email,
    user_id: loginUser.user_id,
    user_role: loginUser.user_role,
    profile_url: loginUser.profile_url
  } : defaultUser

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <Avatar className='h-8 w-8 rounded-lg'>
                <AvatarImage src={`${config.baseUrl}${user.profile_url}`} alt={user.user_name} />
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
                  <AvatarImage src={`${config.baseUrl}${user.profile_url}`} alt={user.user_name} />
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
              {userData && (
                <DropdownMenuItem onSelect={() => setShowEditDialog(true)}>
                  <CircleUser />
                  Account
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} disabled={logoutMutation.isPending}>
              <LogOut />
              {logoutMutation.isPending ? 'Logging out...' : 'Log out'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* 사용자 수정 Dialog */}
        {userData && (
          <UserEditDialog
            open={showEditDialog}
            onOpenChange={setShowEditDialog}
            user={userData}
            onSave={handleUpdateUser}
          />
        )}
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
