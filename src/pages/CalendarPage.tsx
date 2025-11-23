import CalendarContent from '@/features/home/calendar/components/CalendarContent';
import { CalendarProvider } from '@/features/home/calendar/contexts/calendar-context';
import { IEvent, IUser } from '@/features/home/calendar/interfaces';
import { useUsersQuery } from '@/hooks/queries/useUsers';
import { useEffect, useState } from 'react';

const CalendarPage = () => {
  const { data: apiUsers, isLoading: usersLoading } = useUsersQuery();

  // 초기 로딩용 빈 배열
  const [users, setUsers] = useState<IUser[]>([]);
  const [initialEvents] = useState<IEvent[]>([]);

  // 사용자 데이터 변환
  useEffect(() => {
    if (apiUsers && !usersLoading) {
      const convertedUsers = apiUsers.map(user => ({
        id: user.user_id,
        name: user.user_name,
        picturePath: user.profile_url || null,
      }));
      setUsers(convertedUsers);
    }
  }, [apiUsers, usersLoading]);

  // 사용자 로딩 중일 때
  if (usersLoading) {
    return (
      <div className='flex w-full h-full items-center justify-center'>
        <p>Loading calendar data...</p>
      </div>
    );
  }

  return (
    <div className='flex w-full h-full overflow-y-scroll'>
      <CalendarProvider users={users} events={initialEvents} initialView='month'>
        <CalendarContent />
      </CalendarProvider>
    </div>
  );
};

export default CalendarPage;
