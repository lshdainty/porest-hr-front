import QueryAsyncBoundary from '@/shared/ui/async-boundary/QueryAsyncBoundary'
import { useUser } from '@/entities/session'
import { VacationHistoryContent } from '@/features/vacation-history/ui/VacationHistoryContent'
import { VacationHistorySkeleton } from '@/features/dashboard/ui/widgets/VacationHistory/VacationHistorySkeleton'
import { useUserVacationHistoryQuery } from '@/entities/vacation'

export const VacationHistoryWidget = () => {
  const { loginUser } = useUser()
  const userId = loginUser?.user_id || ''

  const { data: vacationHistory, isLoading, error } = useUserVacationHistoryQuery(userId)

  return (
    <QueryAsyncBoundary
      queryState={{ isLoading, error, data: vacationHistory }}
      loadingComponent={<VacationHistorySkeleton />}
    >
      <VacationHistoryContent
        data={vacationHistory!}
        className="h-full"
        showPagination={false}
        stickyHeader={true}
      />
    </QueryAsyncBoundary>
  )
}
