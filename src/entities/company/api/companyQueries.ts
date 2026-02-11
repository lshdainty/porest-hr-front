'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { createQueryKeys } from '@/shared/api/queryKeys'
import { companyApi } from '@/entities/company/api/companyApi'
import type {
  GetCompanyResp,
  GetCompanyWithDepartmentResp,
  PostCompanyReq,
  PostCompanyResp,
  PutCompanyReq,
} from '@/entities/company/model/types'

const companyKeys = createQueryKeys('companies')

// 회사 정보 조회 훅
export const useCompanyQuery = () => {
  return useQuery<GetCompanyResp>({
    queryKey: companyKeys.details(),
    queryFn: () => companyApi.getCompany()
  })
}

// 부서 포함 회사 정보 조회 훅
export const useCompanyWithDepartmentsQuery = (companyId: string) => {
  return useQuery<GetCompanyWithDepartmentResp>({
    queryKey: companyKeys.detail(companyId),
    queryFn: () => companyApi.getCompanyWithDepartments(companyId),
    enabled: !!companyId // companyId가 있을 때만 실행
  })
}

// 회사 생성 Mutation 훅
export const usePostCompanyMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<PostCompanyResp, Error, PostCompanyReq>({
    mutationFn: (data: PostCompanyReq) => companyApi.postCompany(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: companyKeys.details() })
    }
  })
}

// 회사 수정 Mutation 훅
export const usePutCompanyMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<void, Error, { companyId: string; data: PutCompanyReq }>({
    mutationFn: ({ companyId, data }) => companyApi.putCompany(companyId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: companyKeys.all() })
    }
  })
}

// 회사 삭제 Mutation 훅
export const useDeleteCompanyMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<void, Error, string>({
    mutationFn: (companyId: string) => companyApi.deleteCompany(companyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: companyKeys.all() })
    }
  })
}
