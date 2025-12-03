'use client'

import { useQuery } from '@tanstack/react-query'

import { createQueryKeys } from '@/constants/query-keys'
import {
  fetchGetGrantMethodTypes,
  fetchGetRepeatUnitTypes,
  fetchGetVacationTimeTypes,
  fetchGetVacationTypes,
  fetchGetEffectiveTypes,
  fetchGetExpirationTypes,
  fetchGetApprovalStatusTypes,
  fetchGetGrantStatusTypes,
  fetchGetScheduleTypes,
  fetchGetHolidayTypes,
  fetchGetOriginCompanyTypes,
  fetchGetCountryCodeTypes,
  type TypeResp
} from '@/lib/api/type'

const typeKeys = createQueryKeys('types')

// Grant Method Types 조회 훅
export const useGrantMethodTypesQuery = () => {
  return useQuery<TypeResp[]>({
    queryKey: typeKeys.list({ type: 'grant-method' }),
    queryFn: () => fetchGetGrantMethodTypes()
  })
}

// Repeat Unit Types 조회 훅
export const useRepeatUnitTypesQuery = () => {
  return useQuery<TypeResp[]>({
    queryKey: typeKeys.list({ type: 'repeat-unit' }),
    queryFn: () => fetchGetRepeatUnitTypes()
  })
}

// Vacation Time Types 조회 훅
export const useVacationTimeTypesQuery = () => {
  return useQuery<TypeResp[]>({
    queryKey: typeKeys.list({ type: 'vacation-time' }),
    queryFn: () => fetchGetVacationTimeTypes()
  })
}

// Vacation Types 조회 훅
export const useVacationTypesQuery = () => {
  return useQuery<TypeResp[]>({
    queryKey: typeKeys.list({ type: 'vacation-type' }),
    queryFn: () => fetchGetVacationTypes()
  })
}

// Effective Types 조회 훅
export const useEffectiveTypesQuery = () => {
  return useQuery<TypeResp[]>({
    queryKey: typeKeys.list({ type: 'effective-type' }),
    queryFn: () => fetchGetEffectiveTypes()
  })
}

// Expiration Types 조회 훅
export const useExpirationTypesQuery = () => {
  return useQuery<TypeResp[]>({
    queryKey: typeKeys.list({ type: 'expiration-type' }),
    queryFn: () => fetchGetExpirationTypes()
  })
}

// Approval Status Types 조회 훅
export const useApprovalStatusTypesQuery = () => {
  return useQuery<TypeResp[]>({
    queryKey: typeKeys.list({ type: 'approval-status' }),
    queryFn: () => fetchGetApprovalStatusTypes()
  })
}

// Grant Status Types 조회 훅
export const useGrantStatusTypesQuery = () => {
  return useQuery<TypeResp[]>({
    queryKey: typeKeys.list({ type: 'grant-status' }),
    queryFn: () => fetchGetGrantStatusTypes()
  })
}

// Schedule Types 조회 훅
export const useScheduleTypesQuery = () => {
  return useQuery<TypeResp[]>({
    queryKey: typeKeys.list({ type: 'schedule-type' }),
    queryFn: () => fetchGetScheduleTypes()
  })
}

// Holiday Types 조회 훅
export const useHolidayTypesQuery = () => {
  return useQuery<TypeResp[]>({
    queryKey: typeKeys.list({ type: 'holiday-type' }),
    queryFn: () => fetchGetHolidayTypes()
  })
}

// Origin Company Types 조회 훅
export const useOriginCompanyTypesQuery = () => {
  return useQuery<TypeResp[]>({
    queryKey: typeKeys.list({ type: 'origin-company-type' }),
    queryFn: () => fetchGetOriginCompanyTypes()
  })
}

// Country Code Types 조회 훅
export const useCountryCodeTypesQuery = () => {
  return useQuery<TypeResp[]>({
    queryKey: typeKeys.list({ type: 'country-code' }),
    queryFn: () => fetchGetCountryCodeTypes()
  })
}
