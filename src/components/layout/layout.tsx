import {
  SidebarInset,
  SidebarProvider,
} from '@/components/shadcn/sidebar';
import { AppSidebar } from '@/components/sidebar/Sidebar';
import { LayoutHeader } from '@/components/layout/layoutHeader';
import { Outlet } from 'react-router-dom';

export default function Layout() {
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
    </SidebarProvider>
  )
}