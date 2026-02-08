import {
  SidebarInset,
  SidebarProvider,
} from '@/shared/ui/shadcn/sidebar';
import { AppSidebar } from '@/widgets/sidebar';
import { LayoutHeader } from '@/widgets/layout/ui/LayoutHeader';
import { NoticePopupContainer } from '@/widgets/notice-popup';
import { useOAuthLinkResult } from '@/shared/hooks/useOAuthLinkResult'
import { Outlet } from 'react-router-dom';

export function Layout() {
  // OAuth 연동 결과 처리 (URL 파라미터 감지)
  useOAuthLinkResult();

  return (
    <SidebarProvider
      className='h-screen overflow-hidden'
      style={{
        '--sidebar-width': 'calc(var(--spacing) * 72)',
        '--header-height': 'calc(var(--spacing) * 12)',
      } as React.CSSProperties}
    >
      <AppSidebar variant='inset' />
      <SidebarInset className='overflow-hidden'>
        <LayoutHeader />
        <div className='flex-1 overflow-auto'>
          <Outlet/>
        </div>
      </SidebarInset>
      <NoticePopupContainer />
    </SidebarProvider>
  )
}
