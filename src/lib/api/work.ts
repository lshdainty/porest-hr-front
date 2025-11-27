import { api, type ApiResponse } from '@/lib/api';

// Request/Response Types
export interface WorkCodeResp {
  work_code_seq: number
  work_code: string
  work_code_name: string
  code_type: string
  order_seq: number
  parent_work_code_seq?: number
}

export interface WorkGroupWithParts extends WorkCodeResp {
  parts: WorkCodeResp[];
}

export interface GetWorkPartLabelReq {
  parent_work_code_seq: number
}

export interface GetWorkPartsReq {
  parent_work_code_seq: number
}

export interface CreateWorkHistoryReq {
  work_date: string
  work_user_id: string
  work_group_code: string
  work_part_code: string
  work_class_code: string
  work_hour: number
  work_content: string
}

export interface CreateWorkHistoryResp {
  work_history_seq: number
}

export interface UpdateWorkHistoryReq {
  work_history_seq: number
  work_date: string
  work_user_id: string
  work_group_code: string
  work_part_code: string
  work_class_code: string
  work_hour: number
  work_content: string
}

export interface WorkHistoryResp {
  work_history_seq: number
  work_date: string
  work_user_id: string
  work_user_name: string
  work_group: WorkCodeResp
  work_part: WorkCodeResp
  work_class: WorkCodeResp
  work_hour: number
  work_content: string
}

export interface DeleteWorkHistoryReq {
  work_history_seq: number
}

export interface WorkHistorySearchCondition {
  startDate?: string;
  endDate?: string;
  userName?: string;
  userId?: string;
  groupSeq?: number;
  partSeq?: number;
  divisionSeq?: number;
  sortType?: 'LATEST' | 'OLDEST';
}

// API Functions
export async function fetchGetWorkGroups(): Promise<WorkCodeResp[]> {
  const resp: ApiResponse<WorkCodeResp[]> = await api.request({
    method: 'get',
    url: `/work-codes`,
    params: {
      parent_work_code: 'work_group',
      type: 'OPTION'
    }
  });

  if (resp.code !== 200) throw new Error(resp.message);

  return resp.data;
}

export async function fetchGetWorkPartLabel(parentWorkCodeSeq: number): Promise<WorkCodeResp[]> {
  const resp: ApiResponse<WorkCodeResp[]> = await api.request({
    method: 'get',
    url: `/work-codes`,
    params: {
      parent_work_code_seq: parentWorkCodeSeq,
      type: 'LABEL'
    }
  });

  if (resp.code !== 200) throw new Error(resp.message);

  return resp.data;
}

export async function fetchGetWorkParts(parentWorkCodeSeq: number): Promise<WorkCodeResp[]> {
  const resp: ApiResponse<WorkCodeResp[]> = await api.request({
    method: 'get',
    url: `/work-codes`,
    params: {
      parent_work_code_seq: parentWorkCodeSeq,
      type: 'OPTION'
    }
  });

  if (resp.code !== 200) throw new Error(resp.message);

  return resp.data;
}

export async function fetchGetWorkDivision(): Promise<WorkCodeResp[]> {
  const resp: ApiResponse<WorkCodeResp[]> = await api.request({
    method: 'get',
    url: `/work-codes`,
    params: {
      parent_work_code: 'work_division',
      type: 'OPTION'
    }
  });

  if (resp.code !== 200) throw new Error(resp.message);

  return resp.data;
}

export async function fetchPostCreateWorkHistory(data: CreateWorkHistoryReq): Promise<CreateWorkHistoryResp> {
  const resp: ApiResponse<CreateWorkHistoryResp> = await api.request({
    method: 'post',
    url: `/work-histories`,
    data
  });

  if (resp.code !== 200) throw new Error(resp.message);

  return resp.data;
}

export async function fetchGetWorkHistories(params?: WorkHistorySearchCondition): Promise<WorkHistoryResp[]> {
  const resp: ApiResponse<WorkHistoryResp[]> = await api.request({
    method: 'get',
    url: `/work-histories`,
    params
  });

  if (resp.code !== 200) throw new Error(resp.message);

  return resp.data;
}

export async function fetchPutUpdateWorkHistory(data: UpdateWorkHistoryReq): Promise<void> {
  const { work_history_seq, ...requestData } = data;
  const resp: ApiResponse<void> = await api.request({
    method: 'put',
    url: `/work-histories/${work_history_seq}`,
    data: requestData
  });

  if (resp.code !== 200) throw new Error(resp.message);
}

export async function fetchDeleteWorkHistory(workHistorySeq: number): Promise<void> {
  const resp: ApiResponse<void> = await api.request({
    method: 'delete',
    url: `/work-histories/${workHistorySeq}`
  });

  if (resp.code !== 200) throw new Error(resp.message);
}

export interface BulkCreateWorkHistoryReq {
  work_histories: CreateWorkHistoryReq[]
}

export interface BulkCreateWorkHistoryResp {
  work_history_seqs: number[]
}

export async function fetchPostBulkCreateWorkHistories(data: BulkCreateWorkHistoryReq): Promise<BulkCreateWorkHistoryResp> {
  const resp: ApiResponse<BulkCreateWorkHistoryResp> = await api.request({
    method: 'post',
    url: `/work-histories/bulk`,
    data
  });

  if (resp.code !== 200) throw new Error(resp.message);

  return resp.data;
}

export async function fetchGetAllWorkCodes(): Promise<WorkCodeResp[]> {
  const resp: ApiResponse<WorkCodeResp[]> = await api.request({
    method: 'get',
    url: `/work-codes/all`
  });

  if (resp.code !== 200) throw new Error(resp.message);

  return resp.data;
}

export async function fetchGetWorkHistoryExcelDownload(params?: WorkHistorySearchCondition): Promise<Blob> {
  const resp = await api.request({
    method: 'get',
    url: `/work-histories/excel/download`,
    params,
    responseType: 'blob'
  });

  return resp as unknown as Blob;
}

export interface UnregisteredWorkHistoryDownloadReq {
  year: number
  month: number
}

export async function fetchGetUnregisteredWorkHistoryExcelDownload(params: UnregisteredWorkHistoryDownloadReq): Promise<Blob> {
  const resp = await api.request({
    method: 'get',
    url: `/work-histories/unregistered-hours/download`,
    params,
    responseType: 'blob'
  });

  return resp as unknown as Blob;
}

// System Check API Types
export type SystemType = 'SYSTEM1'; // Add more types as they are defined in backend

export interface ToggleSystemCheckReq {
  system_code: SystemType;
}

export interface ToggleSystemCheckResp {
  checked: boolean;
  message: string;
}

export interface CheckSystemStatusResp {
  system_code: SystemType;
  checked: boolean;
}

// System Check API Functions
export async function fetchPostToggleSystemCheck(data: ToggleSystemCheckReq): Promise<ToggleSystemCheckResp> {
  const resp: ApiResponse<ToggleSystemCheckResp> = await api.request({
    method: 'post',
    url: `/work/system-logs`,
    data
  });

  if (resp.code !== 200) throw new Error(resp.message);

  return resp.data;
}

export async function fetchGetSystemCheckStatus(systemCode: SystemType): Promise<CheckSystemStatusResp> {
  const resp: ApiResponse<CheckSystemStatusResp> = await api.request({
    method: 'get',
    url: `/work/system-logs/status`,
    params: {
      system_code: systemCode
    }
  });

  if (resp.code !== 200) throw new Error(resp.message);

  return resp.data;
}
