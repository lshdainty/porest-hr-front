// Types
export type {
  GetVacationPolicyReq,
  GetVacationPolicyResp,
  GetVacationPoliciesResp,
  PostVacationPolicyReq,
  PostVacationPolicyResp,
  DeleteVacationPolicyResp,
  PostAssignVacationPoliciesToUserReq,
  PostAssignVacationPoliciesToUserResp,
  GetUserVacationPoliciesReq,
  GetUserVacationPoliciesResp,
  GetUserAssignedVacationPoliciesReq,
  GetUserAssignedVacationPoliciesResp,
  VacationPolicyAssignmentInfo,
  GetUserVacationPolicyAssignmentStatusReq,
  GetUserVacationPolicyAssignmentStatusResp,
  DeleteRevokeVacationPolicyFromUserReq,
  DeleteRevokeVacationPolicyFromUserResp,
  DeleteRevokeVacationPoliciesFromUserReq,
  DeleteRevokeVacationPoliciesFromUserResp,
} from '@/entities/vacation-policy/model/types'

// API
export { vacationPolicyApi } from '@/entities/vacation-policy/api/vacationPolicyApi'

// Query keys & hooks
export {
  vacationPolicyKeys,
  useVacationPolicyQuery,
  useVacationPoliciesQuery,
  useUserVacationPoliciesQuery,
  useUserAssignedVacationPoliciesQuery,
  useUserVacationPolicyAssignmentStatusQuery,
  usePostVacationPolicyMutation,
  useDeleteVacationPolicyMutation,
  usePostAssignVacationPoliciesToUserMutation,
  useDeleteRevokeVacationPolicyFromUserMutation,
  useDeleteRevokeVacationPoliciesFromUserMutation,
} from '@/entities/vacation-policy/api/vacationPolicyQueries'
