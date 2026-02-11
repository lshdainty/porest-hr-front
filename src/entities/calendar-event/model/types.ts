// Calendar Event entity types

export interface GetEventsByPeriodReq {
  start_date: string
  end_date: string
}

export interface GetEventsByPeriodResp {
  user_id: string
  user_name: string
  calendar_name: string
  calendar_type: string
  calendar_desc: string
  start_date: Date
  end_date: Date
  domain_type: string
  vacation_type: string
  calendar_id: number
}
