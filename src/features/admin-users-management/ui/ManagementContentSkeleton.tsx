import { UserCompanyCardSkeleton } from '@/features/admin-users-management/ui/UserCompanyCardSkeleton'
import { UserTableSkeleton } from '@/features/admin-users-management/ui/UserTableSkeleton'

const ManagementContentSkeleton = () => {
  return (
    <>
      <UserCompanyCardSkeleton />
      <UserTableSkeleton />
    </>
  )
}

export { ManagementContentSkeleton }
