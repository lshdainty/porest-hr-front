import { useUserQuery } from '@/hooks/queries/useUsers';
import {
  useAvailableVacationsQuery,
  useUserMonthlyVacationStatsQuery,
  useUserVacationUsagesByPeriodQuery,
  useUserVacationStatsQuery
} from '@/hooks/queries/useVacations';
import UserInfoCard from '@/components/user/UserInfoCard';
import UserInfoCardSkeleton from '@/components/user/UserInfoCardSkeleton';
import VacationStatsCard from '@/components/vacation/VacationStatsCard';
import VacationStatsCardSkeleton from '@/components/vacation/VacationStatsCardSkeleton';
import MonthVacationStatsCard from '@/components/vacation/MonthVacationStatsCard';
import MonthVacationStatsCardSkeleton from '@/components/vacation/MonthVacationStatsCardSkeleton';
import VacationTypeStatsCard from '@/components/vacation/VacationTypeStatsCard';
import VacationTypeStatsCardSkeleton from '@/components/vacation/VacationTypeStatsCardSkeleton'
import VacationHistoryTable from '@/components/vacation/VacationHistoryTable'
import VacationHistoryTableSkeleton from '@/components/vacation/VacationHistoryTableSkeleton'
import { useUser } from '@/contexts/UserContext'
import dayjs from 'dayjs';

export default function History() {
  const { loginUser } = useUser()
  const user_id = loginUser?.user_id || ''

  const { data: user, isLoading: userLoading } = useUserQuery(user_id);
  const { data: vacationTypes, isLoading: vacationTypesLoading } = useAvailableVacationsQuery(
    user_id,
    dayjs().format('YYYY-MM-DDTHH:mm:ss')
  );
  const { data: monthStats, isLoading: monthStatsLoading } = useUserMonthlyVacationStatsQuery(
    user_id,
    dayjs().format('YYYY')
  );
  const { data: histories, isLoading: historiesLoading } = useUserVacationUsagesByPeriodQuery(
    user_id,
    `${dayjs().format('YYYY')}-01-01T00:00:00`,
    `${dayjs().format('YYYY')}-12-31T23:59:59`
  );
  const { data: vacationStats, isLoading: vacationStatsLoading } = useUserVacationStatsQuery(
    user_id,
    dayjs().format('YYYY-MM-DDTHH:mm:ss')
  );

  if (userLoading || vacationTypesLoading || monthStatsLoading || historiesLoading || vacationStatsLoading) {
      return (
        <div className='p-4 sm:p-6 md:p-8'>
          <h1 className='text-3xl font-bold mb-6'>휴가 내역 통계</h1>
          <div className='flex flex-col lg:flex-row gap-6'>
            <UserInfoCardSkeleton />
            <div className='flex flex-col gap-6 flex-1'>
              <VacationStatsCardSkeleton />
              <MonthVacationStatsCardSkeleton />
            </div>
          </div>
          <div className='grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6'>
            <div className='xl:col-span-1 flex flex-col'>
              <VacationTypeStatsCardSkeleton />
            </div>
            <div className='xl:col-span-2 flex flex-col'>
              <VacationHistoryTableSkeleton />
            </div>
          </div>
        </div>
      );
    }

  return (
    <div className='p-4 sm:p-6 md:p-8'>
      <h1 className='text-3xl font-bold mb-6'>휴가 내역 통계</h1>
      <div className='flex flex-col lg:flex-row gap-6'>
        {user && <UserInfoCard value={[user]} />}
        <div className='flex flex-col gap-6 flex-1'>
          <VacationStatsCard
            value={vacationStats}
          />
          <MonthVacationStatsCard
            value={monthStats || []}
            className='h-full'
          />
        </div>
      </div>
      <div className='grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6'>
        <div className='xl:col-span-1 flex flex-col'>
          <VacationTypeStatsCard
            value={vacationTypes || []}
            className='h-full'
          />
        </div>
        <div className='xl:col-span-2 flex flex-col'>
          <VacationHistoryTable
            value={histories || []}
            canAdd={false}
          />
        </div>
      </div>
    </div>
  );
}