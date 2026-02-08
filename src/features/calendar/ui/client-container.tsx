'use client';

import { isSameDay, parseISO } from 'date-fns';
import { useMemo } from 'react';

import { useCalendar } from '@/features/calendar/model/calendar-context';

import { DndProviderWrapper } from '@/features/calendar/ui/dnd/dnd-provider';

import { CalendarAgendaView } from '@/features/calendar/ui/agenda-view/calendar-agenda-view';
import { CalendarAgendaViewSkeleton } from '@/features/calendar/ui/agenda-view/calendar-agenda-view-skeleton';
import { CalendarHeader } from '@/features/calendar/ui/header/calendar-header';
import { CalendarMonthView } from '@/features/calendar/ui/month-view/calendar-month-view';
import { CalendarMonthViewSkeleton } from '@/features/calendar/ui/month-view/calendar-month-view-skeleton';
import { CalendarDayView } from '@/features/calendar/ui/week-and-day-view/calendar-day-view';
import { CalendarDayViewSkeleton } from '@/features/calendar/ui/week-and-day-view/calendar-day-view-skeleton';
import { CalendarWeekView } from '@/features/calendar/ui/week-and-day-view/calendar-week-view';
import { CalendarWeekViewSkeleton } from '@/features/calendar/ui/week-and-day-view/calendar-week-view-skeleton';
import { CalendarYearView } from '@/features/calendar/ui/year-view/calendar-year-view';
import { CalendarYearViewSkeleton } from '@/features/calendar/ui/year-view/calendar-year-view-skeleton';

interface IProps {
  isLoading?: boolean
}

const ClientContainer = ({ isLoading = false }: IProps) => {
  const { selectedDate, selectedUserIds, selectedTypeIds, events, view } = useCalendar();

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const eventStartDate = parseISO(event.startDate);
      const eventEndDate = parseISO(event.endDate);

      const isUserMatch = selectedUserIds === 'all' || selectedUserIds.includes(event.user.id);
      const isTypeMatch = selectedTypeIds === 'all' || selectedTypeIds.includes(event.type.id);

      if (view === 'year') {
        const yearStart = new Date(selectedDate.getFullYear(), 0, 1);
        const yearEnd = new Date(selectedDate.getFullYear(), 11, 31, 23, 59, 59, 999);
        const isInSelectedYear = eventStartDate <= yearEnd && eventEndDate >= yearStart;
        return isInSelectedYear && isUserMatch && isTypeMatch;
      }

      if (view === 'month' || view === 'agenda') {
        const monthStart = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
        const monthEnd = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0, 23, 59, 59, 999);
        const isInSelectedMonth = eventStartDate <= monthEnd && eventEndDate >= monthStart;
        return isInSelectedMonth && isUserMatch && isTypeMatch;
      }

      if (view === 'week') {
        const dayOfWeek = selectedDate.getDay();

        const weekStart = new Date(selectedDate);
        weekStart.setDate(selectedDate.getDate() - dayOfWeek);
        weekStart.setHours(0, 0, 0, 0);

        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        weekEnd.setHours(23, 59, 59, 999);

        const isInSelectedWeek = eventStartDate <= weekEnd && eventEndDate >= weekStart;
        return isInSelectedWeek && isUserMatch && isTypeMatch;
      }

      if (view === 'day') {
        const dayStart = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 0, 0, 0);
        const dayEnd = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 23, 59, 59);
        const isInSelectedDay = eventStartDate <= dayEnd && eventEndDate >= dayStart;
        return isInSelectedDay && isUserMatch && isTypeMatch;
      }
    });
  }, [selectedDate, selectedUserIds, selectedTypeIds, events, view]);

  const singleDayEvents = filteredEvents.filter(event => {
    const startDate = parseISO(event.startDate);
    const endDate = parseISO(event.endDate);
    return isSameDay(startDate, endDate);
  });

  const multiDayEvents = filteredEvents.filter(event => {
    const startDate = parseISO(event.startDate);
    const endDate = parseISO(event.endDate);
    return !isSameDay(startDate, endDate);
  });

  // For year view, we only care about the start date
  // by using the same date for both start and end,
  // we ensure only the start day will show a dot
  const eventStartDates = useMemo(() => {
    return filteredEvents.map(event => ({ ...event, endDate: event.startDate }));
  }, [filteredEvents]);

  return (
    <div className='w-full h-full flex flex-col overflow-hidden'>
      <CalendarHeader events={filteredEvents} />

      <div className='flex-1 overflow-hidden'>
        <DndProviderWrapper>
          {view === 'day' && (
            isLoading
              ? <CalendarDayViewSkeleton />
              : <CalendarDayView singleDayEvents={singleDayEvents} multiDayEvents={multiDayEvents} />
          )}
          {view === 'month' && (
            isLoading
              ? <CalendarMonthViewSkeleton />
              : <CalendarMonthView singleDayEvents={singleDayEvents} multiDayEvents={multiDayEvents} />
          )}
          {view === 'week' && (
            isLoading
              ? <CalendarWeekViewSkeleton />
              : <CalendarWeekView singleDayEvents={singleDayEvents} multiDayEvents={multiDayEvents} />
          )}
          {view === 'year' && (
            isLoading
              ? <CalendarYearViewSkeleton />
              : <CalendarYearView allEvents={eventStartDates} />
          )}
          {view === 'agenda' && (
            isLoading
              ? <CalendarAgendaViewSkeleton />
              : <CalendarAgendaView singleDayEvents={singleDayEvents} multiDayEvents={multiDayEvents} />
          )}
        </DndProviderWrapper>
      </div>
    </div>
  )
}

export { ClientContainer }
