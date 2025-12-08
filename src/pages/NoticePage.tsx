import { NoticeContent } from '@/features/admin/notice/components/NoticeContent'
import { NoticeProvider } from '@/features/admin/notice/contexts/NoticeContext'

export const NoticePage = () => {
  return (
    <NoticeProvider>
      <NoticeContent />
    </NoticeProvider>
  )
}
