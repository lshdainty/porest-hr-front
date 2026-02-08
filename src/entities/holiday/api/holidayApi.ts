import { apiClient } from '@/shared/api'
import type { ApiResponse } from '@/shared/types'
import type {
  GetHolidaysResp,
  GetRecurringHolidaysPreviewResp,
  PostBulkHolidaysReq,
  PostBulkHolidaysResp,
  PostHolidayReq,
  PutHolidayReq,
} from '@/entities/holiday/model/types'

export const holidayApi = {
  getHolidaysByStartEndDate: async (startDate: string, endDate: string, countryCode?: string): Promise<GetHolidaysResp[]> => {
    const params = new URLSearchParams({
      start: startDate,
      end: endDate
    })

    if (countryCode) {
      params.append('country_code', countryCode)
    }

    const resp: ApiResponse<GetHolidaysResp[]> = await apiClient.request({
      method: 'get',
      url: `/holidays/date?${params.toString()}`
    })

    if (!resp.success) throw new Error(resp.message)

    return resp.data
  },

  createHoliday: async (data: PostHolidayReq): Promise<any> => {
    const resp: ApiResponse = await apiClient.request({
      method: 'post',
      url: `/holiday`,
      data
    })

    if (!resp.success) throw new Error(resp.message)

    return resp.data
  },

  updateHoliday: async (data: PutHolidayReq): Promise<any> => {
    const resp: ApiResponse = await apiClient.request({
      method: 'put',
      url: `/holiday/${data.holiday_id}`,
      data
    })

    if (!resp.success) throw new Error(resp.message)

    return resp.data
  },

  deleteHoliday: async (holidayId: string): Promise<any> => {
    const resp: ApiResponse = await apiClient.request({
      method: 'delete',
      url: `/holiday/${holidayId}`
    })

    if (!resp.success) throw new Error(resp.message)

    return resp.data
  },

  getRecurringHolidaysPreview: async (targetYear: number, countryCode: string): Promise<GetRecurringHolidaysPreviewResp[]> => {
    const params = new URLSearchParams({
      target_year: String(targetYear),
      country_code: countryCode
    })

    const resp: ApiResponse<GetRecurringHolidaysPreviewResp[]> = await apiClient.request({
      method: 'get',
      url: `/holidays/recurring/preview?${params.toString()}`
    })

    if (!resp.success) throw new Error(resp.message)

    return resp.data
  },

  bulkSaveHolidays: async (data: PostBulkHolidaysReq): Promise<PostBulkHolidaysResp> => {
    const resp: ApiResponse<PostBulkHolidaysResp> = await apiClient.request({
      method: 'post',
      url: `/holidays/bulk`,
      data
    })

    if (!resp.success) throw new Error(resp.message)

    return resp.data
  },
}
