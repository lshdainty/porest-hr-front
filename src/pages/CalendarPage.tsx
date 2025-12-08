import QueryAsyncBoundary from '@/components/common/QueryAsyncBoundary'
import { CalendarContent } from '@/features/home/calendar/components/CalendarContent'
import { CalendarMonthViewSkeleton } from '@/features/home/calendar/components/month-view/calendar-month-view-skeleton'
import { CalendarProvider } from '@/features/home/calendar/contexts/calendar-context'
import { IEvent, IUser } from '@/features/home/calendar/interfaces'
import { useUsersQuery } from '@/hooks/queries/useUsers'
import { useEffect, useState } from 'react'

const CalendarPage = () => {
  const { data: apiUsers, isLoading, error } = useUsersQuery()

  // 초기 로딩용 빈 배열
  const [users, setUsers] = useState<IUser[]>([])
  const [initialEvents] = useState<IEvent[]>([])

  // 사용자 데이터 변환
  useEffect(() => {
    if (apiUsers && !isLoading) {
      const convertedUsers = apiUsers.map(user => ({
        id: user.user_id,
        name: user.user_name,
        picturePath: user.profile_url || null,
      }))
      setUsers(convertedUsers)
    }
  }, [apiUsers, isLoading])

  return (
    <QueryAsyncBoundary
      queryState={{ isLoading, error, data: apiUsers }}
      loadingComponent={<CalendarMonthViewSkeleton />}
    >
      <div className='flex w-full h-full overflow-y-scroll'>
        <CalendarProvider users={users} events={initialEvents} initialView='month'>
          <CalendarContent />
        </CalendarProvider>
      </div>
    </QueryAsyncBoundary>
  )
}

export { CalendarPage }
