import { api, type ApiResponse } from '@/api/index'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CalendarQueryKey } from '@/api/calendar';
import { toast } from '@/components/alert/toast';

const enum VacationQueryKey {
  POST_USE_VACATION = 'postUseVacation',
  GET_AVAILABLE_VACATIONS = 'getAvailableVacations',
  DELETE_VACATION_HISTORY = 'deleteVacationHistory',
  GET_USER_PERIOD_VACATION_USE_HISTORIES = 'getUserPeriodVacationUseHistories',
  GET_USER_MONTH_STATS_VACATION_USE_HISTORIES = 'getUserMonthStatsVacationUseHistories',
  GET_USER_VACATION_USE_STATS = 'getUserVacationUseStats'
}

interface PostUseVacationReq {
  vacation_id: number
  vacation_data: {
    user_id: string
    start_date: string
    end_date: string
    vacation_time_type: string
    vacation_desc: string
  }
}

const usePostUseVacation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reqData: PostUseVacationReq) => {
      const resp: ApiResponse = await api.request({
        method: 'post',
        url: `/vacation/use/${reqData.vacation_id}`,
        data: reqData.vacation_data
      });

      if (resp.code !== 200) throw new Error(resp.message);

      return resp.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CalendarQueryKey.GET_EVENTS_BY_PERIOD] });
      toast.success('휴가/외출이 등록되었습니다.');
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });
}

interface GetAvailableVacationsReq {
  user_id: string
  start_date: string
}

interface GetAvailableVacationsResp {
  vacation_id: number;
  vacation_type: string;
  vacation_type_name: string;
  remain_time: number;
  remain_time_str: string;
  occur_date: Date;
  expiry_date: Date;
}

const useGetAvailableVacations = (reqData: GetAvailableVacationsReq) => {
  return useQuery({
    queryKey: [VacationQueryKey.GET_AVAILABLE_VACATIONS, reqData.user_id, reqData.start_date],
    queryFn: async (): Promise<GetAvailableVacationsResp[]> => {
      const resp: ApiResponse<GetAvailableVacationsResp[]> = await api.request({
        method: 'get',
        url: `/vacation/available/${reqData.user_id}?startDate=${reqData.start_date}`
      });

      if (resp.code !== 200) throw new Error(resp.message);

      return resp.data;
    }
  });
}

const useDeleteVacationHistory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vacationHistoryId: number) => {
      const resp: ApiResponse = await api.request({
        method: 'delete',
        url: `/vacation/history/${vacationHistoryId}`,
      });

      if (resp.code !== 200) throw new Error(resp.message);

      return resp.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CalendarQueryKey.GET_EVENTS_BY_PERIOD] });
      toast.success('휴가/외출이 삭제되었습니다.');
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });
}

interface GetUserPeriodVacationUseHistoriesReq {
  user_id: string
  start_date: string
  end_date: string
}

interface GetUserPeriodVacationUseHistoriesResp {
  vacation_id: number
  vacation_desc: string
  vacation_history_id: number
  vacation_time_type: string
  vacation_time_type_name: string
  start_date: Date
  end_date: Date
}

const useGetUserPeriodVacationUseHistories = (reqData: GetUserPeriodVacationUseHistoriesReq) => {
  return useQuery({
    queryKey: [VacationQueryKey.GET_USER_PERIOD_VACATION_USE_HISTORIES, reqData.user_id, reqData.start_date, reqData.end_date],
    queryFn: async (): Promise<GetUserPeriodVacationUseHistoriesResp[]> => {
      const resp: ApiResponse<GetUserPeriodVacationUseHistoriesResp[]> = await api.request({
        method: 'get',
        url: `/vacation/use/histories/user/period?userId=${reqData.user_id}&startDate=${reqData.start_date}&endDate=${reqData.end_date}`
      });

      if (resp.code !== 200) throw new Error(resp.message);

      return resp.data;
    }
  });
}

interface GetUserMonthStatsVacationUseHistoriesReq {
  user_id: string
  year: string
}

interface GetUserMonthStatsVacationUseHistoriesResp {
  month: number
  used_time: number
  used_time_str: string
}

const useGetUserMonthStatsVacationUseHistories = (reqData: GetUserMonthStatsVacationUseHistoriesReq) => {
  return useQuery({
    queryKey: [VacationQueryKey.GET_USER_MONTH_STATS_VACATION_USE_HISTORIES, reqData.user_id, reqData.year],
    queryFn: async (): Promise<GetUserMonthStatsVacationUseHistoriesResp[]> => {
      const resp: ApiResponse<GetUserMonthStatsVacationUseHistoriesResp[]> = await api.request({
        method: 'get',
        url: `/vacation/use/histories/user/month/stats?userId=${reqData.user_id}&year=${reqData.year}`
      });

      if (resp.code !== 200) throw new Error(resp.message);

      return resp.data;
    }
  });
}

interface GetUserVacationUseStatsReq {
  user_id: string
  base_date: string
}

interface GetUserVacationUseStatsResp {
  remain_time: number
  remain_time_str: string
  used_time: number
  used_time_str: string
  expect_used_time: number
  expect_used_time_str: string
  prev_remain_time: number
  prev_remain_time_str: string
  prev_used_time: number
  prev_used_time_str: string
  prev_expect_used_time: number
  prev_expect_used_time_str: string
  remain_time_gap: number
  remain_time_gap_str: string
  used_time_gap: number
  used_time_gap_str: string
}

const useGetUserVacationUseStats = (reqData: GetUserVacationUseStatsReq) => {
  return useQuery({
    queryKey: [VacationQueryKey.GET_USER_VACATION_USE_STATS, reqData.user_id, reqData.base_date],
    queryFn: async (): Promise<GetUserVacationUseStatsResp> => {
      const resp: ApiResponse<GetUserVacationUseStatsResp> = await api.request({
        method: 'get',
        url: `/vacation/use/stats/user?userId=${reqData.user_id}&baseDate=${reqData.base_date}`
      });

      if (resp.code !== 200) throw new Error(resp.message);

      return resp.data;
    }
  });
}

export {
  // QueryKey
  VacationQueryKey,

  // API Hook
  usePostUseVacation,
  useGetAvailableVacations,
  useDeleteVacationHistory,
  useGetUserPeriodVacationUseHistories,
  useGetUserMonthStatsVacationUseHistories,
  useGetUserVacationUseStats
}

export type {
  // Interface
  GetAvailableVacationsResp,
  GetUserPeriodVacationUseHistoriesResp,
  GetUserMonthStatsVacationUseHistoriesResp,
  GetUserVacationUseStatsResp
}