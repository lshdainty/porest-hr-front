import QueryAsyncBoundary from '@/shared/ui/async-boundary/QueryAsyncBoundary'
import { UserBirthDuesContent } from '@/features/culture-dues/ui/UserBirthDuesContent'
import { UserBirthDuesEmpty } from '@/features/culture-dues/ui/UserBirthDuesEmpty'
import { UserBirthDuesSkeleton } from '@/features/culture-dues/ui/UserBirthDuesSkeleton'
import { useUsersMonthBirthDuesQuery } from '@/entities/dues'
import { useUsersQuery } from '@/entities/user'
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
