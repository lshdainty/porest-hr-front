import { apiClient } from '@/shared/api'
import type { ApiResponse } from '@/shared/types'
import type {
  VacationPlanResp,
  CreateVacationPlanReq,
  UpdateVacationPlanReq,
} from '@/entities/vacation-plan/model/types'

export const vacationPlanApi = {
  // === Plan CRUD ===
  getVacationPlans: async (): Promise<VacationPlanResp[]> => {
    const resp: ApiResponse<VacationPlanResp[]> = await apiClient.request({
      method: 'get',
      url: '/vacation-plans'
    })
    if (!resp.success) throw new Error(resp.message)
    return resp.data
  },

  getVacationPlan: async (code: string): Promise<VacationPlanResp> => {
    const resp: ApiResponse<VacationPlanResp> = await apiClient.request({
      method: 'get',
      url: `/vacation-plans/${code}`
    })
    if (!resp.success) throw new Error(resp.message)
    return resp.data
  },

  postVacationPlan: async (data: CreateVacationPlanReq): Promise<VacationPlanResp> => {
    const resp: ApiResponse<VacationPlanResp> = await apiClient.request({
      method: 'post',
      url: '/vacation-plans',
      data
    })
    if (!resp.success) throw new Error(resp.message)
    return resp.data
  },

  putVacationPlan: async (code: string, data: UpdateVacationPlanReq): Promise<VacationPlanResp> => {
    const resp: ApiResponse<VacationPlanResp> = await apiClient.request({
      method: 'put',
      url: `/vacation-plans/${code}`,
      data
    })
    if (!resp.success) throw new Error(resp.message)
    return resp.data
  },

  deleteVacationPlan: async (code: string): Promise<void> => {
    const resp: ApiResponse = await apiClient.request({
      method: 'delete',
      url: `/vacation-plans/${code}`
    })
    if (!resp.success) throw new Error(resp.message)
  },

  // === Plan-Policy Management ===
  postPolicyToPlan: async (code: string, policyId: number): Promise<void> => {
    const resp: ApiResponse = await apiClient.request({
      method: 'post',
      url: `/vacation-plans/${code}/policies/${policyId}`
    })
    if (!resp.success) throw new Error(resp.message)
  },

  deletePolicyFromPlan: async (code: string, policyId: number): Promise<void> => {
    const resp: ApiResponse = await apiClient.request({
      method: 'delete',
      url: `/vacation-plans/${code}/policies/${policyId}`
    })
    if (!resp.success) throw new Error(resp.message)
  },

  putPlanPolicies: async (code: string, policyIds: number[]): Promise<void> => {
    const resp: ApiResponse = await apiClient.request({
      method: 'put',
      url: `/vacation-plans/${code}/policies`,
      data: { policy_ids: policyIds }
    })
    if (!resp.success) throw new Error(resp.message)
  },

  // === User-Plan Management ===
  getUserVacationPlans: async (userId: string): Promise<VacationPlanResp[]> => {
    const resp: ApiResponse<VacationPlanResp[]> = await apiClient.request({
      method: 'get',
      url: `/users/${userId}/vacation-plans`
    })
    if (!resp.success) throw new Error(resp.message)
    return resp.data
  },

  postAssignPlanToUser: async (userId: string, planCode: string): Promise<void> => {
    const resp: ApiResponse = await apiClient.request({
      method: 'post',
      url: `/users/${userId}/vacation-plans`,
      data: { plan_code: planCode }
    })
    if (!resp.success) throw new Error(resp.message)
  },

  postAssignPlansToUser: async (userId: string, planCodes: string[]): Promise<void> => {
    const resp: ApiResponse = await apiClient.request({
      method: 'post',
      url: `/users/${userId}/vacation-plans/batch`,
      data: { plan_codes: planCodes }
    })
    if (!resp.success) throw new Error(resp.message)
  },

  deleteRevokePlanFromUser: async (userId: string, code: string): Promise<void> => {
    const resp: ApiResponse = await apiClient.request({
      method: 'delete',
      url: `/users/${userId}/vacation-plans/${code}`
    })
    if (!resp.success) throw new Error(resp.message)
  },
}
