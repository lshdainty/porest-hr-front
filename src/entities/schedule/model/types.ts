// Schedule entity types

export interface PostScheduleReq {
  user_id: string
  start_date: string
  end_date: string
  schedule_type: string
  schedule_desc: string
}

export interface PutUpdateScheduleReq {
  schedule_id: number
  user_id: string
  start_date: string
  end_date: string
  schedule_type: string
  schedule_desc: string
}

export interface PutUpdateScheduleResp {
  schedule_id: number
}
