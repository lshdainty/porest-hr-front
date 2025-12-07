import VacationHistoryContent from '@/features/vacation/history/components/VacationHistoryContent'
import VacationHistoryWidgetSkeleton from '@/features/home/dashboard/components/widgets/VacationHistoryWidgetSkeleton'
import { GetUserVacationHistoryResp } from '@/lib/api/vacation'

interface VacationHistoryWidgetProps {
  vacationHistory?: GetUserVacationHistoryResp
}

const VacationHistoryWidget = ({
  vacationHistory,
}: VacationHistoryWidgetProps) => {
  if (!vacationHistory) {
    return <VacationHistoryWidgetSkeleton />
  }

  return (
    <VacationHistoryContent
      data={vacationHistory}
      className="h-full"
      showPagination={false}
      stickyHeader={true}
    />
  )
}

export default VacationHistoryWidget
