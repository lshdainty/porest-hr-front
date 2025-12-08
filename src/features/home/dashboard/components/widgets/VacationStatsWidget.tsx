import QueryAsyncBoundary from '@/components/common/QueryAsyncBoundary'
import { useUser } from '@/contexts/UserContext'
import { VacationStatsEmpty } from '@/features/vacation/history/components/VacationStatsEmpty'
import { VacationStatsItem, getVacationStatsConfig } from '@/features/vacation/history/components/VacationStatsItem'
import { VacationStatsSkeleton } from '@/features/vacation/history/components/VacationStatsSkeleton'
import { useUserVacationStatsQuery } from '@/hooks/queries/useVacations'
import dayjs from 'dayjs'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export const VacationStatsWidget = () => {
  const { t } = useTranslation('vacation')
  const { loginUser } = useUser()
  const userId = loginUser?.user_id || ''

  const todayWithTime = useMemo(() => `${dayjs().format('YYYY-MM-DD')}T23:59:59`, [])

  const { data: vacationStats, isLoading, error } = useUserVacationStatsQuery(userId, todayWithTime)

  const statsConfig = getVacationStatsConfig(vacationStats, t)

  return (
    <QueryAsyncBoundary
      queryState={{ isLoading, error, data: vacationStats }}
      loadingComponent={<VacationStatsSkeleton />}
      emptyComponent={<VacationStatsEmpty className="h-full" />}
      isEmpty={(data) => !data}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-border h-full bg-card">
        {statsConfig.map((item) => (
          <div key={item.id} className="p-4 h-full">
            <VacationStatsItem {...item} />
          </div>
        ))}
      </div>
    </QueryAsyncBoundary>
  )
}
