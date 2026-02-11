import { NoticeContent } from '@/features/admin-notice/ui/NoticeContent'
import { NoticeProvider } from '@/features/admin-notice/model/NoticeContext'

const NoticePage = () => {
  return (
    <NoticeProvider>
      <NoticeContent />
    </NoticeProvider>
  )
};

export { NoticePage };
