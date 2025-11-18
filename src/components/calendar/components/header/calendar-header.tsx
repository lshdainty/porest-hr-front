import { CalendarRange, Columns, Grid2x2, Grid3x3, List, Plus } from 'lucide-react';

import { useCalendar } from '@/components/calendar/contexts/calendar-context';
import { Button } from '@/components/shadcn/button';

import { AddEventDialog } from '@/components/calendar/components/dialogs/add-event-dialog';
import { DateNavigator } from '@/components/calendar/components/header/date-navigator';
import { EventFilter } from '@/components/calendar/components/header/event-filter';
import { TodayButton } from '@/components/calendar/components/header/today-button';

import type { IEvent } from '@/components/calendar/interfaces';

interface IProps {
  events: IEvent[];
}

export function CalendarHeader({ events }: IProps) {
  const { view, setView } = useCalendar();
  return (
    <div className='flex flex-col gap-4 border-b p-4 lg:flex-row lg:items-center lg:justify-between'>
      <div className='flex items-center gap-3'>
        <TodayButton />
        <DateNavigator view={view} events={events} />
      </div>

      <div className='flex flex-col items-center gap-1.5 sm:flex-row sm:justify-between'>
        <div className='flex w-full items-center gap-1.5'>
          <div className='inline-flex first:rounded-r-none last:rounded-l-none [&:not(:first-child):not(:last-child)]:rounded-none'>
            <Button
              aria-label='View by day'
              size='icon'
              variant={view === 'day' ? 'default' : 'outline'}
              className='rounded-r-none [&_svg]:size-10'
              onClick={() => setView('day')}
            >
              <List strokeWidth={1.8} />
            </Button>

            <Button
              aria-label='View by week'
              size='icon'
              variant={view === 'week' ? 'default' : 'outline'}
              className='-ml-px rounded-none [&_svg]:size-10'
              onClick={() => setView('week')}
            >
              <Columns strokeWidth={1.8} />
            </Button>

            <Button
              aria-label='View by month'
              size='icon'
              variant={view === 'month' ? 'default' : 'outline'}
              className='-ml-px rounded-none [&_svg]:size-10'
              onClick={() => setView('month')}
            >
              <Grid2x2 strokeWidth={1.8} />
            </Button>

            <Button
              aria-label='View by year'
              size='icon'
              variant={view === 'year' ? 'default' : 'outline'}
              className='-ml-px rounded-none [&_svg]:size-10'
              onClick={() => setView('year')}
            >
              <Grid3x3 strokeWidth={1.8} />
            </Button>

            <Button
              aria-label='View by agenda'
              size='icon'
              variant={view === 'agenda' ? 'default' : 'outline'}
              className='-ml-px rounded-l-none [&_svg]:size-10'
              onClick={() => setView('agenda')}
            >
              <CalendarRange strokeWidth={1.8} />
            </Button>
          </div>

          <EventFilter />
        </div>

        <AddEventDialog>
          <Button className='w-full sm:w-auto'>
            <Plus />
            Add Event
          </Button>
        </AddEventDialog>
      </div>
    </div>
  );
}
