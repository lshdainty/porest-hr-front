import { CalendarQueryKey } from '@/api/calendar';
import { api, type ApiResponse } from '@/api/index';
import { toast } from '@/components/alert/toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const enum VacationQueryKey {
  POST_USE_VACATION = 'postUseVacation',
  GET_USER_VACATION_HISTORY = 'getUserVacationHistory',
  GET_ALL_USERS_VACATION_HISTORY = 'getAllUsersVacationHistory',
  GET_AVAILABLE_VACATIONS = 'getAvailableVacations',
  DELETE_VACATION_USAGE = 'deleteVacationUsage',
  GET_VACATION_USAGES_BY_PERIOD = 'getVacationUsagesByPeriod',
  GET_USER_VACATION_USAGES_BY_PERIOD = 'getUserVacationUsagesByPeriod',
  GET_USER_MONTHLY_VACATION_STATS = 'getUserMonthlyVacationStats',
  GET_USER_VACATION_STATS = 'getUserVacationStats',
  GET_VACATION_POLICY = 'getVacationPolicy',
  GET_VACATION_POLICIES = 'getVacationPolicies',
  POST_VACATION_POLICY = 'postVacationPolicy',
  DELETE_VACATION_POLICY = 'deleteVacationPolicy',
  POST_ASSIGN_VACATION_POLICIES_TO_USER = 'postAssignVacationPoliciesToUser',
  GET_USER_VACATION_POLICIES = 'getUserVacationPolicies',
  GET_USER_VACATION_POLICY_ASSIGNMENT_STATUS = 'getUserVacationPolicyAssignmentStatus',
  DELETE_REVOKE_VACATION_POLICY_FROM_USER = 'deleteRevokeVacationPolicyFromUser',
  DELETE_REVOKE_VACATION_POLICIES_FROM_USER = 'deleteRevokeVacationPoliciesFromUser',
  POST_MANUAL_GRANT_VACATION = 'postManualGrantVacation',
  DELETE_REVOKE_VACATION_GRANT = 'deleteRevokeVacationGrant',
  POST_REQUEST_VACATION = 'postRequestVacation',
  POST_APPROVE_VACATION = 'postApproveVacation',
  POST_REJECT_VACATION = 'postRejectVacation',
  GET_ALL_VACATIONS_BY_APPROVER = 'getAllVacationsByApprover',
  GET_USER_REQUESTED_VACATIONS = 'getUserRequestedVacations',
  GET_USER_REQUESTED_VACATION_STATS = 'getUserRequestedVacationStats',
  POST_CANCEL_VACATION_REQUEST = 'postCancelVacationRequest'
}

interface PostUseVacationReq {
  user_id: string
  vacation_type: string
  vacation_desc: string
  vacation_time_type: string
  start_date: string
  end_date: string
}

interface PostUseVacationResp {
  vacation_usage_id: number
}

const usePostUseVacation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reqData: PostUseVacationReq) => {
      const resp: ApiResponse<PostUseVacationResp> = await api.request({
        method: 'post',
        url: `/vacation-usages`,
        data: reqData
      });

      if (resp.code !== 200) throw new Error(resp.message);

      return resp.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CalendarQueryKey.GET_EVENTS_BY_PERIOD] });
      queryClient.invalidateQueries({ queryKey: [VacationQueryKey.GET_USER_VACATION_HISTORY] });
      toast.success('휴가가 등록되었습니다.');
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });
}

interface GetUserVacationHistoryReq {
  user_id: string
}

interface VacationGrantInfo {
  vacation_grant_id: number
  vacation_type: string
  vacation_type_name: string
  vacation_grant_desc: string
  grant_time: number
  remain_time: number
  grant_date: string
  expiry_date: string
}

interface VacationUsageInfo {
  vacation_usage_id: number
  vacation_usage_desc: string
  vacation_time_type: string
  vacation_time_type_name: string
  used_time: number
  start_date: string
  end_date: string
}

interface GetUserVacationHistoryResp {
  grants: VacationGrantInfo[]
  usages: VacationUsageInfo[]
}

const useGetUserVacationHistory = (reqData: GetUserVacationHistoryReq) => {
  return useQuery({
    queryKey: [VacationQueryKey.GET_USER_VACATION_HISTORY, reqData.user_id],
    queryFn: async (): Promise<GetUserVacationHistoryResp> => {
      const resp: ApiResponse<GetUserVacationHistoryResp> = await api.request({
        method: 'get',
        url: `/users/${reqData.user_id}/vacations`
      });

      if (resp.code !== 200) throw new Error(resp.message);

      return resp.data;
    },
    enabled: !!reqData.user_id
  });
}

