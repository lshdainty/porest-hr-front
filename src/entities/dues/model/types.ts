export interface GetYearDuesReq {
  year: number
}

export interface GetYearDuesResp {
  dues_id: number
  dues_user_name: string
  dues_amount: number
  dues_type: 'OPERATION' | 'BIRTH' | 'FINE'
  dues_calc: 'PLUS' | 'MINUS'
  dues_date: string
  dues_detail: string
  total_dues: number
}

export interface GetYearOperationDuesReq {
  year: number
}

export interface GetYearOperationDuesResp {
  total_dues: number
  total_deposit: number
  total_withdrawal: number
}

export interface GetMonthBirthDuesReq {
  year: number
  month: number
}

export interface GetMonthBirthDuesResp {
  birth_month_dues: number
}

export interface GetUsersMonthBirthDuesReq {
  year: number
}

export interface GetUsersMonthBirthDuesResp {
  dues_user_name: string
  month_birth_dues: Array<number>
}

export interface PostDuesReq {
  dues_amount: number
  dues_type: 'OPERATION' | 'BIRTH' | 'FINE'
  dues_calc: 'PLUS' | 'MINUS'
  dues_date: string
  dues_detail: string
  dues_user_name: string
}

export interface PutDuesReq {
  dues_id: number
  dues_amount: number
  dues_type: 'OPERATION' | 'BIRTH' | 'FINE'
  dues_calc: 'PLUS' | 'MINUS'
  dues_date: string
  dues_detail: string
  dues_user_name: string
}
