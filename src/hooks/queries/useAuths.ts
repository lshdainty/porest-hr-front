'use client'

import { useMutation, useQuery } from '@tanstack/react-query'

import { createQueryKeys } from '@/constants/query-keys'
import {
  fetchGetCheckUserIdDuplicate,
  fetchGetCsrfToken,
  fetchGetLoginCheck,
  fetchPostLogin,
  fetchPostLogout,
  fetchPostRegistrationComplete,
  fetchPostRegistrationValidate,
  type GetCheckUserIdDuplicateResp,
  type GetLoginCheck,
  type PostLoginResp,
  type PostRegistrationCompleteReq,
  type PostRegistrationCompleteResp,
  type PostRegistrationValidateReq,
  type PostRegistrationValidateResp
} from '@/lib/api/auth'

export const authKeys = createQueryKeys('auth')

// 로그인 상태 체크 훅
export const useLoginCheckQuery = (enabled: boolean = true) => {
  return useQuery<GetLoginCheck>({
    queryKey: authKeys.detail('login-check'),
    queryFn: () => fetchGetLoginCheck(),
    retry: false,
    enabled, // 로그인/회원가입 페이지에서는 호출하지 않음
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

// CSRF 토큰 조회 훅
export const useCsrfTokenQuery = (enabled: boolean = true) => {
  return useQuery<null>({
    queryKey: authKeys.detail('csrf-token'),
    queryFn: () => fetchGetCsrfToken(),
    enabled,
  })
}

// ID/PW 회원가입 - 1단계: 초대 확인 Mutation 훅
export const usePostRegistrationValidateMutation = () => {
  return useMutation<PostRegistrationValidateResp, Error, PostRegistrationValidateReq>({
    mutationFn: (data: PostRegistrationValidateReq) =>
      fetchPostRegistrationValidate(data)
  })
}

// ID/PW 회원가입 - 2단계: 회원가입 완료 Mutation 훅
export const usePostRegistrationCompleteMutation = () => {
  return useMutation<PostRegistrationCompleteResp, Error, PostRegistrationCompleteReq>({
    mutationFn: (data: PostRegistrationCompleteReq) =>
      fetchPostRegistrationComplete(data)
  })
}

// ID 중복 확인 Mutation 훅
export const useCheckUserIdDuplicateMutation = () => {
  return useMutation<GetCheckUserIdDuplicateResp, Error, string>({
    mutationFn: (userId: string) =>
      fetchGetCheckUserIdDuplicate(userId)
  })
}
