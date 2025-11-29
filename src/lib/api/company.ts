import { api, type ApiResponse } from '@/lib/api';

// Request/Response Types
export interface PostCompanyReq {
  company_id: string
  company_name: string
  company_desc: string
}

export interface PostCompanyResp {
  company_id: string
}

export interface GetCompanyResp {
  company_id: string
  company_name: string
  company_desc: string
}

export interface PutCompanyReq {
  company_name?: string
  company_desc?: string
}

export interface GetCompanyWithDepartmentsReq {
  company_id: string
}

export interface GetCompanyWithDepartmentResp {
  company_id: string
  company_name: string
  company_desc: string
  departments: Array<GetCompanyWithDepartment>
}

export interface GetCompanyWithDepartment {
  department_id: number
  department_name: string
  department_name_kr: string
  parent_id: number
  head_user_id: string
  tree_level: number
  department_desc: string
  color_code: string
  children: Array<GetCompanyWithDepartment>
}

// API Functions
export async function fetchPostCompany(data: PostCompanyReq): Promise<PostCompanyResp> {
  const resp: ApiResponse<PostCompanyResp> = await api.request({
    method: 'post',
    url: `/company`,
    data
  });

  return resp.data;
}

export async function fetchGetCompany(): Promise<GetCompanyResp> {
  const resp: ApiResponse<GetCompanyResp> = await api.request({
    method: 'get',
    url: `/company`
  });

  if (!resp.success) throw new Error(resp.message);

  return resp.data;
}

export async function fetchPutCompany(companyId: string, data: PutCompanyReq): Promise<void> {
  await api.request({
    method: 'put',
    url: `/company/${companyId}`,
    data
  });
}

export async function fetchDeleteCompany(companyId: string): Promise<void> {
  if (!companyId || companyId.trim() === '') {
    throw new Error('회사 ID가 필요합니다.');
  }

  await api.request({
    method: 'delete',
    url: `/company/${companyId}`
  });
}

export async function fetchGetCompanyWithDepartments(companyId: string): Promise<GetCompanyWithDepartmentResp> {
  const resp: ApiResponse<GetCompanyWithDepartmentResp> = await api.request({
    method: 'get',
    url: `/company/${companyId}/departments`
  });

  if (!resp.success) throw new Error(resp.message);

  return resp.data;
}
