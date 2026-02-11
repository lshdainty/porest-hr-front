// Company Entity - Public API

// Types
export type {
  PostCompanyReq,
  PostCompanyResp,
  GetCompanyResp,
  PutCompanyReq,
  GetCompanyWithDepartmentsReq,
  GetCompanyWithDepartmentResp,
  GetCompanyWithDepartment,
} from '@/entities/company/model/types'

// API
export { companyApi } from '@/entities/company/api/companyApi'

// Queries
export {
  useCompanyQuery,
  useCompanyWithDepartmentsQuery,
  usePostCompanyMutation,
  usePutCompanyMutation,
  useDeleteCompanyMutation,
} from '@/entities/company/api/companyQueries'
