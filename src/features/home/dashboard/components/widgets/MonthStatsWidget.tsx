import QueryAsyncBoundary from '@/components/common/QueryAsyncBoundary'
import { useUser } from '@/contexts/UserContext'
import { MonthVacationStatsContent } from '@/features/vacation/history/components/MonthVacationStatsContent'
import { MonthVacationStatsSkeleton } from '@/features/vacation/history/components/MonthVacationStatsSkeleton'
import { useUserMonthlyVacationStatsQuery } from '@/hooks/queries/useVacations'

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
