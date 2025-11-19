import { useUsersQuery } from '@/hooks/queries/useUsers';
import UserCompanyCard from '@/components/user/UserCompanyCard';
import UserCompanyCardSkeleton from '@/components/user/UserCompanyCardSkeleton';
import UserTable from '@/components/user/UserTable';
import UserTableSkeleton from '@/components/user/UserTableSkeleton';

export default function Management() {
  const { data: users, isLoading: usersLoading } = useUsersQuery();

  if (usersLoading) {
    return (
      <div className='p-4 sm:p-6 md:p-8'>
        <h1 className='text-3xl font-bold mb-6'>사용자 관리</h1>
        <UserCompanyCardSkeleton />
        <UserTableSkeleton />
      </div>
    )
  }

  return (
    <div className='p-4 sm:p-6 md:p-8'>
      <h1 className='text-3xl font-bold mb-6'>사용자 관리</h1>
      <UserCompanyCard value={users || []} />
      <UserTable value={users || []} />
    </div>
  );
}