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
export async function fetchGetHolidaysByStartEndDate(startDate: string, endDate: string, countryCode?: string): Promise<GetHolidaysResp[]> {
  const params = new URLSearchParams({
    start: startDate,
    end: endDate
  });

  // countryCode가 있으면 파라미터에 추가 (없으면 백엔드에서 로그인 사용자의 국가 코드 사용)
  if (countryCode) {
    params.append('country_code', countryCode);
  }

  const resp: ApiResponse<GetHolidaysResp[]> = await api.request({
    method: 'get',
    url: `/holidays/date?${params.toString()}`
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

// 반복 공휴일 프리뷰 Request/Response Types
export interface GetRecurringHolidaysPreviewResp {
  holiday_name: string
  holiday_date: string
  holiday_type: string
  holiday_icon: string
  country_code: string
  lunar_yn: string
  lunar_date: string
  is_recurring: string
}

export interface BulkSaveHolidayItem {
  holiday_name: string
  holiday_date: string
  holiday_type: string
  holiday_icon: string
  country_code: string
  lunar_yn: string
  lunar_date: string
  is_recurring: string
}

export interface PostBulkHolidaysReq {
  holidays: BulkSaveHolidayItem[]
}

export interface PostBulkHolidaysResp {
  saved_count: number
}

// 반복 공휴일 프리뷰 조회
export async function fetchGetRecurringHolidaysPreview(targetYear: number, countryCode: string): Promise<GetRecurringHolidaysPreviewResp[]> {
  const params = new URLSearchParams({
    target_year: String(targetYear),
    country_code: countryCode
  });

  const resp: ApiResponse<GetRecurringHolidaysPreviewResp[]> = await api.request({
    method: 'get',
    url: `/holidays/recurring/preview?${params.toString()}`
  });

  if (!resp.success) throw new Error(resp.message);

  return resp.data;
}

// 공휴일 일괄 저장
export async function fetchPostBulkHolidays(data: PostBulkHolidaysReq): Promise<PostBulkHolidaysResp> {
  const resp: ApiResponse<PostBulkHolidaysResp> = await api.request({
    method: 'post',
    url: `/holidays/bulk`,
    data
  });

  if (!resp.success) throw new Error(resp.message);

  return resp.data;
}
