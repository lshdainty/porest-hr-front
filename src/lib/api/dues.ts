import { api, type ApiResponse } from '@/lib/api';

// Request/Response Types
export interface GetYearDuesReq {
  year: string
}

export interface GetYearDuesResp {
  dues_seq: number
  dues_user_name: string
  dues_amount: number
  dues_type: 'OPERATION' | 'BIRTH' | 'FINE'
  dues_calc: 'PLUS' | 'MINUS'
  dues_date: string
  dues_detail: string
  total_dues: number
}

export interface GetYearOperationDuesReq {
  year: string
}

export interface GetYearOperationDuesResp {
  total_dues: number
  total_deposit: number
  total_withdrawal: number
}

export interface GetMonthBirthDuesReq {
  year: string
  month: string
}

export interface GetMonthBirthDuesResp {
  birth_month_dues: number
}

export interface GetUsersMonthBirthDuesReq {
  year: string
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
  dues_seq: number
  dues_amount: number
  dues_type: 'OPERATION' | 'BIRTH' | 'FINE'
  dues_calc: 'PLUS' | 'MINUS'
  dues_date: string
  dues_detail: string
  dues_user_name: string
}

// API Functions
export async function fetchGetYearDues(year: string): Promise<GetYearDuesResp[]> {
  const resp: ApiResponse<GetYearDuesResp[]> = await api.request({
    method: 'get',
    url: `/dues?year=${year}`
  });

  if (!resp.success) throw new Error(resp.message);

  return resp.data;
}

export async function fetchGetYearOperationDues(year: string): Promise<GetYearOperationDuesResp> {
  const resp: ApiResponse<GetYearOperationDuesResp> = await api.request({
    method: 'get',
    url: `/dues/operation?year=${year}`
  });

  if (!resp.success) throw new Error(resp.message);

  return resp.data;
}

export async function fetchGetMonthBirthDues(year: string, month: string): Promise<GetMonthBirthDuesResp> {
  const resp: ApiResponse<GetMonthBirthDuesResp> = await api.request({
    method: 'get',
    url: `/dues/birth/month?year=${year}&month=${month}`
  });

  if (!resp.success) throw new Error(resp.message);

  return resp.data;
}

export async function fetchGetUsersMonthBirthDues(year: string): Promise<GetUsersMonthBirthDuesResp[]> {
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
    url: `/dues/${data.dues_seq}`,
    data
  });

  if (!resp.success) throw new Error(resp.message);

  return resp.data;
}

export async function fetchDeleteDues(duesSeq: number): Promise<any> {
  const resp: ApiResponse = await api.request({
    method: 'delete',
    url: `/dues/${duesSeq}`
  });

  if (!resp.success) throw new Error(resp.message);

  return resp.data;
}
