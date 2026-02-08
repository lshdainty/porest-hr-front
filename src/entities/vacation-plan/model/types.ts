// Vacation Plan entity types - Plan management

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
