import ScheduleSkeleton from '@/features/work/schedule/components/ScheduleSkeleton';
import UserInfoCardSkeleton from '@/features/user/components/UserInfoCardSkeleton';
import MonthVacationStatsCardSkeleton from '@/features/vacation/history/components/MonthVacationStatsCardSkeleton';
import VacationStatsCardSkeleton from '@/features/vacation/history/components/VacationStatsCardSkeleton';
import VacationTypeStatsCardSkeleton from '@/features/vacation/history/components/VacationTypeStatsCardSkeleton';

const DashboardSkeleton = () => {
  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="col-span-1"><UserInfoCardSkeleton /></div>
      <div className="col-span-1"><VacationStatsCardSkeleton /></div>
      <div className="col-span-2"><MonthVacationStatsCardSkeleton /></div>
      <div className="col-span-1"><VacationTypeStatsCardSkeleton /></div>
      <div className="col-span-3"><ScheduleSkeleton /></div>
    </div>
  );
};

export default DashboardSkeleton;
