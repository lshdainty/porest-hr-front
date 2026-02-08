import { format } from 'date-fns';
import { enUS, ko } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useCalendar } from '@/features/calendar/model/calendar-context';

import { Badge } from '@/shared/ui/shadcn/badge';
import { Button } from '@/shared/ui/shadcn/button';

import { getEventsCount, navigateDate, rangeText } from '@/features/calendar/lib/helpers';

import type { IEvent } from '@/features/calendar/model/interfaces';
import type { TCalendarView } from '@/features/calendar/model/types';

interface IProps {
  view: TCalendarView;
  events: IEvent[];
}

const DateNavigator = ({ view, events }: IProps) => {
  const { t, i18n } = useTranslation('calendar');
  const { selectedDate, setSelectedDate } = useCalendar();

  const locale = i18n.language === 'ko' ? ko : enUS;
  const dateFormat = i18n.language === 'ko' ? 'yyyy년 M월' : 'MMMM yyyy';
  const formattedDate = format(selectedDate, dateFormat, { locale });

  const eventCount = useMemo(() => getEventsCount(events, selectedDate, view), [events, selectedDate, view]);

  const handlePrevious = () => setSelectedDate(navigateDate(selectedDate, view, 'previous'));
  const handleNext = () => setSelectedDate(navigateDate(selectedDate, view, 'next'));

  return (
    <div className='space-y-0.5'>
      <div className='flex items-center gap-2'>
        <span className='text-lg font-semibold'>
          {formattedDate}
        </span>
        <Badge variant='outline' className='px-1.5'>
          {t('header.eventCount', { count: eventCount })}
        </Badge>
      </div>

      <div className='flex items-center gap-2'>
        <Button variant='outline' className='size-6.5 px-0 [&_svg]:size-4.5' onClick={handlePrevious}>
          <ChevronLeft />
        </Button>

        <p className='text-sm text-muted-foreground'>{rangeText(view, selectedDate, locale)}</p>

        <Button variant='outline' className='size-6.5 px-0 [&_svg]:size-4.5' onClick={handleNext}>
          <ChevronRight />
        </Button>
      </div>
    </div>
  )
}

export { DateNavigator }
