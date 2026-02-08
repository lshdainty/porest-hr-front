import QueryAsyncBoundary from '@/shared/ui/async-boundary/QueryAsyncBoundary'
import { useUser } from '@/entities/session'
import { ApplicationTableContent } from '@/features/vacation-application/ui/ApplicationTableContent'
import { ApplicationTableSkeleton } from '@/features/vacation-application/ui/ApplicationTableSkeleton'
import { useGrantStatusTypesQuery } from '@/entities/type'
import { useUserRequestedVacationsQuery } from '@/entities/vacation'

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
