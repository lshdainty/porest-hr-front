import { useYearOperationDuesQuery, useMonthBirthDuesQuery, useUsersMonthBirthDuesQuery, useYearDuesQuery } from '@/hooks/queries/useDues';
import { useUsersQuery } from '@/hooks/queries/useUsers';
import TotalDues from '@/components/dues/TotalDues';
import UserBirthDues from '@/components/dues/UserBirthDues';
import DuesTable from '@/components/dues/DuesTable';
import TotalDuesSkeleton from '@/components/dues/TotalDuesSkeleton';
import UserBirthDuesSkeleton from '@/components/dues/UserBirthDuesSkeleton';
import DuesTableSkeleton from '@/components/dues/DuesTableSkeleton';
import dayjs from 'dayjs';

export default function Dues() {
  const year = dayjs().format('YYYY');
  const month = dayjs().format('MM');

  const { data: totalDues, isLoading: totalDuesLoading } = useYearOperationDuesQuery(year);
  const { data: birthDues, isLoading: birthDuesLoading } = useMonthBirthDuesQuery(year, month);
  const { data: usersBirthDues, isLoading: usersBirthDuesLoading } = useUsersMonthBirthDuesQuery(year);
  const { data: users, isLoading: usersLoading } = useUsersQuery();
  const { data: yearDues, isLoading: yearDuesLoading } = useYearDuesQuery(year);

  const totalDuesCombinedLoading = totalDuesLoading || birthDuesLoading;
  const userBirthDuesCombinedLoading = usersBirthDuesLoading || usersLoading;

  if (totalDuesCombinedLoading || userBirthDuesCombinedLoading || yearDuesLoading) {
    return (
      <div className='p-4 sm:p-6 md:p-8'>
        <div className='mb-6'>
          <TotalDuesSkeleton />
        </div>
        <div className='mb-6'>
          <UserBirthDuesSkeleton />
        </div>
        <DuesTableSkeleton />
      </div>
    );
  }

  return (
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
  );
}