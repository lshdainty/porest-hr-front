'use client'

import { useMutation, useQuery } from '@tanstack/react-query'

import { createQueryKeys } from '@/constants/query-keys'
import {
  fetchGetLoginCheck,
  fetchGetValidateInvitationToken,
  fetchPostLogin,
  fetchPostLogout,
  fetchPostCompleteSignup,
  type GetLoginCheck,
  type GetValidateInvitationTokenResp,
  type PostLoginResp,
  type PostCompleteSignupReq,
  type PostCompleteSignupResp
} from '@/lib/api/auth'

export const authKeys = createQueryKeys('auth')

// 로그인 상태 체크 훅
export const useLoginCheckQuery = () => {
  return useQuery<GetLoginCheck>({
    queryKey: authKeys.detail('login-check'),
    queryFn: () => fetchGetLoginCheck()
  })
}

// 초대 토큰 검증 훅
export const useValidateInvitationTokenQuery = (token: string) => {
  return useQuery<GetValidateInvitationTokenResp>({
    queryKey: authKeys.detail(token),
    queryFn: () => fetchGetValidateInvitationToken(token),
    enabled: !!token // token이 있을 때만 실행
  })
}

// 로그인 Mutation 훅
export const usePostLoginMutation = () => {
  return useMutation<PostLoginResp, Error, FormData>({
    mutationFn: (formData: FormData) => fetchPostLogin(formData)
  })
}

// 로그아웃 Mutation 훅
export const usePostLogoutMutation = () => {
  return useMutation<void, Error>({
    mutationFn: () => fetchPostLogout()
  })
}

// 회원가입 완료 Mutation 훅
export const usePostCompleteSignupMutation = () => {
  return useMutation<PostCompleteSignupResp, Error, PostCompleteSignupReq>({
    mutationFn: (data: PostCompleteSignupReq) => fetchPostCompleteSignup(data)
  })
}
