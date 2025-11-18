import type { ICalendarType } from '@/components/big-calendar/calendar/interfaces';

export type TCalendarView = 'day' | 'week' | 'month' | 'year' | 'agenda';
export type TEventColor = 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'orange' | 'pink' | 'gray' | 'teal';
export type TBadgeVariant = 'dot' | 'colored' | 'mixed';
export type TWorkingHours = { [key: number]: { from: number; to: number } };
export type TVisibleHours = { from: number; to: number };

export const calendarTypes: ICalendarType[] = [
  {
    id: 'DAYOFF',
    name: '연차',
    type: 'vacation',
    isDate: true,
    color: 'purple'
  },
  {
    id: 'MORNINGOFF',
    name: '오전반차',
    type: 'vacation',
    isDate: false,
    color: 'blue'
  },
  {
    id: 'AFTERNOONOFF',
    name: '오후반차',
    type: 'vacation',
    isDate: false,
    color: 'pink'
  },
  {
    id: 'ONETIMEOFF',
    name: '1시간 휴가',
    type: 'vacation',
    isDate: false,
    color: 'yellow'
  },
  {
    id: 'TWOTIMEOFF',
    name: '2시간 휴가',
    type: 'vacation',
    isDate: false,
    color: 'yellow'
  },
  {
    id: 'THREETIMEOFF',
    name: '3시간 휴가',
    type: 'vacation',
    isDate: false,
    color: 'yellow'
  },
  {
    id: 'FIVETIMEOFF',
    name: '5시간 휴가',
    type: 'vacation',
    isDate: false,
    color: 'yellow'
  },
  {
    id: 'SIXTIMEOFF',
    name: '6시간 휴가',
    type: 'vacation',
    isDate: false,
    color: 'yellow'
  },
  {
    id: 'SEVENTIMEOFF',
    name: '7시간 휴가',
    type: 'vacation',
    isDate: false,
    color: 'yellow'
  },
  {
    id: 'HALFTIMEOFF',
    name: '30분 휴가',
    type: 'vacation',
    isDate: false,
    color: 'yellow'
  },
  {
    id: 'BUSINESSTRIP',
    name: '출장',
    type: 'schedule',
    isDate: true,
    color: 'green'
  },
  {
    id: 'EDUCATION',
    name: '교육',
    type: 'schedule',
    isDate: true,
    color: 'red'
  },
  {
    id: 'BIRTHDAY',
    name: '생일',
    type: 'schedule',
    isDate: true,
    color: 'orange'
  },
  {
    id: 'BIRTHPARTY',
    name: '생일파티',
    type: 'schedule',
    isDate: true,
    color: 'orange'
  },
  {
    id: 'HEALTHCHECKHALF',
    name: '건강검진(반차)',
    type: 'vacation',
    isDate: false,
    color: 'gray'
  },
  {
    id: 'DEFENSE',
    name: '민방위',
    type: 'vacation',
    isDate: true,
    color: 'teal'
  },
  {
    id: 'DEFENSEHALF',
    name: '민방위(반차)',
    type: 'vacation',
    isDate: false,
    color: 'teal'
  }
]
