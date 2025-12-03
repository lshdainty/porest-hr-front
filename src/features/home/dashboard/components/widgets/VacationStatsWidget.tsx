import VacationStatsCardSkeleton from '@/features/vacation/history/components/VacationStatsCardSkeleton';
import VacationStatsItem, { getVacationStatsConfig } from '@/features/vacation/history/components/VacationStatsItem';
import { GetUserVacationStatsResp } from '@/lib/api/vacation';
import { useTranslation } from 'react-i18next';

interface VacationStatsWidgetProps {
  vacationStats?: GetUserVacationStatsResp;
}

const VacationStatsWidget = ({ vacationStats }: VacationStatsWidgetProps) => {
  const { t } = useTranslation('vacation');

  if (!vacationStats) {
    return <VacationStatsCardSkeleton />;
  }

  const statsConfig = getVacationStatsConfig(vacationStats, t);

  return (
    <div className='grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-border h-full bg-card'>
      {statsConfig.map((item) => (
        <div key={item.id} className='p-4 h-full'>
          <VacationStatsItem {...item} />
        </div>
      ))}
    </div>
  );
};

export default VacationStatsWidget;
