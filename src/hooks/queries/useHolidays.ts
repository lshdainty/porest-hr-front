'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { createQueryKeys } from '@/constants/query-keys'
import {
  fetchGetHolidaysByStartEndDate,
  fetchPostHoliday,
  fetchPutHoliday,
  fetchDeleteHoliday,
  type GetHolidaysResp,
  type PostHolidayReq,
  type PutHolidayReq
} from '@/lib/api/holiday'

const holidayKeys = createQueryKeys('holidays')

// 기간별 공휴일 조회 훅
export const useHolidaysByPeriodQuery = (startDate: string, endDate: string) => {
  return useQuery<GetHolidaysResp[]>({
    queryKey: holidayKeys.list({ startDate, endDate }),
    queryFn: () => fetchGetHolidaysByStartEndDate(startDate, endDate),
    enabled: !!startDate && !!endDate
  })
}

// 공휴일 생성 Mutation 훅
export const usePostHolidayMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<any, Error, PostHolidayReq>({
    mutationFn: (data: PostHolidayReq) => fetchPostHoliday(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: holidayKeys.lists() })
    }
  })
}

// 공휴일 수정 Mutation 훅
export const usePutHolidayMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<any, Error, PutHolidayReq>({
    mutationFn: (data: PutHolidayReq) => fetchPutHoliday(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: holidayKeys.lists() })
    }
  })
}

// 공휴일 삭제 Mutation 훅
export const useDeleteHolidayMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<any, Error, string>({
    mutationFn: (holidaySeq: string) => fetchDeleteHoliday(holidaySeq),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: holidayKeys.lists() })
    }
  })
}
