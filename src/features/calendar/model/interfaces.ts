import type { TCalendarType } from '@/features/calendar/model/types';

export interface IUser {
  id: string;
  name: string;
  picturePath: string | null;
}

export interface IEvent {
  id: number;
  startDate: string;
  endDate: string;
  title: string;
  description: string;
  vacationType?: string;
  user: IUser;
  type: TCalendarType;
}

export interface ICalendarCell {
  day: number;
  currentMonth: boolean;
  date: Date;
}
