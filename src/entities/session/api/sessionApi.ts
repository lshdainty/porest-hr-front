import { apiClient } from '@/shared/api'
import type { ApiResponse } from '@/shared/types/api'
import type { GetLoginCheck, TokenExchangeResponse } from '@/entities/session/model/types'

export const sessionApi = {
  /**
   * SSO 토큰을 HR 토큰으로 교환
   * SSO에서 발급한 JWT를 HR 서비스용 JWT로 교환합니다.
   */
  exchangeToken: async (ssoToken: string): Promise<TokenExchangeResponse> => {
    const resp: ApiResponse<TokenExchangeResponse> = await apiClient.request({
      method: 'post',
      url: `/auth/exchange`,
      data: { ssoToken }
    })

    if (!resp.success) throw new Error(resp.message)

    return resp.data
  },

  /**
   * 로그인 사용자 정보 조회 (JWT 토큰 기반)
   * JWT 토큰을 Authorization 헤더로 전송하여 사용자 정보를 조회합니다.
   */
  getLoginCheck: async (): Promise<GetLoginCheck> => {
    const resp: ApiResponse<GetLoginCheck> = await apiClient.request({
      method: 'get',
      url: `/login/check`
    })

    if (!resp.success) throw new Error(resp.message)

    return resp.data
  },
}
