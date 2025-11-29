import { api, type ApiResponse } from '@/lib/api';

// Request/Response Types
export interface PostUseVacationReq {
  user_id: string
  vacation_type: string
  vacation_desc: string
  vacation_time_type: string
  start_date: string
  end_date: string
}

export interface PostUseVacationResp {
  vacation_usage_id: number
}

export interface GetUserVacationHistoryReq {
  user_id: string
}

export interface VacationGrantInfo {
  vacation_grant_id: number
  vacation_type: string
  vacation_type_name: string
  vacation_grant_desc: string
  grant_time: number
  grant_time_str: string
  remain_time: number
  remain_time_str: string
  grant_date: string
  expiry_date: string
}

export interface VacationUsageInfo {
  vacation_usage_id: number
  vacation_usage_desc: string
  vacation_time_type: string
  vacation_time_type_name: string
  used_time: number
  used_time_str: string
  start_date: string
  end_date: string
}

export interface GetUserVacationHistoryResp {
  grants: VacationGrantInfo[]
  usages: VacationUsageInfo[]
}

export interface GetAllUsersVacationHistoryResp {
  user_id: string
  user_name: string
  grants: VacationGrantInfo[]
  usages: VacationUsageInfo[]
}

export interface GetAvailableVacationsReq {
  user_id: string
  start_date: string
}

export interface GetAvailableVacationsResp {
  vacation_type: string
  vacation_type_name: string
  total_remain_time: number
  total_remain_time_str: string
}

export interface PutUpdateVacationUsageReq {
  vacation_usage_id: number
  user_id: string
  vacation_type: string
  vacation_desc: string
  vacation_time_type: string
  start_date: string
  end_date: string
}

export interface PutUpdateVacationUsageResp {
  vacation_usage_id: number
}

export interface GetVacationUsagesByPeriodReq {
  start_date: string
  end_date: string
}

export interface GetVacationUsagesByPeriodResp {
  user_id: string
  user_name: string
  vacation_usage_id: number
  vacation_usage_desc: string
  vacation_time_type: string
  vacation_time_type_name: string
  used_time: number
  start_date: string
  end_date: string
}

export interface GetUserVacationUsagesByPeriodReq {
  user_id: string
  start_date: string
  end_date: string
}

export interface GetUserVacationUsagesByPeriodResp {
  vacation_usage_id: number
  vacation_usage_desc: string
  vacation_time_type: string
  vacation_time_type_name: string
  used_time: number
  start_date: string
  end_date: string
}

export interface GetUserMonthlyVacationStatsReq {
  user_id: string
  year: string
}

export interface GetUserMonthlyVacationStatsResp {
  month: number
  used_time: number
  used_time_str: string
}

export interface GetUserVacationStatsReq {
  user_id: string
  base_date: string
}

export interface GetUserVacationStatsResp {
  remain_time: number
  remain_time_str: string
  used_time: number
  used_time_str: string
  expect_used_time: number
  expect_used_time_str: string
  prev_remain_time: number
  prev_remain_time_str: string
  prev_used_time: number
  prev_used_time_str: string
  prev_expect_used_time: number
  prev_expect_used_time_str: string
  remain_time_gap: number
  remain_time_gap_str: string
  used_time_gap: number
  used_time_gap_str: string
}

export interface GetVacationPolicyReq {
  vacation_policy_id: number
}

export interface GetVacationPolicyResp {
  vacation_policy_id: number
  vacation_policy_name: string
  vacation_policy_desc: string
  vacation_type: string
  grant_method: string
  grant_time: number
  grant_time_str: string
  is_flexible_grant: string
  minute_grant_yn: string
  repeat_unit: string
  repeat_interval: number
  specific_months: number
  specific_days: number
  effective_type: string
  expiration_type: string
  repeat_grant_desc: string
}

