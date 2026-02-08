'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { createQueryKeys } from '@/shared/api'
import { vacationPlanApi } from '@/entities/vacation-plan/api/vacationPlanApi'
import type {
  VacationPlanResp,
  CreateVacationPlanReq,
  UpdateVacationPlanReq,
} from '@/entities/vacation-plan/model/types'

export const vacationPlanKeys = createQueryKeys('vacationPlans')

// === Query Hooks ===

export const useVacationPlansQuery = () => {
  return useQuery<VacationPlanResp[]>({
    queryKey: vacationPlanKeys.lists(),
    queryFn: () => vacationPlanApi.getVacationPlans()
  })
}

export const useVacationPlanQuery = (code: string) => {
  return useQuery<VacationPlanResp>({
    queryKey: vacationPlanKeys.detail(code),
    queryFn: () => vacationPlanApi.getVacationPlan(code),
    enabled: !!code
  })
}

export const useUserVacationPlansQuery = (userId: string) => {
  return useQuery<VacationPlanResp[]>({
    queryKey: vacationPlanKeys.list({ userId }),
    queryFn: () => vacationPlanApi.getUserVacationPlans(userId),
    enabled: !!userId
  })
}

// === Plan CRUD Mutation Hooks ===

export const usePostVacationPlanMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<VacationPlanResp, Error, CreateVacationPlanReq>({
    mutationFn: (data: CreateVacationPlanReq) => vacationPlanApi.postVacationPlan(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vacationPlanKeys.all() })
    }
  })
}

export const usePutVacationPlanMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<VacationPlanResp, Error, { code: string; data: UpdateVacationPlanReq }>({
    mutationFn: ({ code, data }) => vacationPlanApi.putVacationPlan(code, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vacationPlanKeys.all() })
    }
  })
}

export const useDeleteVacationPlanMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<void, Error, string>({
    mutationFn: (code: string) => vacationPlanApi.deleteVacationPlan(code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vacationPlanKeys.all() })
    }
  })
}

// === Plan-Policy Management Mutation Hooks ===

export const usePostPolicyToPlanMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<void, Error, { code: string; policyId: number }>({
    mutationFn: ({ code, policyId }) => vacationPlanApi.postPolicyToPlan(code, policyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vacationPlanKeys.all() })
    }
  })
}

export const useDeletePolicyFromPlanMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<void, Error, { code: string; policyId: number }>({
    mutationFn: ({ code, policyId }) => vacationPlanApi.deletePolicyFromPlan(code, policyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vacationPlanKeys.all() })
    }
  })
}

export const usePutPlanPoliciesMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<void, Error, { code: string; policyIds: number[] }>({
    mutationFn: ({ code, policyIds }) => vacationPlanApi.putPlanPolicies(code, policyIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vacationPlanKeys.all() })
    }
  })
}

// === User-Plan Management Mutation Hooks ===

export const usePostAssignPlanToUserMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<void, Error, { userId: string; planCode: string }>({
    mutationFn: ({ userId, planCode }) => vacationPlanApi.postAssignPlanToUser(userId, planCode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vacationPlanKeys.all() })
    }
  })
}

export const usePostAssignPlansToUserMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<void, Error, { userId: string; planCodes: string[] }>({
    mutationFn: ({ userId, planCodes }) => vacationPlanApi.postAssignPlansToUser(userId, planCodes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vacationPlanKeys.all() })
    }
  })
}

export const useDeleteRevokePlanFromUserMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<void, Error, { userId: string; code: string }>({
    mutationFn: ({ userId, code }) => vacationPlanApi.deleteRevokePlanFromUser(userId, code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vacationPlanKeys.all() })
    }
  })
}
