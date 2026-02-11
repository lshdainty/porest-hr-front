import { apiClient } from '@/shared/api'
import type { ApiResponse } from '@/shared/types'
import type {
  BulkCreateWorkHistoryReq,
  BulkCreateWorkHistoryResp,
  CheckSystemStatusBatchResp,
  CreateWorkCodeReq,
  CreateWorkCodeResp,
  CreateWorkHistoryReq,
  CreateWorkHistoryResp,
  SystemType,
  TodayWorkStatusResp,
  ToggleSystemCheckReq,
  ToggleSystemCheckResp,
  UnregisteredWorkDatesResp,
  UnregisteredWorkHistoryDownloadReq,
  UpdateWorkCodeReq,
  UpdateWorkHistoryReq,
  WorkCodeResp,
  WorkHistoryResp,
  WorkHistorySearchCondition,
} from '@/entities/work/model/types'

export const workApi = {
  getRootLabel: async (): Promise<WorkCodeResp[]> => {
    const resp: ApiResponse<WorkCodeResp[]> = await apiClient.request({
      method: 'get',
      url: `/work-codes`,
      params: {
        parent_is_null: true,
        type: 'LABEL'
      }
    })

    if (!resp.success) throw new Error(resp.message)

    return resp.data
  },

  getWorkGroups: async (): Promise<WorkCodeResp[]> => {
    const resp: ApiResponse<WorkCodeResp[]> = await apiClient.request({
      method: 'get',
      url: `/work-codes`,
      params: {
        parent_work_code: 'work_group',
        type: 'OPTION'
      }
    })

    if (!resp.success) throw new Error(resp.message)

    return resp.data
  },

  getWorkPartLabel: async (parentWorkCodeId: number): Promise<WorkCodeResp[]> => {
    const resp: ApiResponse<WorkCodeResp[]> = await apiClient.request({
      method: 'get',
      url: `/work-codes`,
      params: {
        parent_work_code_id: parentWorkCodeId,
        type: 'LABEL'
      }
    })

    if (!resp.success) throw new Error(resp.message)

    return resp.data
  },

  getWorkParts: async (parentWorkCodeId: number): Promise<WorkCodeResp[]> => {
    const resp: ApiResponse<WorkCodeResp[]> = await apiClient.request({
      method: 'get',
      url: `/work-codes`,
      params: {
        parent_work_code_id: parentWorkCodeId,
        type: 'OPTION'
      }
    })

    if (!resp.success) throw new Error(resp.message)

    return resp.data
  },

  getWorkDivision: async (): Promise<WorkCodeResp[]> => {
    const resp: ApiResponse<WorkCodeResp[]> = await apiClient.request({
      method: 'get',
      url: `/work-codes`,
      params: {
        parent_work_code: 'work_division',
        type: 'OPTION'
      }
    })

    if (!resp.success) throw new Error(resp.message)

    return resp.data
  },

  createWorkHistory: async (data: CreateWorkHistoryReq): Promise<CreateWorkHistoryResp> => {
    const resp: ApiResponse<CreateWorkHistoryResp> = await apiClient.request({
      method: 'post',
      url: `/work-histories`,
      data
    })

    if (!resp.success) throw new Error(resp.message)

    return resp.data
  },

  getWorkHistories: async (params?: WorkHistorySearchCondition): Promise<WorkHistoryResp[]> => {
    const resp: ApiResponse<WorkHistoryResp[]> = await apiClient.request({
      method: 'get',
      url: `/work-histories`,
      params
    })

    if (!resp.success) throw new Error(resp.message)

    return resp.data
  },

  updateWorkHistory: async (data: UpdateWorkHistoryReq): Promise<void> => {
    const { work_history_id, ...requestData } = data
    const resp: ApiResponse<void> = await apiClient.request({
      method: 'put',
      url: `/work-histories/${work_history_id}`,
      data: requestData
    })

    if (!resp.success) throw new Error(resp.message)
  },

  deleteWorkHistory: async (workHistoryId: number): Promise<void> => {
    const resp: ApiResponse<void> = await apiClient.request({
      method: 'delete',
      url: `/work-histories/${workHistoryId}`
    })

    if (!resp.success) throw new Error(resp.message)
  },

  bulkCreateWorkHistories: async (data: BulkCreateWorkHistoryReq): Promise<BulkCreateWorkHistoryResp> => {
    const resp: ApiResponse<BulkCreateWorkHistoryResp> = await apiClient.request({
      method: 'post',
      url: `/work-histories/bulk`,
      data
    })

    if (!resp.success) throw new Error(resp.message)

    return resp.data
  },

  getAllWorkCodes: async (): Promise<WorkCodeResp[]> => {
    const resp: ApiResponse<WorkCodeResp[]> = await apiClient.request({
      method: 'get',
      url: `/work-codes/all`
    })

    if (!resp.success) throw new Error(resp.message)

    return resp.data
  },

  getWorkHistoryExcelDownload: async (params?: WorkHistorySearchCondition): Promise<Blob> => {
    const resp = await apiClient.request({
      method: 'get',
      url: `/work-histories/excel/download`,
      params,
      responseType: 'blob'
    })

    return resp as unknown as Blob
  },

  getUnregisteredWorkHistoryExcelDownload: async (params: UnregisteredWorkHistoryDownloadReq): Promise<Blob> => {
    const resp = await apiClient.request({
      method: 'get',
      url: `/work-histories/unregistered-hours/download`,
      params,
      responseType: 'blob'
    })

    return resp as unknown as Blob
  },

  createWorkCode: async (data: CreateWorkCodeReq): Promise<CreateWorkCodeResp> => {
    const resp: ApiResponse<CreateWorkCodeResp> = await apiClient.request({
      method: 'post',
      url: `/work-codes`,
      data
    })

    if (!resp.success) throw new Error(resp.message)

    return resp.data
  },

  updateWorkCode: async (data: UpdateWorkCodeReq): Promise<void> => {
    const { work_code_id, ...requestData } = data
    const resp: ApiResponse<void> = await apiClient.request({
      method: 'put',
      url: `/work-codes/${work_code_id}`,
      data: requestData
    })

    if (!resp.success) throw new Error(resp.message)
  },

  deleteWorkCode: async (workCodeId: number): Promise<void> => {
    const resp: ApiResponse<void> = await apiClient.request({
      method: 'delete',
      url: `/work-codes/${workCodeId}`
    })

    if (!resp.success) throw new Error(resp.message)
  },

  toggleSystemCheck: async (data: ToggleSystemCheckReq): Promise<ToggleSystemCheckResp> => {
    const resp: ApiResponse<ToggleSystemCheckResp> = await apiClient.request({
      method: 'post',
      url: `/work/system-logs`,
      data
    })

    if (!resp.success) throw new Error(resp.message)

    return resp.data
  },

  getSystemCheckStatus: async (systemCodes: SystemType[]): Promise<CheckSystemStatusBatchResp> => {
    const resp: ApiResponse<CheckSystemStatusBatchResp> = await apiClient.request({
      method: 'get',
      url: `/work/system-logs/status`,
      params: {
        system_codes: systemCodes.join(',')
      }
    })

    if (!resp.success) throw new Error(resp.message)

    return resp.data
  },

  getTodayWorkStatus: async (): Promise<TodayWorkStatusResp> => {
    const resp: ApiResponse<TodayWorkStatusResp> = await apiClient.request({
      method: 'get',
      url: `/work-histories/today/status`
    })

    if (!resp.success) throw new Error(resp.message)

    return resp.data
  },

  getUnregisteredWorkDates: async (year: number, month: number): Promise<UnregisteredWorkDatesResp> => {
    const resp: ApiResponse<UnregisteredWorkDatesResp> = await apiClient.request({
      method: 'get',
      url: `/work-histories/unregistered-dates`,
      params: {
        year,
        month
      }
    })

    if (!resp.success) throw new Error(resp.message)

    return resp.data
  },
}