export interface GetVacationPoliciesResp {
  vacation_policy_id: number
  vacation_policy_name: string
  vacation_policy_desc: string
  vacation_type: string
  grant_method: string
  grant_time: number
  grant_time_str: string
  is_flexible_grant: string
  minute_grant_yn: string
  repeat_unit: string
  repeat_interval: number
  specific_months: number
  specific_days: number
  effective_type: string
  expiration_type: string
  repeat_grant_desc: string
}

export interface PostVacationPolicyReq {
  vacation_policy_name: string
  vacation_policy_desc: string
  vacation_type: string
  grant_method: string
  grant_time: number
  is_flexible_grant: string
  minute_grant_yn: string
  repeat_unit: string | null
  repeat_interval: number | null
  specific_months: number | null
  specific_days: number | null
  first_grant_date: string | null
  is_recurring: string
  max_grant_count: number | null
  effective_type: string
  expiration_type: string
  approval_required_count: number
}

export interface PostVacationPolicyResp {
  vacation_policy_id: number
}

export interface DeleteVacationPolicyResp {
  vacation_policy_id: number
}

export interface PostAssignVacationPoliciesToUserReq {
  user_id: string
  vacation_policy_ids: number[]
}

export interface PostAssignVacationPoliciesToUserResp {
  user_id: string
  assigned_vacation_policy_ids: number[]
}

export interface GetUserVacationPoliciesReq {
  user_id: string
  grant_method?: 'ON_REQUEST' | 'MANUAL_GRANT' | 'REPEAT_GRANT'
}

export interface GetUserVacationPoliciesResp {
  user_vacation_policy_id: number
  vacation_policy_id: number
  vacation_policy_name: string
  vacation_policy_desc: string
  vacation_type: string
  grant_method: string
  grant_time: number
  grant_time_str: string
  is_flexible_grant: string
  minute_grant_yn: string
  repeat_unit: string
  repeat_interval: number
  specific_months: number
  specific_days: number
  first_grant_date: string
  is_recurring: string
  approval_required_count: number
  max_grant_count: number
  effective_type: string
  expiration_type: string
  repeat_grant_desc: string
}

export interface GetUserAssignedVacationPoliciesReq {
  user_id: string
  vacation_type?: string
  grant_method?: string
}

export interface GetUserAssignedVacationPoliciesResp {
  vacation_policy_id: number
  vacation_policy_name: string
  vacation_policy_desc: string
  vacation_type: string
  grant_method: string
  grant_time: number
  grant_time_str: string
  is_flexible_grant: string
  minute_grant_yn: string
  repeat_unit: string | null
  repeat_interval: number | null
  specific_months: number | null
  specific_days: number | null
  effective_type: string
  expiration_type: string
  repeat_grant_desc: string | null
}

export interface VacationPolicyAssignmentInfo {
  vacation_policy_id: number
  vacation_policy_name: string
  vacation_policy_desc: string
  vacation_type: string
  grant_method: string
  grant_time: number
  grant_time_str: string
  is_flexible_grant: string
  minute_grant_yn: string
  repeat_unit: string
  repeat_interval: number
  specific_months: number
  specific_days: number
  effective_type: string
  expiration_type: string
  repeat_grant_desc: string
}

export interface GetUserVacationPolicyAssignmentStatusReq {
  user_id: string
}

export interface GetUserVacationPolicyAssignmentStatusResp {
  assigned_policies: VacationPolicyAssignmentInfo[]
  unassigned_policies: VacationPolicyAssignmentInfo[]
}

export interface DeleteRevokeVacationPolicyFromUserReq {
  user_id: string
  vacation_policy_id: number
}

export interface DeleteRevokeVacationPolicyFromUserResp {
  user_id: string
  vacation_policy_id: number
  user_vacation_policy_id: number
}

export interface DeleteRevokeVacationPoliciesFromUserReq {
  user_id: string
  vacation_policy_ids: number[]
}

export interface DeleteRevokeVacationPoliciesFromUserResp {
  user_id: string
  revoked_vacation_policy_ids: number[]
}

