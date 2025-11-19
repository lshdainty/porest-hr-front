import { api, type ApiResponse } from '@/lib/api';

// Request/Response Types
export interface GetEventsByPeriodReq {
  start_date: string
  end_date: string
}

export interface GetEventsByPeriodResp {
  user_id: string
  user_name: string
  calendar_name: string
  calendar_type: string
  calendar_desc: string
  start_date: Date
  end_date: Date
  domain_type: string
  vacation_type: string
  calendar_id: number
}

// API Functions
export async function fetchGetEventsByPeriod(startDate: string, endDate: string): Promise<GetEventsByPeriodResp[]> {
  const resp: ApiResponse<GetEventsByPeriodResp[]> = await api.request({
    method: 'get',
    url: `/calendar/period?startDate=${startDate}&endDate=${endDate}`
  });

  if (resp.code !== 200) throw new Error(resp.message);

  return resp.data;
}
