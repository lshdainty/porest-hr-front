import { apiClient } from '@/shared/api'
import type { ApiResponse } from '@/shared/types'
import type { GetEventsByPeriodResp } from '@/entities/calendar-event/model/types'

export const calendarEventApi = {
  getEventsByPeriod: async (startDate: string, endDate: string): Promise<GetEventsByPeriodResp[]> => {
    const resp: ApiResponse<GetEventsByPeriodResp[]> = await apiClient.request({
      method: 'get',
      url: `/calendar/period?startDate=${startDate}&endDate=${endDate}`
    })
    if (!resp.success) throw new Error(resp.message)
    return resp.data
  },
}