interface GetAllUsersVacationHistoryResp {
  user_id: string
  user_name: string
  grants: VacationGrantInfo[]
  usages: VacationUsageInfo[]
}

const useGetAllUsersVacationHistory = () => {
  return useQuery({
    queryKey: [VacationQueryKey.GET_ALL_USERS_VACATION_HISTORY],
    queryFn: async (): Promise<GetAllUsersVacationHistoryResp[]> => {
      const resp: ApiResponse<GetAllUsersVacationHistoryResp[]> = await api.request({
        method: 'get',
        url: `/vacations`
      });

      if (resp.code !== 200) throw new Error(resp.message);

      return resp.data;
    }
  });
}

interface GetAvailableVacationsReq {
  user_id: string
  start_date: string
}

interface GetAvailableVacationsResp {
  vacation_type: string
  vacation_type_name: string
  total_remain_time: number
  total_remain_time_str: string
}

const useGetAvailableVacations = (reqData: GetAvailableVacationsReq) => {
  return useQuery({
    queryKey: [VacationQueryKey.GET_AVAILABLE_VACATIONS, reqData.user_id, reqData.start_date],
    queryFn: async (): Promise<GetAvailableVacationsResp[]> => {
      const resp: ApiResponse<GetAvailableVacationsResp[]> = await api.request({
        method: 'get',
        url: `/users/${reqData.user_id}/vacations/available?startDate=${reqData.start_date}`
      });

      if (resp.code !== 200) throw new Error(resp.message);

      return resp.data;
    },
    enabled: !!reqData.user_id
  });
}

const useDeleteVacationUsage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vacationUsageId: number) => {
      const resp: ApiResponse = await api.request({
        method: 'delete',
        url: `/vacation-usages/${vacationUsageId}`
      });

      if (resp.code !== 200) throw new Error(resp.message);

      return resp.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CalendarQueryKey.GET_EVENTS_BY_PERIOD] });
      queryClient.invalidateQueries({ queryKey: [VacationQueryKey.GET_USER_VACATION_HISTORY] });
      toast.success('휴가 사용 내역이 삭제되었습니다.');
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });
}

interface GetVacationUsagesByPeriodReq {
  start_date: string
  end_date: string
}

interface GetVacationUsagesByPeriodResp {
  user_id: string
  user_name: string
  vacation_usage_id: number
  vacation_usage_desc: string
  vacation_time_type: string
  vacation_time_type_name: string
  used_time: number
  start_date: string
  end_date: string
}

const useGetVacationUsagesByPeriod = (reqData: GetVacationUsagesByPeriodReq) => {
  return useQuery({
    queryKey: [VacationQueryKey.GET_VACATION_USAGES_BY_PERIOD, reqData.start_date, reqData.end_date],
    queryFn: async (): Promise<GetVacationUsagesByPeriodResp[]> => {
      const resp: ApiResponse<GetVacationUsagesByPeriodResp[]> = await api.request({
        method: 'get',
        url: `/vacation-usages?startDate=${reqData.start_date}&endDate=${reqData.end_date}`
      });

      if (resp.code !== 200) throw new Error(resp.message);

      return resp.data;
    }
  });
}

interface GetUserVacationUsagesByPeriodReq {
  user_id: string
  start_date: string
  end_date: string
}

interface GetUserVacationUsagesByPeriodResp {
  vacation_usage_id: number
  vacation_usage_desc: string
  vacation_time_type: string
  vacation_time_type_name: string
  used_time: number
  start_date: string
  end_date: string
}

const useGetUserVacationUsagesByPeriod = (reqData: GetUserVacationUsagesByPeriodReq) => {
  return useQuery({
    queryKey: [VacationQueryKey.GET_USER_VACATION_USAGES_BY_PERIOD, reqData.user_id, reqData.start_date, reqData.end_date],
    queryFn: async (): Promise<GetUserVacationUsagesByPeriodResp[]> => {
      const resp: ApiResponse<GetUserVacationUsagesByPeriodResp[]> = await api.request({
        method: 'get',
        url: `/users/${reqData.user_id}/vacation-usages?startDate=${reqData.start_date}&endDate=${reqData.end_date}`
      });

      if (resp.code !== 200) throw new Error(resp.message);

      return resp.data;
    },
    enabled: !!reqData.user_id
  });
}

