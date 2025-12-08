import { useUsersQuery } from '@/hooks/queries/useUsers';
import { UserCompanyCard } from '@/features/admin/users/management/components/UserCompanyCard';
import { UserCompanyCardSkeleton } from '@/features/admin/users/management/components/UserCompanyCardSkeleton';
import { UserTable } from '@/features/admin/users/management/components/UserTable';
import { UserTableSkeleton } from '@/features/admin/users/management/components/UserTableSkeleton';
import { useTranslation } from 'react-i18next';

const ManagementContent = () => {
  const { t } = useTranslation('admin');
  const { data: users, isLoading: usersLoading } = useUsersQuery();

  if (usersLoading) {
    return (
      <div className='p-4 sm:p-6 md:p-8'>
        <h1 className='text-3xl font-bold mb-6'>{t('user.title')}</h1>
        <UserCompanyCardSkeleton />
        <UserTableSkeleton />
      </div>
    )
  }

  return (
    <div className='p-4 sm:p-6 md:p-8'>
      <h1 className='text-3xl font-bold mb-6'>{t('user.title')}</h1>
      <UserCompanyCard value={users || []} />
      <UserTable value={users || []} />
    </div>
  );
};

export { ManagementContent };
