import { useGetEventsByPeriod } from '@/api/calendar';
import { useGetHolidaysByStartEndDate } from '@/api/holiday';
import Events, { convertEventStyle } from '@/components/calendar/Events';
import { Formats, MobileFormats } from '@/components/calendar/Formats';
import { MonthDateHeader, MonthHeader } from '@/components/calendar/Headers';
import { RegistEventDialog } from '@/components/calendar/RegistEventDialog';
import Toolbar from '@/components/calendar/Toolbar';
import { useIsMobile } from '@/hooks/useMobile';
import { CalendarEvent, useCalendarEventsStore } from '@/store/CalendarEventStore';
import { useCalendarSlotStore } from '@/store/CalendarSlotStore';
import { useCalendarVisibleStore } from '@/store/CalendarVisibleStore';
import { useHolidayStore } from '@/store/HolidayStore';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { useCallback, useEffect, useState } from 'react';
import { Calendar, dayjsLocalizer, Views } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';

import '@/components/calendar/index.scss';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const Content: React.FC = () => {
  const DragAndDropCalendar = withDragAndDrop(Calendar);
  const isMobile = useIsMobile();

  // local화
  dayjs.locale('ko');
  const localizer = dayjsLocalizer(dayjs);

  // event 관리
  const { events } = useCalendarEventsStore();
  const { resetEvents, setEventVisible } = useCalendarEventsStore(s => s.actions);
  const { userVisibles, calendarVisibles } = useCalendarVisibleStore();

  // 공휴일 관리
  const { baseYear } = useHolidayStore();
  const { setHolidays } = useHolidayStore(s => s.actions);

  // selectSlot 관리
  const { setSlots, setOpen } = useCalendarSlotStore(s => s.actions);

  // view 관리
  const [view, setView] = useState(Views.MONTH);
  const onView = useCallback((newView: any) => setView(newView), [setView]);

  // month 달력 범위 관리
  const [range, setRange] = useState<{start: Date, end: Date}>({
    start: dayjs(new Date()).startOf('month').startOf('week').toDate(),
    end: dayjs(new Date()).endOf('month').endOf('week').toDate()
  });

  // range 변경 부분
  const [date, setDate] = useState(new Date());
  const onNavigate = useCallback((newDate: Date) => setDate(newDate), [setDate]);
  const onRangeChange = useCallback((range: Date[] | {start: Date, end: Date}) => {
    if (Array.isArray(range)) {
      setRange({start: range[0], end: range[range.length - 1]});
    } else {
      setRange({start: range.start, end: range.end});
    }
  }, [resetEvents]);

  const {data: holidays, isLoading: holidaysLoading} = useGetHolidaysByStartEndDate({
    start_date: `${baseYear}0101`,
    end_date: `${baseYear}1231`
  });

  const {data: calendarData, isLoading: calendarLoading} = useGetEventsByPeriod({
    start_date: dayjs(range.start).format('YYYY-MM-DDTHH:mm:ss'),
    end_date: dayjs(range.end).format('YYYY-MM-DDTHH:mm:ss')
  });

  const handleSelectSlot = useCallback(({start, end}: { start: Date; end: Date; }) => {
    setSlots(start, dayjs(end).subtract(1, 'second').toDate());
    setOpen(true);
  }, [setSlots, setOpen]);

  useEffect(() => {
    if (holidays && !holidaysLoading) {
      setHolidays(holidays);
    }
  }, [holidays]);

  useEffect(() => {
    if (calendarData && !calendarLoading && range) {
      resetEvents(calendarData, {start:range.start, end:range.end}, view);
      calendarVisibles.forEach(calendar => {
        setEventVisible(calendar.id, calendar.isVisible, 'calendar');
      });
      userVisibles.forEach(user => {
        setEventVisible(user.id, user.isVisible, 'user');
      });
    }
  }, [calendarData, range]);

  console.log('test data : ', calendarData)

  return (
    <>
      <DragAndDropCalendar
        // 날짜 local화
        localizer={localizer}
        // 시간 날짜 포맷
        formats={isMobile ? MobileFormats : Formats}
        resizable
        selectable
        // schedule data
        events={events.filter((ev: CalendarEvent) => ev.resource.isUserVisible && ev.resource.isCalendarVisible)}
        // calendar view option
        view={view}
        onView={onView}
        views={[Views.MONTH, Views.WEEK, Views.DAY]}
        dayLayoutAlgorithm={'no-overlap'}
        // cell에 모든 이벤트 보이도록함
        showAllEvents={true}
        components={{
          toolbar: Toolbar,
          event: Events,
          month: {
            header: MonthHeader,
            dateHeader: MonthDateHeader
          }
        }}
        style={{ height: '100%', width: '100%' }}
        // 각 이벤트 스타일 설정
        eventPropGetter={convertEventStyle}
        // next, today, prev에 따른 동작 설정
        date={date}
        onNavigate={onNavigate}
        onRangeChange={onRangeChange}

        // drag and drop
        // onEventDrop={test}
        // onEventResize={resizeEvent}

        onSelectSlot={handleSelectSlot}
      />
      <RegistEventDialog />
    </>
  );
};

export default Content;