interface GetUserMonthlyVacationStatsReq {
  user_id: string
  year: string
}

interface GetUserMonthlyVacationStatsResp {
  month: number
  used_time: number
  used_time_str: string
}

const useGetUserMonthlyVacationStats = (reqData: GetUserMonthlyVacationStatsReq) => {
  return useQuery({
    queryKey: [VacationQueryKey.GET_USER_MONTHLY_VACATION_STATS, reqData.user_id, reqData.year],
    queryFn: async (): Promise<GetUserMonthlyVacationStatsResp[]> => {
      const resp: ApiResponse<GetUserMonthlyVacationStatsResp[]> = await api.request({
        method: 'get',
        url: `/users/${reqData.user_id}/vacation-usages/monthly-stats?year=${reqData.year}`
      });

      if (resp.code !== 200) throw new Error(resp.message);

      return resp.data;
    },
    enabled: !!reqData.user_id
  });
}

interface GetUserVacationStatsReq {
  user_id: string
  base_date: string
}

interface GetUserVacationStatsResp {
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

const useGetUserVacationStats = (reqData: GetUserVacationStatsReq) => {
  return useQuery({
    queryKey: [VacationQueryKey.GET_USER_VACATION_STATS, reqData.user_id, reqData.base_date],
    queryFn: async (): Promise<GetUserVacationStatsResp> => {
      const resp: ApiResponse<GetUserVacationStatsResp> = await api.request({
        method: 'get',
        url: `/users/${reqData.user_id}/vacations/stats?baseDate=${reqData.base_date}`
      });

      if (resp.code !== 200) throw new Error(resp.message);

      return resp.data;
    },
    enabled: !!reqData.user_id
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
  grant_time_str: string
  is_flexible_grant: string
  minute_grant_yn: string
  repeat_unit: string
  repeat_interval: number
  specific_months: number
  specific_days: number
  effective_type: string
  expiration_type: string
  repeat_grant_desc: string
}

const useGetVacationPolicy = (reqData: GetVacationPolicyReq) => {
  return useQuery({
    queryKey: [VacationQueryKey.GET_VACATION_POLICY, reqData.vacation_policy_id],
    queryFn: async (): Promise<GetVacationPolicyResp> => {
      const resp: ApiResponse<GetVacationPolicyResp> = await api.request({
        method: 'get',
        url: `/vacation-policies/${reqData.vacation_policy_id}`
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
  is_flexible_grant: string
  minute_grant_yn: string
  repeat_unit: string
  repeat_interval: number
  specific_months: number
  specific_days: number
  effective_type: string
  expiration_type: string
  repeat_grant_desc: string
}

const useGetVacationPolicies = () => {
  return useQuery({
    queryKey: [VacationQueryKey.GET_VACATION_POLICIES],
    queryFn: async (): Promise<GetVacationPoliciesResp[]> => {
      const resp: ApiResponse<GetVacationPoliciesResp[]> = await api.request({
        method: 'get',
        url: `/vacation-policies`
      });

      if (resp.code !== 200) throw new Error(resp.message);

      return resp.data;
    }
  });
}

interface PostVacationPolicyReq {
  vacation_policy_name: string
  vacation_policy_desc: string
  vacation_type: string
  grant_method: string
  grant_time: number
  is_flexible_grant: string
  minute_grant_yn: string
  repeat_unit: string | null
  repeat_interval: number | null
  specific_months: number | null
  specific_days: number | null
  first_grant_date: string | null
  is_recurring: string
  max_grant_count: number | null
  effective_type: string
  expiration_type: string
  approval_required_count: number
}

interface PostVacationPolicyResp {
  vacation_policy_id: number
}

const usePostVacationPolicy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reqData: PostVacationPolicyReq) => {
      const resp: ApiResponse<PostVacationPolicyResp> = await api.request({
        method: 'post',
        url: `/vacation-policies`,
        data: reqData
      });

      if (resp.code !== 200) throw new Error(resp.message);

      return resp.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [VacationQueryKey.GET_VACATION_POLICIES] });
      toast.success('휴가 정책이 등록되었습니다.');
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });
}

interface DeleteVacationPolicyResp {
  vacation_policy_id: number
}

const useDeleteVacationPolicy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vacationPolicyId: number) => {
      const resp: ApiResponse<DeleteVacationPolicyResp> = await api.request({
        method: 'delete',
        url: `/vacation-policies/${vacationPolicyId}`
      });

      if (resp.code !== 200) throw new Error(resp.message);

      return resp.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [VacationQueryKey.GET_VACATION_POLICIES] });
      toast.success('휴가 정책이 삭제되었습니다.');
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });
}

