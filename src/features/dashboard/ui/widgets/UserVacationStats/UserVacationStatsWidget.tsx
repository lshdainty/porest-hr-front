import QueryAsyncBoundary from '@/shared/ui/async-boundary/QueryAsyncBoundary'
import { UserVacationStatsContent } from '@/features/dashboard/ui/widgets/UserVacationStats/UserVacationStatsContent'
import { UserVacationStatsEmpty } from '@/features/dashboard/ui/widgets/UserVacationStats/UserVacationStatsEmpty'
import { UserVacationStatsSkeleton } from '@/features/dashboard/ui/widgets/UserVacationStats/UserVacationStatsSkeleton'
import { useAllUsersVacationSummaryQuery } from '@/entities/vacation'

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
