// Types
export type {
  CreateNoticeReq,
  CreateNoticeResp,
  NoticeListResp,
  NoticePageResp,
  NoticeResp,
  NoticeType,
  UpdateNoticeReq,
  YNType,
} from '@/entities/notice/model/types'

// API
export { noticeApi } from '@/entities/notice/api/noticeApi'

// Queries
export {
  useActiveNoticesQuery,
  useCreateNoticeMutation,
  useDeleteNoticeMutation,
  useNoticeQuery,
  useNoticesByTypeQuery,
  useNoticesQuery,
  usePinnedNoticesQuery,
  useSearchNoticesQuery,
  useUpdateNoticeMutation,
} from '@/entities/notice/api/noticeQueries'
