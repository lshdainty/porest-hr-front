'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { createQueryKeys } from '@/constants/query-keys'
import {
    fetchDeleteRevokeVacationGrant,
    fetchDeleteRevokeVacationPoliciesFromUser,
    fetchDeleteRevokeVacationPolicyFromUser,
    fetchDeleteVacationPolicy,
    fetchDeleteVacationUsage,
    fetchGetAllUsersVacationHistory,
    fetchGetAllVacationsByApprover,
    fetchGetAvailableVacations,
    fetchGetUserAssignedVacationPolicies,
    fetchGetUserMonthlyVacationStats,
    fetchGetUserRequestedVacations,
    fetchGetUserRequestedVacationStats,
    fetchGetUserVacationHistory,
    fetchGetUserVacationPolicies,
    fetchGetUserVacationPolicyAssignmentStatus,
    fetchGetUserVacationStats,
    fetchGetUserVacationUsagesByPeriod,
    fetchGetVacationPolicies,
    fetchGetVacationPolicy,
    fetchGetVacationUsagesByPeriod,
    fetchPostApproveVacation,
    fetchPostAssignVacationPoliciesToUser,
    fetchPostCancelVacationRequest,
    fetchPostManualGrantVacation,
    fetchPostRejectVacation,
    fetchPostRequestVacation,
    fetchPostUseVacation,
    fetchPostVacationPolicy,
    fetchPutUpdateVacationUsage,
    type DeleteRevokeVacationGrantResp,
    type DeleteRevokeVacationPoliciesFromUserResp,
    type DeleteRevokeVacationPolicyFromUserResp,
    type DeleteVacationPolicyResp,
    type GetAllUsersVacationHistoryResp,
    type GetAvailableVacationsResp,
    type GetUserAssignedVacationPoliciesResp,
    type GetUserMonthlyVacationStatsResp,
    type GetUserRequestedVacationsResp,
    type GetUserRequestedVacationStatsResp,
    type GetUserVacationHistoryResp,
    type GetUserVacationPoliciesResp,
    type GetUserVacationPolicyAssignmentStatusResp,
    type GetUserVacationStatsResp,
    type GetUserVacationUsagesByPeriodResp,
    type GetVacationPoliciesResp,
    type GetVacationPolicyResp,
    type GetVacationUsagesByPeriodResp,
    type PostApproveVacationResp,
    type PostAssignVacationPoliciesToUserResp,
    type PostCancelVacationRequestResp,
    type PostManualGrantVacationReq,
    type PostManualGrantVacationResp,
    type PostRejectVacationResp,
    type PostRequestVacationReq,
    type PostRequestVacationResp,
    type PostUseVacationReq,
    type PostUseVacationResp,
    type PostVacationPolicyReq,
    type PostVacationPolicyResp,
    type PutUpdateVacationUsageReq,
    type PutUpdateVacationUsageResp
} from '@/lib/api/vacation'

const vacationKeys = createQueryKeys('vacations')
const calendarKeys = createQueryKeys('calendars')

// 사용자 휴가 히스토리 조회 훅
export const useUserVacationHistoryQuery = (userId: string) => {
  return useQuery<GetUserVacationHistoryResp>({
    queryKey: vacationKeys.list({ type: 'history', userId }),
    queryFn: () => fetchGetUserVacationHistory(userId),
    enabled: !!userId
  })
}

// 전체 사용자 휴가 히스토리 조회 훅
export const useAllUsersVacationHistoryQuery = () => {
  return useQuery<GetAllUsersVacationHistoryResp[]>({
    queryKey: vacationKeys.lists(),
    queryFn: () => fetchGetAllUsersVacationHistory()
  })
}

// 사용 가능한 휴가 조회 훅
export const useAvailableVacationsQuery = (userId: string, startDate: string, options?: { enabled?: boolean }) => {
  return useQuery<GetAvailableVacationsResp[]>({
    queryKey: vacationKeys.list({ type: 'available', userId, startDate }),
    queryFn: () => fetchGetAvailableVacations(userId, startDate),
    enabled: (options?.enabled ?? true) && !!userId && !!startDate
  })
}

// 기간별 휴가 사용 내역 조회 훅
export const useVacationUsagesByPeriodQuery = (startDate: string, endDate: string) => {
  return useQuery<GetVacationUsagesByPeriodResp[]>({
    queryKey: vacationKeys.list({ type: 'usages', startDate, endDate }),
    queryFn: () => fetchGetVacationUsagesByPeriod(startDate, endDate),
    enabled: !!startDate && !!endDate
  })
}

