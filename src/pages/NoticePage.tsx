import { NoticeContent } from '@/features/admin/notice/components/NoticeContent'
import { NoticeProvider } from '@/features/admin/notice/contexts/NoticeContext'

const NoticePage = () => {
  return (
    <NoticeProvider>
      <NoticeContent />
    </NoticeProvider>
  )
};

export { NoticePage };