export interface PostManualGrantVacationReq {
  user_id: string
  vacation_policy_id: number
  grant_time: number
  grant_date: string | null
  expiry_date: string | null
  grant_desc: string
}

export interface PostManualGrantVacationResp {
  vacation_grant_id: number
  user_id: string
  vacation_policy_id: number
  grant_time: number
  grant_date: string
  expiry_date: string
}

export interface DeleteRevokeVacationGrantResp {
  vacation_grant_id: number
  user_id: string
}

export interface PostRequestVacationReq {
  user_id: string
  policy_id: number
  desc: string
  approver_ids: string[]
  request_start_time: string
  request_end_time: string | null
  request_desc: string
  grant_time?: number
}

export interface PostRequestVacationResp {
  vacation_grant_id: number
}

export interface PostApproveVacationReq {
  approval_id: number
  approver_id: string
}

export interface PostApproveVacationResp {
  approval_id: number
}

export interface PostRejectVacationReq {
  approval_id: number
  approver_id: string
  rejection_reason: string
}

export interface PostRejectVacationResp {
  approval_id: number
}

export interface GetAllVacationsByApproverReq {
  approver_id: string
  status?: string
}

export interface GetUserRequestedVacationsReq {
  user_id: string
}

export interface ApproverInfo {
  approval_id: number
  approver_id: string
  approver_name: string
  approval_order: number
  approval_status: string
  approval_status_name: string
  approval_date: string | null
  rejection_reason?: string
}

export interface GetUserRequestedVacationsResp {
  vacation_grant_id: number
  policy_id: number
  policy_name: string
  vacation_type: string
  vacation_type_name: string
  desc: string
  grant_time: number
  grant_time_str: string
  policy_grant_time: number
  policy_grant_time_str: string
  remain_time: number
  remain_time_str: string
  grant_date: string | null
  expiry_date: string | null
  request_start_time: string
  request_end_time: string | null
  request_desc: string
  grant_status: string
  grant_status_name: string
  create_date: string
  current_approver_id: string | null
  current_approver_name: string | null
  approvers: ApproverInfo[] | null
}

export interface GetUserRequestedVacationStatsReq {
  user_id: string
}

export interface GetUserRequestedVacationStatsResp {
  total_request_count: number
  current_month_request_count: number
  change_rate: number
  pending_count: number
  average_processing_days: number
  progress_count: number
  approved_count: number
  approval_rate: number
  rejected_count: number
  canceled_count: number
  acquired_vacation_time_str: string
  acquired_vacation_time: number
}

export interface PostCancelVacationRequestReq {
  vacation_grant_id: number
  user_id: string
}

export interface PostCancelVacationRequestResp {
  vacation_grant_id: number
}

// API Functions
export async function fetchPostUseVacation(data: PostUseVacationReq): Promise<PostUseVacationResp> {
  const resp: ApiResponse<PostUseVacationResp> = await api.request({
    method: 'post',
    url: `/vacation-usages`,
    data
  });

  if (resp.code !== 'COMMON_200') throw new Error(resp.message);

  return resp.data;
}

export async function fetchGetUserVacationHistory(userId: string): Promise<GetUserVacationHistoryResp> {
  const resp: ApiResponse<GetUserVacationHistoryResp> = await api.request({
    method: 'get',
    url: `/users/${userId}/vacations`
  });

  if (resp.code !== 'COMMON_200') throw new Error(resp.message);

  return resp.data;
}

export async function fetchGetAllUsersVacationHistory(): Promise<GetAllUsersVacationHistoryResp[]> {
  const resp: ApiResponse<GetAllUsersVacationHistoryResp[]> = await api.request({
    method: 'get',
    url: `/vacations`
  });

  if (resp.code !== 'COMMON_200') throw new Error(resp.message);

  return resp.data;
}

