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
  password_change_required?: string;
}

// ID/PW 회원가입 - 1단계: 초대 확인
export interface PostRegistrationValidateReq {
  user_id: string
  user_name: string
  user_email: string
  invitation_code: string
}

export interface PostRegistrationValidateResp {
  valid: boolean
  message: string
}

// ID/PW 회원가입 - 2단계: 회원가입 완료
export interface PostRegistrationCompleteReq {
  new_user_id: string
  new_user_email: string
  password: string
  password_confirm: string
  user_birth: string
  lunar_yn: string
}

export interface PostRegistrationCompleteResp {
  user_id: string
}

// ID 중복 확인
export interface GetCheckUserIdDuplicateResp {
  duplicate: boolean
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

export async function fetchGetCsrfToken(): Promise<null> {
  await api.get('/csrf-token');
  return null;
}

// ID/PW 회원가입 - 1단계: 초대 확인
export async function fetchPostRegistrationValidate(
  reqData: PostRegistrationValidateReq
): Promise<PostRegistrationValidateResp> {
  const resp: ApiResponse<PostRegistrationValidateResp> = await api.request({
    method: 'post',
    url: `/users/registration/validate`,
    data: reqData
  });

  if (!resp.success) throw new Error(resp.message);

  return resp.data;
}

// ID/PW 회원가입 - 2단계: 회원가입 완료
export async function fetchPostRegistrationComplete(
  reqData: PostRegistrationCompleteReq
): Promise<PostRegistrationCompleteResp> {
  const resp: ApiResponse<PostRegistrationCompleteResp> = await api.request({
    method: 'post',
    url: `/users/registration/complete`,
    data: reqData
  });

  if (!resp.success) throw new Error(resp.message);

  return resp.data;
}

// ID 중복 확인
export async function fetchGetCheckUserIdDuplicate(
  userId: string
): Promise<GetCheckUserIdDuplicateResp> {
  const resp: ApiResponse<GetCheckUserIdDuplicateResp> = await api.request({
    method: 'get',
    url: `/users/check-duplicate`,
    params: { user_id: userId }
  });

  if (!resp.success) throw new Error(resp.message);

  return resp.data;
}
