import { api, type ApiResponse } from '@/lib/api';

// Request/Response Types
export interface TypeResp {
  code: string
  name: string
  order_seq: number
}

export interface GetTypesReq {
  enum_name: string
}

// API Functions
export async function fetchGetTypes(enumName: string): Promise<TypeResp[]> {
  const resp: ApiResponse<TypeResp[]> = await api.request({
    method: 'get',
    url: `/types/${enumName}`
  });

  if (!resp.success) throw new Error(resp.message);

  return resp.data;
}

// Specific type fetchers
export async function fetchGetGrantMethodTypes(): Promise<TypeResp[]> {
  return fetchGetTypes('grant-method');
}

export async function fetchGetRepeatUnitTypes(): Promise<TypeResp[]> {
  return fetchGetTypes('repeat-unit');
}

export async function fetchGetVacationTimeTypes(): Promise<TypeResp[]> {
  return fetchGetTypes('vacation-time');
}

export async function fetchGetVacationTypes(): Promise<TypeResp[]> {
  return fetchGetTypes('vacation-type');
}

export async function fetchGetEffectiveTypes(): Promise<TypeResp[]> {
  return fetchGetTypes('effective-type');
}

export async function fetchGetExpirationTypes(): Promise<TypeResp[]> {
  return fetchGetTypes('expiration-type');
}

export async function fetchGetApprovalStatusTypes(): Promise<TypeResp[]> {
  return fetchGetTypes('approval-status');
}

export async function fetchGetGrantStatusTypes(): Promise<TypeResp[]> {
  return fetchGetTypes('grant-status');
}

export async function fetchGetScheduleTypes(): Promise<TypeResp[]> {
  return fetchGetTypes('schedule-type');
}

export async function fetchGetHolidayTypes(): Promise<TypeResp[]> {
  return fetchGetTypes('holiday-type');
}

export async function fetchGetCompanyTypes(): Promise<TypeResp[]> {
  return fetchGetTypes('company-type');
}

export async function fetchGetSystemTypes(): Promise<TypeResp[]> {
  return fetchGetTypes('system-type');
}

export async function fetchGetCountryCodeTypes(): Promise<TypeResp[]> {
  return fetchGetTypes('country-code');
}