export async function fetchGetAvailableVacations(userId: string, startDate: string): Promise<GetAvailableVacationsResp[]> {
  const resp: ApiResponse<GetAvailableVacationsResp[]> = await api.request({
    method: 'get',
    url: `/users/${userId}/vacations/available?startDate=${startDate}`
  });

  if (resp.code !== 'COMMON_200') throw new Error(resp.message);

  return resp.data;
}

export async function fetchPutUpdateVacationUsage(data: PutUpdateVacationUsageReq): Promise<PutUpdateVacationUsageResp> {
  const { vacation_usage_id, ...requestData } = data;
  const resp: ApiResponse<PutUpdateVacationUsageResp> = await api.request({
    method: 'put',
    url: `/vacation-usages/${vacation_usage_id}`,
    data: requestData
  });

  if (resp.code !== 'COMMON_200') throw new Error(resp.message);

  return resp.data;
}

export async function fetchDeleteVacationUsage(vacationUsageId: number): Promise<any> {
  const resp: ApiResponse = await api.request({
    method: 'delete',
    url: `/vacation-usages/${vacationUsageId}`
  });

  if (resp.code !== 'COMMON_200') throw new Error(resp.message);

  return resp.data;
}

export async function fetchGetVacationUsagesByPeriod(startDate: string, endDate: string): Promise<GetVacationUsagesByPeriodResp[]> {
  const resp: ApiResponse<GetVacationUsagesByPeriodResp[]> = await api.request({
    method: 'get',
    url: `/vacation-usages?startDate=${startDate}&endDate=${endDate}`
  });

  if (resp.code !== 'COMMON_200') throw new Error(resp.message);

  return resp.data;
}

export async function fetchGetUserVacationUsagesByPeriod(userId: string, startDate: string, endDate: string): Promise<GetUserVacationUsagesByPeriodResp[]> {
  const resp: ApiResponse<GetUserVacationUsagesByPeriodResp[]> = await api.request({
    method: 'get',
    url: `/users/${userId}/vacation-usages?startDate=${startDate}&endDate=${endDate}`
  });

  if (resp.code !== 'COMMON_200') throw new Error(resp.message);

  return resp.data;
}

export async function fetchGetUserMonthlyVacationStats(userId: string, year: string): Promise<GetUserMonthlyVacationStatsResp[]> {
  const resp: ApiResponse<GetUserMonthlyVacationStatsResp[]> = await api.request({
    method: 'get',
    url: `/users/${userId}/vacation-usages/monthly-stats?year=${year}`
  });

  if (resp.code !== 'COMMON_200') throw new Error(resp.message);

  return resp.data;
}

export async function fetchGetUserVacationStats(userId: string, baseDate: string): Promise<GetUserVacationStatsResp> {
  const resp: ApiResponse<GetUserVacationStatsResp> = await api.request({
    method: 'get',
    url: `/users/${userId}/vacations/stats?baseDate=${baseDate}`
  });

  if (resp.code !== 'COMMON_200') throw new Error(resp.message);

  return resp.data;
}

export async function fetchGetVacationPolicy(vacationPolicyId: number): Promise<GetVacationPolicyResp> {
  const resp: ApiResponse<GetVacationPolicyResp> = await api.request({
    method: 'get',
    url: `/vacation-policies/${vacationPolicyId}`
  });

  if (resp.code !== 'COMMON_200') throw new Error(resp.message);

  return resp.data;
}

export async function fetchGetVacationPolicies(): Promise<GetVacationPoliciesResp[]> {
  const resp: ApiResponse<GetVacationPoliciesResp[]> = await api.request({
    method: 'get',
    url: `/vacation-policies`
  });

  if (resp.code !== 'COMMON_200') throw new Error(resp.message);

  return resp.data;
}

export async function fetchPostVacationPolicy(data: PostVacationPolicyReq): Promise<PostVacationPolicyResp> {
  const resp: ApiResponse<PostVacationPolicyResp> = await api.request({
    method: 'post',
    url: `/vacation-policies`,
    data
  });

  if (resp.code !== 'COMMON_200') throw new Error(resp.message);

  return resp.data;
}

