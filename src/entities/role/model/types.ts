export interface RoleResp {
  role_code: string
  role_name: string
  desc: string
  permissions: string[]
}

export interface CreateRoleReq {
  role_code: string
  role_name: string
  desc?: string
  permission_codes?: string[]
}

export interface UpdateRoleReq {
  desc?: string
  permission_codes?: string[]
}

export interface UpdateRolePermissionsReq {
  permission_codes: string[]
}

export interface RolePermissionReq {
  permission_code: string
}
