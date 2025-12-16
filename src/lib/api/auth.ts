import { api, type ApiResponse } from '@/lib/api';

// Request/Response Types
export interface PostLoginReq {
  formData: FormData
}

export interface PostLoginResp {
  user_id: string
  user_name: string
  user_email: string
  user_role: string
  is_login: string
}

export interface PermissionInfo {
  permission_code: string;
  permission_name: string;
}

export interface RoleInfo {
  role_code: string;
  role_name: string;
  permissions: PermissionInfo[];
}

export interface GetLoginCheck {
  user_id: string;
  user_name: string;
  user_email: string;
  roles: RoleInfo[];
  user_roles: string[];
  user_role_name: string | null;
  permissions: string[];
  is_login: string;
  profile_url?: string;
}

export interface GetValidateInvitationTokenReq {
  token: string
}

export interface GetValidateInvitationTokenResp {
  user_id: string
  user_name: string
  user_email: string
  user_role_type: string
  user_work_time: string
  user_origin_company_type: string
  invitation_sent_at: string
  invitation_expires_at: string
  invitation_status: string
}

export interface PostCompleteSignupReq {
  invitation_token: string
  user_birth: string
  lunar_yn: string
}

export interface PostCompleteSignupResp {
  user_id: string
  user_name: string
  user_email: string
}

// API Functions
export async function fetchPostLogin(formData: FormData): Promise<PostLoginResp> {
  // FormData를 URLSearchParams로 변환 (Spring Security Form 로그인은 application/x-www-form-urlencoded를 사용)
  const params = new URLSearchParams();
  formData.forEach((value, key) => {
    params.append(key, value.toString());
  });

  const resp: ApiResponse<PostLoginResp> = await api.request({
    method: 'post',
    url: `/login`,
    data: params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });

  return resp.data;
}

export async function fetchPostLogout(): Promise<void> {
  await api.request({
    method: 'post',
    url: `/logout`
  });
}

export async function fetchGetLoginCheck(): Promise<GetLoginCheck> {
  const resp: ApiResponse<GetLoginCheck> = await api.request({
    method: 'get',
    url: `/login/check`
  });

  if (!resp.success) throw new Error(resp.message);

  return resp.data;
}

export async function fetchGetValidateInvitationToken(token: string): Promise<GetValidateInvitationTokenResp> {
  const resp: ApiResponse<GetValidateInvitationTokenResp> = await api.request({
    method: 'get',
    url: `/oauth2/signup/validate?token=${token}`
  });

  if (!resp.success) throw new Error(resp.message);

  return resp.data;
}

export async function fetchPostCompleteSignup(reqData: PostCompleteSignupReq): Promise<PostCompleteSignupResp> {
  const resp: ApiResponse<PostCompleteSignupResp> = await api.request({
    method: 'post',
    url: `/oauth2/signup/invitation/complete`,
    data: reqData
  });

  return resp.data;
}

export async function fetchGetCsrfToken(): Promise<null> {
  await api.get('/csrf-token');
  return null;
}
