import { useMemo } from 'react';

import { useCalendar } from '@/components/big-calendar/contexts/calendar-context';

import { DayCell } from '@/components/big-calendar/components/month-view/day-cell';

import { calculateMonthEventPositions, getCalendarCells } from '@/components/big-calendar/helpers';

import type { IEvent } from '@/components/big-calendar/interfaces';

interface IProps {
  singleDayEvents: IEvent[];
  multiDayEvents: IEvent[];
}

const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function CalendarMonthView({ singleDayEvents, multiDayEvents }: IProps) {
  const { selectedDate } = useCalendar();

  const allEvents = [...multiDayEvents, ...singleDayEvents];

  const cells = useMemo(() => getCalendarCells(selectedDate), [selectedDate]);

  const eventPositions = useMemo(
    () => calculateMonthEventPositions(multiDayEvents, singleDayEvents, selectedDate),
    [multiDayEvents, singleDayEvents, selectedDate]
  );

  return (
    <div className='flex flex-col h-full'>
      {/* Fixed header with weekdays */}
      <div className='grid grid-cols-7 divide-x border-b flex-shrink-0'>
        {WEEK_DAYS.map((day, index) => {
          const isSunday = index === 0;
          const isSaturday = index === 6;

          return (
            <div key={day} className='flex items-center justify-center py-2'>
              <span className='text-xs font-medium' style={{ color: isSunday ? '#ff6767' : isSaturday ? '#6767ff' : undefined }}>
                {day}
              </span>
            </div>
          );
        })}
      </div>

      {/* Scrollable calendar grid */}
      <div className='flex-1 overflow-y-auto scrollbar-hide'>
        <div className='grid grid-cols-7 auto-rows-fr h-full'>
          {cells.map(cell => (
            <DayCell key={cell.date.toISOString()} cell={cell} events={allEvents} eventPositions={eventPositions} />
          ))}
        </div>
      </div>
    </div>
  );
}
