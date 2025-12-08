import QueryAsyncBoundary from '@/components/common/QueryAsyncBoundary'
import { MissingWorkHistoryContent } from '@/features/home/dashboard/components/widgets/MissingWorkHistory/MissingWorkHistoryContent'
import { MissingWorkHistorySkeleton } from '@/features/home/dashboard/components/widgets/MissingWorkHistory/MissingWorkHistorySkeleton'
import { useUnregisteredWorkDatesQuery } from '@/hooks/queries/useWorks'
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
