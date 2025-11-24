import VacationTypeStatsCardSkeleton from '@/features/vacation/history/components/VacationTypeStatsCardSkeleton';
import VacationTypeStatsContent from '@/features/vacation/history/components/VacationTypeStatsContent';
import { GetAvailableVacationsResp } from '@/lib/api/vacation';

interface TypeStatsWidgetProps {
  vacationTypes?: GetAvailableVacationsResp[];
}

const TypeStatsWidget = ({ vacationTypes }: TypeStatsWidgetProps) => {
  if (!vacationTypes) {
    return <VacationTypeStatsCardSkeleton />;
  }

  return (
    <div className='h-full w-full p-4'>
      <VacationTypeStatsContent data={vacationTypes} />
    </div>
  );
};

export default TypeStatsWidget;
