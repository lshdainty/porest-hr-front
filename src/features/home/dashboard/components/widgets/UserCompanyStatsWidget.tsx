import QueryAsyncBoundary from '@/components/common/QueryAsyncBoundary'
import { UserCompanyStatsItem, getUserCompanyStatsConfig } from '@/features/admin/users/management/components/UserCompanyStatsItem'
import { UserCompanyStatsEmpty } from '@/features/home/dashboard/components/widgets/UserCompanyStatsEmpty'
import { UserCompanyStatsSkeleton } from '@/features/admin/users/management/components/UserCompanyStatsSkeleton'
import { useUsersQuery } from '@/hooks/queries/useUsers'

export const UserCompanyStatsWidget = () => {
  const { data: users, isLoading, error } = useUsersQuery()

  const companyStats = getUserCompanyStatsConfig(users)

  return (
    <QueryAsyncBoundary
      queryState={{ isLoading, error, data: users }}
      loadingComponent={<UserCompanyStatsSkeleton />}
      emptyComponent={<UserCompanyStatsEmpty className="h-full" />}
      isEmpty={(data) => !data || data.length === 0}
    >
      <div className="grid grid-cols-1 lg:grid-cols-5 divide-y lg:divide-y-0 lg:divide-x divide-border h-full bg-card">
        {companyStats.map((stat) => (
          <div key={stat.id} className="p-6 h-full">
            <UserCompanyStatsItem {...stat} />
          </div>
        ))}
      </div>
    </QueryAsyncBoundary>
  )
}