export async function fetchDeleteVacationPolicy(vacationPolicyId: number): Promise<DeleteVacationPolicyResp> {
  const resp: ApiResponse<DeleteVacationPolicyResp> = await api.request({
    method: 'delete',
    url: `/vacation-policies/${vacationPolicyId}`
  });

  if (resp.code !== 'COMMON_200') throw new Error(resp.message);

  return resp.data;
}

export async function fetchPostAssignVacationPoliciesToUser(userId: string, vacationPolicyIds: number[]): Promise<PostAssignVacationPoliciesToUserResp> {
  const resp: ApiResponse<PostAssignVacationPoliciesToUserResp> = await api.request({
    method: 'post',
    url: `/users/${userId}/vacation-policies`,
    data: {
      vacation_policy_ids: vacationPolicyIds
    }
  });

  if (resp.code !== 'COMMON_200') throw new Error(resp.message);

  return resp.data;
}

export async function fetchGetUserVacationPolicies(userId: string, grantMethod?: string): Promise<GetUserVacationPoliciesResp[]> {
  const params = new URLSearchParams();
  if (grantMethod) {
    params.append('grantMethod', grantMethod);
  }
  const queryString = params.toString() ? `?${params.toString()}` : '';

  const resp: ApiResponse<GetUserVacationPoliciesResp[]> = await api.request({
    method: 'get',
    url: `/users/${userId}/vacation-policies${queryString}`
  });

  if (resp.code !== 'COMMON_200') throw new Error(resp.message);

  return resp.data;
}

export async function fetchGetUserAssignedVacationPolicies(userId: string, vacationType?: string, grantMethod?: string): Promise<GetUserAssignedVacationPoliciesResp[]> {
  const params = new URLSearchParams();
  if (vacationType) {
    params.append('vacationType', vacationType);
  }
  if (grantMethod) {
    params.append('grantMethod', grantMethod);
  }
  const queryString = params.toString() ? `?${params.toString()}` : '';

  const resp: ApiResponse<GetUserAssignedVacationPoliciesResp[]> = await api.request({
    method: 'get',
    url: `/users/${userId}/vacation-policies/assigned${queryString}`
  });

  if (resp.code !== 'COMMON_200') throw new Error(resp.message);

  return resp.data;
}

export async function fetchGetUserVacationPolicyAssignmentStatus(userId: string): Promise<GetUserVacationPolicyAssignmentStatusResp> {
  const resp: ApiResponse<GetUserVacationPolicyAssignmentStatusResp> = await api.request({
    method: 'get',
    url: `/users/${userId}/vacation-policies/assignment-status`
  });

  if (resp.code !== 'COMMON_200') throw new Error(resp.message);

  return resp.data;
}

export async function fetchDeleteRevokeVacationPolicyFromUser(userId: string, vacationPolicyId: number): Promise<DeleteRevokeVacationPolicyFromUserResp> {
  const resp: ApiResponse<DeleteRevokeVacationPolicyFromUserResp> = await api.request({
    method: 'delete',
    url: `/users/${userId}/vacation-policies/${vacationPolicyId}`
  });

  if (resp.code !== 'COMMON_200') throw new Error(resp.message);

  return resp.data;
}

export async function fetchDeleteRevokeVacationPoliciesFromUser(userId: string, vacationPolicyIds: number[]): Promise<DeleteRevokeVacationPoliciesFromUserResp> {
  const resp: ApiResponse<DeleteRevokeVacationPoliciesFromUserResp> = await api.request({
    method: 'delete',
    url: `/users/${userId}/vacation-policies`,
    data: {
      vacation_policy_ids: vacationPolicyIds
    }
  });

  if (resp.code !== 'COMMON_200') throw new Error(resp.message);

  return resp.data;
}

