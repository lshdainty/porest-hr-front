import { api, type ApiResponse } from '@/lib/api';

// Request/Response Types

// 권한 응답 DTO
export interface PermissionResp {
  code: string
  name: string
  description: string
  resource: string
  action: string
}

// 권한 생성 요청 DTO
export interface CreatePermissionReq {
  code: string
  name: string
  description?: string
  resource: string
  action: string
}

// 권한 수정 요청 DTO
export interface UpdatePermissionReq {
  name?: string
  description?: string
  resource?: string
  action?: string
}

// API Functions

// 현재 사용자의 권한 목록 조회
export async function fetchGetMyPermissions(): Promise<string[]> {
  const resp: ApiResponse<string[]> = await api.request({
    method: 'get',
    url: `/permissions/my`
  });

  if (resp.code !== 'COMMON_200') throw new Error(resp.message);

  return resp.data;
}

// 전체 권한 목록 조회
export async function fetchGetPermissions(): Promise<PermissionResp[]> {
  const resp: ApiResponse<PermissionResp[]> = await api.request({
    method: 'get',
    url: `/permissions`
  });

  if (resp.code !== 'COMMON_200') throw new Error(resp.message);

  return resp.data;
}

// 특정 권한 조회
export async function fetchGetPermission(permissionCode: string): Promise<PermissionResp> {
  const resp: ApiResponse<PermissionResp> = await api.request({
    method: 'get',
    url: `/permissions/${permissionCode}`
  });

  if (resp.code !== 'COMMON_200') throw new Error(resp.message);

  return resp.data;
}

// 리소스별 권한 목록 조회
export async function fetchGetPermissionsByResource(resource: string): Promise<PermissionResp[]> {
  const resp: ApiResponse<PermissionResp[]> = await api.request({
    method: 'get',
    url: `/permissions/resource/${resource}`
  });

  if (resp.code !== 'COMMON_200') throw new Error(resp.message);

  return resp.data;
}

// 권한 생성
export async function fetchPostPermission(data: CreatePermissionReq): Promise<string> {
  const resp: ApiResponse<string> = await api.request({
    method: 'post',
    url: `/permissions`,
    data
  });

  if (resp.code !== 'COMMON_200') throw new Error(resp.message);

  return resp.data;
}

// 권한 수정
export async function fetchPutPermission(
  permissionCode: string,
  data: UpdatePermissionReq
): Promise<void> {
  const resp: ApiResponse<void> = await api.request({
    method: 'put',
    url: `/permissions/${permissionCode}`,
    data
  });

  if (resp.code !== 'COMMON_200') throw new Error(resp.message);
}

// 권한 삭제
export async function fetchDeletePermission(permissionCode: string): Promise<void> {
  const resp: ApiResponse<void> = await api.request({
    method: 'delete',
    url: `/permissions/${permissionCode}`
  });

  if (resp.code !== 'COMMON_200') throw new Error(resp.message);
}
