'use client';

import { createContext, useContext, useEffect, useState } from 'react';

import type { GetHolidaysResp } from '@/entities/holiday';
import type { IEvent, IUser } from '@/features/calendar/model/interfaces';
import type { TBadgeVariant, TCalendarType, TCalendarView, TVisibleHours, TWorkingHours } from '@/features/calendar/model/types';
import type { Dispatch, SetStateAction } from 'react';

interface ICalendarContext {
  selectedDate: Date;
  setSelectedDate: (date: Date | undefined) => void;
  selectedUserIds: IUser['id'][] | 'all';
  setSelectedUserIds: (userIds: IUser['id'][] | 'all') => void;
  selectedTypeIds: TCalendarType['id'][] | 'all';
  setSelectedTypeIds: (typeIds: TCalendarType['id'][] | 'all') => void;
  view: TCalendarView;
  setView: (view: TCalendarView) => void;
  badgeVariant: TBadgeVariant;
  setBadgeVariant: (variant: TBadgeVariant) => void;
  users: IUser[];
  workingHours: TWorkingHours;
  setWorkingHours: Dispatch<SetStateAction<TWorkingHours>>;
  visibleHours: TVisibleHours;
  setVisibleHours: Dispatch<SetStateAction<TVisibleHours>>;
  events: IEvent[];
  setLocalEvents: Dispatch<SetStateAction<IEvent[]>>;
  holidays: GetHolidaysResp[];
  setHolidays: Dispatch<SetStateAction<GetHolidaysResp[]>>;
  findHolidayByDate: (date: string) => GetHolidaysResp | undefined;
}

const CalendarContext = createContext({} as ICalendarContext);

const WORKING_HOURS = {
  0: { from: 0, to: 0 },
  1: { from: 7, to: 22 },
  2: { from: 7, to: 22 },
  3: { from: 7, to: 22 },
  4: { from: 7, to: 22 },
  5: { from: 7, to: 22 },
  6: { from: 0, to: 0 },
};

const VISIBLE_HOURS = { from: 7, to: 22 };

export function CalendarProvider({ children, users, events, initialView = 'month' }: { children: React.ReactNode; users: IUser[]; events: IEvent[]; initialView?: TCalendarView }) {
  const [badgeVariant, setBadgeVariant] = useState<TBadgeVariant>('colored');
  const [visibleHours, setVisibleHours] = useState<TVisibleHours>(VISIBLE_HOURS);
  const [workingHours, setWorkingHours] = useState<TWorkingHours>(WORKING_HOURS);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedUserIds, setSelectedUserIds] = useState<IUser['id'][] | 'all'>('all');
  const [selectedTypeIds, setSelectedTypeIds] = useState<TCalendarType['id'][] | 'all'>('all');
  const [view, setView] = useState<TCalendarView>(initialView);

  const [localEvents, setLocalEvents] = useState<IEvent[]>(events);
  const [holidays, setHolidays] = useState<GetHolidaysResp[]>([]);

  // props로 받은 events가 변경될 때 localEvents 업데이트
  useEffect(() => {
    setLocalEvents(events);
  }, [events]);

  const handleSelectDate = (date: Date | undefined) => {
    if (!date) return;
    setSelectedDate(date);
  };

  const findHolidayByDate = (date: string) => {
    return holidays.find(holiday => holiday.holiday_date === date);
  };

  return (
    <CalendarContext.Provider
      value={{
        selectedDate,
        setSelectedDate: handleSelectDate,
        selectedUserIds,
        setSelectedUserIds,
        selectedTypeIds,
        setSelectedTypeIds,
        view,
        setView,
        badgeVariant,
        setBadgeVariant,
        users,
        visibleHours,
        setVisibleHours,
        workingHours,
        setWorkingHours,
        events: localEvents,
        setLocalEvents,
        holidays,
        setHolidays,
        findHolidayByDate,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
}

export function useCalendar(): ICalendarContext {
  const context = useContext(CalendarContext);
  if (!context) throw new Error('useCalendar must be used within a CalendarProvider.');
  return context;
}
