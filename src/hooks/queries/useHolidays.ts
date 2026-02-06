'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { createQueryKeys } from '@/constants/query-keys'
import {
  fetchDeleteHoliday,
  fetchGetHolidaysByStartEndDate,
  fetchGetRecurringHolidaysPreview,
  fetchPostBulkHolidays,
  fetchPostHoliday,
  fetchPutHoliday,
  type GetHolidaysResp,
  type GetRecurringHolidaysPreviewResp,
  type PostBulkHolidaysReq,
  type PostBulkHolidaysResp,
  type PostHolidayReq,
  type PutHolidayReq
} from '@/lib/api/holiday'

const holidayKeys = createQueryKeys('holidays')

// 기간별 공휴일 조회 훅
export const useHolidaysByPeriodQuery = (startDate: string, endDate: string, countryCode?: string) => {
  return useQuery<GetHolidaysResp[]>({
    queryKey: holidayKeys.list({ startDate, endDate, countryCode }),
    queryFn: () => fetchGetHolidaysByStartEndDate(startDate, endDate, countryCode),
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
    mutationFn: (holidayId: string) => fetchDeleteHoliday(holidayId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: holidayKeys.lists() })
    }
  })
}

// 반복 공휴일 프리뷰 조회 훅
export const useRecurringHolidaysPreviewQuery = (targetYear: number, countryCode: string, enabled: boolean = false) => {
  return useQuery<GetRecurringHolidaysPreviewResp[]>({
    queryKey: holidayKeys.list({ targetYear, countryCode, type: 'recurringPreview' }),
    queryFn: () => fetchGetRecurringHolidaysPreview(targetYear, countryCode),
    enabled: enabled && !!targetYear && !!countryCode
  })
}

// 공휴일 일괄 저장 Mutation 훅
export const useBulkSaveHolidaysMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<PostBulkHolidaysResp, Error, PostBulkHolidaysReq>({
    mutationFn: (data: PostBulkHolidaysReq) => fetchPostBulkHolidays(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: holidayKeys.lists() })
    }
  })
}
