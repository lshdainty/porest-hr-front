import { api, type ApiResponse } from '@/lib/api';

// Request/Response Types
// Request/Response Types
export interface RoleDetailResp {
  role_code: string
  role_name: string
  permissions: PermissionDetailResp[]
}

export interface PermissionDetailResp {
  permission_code: string
  permission_name: string
}

export interface GetUserReq {
  user_id: string
}

export interface GetUserResp {
  user_id: string
  user_name: string
  user_email: string
  user_birth: string
  user_work_time: string
  join_date: string
  roles: RoleDetailResp[]
  user_roles: string[]
  user_role_name: string
  permissions: string[]
  user_company_type: string
  user_origin_company_name: string
  main_department_name_kr: string | null
  lunar_yn: string
  profile_url: string
  country_code: string
  invitation_token?: string
  invitation_sent_at?: string
  invitation_expires_at?: string
  invitation_status?: string
  registered_at?: string
  dashboard?: string
}

export interface GetUsersResp {
  user_id: string
  user_name: string
  user_email: string
  user_birth: string
  user_work_time: string
  join_date: string
  roles: RoleDetailResp[]
  user_roles: string[]
  user_role_name: string
  permissions: string[]
  user_company_type: string
  user_origin_company_name: string
  main_department_name_kr: string | null
  lunar_yn: string
  profile_url: string
  country_code: string
  invitation_token?: string
  invitation_sent_at?: string
  invitation_expires_at?: string
  invitation_status?: string
  registered_at?: string
  dashboard?: string
}

export interface GetUserApproversReq {
  user_id: string
}

export interface ApproverDetailResp {
  user_id: string
  user_name: string
  user_email: string
  roles: RoleDetailResp[]
  user_roles: string[]
  user_role_name: string
  permissions: string[]
  department_id: number
  department_name: string
  department_name_kr: string
  department_level: number
}

export interface GetUserApproversResp {
  approvers: ApproverDetailResp[]
  max_available_count: number
  is_auto_approval: boolean
}

export interface GetUserIdDuplicateReq {
  user_id: string
}

export interface GetUserIdDuplicateResp {
  duplicate: boolean
}

export interface PostUserReq {
  user_id: string
  user_name: string
  user_email: string
  user_birth: string
  user_company_type: string
  user_work_time: string
  lunar_yn: string
  profile_url: string
  profile_uuid: string
}

export interface PutUserReq {
  user_id: string // Path variable
  user_name: string
  user_email: string
  user_birth: string
  user_roles?: string[]
  user_company_type: string
  user_work_time: string
  lunar_yn: string
  profile_url: string
  profile_uuid?: string
  country_code: string
  dashboard?: string
}

export interface PutInvitedUserReq {
  user_id: string
  user_name: string
  user_email: string
  user_company_type: string
  user_work_time: string
  join_date: string
  country_code: string
}

export interface PutInvitedUserResp {
  user_id: string
  user_name: string
  user_email: string
  user_company_type: string
  user_work_time: string
  join_date: string
  country_code: string
  user_roles: string[]
  invitation_sent_at: string
  invitation_expires_at: string
  invitation_status: string
}

export interface PostUserInviteReq {
  user_id: string
  user_name: string
  user_email: string
  user_company_type: string
  user_work_time: string
  join_date: string
  country_code: string
}

export interface PostUserInviteResp {
  user_id: string
  user_name: string
  user_email: string
  user_company_type: string
  user_work_time: string
  join_date: string
  country_code: string
  user_roles: string[]
  invitation_sent_at: string
  invitation_expires_at: string
  invitation_status: string
}

export interface UpdateDashboardReq {
  dashboard: string
}

export interface UpdateDashboardResp {
  user_id: string
  dashboard: string
}

export interface ResetPasswordReq {
  user_id: string
  new_password: string
}

// 비밀번호 초기화 요청 (비로그인)
export interface RequestPasswordResetReq {
  user_id: string
  email: string
}

// 비밀번호 변경 (로그인 사용자)
export interface ChangePasswordReq {
  current_password: string
  new_password: string
  new_password_confirm: string
}

// API Functions
export async function fetchGetUser(userId: string): Promise<GetUserResp> {
  const resp: ApiResponse<GetUserResp> = await api.request({
    method: 'get',
    url: `/users/${userId}`
  });

  if (!resp.success) throw new Error(resp.message);

  return resp.data;
}

