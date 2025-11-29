import { api, type ApiResponse } from '@/lib/api';

// Request/Response Types
export interface PostScheduleReq {
  user_id: string
  start_date: string
  end_date: string
  schedule_type: string
  schedule_desc: string
}

export interface PutUpdateScheduleReq {
  schedule_id: number
  user_id: string
  start_date: string
  end_date: string
  schedule_type: string
  schedule_desc: string
}

export interface PutUpdateScheduleResp {
  schedule_id: number
}

// API Functions
export async function fetchPostSchedule(data: PostScheduleReq): Promise<any> {
  const resp: ApiResponse = await api.request({
    method: 'post',
    url: `/schedule`,
    data
  });

  if (!resp.success) throw new Error(resp.message);

  return resp.data;
}

export async function fetchPutUpdateSchedule(data: PutUpdateScheduleReq): Promise<PutUpdateScheduleResp> {
  const { schedule_id, ...requestData } = data;
  const resp: ApiResponse<PutUpdateScheduleResp> = await api.request({
    method: 'put',
    url: `/schedule/${schedule_id}`,
    data: requestData
  });

  if (!resp.success) throw new Error(resp.message);

  return resp.data;
}

export async function fetchDeleteSchedule(scheduleId: number): Promise<any> {
  const resp: ApiResponse = await api.request({
    method: 'delete',
    url: `/schedule/${scheduleId}`
  });

  if (!resp.success) throw new Error(resp.message);

  return resp.data;
}
