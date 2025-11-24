import VacationRequestStatsContent from '@/features/vacation/application/components/VacationRequestStatsContent';
import VacationRequestStatsContentSkeleton from '@/features/vacation/application/components/VacationRequestStatsContentSkeleton';
import { GetUserRequestedVacationStatsResp } from '@/lib/api/vacation';

interface VacationRequestStatsWidgetProps {
  stats?: GetUserRequestedVacationStatsResp;
}

const VacationRequestStatsWidget = ({ stats }: VacationRequestStatsWidgetProps) => {
  if (!stats) {
    return <VacationRequestStatsContentSkeleton />;
  }

  return <VacationRequestStatsContent stats={stats} />;
};

export default VacationRequestStatsWidget;
