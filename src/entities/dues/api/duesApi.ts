import { apiClient } from '@/shared/api'
import type { ApiResponse } from '@/shared/types'
import type {
  GetMonthBirthDuesResp,
  GetUsersMonthBirthDuesResp,
  GetYearDuesResp,
  GetYearOperationDuesResp,
  PostDuesReq,
  PutDuesReq,
} from '@/entities/dues/model/types'

export const duesApi = {
  getYearDues: async (year: number): Promise<GetYearDuesResp[]> => {
    const resp: ApiResponse<GetYearDuesResp[]> = await apiClient.request({
      method: 'get',
      url: `/dues?year=${year}`
    })

    if (!resp.success) throw new Error(resp.message)

    return resp.data
  },

  getYearOperationDues: async (year: number): Promise<GetYearOperationDuesResp> => {
    const resp: ApiResponse<GetYearOperationDuesResp> = await apiClient.request({
      method: 'get',
      url: `/dues/operation?year=${year}`
    })

    if (!resp.success) throw new Error(resp.message)

    return resp.data
  },

  getMonthBirthDues: async (year: number, month: number): Promise<GetMonthBirthDuesResp> => {
    const resp: ApiResponse<GetMonthBirthDuesResp> = await apiClient.request({
      method: 'get',
      url: `/dues/birth/month?year=${year}&month=${month}`
    })

    if (!resp.success) throw new Error(resp.message)

    return resp.data
  },

  getUsersMonthBirthDues: async (year: number): Promise<GetUsersMonthBirthDuesResp[]> => {
    const resp: ApiResponse<GetUsersMonthBirthDuesResp[]> = await apiClient.request({
      method: 'get',
      url: `/dues/users/birth/month?year=${year}`
    })

    if (!resp.success) throw new Error(resp.message)

    return resp.data
  },

  createDues: async (data: PostDuesReq): Promise<any> => {
    const resp: ApiResponse = await apiClient.request({
      method: 'post',
      url: `/dues`,
      data
    })

    if (!resp.success) throw new Error(resp.message)

    return resp.data
  },

  updateDues: async (data: PutDuesReq): Promise<any> => {
    const resp: ApiResponse = await apiClient.request({
      method: 'put',
      url: `/dues/${data.dues_id}`,
      data
    })

    if (!resp.success) throw new Error(resp.message)

    return resp.data
  },

  deleteDues: async (duesId: number): Promise<any> => {
    const resp: ApiResponse = await apiClient.request({
      method: 'delete',
      url: `/dues/${duesId}`
    })

    if (!resp.success) throw new Error(resp.message)

    return resp.data
  },
}
