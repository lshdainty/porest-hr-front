import QueryAsyncBoundary from '@/components/common/QueryAsyncBoundary'
import { UserBirthDuesContent } from '@/features/culture/dues/components/UserBirthDuesContent'
import { UserBirthDuesEmpty } from '@/features/culture/dues/components/UserBirthDuesEmpty'
import { UserBirthDuesSkeleton } from '@/features/culture/dues/components/UserBirthDuesSkeleton'
import { useUsersMonthBirthDuesQuery } from '@/hooks/queries/useDues'
import { useUsersQuery } from '@/hooks/queries/useUsers'
import dayjs from 'dayjs'

export const UserBirthDuesWidget = () => {
  const currentYear = dayjs().year()

  const { data: usersBirthDues, isLoading: birthDuesLoading, error: birthDuesError } = useUsersMonthBirthDuesQuery(currentYear)
  const { data: users, isLoading: usersLoading, error: usersError } = useUsersQuery()

  const isLoading = birthDuesLoading || usersLoading
  const error = birthDuesError || usersError

  return (
    <QueryAsyncBoundary
      queryState={{ isLoading, error, data: usersBirthDues }}
      loadingComponent={<UserBirthDuesSkeleton />}
      emptyComponent={<UserBirthDuesEmpty className="h-full" />}
      isEmpty={(data) => !data || data.length === 0 || !users || users.length === 0}
    >
      <div className="h-full w-full p-4 overflow-auto">
        <UserBirthDuesContent usersBirthDues={usersBirthDues} users={users} />
      </div>
    </QueryAsyncBoundary>
  )
}
