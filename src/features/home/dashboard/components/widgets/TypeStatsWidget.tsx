import VacationTypeStatsCard from '@/features/vacation/history/components/VacationTypeStatsCard';
import VacationTypeStatsCardSkeleton from '@/features/vacation/history/components/VacationTypeStatsCardSkeleton';
import { GetAvailableVacationsResp } from '@/lib/api/vacation';

interface TypeStatsWidgetProps {
  vacationTypes?: GetAvailableVacationsResp[];
}

const TypeStatsWidget = ({ vacationTypes }: TypeStatsWidgetProps) => {
  if (!vacationTypes) {
    return <VacationTypeStatsCardSkeleton />;
  }

  return <VacationTypeStatsCard value={vacationTypes} className='h-full' />;
};

export default TypeStatsWidget;
