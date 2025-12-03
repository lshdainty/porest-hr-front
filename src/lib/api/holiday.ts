import { api, type ApiResponse } from '@/lib/api';

// Request/Response Types
export interface GetHolidaysReq {
  start_date: string
  end_date: string
  country_code: string
}

export interface GetHolidaysResp {
  holiday_id: number
  holiday_name: string
  holiday_date: string
  holiday_type: string
  holiday_icon: string
  country_code: string
  lunar_yn: string
  lunar_date: string
  is_recurring: string
}

export interface PostHolidayReq {
  holiday_name: string
  holiday_date: string
  holiday_type: string
  holiday_icon: string
  country_code: string
  lunar_yn: string
  lunar_date: string
  is_recurring: string
}

export interface PutHolidayReq {
  holiday_id: number
  holiday_name: string
  holiday_date: string
  holiday_type: string
  holiday_icon: string
  country_code: string
  lunar_yn: string
  lunar_date: string
  is_recurring: string
}

// API Functions
export async function fetchGetHolidaysByStartEndDate(startDate: string, endDate: string, countryCode: string): Promise<GetHolidaysResp[]> {
  countryCode = 'KR'
  const resp: ApiResponse<GetHolidaysResp[]> = await api.request({
    method: 'get',
    url: `/holidays/date?start=${startDate}&end=${endDate}&country_code=${countryCode}`
  });

  if (!resp.success) throw new Error(resp.message);

  return resp.data;
}

export async function fetchPostHoliday(data: PostHolidayReq): Promise<any> {
  const resp: ApiResponse = await api.request({
    method: 'post',
    url: `/holiday`,
    data
  });

  if (!resp.success) throw new Error(resp.message);

  return resp.data;
}

export async function fetchPutHoliday(data: PutHolidayReq): Promise<any> {
  const resp: ApiResponse = await api.request({
    method: 'put',
    url: `/holiday/${data.holiday_id}`,
    data
  });

  if (!resp.success) throw new Error(resp.message);

  return resp.data;
}

export async function fetchDeleteHoliday(holidayId: string): Promise<any> {
  const resp: ApiResponse = await api.request({
    method: 'delete',
    url: `/holiday/${holidayId}`
  });

  if (!resp.success) throw new Error(resp.message);

  return resp.data;
}
