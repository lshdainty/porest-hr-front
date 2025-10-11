import { api, type ApiResponse } from '@/api/index'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/alert/toast';

const enum HolidayQueryKey {
  GET_HOLIDAYS_BY_START_END_DATE = 'getHolidaysByStartEndDate',
  POST_HOLIDAY = 'postHoliday',
  PUT_HOLIDAY = 'putHoliday',
  DELETE_HOLIDAY = 'deleteHoliday'
}

interface GetHolidaysReq {
  start_date: string
  end_date: string
  country_code: string
}

interface GetHolidaysResp {
  holiday_seq: number
  holiday_name: string
  holiday_date: string
  holiday_type: string
  holiday_icon: string
  country_code: string
  lunar_yn : string
  lunar_date: string
  is_recurring: string
}

const useGetHolidaysByStartEndDate = (d: GetHolidaysReq) => {
  return useQuery({
    queryKey: [HolidayQueryKey.GET_HOLIDAYS_BY_START_END_DATE, d.start_date, d.end_date],
    queryFn: async (): Promise<GetHolidaysResp[]> => {
      const resp: ApiResponse<GetHolidaysResp[]> = await api.request({
        method: 'get',
        url: `/holidays/date?start=${d.start_date}&end=${d.end_date}&country_code=${'KR'}`    // TODO: 추후 국가코드 api가 추가된다면 d.country_code로 변경해야함
      });

      if (resp.code !== 200) throw new Error(resp.message);

      return resp.data;
    }
  });
}

interface PostHolidayReq {
  holiday_name: string
  holiday_date: string
  holiday_type: string
  holiday_icon: string
  country_code: string
  lunar_yn : string
  lunar_date: string
  is_recurring: string
}

const usePostHoliday = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (d: PostHolidayReq) => {
      const resp: ApiResponse = await api.request({
        method: 'post',
        url: `/holiday`,
        data: d
      });

      if (resp.code !== 200) throw new Error(resp.message);

      return resp.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [HolidayQueryKey.GET_HOLIDAYS_BY_START_END_DATE] });
      toast.success('공휴일이 등록되었습니다.');
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });
}

interface PutHolidayReq {
  holiday_seq: number
  holiday_name: string
  holiday_date: string
  holiday_type: string
  holiday_icon: string
  country_code: string
  lunar_yn : string
  lunar_date: string
  is_recurring: string
}

const usePutHoliday = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (d: PutHolidayReq) => {
      const resp: ApiResponse = await api.request({
        method: 'put',
        url: `/holiday/${d.holiday_seq}`,
        data: d
      });

      if (resp.code !== 200) throw new Error(resp.message);

      return resp.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [HolidayQueryKey.GET_HOLIDAYS_BY_START_END_DATE] });
      toast.success('공휴일 정보가 수정되었습니다.');
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });
}

const useDeleteHoliday = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (holiday_seq: string) => {
      const resp: ApiResponse = await api.request({
        method: 'delete',
        url: `/holiday/${holiday_seq}`
      });

      if (resp.code !== 200) throw new Error(resp.message);

      return resp.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [HolidayQueryKey.GET_HOLIDAYS_BY_START_END_DATE] });
      toast.success('공휴일이 삭제되었습니다.');
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });
}

export {
  // QueryKey
  HolidayQueryKey,

  // API Hook
  useGetHolidaysByStartEndDate,
  usePostHoliday,
  usePutHoliday,
  useDeleteHoliday
}

export type {
  // Interface
  GetHolidaysResp,
  PostHolidayReq,
  PutHolidayReq,
}