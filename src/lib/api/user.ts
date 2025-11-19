import { api, type ApiResponse } from '@/lib/api';

// Request/Response Types
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
  user_role_type: string
  user_role_name: string
  user_origin_company_type: string
  user_origin_company_name: string
  main_department_name_kr: string | null
  lunar_yn: string
  profile_url: string
  invitation_token?: string
  invitation_sent_at?: string
  invitation_expires_at?: string
  invitation_status?: string
  registered_at?: string
}

export interface GetUsersResp {
  user_id: string
  user_name: string
  user_email: string
  user_birth: string
  user_work_time: string
  join_date: string
  user_role_type: string
  user_role_name: string
  user_origin_company_type: string
  user_origin_company_name: string
  main_department_name_kr: string | null
  lunar_yn: string
  profile_url: string
  invitation_token?: string
  invitation_sent_at?: string
  invitation_expires_at?: string
  invitation_status?: string
  registered_at?: string
}

export interface GetUserApproversReq {
  user_id: string
}

export interface GetUserApproversResp {
  user_id: string
  user_name: string
  user_email: string
  user_role_type: string
  user_role_name: string
  department_id: number
  department_name: string
  department_name_kr: string
  department_level: number
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
  user_origin_company_type: string
  user_department_type: string
  user_work_time: string
  lunar_yn: string
  profile_url: string
  profile_uuid: string
}

export interface PutUserReq {
  user_id: string
  user_name: string
  user_email: string
  user_birth: string
  user_role_type: string
  user_origin_company_type: string
  user_department_type: string
  user_work_time: string
  lunar_yn: string
  profile_url: string
  profile_uuid: string
}

export interface PutInvitedUserReq {
  user_id: string
  user_name: string
  user_email: string
  user_origin_company_type: string
  user_work_time: string
  join_date: string
}

export interface PutInvitedUserResp {
  user_id: string
  user_name: string
  user_email: string
  user_origin_company_type: string
  user_work_time: string
  join_date: string
  user_role_type: string
  invitation_sent_at: string
  invitation_expires_at: string
  invitation_status: string
}

export interface PostUserInviteReq {
  user_id: string
  user_name: string
  user_email: string
  user_origin_company_type: string
  user_work_time: string
  join_date: string
}

export interface PostUserInviteResp {
  user_id: string
  user_name: string
  user_email: string
  user_origin_company_type: string
  user_work_time: string
  join_date: string
  user_role_type: string
  invitation_sent_at: string
  invitation_expires_at: string
  invitation_status: string
}

// API Functions
export async function fetchGetUser(userId: string): Promise<GetUserResp> {
  const resp: ApiResponse<GetUserResp> = await api.request({
    method: 'get',
    url: `/users/${userId}`
  });

  if (resp.code !== 200) throw new Error(resp.message);

  return resp.data;
}

export async function fetchGetUsers(): Promise<GetUsersResp[]> {
  const resp: ApiResponse<GetUsersResp[]> = await api.request({
    method: 'get',
    url: `/users`
  });

  if (resp.code !== 200) throw new Error(resp.message);

  return resp.data;
}

export async function fetchGetUserApprovers(userId: string): Promise<GetUserApproversResp[]> {
  const resp: ApiResponse<GetUserApproversResp[]> = await api.request({
    method: 'get',
    url: `/users/${userId}/approvers`
  });

  if (resp.code !== 200) throw new Error(resp.message);

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

  if (resp.code !== 200) throw new Error(resp.message);

  return resp.data;
}

export async function fetchPostUser(data: PostUserReq): Promise<any> {
  const resp: ApiResponse = await api.request({
    method: 'post',
    url: `/users`,
    data
  });

  if (resp.code !== 200) throw new Error(resp.message);

  return resp.data;
}

export async function fetchPutUser(data: PutUserReq): Promise<any> {
  const resp: ApiResponse = await api.request({
    method: 'put',
    url: `/users/${data.user_id}`,
    data
  });

  if (resp.code !== 200) throw new Error(resp.message);

  return resp.data;
}

export async function fetchPutInvitedUser(data: PutInvitedUserReq): Promise<PutInvitedUserResp> {
  const resp: ApiResponse<PutInvitedUserResp> = await api.request({
    method: 'put',
    url: `/users/${data.user_id}/invitations`,
    data: {
      user_name: data.user_name,
      user_email: data.user_email,
      user_origin_company_type: data.user_origin_company_type,
      user_work_time: data.user_work_time,
      join_date: data.join_date
    }
  });

  if (resp.code !== 200) throw new Error(resp.message);

  return resp.data;
}

export async function fetchDeleteUser(userId: string): Promise<any> {
  const resp: ApiResponse = await api.request({
    method: 'delete',
    url: `/users/${userId}`
  });

  if (resp.code !== 200) throw new Error(resp.message);

  return resp.data;
}

export async function fetchPostUserInvite(data: PostUserInviteReq): Promise<PostUserInviteResp> {
  const resp: ApiResponse<PostUserInviteResp> = await api.request({
    method: 'post',
    url: `/users/invitations`,
    data
  });

  if (resp.code !== 200) throw new Error(resp.message);

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

  if (resp.code !== 200) throw new Error(resp.message);

  return resp.data;
}

export async function fetchPostResendInvitation(userId: string): Promise<any> {
  const resp: ApiResponse = await api.request({
    method: 'post',
    url: `/users/${userId}/invitations/resend`
  });

  if (resp.code !== 200) throw new Error(resp.message);

  return resp.data;
}
