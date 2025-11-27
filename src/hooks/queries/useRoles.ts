'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { createQueryKeys } from '@/constants/query-keys'
import { type PermissionResp } from '@/lib/api/permission'
import {
  fetchDeleteRole,
  fetchDeleteRolePermission,
  fetchGetRole,
  fetchGetRolePermissions,
  fetchGetRoles,
  fetchPostRole,
  fetchPostRolePermission,
  fetchPutRole,
  fetchPutRolePermissions,
  type CreateRoleReq,
  type RolePermissionReq,
  type RoleResp,
  type UpdateRolePermissionsReq,
  type UpdateRoleReq
} from '@/lib/api/role'

const roleKeys = createQueryKeys('roles')

// 전체 역할 목록 조회 훅
export const useRolesQuery = () => {
  return useQuery<RoleResp[]>({
    queryKey: roleKeys.lists(),
    queryFn: () => fetchGetRoles()
  })
}

// 특정 역할 조회 훅
export const useRoleQuery = (roleCode: string) => {
  return useQuery<RoleResp>({
    queryKey: roleKeys.detail(roleCode),
    queryFn: () => fetchGetRole(roleCode),
    enabled: !!roleCode
  })
}

// 역할 권한 목록 조회 훅
export const useRolePermissionsQuery = (roleCode: string) => {
  return useQuery<PermissionResp[]>({
    queryKey: roleKeys.list({ type: 'permissions', roleCode }),
    queryFn: () => fetchGetRolePermissions(roleCode),
    enabled: !!roleCode
  })
}

// 역할 생성 Mutation 훅
export const usePostRoleMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<string, Error, CreateRoleReq>({
    mutationFn: (data: CreateRoleReq) => fetchPostRole(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKeys.lists() })
    }
  })
}

// 역할 수정 Mutation 훅
export const usePutRoleMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<void, Error, { roleCode: string, data: UpdateRoleReq }>({
    mutationFn: ({ roleCode, data }) => fetchPutRole(roleCode, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: roleKeys.lists() })
      queryClient.invalidateQueries({ queryKey: roleKeys.detail(variables.roleCode) })
    }
  })
}

// 역할 삭제 Mutation 훅
export const useDeleteRoleMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<void, Error, string>({
    mutationFn: (roleCode: string) => fetchDeleteRole(roleCode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKeys.lists() })
    }
  })
}

// 역할 권한 설정 (전체 교체) Mutation 훅
export const usePutRolePermissionsMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<void, Error, { roleCode: string, data: UpdateRolePermissionsReq }>({
    mutationFn: ({ roleCode, data }) => fetchPutRolePermissions(roleCode, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: roleKeys.lists() })
      queryClient.invalidateQueries({ queryKey: roleKeys.detail(variables.roleCode) })
      queryClient.invalidateQueries({ queryKey: roleKeys.list({ type: 'permissions', roleCode: variables.roleCode }) })
    }
  })
}

// 역할에 권한 추가 Mutation 훅
export const usePostRolePermissionMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<void, Error, { roleCode: string, data: RolePermissionReq }>({
    mutationFn: ({ roleCode, data }) => fetchPostRolePermission(roleCode, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: roleKeys.lists() })
      queryClient.invalidateQueries({ queryKey: roleKeys.detail(variables.roleCode) })
      queryClient.invalidateQueries({ queryKey: roleKeys.list({ type: 'permissions', roleCode: variables.roleCode }) })
    }
  })
}

// 역할에서 권한 제거 Mutation 훅
export const useDeleteRolePermissionMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<void, Error, { roleCode: string, permissionCode: string }>({
    mutationFn: ({ roleCode, permissionCode }) => fetchDeleteRolePermission(roleCode, permissionCode),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: roleKeys.lists() })
      queryClient.invalidateQueries({ queryKey: roleKeys.detail(variables.roleCode) })
      queryClient.invalidateQueries({ queryKey: roleKeys.list({ type: 'permissions', roleCode: variables.roleCode }) })
    }
  })
}
