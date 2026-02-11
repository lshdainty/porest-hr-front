'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/shadcn/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/shared/ui/shadcn/dropdownMenu'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/shared/ui/shadcn/sidebar'
import { config } from '@/shared/config'
import { useUser } from '@/entities/session'
import { PasswordChangeDialog } from '@/features/user-profile/ui/PasswordChangeDialog'
import { UserEditDialog } from '@/features/user-profile/ui/UserEditDialog'
import { authKeys } from '@/entities/session'
import { usePutUserMutation, useUserQuery } from '@/entities/user'
import type { PutUserReq } from '@/entities/user'
import { useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { CircleUser, EllipsisVertical, KeyRound, LogOut } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const defaultUser = {
  user_name: 'Guest',
  user_email: 'guest@example.com',
  user_id: '',
  user_role: '',
  is_login: 'N',
  profile_url: ''
}

export function SidebarFooterNav() {
  const { isMobile } = useSidebar()
  const queryClient = useQueryClient()
  const { loginUser, logout } = useUser()
  const { mutate: putUser } = usePutUserMutation()
  const { t } = useTranslation('sidebar')

  // Dialog 상태 관리
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)

  // 로그인한 사용자의 상세 정보 가져오기
  const { data: userData } = useUserQuery(loginUser?.user_id || '')

  const handleLogout = () => {
    // React Query 캐시 제거
    queryClient.setQueryData(authKeys.detail('login-check'), null)
    // JWT 토큰 삭제 및 로그인 페이지로 이동
    logout()
  }

  const handleUpdateUser = (user: PutUserReq) => {
    putUser({
      user_id: user.user_id,
      user_name: user.user_name,
      user_email: user.user_email,
      user_birth: dayjs(user.user_birth).format('YYYY-MM-DD'),
      user_company_type: user.user_company_type,
      user_work_time: user.user_work_time,
      lunar_yn: user.lunar_yn,
      profile_url: user.profile_url,
      profile_uuid: user.profile_uuid,
      country_code: user.country_code
    })
  }

  const user = loginUser ? {
    user_name: loginUser.user_name,
    user_email: loginUser.user_email,
    user_id: loginUser.user_id,
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
                <>
                  <DropdownMenuItem onSelect={() => setShowEditDialog(true)}>
                    <CircleUser />
                    {t('footer.account')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setShowPasswordDialog(true)}>
                    <KeyRound />
                    {t('footer.changePassword')}
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut />
              {t('footer.logout')}
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

        {/* 비밀번호 변경 Dialog */}
        <PasswordChangeDialog
          open={showPasswordDialog}
          onOpenChange={setShowPasswordDialog}
        />
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
