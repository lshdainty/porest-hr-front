import type { TEventColor } from '@/components/big-calendar/calendar/types';

export interface IUser {
  id: string;
  name: string;
  picturePath: string | null;
}

export interface ICalendarType {
  id: string
  name: string
  type: 'vacation' | 'schedule'
  isDate: boolean
  color: TEventColor
}

export interface IEvent {
  id: number;
  startDate: string;
  endDate: string;
  title: string;
  color: TEventColor;
  description: string;
  user: IUser;
  type: ICalendarType;
}

export interface ICalendarCell {
  day: number;
  currentMonth: boolean;
  date: Date;
}
