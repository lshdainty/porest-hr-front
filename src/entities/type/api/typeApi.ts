import { apiClient } from '@/shared/api'
import type { ApiResponse } from '@/shared/types/api'
import type { TypeResp } from '@/entities/type/model/types'

export const typeApi = {
  getTypes: async (enumName: string): Promise<TypeResp[]> => {
    const resp: ApiResponse<TypeResp[]> = await apiClient.request({
      method: 'get',
      url: `/types/${enumName}`
    })

    if (!resp.success) throw new Error(resp.message)

    return resp.data
  },

  // Specific type fetchers
  getGrantMethodTypes: async (): Promise<TypeResp[]> => {
    return typeApi.getTypes('grant-method')
  },

  getRepeatUnitTypes: async (): Promise<TypeResp[]> => {
    return typeApi.getTypes('repeat-unit')
  },

  getVacationTimeTypes: async (): Promise<TypeResp[]> => {
    return typeApi.getTypes('vacation-time')
  },

  getVacationTypes: async (): Promise<TypeResp[]> => {
    return typeApi.getTypes('vacation-type')
  },

  getEffectiveTypes: async (): Promise<TypeResp[]> => {
    return typeApi.getTypes('effective-type')
  },

  getExpirationTypes: async (): Promise<TypeResp[]> => {
    return typeApi.getTypes('expiration-type')
  },

  getApprovalStatusTypes: async (): Promise<TypeResp[]> => {
    return typeApi.getTypes('approval-status')
  },

  getGrantStatusTypes: async (): Promise<TypeResp[]> => {
    return typeApi.getTypes('grant-status')
  },

  getScheduleTypes: async (): Promise<TypeResp[]> => {
    return typeApi.getTypes('schedule-type')
  },

  getHolidayTypes: async (): Promise<TypeResp[]> => {
    return typeApi.getTypes('holiday-type')
  },

  getCompanyTypes: async (): Promise<TypeResp[]> => {
    return typeApi.getTypes('company-type')
  },

  getSystemTypes: async (): Promise<TypeResp[]> => {
    return typeApi.getTypes('system-type')
  },

  getCountryCodeTypes: async (): Promise<TypeResp[]> => {
    return typeApi.getTypes('country-code')
  },
}
