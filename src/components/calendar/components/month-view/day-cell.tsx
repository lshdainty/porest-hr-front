import { isToday, startOfDay } from 'date-fns';
import dayjs from 'dayjs';
import { useMemo } from 'react';

import { useCalendar } from '@/components/calendar/contexts/calendar-context';

import { DroppableDayCell } from '@/components/calendar/components/dnd/droppable-day-cell';
import { EventBullet } from '@/components/calendar/components/month-view/event-bullet';
import { MonthEventBadge } from '@/components/calendar/components/month-view/month-event-badge';

import { getMonthCellEvents } from '@/components/calendar/helpers';
import { cn } from '@/lib/utils';

import type { ICalendarCell, IEvent } from '@/components/calendar/interfaces';

interface IProps {
  cell: ICalendarCell;
  events: IEvent[];
  eventPositions: Record<string, number>;
}

const MAX_VISIBLE_EVENTS = 3;

export function DayCell({ cell, events, eventPositions }: IProps) {
  const { setSelectedDate, setView, findHolidayByDate } = useCalendar();

  const { day, currentMonth, date } = cell;

  const cellEvents = useMemo(() => getMonthCellEvents(date, events, eventPositions), [date, events, eventPositions]);
  const isSunday = date.getDay() === 0;
  const isSaturday = date.getDay() === 6;

  // 공휴일 정보 가져오기
  const holiday = findHolidayByDate(dayjs(date).format('YYYYMMDD'));

  // 공휴일 색상 결정
  let holidayColor = '';
  if (holiday) {
    if (holiday.holiday_type === 'PUBLIC' || holiday.holiday_type === 'SUBSTITUTE') {
      holidayColor = '#ff6767'; // 빨강
    } else if (holiday.holiday_type === 'ETC') {
      holidayColor = '#6767ff'; // 파랑
    }
  }

  const handleClick = () => {
    setSelectedDate(date);
    setView('day');
  };

  return (
    <DroppableDayCell cell={cell}>
      <div className={cn('flex h-full flex-col gap-1 border-l border-t py-1.5 lg:pb-2 lg:pt-1', isSunday && 'border-l-0')}>
        {/* 첫 번째 줄: 날짜와 공휴일 */}
        <div className='flex items-center justify-between px-1'>
          <div className='flex items-center gap-1 flex-1 min-w-0'>
            <button
              onClick={handleClick}
              className={cn(
                'flex size-6 items-center justify-center rounded-full text-xs font-semibold hover:bg-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring flex-shrink-0',
                !currentMonth && 'opacity-20',
                isToday(date) && 'bg-primary font-bold text-primary-foreground hover:bg-primary'
              )}
              style={{
                color: isToday(date) ? undefined : holidayColor || (isSunday ? '#ff6767' : isSaturday ? '#6767ff' : undefined)
              }}
            >
              {day}
            </button>

            {holiday && (
              <span
                className={cn('hidden lg:block text-xs truncate', !currentMonth && 'opacity-20')}
                style={{ color: holidayColor }}
              >
                {holiday.holiday_name}
              </span>
            )}
          </div>

          {cellEvents.length > MAX_VISIBLE_EVENTS && (
            <button
              onClick={handleClick}
              className={cn(
                'text-xs font-semibold text-muted-foreground flex-shrink-0 px-0.5 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded',
                !currentMonth && 'opacity-50'
              )}
            >
              <span className='sm:hidden'>+{cellEvents.length - MAX_VISIBLE_EVENTS}</span>
              <span className='hidden sm:inline'>{cellEvents.length - MAX_VISIBLE_EVENTS} more</span>
            </button>
          )}
        </div>

        {/* 두 번째 줄: 이벤트들 */}
        <div className={cn('flex flex-1 h-6 gap-1 px-2 lg:flex-col lg:gap-2 lg:px-0', !currentMonth && 'opacity-50')}>
          {[0, 1, 2].map(position => {
            const event = cellEvents.find(e => e.position === position);
            const eventKey = event ? `event-${event.id}-${position}` : `empty-${position}`;

            return (
              <div key={eventKey} className='lg:min-h-[28px]'>
                {event && (
                  <>
                    <EventBullet className='lg:hidden' color={event.type.color} />
                    <MonthEventBadge className='hidden lg:flex' event={event} cellDate={startOfDay(date)} />
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </DroppableDayCell>
  );
}
