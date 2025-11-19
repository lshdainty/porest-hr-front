'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { createQueryKeys } from '@/constants/query-keys'
import {
  fetchGetYearDues,
  fetchGetYearOperationDues,
  fetchGetMonthBirthDues,
  fetchGetUsersMonthBirthDues,
  fetchPostDues,
  fetchPutDues,
  fetchDeleteDues,
  type GetYearDuesResp,
  type GetYearOperationDuesResp,
  type GetMonthBirthDuesResp,
  type GetUsersMonthBirthDuesResp,
  type PostDuesReq,
  type PutDuesReq
} from '@/lib/api/dues'

const duesKeys = createQueryKeys('dues')

// 연도별 회비 조회 훅
export const useYearDuesQuery = (year: string) => {
  return useQuery<GetYearDuesResp[]>({
    queryKey: duesKeys.list({ type: 'year', year }),
    queryFn: () => fetchGetYearDues(year),
    enabled: !!year
  })
}

// 연도별 운영비 조회 훅
export const useYearOperationDuesQuery = (year: string) => {
  return useQuery<GetYearOperationDuesResp>({
    queryKey: duesKeys.list({ type: 'yearOperation', year }),
    queryFn: () => fetchGetYearOperationDues(year),
    enabled: !!year
  })
}

// 월별 생일 회비 조회 훅
export const useMonthBirthDuesQuery = (year: string, month: string) => {
  return useQuery<GetMonthBirthDuesResp>({
    queryKey: duesKeys.list({ type: 'monthBirth', year, month }),
    queryFn: () => fetchGetMonthBirthDues(year, month),
    enabled: !!year && !!month
  })
}

// 사용자별 월별 생일 회비 조회 훅
export const useUsersMonthBirthDuesQuery = (year: string) => {
  return useQuery<GetUsersMonthBirthDuesResp[]>({
    queryKey: duesKeys.list({ type: 'usersMonthBirth', year }),
    queryFn: () => fetchGetUsersMonthBirthDues(year),
    enabled: !!year
  })
}

// 회비 생성 Mutation 훅
export const usePostDuesMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<any, Error, PostDuesReq>({
    mutationFn: (data: PostDuesReq) => fetchPostDues(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: duesKeys.lists() })
    }
  })
}

// 회비 수정 Mutation 훅
export const usePutDuesMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<any, Error, PutDuesReq>({
    mutationFn: (data: PutDuesReq) => fetchPutDues(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: duesKeys.lists() })
    }
  })
}

// 회비 삭제 Mutation 훅
export const useDeleteDuesMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<any, Error, number>({
    mutationFn: (duesSeq: number) => fetchDeleteDues(duesSeq),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: duesKeys.lists() })
    }
  })
}
