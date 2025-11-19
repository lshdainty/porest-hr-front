'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { createQueryKeys } from '@/constants/query-keys'
import {
  fetchGetDepartment,
  fetchGetDepartmentWithChildren,
  fetchGetDepartmentUsers,
  fetchGetCheckUserMainDepartment,
  fetchPostDepartment,
  fetchPutDepartment,
  fetchDeleteDepartment,
  fetchPostDepartmentUsers,
  fetchDeleteDepartmentUsers,
  type GetDepartmentResp,
  type GetDepartmentWithChildrenResp,
  type GetDepartmentUsersResp,
  type CheckUserMainDepartmentResp,
  type PostDepartmentReq,
  type PostDepartmentResp,
  type PutDepartmentReq,
  type PostDepartmentUsersReq,
  type PostDepartmentUsersResp,
  type DeleteDepartmentUsersReq
} from '@/lib/api/department'

const departmentKeys = createQueryKeys('departments')
const companyKeys = createQueryKeys('companies')

// 부서 상세 조회 훅
export const useDepartmentQuery = (departmentId: number) => {
  return useQuery<GetDepartmentResp>({
    queryKey: departmentKeys.detail(departmentId),
    queryFn: () => fetchGetDepartment(departmentId),
    enabled: !!departmentId
  })
}

// 하위 부서 포함 부서 조회 훅
export const useDepartmentWithChildrenQuery = (departmentId: number) => {
  return useQuery<GetDepartmentWithChildrenResp>({
    queryKey: departmentKeys.list({ type: 'withChildren', departmentId }),
    queryFn: () => fetchGetDepartmentWithChildren(departmentId),
    enabled: !!departmentId
  })
}

// 부서 사용자 조회 훅
export const useDepartmentUsersQuery = (departmentId: number) => {
  return useQuery<GetDepartmentUsersResp>({
    queryKey: departmentKeys.list({ type: 'users', departmentId }),
    queryFn: () => fetchGetDepartmentUsers(departmentId),
    enabled: !!departmentId
  })
}

// 사용자 주부서 존재 여부 확인 훅
export const useCheckUserMainDepartmentQuery = (userId: string) => {
  return useQuery<CheckUserMainDepartmentResp>({
    queryKey: departmentKeys.list({ type: 'checkMainDept', userId }),
    queryFn: () => fetchGetCheckUserMainDepartment(userId),
    enabled: !!userId
  })
}

// 부서 생성 Mutation 훅
export const usePostDepartmentMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<PostDepartmentResp, Error, PostDepartmentReq>({
    mutationFn: (data: PostDepartmentReq) => fetchPostDepartment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.all() })
      queryClient.invalidateQueries({ queryKey: companyKeys.all() })
    }
  })
}

// 부서 수정 Mutation 훅
export const usePutDepartmentMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<void, Error, { departmentId: number; data: PutDepartmentReq }>({
    mutationFn: ({ departmentId, data }) => fetchPutDepartment(departmentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.all() })
      queryClient.invalidateQueries({ queryKey: companyKeys.all() })
    }
  })
}

// 부서 삭제 Mutation 훅
export const useDeleteDepartmentMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<void, Error, number>({
    mutationFn: (departmentId: number) => fetchDeleteDepartment(departmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.all() })
      queryClient.invalidateQueries({ queryKey: companyKeys.all() })
    }
  })
}

// 부서 사용자 추가 Mutation 훅
export const usePostDepartmentUsersMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<PostDepartmentUsersResp, Error, { departmentId: number; data: PostDepartmentUsersReq }>({
    mutationFn: ({ departmentId, data }) => fetchPostDepartmentUsers(departmentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.all() })
    }
  })
}

// 부서 사용자 삭제 Mutation 훅
export const useDeleteDepartmentUsersMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<void, Error, { departmentId: number; data: DeleteDepartmentUsersReq }>({
    mutationFn: ({ departmentId, data }) => fetchDeleteDepartmentUsers(departmentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.all() })
    }
  })
}
