'use client';

import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';

import { ClientContainer } from '@/components/calendar/components/client-container';
import { CalendarProvider, useCalendar } from '@/components/calendar/contexts/calendar-context';
import { convertApiEvents } from '@/components/calendar/helpers';
import { useEventsByPeriodQuery } from '@/hooks/queries/useCalendars';
import { useHolidaysByPeriodQuery } from '@/hooks/queries/useHolidays';
import { useUsersQuery } from '@/hooks/queries/useUsers';

import type { IEvent, IUser } from '@/components/calendar/interfaces';

// CalendarProvider 내부에서 동작하는 컴포넌트
function CalendarContent() {
  const { selectedDate, view, users, setLocalEvents, setHolidays } = useCalendar();

  // selectedDate와 view에 따라 이벤트 날짜 범위 계산
  const eventRange = useMemo(() => {
    let start: Date;
    let end: Date;

    switch (view) {
      case 'month':
      case 'agenda':
        start = dayjs(selectedDate).startOf('month').startOf('week').toDate();
        end = dayjs(selectedDate).endOf('month').endOf('week').toDate();
        break;
      case 'week':
      case 'day':
        start = dayjs(selectedDate).startOf('week').toDate();
        end = dayjs(selectedDate).endOf('week').toDate();
        break;
      case 'year':
        start = dayjs(selectedDate).startOf('year').toDate();
        end = dayjs(selectedDate).endOf('year').toDate();
        break;
      default:
        start = dayjs(selectedDate).startOf('month').startOf('week').toDate();
        end = dayjs(selectedDate).endOf('month').endOf('week').toDate();
    }

    return { start, end };
  }, [selectedDate, view]);

  // 공휴일은 현재 연도 전체 (1월 1일 ~ 12월 31일)
  const holidayRange = useMemo(() => {
    const start = dayjs(selectedDate).startOf('year').toDate();
    const end = dayjs(selectedDate).endOf('year').toDate();
    return { start, end };
  }, [selectedDate]);

  // 이벤트 API 호출 - eventRange가 변경될 때마다 재호출
  const { data: apiEvents, isLoading: eventsLoading } = useEventsByPeriodQuery(
    dayjs(eventRange.start).format('YYYY-MM-DDTHH:mm:ss'),
    dayjs(eventRange.end).format('YYYY-MM-DDTHH:mm:ss')
  );

  // 공휴일 API 호출 - 현재 연도의 1월 1일 ~ 12월 31일
  const { data: apiHolidays, isLoading: holidaysLoading } = useHolidaysByPeriodQuery(
    dayjs(holidayRange.start).format('YYYYMMDD'),
    dayjs(holidayRange.end).format('YYYYMMDD')
  );

  // API 응답을 받아서 변환 후 context 업데이트
  useEffect(() => {
    if (apiEvents && !eventsLoading && users.length > 0) {
      try {
        const { events } = convertApiEvents(apiEvents, users.map(u => ({
          user_id: u.id,
          user_name: u.name,
          profile_url: u.picturePath || ''
        })));
        setLocalEvents(events);
      } catch (error) {
        console.error('Error converting API events:', error);
        setLocalEvents([]);
      }
    }
  }, [apiEvents, eventsLoading, users, setLocalEvents]);

  // 공휴일 응답을 받아서 context 업데이트
  useEffect(() => {
    if (apiHolidays && !holidaysLoading) {
      setHolidays(apiHolidays);
    }
  }, [apiHolidays, holidaysLoading, setHolidays]);

  return <ClientContainer />;
}

// 외부 컴포넌트: users 데이터만 한 번 가져오고 CalendarProvider에 전달
export default function Calendar() {
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
}