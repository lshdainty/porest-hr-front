import { UserCompanyCardSkeleton } from '@/features/admin/users/management/components/UserCompanyCardSkeleton'
import { UserTableSkeleton } from '@/features/admin/users/management/components/UserTableSkeleton'

const ManagementContentSkeleton = () => {
  return (
    <>
      <UserCompanyCardSkeleton />
      <UserTableSkeleton />
    </>
  )
}

export { ManagementContentSkeleton }