// 사용자별 기간별 휴가 사용 내역 조회 훅
export const useUserVacationUsagesByPeriodQuery = (userId: string, startDate: string, endDate: string) => {
  return useQuery<GetUserVacationUsagesByPeriodResp[]>({
    queryKey: vacationKeys.list({ type: 'userUsages', userId, startDate, endDate }),
    queryFn: () => fetchGetUserVacationUsagesByPeriod(userId, startDate, endDate),
    enabled: !!userId && !!startDate && !!endDate
  })
}

// 사용자 월별 휴가 통계 조회 훅
export const useUserMonthlyVacationStatsQuery = (userId: string, year: string) => {
  return useQuery<GetUserMonthlyVacationStatsResp[]>({
    queryKey: vacationKeys.list({ type: 'monthlyStats', userId, year }),
    queryFn: () => fetchGetUserMonthlyVacationStats(userId, year),
    enabled: !!userId && !!year
  })
}

// 사용자 휴가 통계 조회 훅
export const useUserVacationStatsQuery = (userId: string, baseDate: string) => {
  return useQuery<GetUserVacationStatsResp>({
    queryKey: vacationKeys.list({ type: 'stats', userId, baseDate }),
    queryFn: () => fetchGetUserVacationStats(userId, baseDate),
    enabled: !!userId && !!baseDate
  })
}

// 휴가 정책 상세 조회 훅
export const useVacationPolicyQuery = (vacationPolicyId: number) => {
  return useQuery<GetVacationPolicyResp>({
    queryKey: vacationKeys.detail(vacationPolicyId),
    queryFn: () => fetchGetVacationPolicy(vacationPolicyId),
    enabled: !!vacationPolicyId
  })
}

// 휴가 정책 목록 조회 훅
export const useVacationPoliciesQuery = () => {
  return useQuery<GetVacationPoliciesResp[]>({
    queryKey: vacationKeys.list({ type: 'policies' }),
    queryFn: () => fetchGetVacationPolicies()
  })
}

// 사용자 휴가 정책 조회 훅
export const useUserVacationPoliciesQuery = (userId: string, grantMethod?: string) => {
  return useQuery<GetUserVacationPoliciesResp[]>({
    queryKey: vacationKeys.list({ type: 'userPolicies', userId, grantMethod }),
    queryFn: () => fetchGetUserVacationPolicies(userId, grantMethod),
    enabled: !!userId
  })
}

// 사용자 할당된 휴가 정책 조회 훅
export const useUserAssignedVacationPoliciesQuery = (userId: string, vacationType?: string, grantMethod?: string) => {
  return useQuery<GetUserAssignedVacationPoliciesResp[]>({
    queryKey: vacationKeys.list({ type: 'assignedPolicies', userId, vacationType, grantMethod }),
    queryFn: () => fetchGetUserAssignedVacationPolicies(userId, vacationType, grantMethod),
    enabled: !!userId
  })
}

// 사용자 휴가 정책 할당 상태 조회 훅
export const useUserVacationPolicyAssignmentStatusQuery = (userId: string) => {
  return useQuery<GetUserVacationPolicyAssignmentStatusResp>({
    queryKey: vacationKeys.list({ type: 'assignmentStatus', userId }),
    queryFn: () => fetchGetUserVacationPolicyAssignmentStatus(userId),
    enabled: !!userId
  })
}

// 결재자별 휴가 승인 내역 조회 훅
export const useAllVacationsByApproverQuery = (approverId: string, status?: string) => {
  return useQuery<GetUserRequestedVacationsResp[]>({
    queryKey: vacationKeys.list({ type: 'approvals', approverId, status }),
    queryFn: () => fetchGetAllVacationsByApprover(approverId, status),
    enabled: !!approverId
  })
}

// 사용자 휴가 요청 내역 조회 훅
export const useUserRequestedVacationsQuery = (userId: string) => {
  return useQuery<GetUserRequestedVacationsResp[]>({
    queryKey: vacationKeys.list({ type: 'requests', userId }),
    queryFn: () => fetchGetUserRequestedVacations(userId),
    enabled: !!userId
  })
}

// 사용자 휴가 요청 통계 조회 훅
export const useUserRequestedVacationStatsQuery = (userId: string) => {
  return useQuery<GetUserRequestedVacationStatsResp>({
    queryKey: vacationKeys.list({ type: 'requestStats', userId }),
    queryFn: () => fetchGetUserRequestedVacationStats(userId),
    enabled: !!userId
  })
}

// 휴가 사용 등록 Mutation 훅
export const usePostUseVacationMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<PostUseVacationResp, Error, PostUseVacationReq>({
    mutationFn: (data: PostUseVacationReq) => fetchPostUseVacation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: calendarKeys.lists() })
      queryClient.invalidateQueries({ queryKey: vacationKeys.all() })
    }
  })
}

