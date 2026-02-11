import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useCalendar } from '@/features/calendar/model/calendar-context';

import { DayCell } from '@/features/calendar/ui/month-view/day-cell';
import { DragSelectProvider } from '@/features/calendar/model/drag-select-context';

import { calculateMonthEventPositions, getCalendarCells } from '@/features/calendar/lib/helpers';

import type { IEvent } from '@/features/calendar/model/interfaces';

interface IProps {
  singleDayEvents: IEvent[];
  multiDayEvents: IEvent[];
}

const WEEK_DAYS_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WEEK_DAYS_KO = ['일', '월', '화', '수', '목', '금', '토'];

const CalendarMonthView = ({ singleDayEvents, multiDayEvents }: IProps) => {
  const { i18n } = useTranslation();
  const { selectedDate } = useCalendar();

  const weekDays = i18n.language === 'ko' ? WEEK_DAYS_KO : WEEK_DAYS_EN;
  const allEvents = [...multiDayEvents, ...singleDayEvents];

  const cells = useMemo(() => getCalendarCells(selectedDate), [selectedDate]);

  const eventPositions = useMemo(
    () => calculateMonthEventPositions(multiDayEvents, singleDayEvents, selectedDate),
    [multiDayEvents, singleDayEvents, selectedDate]
  );

  return (
    <DragSelectProvider>
      <div className='flex flex-col h-full'>
        {/* Fixed header with weekdays */}
        <div className='grid grid-cols-7 divide-x border-b flex-shrink-0'>
          {weekDays.map((day, index) => {
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
    </DragSelectProvider>
  )
}

export { CalendarMonthView };

