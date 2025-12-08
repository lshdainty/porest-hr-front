import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyIcon,
  EmptyTitle,
} from '@/components/shadcn/empty'
import { Bell } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface UserNoticeEmptyProps {
  className?: string
}

export const UserNoticeEmpty = ({ className }: UserNoticeEmptyProps) => {
  const { t } = useTranslation('notice')

  return (
    <Empty className={`min-h-[calc(100vh-200px)] ${className ?? ''}`}>
      <EmptyHeader>
        <EmptyIcon>
          <Bell />
        </EmptyIcon>
        <EmptyTitle>{t('noNotices')}</EmptyTitle>
        <EmptyDescription>{t('noNoticesDesc')}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
