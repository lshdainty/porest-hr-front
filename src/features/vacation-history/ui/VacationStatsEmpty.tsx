import { Empty, EmptyDescription, EmptyHeader, EmptyIcon, EmptyTitle } from '@/shared/ui/shadcn/empty'
import { cn } from '@/shared/lib'
import { CalendarDays } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface VacationStatsEmptyProps {
  className?: string
}

export const VacationStatsEmpty = ({ className }: VacationStatsEmptyProps) => {
  const { t } = useTranslation('vacation')

  return (
    <div className={cn('h-full w-full flex', className)}>
      <Empty>
        <EmptyHeader>
          <EmptyIcon>
            <CalendarDays />
          </EmptyIcon>
          <EmptyTitle>{t('stats.empty.title')}</EmptyTitle>
          <EmptyDescription>{t('stats.empty.description')}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  )
}
