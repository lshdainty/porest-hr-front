export type NoticeType = 'GENERAL' | 'URGENT' | 'EVENT' | 'MAINTENANCE'
export type YNType = 'Y' | 'N'

export interface CreateNoticeReq {
  writer_id: string
  title: string
  content: string
  notice_type?: NoticeType
  is_pinned?: YNType
  start_date?: string
  end_date?: string
}

export interface UpdateNoticeReq {
  title?: string
  content?: string
  notice_type?: NoticeType
  is_pinned?: YNType
  start_date?: string
  end_date?: string
}

export interface CreateNoticeResp {
  notice_id: number
}

export interface NoticeResp {
  notice_id: number
  writer_id: string
  writer_name: string
  title: string
  content: string
  notice_type: NoticeType
  notice_type_name: string
  is_pinned: YNType
  view_count: number
  start_date: string
  end_date: string
  create_date: string
  modify_date: string
}

export interface NoticeListResp {
  notice_id: number
  writer_id: string
  writer_name: string
  title: string
  notice_type: NoticeType
  notice_type_name: string
  is_pinned: YNType
  view_count: number
  start_date: string
  end_date: string
  create_date: string
}

export interface NoticePageResp {
  content: NoticeListResp[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  first: boolean
  last: boolean
}
