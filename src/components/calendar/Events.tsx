import { useDeleteSchedule } from '@/api/schedule';
import { useDeleteVacationUsage } from '@/api/vacation';
import { Button } from '@/components/shadcn/button';
import { convertColorCode } from '@/hooks/useCalendarType';
import { useIsMobile } from '@/hooks/useMobile';
import { CalendarEvent, CustomEvent } from '@/store/CalendarEventStore';
import { Circle } from '@mui/icons-material';
import { Popover } from 'antd';
import dayjs from 'dayjs';
import { Clock4, FileText, Trash, UserRound } from 'lucide-react';
import { useEffect } from 'react';
import { EventProps } from 'react-big-calendar';

export const convertEventStyle = (event: CalendarEvent | any) => {
  return {
    style: {
      backgroundColor: convertColorCode(event.resource.calendarType),
      opacity: event.resource.isOffDay ? 0.5 : 1
    }
  };
}

const EventPopup: React.FC<EventProps> = (props) => {
  const event = props.event as CalendarEvent;
  const resource = props.event.resource as CustomEvent;
  const start = (resource.isAllDay === true) ? dayjs(event.start).format('YYYY-MM-DD') : dayjs(event.start).format('YYYY-MM-DD HH:mm');
  const end = (resource.isAllDay === true) ? dayjs(event.end).format('YYYY-MM-DD') : dayjs(event.end).format('HH:mm');

  const {mutate: deleteVacationHistory} = useDeleteVacationUsage();
  const {mutate: deleteSchedule} = useDeleteSchedule();

  const onDeleteEvent = () => {
    if (resource.domainType === 'vacation') {
      resource.historyIds.forEach(id => {
        deleteVacationHistory(id);
      });
    } else {
      deleteSchedule(resource.scheduleId);
    }
  }

  return (
    <>
      <div className='p-4'>
        <div className='text-sm font-bold leading-relaxed break-all mb-2.5'>{`${resource.userName} ${resource.calendarName}`}</div>
        <div className='flex items-center text-xs leading-[1.7]'><Clock4 className='w-3 h-3 mr-1' />{`${start} - ${end}`}</div>
        <div className='flex items-center text-xs leading-[1.7]'><UserRound className='w-3 h-3 mr-1' />{resource.userName}</div>
        <div className='flex items-center text-xs leading-[1.7]'><Circle sx={{fontSize: '12px', lineHeight: '1.7', marginRight: '4px', color:resource.colorCode}} />{resource.calendarName}</div>
        <div className='flex items-center text-xs leading-[1.7]'><FileText className='w-3 h-3 mr-1' />{resource.calendarDesc}</div>
        <div className='flex justify-end'>
          <Button variant='destructive' size='icon' className='size-6' onClick={() => onDeleteEvent()}><Trash /></Button>
        </div>
      </div>
      <div className='absolute rounded-t-[4px] w-full h-1 border-0 top-0' style={{backgroundColor:resource.colorCode}}></div>
    </>
  );
}

const Events: React.FC<EventProps> = (props) => {
  const event = props.event as CalendarEvent;
  const isMobile = useIsMobile();

  useEffect(() => {
    const anchorEl = document.querySelectorAll('.rbc-addons-dnd-resize-ew-anchor');
    anchorEl.forEach((element) => {
      const el = element as HTMLElement;
      isMobile ? el.style.top = '5px' : el.style.top = '7px';
    });
  }, [isMobile]);

  useEffect(() => {
    const rbcRowSegmentEl = document.querySelectorAll('.rbc-row-segment');
    rbcRowSegmentEl.forEach((element) => {
      const el = element as HTMLElement;
      el.style.padding = '1px 4px 1px 3px';
    });

    const rbcEventEl = document.querySelectorAll('.rbc-event');
    rbcEventEl.forEach((element) => {
      const el = element as HTMLElement;
      el.style.padding = '1px 5px';
    });
  }, [])

  return (
    <Popover
      content={<EventPopup {...props} />}
      trigger='click'
      styles={{
        body: {
          borderRadius: '4px',
          padding: 'unset'
        }
      }}
    >
      <div className={isMobile ? 'text-sm pl-1' : 'text-base pl-1'}>
        {`${event.resource.userName} ${event.resource.calendarName}`}
      </div>
    </Popover>
  );
}

export default Events;