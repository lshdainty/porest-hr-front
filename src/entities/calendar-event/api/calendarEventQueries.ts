'use client'

import { useQuery } from '@tanstack/react-query'

import { createQueryKeys } from '@/shared/api'
import { calendarEventApi } from '@/entities/calendar-event/api/calendarEventApi'
import type { GetEventsByPeriodResp } from '@/entities/calendar-event/model/types'

export const calendarEventKeys = createQueryKeys('calendars')

export const useEventsByPeriodQuery = (startDate: string, endDate: string) => {
  return useQuery<GetEventsByPeriodResp[]>({
    queryKey: calendarEventKeys.list({ startDate, endDate }),
    queryFn: () => calendarEventApi.getEventsByPeriod(startDate, endDate),
    enabled: !!startDate && !!endDate
  })
}
