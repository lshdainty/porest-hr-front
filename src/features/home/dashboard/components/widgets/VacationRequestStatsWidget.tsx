import VacationRequestStatsCardsSkeleton from '@/features/vacation/application/components/VacationRequestStatsCardsSkeleton';
import VacationRequestStatsItem, { getVacationRequestStatsConfig } from '@/features/vacation/application/components/VacationRequestStatsItem';
import { GetUserRequestedVacationStatsResp } from '@/lib/api/vacation';
import { useTranslation } from 'react-i18next';

interface VacationRequestStatsWidgetProps {
  stats?: GetUserRequestedVacationStatsResp;
}

const VacationRequestStatsWidget = ({ stats }: VacationRequestStatsWidgetProps) => {
  const { t } = useTranslation('vacation');

  if (!stats) {
    return <VacationRequestStatsCardsSkeleton />;
  }

  const statsConfig = getVacationRequestStatsConfig(stats, t);

  return (
    <div className='w-full h-full overflow-x-auto'>
      <div className='flex flex-wrap h-full items-stretch bg-card'>
        {statsConfig.map((item, index) => (
          <div
            key={item.id}
            className='p-6 border-r border-border min-w-[140px] flex-1'
          >
             <VacationRequestStatsItem {...item} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default VacationRequestStatsWidget;
