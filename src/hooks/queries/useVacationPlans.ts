'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { createQueryKeys } from '@/constants/query-keys'
import {
  fetchDeletePolicyFromPlan,
  fetchDeleteRevokePlanFromUser,
  fetchDeleteVacationPlan,
  fetchGetUserVacationPlans,
  fetchGetVacationPlan,
  fetchGetVacationPlans,
  fetchPostAssignPlanToUser,
  fetchPostAssignPlansToUser,
  fetchPostPolicyToPlan,
  fetchPostVacationPlan,
  fetchPutPlanPolicies,
  fetchPutVacationPlan,
  type CreateVacationPlanReq,
  type UpdateVacationPlanReq,
  type VacationPlanResp
} from '@/lib/api/vacationPlan'

const vacationPlanKeys = createQueryKeys('vacationPlans')

// ========================================
// Query Hooks
// ========================================

// 전체 휴가 플랜 목록 조회 훅
export const useVacationPlansQuery = () => {
  return useQuery<VacationPlanResp[]>({
    queryKey: vacationPlanKeys.lists(),
    queryFn: () => fetchGetVacationPlans()
  })
}

// 휴가 플랜 상세 조회 훅
export const useVacationPlanQuery = (code: string) => {
  return useQuery<VacationPlanResp>({
    queryKey: vacationPlanKeys.detail(code),
    queryFn: () => fetchGetVacationPlan(code),
    enabled: !!code
  })
}

// 사용자의 휴가 플랜 목록 조회 훅
export const useUserVacationPlansQuery = (userId: string) => {
  return useQuery<VacationPlanResp[]>({
    queryKey: vacationPlanKeys.list({ userId }),
    queryFn: () => fetchGetUserVacationPlans(userId),
    enabled: !!userId
  })
}

// ========================================
// Plan CRUD Mutation Hooks
// ========================================

// 휴가 플랜 생성 Mutation 훅
export const usePostVacationPlanMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<VacationPlanResp, Error, CreateVacationPlanReq>({
    mutationFn: (data: CreateVacationPlanReq) => fetchPostVacationPlan(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vacationPlanKeys.all() })
    }
  })
}

// 휴가 플랜 수정 Mutation 훅
export const usePutVacationPlanMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<VacationPlanResp, Error, { code: string; data: UpdateVacationPlanReq }>({
    mutationFn: ({ code, data }) => fetchPutVacationPlan(code, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vacationPlanKeys.all() })
    }
  })
}

// 휴가 플랜 삭제 Mutation 훅
export const useDeleteVacationPlanMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<void, Error, string>({
    mutationFn: (code: string) => fetchDeleteVacationPlan(code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vacationPlanKeys.all() })
    }
  })
}

// ========================================
// Plan-Policy Management Mutation Hooks
// ========================================

// 플랜에 정책 추가 Mutation 훅
export const usePostPolicyToPlanMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<void, Error, { code: string; policyId: number }>({
    mutationFn: ({ code, policyId }) => fetchPostPolicyToPlan(code, policyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vacationPlanKeys.all() })
    }
  })
}

// 플랜에서 정책 제거 Mutation 훅
export const useDeletePolicyFromPlanMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<void, Error, { code: string; policyId: number }>({
    mutationFn: ({ code, policyId }) => fetchDeletePolicyFromPlan(code, policyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vacationPlanKeys.all() })
    }
  })
}

// 플랜 정책 전체 업데이트 Mutation 훅
export const usePutPlanPoliciesMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<void, Error, { code: string; policyIds: number[] }>({
    mutationFn: ({ code, policyIds }) => fetchPutPlanPolicies(code, policyIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vacationPlanKeys.all() })
    }
  })
}

// ========================================
// User-Plan Management Mutation Hooks
// ========================================

// 사용자에게 플랜 할당 Mutation 훅
export const usePostAssignPlanToUserMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<void, Error, { userId: string; planCode: string }>({
    mutationFn: ({ userId, planCode }) => fetchPostAssignPlanToUser(userId, planCode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vacationPlanKeys.all() })
    }
  })
}

// 사용자에게 여러 플랜 할당 Mutation 훅
export const usePostAssignPlansToUserMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<void, Error, { userId: string; planCodes: string[] }>({
    mutationFn: ({ userId, planCodes }) => fetchPostAssignPlansToUser(userId, planCodes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vacationPlanKeys.all() })
    }
  })
}

// 사용자에게서 플랜 회수 Mutation 훅
export const useDeleteRevokePlanFromUserMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<void, Error, { userId: string; code: string }>({
    mutationFn: ({ userId, code }) => fetchDeleteRevokePlanFromUser(userId, code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vacationPlanKeys.all() })
    }
  })
}
