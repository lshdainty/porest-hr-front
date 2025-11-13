import { api, type ApiResponse } from '@/api/index'
import { useQuery, useMutation } from '@tanstack/react-query'

const enum WorkQueryKey {
  GET_WORK_GROUPS = 'getWorkGroups',
  GET_WORK_DIVISION = 'getWorkDivision',
  GET_WORK_PART_LABEL = 'getWorkPartLabel',
  GET_WORK_PARTS = 'getWorkParts'
}

interface WorkCodeResp {
  work_code_seq: number
  work_code: string
  work_code_name: string
  code_type: string
  order_seq: number
  parent_work_code_seq?: number
}

const useGetWorkGroups = () => {
  return useQuery({
    queryKey: [WorkQueryKey.GET_WORK_GROUPS],
    queryFn: async (): Promise<WorkCodeResp[]> => {
      const resp: ApiResponse<WorkCodeResp[]> = await api.request({
        method: 'get',
        url: `/work-codes`,
        params: {
          parent_work_code: 'work_group',
          type: 'OPTION'
        }
      })

      if (resp.code !== 200) throw new Error(resp.message)

      return resp.data
    }
  })
}

interface GetWorkPartLabelReq {
  parent_work_code_seq: number
}

const useGetWorkPartLabel = (reqData: GetWorkPartLabelReq) => {
  return useQuery({
    queryKey: [WorkQueryKey.GET_WORK_PART_LABEL, reqData.parent_work_code_seq],
    queryFn: async (): Promise<WorkCodeResp[]> => {
      const resp: ApiResponse<WorkCodeResp[]> = await api.request({
        method: 'get',
        url: `/work-codes`,
        params: {
          parent_work_code_seq: reqData.parent_work_code_seq,
          type: 'LABEL'
        }
      })

      if (resp.code !== 200) throw new Error(resp.message)

      return resp.data
    },
    enabled: !!reqData.parent_work_code_seq
  })
}

/**
 * 특정 부모 seq의 하위 OPTION 조회 (업무 파트 옵션)
 * GET /api/v1/work-codes?parent_work_code_seq={parentSeq}&type=OPTION
 */
interface GetWorkPartsReq {
  parent_work_code_seq: number
}

const useGetWorkParts = (reqData: GetWorkPartsReq) => {
  return useQuery({
    queryKey: [WorkQueryKey.GET_WORK_PARTS, reqData.parent_work_code_seq],
    queryFn: async (): Promise<WorkCodeResp[]> => {
      const resp: ApiResponse<WorkCodeResp[]> = await api.request({
        method: 'get',
        url: `/work-codes`,
        params: {
          parent_work_code_seq: reqData.parent_work_code_seq,
          type: 'OPTION'
        }
      })

      if (resp.code !== 200) throw new Error(resp.message)

      return resp.data
    },
    enabled: !!reqData.parent_work_code_seq
  })
}

const useGetWorkDivision = () => {
  return useQuery({
    queryKey: [WorkQueryKey.GET_WORK_DIVISION],
    queryFn: async (): Promise<WorkCodeResp[]> => {
      const resp: ApiResponse<WorkCodeResp[]> = await api.request({
        method: 'get',
        url: `/work-codes`,
        params: {
          parent_work_code: 'work_division',
          type: 'OPTION'
        }
      })

      if (resp.code !== 200) throw new Error(resp.message)

      return resp.data
    }
  })
}

/**
 * 업무 이력 생성
 * POST /api/v1/work-histories
 */
interface CreateWorkHistoryReq {
  work_date: string
  work_user_id: string
  work_group_code: string
  work_part_code: string
  work_class_code: string
  work_hour: number
  work_content: string
}

interface CreateWorkHistoryResp {
  work_history_seq: number
}

const useCreateWorkHistory = () => {
  return useMutation({
    mutationFn: async (reqData: CreateWorkHistoryReq): Promise<CreateWorkHistoryResp> => {
      const resp: ApiResponse<CreateWorkHistoryResp> = await api.request({
        method: 'post',
        url: `/work-histories`,
        data: reqData
      })

      if (resp.code !== 200) throw new Error(resp.message)

      return resp.data
    }
  })
}

/**
 * 업무 이력 수정
 * PUT /api/v1/work-histories/{workHistorySeq}
 */
interface UpdateWorkHistoryReq {
  work_history_seq: number
  work_date: string
  work_user_id: string
  work_group_code: string
  work_part_code: string
  work_class_code: string
  work_hour: number
  work_content: string
}

const useUpdateWorkHistory = () => {
  return useMutation({
    mutationFn: async (reqData: UpdateWorkHistoryReq): Promise<void> => {
      const { work_history_seq, ...data } = reqData
      const resp: ApiResponse<void> = await api.request({
        method: 'put',
        url: `/work-histories/${work_history_seq}`,
        data
      })

      if (resp.code !== 200) throw new Error(resp.message)
    }
  })
}

export {
  // API Hook
  useGetWorkGroups,
  useGetWorkDivision,
  useGetWorkPartLabel,
  useGetWorkParts,
  useCreateWorkHistory,
  useUpdateWorkHistory,
  // QueryKey
  WorkQueryKey
}

export type {
  // Interface
  WorkCodeResp,
  GetWorkPartLabelReq,
  GetWorkPartsReq,
  CreateWorkHistoryReq,
  CreateWorkHistoryResp,
  UpdateWorkHistoryReq
}

