import { api, type ApiResponse } from '@/lib/api';

// Request/Response Types
export interface GetYearDuesReq {
  year: number
}

export interface GetYearDuesResp {
  dues_id: number
  dues_user_name: string
  dues_amount: number
  dues_type: 'OPERATION' | 'BIRTH' | 'FINE'
  dues_calc: 'PLUS' | 'MINUS'
  dues_date: string
  dues_detail: string
  total_dues: number
}

export interface GetYearOperationDuesReq {
  year: number
}

export interface GetYearOperationDuesResp {
  total_dues: number
  total_deposit: number
  total_withdrawal: number
}

export interface GetMonthBirthDuesReq {
  year: number
  month: number
}

export interface GetMonthBirthDuesResp {
  birth_month_dues: number
}

export interface GetUsersMonthBirthDuesReq {
  year: number
}

export interface GetUsersMonthBirthDuesResp {
  dues_user_name: string
  month_birth_dues: Array<number>
}

export interface PostDuesReq {
  dues_amount: number
  dues_type: 'OPERATION' | 'BIRTH' | 'FINE'
  dues_calc: 'PLUS' | 'MINUS'
  dues_date: string
  dues_detail: string
  dues_user_name: string
}

export interface PutDuesReq {
  dues_id: number
  dues_amount: number
  dues_type: 'OPERATION' | 'BIRTH' | 'FINE'
  dues_calc: 'PLUS' | 'MINUS'
  dues_date: string
  dues_detail: string
  dues_user_name: string
}

// API Functions
export async function fetchGetYearDues(year: number): Promise<GetYearDuesResp[]> {
  const resp: ApiResponse<GetYearDuesResp[]> = await api.request({
    method: 'get',
    url: `/dues?year=${year}`
  });

  if (!resp.success) throw new Error(resp.message);

  return resp.data;
}

export async function fetchGetYearOperationDues(year: number): Promise<GetYearOperationDuesResp> {
  const resp: ApiResponse<GetYearOperationDuesResp> = await api.request({
    method: 'get',
    url: `/dues/operation?year=${year}`
  });

  if (!resp.success) throw new Error(resp.message);

  return resp.data;
}

export async function fetchGetMonthBirthDues(year: number, month: number): Promise<GetMonthBirthDuesResp> {
  const resp: ApiResponse<GetMonthBirthDuesResp> = await api.request({
    method: 'get',
    url: `/dues/birth/month?year=${year}&month=${month}`
  });

  if (!resp.success) throw new Error(resp.message);

  return resp.data;
}

export async function fetchGetUsersMonthBirthDues(year: number): Promise<GetUsersMonthBirthDuesResp[]> {
  const resp: ApiResponse<GetUsersMonthBirthDuesResp[]> = await api.request({
    method: 'get',
    url: `/dues/users/birth/month?year=${year}`
  });

  if (!resp.success) throw new Error(resp.message);

  return resp.data;
}

export async function fetchPostDues(data: PostDuesReq): Promise<any> {
  const resp: ApiResponse = await api.request({
    method: 'post',
    url: `/dues`,
    data
  });

  if (!resp.success) throw new Error(resp.message);

  return resp.data;
}

export async function fetchPutDues(data: PutDuesReq): Promise<any> {
  const resp: ApiResponse = await api.request({
    method: 'put',
    url: `/dues/${data.dues_id}`,
    data
  });

  if (!resp.success) throw new Error(resp.message);

  return resp.data;
}

export async function fetchDeleteDues(duesId: number): Promise<any> {
  const resp: ApiResponse = await api.request({
    method: 'delete',
    url: `/dues/${duesId}`
  });

  if (!resp.success) throw new Error(resp.message);

  return resp.data;
}
