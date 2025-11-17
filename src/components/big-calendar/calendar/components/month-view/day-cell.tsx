import { isToday, startOfDay } from 'date-fns';
import { useMemo } from 'react';

import { useCalendar } from '@/components/big-calendar/calendar/contexts/calendar-context';

import { DroppableDayCell } from '@/components/big-calendar/calendar/components/dnd/droppable-day-cell';
import { EventBullet } from '@/components/big-calendar/calendar/components/month-view/event-bullet';
import { MonthEventBadge } from '@/components/big-calendar/calendar/components/month-view/month-event-badge';

import { getMonthCellEvents } from '@/components/big-calendar/calendar/helpers';
import { cn } from '@/lib/utils';

import type { ICalendarCell, IEvent } from '@/components/big-calendar/calendar/interfaces';

interface IProps {
  cell: ICalendarCell;
  events: IEvent[];
  eventPositions: Record<string, number>;
}

const MAX_VISIBLE_EVENTS = 3;

export function DayCell({ cell, events, eventPositions }: IProps) {
  const { setSelectedDate, setView } = useCalendar();

  const { day, currentMonth, date } = cell;

  const cellEvents = useMemo(() => getMonthCellEvents(date, events, eventPositions), [date, events, eventPositions]);
  const isSunday = date.getDay() === 0;
  const isSaturday = date.getDay() === 6;

  const handleClick = () => {
    setSelectedDate(date);
    setView('day');
  };

  return (
    <DroppableDayCell cell={cell}>
      <div className={cn('flex h-full flex-col gap-1 border-l border-t py-1.5 lg:pb-2 lg:pt-1', isSunday && 'border-l-0')}>
        {/* 첫 번째 줄: 날짜와 more */}
        <div className='flex items-center justify-between px-1'>
          <button
            onClick={handleClick}
            className={cn(
              'flex size-6 items-center justify-center rounded-full text-xs font-semibold hover:bg-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring flex-shrink-0',
              !currentMonth && 'opacity-20',
              isToday(date) && 'bg-primary font-bold text-primary-foreground hover:bg-primary'
            )}
            style={{
              color: isToday(date) ? undefined : isSunday ? '#ff6767' : isSaturday ? '#6767ff' : undefined
            }}
          >
            {day}
          </button>

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
                    <EventBullet className='lg:hidden' color={event.color} />
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
