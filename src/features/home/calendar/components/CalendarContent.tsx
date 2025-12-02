'use client';

import dayjs from 'dayjs';
import { useEffect, useMemo } from 'react';

import { ClientContainer } from '@/features/home/calendar/components/client-container';
import { useCalendar } from '@/features/home/calendar/contexts/calendar-context';
import { convertApiEvents } from '@/features/home/calendar/helpers';
import { useEventsByPeriodQuery } from '@/hooks/queries/useCalendars';
import { useHolidaysByPeriodQuery } from '@/hooks/queries/useHolidays';

// CalendarProvider 내부에서 동작하는 컴포넌트
const CalendarContent = () => {
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
    dayjs(holidayRange.start).format('YYYY-MM-DD'),
    dayjs(holidayRange.end).format('YYYY-MM-DD'),
    'KR'
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

  return <ClientContainer />
}

export default CalendarContent
