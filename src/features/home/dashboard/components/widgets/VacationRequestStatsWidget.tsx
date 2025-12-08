import QueryAsyncBoundary from '@/components/common/QueryAsyncBoundary'
import { useUser } from '@/contexts/UserContext'
import { VacationRequestStatsEmpty } from '@/features/vacation/application/components/VacationRequestStatsEmpty'
import VacationRequestStatsItem, { getVacationRequestStatsConfig } from '@/features/vacation/application/components/VacationRequestStatsItem'
import { VacationRequestStatsSkeleton } from '@/features/vacation/application/components/VacationRequestStatsSkeleton'
import { useUserRequestedVacationStatsQuery } from '@/hooks/queries/useVacations'
import { useTranslation } from 'react-i18next'

export const VacationRequestStatsWidget = () => {
  const { t } = useTranslation('vacation')
  const { loginUser } = useUser()
  const userId = loginUser?.user_id || ''

  const { data: stats, isLoading, error } = useUserRequestedVacationStatsQuery(userId)

  const statsConfig = getVacationRequestStatsConfig(stats, t)

  return (
    <QueryAsyncBoundary
      queryState={{ isLoading, error, data: stats }}
      loadingComponent={<VacationRequestStatsSkeleton />}
      emptyComponent={<VacationRequestStatsEmpty className="h-full" />}
      isEmpty={(data) => !data}
    >
      <div className="w-full h-full overflow-x-auto">
        <div className="flex flex-wrap h-full items-stretch bg-card">
          {statsConfig.map((item) => (
            <div
              key={item.id}
              className="p-6 border-r border-border min-w-[140px] flex-1"
            >
              <VacationRequestStatsItem {...item} />
            </div>
          ))}
        </div>
      </div>
    </QueryAsyncBoundary>
  )
}
