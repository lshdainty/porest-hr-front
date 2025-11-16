"use client";

import { CalendarProvider } from "@/components/big-calendar/calendar/contexts/calendar-context";
import { ClientContainer } from "@/components/big-calendar/calendar/components/client-container";
import { USERS_MOCK, CALENDAR_ITENS_MOCK } from "@/components/big-calendar/calendar/mocks";

export default function BigCalendar() {
  return (
    <div className='flex w-full h-full p-[10px]'>
      <CalendarProvider users={USERS_MOCK} events={CALENDAR_ITENS_MOCK} initialView="month">
        <ClientContainer />
      </CalendarProvider>
    </div>
  );
}