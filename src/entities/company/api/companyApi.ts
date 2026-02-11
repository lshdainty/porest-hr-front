import { apiClient } from '@/shared/api'
import type { ApiResponse } from '@/shared/types/api'
import type {
  PostCompanyReq,
  PostCompanyResp,
  GetCompanyResp,
  PutCompanyReq,
  GetCompanyWithDepartmentResp,
} from '@/entities/company/model/types'

export const companyApi = {
  postCompany: async (data: PostCompanyReq): Promise<PostCompanyResp> => {
    const resp: ApiResponse<PostCompanyResp> = await apiClient.request({
      method: 'post',
      url: `/company`,
      data
    })

    return resp.data
  },

  getCompany: async (): Promise<GetCompanyResp> => {
    const resp: ApiResponse<GetCompanyResp> = await apiClient.request({
      method: 'get',
      url: `/company`
    })

    if (!resp.success) throw new Error(resp.message)

    return resp.data
  },

  putCompany: async (companyId: string, data: PutCompanyReq): Promise<void> => {
    await apiClient.request({
      method: 'put',
      url: `/company/${companyId}`,
      data
    })
  },

  deleteCompany: async (companyId: string): Promise<void> => {
    if (!companyId || companyId.trim() === '') {
      throw new Error('Company ID is required.')
    }

    await apiClient.request({
      method: 'delete',
      url: `/company/${companyId}`
    })
  },

  getCompanyWithDepartments: async (companyId: string): Promise<GetCompanyWithDepartmentResp> => {
    const resp: ApiResponse<GetCompanyWithDepartmentResp> = await apiClient.request({
      method: 'get',
      url: `/company/${companyId}/departments`
    })

    if (!resp.success) throw new Error(resp.message)

    return resp.data
  },
}
