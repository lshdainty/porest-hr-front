import { api, type ApiResponse } from '@/lib/api';

// Notice Types
export type NoticeType = 'GENERAL' | 'URGENT' | 'EVENT' | 'MAINTENANCE';
export type YNType = 'Y' | 'N';

// Request Types
export interface CreateNoticeReq {
  writer_id: string;
  title: string;
  content: string;
  notice_type?: NoticeType;
  is_pinned?: YNType;
  start_date?: string;
  end_date?: string;
}

export interface UpdateNoticeReq {
  title?: string;
  content?: string;
  notice_type?: NoticeType;
  is_pinned?: YNType;
  start_date?: string;
  end_date?: string;
}

// Response Types
export interface CreateNoticeResp {
  notice_id: number;
}

export interface NoticeResp {
  notice_id: number;
  writer_id: string;
  writer_name: string;
  title: string;
  content: string;
  notice_type: NoticeType;
  notice_type_name: string;
  is_pinned: YNType;
  view_count: number;
  start_date: string;
  end_date: string;
  create_date: string;
  modify_date: string;
}

export interface NoticeListResp {
  notice_id: number;
  writer_id: string;
  writer_name: string;
  title: string;
  notice_type: NoticeType;
  notice_type_name: string;
  is_pinned: YNType;
  view_count: number;
  start_date: string;
  end_date: string;
  create_date: string;
}

export interface NoticePageResp {
  content: NoticeListResp[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

// API Functions

/**
 * 공지사항 등록
 */
export async function fetchCreateNotice(data: CreateNoticeReq): Promise<CreateNoticeResp> {
  const resp: ApiResponse<CreateNoticeResp> = await api.request({
    method: 'post',
    url: '/notice',
    data
  });

  if (!resp.success) throw new Error(resp.message);
  return resp.data;
}

/**
 * 공지사항 상세 조회 (조회수 증가)
 */
export async function fetchGetNotice(noticeId: number): Promise<NoticeResp> {
  const resp: ApiResponse<NoticeResp> = await api.request({
    method: 'get',
    url: `/notice/${noticeId}`
  });

  if (!resp.success) throw new Error(resp.message);
  return resp.data;
}

/**
 * 공지사항 목록 조회 (페이지네이션)
 */
export async function fetchGetNotices(page: number = 0, size: number = 10): Promise<NoticePageResp> {
  const resp: ApiResponse<NoticePageResp> = await api.request({
    method: 'get',
    url: `/notices?page=${page}&size=${size}`
  });

  if (!resp.success) throw new Error(resp.message);
  return resp.data;
}

/**
 * 공지사항 유형별 조회
 */
export async function fetchGetNoticesByType(type: NoticeType, page: number = 0, size: number = 10): Promise<NoticePageResp> {
  const resp: ApiResponse<NoticePageResp> = await api.request({
    method: 'get',
    url: `/notices/type/${type}?page=${page}&size=${size}`
  });

  if (!resp.success) throw new Error(resp.message);
  return resp.data;
}

/**
 * 공지사항 키워드 검색
 */
export async function fetchSearchNotices(keyword: string, page: number = 0, size: number = 10): Promise<NoticePageResp> {
  const resp: ApiResponse<NoticePageResp> = await api.request({
    method: 'get',
    url: `/notices/search?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${size}`
  });

  if (!resp.success) throw new Error(resp.message);
  return resp.data;
}

/**
 * 활성 공지사항 조회 (현재 노출 기간 내)
 */
export async function fetchGetActiveNotices(page: number = 0, size: number = 10): Promise<NoticePageResp> {
  const resp: ApiResponse<NoticePageResp> = await api.request({
    method: 'get',
    url: `/notices/active?page=${page}&size=${size}`
  });

  if (!resp.success) throw new Error(resp.message);
  return resp.data;
}

/**
 * 고정 공지사항 조회
 */
export async function fetchGetPinnedNotices(page: number = 0, size: number = 10): Promise<NoticePageResp> {
  const resp: ApiResponse<NoticePageResp> = await api.request({
    method: 'get',
    url: `/notices/pinned?page=${page}&size=${size}`
  });

  if (!resp.success) throw new Error(resp.message);
  return resp.data;
}

/**
 * 공지사항 수정
 */
export async function fetchUpdateNotice(noticeId: number, data: UpdateNoticeReq): Promise<void> {
  const resp: ApiResponse<void> = await api.request({
    method: 'put',
    url: `/notice/${noticeId}`,
    data
  });

  if (!resp.success) throw new Error(resp.message);
}

/**
 * 공지사항 삭제
 */
export async function fetchDeleteNotice(noticeId: number): Promise<void> {
  const resp: ApiResponse<void> = await api.request({
    method: 'delete',
    url: `/notice/${noticeId}`
  });

  if (!resp.success) throw new Error(resp.message);
}
