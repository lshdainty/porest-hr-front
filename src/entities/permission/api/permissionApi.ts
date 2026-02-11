import { apiClient } from '@/shared/api'
import type { ApiResponse } from '@/shared/types'
import type {
  CreatePermissionReq,
  PermissionResp,
  UpdatePermissionReq,
} from '@/entities/permission/model/types'

export const permissionApi = {
  getMyPermissions: async (): Promise<string[]> => {
    const resp: ApiResponse<string[]> = await apiClient.request({
      method: 'get',
      url: `/permissions/my`
    })

    if (!resp.success) throw new Error(resp.message)

    return resp.data
  },

  getPermissions: async (): Promise<PermissionResp[]> => {
    const resp: ApiResponse<PermissionResp[]> = await apiClient.request({
      method: 'get',
      url: `/permissions`
    })

    if (!resp.success) throw new Error(resp.message)

    return resp.data
  },

  getPermission: async (permissionCode: string): Promise<PermissionResp> => {
    const resp: ApiResponse<PermissionResp> = await apiClient.request({
      method: 'get',
      url: `/permissions/${permissionCode}`
    })

    if (!resp.success) throw new Error(resp.message)

    return resp.data
  },

  getPermissionsByResource: async (resource: string): Promise<PermissionResp[]> => {
    const resp: ApiResponse<PermissionResp[]> = await apiClient.request({
      method: 'get',
      url: `/permissions/resource/${resource}`
    })

    if (!resp.success) throw new Error(resp.message)

    return resp.data
  },

  createPermission: async (data: CreatePermissionReq): Promise<string> => {
    const resp: ApiResponse<string> = await apiClient.request({
      method: 'post',
      url: `/permissions`,
      data
    })

    if (!resp.success) throw new Error(resp.message)

    return resp.data
  },

  updatePermission: async (permissionCode: string, data: UpdatePermissionReq): Promise<void> => {
    const resp: ApiResponse<void> = await apiClient.request({
      method: 'put',
      url: `/permissions/${permissionCode}`,
      data
    })

    if (!resp.success) throw new Error(resp.message)
  },

  deletePermission: async (permissionCode: string): Promise<void> => {
    const resp: ApiResponse<void> = await apiClient.request({
      method: 'delete',
      url: `/permissions/${permissionCode}`
    })

    if (!resp.success) throw new Error(resp.message)
  },
}
