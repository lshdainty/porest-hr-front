import { api, type ApiResponse } from '@/lib/api';

// Request/Response Types
export interface PostDepartmentReq {
  department_name: string
  department_name_kr: string
  parent_id?: number | null
  head_user_id?: string
  tree_level?: number
  department_desc?: string
  color_code?: string
  company_id?: string
}

export interface PostDepartmentResp {
  department_id: number
}

export interface PutDepartmentReq {
  department_name?: string
  department_name_kr?: string
  parent_id?: number | null
  head_user_id?: string
  tree_level?: number
  department_desc?: string
  color_code?: string
  company_id?: string
}

export interface GetDepartmentResp {
  department_id: number
  department_name: string
  department_name_kr: string
  parent_id: number
  head_user_id: string
  tree_level: number
  department_desc: string
  color_code: string
  company_id: string
}

export interface GetDepartmentWithChildrenResp {
  department_id: number
  department_name: string
  department_name_kr: string
  parent_id: number
  head_user_id: string
  tree_level: number
  department_desc: string
  color_code: string
  company_id: string
  children: GetDepartmentWithChildrenResp[]
}

export interface UserInfo {
  user_id: string
  user_name: string
  main_yn: 'Y' | 'N'
}

export interface GetDepartmentUsersResp {
  department_id: number
  department_name: string
  department_name_kr: string
  parent_id: number | null
  head_user_id: string | null
  tree_level: number
  department_desc: string | null
  color_code: string | null
  company_id: string
  users_in_department: UserInfo[]
  users_not_in_department: UserInfo[]
}

export interface UserDepartmentInfo {
  user_id: string
  main_yn: 'Y' | 'N'
}

export interface PostDepartmentUsersReq {
  users: UserDepartmentInfo[]
}

export interface PostDepartmentUsersResp {
  user_department_ids: number[]
}

export interface DeleteDepartmentUsersReq {
  user_ids: string[]
}

export interface CheckUserMainDepartmentResp {
  has_main_department: 'Y' | 'N'
}

// API Functions
export async function fetchPostDepartment(data: PostDepartmentReq): Promise<PostDepartmentResp> {
  const resp: ApiResponse<PostDepartmentResp> = await api.request({
    method: 'post',
    url: `/departments`,
    data
  });

  if (resp.code !== 200) throw new Error(resp.message);

  return resp.data;
}

export async function fetchPutDepartment(departmentId: number, data: PutDepartmentReq): Promise<void> {
  await api.request({
    method: 'put',
    url: `/departments/${departmentId}`,
    data
  });
}

export async function fetchDeleteDepartment(departmentId: number): Promise<void> {
  await api.request({
    method: 'delete',
    url: `/departments/${departmentId}`
  });
}

export async function fetchGetDepartment(departmentId: number): Promise<GetDepartmentResp> {
  const resp: ApiResponse<GetDepartmentResp> = await api.request({
    method: 'get',
    url: `/departments/${departmentId}`
  });

  if (resp.code !== 200) throw new Error(resp.message);

  return resp.data;
}

export async function fetchGetDepartmentWithChildren(departmentId: number): Promise<GetDepartmentWithChildrenResp> {
  const resp: ApiResponse<GetDepartmentWithChildrenResp> = await api.request({
    method: 'get',
    url: `/departments/${departmentId}/children`
  });

  if (resp.code !== 200) throw new Error(resp.message);

  return resp.data;
}

export async function fetchGetDepartmentUsers(departmentId: number): Promise<GetDepartmentUsersResp> {
  const resp: ApiResponse<GetDepartmentUsersResp> = await api.request({
    method: 'get',
    url: `/departments/${departmentId}/users`
  });

  if (resp.code !== 200) throw new Error(resp.message);

  return resp.data;
}

export async function fetchPostDepartmentUsers(departmentId: number, data: PostDepartmentUsersReq): Promise<PostDepartmentUsersResp> {
  const resp: ApiResponse<PostDepartmentUsersResp> = await api.request({
    method: 'post',
    url: `/departments/${departmentId}/users`,
    data
  });

  if (resp.code !== 200) throw new Error(resp.message);

  return resp.data;
}

export async function fetchDeleteDepartmentUsers(departmentId: number, data: DeleteDepartmentUsersReq): Promise<void> {
  await api.request({
    method: 'delete',
    url: `/departments/${departmentId}/users`,
    data
  });
}

export async function fetchGetCheckUserMainDepartment(userId: string): Promise<CheckUserMainDepartmentResp> {
  const resp: ApiResponse<CheckUserMainDepartmentResp> = await api.request({
    method: 'get',
    url: `/users/${userId}/main-department/existence`
  });

  if (resp.code !== 200) throw new Error(resp.message);

  return resp.data;
}
