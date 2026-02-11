import { apiClient } from '@/shared/api'
import type { ApiResponse } from '@/shared/types'
import type {
  PostScheduleReq,
  PutUpdateScheduleReq,
  PutUpdateScheduleResp,
} from '@/entities/schedule/model/types'

export const scheduleApi = {
  postSchedule: async (data: PostScheduleReq): Promise<unknown> => {
    const resp: ApiResponse = await apiClient.request({
      method: 'post',
      url: `/schedule`,
      data
    })
    if (!resp.success) throw new Error(resp.message)
    return resp.data
  },

  putUpdateSchedule: async (data: PutUpdateScheduleReq): Promise<PutUpdateScheduleResp> => {
    const { schedule_id, ...requestData } = data
    const resp: ApiResponse<PutUpdateScheduleResp> = await apiClient.request({
      method: 'put',
      url: `/schedule/${schedule_id}`,
      data: requestData
    })
    if (!resp.success) throw new Error(resp.message)
    return resp.data
  },

  deleteSchedule: async (scheduleId: number): Promise<unknown> => {
    const resp: ApiResponse = await apiClient.request({
      method: 'delete',
      url: `/schedule/${scheduleId}`
    })
    if (!resp.success) throw new Error(resp.message)
    return resp.data
  },
}
