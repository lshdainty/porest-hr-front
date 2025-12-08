import QueryAsyncBoundary from '@/components/common/QueryAsyncBoundary'
import { TodayWorkStatusContent } from '@/features/home/dashboard/components/widgets/TodayWorkStatus/TodayWorkStatusContent'
import { TodayWorkStatusSkeleton } from '@/features/home/dashboard/components/widgets/TodayWorkStatus/TodayWorkStatusSkeleton'
import { useTodayWorkStatusQuery } from '@/hooks/queries/useWorks'

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
