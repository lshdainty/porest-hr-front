export interface GetHolidaysReq {
  start_date: string
  end_date: string
  country_code: string
}

export interface GetHolidaysResp {
  holiday_id: number
  holiday_name: string
  holiday_date: string
  holiday_type: string
  holiday_icon: string
  country_code: string
  lunar_yn: string
  lunar_date: string
  is_recurring: string
}

export interface PostHolidayReq {
  holiday_name: string
  holiday_date: string
  holiday_type: string
  holiday_icon: string
  country_code: string
  lunar_yn: string
  lunar_date: string
  is_recurring: string
}

export interface PutHolidayReq {
  holiday_id: number
  holiday_name: string
  holiday_date: string
  holiday_type: string
  holiday_icon: string
  country_code: string
  lunar_yn: string
  lunar_date: string
  is_recurring: string
}

export interface GetRecurringHolidaysPreviewResp {
  holiday_name: string
  holiday_date: string
  holiday_type: string
  holiday_icon: string
  country_code: string
  lunar_yn: string
  lunar_date: string
  is_recurring: string
}

export interface BulkSaveHolidayItem {
  holiday_name: string
  holiday_date: string
  holiday_type: string
  holiday_icon: string
  country_code: string
  lunar_yn: string
  lunar_date: string
  is_recurring: string
}

export interface PostBulkHolidaysReq {
  holidays: BulkSaveHolidayItem[]
}

export interface PostBulkHolidaysResp {
  saved_count: number
}
