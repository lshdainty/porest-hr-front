'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { createQueryKeys } from '@/shared/api/queryKeys'
import { duesApi } from '@/entities/dues/api/duesApi'
import type {
  GetMonthBirthDuesResp,
  GetUsersMonthBirthDuesResp,
  GetYearDuesResp,
  GetYearOperationDuesResp,
  PostDuesReq,
  PutDuesReq,
} from '@/entities/dues/model/types'

const duesKeys = createQueryKeys('dues')

// 연도별 회비 조회 훅
export const useYearDuesQuery = (year: number) => {
  return useQuery<GetYearDuesResp[]>({
    queryKey: duesKeys.list({ type: 'year', year }),
    queryFn: () => duesApi.getYearDues(year),
    enabled: !!year
  })
}

// 연도별 운영비 조회 훅
export const useYearOperationDuesQuery = (year: number) => {
  return useQuery<GetYearOperationDuesResp>({
    queryKey: duesKeys.list({ type: 'yearOperation', year }),
    queryFn: () => duesApi.getYearOperationDues(year),
    enabled: !!year
  })
}

// 월별 생일 회비 조회 훅
export const useMonthBirthDuesQuery = (year: number, month: number) => {
  return useQuery<GetMonthBirthDuesResp>({
    queryKey: duesKeys.list({ type: 'monthBirth', year, month }),
    queryFn: () => duesApi.getMonthBirthDues(year, month),
    enabled: !!year && !!month
  })
}

// 사용자별 월별 생일 회비 조회 훅
export const useUsersMonthBirthDuesQuery = (year: number) => {
  return useQuery<GetUsersMonthBirthDuesResp[]>({
    queryKey: duesKeys.list({ type: 'usersMonthBirth', year }),
    queryFn: () => duesApi.getUsersMonthBirthDues(year),
    enabled: !!year
  })
}

// 회비 생성 Mutation 훅
export const usePostDuesMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<any, Error, PostDuesReq>({
    mutationFn: (data: PostDuesReq) => duesApi.createDues(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: duesKeys.lists() })
    }
  })
}

// 회비 수정 Mutation 훅
export const usePutDuesMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<any, Error, PutDuesReq>({
    mutationFn: (data: PutDuesReq) => duesApi.updateDues(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: duesKeys.lists() })
    }
  })
}

// 회비 삭제 Mutation 훅
export const useDeleteDuesMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<any, Error, number>({
    mutationFn: (duesId: number) => duesApi.deleteDues(duesId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: duesKeys.lists() })
    }
  })
}
