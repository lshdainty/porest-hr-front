import { convertColorCode } from '@/hooks/useCalendarType';
import dayjs from 'dayjs';
import { create } from 'zustand';

export interface CustomEvent {
  userId: string;
  userName: string;
  calendarName: string;
  calendarType: string;
  calendarDesc: string;
  domainType: string;
  calendarId: number;

  isUserVisible: boolean;
  isCalendarVisible: boolean;
  isOffDay: boolean;
  isAllDay: boolean;
  colorCode: string;
}

export interface CalendarEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  resource: CustomEvent;
}

export const useCalendarEventsStore = create<{
  events: CalendarEvent[];
  actions: {
    resetEvents: (calendarEvent: {
      user_id: string;
      user_name: string;
      calendar_name: string;
      calendar_type: string;
      calendar_desc: string;
      start_date: Date;
      end_date: Date;
      domain_type: string;
      calendar_id: number;
    }[], calendarRange: {start: Date, end: Date}, view: 'month' | 'week' | 'day') => void;
    setEventVisible: (id: number | string, isVisible: boolean, type: string) => void;
  }
}>((set, get) => ({
  events: [],
  actions: {
    resetEvents: (calendarEvent: {
      user_id: string;
      user_name: string;
      calendar_name: string;
      calendar_type: string;
      calendar_desc: string;
      start_date: Date;
      end_date: Date;
      domain_type: string;
      calendar_id: number;
    }[], calendarRange: {start: Date, end: Date}, view: 'month' | 'week' | 'day') => {
      let idx = 0;

      const isOffDay = (start: Date, end: Date) => {
        if (view === 'month') {
          const sMonth = calendarRange.start.getMonth();
          const eMonth = calendarRange.end.getMonth();
          let cMonth = -1;

          const label = document.getElementById('calendarLabel');
          if (label === undefined ||label === null) {
            cMonth = dayjs().month();
          } else {
            cMonth = dayjs(label.textContent, 'YYYY.MM').month();
          }

          return (
            (cMonth !== new Date(start).getMonth() && sMonth === new Date(end).getMonth()) || 
            (cMonth !== new Date(start).getMonth() && eMonth === new Date(start).getMonth())
          ) ? true : false;
        } else {
          return false;
        }
      }

      const _events: CalendarEvent[] = calendarEvent.map(c => ({
        id: idx++,
        title: c.calendar_name,
        start: new Date(c.start_date),
        end: new Date(c.end_date),
        resource: {
          userId: c.user_id,
          userName: c.user_name,
          calendarName: c.calendar_name,
          calendarType: c.calendar_type,
          calendarDesc: c.calendar_desc,
          domainType: c.domain_type,
          calendarId: c.calendar_id,
          isUserVisible: true,
          isCalendarVisible: true,
          isOffDay: isOffDay(c.start_date, c.end_date),
          isAllDay: (
            c.calendar_type === 'DAYOFF' ||
            c.calendar_type === 'EDUCATION' ||
            c.calendar_type === 'BIRTHDAY' ||
            c.calendar_type === 'BUSINESSTRIP' ||
            c.calendar_type === 'DEFENSE' ||
            c.calendar_type === 'HEALTHCHECK' ||
            c.calendar_type === 'BIRTHPARTY'
          ) ? true : false,
          colorCode: convertColorCode(c.calendar_type)
        }
      }));
      set({ events: _events });
    },
    setEventVisible: (id: number | string, visible: boolean, type: string) => {
      set((state) => (
        (type === 'user') ? {
          events: state.events.map(event => 
            event.resource.userId === id 
              ? { ...event, resource: { ...event.resource, isUserVisible: visible } } 
              : event
          )
        } : {
          events: state.events.map(event => 
            event.resource.calendarType === id 
              ? { ...event, resource: { ...event.resource, isCalendarVisible: visible } } 
              : event
          )
        }));
    }
  }
}));