export async function fetchPostManualGrantVacation(data: PostManualGrantVacationReq): Promise<PostManualGrantVacationResp> {
  const { user_id, ...requestData } = data;
  const resp: ApiResponse<PostManualGrantVacationResp> = await api.request({
    method: 'post',
    url: `/users/${user_id}/vacation-grants`,
    data: requestData
  });

  if (resp.code !== 'COMMON_200') throw new Error(resp.message);

  return resp.data;
}

export async function fetchDeleteRevokeVacationGrant(vacationGrantId: number): Promise<DeleteRevokeVacationGrantResp> {
  const resp: ApiResponse<DeleteRevokeVacationGrantResp> = await api.request({
    method: 'delete',
    url: `/vacation-grants/${vacationGrantId}`
  });

  if (resp.code !== 'COMMON_200') throw new Error(resp.message);

  return resp.data;
}

export async function fetchPostRequestVacation(data: PostRequestVacationReq): Promise<PostRequestVacationResp> {
  const { user_id, ...requestData } = data;
  const resp: ApiResponse<PostRequestVacationResp> = await api.request({
    method: 'post',
    url: `/users/${user_id}/vacation-requests`,
    data: requestData
  });

  if (resp.code !== 'COMMON_200') throw new Error(resp.message);

  return resp.data;
}

export async function fetchPostApproveVacation(approvalId: number, approverId: string): Promise<PostApproveVacationResp> {
  const resp: ApiResponse<PostApproveVacationResp> = await api.request({
    method: 'post',
    url: `/vacation-approvals/${approvalId}/approve?approverId=${approverId}`
  });

  if (resp.code !== 'COMMON_200') throw new Error(resp.message);

  return resp.data;
}

export async function fetchPostRejectVacation(approvalId: number, approverId: string, rejectionReason: string): Promise<PostRejectVacationResp> {
  const resp: ApiResponse<PostRejectVacationResp> = await api.request({
    method: 'post',
    url: `/vacation-approvals/${approvalId}/reject?approverId=${approverId}`,
    data: { rejection_reason: rejectionReason }
  });

  if (resp.code !== 'COMMON_200') throw new Error(resp.message);

  return resp.data;
}

export async function fetchGetAllVacationsByApprover(approverId: string, status?: string): Promise<GetUserRequestedVacationsResp[]> {
  const params = new URLSearchParams();
  if (status) {
    params.append('status', status);
  }
  const queryString = params.toString() ? `?${params.toString()}` : '';

  const resp: ApiResponse<GetUserRequestedVacationsResp[]> = await api.request({
    method: 'get',
    url: `/users/${approverId}/vacation-approvals${queryString}`
  });

  if (resp.code !== 'COMMON_200') throw new Error(resp.message);

  return resp.data;
}

export async function fetchGetUserRequestedVacations(userId: string): Promise<GetUserRequestedVacationsResp[]> {
  const resp: ApiResponse<GetUserRequestedVacationsResp[]> = await api.request({
    method: 'get',
    url: `/users/${userId}/vacation-requests`
  });

  if (resp.code !== 'COMMON_200') throw new Error(resp.message);

  return resp.data;
}

export async function fetchGetUserRequestedVacationStats(userId: string): Promise<GetUserRequestedVacationStatsResp> {
  const resp: ApiResponse<GetUserRequestedVacationStatsResp> = await api.request({
    method: 'get',
    url: `/users/${userId}/vacation-requests/stats`
  });

  if (resp.code !== 'COMMON_200') throw new Error(resp.message);

  return resp.data;
}

export async function fetchPostCancelVacationRequest(vacationGrantId: number, userId: string): Promise<PostCancelVacationRequestResp> {
  const resp: ApiResponse<PostCancelVacationRequestResp> = await api.request({
    method: 'post',
    url: `/vacation-requests/${vacationGrantId}/cancel?userId=${userId}`
  });

  if (resp.code !== 'COMMON_200') throw new Error(resp.message);

  return resp.data;
}
