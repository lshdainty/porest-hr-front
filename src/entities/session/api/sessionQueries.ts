'use client'

import { useQuery } from '@tanstack/react-query'

import { createQueryKeys } from '@/shared/api/queryKeys'
import { sessionApi } from '@/entities/session/api/sessionApi'
import type { GetLoginCheck } from '@/entities/session/model/types'

export const authKeys = createQueryKeys('auth')

// 로그인 상태 체크 훅 (JWT 토큰으로 사용자 정보 조회)
export const useLoginCheckQuery = (enabled: boolean = true) => {
  return useQuery<GetLoginCheck>({
    queryKey: authKeys.detail('login-check'),
    queryFn: () => sessionApi.getLoginCheck(),
    retry: false,
    enabled,
  })
}
