import QueryAsyncBoundary from '@/shared/ui/async-boundary/QueryAsyncBoundary'
import { MissingWorkHistoryContent } from '@/features/dashboard/ui/widgets/MissingWorkHistory/MissingWorkHistoryContent'
import { MissingWorkHistorySkeleton } from '@/features/dashboard/ui/widgets/MissingWorkHistory/MissingWorkHistorySkeleton'
import { useUnregisteredWorkDatesQuery } from '@/entities/work'
import { useMemo, useState } from 'react'

export const MissingWorkHistoryWidget = () => {
  const today = new Date()
  const [currentDate, setCurrentDate] = useState<Date>(today)

  const { data: unregisteredData, isLoading, error } = useUnregisteredWorkDatesQuery(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1
  )

  const missingDates = useMemo(() => {
    if (!unregisteredData?.unregistered_dates) return []
    return unregisteredData.unregistered_dates.map((dateStr: string) => new Date(dateStr))
  }, [unregisteredData])

  return (
    <QueryAsyncBoundary
      queryState={{ isLoading, error, data: unregisteredData }}
      loadingComponent={<MissingWorkHistorySkeleton />}
    >
      <MissingWorkHistoryContent
        currentDate={currentDate}
        onDateSelect={setCurrentDate}
        onMonthChange={setCurrentDate}
        missingDates={missingDates}
      />
    </QueryAsyncBoundary>
  )
}
