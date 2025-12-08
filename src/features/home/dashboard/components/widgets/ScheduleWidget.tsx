import QueryAsyncBoundary from '@/components/common/QueryAsyncBoundary'
import { ScheduleEmpty } from '@/features/work/schedule/components/ScheduleEmpty'
import ScheduleSkeleton from '@/features/work/schedule/components/ScheduleSkeleton'
import ScheduleTable from '@/features/work/schedule/components/ScheduleTable'
import { useUsersQuery } from '@/hooks/queries/useUsers'

export const ScheduleWidget = () => {
  const { data: users, isLoading, error } = useUsersQuery()

  return (
    <QueryAsyncBoundary
      queryState={{ isLoading, error, data: users }}
      loadingComponent={<ScheduleSkeleton />}
      emptyComponent={<ScheduleEmpty className="h-full" />}
      isEmpty={(data) => !data || data.length === 0}
    >
      <ScheduleTable users={users!} />
    </QueryAsyncBoundary>
  )
}
