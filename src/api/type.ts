import { api, type ApiResponse } from '@/api/index'
import { useQuery } from '@tanstack/react-query';

const enum TypeQueryKey {
  GET_TYPES = 'getTypes'
}

interface TypeResp {
  code: string
  name: string
}

interface GetTypesReq {
  enum_name: string
}

const useGetTypes = (reqData: GetTypesReq) => {
  return useQuery({
    queryKey: [TypeQueryKey.GET_TYPES, reqData.enum_name],
    queryFn: async (): Promise<TypeResp[]> => {
      const resp: ApiResponse<TypeResp[]> = await api.request({
        method: 'get',
        url: `/types/${reqData.enum_name}`
      });

      if (resp.code !== 200) throw new Error(resp.message);

      return resp.data;
    },
    enabled: !!reqData.enum_name
  });
};

// 특정 타입별 커스텀 훅
const useGetGrantMethodTypes = () => {
  return useGetTypes({ enum_name: 'grant-method' });
};

const useGetGrantTimingTypes = () => {
  return useGetTypes({ enum_name: 'grant-timing' });
};

const useGetRepeatUnitTypes = () => {
  return useGetTypes({ enum_name: 'repeat-unit' });
};

const useGetVacationTimeTypes = () => {
  return useGetTypes({ enum_name: 'vacation-time' });
};

const useGetVacationTypes = () => {
  return useGetTypes({ enum_name: 'vacation-type' });
};

const useGetScheduleTypes = () => {
  return useGetTypes({ enum_name: 'schedule-type' });
};

const useGetHolidayTypes = () => {
  return useGetTypes({ enum_name: 'holiday-type' });
};

const useGetOriginCompanyTypes = () => {
  return useGetTypes({ enum_name: 'origin-company-type' });
};

export {
  // QueryKey
  TypeQueryKey,

  // API Hook
  useGetTypes,
  useGetGrantMethodTypes,
  useGetGrantTimingTypes,
  useGetRepeatUnitTypes,
  useGetVacationTimeTypes,
  useGetVacationTypes,
  useGetScheduleTypes,
  useGetHolidayTypes,
  useGetOriginCompanyTypes
}

export type {
  // Interface
  TypeResp,
  GetTypesReq
}
