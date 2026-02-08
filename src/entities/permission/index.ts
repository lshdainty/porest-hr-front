// Types
export type {
  CreatePermissionReq,
  PermissionResp,
  UpdatePermissionReq,
} from '@/entities/permission/model/types'

// API
export { permissionApi } from '@/entities/permission/api/permissionApi'

// Queries
export {
  useDeletePermissionMutation,
  useMyPermissionsQuery,
  usePermissionQuery,
  usePermissionsByResourceQuery,
  usePermissionsQuery,
  usePostPermissionMutation,
  usePutPermissionMutation,
} from '@/entities/permission/api/permissionQueries'
