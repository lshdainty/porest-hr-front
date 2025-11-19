'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { createQueryKeys } from '@/constants/query-keys'
import {
  fetchPostSchedule,
  fetchPutUpdateSchedule,
  fetchDeleteSchedule,
  type PostScheduleReq,
  type PutUpdateScheduleReq,
  type PutUpdateScheduleResp
} from '@/lib/api/schedule'

const calendarKeys = createQueryKeys('calendars')

// 스케줄 생성 Mutation 훅
export const usePostScheduleMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<any, Error, PostScheduleReq>({
    mutationFn: (data: PostScheduleReq) => fetchPostSchedule(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: calendarKeys.lists() })
    }
  })
}

// 스케줄 수정 Mutation 훅
export const usePutUpdateScheduleMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<PutUpdateScheduleResp, Error, PutUpdateScheduleReq>({
    mutationFn: (data: PutUpdateScheduleReq) => fetchPutUpdateSchedule(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: calendarKeys.lists() })
    }
  })
}

// 스케줄 삭제 Mutation 훅
export const useDeleteScheduleMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<any, Error, number>({
    mutationFn: (scheduleId: number) => fetchDeleteSchedule(scheduleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: calendarKeys.lists() })
    }
  })
}
