'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { createQueryKeys } from '@/constants/query-keys'
import {
  fetchGetCompany,
  fetchGetCompanyWithDepartments,
  fetchPostCompany,
  fetchPutCompany,
  fetchDeleteCompany,
  type GetCompanyResp,
  type GetCompanyWithDepartmentResp,
  type PostCompanyReq,
  type PostCompanyResp,
  type PutCompanyReq
} from '@/lib/api/company'

const companyKeys = createQueryKeys('companies')

// 회사 정보 조회 훅
export const useCompanyQuery = () => {
  return useQuery<GetCompanyResp>({
    queryKey: companyKeys.details(),
    queryFn: () => fetchGetCompany()
  })
}

// 부서 포함 회사 정보 조회 훅
export const useCompanyWithDepartmentsQuery = (companyId: string) => {
  return useQuery<GetCompanyWithDepartmentResp>({
    queryKey: companyKeys.detail(companyId),
    queryFn: () => fetchGetCompanyWithDepartments(companyId),
    enabled: !!companyId // companyId가 있을 때만 실행
  })
}

// 회사 생성 Mutation 훅
export const usePostCompanyMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<PostCompanyResp, Error, PostCompanyReq>({
    mutationFn: (data: PostCompanyReq) => fetchPostCompany(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: companyKeys.details() })
    }
  })
}

// 회사 수정 Mutation 훅
export const usePutCompanyMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<void, Error, { companyId: string; data: PutCompanyReq }>({
    mutationFn: ({ companyId, data }) => fetchPutCompany(companyId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: companyKeys.all() })
    }
  })
}

// 회사 삭제 Mutation 훅
export const useDeleteCompanyMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<void, Error, string>({
    mutationFn: (companyId: string) => fetchDeleteCompany(companyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: companyKeys.all() })
    }
  })
}