export async function fetchGetUsers(): Promise<GetUsersResp[]> {
  const resp: ApiResponse<GetUsersResp[]> = await api.request({
    method: 'get',
    url: `/users`
  });

  if (!resp.success) throw new Error(resp.message);

  return resp.data;
}

export async function fetchGetUserApprovers(userId: string): Promise<GetUserApproversResp> {
  const resp: ApiResponse<GetUserApproversResp> = await api.request({
    method: 'get',
    url: `/users/${userId}/approvers`
  });

  if (!resp.success) throw new Error(resp.message);

  return resp.data;
}

export async function fetchGetUserIdDuplicate(userId: string): Promise<GetUserIdDuplicateResp> {
  const resp: ApiResponse<GetUserIdDuplicateResp> = await api.request({
    method: 'get',
    url: `/users/check-duplicate`,
    params: {
      user_id: userId
    }
  });

  if (!resp.success) throw new Error(resp.message);

  return resp.data;
}

export async function fetchPostUser(data: PostUserReq): Promise<any> {
  const resp: ApiResponse = await api.request({
    method: 'post',
    url: `/users`,
    data
  });

  if (!resp.success) throw new Error(resp.message);

  return resp.data;
}

export async function fetchPutUser(data: PutUserReq): Promise<any> {
  const { user_id, ...rest } = data;
  const resp: ApiResponse = await api.request({
    method: 'put',
    url: `/users/${user_id}`,
    data: rest
  });

  if (!resp.success) throw new Error(resp.message);

  return resp.data;
}

export async function fetchPutInvitedUser(data: PutInvitedUserReq): Promise<PutInvitedUserResp> {
  const resp: ApiResponse<PutInvitedUserResp> = await api.request({
    method: 'put',
    url: `/users/${data.user_id}/invitations`,
    data: {
      user_name: data.user_name,
      user_email: data.user_email,
      user_company_type: data.user_company_type,
      user_work_time: data.user_work_time,
      join_date: data.join_date,
      country_code: data.country_code
    }
  });

  if (!resp.success) throw new Error(resp.message);

  return resp.data;
}

export async function fetchDeleteUser(userId: string): Promise<any> {
  const resp: ApiResponse = await api.request({
    method: 'delete',
    url: `/users/${userId}`
  });

  if (!resp.success) throw new Error(resp.message);

  return resp.data;
}

export async function fetchPostUserInvite(data: PostUserInviteReq): Promise<PostUserInviteResp> {
  const resp: ApiResponse<PostUserInviteResp> = await api.request({
    method: 'post',
    url: `/users/invitations`,
    data
  });

  if (!resp.success) throw new Error(resp.message);

  return resp.data;
}

export async function fetchPostUploadProfile(file: File): Promise<any> {
  const formData = new FormData();
  formData.append('profile', file);

  const resp: ApiResponse = await api.request({
    method: 'post',
    url: `/users/profiles`,
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  });

  if (!resp.success) throw new Error(resp.message);

  return resp.data;
}

export async function fetchPostResendInvitation(userId: string): Promise<any> {
  const resp: ApiResponse = await api.request({
    method: 'post',
    url: `/users/${userId}/invitations/resend`
  });

  if (!resp.success) throw new Error(resp.message);

  return resp.data;
}

export async function fetchUpdateDashboard(userId: string, data: UpdateDashboardReq): Promise<UpdateDashboardResp> {
  const resp: ApiResponse<UpdateDashboardResp> = await api.request({
    method: 'patch',
    url: `/users/${userId}/dashboard`,
    data
  });

  if (!resp.success) throw new Error(resp.message);

  return resp.data;
}

export async function fetchResetPassword(data: ResetPasswordReq): Promise<void> {
  const resp: ApiResponse = await api.request({
    method: 'patch',
    url: `/users/${data.user_id}/password`,
    data: {
      new_password: data.new_password
    }
  });

  if (!resp.success) throw new Error(resp.message);
}

// 비밀번호 초기화 요청 (비로그인)
export async function fetchRequestPasswordReset(data: RequestPasswordResetReq): Promise<void> {
  const resp: ApiResponse = await api.request({
    method: 'post',
    url: `/users/password/reset-request`,
    data
  });

  if (!resp.success) throw new Error(resp.message);
}

// 비밀번호 변경 (로그인 사용자)
export async function fetchChangePassword(data: ChangePasswordReq): Promise<void> {
  const resp: ApiResponse = await api.request({
    method: 'patch',
    url: `/users/me/password`,
    data
  });

  if (!resp.success) throw new Error(resp.message);
}
