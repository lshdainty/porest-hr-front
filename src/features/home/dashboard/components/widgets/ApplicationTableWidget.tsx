import QueryAsyncBoundary from '@/components/common/QueryAsyncBoundary'
import { useUser } from '@/contexts/UserContext'
import { ApplicationTableContent } from '@/features/vacation/application/components/ApplicationTableContent'
import { ApplicationTableSkeleton } from '@/features/vacation/application/components/ApplicationTableSkeleton'
import { useGrantStatusTypesQuery } from '@/hooks/queries/useTypes'
import { useUserRequestedVacationsQuery } from '@/hooks/queries/useVacations'

export const ApplicationTableWidget = () => {
  const { loginUser } = useUser()
  const userId = loginUser?.user_id || ''

  const { data: vacationRequests, isLoading: requestsLoading, error: requestsError } = useUserRequestedVacationsQuery(userId)
  const { data: grantStatusTypes, isLoading: typesLoading, error: typesError } = useGrantStatusTypesQuery()

  const isLoading = requestsLoading || typesLoading
  const error = requestsError || typesError

  return (
    <QueryAsyncBoundary
      queryState={{ isLoading, error, data: vacationRequests }}
      loadingComponent={<ApplicationTableSkeleton />}
    >
      <ApplicationTableContent
        vacationRequests={vacationRequests || []}
        grantStatusTypes={grantStatusTypes || []}
        stickyHeader={true}
        className="h-full"
      />
    </QueryAsyncBoundary>
  )
}
