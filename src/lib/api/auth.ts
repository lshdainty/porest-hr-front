import { api, type ApiResponse } from '@/lib/api';

// Response Types

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

// API Functions

/**
 * 로그인 사용자 정보 조회 (JWT 토큰 기반)
 * JWT 토큰을 Authorization 헤더로 전송하여 사용자 정보를 조회합니다.
 */
export async function fetchGetLoginCheck(): Promise<GetLoginCheck> {
  const resp: ApiResponse<GetLoginCheck> = await api.request({
    method: 'get',
    url: `/login/check`
  });

  if (!resp.success) throw new Error(resp.message);

  return resp.data;
}
