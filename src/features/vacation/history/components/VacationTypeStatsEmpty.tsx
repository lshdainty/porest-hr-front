import { Empty, EmptyDescription, EmptyHeader, EmptyIcon, EmptyTitle } from '@/components/shadcn/empty'
import { cn } from '@/lib/utils'
import { PieChart } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface VacationTypeStatsEmptyProps {
  className?: string
}

export const VacationTypeStatsEmpty = ({ className }: VacationTypeStatsEmptyProps) => {
  const { t } = useTranslation('vacation')

  return (
    <div className={cn('h-full w-full flex', className)}>
      <Empty>
        <EmptyHeader>
          <EmptyIcon>
            <PieChart />
          </EmptyIcon>
          <EmptyTitle>{t('history.empty.typeStats.title')}</EmptyTitle>
          <EmptyDescription>
            {t('history.empty.typeStats.description')}
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  )
}
