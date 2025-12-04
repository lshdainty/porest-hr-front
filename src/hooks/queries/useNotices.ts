'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { createQueryKeys } from '@/constants/query-keys'
import {
  fetchCreateNotice,
  fetchDeleteNotice,
  fetchGetActiveNotices,
  fetchGetNotice,
  fetchGetNotices,
  fetchGetNoticesByType,
  fetchGetPinnedNotices,
  fetchSearchNotices,
  fetchUpdateNotice,
  type CreateNoticeReq,
  type NoticePageResp,
  type NoticeResp,
  type NoticeType,
  type UpdateNoticeReq
} from '@/lib/api/notice'

const noticeKeys = createQueryKeys('notices')

// 공지사항 목록 조회 훅
export const useNoticesQuery = (page: number = 0, size: number = 10) => {
  return useQuery<NoticePageResp>({
    queryKey: noticeKeys.list({ page, size }),
    queryFn: () => fetchGetNotices(page, size)
  })
}

// 공지사항 상세 조회 훅
export const useNoticeQuery = (noticeId: number | null) => {
  return useQuery<NoticeResp>({
    queryKey: noticeKeys.detail(noticeId ?? 0),
    queryFn: () => fetchGetNotice(noticeId!),
    enabled: noticeId !== null && noticeId > 0
  })
}

// 공지사항 유형별 조회 훅
export const useNoticesByTypeQuery = (type: NoticeType, page: number = 0, size: number = 10) => {
  return useQuery<NoticePageResp>({
    queryKey: noticeKeys.list({ type, page, size }),
    queryFn: () => fetchGetNoticesByType(type, page, size),
    enabled: !!type
  })
}

// 공지사항 키워드 검색 훅
export const useSearchNoticesQuery = (keyword: string, page: number = 0, size: number = 10) => {
  return useQuery<NoticePageResp>({
    queryKey: noticeKeys.list({ keyword, page, size }),
    queryFn: () => fetchSearchNotices(keyword, page, size),
    enabled: keyword.length > 0
  })
}

// 활성 공지사항 조회 훅
export const useActiveNoticesQuery = (page: number = 0, size: number = 10) => {
  return useQuery<NoticePageResp>({
    queryKey: noticeKeys.list({ active: true, page, size }),
    queryFn: () => fetchGetActiveNotices(page, size)
  })
}

// 고정 공지사항 조회 훅
export const usePinnedNoticesQuery = (page: number = 0, size: number = 10) => {
  return useQuery<NoticePageResp>({
    queryKey: noticeKeys.list({ pinned: true, page, size }),
    queryFn: () => fetchGetPinnedNotices(page, size)
  })
}

// 공지사항 생성 Mutation 훅
export const useCreateNoticeMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<{ notice_id: number }, Error, CreateNoticeReq>({
    mutationFn: (data: CreateNoticeReq) => fetchCreateNotice(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noticeKeys.lists() })
    }
  })
}

// 공지사항 수정 Mutation 훅
export const useUpdateNoticeMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<void, Error, { noticeId: number; data: UpdateNoticeReq }>({
    mutationFn: ({ noticeId, data }) => fetchUpdateNotice(noticeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noticeKeys.all() })
    }
  })
}

// 공지사항 삭제 Mutation 훅
export const useDeleteNoticeMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<void, Error, number>({
    mutationFn: (noticeId: number) => fetchDeleteNotice(noticeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noticeKeys.lists() })
    }
  })
}
