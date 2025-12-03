import QueryAsyncBoundary from '@/components/common/QueryAsyncBoundary';
import DuesTable from '@/features/culture/dues/components/DuesTable';
import DuesTableSkeleton from '@/features/culture/dues/components/DuesTableSkeleton';
import TotalDues from '@/features/culture/dues/components/TotalDues';
import TotalDuesSkeleton from '@/features/culture/dues/components/TotalDuesSkeleton';
import UserBirthDues from '@/features/culture/dues/components/UserBirthDues';
import UserBirthDuesSkeleton from '@/features/culture/dues/components/UserBirthDuesSkeleton';
import { useDuesContext } from '@/features/culture/dues/contexts/DuesContext';
import { useMonthBirthDuesQuery, useUsersMonthBirthDuesQuery, useYearDuesQuery, useYearOperationDuesQuery } from '@/hooks/queries/useDues';
import { useUsersQuery } from '@/hooks/queries/useUsers';
import { useTranslation } from 'react-i18next';

const DuesContent = () => {
  const { t } = useTranslation('common');
  const { year, month } = useDuesContext();

  const { data: totalDues, isLoading: totalDuesLoading, error: totalDuesError } = useYearOperationDuesQuery(year);
  const { data: birthDues, isLoading: birthDuesLoading, error: birthDuesError } = useMonthBirthDuesQuery(year, month);
  const { data: usersBirthDues, isLoading: usersBirthDuesLoading, error: usersBirthDuesError } = useUsersMonthBirthDuesQuery(year);
  const { data: users, isLoading: usersLoading, error: usersError } = useUsersQuery();
  const { data: yearDues, isLoading: yearDuesLoading, error: yearDuesError } = useYearDuesQuery(year);

  const isLoading = totalDuesLoading || birthDuesLoading || usersBirthDuesLoading || usersLoading || yearDuesLoading;
  const error = totalDuesError || birthDuesError || usersBirthDuesError || usersError || yearDuesError;

  return (
    <QueryAsyncBoundary
      queryState={{ isLoading, error, data: true }}
      loadingComponent={
        <div className='p-4 sm:p-6 md:p-8'>
          <div className='mb-6'>
            <TotalDuesSkeleton />
          </div>
          <div className='mb-6'>
            <UserBirthDuesSkeleton />
          </div>
          <DuesTableSkeleton />
        </div>
      }
      errorComponent={
        <div className='p-4 sm:p-6 md:p-8'>
          <div className='p-8 text-center text-red-600'>
            {t('loadFailed')}
          </div>
        </div>
      }
    >
      <div className='p-4 sm:p-6 md:p-8'>
        <div className='mb-6'>
          <TotalDues
            totalDues={totalDues}
            birthDues={birthDues}
          />
        </div>
        <div className='mb-6'>
          <UserBirthDues
            usersBirthDues={usersBirthDues}
            users={users}
          />
        </div>
        <DuesTable yearDues={yearDues} />
      </div>
    </QueryAsyncBoundary>
  );
};

export default DuesContent;
