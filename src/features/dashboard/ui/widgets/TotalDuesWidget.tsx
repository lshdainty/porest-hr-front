import QueryAsyncBoundary from '@/shared/ui/async-boundary/QueryAsyncBoundary'
import { TotalDuesItem, getTotalDuesConfig } from '@/features/culture-dues/ui/TotalDuesItem'
import { TotalDuesEmpty } from '@/features/culture-dues/ui/TotalDuesEmpty'
import { TotalDuesWidgetSkeleton } from '@/features/culture-dues/ui/TotalDuesWidgetSkeleton'
import { useMonthBirthDuesQuery, useYearOperationDuesQuery } from '@/entities/dues'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'

export const TotalDuesWidget = () => {
  const { t } = useTranslation('culture')
  const currentYear = dayjs().year()
  const currentMonth = dayjs().month() + 1

  const { data: totalDues, isLoading: totalLoading, error: totalError } = useYearOperationDuesQuery(currentYear)
  const { data: birthDues, isLoading: birthLoading, error: birthError } = useMonthBirthDuesQuery(currentYear, currentMonth)

  const isLoading = totalLoading || birthLoading
  const error = totalError || birthError

  const duesConfig = getTotalDuesConfig(totalDues, birthDues, t)

  return (
    <QueryAsyncBoundary
      queryState={{ isLoading, error, data: totalDues }}
      loadingComponent={<TotalDuesWidgetSkeleton />}
      emptyComponent={<TotalDuesEmpty className="h-full" />}
      isEmpty={(data) => !data || !birthDues}
    >
      <div className='flex flex-col lg:grid lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-border h-full bg-card overflow-y-auto scrollbar-hide'>
        {duesConfig.map((item) => (
          <div key={item.id} className='p-4 h-auto lg:h-full relative overflow-hidden min-h-[120px] shrink-0'>
            <TotalDuesItem {...item} />
          </div>
        ))}
      </div>
    </QueryAsyncBoundary>
  )
}
