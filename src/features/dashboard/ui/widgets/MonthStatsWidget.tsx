import QueryAsyncBoundary from '@/shared/ui/async-boundary/QueryAsyncBoundary'
import { useUser } from '@/entities/session'
import { MonthVacationStatsContent } from '@/features/vacation-history/ui/MonthVacationStatsContent'
import { MonthVacationStatsSkeleton } from '@/features/vacation-history/ui/MonthVacationStatsSkeleton'
import { useUserMonthlyVacationStatsQuery } from '@/entities/vacation'

export const MonthStatsWidget = () => {
  const { loginUser } = useUser()
  const userId = loginUser?.user_id || ''
  const currentYear = new Date().getFullYear().toString()

  const { data: monthStats, isLoading, error } = useUserMonthlyVacationStatsQuery(userId, currentYear)

  return (
    <QueryAsyncBoundary
      queryState={{ isLoading, error, data: monthStats }}
      loadingComponent={<MonthVacationStatsSkeleton />}
    >
      <MonthVacationStatsContent data={monthStats!} className="p-4" />
    </QueryAsyncBoundary>
  )
}
