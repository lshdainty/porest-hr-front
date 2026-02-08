import { apiClient } from '@/shared/api'
import type { ApiResponse } from '@/shared/types'
import type {
  PostUseVacationReq,
  PostUseVacationResp,
  GetUserVacationHistoryResp,
  GetAllUsersVacationHistoryResp,
  GetAvailableVacationsResp,
  PutUpdateVacationUsageReq,
  PutUpdateVacationUsageResp,
  GetVacationUsagesByPeriodResp,
  GetUserVacationUsagesByPeriodResp,
  GetUserMonthlyVacationStatsResp,
  GetUserVacationStatsResp,
  PostManualGrantVacationReq,
  PostManualGrantVacationResp,
  DeleteRevokeVacationGrantResp,
  PostRequestVacationReq,
  PostRequestVacationResp,
  PostApproveVacationResp,
  PostRejectVacationResp,
  GetUserRequestedVacationsResp,
  GetUserRequestedVacationStatsResp,
  PostCancelVacationRequestResp,
  GetAllUsersVacationSummaryResp,
} from '@/entities/vacation/model/types'

export const vacationApi = {
  // === Usage ===
  postUseVacation: async (data: PostUseVacationReq): Promise<PostUseVacationResp> => {
    const resp: ApiResponse<PostUseVacationResp> = await apiClient.request({
      method: 'post',
      url: `/vacation-usages`,
      data
    })
    if (!resp.success) throw new Error(resp.message)
    return resp.data
  },

  putUpdateVacationUsage: async (data: PutUpdateVacationUsageReq): Promise<PutUpdateVacationUsageResp> => {
    const { vacation_usage_id, ...requestData } = data
    const resp: ApiResponse<PutUpdateVacationUsageResp> = await apiClient.request({
      method: 'put',
      url: `/vacation-usages/${vacation_usage_id}`,
      data: requestData
    })
    if (!resp.success) throw new Error(resp.message)
    return resp.data
  },

  deleteVacationUsage: async (vacationUsageId: number): Promise<unknown> => {
    const resp: ApiResponse = await apiClient.request({
      method: 'delete',
      url: `/vacation-usages/${vacationUsageId}`
    })
    if (!resp.success) throw new Error(resp.message)
    return resp.data
  },

  // === History ===
  getUserVacationHistory: async (userId: string, year: number): Promise<GetUserVacationHistoryResp> => {
    const resp: ApiResponse<GetUserVacationHistoryResp> = await apiClient.request({
      method: 'get',
      url: `/users/${userId}/vacations?year=${year}`
    })
    if (!resp.success) throw new Error(resp.message)
    return resp.data
  },

  getAllUsersVacationHistory: async (): Promise<GetAllUsersVacationHistoryResp[]> => {
    const resp: ApiResponse<GetAllUsersVacationHistoryResp[]> = await apiClient.request({
      method: 'get',
      url: `/vacations`
    })
    if (!resp.success) throw new Error(resp.message)
    return resp.data
  },

  // === Available ===
  getAvailableVacations: async (userId: string, startDate: string): Promise<GetAvailableVacationsResp> => {
    const resp: ApiResponse<GetAvailableVacationsResp> = await apiClient.request({
      method: 'get',
      url: `/users/${userId}/vacations/available?startDate=${startDate}`
    })
    if (!resp.success) throw new Error(resp.message)
    return resp.data
  },

  // === Usage by period ===
  getVacationUsagesByPeriod: async (startDate: string, endDate: string): Promise<GetVacationUsagesByPeriodResp[]> => {
    const resp: ApiResponse<GetVacationUsagesByPeriodResp[]> = await apiClient.request({
      method: 'get',
      url: `/vacation-usages?startDate=${startDate}&endDate=${endDate}`
    })
    if (!resp.success) throw new Error(resp.message)
    return resp.data
  },

  getUserVacationUsagesByPeriod: async (userId: string, startDate: string, endDate: string): Promise<GetUserVacationUsagesByPeriodResp[]> => {
    const resp: ApiResponse<GetUserVacationUsagesByPeriodResp[]> = await apiClient.request({
      method: 'get',
      url: `/users/${userId}/vacation-usages?startDate=${startDate}&endDate=${endDate}`
    })
    if (!resp.success) throw new Error(resp.message)
    return resp.data
  },

  // === Stats ===
  getUserMonthlyVacationStats: async (userId: string, year: string): Promise<GetUserMonthlyVacationStatsResp[]> => {
    const resp: ApiResponse<GetUserMonthlyVacationStatsResp[]> = await apiClient.request({
      method: 'get',
      url: `/users/${userId}/vacation-usages/monthly-stats?year=${year}`
    })
    if (!resp.success) throw new Error(resp.message)
    return resp.data
  },

  getUserVacationStats: async (userId: string, baseDate: string): Promise<GetUserVacationStatsResp> => {
    const resp: ApiResponse<GetUserVacationStatsResp> = await apiClient.request({
      method: 'get',
      url: `/users/${userId}/vacations/stats?baseDate=${baseDate}`
    })
    if (!resp.success) throw new Error(resp.message)
    return resp.data
  },

  getAllUsersVacationSummary: async (year: number): Promise<GetAllUsersVacationSummaryResp[]> => {
    const resp: ApiResponse<GetAllUsersVacationSummaryResp[]> = await apiClient.request({
      method: 'get',
      url: `/vacations/summary?year=${year}`
    })
    if (!resp.success) throw new Error(resp.message)
    return resp.data
  },

  // === Grant ===
  postManualGrantVacation: async (data: PostManualGrantVacationReq): Promise<PostManualGrantVacationResp> => {
    const { user_id, ...requestData } = data
    const resp: ApiResponse<PostManualGrantVacationResp> = await apiClient.request({
      method: 'post',
      url: `/users/${user_id}/vacation-grants`,
      data: requestData
    })
    if (!resp.success) throw new Error(resp.message)
    return resp.data
  },

  deleteRevokeVacationGrant: async (vacationGrantId: number): Promise<DeleteRevokeVacationGrantResp> => {
    const resp: ApiResponse<DeleteRevokeVacationGrantResp> = await apiClient.request({
      method: 'delete',
      url: `/vacation-grants/${vacationGrantId}`
    })
    if (!resp.success) throw new Error(resp.message)
    return resp.data
  },

  // === Request / Approval ===
  postRequestVacation: async (data: PostRequestVacationReq): Promise<PostRequestVacationResp> => {
    const { user_id, ...requestData } = data
    const resp: ApiResponse<PostRequestVacationResp> = await apiClient.request({
      method: 'post',
      url: `/users/${user_id}/vacation-requests`,
      data: requestData
    })
    if (!resp.success) throw new Error(resp.message)
    return resp.data
  },

  postApproveVacation: async (approvalId: number, approverId: string): Promise<PostApproveVacationResp> => {
    const resp: ApiResponse<PostApproveVacationResp> = await apiClient.request({
      method: 'post',
      url: `/vacation-approvals/${approvalId}/approve?approverId=${approverId}`
    })
    if (!resp.success) throw new Error(resp.message)
    return resp.data
  },

  postRejectVacation: async (approvalId: number, approverId: string, rejectionReason: string): Promise<PostRejectVacationResp> => {
    const resp: ApiResponse<PostRejectVacationResp> = await apiClient.request({
      method: 'post',
      url: `/vacation-approvals/${approvalId}/reject?approverId=${approverId}`,
      data: { rejection_reason: rejectionReason }
    })
    if (!resp.success) throw new Error(resp.message)
    return resp.data
  },

  getAllVacationsByApprover: async (approverId: string, year: number, status?: string): Promise<GetUserRequestedVacationsResp[]> => {
    const params = new URLSearchParams()
    params.append('year', year.toString())
    if (status) {
      params.append('status', status)
    }
    const queryString = `?${params.toString()}`
    const resp: ApiResponse<GetUserRequestedVacationsResp[]> = await apiClient.request({
      method: 'get',
      url: `/users/${approverId}/vacation-approvals${queryString}`
    })
    if (!resp.success) throw new Error(resp.message)
    return resp.data
  },

  getUserRequestedVacations: async (userId: string, year: number): Promise<GetUserRequestedVacationsResp[]> => {
    const resp: ApiResponse<GetUserRequestedVacationsResp[]> = await apiClient.request({
      method: 'get',
      url: `/users/${userId}/vacation-requests?year=${year}`
    })
    if (!resp.success) throw new Error(resp.message)
    return resp.data
  },

  getUserRequestedVacationStats: async (userId: string, year: number): Promise<GetUserRequestedVacationStatsResp> => {
    const resp: ApiResponse<GetUserRequestedVacationStatsResp> = await apiClient.request({
      method: 'get',
      url: `/users/${userId}/vacation-requests/stats?year=${year}`
    })
    if (!resp.success) throw new Error(resp.message)
    return resp.data
  },

  postCancelVacationRequest: async (vacationGrantId: number, userId: string): Promise<PostCancelVacationRequestResp> => {
    const resp: ApiResponse<PostCancelVacationRequestResp> = await apiClient.request({
      method: 'post',
      url: `/vacation-requests/${vacationGrantId}/cancel?userId=${userId}`
    })
    if (!resp.success) throw new Error(resp.message)
    return resp.data
  },
}
