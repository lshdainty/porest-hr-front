import QueryAsyncBoundary from '@/components/common/QueryAsyncBoundary'
import { UserVacationStatsContent } from '@/features/home/dashboard/components/widgets/UserVacationStats/UserVacationStatsContent'
import { UserVacationStatsEmpty } from '@/features/home/dashboard/components/widgets/UserVacationStats/UserVacationStatsEmpty'
import { UserVacationStatsSkeleton } from '@/features/home/dashboard/components/widgets/UserVacationStats/UserVacationStatsSkeleton'
import { useAllUsersVacationSummaryQuery } from '@/hooks/queries/useVacations'

export const UserVacationStatsWidget = () => {
  const currentYear = new Date().getFullYear()
  const { data: vacationSummaries, isLoading, error } = useAllUsersVacationSummaryQuery(currentYear)

  return (
    <QueryAsyncBoundary
      queryState={{ isLoading, error, data: vacationSummaries }}
      loadingComponent={<UserVacationStatsSkeleton />}
      emptyComponent={<UserVacationStatsEmpty />}
      isEmpty={(data) => !data || data.length === 0}
    >
      <UserVacationStatsContent data={vacationSummaries!} />
    </QueryAsyncBoundary>
  )
}
