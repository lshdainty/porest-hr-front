"use client";

import { ClientContainer } from "@/components/big-calendar/calendar/components/client-container";
import { CalendarProvider } from "@/components/big-calendar/calendar/contexts/calendar-context";
import { CALENDAR_ITENS_MOCK, USERS_MOCK } from "@/components/big-calendar/calendar/mocks";

export default function BigCalendar() {
  return (
    <div className='flex w-full h-full overflow-y-scroll'>
      <CalendarProvider users={USERS_MOCK} events={CALENDAR_ITENS_MOCK} initialView="month">
        <ClientContainer />
      </CalendarProvider>
    </div>
  );
}