import { api, type ApiResponse } from '@/lib/api';

// Request/Response Types

// 역할 응답 DTO
export interface RoleResp {
  role_code: string
  role_name: string
  description: string
  permissions: string[]
}

// 역할 생성 요청 DTO
export interface CreateRoleReq {
  role_code: string
  role_name: string
  description?: string
  permission_codes?: string[]
}

// 역할 수정 요청 DTO
export interface UpdateRoleReq {
  description?: string
  permission_codes?: string[]
}

// 역할 권한 수정 요청 DTO
export interface UpdateRolePermissionsReq {
  permission_codes: string[]
}

// 역할에 권한 추가/제거 요청 DTO
export interface RolePermissionReq {
  permission_code: string
}

// API Functions

// 전체 역할 목록 조회
export async function fetchGetRoles(): Promise<RoleResp[]> {
  const resp: ApiResponse<RoleResp[]> = await api.request({
    method: 'get',
    url: `/roles`
  });

  if (resp.code !== 200) throw new Error(resp.message);

  return resp.data;
}

// 특정 역할 조회
export async function fetchGetRole(roleCode: string): Promise<RoleResp> {
  const resp: ApiResponse<RoleResp> = await api.request({
    method: 'get',
    url: `/roles/${roleCode}`
  });

  if (resp.code !== 200) throw new Error(resp.message);

  return resp.data;
}

// 역할 생성
export async function fetchPostRole(data: CreateRoleReq): Promise<string> {
  const resp: ApiResponse<string> = await api.request({
    method: 'post',
    url: `/roles`,
    data
  });

  if (resp.code !== 200) throw new Error(resp.message);

  return resp.data;
}

// 역할 수정
export async function fetchPutRole(roleCode: string, data: UpdateRoleReq): Promise<void> {
  const resp: ApiResponse<void> = await api.request({
    method: 'put',
    url: `/roles/${roleCode}`,
    data
  });

  if (resp.code !== 200) throw new Error(resp.message);
}

// 역할 삭제
export async function fetchDeleteRole(roleCode: string): Promise<void> {
  const resp: ApiResponse<void> = await api.request({
    method: 'delete',
    url: `/roles/${roleCode}`
  });

  if (resp.code !== 200) throw new Error(resp.message);
}

// 역할 권한 목록 조회
export async function fetchGetRolePermissions(roleCode: string): Promise<import('./permission').PermissionResp[]> {
  const resp: ApiResponse<import('./permission').PermissionResp[]> = await api.request({
    method: 'get',
    url: `/roles/${roleCode}/permissions`
  });

  if (resp.code !== 200) throw new Error(resp.message);

  return resp.data;
}

// 역할 권한 설정 (전체 교체)
export async function fetchPutRolePermissions(
  roleCode: string,
  data: UpdateRolePermissionsReq
): Promise<void> {
  const resp: ApiResponse<void> = await api.request({
    method: 'put',
    url: `/roles/${roleCode}/permissions`,
    data
  });

  if (resp.code !== 200) throw new Error(resp.message);
}

// 역할에 권한 추가
export async function fetchPostRolePermission(
  roleCode: string,
  data: RolePermissionReq
): Promise<void> {
  const resp: ApiResponse<void> = await api.request({
    method: 'post',
    url: `/roles/${roleCode}/permissions`,
    data
  });

  if (resp.code !== 200) throw new Error(resp.message);
}

// 역할에서 권한 제거
export async function fetchDeleteRolePermission(
  roleCode: string,
  permissionCode: string
): Promise<void> {
  const resp: ApiResponse<void> = await api.request({
    method: 'delete',
    url: `/roles/${roleCode}/permissions/${permissionCode}`
  });

  if (resp.code !== 200) throw new Error(resp.message);
}
