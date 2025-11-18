import dayjs from 'dayjs';
import { addDays, areIntervalsOverlapping, format, isSameDay, parseISO, startOfWeek } from 'date-fns';

import { useCalendar } from '@/components/big-calendar/contexts/calendar-context';

import { ScrollArea } from '@/components/shadcn/scrollArea';

import { AddEventDialog } from '@/components/big-calendar/components/dialogs/add-event-dialog';
import { DroppableTimeBlock } from '@/components/big-calendar/components/dnd/droppable-time-block';
import { CalendarTimeline } from '@/components/big-calendar/components/week-and-day-view/calendar-time-line';
import { EventBlock } from '@/components/big-calendar/components/week-and-day-view/event-block';
import { WeekViewMultiDayEventsRow } from '@/components/big-calendar/components/week-and-day-view/week-view-multi-day-events-row';

import { getEventBlockStyle, getVisibleHours, groupEvents, isWorkingHour } from '@/components/big-calendar/helpers';
import { cn } from '@/lib/utils';

import type { IEvent } from '@/components/big-calendar/interfaces';

interface IProps {
  singleDayEvents: IEvent[];
  multiDayEvents: IEvent[];
}

export function CalendarWeekView({ singleDayEvents, multiDayEvents }: IProps) {
  const { selectedDate, workingHours, visibleHours, findHolidayByDate } = useCalendar();

  const { hours, earliestEventHour, latestEventHour } = getVisibleHours(visibleHours, singleDayEvents);

  const weekStart = startOfWeek(selectedDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <div className='w-full h-full'>
      <div className='flex flex-col items-center justify-center border-b py-4 text-sm text-muted-foreground sm:hidden'>
        <p>Weekly view is not available on smaller devices.</p>
        <p>Please switch to daily or monthly view.</p>
      </div>

      <div className='hidden h-full flex-col sm:flex'>
        <div>
          <WeekViewMultiDayEventsRow selectedDate={selectedDate} multiDayEvents={multiDayEvents} />

          {/* Week header */}
          <div className='relative z-20 flex border-b'>
            <div className='w-18'></div>
            <div className='grid flex-1 grid-cols-7 divide-x border-l'>
              {weekDays.map((day, index) => {
                const dayOfWeek = day.getDay();
                const isSunday = dayOfWeek === 0;
                const isSaturday = dayOfWeek === 6;

                // 공휴일 정보 가져오기
                const holiday = findHolidayByDate(dayjs(day).format('YYYYMMDD'));

                // 공휴일 색상 결정
                let holidayColor = '';
                if (holiday) {
                  if (holiday.holiday_type === 'PUBLIC' || holiday.holiday_type === 'SUBSTITUTE') {
                    holidayColor = '#ff6767'; // 빨강
                  } else if (holiday.holiday_type === 'ETC') {
                    holidayColor = '#6767ff'; // 파랑
                  }
                }

                const textColor = holidayColor || (isSunday ? '#ff6767' : isSaturday ? '#6767ff' : undefined);

                return (
                  <div key={index} className='py-2 text-center text-xs font-medium'>
                    <div style={{ color: textColor }}>
                      {format(day, 'EE')} <span className='ml-1 font-semibold'>{format(day, 'd')}</span>
                    </div>
                    {holiday && (
                      <div className='text-xs mt-0.5' style={{ color: holidayColor }}>
                        {holiday.holiday_name}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <ScrollArea className='flex-1' type='always'>
          <div className='flex overflow-hidden'>
            {/* Hours column */}
            <div className='relative w-18'>
              {hours.map((hour, index) => (
                <div key={hour} className='relative' style={{ height: '96px' }}>
                  <div className='absolute -top-3 right-2 flex h-6 items-center'>
                    {index !== 0 && <span className='text-xs text-muted-foreground'>{format(new Date().setHours(hour, 0, 0, 0), 'hh a')}</span>}
                  </div>
                </div>
              ))}
            </div>

            {/* Week grid */}
            <div className='relative flex-1 border-l'>
              <div className='grid grid-cols-7 divide-x'>
                {weekDays.map((day, dayIndex) => {
                  const dayEvents = singleDayEvents.filter(event => isSameDay(parseISO(event.startDate), day) || isSameDay(parseISO(event.endDate), day));
                  const groupedEvents = groupEvents(dayEvents);

                  return (
                    <div key={dayIndex} className='relative'>
                      {hours.map((hour, index) => {
                        const isDisabled = !isWorkingHour(day, hour, workingHours);

                        return (
                          <div key={hour} className={cn('relative', isDisabled && 'bg-calendar-disabled-hour')} style={{ height: '96px' }}>
                            {index !== 0 && <div className='pointer-events-none absolute inset-x-0 top-0 border-b'></div>}

                            <DroppableTimeBlock date={day} hour={hour} minute={0}>
                              <AddEventDialog startDate={day} startTime={{ hour, minute: 0 }}>
                                <div className='absolute inset-x-0 top-0 h-[48px] cursor-pointer transition-colors hover:bg-accent' />
                              </AddEventDialog>
                            </DroppableTimeBlock>

                            <div className='pointer-events-none absolute inset-x-0 top-1/2 border-b border-dashed'></div>

                            <DroppableTimeBlock date={day} hour={hour} minute={30}>
                              <AddEventDialog startDate={day} startTime={{ hour, minute: 30 }}>
                                <div className='absolute inset-x-0 top-[48px] h-[48px] cursor-pointer transition-colors hover:bg-accent' />
                              </AddEventDialog>
                            </DroppableTimeBlock>
                          </div>
                        );
                      })}

                      {groupedEvents.map((group, groupIndex) =>
                        group.map(event => {
                          let style = getEventBlockStyle(event, day, groupIndex, groupedEvents.length, { from: earliestEventHour, to: latestEventHour });
                          const hasOverlap = groupedEvents.some(
                            (otherGroup, otherIndex) =>
                              otherIndex !== groupIndex &&
                              otherGroup.some(otherEvent =>
                                areIntervalsOverlapping(
                                  { start: parseISO(event.startDate), end: parseISO(event.endDate) },
                                  { start: parseISO(otherEvent.startDate), end: parseISO(otherEvent.endDate) }
                                )
                              )
                          );

                          if (!hasOverlap) style = { ...style, width: '100%', left: '0%' };

                          return (
                            <div key={event.id} className='absolute p-1' style={style}>
                              <EventBlock event={event} />
                            </div>
                          );
                        })
                      )}
                    </div>
                  );
                })}
              </div>

              <CalendarTimeline firstVisibleHour={earliestEventHour} lastVisibleHour={latestEventHour} />
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
