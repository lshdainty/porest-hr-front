"use client";

import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";

import { useGetEventsByPeriod } from "@/api/calendar";
import { useGetUsers } from "@/api/user";
import { ClientContainer } from "@/components/big-calendar/components/client-container";
import { CalendarProvider, useCalendar } from "@/components/big-calendar/contexts/calendar-context";
import { convertApiEvents } from "@/components/big-calendar/helpers";

import type { IEvent, IUser } from "@/components/big-calendar/interfaces";

// CalendarProvider 내부에서 동작하는 컴포넌트
function BigCalendarContent() {
  const { selectedDate, view, users, setLocalEvents } = useCalendar();

  // selectedDate와 view에 따라 날짜 범위 계산
  const range = useMemo(() => {
    let start: Date;
    let end: Date;

    switch (view) {
      case 'month':
      case 'agenda':
        start = dayjs(selectedDate).startOf('month').startOf('week').toDate();
        end = dayjs(selectedDate).endOf('month').endOf('week').toDate();
        break;
      case 'week':
        start = dayjs(selectedDate).startOf('week').toDate();
        end = dayjs(selectedDate).endOf('week').toDate();
        break;
      case 'day':
        start = dayjs(selectedDate).startOf('day').toDate();
        end = dayjs(selectedDate).endOf('day').toDate();
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

  console.log('BigCalendar - 날짜 범위:', {
    view,
    selectedDate: dayjs(selectedDate).format('YYYY-MM-DD'),
    start: dayjs(range.start).format('YYYY-MM-DDTHH:mm:ss'),
    end: dayjs(range.end).format('YYYY-MM-DDTHH:mm:ss')
  });

  // API 호출 - range가 변경될 때마다 재호출
  const { data: apiEvents, isLoading: eventsLoading } = useGetEventsByPeriod({
    start_date: dayjs(range.start).format('YYYY-MM-DDTHH:mm:ss'),
    end_date: dayjs(range.end).format('YYYY-MM-DDTHH:mm:ss')
  });

  console.log('BigCalendar - API 호출 결과:', { apiEvents, eventsLoading });

  // API 응답을 받아서 변환 후 context 업데이트
  useEffect(() => {
    if (apiEvents && !eventsLoading && users.length > 0) {
      try {
        console.log('BigCalendar - 데이터 변환 시작');
        const { events } = convertApiEvents(apiEvents, users.map(u => ({
          user_id: u.id,
          user_name: u.name,
          profile_url: u.picturePath || ''
        })));
        console.log('BigCalendar - 변환된 이벤트 개수:', events.length);
        setLocalEvents(events);
      } catch (error) {
        console.error('Error converting API events:', error);
        setLocalEvents([]);
      }
    }
  }, [apiEvents, eventsLoading, users, setLocalEvents]);

  return <ClientContainer />;
}

// 외부 컴포넌트: users 데이터만 한 번 가져오고 CalendarProvider에 전달
export default function BigCalendar() {
  const { data: apiUsers, isLoading: usersLoading } = useGetUsers();

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
      <CalendarProvider users={users} events={initialEvents} initialView="month">
        <BigCalendarContent />
      </CalendarProvider>
    </div>
  );
}