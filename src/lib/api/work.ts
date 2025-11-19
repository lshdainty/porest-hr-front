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

export async function fetchGetWorkHistories(): Promise<WorkHistoryResp[]> {
  const resp: ApiResponse<WorkHistoryResp[]> = await api.request({
    method: 'get',
    url: `/work-histories`
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
