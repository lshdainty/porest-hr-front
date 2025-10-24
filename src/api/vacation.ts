import { CalendarQueryKey } from '@/api/calendar';
import { api, type ApiResponse } from '@/api/index';
import { toast } from '@/components/alert/toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const enum VacationQueryKey {
  POST_USE_VACATION = 'postUseVacation',
  GET_AVAILABLE_VACATIONS = 'getAvailableVacations',
  DELETE_VACATION_HISTORY = 'deleteVacationHistory',
  GET_USER_PERIOD_VACATION_USE_HISTORIES = 'getUserPeriodVacationUseHistories',
  GET_USER_MONTH_STATS_VACATION_USE_HISTORIES = 'getUserMonthStatsVacationUseHistories',
  GET_USER_VACATION_USE_STATS = 'getUserVacationUseStats',
  GET_VACATION_POLICY = 'getVacationPolicy',
  GET_VACATION_POLICIES = 'getVacationPolicies'
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

interface GetVacationPolicyReq {
  vacation_policy_id: number
}

interface GetVacationPolicyResp {
  vacation_policy_id: number
  vacation_policy_name: string
  vacation_policy_desc: string
  vacation_type: string
  grant_method: string
  grant_time: number
  repeat_unit: string
  repeat_interval: number
  grant_timing: string
  specific_months: number
  specific_days: number
}

const useGetVacationPolicy = (reqData: GetVacationPolicyReq) => {
  return useQuery({
    queryKey: [VacationQueryKey.GET_VACATION_POLICY, reqData.vacation_policy_id],
    queryFn: async (): Promise<GetVacationPolicyResp> => {
      const resp: ApiResponse<GetVacationPolicyResp> = await api.request({
        method: 'get',
        url: `/vacation/policies/${reqData.vacation_policy_id}`
      });

      if (resp.code !== 200) throw new Error(resp.message);

      return resp.data;
    },
    enabled: !!reqData.vacation_policy_id
  });
}

interface GetVacationPoliciesResp {
  vacation_policy_id: number
  vacation_policy_name: string
  vacation_policy_desc: string
  vacation_type: string
  grant_method: string
  grant_time: number
  grant_time_str: string
  repeat_unit: string
  repeat_interval: number
  grant_timing: string
  specific_months: number
  specific_days: number
}

const useGetVacationPolicies = () => {
  return useQuery({
    queryKey: [VacationQueryKey.GET_VACATION_POLICIES],
    queryFn: async (): Promise<GetVacationPoliciesResp[]> => {
      const resp: ApiResponse<GetVacationPoliciesResp[]> = await api.request({
        method: 'get',
        url: `/vacation/policies`
      });

      if (resp.code !== 200) throw new Error(resp.message);

      return resp.data;
    }
  });
}

export {
  useDeleteVacationHistory, useGetAvailableVacations, useGetUserMonthStatsVacationUseHistories, useGetUserPeriodVacationUseHistories, useGetUserVacationUseStats, useGetVacationPolicies, useGetVacationPolicy,
  // API Hook
  usePostUseVacation,
  // QueryKey
  VacationQueryKey
};

  export type {
    // Interface
    GetAvailableVacationsResp, GetUserMonthStatsVacationUseHistoriesResp, GetUserPeriodVacationUseHistoriesResp, GetUserVacationUseStatsResp, GetVacationPoliciesResp, GetVacationPolicyResp
  };

