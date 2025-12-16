'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { createQueryKeys } from '@/constants/query-keys'
import {
  fetchDeleteUser,
  fetchGetUser,
  fetchGetUserApprovers,
  fetchGetUserIdDuplicate,
  fetchGetUsers,
  fetchPostResendInvitation,
  fetchPostUploadProfile,
  fetchPostUser,
  fetchPostUserInvite,
  fetchPutInvitedUser,
  fetchPutUser,
  fetchResetPassword,
  fetchUpdateDashboard,
  type GetUserApproversResp,
  type GetUserIdDuplicateResp,
  type GetUserResp,
  type GetUsersResp,
  type PostUserInviteReq,
  type PostUserInviteResp,
  type PostUserReq,
  type PutInvitedUserReq,
  type PutInvitedUserResp,
  type PutUserReq,
  type ResetPasswordReq,
  type UpdateDashboardReq,
  type UpdateDashboardResp
} from '@/lib/api/user'

const userKeys = createQueryKeys('users')

// 사용자 상세 조회 훅
export const useUserQuery = (userId: string) => {
  return useQuery<GetUserResp>({
    queryKey: userKeys.detail(userId),
    queryFn: () => fetchGetUser(userId),
    enabled: !!userId // userId가 있을 때만 실행
  })
}

// 사용자 목록 조회 훅
export const useUsersQuery = () => {
  return useQuery<GetUsersResp[]>({
    queryKey: userKeys.lists(),
    queryFn: () => fetchGetUsers()
  })
}

// 사용자 결재자 조회 훅
export const useUserApproversQuery = (userId: string) => {
  return useQuery<GetUserApproversResp>({
    queryKey: userKeys.list({ type: 'approvers', userId }),
    queryFn: () => fetchGetUserApprovers(userId),
    enabled: !!userId // userId가 있을 때만 실행
  })
}

// 사용자 ID 중복 체크 훅
export const useUserIdDuplicateQuery = (userId: string) => {
  return useQuery<GetUserIdDuplicateResp>({
    queryKey: userKeys.list({ type: 'duplicate', userId }),
    queryFn: () => fetchGetUserIdDuplicate(userId),
    enabled: !!userId // userId가 있을 때만 실행
  })
}

// 사용자 생성 Mutation 훅
export const usePostUserMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<any, Error, PostUserReq>({
    mutationFn: (data: PostUserReq) => fetchPostUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
    }
  })
}

// 사용자 수정 Mutation 훅
export const usePutUserMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<any, Error, PutUserReq>({
    mutationFn: (data: PutUserReq) => fetchPutUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
    }
  })
}

// 사용자 삭제 Mutation 훅
export const useDeleteUserMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<any, Error, string>({
    mutationFn: (userId: string) => fetchDeleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
    }
  })
}

// 초대된 사용자 수정 Mutation 훅
export const usePutInvitedUserMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<PutInvitedUserResp, Error, PutInvitedUserReq>({
    mutationFn: (data: PutInvitedUserReq) => fetchPutInvitedUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
    }
  })
}

// 사용자 초대 Mutation 훅
export const usePostUserInviteMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<PostUserInviteResp, Error, PostUserInviteReq>({
    mutationFn: (data: PostUserInviteReq) => fetchPostUserInvite(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
    }
  })
}

// 프로필 업로드 Mutation 훅 (invalidation 없음 - 기존 API와 동일)
export const usePostUploadProfileMutation = () => {
  return useMutation<any, Error, File>({
    mutationFn: (file: File) => fetchPostUploadProfile(file)
  })
}

// 초대 재발송 Mutation 훅
export const usePostResendInvitationMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<any, Error, string>({
    mutationFn: (userId: string) => fetchPostResendInvitation(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
    }
  })
}
// 대시보드 수정 Mutation 훅
export const useUpdateDashboardMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<UpdateDashboardResp, Error, { userId: string, data: UpdateDashboardReq }>({
    mutationFn: ({ userId, data }) => fetchUpdateDashboard(userId, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(data.user_id) })
    }
  })
}

// 비밀번호 초기화 Mutation 훅
export const useResetPasswordMutation = () => {
  return useMutation<void, Error, ResetPasswordReq>({
    mutationFn: (data: ResetPasswordReq) => fetchResetPassword(data)
  })
}
