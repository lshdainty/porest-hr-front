import { apiClient } from '@/shared/api'
import type { ApiResponse } from '@/shared/types'
import type { PermissionResp } from '@/entities/permission/model/types'
import type {
  CreateRoleReq,
  RolePermissionReq,
  RoleResp,
  UpdateRolePermissionsReq,
  UpdateRoleReq,
} from '@/entities/role/model/types'

export const roleApi = {
  getRoles: async (): Promise<RoleResp[]> => {
    const resp: ApiResponse<RoleResp[]> = await apiClient.request({
      method: 'get',
      url: `/roles`
    })

    if (!resp.success) throw new Error(resp.message)

    return resp.data
  },

  getRole: async (roleCode: string): Promise<RoleResp> => {
    const resp: ApiResponse<RoleResp> = await apiClient.request({
      method: 'get',
      url: `/roles/${roleCode}`
    })

    if (!resp.success) throw new Error(resp.message)

    return resp.data
  },

  createRole: async (data: CreateRoleReq): Promise<string> => {
    const resp: ApiResponse<string> = await apiClient.request({
      method: 'post',
      url: `/roles`,
      data
    })

    if (!resp.success) throw new Error(resp.message)

    return resp.data
  },

  updateRole: async (roleCode: string, data: UpdateRoleReq): Promise<void> => {
    const resp: ApiResponse<void> = await apiClient.request({
      method: 'put',
      url: `/roles/${roleCode}`,
      data
    })

    if (!resp.success) throw new Error(resp.message)
  },

  deleteRole: async (roleCode: string): Promise<void> => {
    const resp: ApiResponse<void> = await apiClient.request({
      method: 'delete',
      url: `/roles/${roleCode}`
    })

    if (!resp.success) throw new Error(resp.message)
  },

  getRolePermissions: async (roleCode: string): Promise<PermissionResp[]> => {
    const resp: ApiResponse<PermissionResp[]> = await apiClient.request({
      method: 'get',
      url: `/roles/${roleCode}/permissions`
    })

    if (!resp.success) throw new Error(resp.message)

    return resp.data
  },

  updateRolePermissions: async (roleCode: string, data: UpdateRolePermissionsReq): Promise<void> => {
    const resp: ApiResponse<void> = await apiClient.request({
      method: 'put',
      url: `/roles/${roleCode}/permissions`,
      data
    })

    if (!resp.success) throw new Error(resp.message)
  },

  addRolePermission: async (roleCode: string, data: RolePermissionReq): Promise<void> => {
    const resp: ApiResponse<void> = await apiClient.request({
      method: 'post',
      url: `/roles/${roleCode}/permissions`,
      data
    })

    if (!resp.success) throw new Error(resp.message)
  },

  deleteRolePermission: async (roleCode: string, permissionCode: string): Promise<void> => {
    const resp: ApiResponse<void> = await apiClient.request({
      method: 'delete',
      url: `/roles/${roleCode}/permissions/${permissionCode}`
    })

    if (!resp.success) throw new Error(resp.message)
  },
}
