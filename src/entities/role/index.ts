// Types
export type {
  CreateRoleReq,
  RolePermissionReq,
  RoleResp,
  UpdateRolePermissionsReq,
  UpdateRoleReq,
} from '@/entities/role/model/types'

// API
export { roleApi } from '@/entities/role/api/roleApi'

// Queries
export {
  useDeleteRoleMutation,
  useDeleteRolePermissionMutation,
  usePostRoleMutation,
  usePostRolePermissionMutation,
  usePutRoleMutation,
  usePutRolePermissionsMutation,
  useRolePermissionsQuery,
  useRoleQuery,
  useRolesQuery,
} from '@/entities/role/api/roleQueries'
