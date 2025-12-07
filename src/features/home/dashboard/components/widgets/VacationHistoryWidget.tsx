import VacationHistoryContent from '@/features/vacation/history/components/VacationHistoryContent'
import { GetUserVacationHistoryResp } from '@/lib/api/vacation'

interface VacationHistoryWidgetProps {
  vacationHistory?: GetUserVacationHistoryResp
}

const VacationHistoryWidget = ({
  vacationHistory,
}: VacationHistoryWidgetProps) => {
  if (!vacationHistory) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">데이터를 불러오는 중...</p>
      </div>
    )
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
