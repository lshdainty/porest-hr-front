'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { createQueryKeys } from '@/shared/api/queryKeys'
import { noticeApi } from '@/entities/notice/api/noticeApi'
import type {
  CreateNoticeReq,
  NoticePageResp,
  NoticeResp,
  NoticeType,
  UpdateNoticeReq,
} from '@/entities/notice/model/types'

const noticeKeys = createQueryKeys('notices')

// 공지사항 목록 조회 훅
export const useNoticesQuery = (page: number = 0, size: number = 10) => {
  return useQuery<NoticePageResp>({
    queryKey: noticeKeys.list({ page, size }),
    queryFn: () => noticeApi.getNotices(page, size)
  })
}

// 공지사항 상세 조회 훅
export const useNoticeQuery = (noticeId: number | null) => {
  return useQuery<NoticeResp>({
    queryKey: noticeKeys.detail(noticeId ?? 0),
    queryFn: () => noticeApi.getNotice(noticeId!),
    enabled: noticeId !== null && noticeId > 0
  })
}

// 공지사항 유형별 조회 훅
export const useNoticesByTypeQuery = (type: NoticeType, page: number = 0, size: number = 10) => {
  return useQuery<NoticePageResp>({
    queryKey: noticeKeys.list({ type, page, size }),
    queryFn: () => noticeApi.getNoticesByType(type, page, size),
    enabled: !!type
  })
}

// 공지사항 키워드 검색 훅
export const useSearchNoticesQuery = (keyword: string, page: number = 0, size: number = 10) => {
  return useQuery<NoticePageResp>({
    queryKey: noticeKeys.list({ keyword, page, size }),
    queryFn: () => noticeApi.searchNotices(keyword, page, size),
    enabled: keyword.length > 0
  })
}

// 활성 공지사항 조회 훅
export const useActiveNoticesQuery = (page: number = 0, size: number = 10) => {
  return useQuery<NoticePageResp>({
    queryKey: noticeKeys.list({ active: true, page, size }),
    queryFn: () => noticeApi.getActiveNotices(page, size)
  })
}

// 고정 공지사항 조회 훅
export const usePinnedNoticesQuery = (page: number = 0, size: number = 10) => {
  return useQuery<NoticePageResp>({
    queryKey: noticeKeys.list({ pinned: true, page, size }),
    queryFn: () => noticeApi.getPinnedNotices(page, size)
  })
}

// 공지사항 생성 Mutation 훅
export const useCreateNoticeMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<{ notice_id: number }, Error, CreateNoticeReq>({
    mutationFn: (data: CreateNoticeReq) => noticeApi.createNotice(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noticeKeys.lists() })
    }
  })
}

// 공지사항 수정 Mutation 훅
export const useUpdateNoticeMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<void, Error, { noticeId: number; data: UpdateNoticeReq }>({
    mutationFn: ({ noticeId, data }) => noticeApi.updateNotice(noticeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noticeKeys.all() })
    }
  })
}

// 공지사항 삭제 Mutation 훅
export const useDeleteNoticeMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<void, Error, number>({
    mutationFn: (noticeId: number) => noticeApi.deleteNotice(noticeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noticeKeys.lists() })
    }
  })
}
