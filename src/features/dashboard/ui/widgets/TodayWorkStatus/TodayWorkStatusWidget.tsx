import QueryAsyncBoundary from '@/shared/ui/async-boundary/QueryAsyncBoundary'
import { TodayWorkStatusContent } from '@/features/dashboard/ui/widgets/TodayWorkStatus/TodayWorkStatusContent'
import { TodayWorkStatusSkeleton } from '@/features/dashboard/ui/widgets/TodayWorkStatus/TodayWorkStatusSkeleton'
import { useTodayWorkStatusQuery } from '@/entities/work'

export const TodayWorkStatusWidget = () => {
  const { data: status, isLoading, error } = useTodayWorkStatusQuery()

  return (
    <QueryAsyncBoundary
      queryState={{ isLoading, error, data: status }}
      loadingComponent={<TodayWorkStatusSkeleton />}
    >
      <TodayWorkStatusContent data={status!} />
    </QueryAsyncBoundary>
  )
}
