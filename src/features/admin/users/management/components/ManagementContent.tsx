import { useUsersQuery } from '@/hooks/queries/useUsers';
import UserCompanyCard from './UserCompanyCard';
import UserCompanyCardSkeleton from './UserCompanyCardSkeleton';
import UserTable from './UserTable';
import UserTableSkeleton from './UserTableSkeleton';

const ManagementContent = () => {
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
};

export default ManagementContent;
