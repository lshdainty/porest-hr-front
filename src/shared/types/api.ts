/**
 * API 공통 응답 타입
 */
export interface ApiResponse<T = unknown> {
  success: boolean
  code: string
  message: string
  data: T
}

/**
 * API 에러 응답 타입
 */
export interface ApiErrorResponse {
  success: boolean
  code: string
  message: string
  data: null
}
