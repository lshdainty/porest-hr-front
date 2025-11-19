'use client'

import { useQuery } from '@tanstack/react-query'

import { createQueryKeys } from '@/constants/query-keys'
import {
  fetchGetEventsByPeriod,
  type GetEventsByPeriodResp
} from '@/lib/api/calendar'

const calendarKeys = createQueryKeys('calendars')

// 기간별 이벤트 조회 훅
export const useEventsByPeriodQuery = (startDate: string, endDate: string) => {
  return useQuery<GetEventsByPeriodResp[]>({
    queryKey: calendarKeys.list({ startDate, endDate }),
    queryFn: () => fetchGetEventsByPeriod(startDate, endDate),
    enabled: !!startDate && !!endDate // 날짜가 모두 있을 때만 실행
  })
}
