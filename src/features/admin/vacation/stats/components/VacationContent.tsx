import UserInfoCard from '@/features/user/components/UserInfoCard';
import UserInfoCardSkeleton from '@/features/user/components/UserInfoCardSkeleton';
import { useUser } from '@/contexts/UserContext';
import { useVacationContext } from '@/features/admin/vacation/stats/contexts/VacationContext';
import ApplicationTable from '@/features/vacation/application/components/ApplicationTable';
import ApplicationTableSkeleton from '@/features/vacation/application/components/ApplicationTableSkeleton';
import MonthVacationStatsCard from '@/features/vacation/history/components/MonthVacationStatsCard';
import MonthVacationStatsCardSkeleton from '@/features/vacation/history/components/MonthVacationStatsCardSkeleton';
import VacationHistoryTable from '@/features/vacation/history/components/VacationHistoryTable';
import VacationHistoryTableSkeleton from '@/features/vacation/history/components/VacationHistoryTableSkeleton';
import VacationStatsCard from '@/features/vacation/history/components/VacationStatsCard';
import VacationStatsCardSkeleton from '@/features/vacation/history/components/VacationStatsCardSkeleton';
import VacationTypeStatsCard from '@/features/vacation/history/components/VacationTypeStatsCard';
import VacationTypeStatsCardSkeleton from '@/features/vacation/history/components/VacationTypeStatsCardSkeleton';
import { useGrantStatusTypesQuery } from '@/hooks/queries/useTypes';
import { useUsersQuery } from '@/hooks/queries/useUsers';
import {
    useAllVacationsByApproverQuery,
    useAvailableVacationsQuery,
    useUserMonthlyVacationStatsQuery,
    useUserVacationHistoryQuery,
    useUserVacationStatsQuery
} from '@/hooks/queries/useVacations';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const VacationContent = () => {
  const { t } = useTranslation('vacation');
  const { loginUser } = useUser();
  const { selectedUserId, setSelectedUserId } = useVacationContext();

  const { data: users, isLoading: usersLoading } = useUsersQuery();
  const { data: vacationTypes, isLoading: vacationTypesLoading } = useAvailableVacationsQuery(
    selectedUserId,
    dayjs().format('YYYY-MM-DDTHH:mm:ss')
  );
  const { data: monthStats, isLoading: monthStatsLoading } = useUserMonthlyVacationStatsQuery(
    selectedUserId,
    dayjs().format('YYYY')
  );
  const { data: histories, isLoading: historiesLoading } = useUserVacationHistoryQuery(selectedUserId);
  const { data: vacationStats, isLoading: vacationStatsLoading } = useUserVacationStatsQuery(
    selectedUserId,
    dayjs().format('YYYY-MM-DDTHH:mm:ss')
  );
  const { data: vacationRequests = [], isLoading: isLoadingRequests } = useAllVacationsByApproverQuery(
    selectedUserId
  );
  const { data: grantStatusTypes = [] } = useGrantStatusTypesQuery();

  useEffect(() => {
    if (loginUser && !selectedUserId) {
      setSelectedUserId(loginUser.user_id);
    }
  }, [loginUser, selectedUserId, setSelectedUserId]);

  if (usersLoading || vacationTypesLoading || monthStatsLoading || historiesLoading || vacationStatsLoading || isLoadingRequests) {
    return (
      <div className='p-4 sm:p-6 md:p-8'>
        <h1 className='text-3xl font-bold mb-6'>{t('stats.title')}</h1>
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
        <h1 className='text-3xl font-bold mb-6'>{t('stats.title')}</h1>
        <div>{t('stats.noUser')}</div>
      </div>
    );
  }

  return (
    <div className='p-4 sm:p-6 md:p-8'>
      <h1 className='text-3xl font-bold mb-6'>{t('stats.title')}</h1>
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
            value={vacationTypes}
            className='h-full'
          />
        </div>
        <div className='xl:col-span-2 flex flex-col'>
          <VacationHistoryTable
            value={histories || { grants: [], usages: [] }}
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
          showGrantButton={true}
        />
      </div>
    </div>
  );
};

export default VacationContent;
