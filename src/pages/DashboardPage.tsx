import QueryAsyncBoundary from '@/components/common/QueryAsyncBoundary';
import { useUser } from '@/contexts/UserContext';
import DashboardContent from '@/features/home/dashboard/components/DashboardContent';
import DashboardSkeleton from '@/features/home/dashboard/components/DashboardSkeleton';
import { DashboardProvider } from '@/features/home/dashboard/contexts/DashboardContext';
import { useGrantStatusTypesQuery } from '@/hooks/queries/useTypes';
import { useUserQuery, useUsersQuery } from '@/hooks/queries/useUsers';
import {
    useAvailableVacationsQuery,
    useUserMonthlyVacationStatsQuery,
    useUserRequestedVacationsQuery,
    useUserRequestedVacationStatsQuery,
    useUserVacationHistoryQuery,
    useUserVacationStatsQuery
} from '@/hooks/queries/useVacations';
import dayjs from 'dayjs';

const DashboardPage = () => {
  const { loginUser } = useUser();
  const user_id = loginUser?.user_id || '';

  const { data: user, isLoading: userLoading, error: userError } = useUserQuery(user_id);
  const { data: vacationTypes, isLoading: vacationTypesLoading, error: vacationTypesError } = useAvailableVacationsQuery(
    user_id,
    dayjs().format('YYYY-MM-DDTHH:mm:ss')
  );
  const { data: monthStats, isLoading: monthStatsLoading, error: monthStatsError } = useUserMonthlyVacationStatsQuery(
    user_id,
    dayjs().format('YYYY')
  );
  const { data: vacationStats, isLoading: vacationStatsLoading, error: vacationStatsError } = useUserVacationStatsQuery(
    user_id,
    dayjs().format('YYYY-MM-DDTHH:mm:ss')
  );
  const { data: vacationRequests, isLoading: vacationRequestsLoading, error: vacationRequestsError } = useUserRequestedVacationsQuery(user_id);
  const { data: requestStats, isLoading: requestStatsLoading, error: requestStatsError } = useUserRequestedVacationStatsQuery(user_id);
  const { data: grantStatusTypes } = useGrantStatusTypesQuery();
  const { data: users, isLoading: usersLoading, error: usersError } = useUsersQuery();
  const { data: vacationHistory, isLoading: vacationHistoryLoading, error: vacationHistoryError } = useUserVacationHistoryQuery(user_id);

  const isLoading = userLoading || vacationTypesLoading || monthStatsLoading || vacationStatsLoading || usersLoading || vacationRequestsLoading || requestStatsLoading || vacationHistoryLoading;
  const error = userError || vacationTypesError || monthStatsError || vacationStatsError || usersError || vacationRequestsError || requestStatsError || vacationHistoryError;

  return (
    <QueryAsyncBoundary
      queryState={{ isLoading, error, data: user }}
      loadingComponent={<DashboardSkeleton />}
      errorComponent={
        <div className='p-4 sm:p-6 md:p-8'>
          <div className='p-8 text-center text-red-600'>
            데이터를 불러오는데 실패했습니다.
          </div>
        </div>
      }
    >
      <DashboardProvider>
        <DashboardContent
          user={user}
          vacationStats={vacationStats}
          monthStats={monthStats}
          vacationTypes={vacationTypes}
          users={users}
          vacationRequests={vacationRequests}
          requestStats={requestStats}
          grantStatusTypes={grantStatusTypes}
          vacationHistory={vacationHistory}
        />
      </DashboardProvider>
    </QueryAsyncBoundary>
  );
};

export default DashboardPage;