interface PostAssignVacationPoliciesToUserReq {
  user_id: string
  vacation_policy_ids: number[]
}

interface PostAssignVacationPoliciesToUserResp {
  user_id: string
  assigned_vacation_policy_ids: number[]
}

const usePostAssignVacationPoliciesToUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reqData: PostAssignVacationPoliciesToUserReq) => {
      const resp: ApiResponse<PostAssignVacationPoliciesToUserResp> = await api.request({
        method: 'post',
        url: `/users/${reqData.user_id}/vacation-policies`,
        data: {
          vacation_policy_ids: reqData.vacation_policy_ids
        }
      });

      if (resp.code !== 200) throw new Error(resp.message);

      return resp.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [VacationQueryKey.GET_USER_VACATION_POLICIES] });
      toast.success('휴가 정책이 할당되었습니다.');
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });
}

interface GetUserVacationPoliciesReq {
  user_id: string
  grant_method?: 'ON_REQUEST' | 'MANUAL_GRANT' | 'REPEAT_GRANT'
}

interface GetUserVacationPoliciesResp {
  user_vacation_policy_id: number
  vacation_policy_id: number
  vacation_policy_name: string
  vacation_policy_desc: string
  vacation_type: string
  grant_method: string
  grant_time: number
  grant_time_str: string
  is_flexible_grant: string
  minute_grant_yn: string
  repeat_unit: string
  repeat_interval: number
  specific_months: number
  specific_days: number
  first_grant_date: string
  is_recurring: string
  approval_required_count: number
  max_grant_count: number
  effective_type: string
  expiration_type: string
  repeat_grant_desc: string
}

const useGetUserVacationPolicies = (reqData: GetUserVacationPoliciesReq) => {
  return useQuery({
    queryKey: [VacationQueryKey.GET_USER_VACATION_POLICIES, reqData.user_id, reqData.grant_method],
    queryFn: async (): Promise<GetUserVacationPoliciesResp[]> => {
      const params = new URLSearchParams()
      if (reqData.grant_method) {
        params.append('grantMethod', reqData.grant_method)
      }
      const queryString = params.toString() ? `?${params.toString()}` : ''

      const resp: ApiResponse<GetUserVacationPoliciesResp[]> = await api.request({
        method: 'get',
        url: `/users/${reqData.user_id}/vacation-policies${queryString}`
      });

      if (resp.code !== 200) throw new Error(resp.message);

      return resp.data;
    },
    enabled: !!reqData.user_id
  });
}

interface VacationPolicyAssignmentInfo {
  vacation_policy_id: number
  vacation_policy_name: string
  vacation_policy_desc: string
  vacation_type: string
  grant_method: string
  grant_time: number
  grant_time_str: string
  is_flexible_grant: string
  minute_grant_yn: string
  repeat_unit: string
  repeat_interval: number
  specific_months: number
  specific_days: number
  effective_type: string
  expiration_type: string
  repeat_grant_desc: string
}

interface GetUserVacationPolicyAssignmentStatusReq {
  user_id: string
}

interface GetUserVacationPolicyAssignmentStatusResp {
  assigned_policies: VacationPolicyAssignmentInfo[]
  unassigned_policies: VacationPolicyAssignmentInfo[]
}

const useGetUserVacationPolicyAssignmentStatus = (reqData: GetUserVacationPolicyAssignmentStatusReq) => {
  return useQuery({
    queryKey: [VacationQueryKey.GET_USER_VACATION_POLICY_ASSIGNMENT_STATUS, reqData.user_id],
    queryFn: async (): Promise<GetUserVacationPolicyAssignmentStatusResp> => {
      const resp: ApiResponse<GetUserVacationPolicyAssignmentStatusResp> = await api.request({
        method: 'get',
        url: `/users/${reqData.user_id}/vacation-policies/assignment-status`
      });

      if (resp.code !== 200) throw new Error(resp.message);

      return resp.data;
    },
    enabled: !!reqData.user_id
  });
}