// 휴가 사용 수정 Mutation 훅
export const usePutUpdateVacationUsageMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<PutUpdateVacationUsageResp, Error, PutUpdateVacationUsageReq>({
    mutationFn: (data: PutUpdateVacationUsageReq) => fetchPutUpdateVacationUsage(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: calendarKeys.lists() })
      queryClient.invalidateQueries({ queryKey: vacationKeys.all() })
    }
  })
}

// 휴가 사용 삭제 Mutation 훅
export const useDeleteVacationUsageMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<any, Error, number>({
    mutationFn: (vacationUsageId: number) => fetchDeleteVacationUsage(vacationUsageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: calendarKeys.lists() })
      queryClient.invalidateQueries({ queryKey: vacationKeys.all() })
    }
  })
}

// 휴가 정책 생성 Mutation 훅
export const usePostVacationPolicyMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<PostVacationPolicyResp, Error, PostVacationPolicyReq>({
    mutationFn: (data: PostVacationPolicyReq) => fetchPostVacationPolicy(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vacationKeys.all() })
    }
  })
}

// 휴가 정책 삭제 Mutation 훅
export const useDeleteVacationPolicyMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<DeleteVacationPolicyResp, Error, number>({
    mutationFn: (vacationPolicyId: number) => fetchDeleteVacationPolicy(vacationPolicyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vacationKeys.all() })
    }
  })
}

// 사용자에게 휴가 정책 할당 Mutation 훅
export const usePostAssignVacationPoliciesToUserMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<PostAssignVacationPoliciesToUserResp, Error, { userId: string; vacationPolicyIds: number[] }>({
    mutationFn: ({ userId, vacationPolicyIds }) => fetchPostAssignVacationPoliciesToUser(userId, vacationPolicyIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vacationKeys.all() })
    }
  })
}

// 사용자로부터 휴가 정책 회수 Mutation 훅
export const useDeleteRevokeVacationPolicyFromUserMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<DeleteRevokeVacationPolicyFromUserResp, Error, { userId: string; vacationPolicyId: number }>({
    mutationFn: ({ userId, vacationPolicyId }) => fetchDeleteRevokeVacationPolicyFromUser(userId, vacationPolicyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vacationKeys.all() })
    }
  })
}

// 사용자로부터 여러 휴가 정책 회수 Mutation 훅
export const useDeleteRevokeVacationPoliciesFromUserMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<DeleteRevokeVacationPoliciesFromUserResp, Error, { userId: string; vacationPolicyIds: number[] }>({
    mutationFn: ({ userId, vacationPolicyIds }) => fetchDeleteRevokeVacationPoliciesFromUser(userId, vacationPolicyIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vacationKeys.all() })
    }
  })
}

// 수동 휴가 부여 Mutation 훅
export const usePostManualGrantVacationMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<PostManualGrantVacationResp, Error, PostManualGrantVacationReq>({
    mutationFn: (data: PostManualGrantVacationReq) => fetchPostManualGrantVacation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vacationKeys.all() })
    }
  })
}

// 휴가 부여 취소 Mutation 훅
export const useDeleteRevokeVacationGrantMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<DeleteRevokeVacationGrantResp, Error, number>({
    mutationFn: (vacationGrantId: number) => fetchDeleteRevokeVacationGrant(vacationGrantId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vacationKeys.all() })
    }
  })
}

// 휴가 요청 Mutation 훅
export const usePostRequestVacationMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<PostRequestVacationResp, Error, PostRequestVacationReq>({
    mutationFn: (data: PostRequestVacationReq) => fetchPostRequestVacation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vacationKeys.all() })
    }
  })
}

// 휴가 승인 Mutation 훅
export const usePostApproveVacationMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<PostApproveVacationResp, Error, { approvalId: number; approverId: string }>({
    mutationFn: ({ approvalId, approverId }) => fetchPostApproveVacation(approvalId, approverId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vacationKeys.all() })
    }
  })
}

// 휴가 반려 Mutation 훅
export const usePostRejectVacationMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<PostRejectVacationResp, Error, { approvalId: number; approverId: string; rejectionReason: string }>({
    mutationFn: ({ approvalId, approverId, rejectionReason }) => fetchPostRejectVacation(approvalId, approverId, rejectionReason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vacationKeys.all() })
    }
  })
}

// 휴가 요청 취소 Mutation 훅
export const usePostCancelVacationRequestMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<PostCancelVacationRequestResp, Error, { vacationGrantId: number; userId: string }>({
    mutationFn: ({ vacationGrantId, userId }) => fetchPostCancelVacationRequest(vacationGrantId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vacationKeys.all() })
    }
  })
}
