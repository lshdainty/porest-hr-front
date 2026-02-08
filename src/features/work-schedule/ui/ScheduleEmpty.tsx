import { Empty, EmptyDescription, EmptyHeader, EmptyIcon, EmptyTitle } from '@/shared/ui/shadcn/empty'
import { cn } from '@/shared/lib'
import { CalendarX } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface ScheduleEmptyProps {
  className?: string
}

export const ScheduleEmpty = ({ className }: ScheduleEmptyProps) => {
  const { t } = useTranslation('work')

  return (
    <div className={cn('h-full w-full flex', className)}>
      <Empty>
        <EmptyHeader>
          <EmptyIcon>
            <CalendarX />
          </EmptyIcon>
          <EmptyTitle>{t('schedule.empty.title')}</EmptyTitle>
          <EmptyDescription>
            {t('schedule.empty.description')}
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  )
}