interface DeleteRevokeVacationPolicyFromUserReq {
  user_id: string
  vacation_policy_id: number
}

interface DeleteRevokeVacationPolicyFromUserResp {
  user_id: string
  vacation_policy_id: number
  user_vacation_policy_id: number
}

const useDeleteRevokeVacationPolicyFromUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reqData: DeleteRevokeVacationPolicyFromUserReq) => {
      const resp: ApiResponse<DeleteRevokeVacationPolicyFromUserResp> = await api.request({
        method: 'delete',
        url: `/users/${reqData.user_id}/vacation-policies/${reqData.vacation_policy_id}`
      });

      if (resp.code !== 200) throw new Error(resp.message);

      return resp.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [VacationQueryKey.GET_USER_VACATION_POLICIES] });
      toast.success('휴가 정책이 회수되었습니다.');
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });
}

interface DeleteRevokeVacationPoliciesFromUserReq {
  user_id: string
  vacation_policy_ids: number[]
}

interface DeleteRevokeVacationPoliciesFromUserResp {
  user_id: string
  revoked_vacation_policy_ids: number[]
}

const useDeleteRevokeVacationPoliciesFromUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reqData: DeleteRevokeVacationPoliciesFromUserReq) => {
      const resp: ApiResponse<DeleteRevokeVacationPoliciesFromUserResp> = await api.request({
        method: 'delete',
        url: `/users/${reqData.user_id}/vacation-policies`,
        data: {
          vacation_policy_ids: reqData.vacation_policy_ids
        }
      });

      if (resp.code !== 200) throw new Error(resp.message);

      return resp.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [VacationQueryKey.GET_USER_VACATION_POLICIES] });
      toast.success('휴가 정책이 일괄 회수되었습니다.');
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });
}

interface PostManualGrantVacationReq {
  user_id: string
  vacation_policy_id: number
  grant_time: number
  grant_date: string
  expiry_date: string
  grant_desc: string
}

interface PostManualGrantVacationResp {
  vacation_grant_id: number
  user_id: string
  vacation_policy_id: number
  grant_time: number
  grant_date: string
  expiry_date: string
}

const usePostManualGrantVacation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reqData: PostManualGrantVacationReq) => {
      const { user_id, ...data } = reqData;
      const resp: ApiResponse<PostManualGrantVacationResp> = await api.request({
        method: 'post',
        url: `/users/${user_id}/vacation-grants`,
        data
      });

      if (resp.code !== 200) throw new Error(resp.message);

      return resp.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [VacationQueryKey.GET_USER_VACATION_HISTORY] });
      toast.success('휴가가 부여되었습니다.');
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });
}

interface DeleteRevokeVacationGrantResp {
  vacation_grant_id: number
  user_id: string
}

const useDeleteRevokeVacationGrant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vacationGrantId: number) => {
      const resp: ApiResponse<DeleteRevokeVacationGrantResp> = await api.request({
        method: 'delete',
        url: `/vacation-grants/${vacationGrantId}`
      });

      if (resp.code !== 200) throw new Error(resp.message);

      return resp.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [VacationQueryKey.GET_USER_VACATION_HISTORY] });
      toast.success('휴가 부여가 회수되었습니다.');
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });
}

interface PostRequestVacationReq {
  user_id: string
  policy_id: number
  desc: string
  approver_ids: string[]
  request_start_time: string
  request_end_time: string | null
  request_desc: string
  grant_time?: number
}

interface PostRequestVacationResp {
  vacation_grant_id: number
}

const usePostRequestVacation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reqData: PostRequestVacationReq) => {
      const { user_id, ...data } = reqData;
      const resp: ApiResponse<PostRequestVacationResp> = await api.request({
        method: 'post',
        url: `/users/${user_id}/vacation-requests`,
        data
      });

      if (resp.code !== 200) throw new Error(resp.message);

      return resp.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [VacationQueryKey.GET_USER_VACATION_HISTORY] });
      toast.success('휴가 신청이 완료되었습니다.');
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });
}

interface PostApproveVacationReq {
  approval_id: number
  approver_id: string
}

interface PostApproveVacationResp {
  approval_id: number
}

