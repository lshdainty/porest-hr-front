// User Entity - Public API

// Types
export type {
  RoleDetailResp,
  PermissionDetailResp,
  GetUserReq,
  GetUserResp,
  GetUsersResp,
  GetUserApproversReq,
  ApproverDetailResp,
  GetUserApproversResp,
  GetUserIdDuplicateReq,
  GetUserIdDuplicateResp,
  PostUserReq,
  PutUserReq,
  PutInvitedUserReq,
  PutInvitedUserResp,
  PostUserInviteReq,
  PostUserInviteResp,
  UpdateDashboardReq,
  UpdateDashboardResp,
  ResetPasswordReq,
  RequestPasswordResetReq,
  ChangePasswordReq,
} from '@/entities/user/model/types'

// API
export { userApi } from '@/entities/user/api/userApi'

// Queries
export {
  useUserQuery,
  useUsersQuery,
  useUserApproversQuery,
  useUserIdDuplicateQuery,
  usePostUserMutation,
  usePutUserMutation,
  useDeleteUserMutation,
  usePutInvitedUserMutation,
  usePostUserInviteMutation,
  usePostUploadProfileMutation,
  usePostResendInvitationMutation,
  useUpdateDashboardMutation,
  useResetPasswordMutation,
  useRequestPasswordResetMutation,
  useChangePasswordMutation,
} from '@/entities/user/api/userQueries'
