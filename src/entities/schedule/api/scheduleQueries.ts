'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { scheduleApi } from '@/entities/schedule/api/scheduleApi'
import { calendarEventKeys } from '@/entities/calendar-event/api/calendarEventQueries'
import type {
  PostScheduleReq,
  PutUpdateScheduleReq,
  PutUpdateScheduleResp,
} from '@/entities/schedule/model/types'

export const usePostScheduleMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<unknown, Error, PostScheduleReq>({
    mutationFn: (data: PostScheduleReq) => scheduleApi.postSchedule(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: calendarEventKeys.lists() })
    }
  })
}

export const usePutUpdateScheduleMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<PutUpdateScheduleResp, Error, PutUpdateScheduleReq>({
    mutationFn: (data: PutUpdateScheduleReq) => scheduleApi.putUpdateSchedule(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: calendarEventKeys.lists() })
    }
  })
}

export const useDeleteScheduleMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<unknown, Error, number>({
    mutationFn: (scheduleId: number) => scheduleApi.deleteSchedule(scheduleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: calendarEventKeys.lists() })
    }
  })
}
