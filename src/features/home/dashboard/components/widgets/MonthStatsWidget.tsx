import MonthVacationStatsCard from '@/features/vacation/history/components/MonthVacationStatsCard';
import MonthVacationStatsCardSkeleton from '@/features/vacation/history/components/MonthVacationStatsCardSkeleton';
import { GetUserMonthlyVacationStatsResp } from '@/lib/api/vacation';

interface MonthStatsWidgetProps {
  monthStats?: GetUserMonthlyVacationStatsResp[];
}

const MonthStatsWidget = ({ monthStats }: MonthStatsWidgetProps) => {
  if (!monthStats) {
    return <MonthVacationStatsCardSkeleton />;
  }

  return <MonthVacationStatsCard value={monthStats} className='h-full' />;
};

export default MonthStatsWidget;
