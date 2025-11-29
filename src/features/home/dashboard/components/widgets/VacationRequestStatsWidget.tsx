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
    <div className='w-full overflow-x-auto'>
      <div className='grid grid-cols-1 lg:grid-cols-7 divide-y lg:divide-y-0 lg:divide-x divide-border h-full bg-card lg:min-w-[1000px]'>
        {statsConfig.map((item) => (
          <div key={item.id} className='p-6 h-full'>
             <VacationRequestStatsItem {...item} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default VacationRequestStatsWidget;
