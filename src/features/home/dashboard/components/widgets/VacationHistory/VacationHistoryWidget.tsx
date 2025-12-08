import QueryAsyncBoundary from '@/components/common/QueryAsyncBoundary'
import { useUser } from '@/contexts/UserContext'
import { VacationHistoryContent } from '@/features/vacation/history/components/VacationHistoryContent'
import { VacationHistorySkeleton } from '@/features/home/dashboard/components/widgets/VacationHistory/VacationHistorySkeleton'
import { useUserVacationHistoryQuery } from '@/hooks/queries/useVacations'

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
