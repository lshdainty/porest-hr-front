import VacationRequestStatsCardsSkeleton from '@/features/vacation/application/components/VacationRequestStatsCardsSkeleton';
import VacationRequestStatsItem, { getVacationRequestStatsConfig } from '@/features/vacation/application/components/VacationRequestStatsItem';
import { GetUserRequestedVacationStatsResp } from '@/lib/api/vacation';

interface VacationRequestStatsWidgetProps {
  stats?: GetUserRequestedVacationStatsResp;
}

const VacationRequestStatsWidget = ({ stats }: VacationRequestStatsWidgetProps) => {
  if (!stats) {
    return <VacationRequestStatsCardsSkeleton />;
  }

  const statsConfig = getVacationRequestStatsConfig(stats);

  return (
    <div className='grid grid-cols-2 lg:grid-cols-7 gap-px bg-border h-full'>
      {statsConfig.map((item) => (
        <div key={item.id} className='p-6 bg-card h-full'>
           <VacationRequestStatsItem {...item} />
        </div>
      ))}
    </div>
  );
};

export default VacationRequestStatsWidget;
