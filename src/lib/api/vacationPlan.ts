import { api, type ApiResponse } from '@/lib/api';

// ========================================
// Plan Response Types
// ========================================

export interface VacationPlanPolicyResp {
  id: number
  name: string
  desc: string
  vacation_type: string
  grant_method: string
  grant_time: number
  is_flexible_grant: string
  minute_grant_yn: string
  repeat_unit: string | null
  repeat_interval: number | null
  specific_months: number | null
  specific_days: number | null
  effective_type: string
  expiration_type: string
}

export interface VacationPlanResp {
  id: number
  code: string
  name: string
  desc: string
  policies: VacationPlanPolicyResp[] | null
}

// ========================================
// Plan Request Types
// ========================================

export interface CreateVacationPlanReq {
  code: string
  name: string
  desc: string
  policy_ids?: number[]
}

export interface UpdateVacationPlanReq {
  name: string
  desc: string
}

export interface UpdatePlanPoliciesReq {
  policy_ids: number[]
}

export interface AssignPlanToUserReq {
  plan_code: string
}

export interface AssignPlansToUserReq {
  plan_codes: string[]
}

// ========================================
// Plan CRUD API Functions
// ========================================

export async function fetchGetVacationPlans(): Promise<VacationPlanResp[]> {
  const resp: ApiResponse<VacationPlanResp[]> = await api.request({
    method: 'get',
    url: '/vacation-plans'
  });

  if (!resp.success) throw new Error(resp.message);

  return resp.data;
}

export async function fetchGetVacationPlan(code: string): Promise<VacationPlanResp> {
  const resp: ApiResponse<VacationPlanResp> = await api.request({
    method: 'get',
    url: `/vacation-plans/${code}`
  });

  if (!resp.success) throw new Error(resp.message);

  return resp.data;
}

export async function fetchPostVacationPlan(data: CreateVacationPlanReq): Promise<VacationPlanResp> {
  const resp: ApiResponse<VacationPlanResp> = await api.request({
    method: 'post',
    url: '/vacation-plans',
    data
  });

  if (!resp.success) throw new Error(resp.message);

  return resp.data;
}

export async function fetchPutVacationPlan(code: string, data: UpdateVacationPlanReq): Promise<VacationPlanResp> {
  const resp: ApiResponse<VacationPlanResp> = await api.request({
    method: 'put',
    url: `/vacation-plans/${code}`,
    data
  });

  if (!resp.success) throw new Error(resp.message);

  return resp.data;
}

export async function fetchDeleteVacationPlan(code: string): Promise<void> {
  const resp: ApiResponse = await api.request({
    method: 'delete',
    url: `/vacation-plans/${code}`
  });

  if (!resp.success) throw new Error(resp.message);
}

// ========================================
// Plan-Policy Management API Functions
// ========================================

export async function fetchPostPolicyToPlan(code: string, policyId: number): Promise<void> {
  const resp: ApiResponse = await api.request({
    method: 'post',
    url: `/vacation-plans/${code}/policies/${policyId}`
  });

  if (!resp.success) throw new Error(resp.message);
}

export async function fetchDeletePolicyFromPlan(code: string, policyId: number): Promise<void> {
  const resp: ApiResponse = await api.request({
    method: 'delete',
    url: `/vacation-plans/${code}/policies/${policyId}`
  });

  if (!resp.success) throw new Error(resp.message);
}

export async function fetchPutPlanPolicies(code: string, policyIds: number[]): Promise<void> {
  const resp: ApiResponse = await api.request({
    method: 'put',
    url: `/vacation-plans/${code}/policies`,
    data: { policy_ids: policyIds }
  });

  if (!resp.success) throw new Error(resp.message);
}

// ========================================
// User-Plan Management API Functions
// ========================================

export async function fetchGetUserVacationPlans(userId: string): Promise<VacationPlanResp[]> {
  const resp: ApiResponse<VacationPlanResp[]> = await api.request({
    method: 'get',
    url: `/users/${userId}/vacation-plans`
  });

  if (!resp.success) throw new Error(resp.message);

  return resp.data;
}

export async function fetchPostAssignPlanToUser(userId: string, planCode: string): Promise<void> {
  const resp: ApiResponse = await api.request({
    method: 'post',
    url: `/users/${userId}/vacation-plans`,
    data: { plan_code: planCode }
  });

  if (!resp.success) throw new Error(resp.message);
}

export async function fetchPostAssignPlansToUser(userId: string, planCodes: string[]): Promise<void> {
  const resp: ApiResponse = await api.request({
    method: 'post',
    url: `/users/${userId}/vacation-plans/batch`,
    data: { plan_codes: planCodes }
  });

  if (!resp.success) throw new Error(resp.message);
}

export async function fetchDeleteRevokePlanFromUser(userId: string, code: string): Promise<void> {
  const resp: ApiResponse = await api.request({
    method: 'delete',
    url: `/users/${userId}/vacation-plans/${code}`
  });

  if (!resp.success) throw new Error(resp.message);
}
