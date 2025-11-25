'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { createQueryKeys } from '@/constants/query-keys'
import {
    fetchDeletePermission,
    fetchGetMyPermissions,
    fetchGetPermission,
    fetchGetPermissions,
    fetchGetPermissionsByResource,
    fetchPostPermission,
    fetchPutPermission,
    type CreatePermissionReq,
    type PermissionResp,
    type UpdatePermissionReq
} from '@/lib/api/permission'

const permissionKeys = createQueryKeys('permissions')

// 현재 사용자의 권한 목록 조회 훅
export const useMyPermissionsQuery = () => {
  return useQuery<string[]>({
    queryKey: permissionKeys.list({ type: 'my' }),
    queryFn: () => fetchGetMyPermissions()
  })
}

// 전체 권한 목록 조회 훅
export const usePermissionsQuery = () => {
  return useQuery<PermissionResp[]>({
    queryKey: permissionKeys.lists(),
    queryFn: () => fetchGetPermissions()
  })
}

// 특정 권한 조회 훅
export const usePermissionQuery = (permissionCode: string) => {
  return useQuery<PermissionResp>({
    queryKey: permissionKeys.detail(permissionCode),
    queryFn: () => fetchGetPermission(permissionCode),
    enabled: !!permissionCode
  })
}

// 리소스별 권한 목록 조회 훅
export const usePermissionsByResourceQuery = (resource: string) => {
  return useQuery<PermissionResp[]>({
    queryKey: permissionKeys.list({ type: 'resource', resource }),
    queryFn: () => fetchGetPermissionsByResource(resource),
    enabled: !!resource
  })
}

// 권한 생성 Mutation 훅
export const usePostPermissionMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<string, Error, CreatePermissionReq>({
    mutationFn: (data: CreatePermissionReq) => fetchPostPermission(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: permissionKeys.lists() })
    }
  })
}

// 권한 수정 Mutation 훅
export const usePutPermissionMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<void, Error, { permissionCode: string, data: UpdatePermissionReq }>({
    mutationFn: ({ permissionCode, data }) => fetchPutPermission(permissionCode, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: permissionKeys.lists() })
      queryClient.invalidateQueries({ queryKey: permissionKeys.detail(variables.permissionCode) })
    }
  })
}

// 권한 삭제 Mutation 훅
export const useDeletePermissionMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<void, Error, string>({
    mutationFn: (permissionCode: string) => fetchDeletePermission(permissionCode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: permissionKeys.lists() })
    }
  })
}
