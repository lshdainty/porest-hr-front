import VacationStatsCard from '@/features/vacation/history/components/VacationStatsCard';
import VacationStatsCardSkeleton from '@/features/vacation/history/components/VacationStatsCardSkeleton';
import { GetUserVacationStatsResp } from '@/lib/api/vacation';

interface VacationStatsWidgetProps {
  vacationStats?: GetUserVacationStatsResp;
}

const VacationStatsWidget = ({ vacationStats }: VacationStatsWidgetProps) => {
  if (!vacationStats) {
    return <VacationStatsCardSkeleton />;
  }

  return <VacationStatsCard value={vacationStats} />;
};

export default VacationStatsWidget;
