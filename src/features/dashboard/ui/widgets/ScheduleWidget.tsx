import QueryAsyncBoundary from '@/shared/ui/async-boundary/QueryAsyncBoundary'
import { ScheduleEmpty } from '@/features/work-schedule/ui/ScheduleEmpty'
import { ScheduleSkeleton } from '@/features/work-schedule/ui/ScheduleSkeleton'
import { ScheduleTable } from '@/features/work-schedule/ui/ScheduleTable'
import { useUsersQuery } from '@/entities/user'

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
