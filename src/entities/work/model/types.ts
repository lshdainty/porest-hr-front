export interface WorkCodeResp {
  work_code_id: number
  work_code: string
  work_code_name: string
  code_type: string
  order_seq: number
  parent_work_code_id?: number
}

export interface WorkLabelWithParts extends WorkCodeResp {
  parts: WorkCodeResp[]
}

export interface WorkGroupWithParts extends WorkCodeResp {
  labels: WorkLabelWithParts[]
}

export interface GetWorkPartLabelReq {
  parent_work_code_id: number
}

export interface GetWorkPartsReq {
  parent_work_code_id: number
}

export interface CreateWorkHistoryReq {
  work_date: string
  work_user_id: string
  work_group_code: string
  work_part_code: string
  work_class_code: string
  work_hour: number
  work_content: string
}

export interface CreateWorkHistoryResp {
  work_history_id: number
}

export interface UpdateWorkHistoryReq {
  work_history_id: number
  work_date: string
  work_user_id: string
  work_group_code: string
  work_part_code: string
  work_class_code: string
  work_hour: number
  work_content: string
}

export interface WorkHistoryResp {
  work_history_id: number
  work_date: string
  work_user_id: string
  work_user_name: string
  work_group: WorkCodeResp
  work_part: WorkCodeResp
  work_class: WorkCodeResp
  work_hour: number
  work_content: string
}

export interface DeleteWorkHistoryReq {
  work_history_id: number
}

export interface WorkHistorySearchCondition {
  startDate?: string
  endDate?: string
  userName?: string
  userId?: string
  groupSeq?: number
  partSeq?: number
  divisionSeq?: number
  sortType?: 'LATEST' | 'OLDEST'
}

export interface BulkCreateWorkHistoryReq {
  work_histories: CreateWorkHistoryReq[]
}

export interface BulkCreateWorkHistoryResp {
  work_history_ids: number[]
}

export interface UnregisteredWorkHistoryDownloadReq {
  year: number
  month: number
}

export type CodeType = 'LABEL' | 'OPTION'

export interface CreateWorkCodeReq {
  work_code: string
  work_code_name: string
  code_type: CodeType
  parent_work_code_id?: number
  order_seq?: number
}

export interface CreateWorkCodeResp {
  work_code_id: number
}

export interface UpdateWorkCodeReq {
  work_code_id: number
  work_code: string
  work_code_name: string
  parent_work_code_id?: number
  order_seq?: number
}

export type SystemType = 'SYSTEM1'

export interface ToggleSystemCheckReq {
  system_code: SystemType
}

export interface ToggleSystemCheckResp {
  checked: boolean
  message: string
}

export interface CheckSystemStatusResp {
  system_code: SystemType
  checked: boolean
}

export interface CheckSystemStatusBatchResp {
  statuses: CheckSystemStatusResp[]
}

export interface TodayWorkStatusResp {
  total_hours: number
  required_hours: number
  completed: boolean
}

export interface UnregisteredWorkDatesResp {
  unregistered_dates: string[]
  total_unregistered_days: number
}
