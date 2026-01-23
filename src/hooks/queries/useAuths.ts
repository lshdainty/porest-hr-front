'use client'

import { useQuery } from '@tanstack/react-query'

import { createQueryKeys } from '@/constants/query-keys'
import {
  fetchGetLoginCheck,
  type GetLoginCheck
} from '@/lib/api/auth'

export const authKeys = createQueryKeys('auth')

// 로그인 상태 체크 훅 (JWT 토큰으로 사용자 정보 조회)
export const useLoginCheckQuery = (enabled: boolean = true) => {
  return useQuery<GetLoginCheck>({
    queryKey: authKeys.detail('login-check'),
    queryFn: () => fetchGetLoginCheck(),
    retry: false,
    enabled,
  })
}
