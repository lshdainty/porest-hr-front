import { Empty, EmptyDescription, EmptyHeader, EmptyIcon, EmptyTitle } from '@/shared/ui/shadcn/empty'
import { cn } from '@/shared/lib'
import { BarChart3 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface MonthVacationStatsEmptyProps {
  className?: string
}

export const MonthVacationStatsEmpty = ({ className }: MonthVacationStatsEmptyProps) => {
  const { t } = useTranslation('dashboard')

  return (
    <div className={cn('h-full w-full flex items-center justify-center', className)}>
      <Empty>
        <EmptyHeader>
          <EmptyIcon>
            <BarChart3 />
          </EmptyIcon>
          <EmptyTitle>{t('widget.empty.monthStats.title')}</EmptyTitle>
          <EmptyDescription>
            {t('widget.empty.monthStats.description')}
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  )
}
