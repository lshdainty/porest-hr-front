import MonthVacationStatsCardSkeleton from '@/features/vacation/history/components/MonthVacationStatsCardSkeleton';
import MonthVacationStatsContent from '@/features/vacation/history/components/MonthVacationStatsContent';
import { GetUserMonthlyVacationStatsResp } from '@/lib/api/vacation';

interface MonthStatsWidgetProps {
  monthStats?: GetUserMonthlyVacationStatsResp[];
}

const MonthStatsWidget = ({ monthStats }: MonthStatsWidgetProps) => {
  if (!monthStats) {
    return <MonthVacationStatsCardSkeleton />;
  }

  return (
    <div className='h-full w-full p-4'>
      <MonthVacationStatsContent data={monthStats} />
    </div>
  );
};

export default MonthStatsWidget;
