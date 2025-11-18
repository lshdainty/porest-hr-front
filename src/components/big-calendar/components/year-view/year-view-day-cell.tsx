import dayjs from 'dayjs';
import { isToday } from 'date-fns';

import { useCalendar } from '@/components/big-calendar/contexts/calendar-context';

import { cn } from '@/lib/utils';

import type { IEvent } from '@/components/big-calendar/interfaces';

interface IProps {
  day: number;
  date: Date;
  events: IEvent[];
}

export function YearViewDayCell({ day, date, events }: IProps) {
  const { setSelectedDate, setView, findHolidayByDate } = useCalendar();

  const maxIndicators = 3;
  const eventCount = events.length;
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
    <button
      onClick={handleClick}
      type='button'
      className='flex h-11 flex-1 flex-col items-center justify-start gap-0.5 rounded-md pt-1 hover:bg-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
    >
      <div
        className={cn(
          'flex size-6 items-center justify-center rounded-full text-xs font-medium',
          isToday(date) && 'bg-primary font-semibold text-primary-foreground'
        )}
        style={{
          color: isToday(date) ? undefined : holidayColor || (isSunday ? '#ff6767' : isSaturday ? '#6767ff' : undefined)
        }}
      >
        {day}
      </div>

      {eventCount > 0 && (
        <div className='mt-0.5 flex gap-0.5'>
          {eventCount <= maxIndicators ? (
            events.map(event => (
              <div
                key={event.id}
                className={cn(
                  'size-1.5 rounded-full',
                  event.color === 'blue' && 'bg-blue-600',
                  event.color === 'green' && 'bg-green-600',
                  event.color === 'red' && 'bg-red-600',
                  event.color === 'yellow' && 'bg-yellow-600',
                  event.color === 'purple' && 'bg-purple-600',
                  event.color === 'orange' && 'bg-orange-600',
                  event.color === 'pink' && 'bg-pink-600',
                  event.color === 'gray' && 'bg-neutral-600',
                  event.color === 'teal' && 'bg-teal-600'
                )}
              />
            ))
          ) : (
            <>
              <div
                className={cn(
                  'size-1.5 rounded-full',
                  events[0].color === 'blue' && 'bg-blue-600',
                  events[0].color === 'green' && 'bg-green-600',
                  events[0].color === 'red' && 'bg-red-600',
                  events[0].color === 'yellow' && 'bg-yellow-600',
                  events[0].color === 'purple' && 'bg-purple-600',
                  events[0].color === 'orange' && 'bg-orange-600',
                  events[0].color === 'pink' && 'bg-pink-600',
                  events[0].color === 'gray' && 'bg-neutral-600',
                  events[0].color === 'teal' && 'bg-teal-600'
                )}
              />
              <span className='text-[7px] text-muted-foreground'>+{eventCount - 1}</span>
            </>
          )}
        </div>
      )}
    </button>
  );
}
