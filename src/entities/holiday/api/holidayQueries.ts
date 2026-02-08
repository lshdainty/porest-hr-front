'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { createQueryKeys } from '@/shared/api/queryKeys'
import { holidayApi } from '@/entities/holiday/api/holidayApi'
import type {
  GetHolidaysResp,
  GetRecurringHolidaysPreviewResp,
  PostBulkHolidaysReq,
  PostBulkHolidaysResp,
  PostHolidayReq,
  PutHolidayReq,
} from '@/entities/holiday/model/types'

const holidayKeys = createQueryKeys('holidays')

// 기간별 공휴일 조회 훅
export const useHolidaysByPeriodQuery = (startDate: string, endDate: string, countryCode?: string) => {
  return useQuery<GetHolidaysResp[]>({
    queryKey: holidayKeys.list({ startDate, endDate, countryCode }),
    queryFn: () => holidayApi.getHolidaysByStartEndDate(startDate, endDate, countryCode),
    enabled: !!startDate && !!endDate
  })
}

// 공휴일 생성 Mutation 훅
export const usePostHolidayMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<any, Error, PostHolidayReq>({
    mutationFn: (data: PostHolidayReq) => holidayApi.createHoliday(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: holidayKeys.lists() })
    }
  })
}

// 공휴일 수정 Mutation 훅
export const usePutHolidayMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<any, Error, PutHolidayReq>({
    mutationFn: (data: PutHolidayReq) => holidayApi.updateHoliday(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: holidayKeys.lists() })
    }
  })
}

// 공휴일 삭제 Mutation 훅
export const useDeleteHolidayMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<any, Error, string>({
    mutationFn: (holidayId: string) => holidayApi.deleteHoliday(holidayId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: holidayKeys.lists() })
    }
  })
}

// 반복 공휴일 프리뷰 조회 훅
export const useRecurringHolidaysPreviewQuery = (targetYear: number, countryCode: string, enabled: boolean = false) => {
  return useQuery<GetRecurringHolidaysPreviewResp[]>({
    queryKey: holidayKeys.list({ targetYear, countryCode, type: 'recurringPreview' }),
    queryFn: () => holidayApi.getRecurringHolidaysPreview(targetYear, countryCode),
    enabled: enabled && !!targetYear && !!countryCode
  })
}

// 공휴일 일괄 저장 Mutation 훅
export const useBulkSaveHolidaysMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<PostBulkHolidaysResp, Error, PostBulkHolidaysReq>({
    mutationFn: (data: PostBulkHolidaysReq) => holidayApi.bulkSaveHolidays(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: holidayKeys.lists() })
    }
  })
}