const usePostApproveVacation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reqData: PostApproveVacationReq) => {
      const resp: ApiResponse<PostApproveVacationResp> = await api.request({
        method: 'post',
        url: `/vacation-approvals/${reqData.approval_id}/approve?approverId=${reqData.approver_id}`
      });

      if (resp.code !== 200) throw new Error(resp.message);

      return resp.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [VacationQueryKey.GET_ALL_VACATIONS_BY_APPROVER] });
      queryClient.invalidateQueries({ queryKey: [VacationQueryKey.GET_USER_VACATION_HISTORY] });
      toast.success('휴가가 승인되었습니다.');
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });
}

interface PostRejectVacationReq {
  approval_id: number
  approver_id: string
  rejection_reason: string
}

interface PostRejectVacationResp {
  approval_id: number
}

const usePostRejectVacation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reqData: PostRejectVacationReq) => {
      const { approval_id, approver_id, rejection_reason } = reqData;
      const resp: ApiResponse<PostRejectVacationResp> = await api.request({
        method: 'post',
        url: `/vacation-approvals/${approval_id}/reject?approverId=${approver_id}`,
        data: { rejection_reason }
      });

      if (resp.code !== 200) throw new Error(resp.message);

      return resp.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [VacationQueryKey.GET_ALL_VACATIONS_BY_APPROVER] });
      toast.success('휴가가 거부되었습니다.');
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });
}

interface GetAllVacationsByApproverReq {
  approver_id: string
  status?: string
}

interface GetUserRequestedVacationsReq {
  user_id: string
}

interface ApproverInfo {
  approval_id: number
  approver_id: string
  approver_name: string
  approval_order: number
  approval_status: string
  approval_status_name: string
  approval_date: string | null
}

interface GetUserRequestedVacationsResp {
  vacation_grant_id: number
  policy_id: number
  policy_name: string
  vacation_type: string
  vacation_type_name: string
  desc: string
  grant_time: number
  grant_time_str: string
  policy_grant_time: number
  policy_grant_time_str: string
  remain_time: number
  remain_time_str: string
  grant_date: string | null
  expiry_date: string | null
  request_start_time: string
  request_end_time: string | null
  request_desc: string
  grant_status: string
  grant_status_name: string
  create_date: string
  current_approver_id: string | null
  current_approver_name: string | null
  approvers: ApproverInfo[] | null
}

const useGetAllVacationsByApprover = (reqData: GetAllVacationsByApproverReq) => {
  return useQuery({
    queryKey: [VacationQueryKey.GET_ALL_VACATIONS_BY_APPROVER, reqData.approver_id, reqData.status],
    queryFn: async (): Promise<GetUserRequestedVacationsResp[]> => {
      const params = new URLSearchParams()
      if (reqData.status) {
        params.append('status', reqData.status)
      }
      const queryString = params.toString() ? `?${params.toString()}` : ''

      const resp: ApiResponse<GetUserRequestedVacationsResp[]> = await api.request({
        method: 'get',
        url: `/users/${reqData.approver_id}/vacation-approvals${queryString}`
      });

      if (resp.code !== 200) throw new Error(resp.message);

      return resp.data;
    },
    enabled: !!reqData.approver_id
  });
}

const useGetUserRequestedVacations = (reqData: GetUserRequestedVacationsReq) => {
  return useQuery({
    queryKey: [VacationQueryKey.GET_USER_REQUESTED_VACATIONS, reqData.user_id],
    queryFn: async (): Promise<GetUserRequestedVacationsResp[]> => {
      const resp: ApiResponse<GetUserRequestedVacationsResp[]> = await api.request({
        method: 'get',
        url: `/users/${reqData.user_id}/vacation-requests`
      });

      if (resp.code !== 200) throw new Error(resp.message);

      return resp.data;
    },
    enabled: !!reqData.user_id
  });
}

interface GetUserRequestedVacationStatsReq {
  user_id: string
}

interface GetUserRequestedVacationStatsResp {
  total_request_count: number
  current_month_request_count: number
  change_rate: number
  pending_count: number
  average_processing_days: number
  progress_count: number
  approved_count: number
  approval_rate: number
  rejected_count: number
  canceled_count: number
  acquired_vacation_time_str: string
  acquired_vacation_time: number
}

