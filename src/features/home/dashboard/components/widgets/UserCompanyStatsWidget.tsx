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
      <div className="overflow-hidden h-full bg-card">
        <div className="flex flex-wrap -mt-px -ml-px min-h-full overflow-auto h-full">
          {companyStats.map((stat) => (
            <div
              key={stat.id}
              className="p-6 min-w-[180px] flex-1 border-l border-t border-border"
            >
              <UserCompanyStatsItem {...stat} />
            </div>
          ))}
        </div>
      </div>
    </QueryAsyncBoundary>
  )
}
