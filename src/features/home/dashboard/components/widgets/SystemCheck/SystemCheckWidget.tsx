import QueryAsyncBoundary from '@/components/common/QueryAsyncBoundary'
import { SystemCheckContent } from '@/features/home/dashboard/components/widgets/SystemCheck/SystemCheckContent'
import { SystemCheckEmpty } from '@/features/home/dashboard/components/widgets/SystemCheck/SystemCheckEmpty'
import { SystemCheckSkeleton } from '@/features/home/dashboard/components/widgets/SystemCheck/SystemCheckSkeleton'
import { useSystemCheckStatusQuery, useSystemTypesQuery } from '@/hooks/queries/useWorks'
import { SystemType } from '@/lib/api/work'
import { useMemo } from 'react'

export const SystemCheckWidget = () => {
  const { data: systemTypes, isLoading: systemTypesLoading, error: systemTypesError } = useSystemTypesQuery()

  const systemCodes = useMemo(() => {
    if (!systemTypes) return []
    return systemTypes.map(type => type.code as SystemType)
  }, [systemTypes])

  const { data: statusData, isLoading: statusLoading, error: statusError, refetch } = useSystemCheckStatusQuery(systemCodes)

  const isLoading = systemTypesLoading || statusLoading
  const error = systemTypesError || statusError

  const sortedSystems = useMemo(() => {
    if (!systemTypes) return []

    return [...systemTypes]
      .sort((a, b) => (a.order_seq || 0) - (b.order_seq || 0))
      .map(type => {
        const status = statusData?.statuses.find(s => s.system_code === type.code)
        return {
          id: type.code as SystemType,
          name: type.name,
          description: `${type.name} Check`,
          checked: status?.checked ?? false
        }
      })
  }, [systemTypes, statusData])

  return (
    <QueryAsyncBoundary
      queryState={{ isLoading, error, data: systemTypes }}
      loadingComponent={<SystemCheckSkeleton />}
      emptyComponent={<SystemCheckEmpty />}
      isEmpty={(data) => !data || data.length === 0}
    >
      <SystemCheckContent systems={sortedSystems} onToggle={() => refetch()} />
    </QueryAsyncBoundary>
  )
}