const useGetUserRequestedVacationStats = (reqData: GetUserRequestedVacationStatsReq) => {
  return useQuery({
    queryKey: [VacationQueryKey.GET_USER_REQUESTED_VACATION_STATS, reqData.user_id],
    queryFn: async (): Promise<GetUserRequestedVacationStatsResp> => {
      const resp: ApiResponse<GetUserRequestedVacationStatsResp> = await api.request({
        method: 'get',
        url: `/users/${reqData.user_id}/vacation-requests/stats`
      });

      if (resp.code !== 200) throw new Error(resp.message);

      return resp.data;
    },
    enabled: !!reqData.user_id
  });
}

interface PostCancelVacationRequestReq {
  vacation_grant_id: number
  user_id: string
}

interface PostCancelVacationRequestResp {
  vacation_grant_id: number
}

const usePostCancelVacationRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reqData: PostCancelVacationRequestReq) => {
      const resp: ApiResponse<PostCancelVacationRequestResp> = await api.request({
        method: 'post',
        url: `/vacation-requests/${reqData.vacation_grant_id}/cancel?userId=${reqData.user_id}`
      });

      if (resp.code !== 200) throw new Error(resp.message);

      return resp.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [VacationQueryKey.GET_USER_REQUESTED_VACATIONS] });
      queryClient.invalidateQueries({ queryKey: [VacationQueryKey.GET_USER_REQUESTED_VACATION_STATS] });
      toast.success('휴가 신청이 취소되었습니다.');
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });
}

export {
  useDeleteRevokeVacationGrant, useDeleteRevokeVacationPoliciesFromUser, useDeleteRevokeVacationPolicyFromUser, useDeleteVacationPolicy, useDeleteVacationUsage, useGetAllUsersVacationHistory,
  useGetAllVacationsByApprover, useGetAvailableVacations, useGetUserMonthlyVacationStats, useGetUserRequestedVacations,
  useGetUserRequestedVacationStats, useGetUserVacationHistory, useGetUserVacationPolicies, useGetUserVacationPolicyAssignmentStatus, useGetUserVacationStats, useGetUserVacationUsagesByPeriod, useGetVacationPolicies,
  useGetVacationPolicy, useGetVacationUsagesByPeriod, usePostApproveVacation, usePostAssignVacationPoliciesToUser, usePostCancelVacationRequest, usePostManualGrantVacation, usePostRejectVacation, usePostRequestVacation, usePostUseVacation, usePostVacationPolicy, VacationQueryKey
};

  export type {
    ApproverInfo, DeleteRevokeVacationGrantResp, DeleteRevokeVacationPoliciesFromUserReq,
    DeleteRevokeVacationPoliciesFromUserResp, DeleteRevokeVacationPolicyFromUserReq,
    DeleteRevokeVacationPolicyFromUserResp, DeleteVacationPolicyResp, GetAllUsersVacationHistoryResp,
    GetAllVacationsByApproverReq,
    GetAvailableVacationsReq,
    GetAvailableVacationsResp, GetUserMonthlyVacationStatsReq,
    GetUserMonthlyVacationStatsResp, GetUserRequestedVacationsReq,
    GetUserRequestedVacationsResp,
    GetUserRequestedVacationStatsReq,
    GetUserRequestedVacationStatsResp, GetUserVacationHistoryReq,
    GetUserVacationHistoryResp, GetUserVacationPoliciesReq,
    GetUserVacationPoliciesResp, GetUserVacationPolicyAssignmentStatusReq,
    GetUserVacationPolicyAssignmentStatusResp, GetUserVacationStatsReq,
    GetUserVacationStatsResp, GetUserVacationUsagesByPeriodReq,
    GetUserVacationUsagesByPeriodResp, GetVacationPoliciesResp,
    GetVacationPolicyReq,
    GetVacationPolicyResp, GetVacationUsagesByPeriodReq,
    GetVacationUsagesByPeriodResp, PostApproveVacationReq,
    PostApproveVacationResp, PostAssignVacationPoliciesToUserReq,
    PostAssignVacationPoliciesToUserResp, PostCancelVacationRequestReq,
    PostCancelVacationRequestResp, PostManualGrantVacationReq,
    PostManualGrantVacationResp, PostRejectVacationReq,
    PostRejectVacationResp, PostRequestVacationReq,
    PostRequestVacationResp, PostUseVacationReq,
    PostUseVacationResp, PostVacationPolicyReq,
    PostVacationPolicyResp, VacationGrantInfo, VacationPolicyAssignmentInfo,
    VacationUsageInfo
  };

