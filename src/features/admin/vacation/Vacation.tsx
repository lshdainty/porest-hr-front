import { useGetUsers } from '@/api/user';
import { useGetGrantStatusTypes } from '@/api/type';
import {
  useGetAvailableVacations,
  useGetUserMonthlyVacationStats,
  useGetUserVacationStats,
  useGetUserVacationUsagesByPeriod,
  useGetAllVacationsByApprover
} from '@/api/vacation';
import ApplicationTable from '@/components/application/ApplicationTable';
import ApplicationTableSkeleton from '@/components/application/ApplicationTableSkeleton';
import UserInfoCard from '@/components/user/UserInfoCard';
import UserInfoCardSkeleton from '@/components/user/UserInfoCardSkeleton';
import MonthVacationStatsCard from '@/components/vacation/MonthVacationStatsCard';
import MonthVacationStatsCardSkeleton from '@/components/vacation/MonthVacationStatsCardSkeleton';
import VacationHistoryTable from '@/components/vacation/VacationHistoryTable';
import VacationHistoryTableSkeleton from '@/components/vacation/VacationHistoryTableSkeleton';
import VacationStatsCard from '@/components/vacation/VacationStatsCard';
import VacationStatsCardSkeleton from '@/components/vacation/VacationStatsCardSkeleton';
import VacationTypeStatsCard from '@/components/vacation/VacationTypeStatsCard';
import VacationTypeStatsCardSkeleton from '@/components/vacation/VacationTypeStatsCardSkeleton';
import { useLoginUserStore } from '@/store/LoginUser';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

export default function Vacation() {
  const { loginUser } = useLoginUserStore();
  const [selectedUserId, setSelectedUserId] = useState<string>(loginUser?.user_id || '');

  const { data: users, isLoading: usersLoading } = useGetUsers();
  const { data: vacationTypes, isLoading: vacationTypesLoading } = useGetAvailableVacations({
    user_id: selectedUserId,
    start_date: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
  });
  const { data: monthStats, isLoading: monthStatsLoading } = useGetUserMonthlyVacationStats({
    user_id: selectedUserId,
    year: dayjs().format('YYYY'),
  });
  const { data: histories, isLoading: historiesLoading } = useGetUserVacationUsagesByPeriod({
    user_id: selectedUserId,
    start_date: `${dayjs().format('YYYY')}-01-01T00:00:00`,
    end_date: `${dayjs().format('YYYY')}-12-31T23:59:59`,
  });
  const { data: vacationStats, isLoading: vacationStatsLoading } = useGetUserVacationStats({
    user_id: selectedUserId,
    base_date: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
  });
  const { data: vacationRequests = [], isLoading: isLoadingRequests } = useGetAllVacationsByApprover({
    approver_id: selectedUserId
  });
  const { data: grantStatusTypes = [] } = useGetGrantStatusTypes();

  useEffect(() => {
    if (loginUser && !selectedUserId) {
      setSelectedUserId(loginUser.user_id);
    }
  }, [loginUser, selectedUserId]);

  if (usersLoading || vacationTypesLoading || monthStatsLoading || historiesLoading || vacationStatsLoading || isLoadingRequests) {
    return (
      <div className='p-4 sm:p-6 md:p-8'>
        <h1 className='text-3xl font-bold mb-6'>휴가 관리</h1>
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
        <div className='grid grid-cols-1 gap-6 mt-6'>
          <ApplicationTableSkeleton />
        </div>
      </div>
    );
  }

  if (!selectedUserId) {
    return (
        <div className='p-4 sm:p-6 md:p-8'>
            <h1 className='text-3xl font-bold mb-6'>휴가 관리</h1>
            <div>사용자 정보가 없습니다.</div>
        </div>
    );
  }

  return (
    <div className='p-4 sm:p-6 md:p-8'>
      <h1 className='text-3xl font-bold mb-6'>휴가 관리</h1>
      <div className='flex flex-col lg:flex-row gap-6'>
        <UserInfoCard
          value={users || []}
          selectedUserId={selectedUserId}
          onUserChange={setSelectedUserId}
        />
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
            canAdd={true}
          />
        </div>
      </div>
      <div className='grid grid-cols-1 gap-6 mt-6'>
        <ApplicationTable
          vacationRequests={vacationRequests}
          grantStatusTypes={grantStatusTypes}
          userId={selectedUserId}
          userName={users?.find(user => user.user_id === selectedUserId)?.user_name}
        />
      </div>
    </div>
  );
}