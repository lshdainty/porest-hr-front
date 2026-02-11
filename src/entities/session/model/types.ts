// Session (Auth) Types

export interface PermissionInfo {
  permission_code: string
  permission_name: string
}

export interface RoleInfo {
  role_code: string
  role_name: string
  permissions: PermissionInfo[]
}

export interface GetLoginCheck {
  user_id: string
  user_name: string
  user_email: string
  roles: RoleInfo[]
  user_roles: string[]
  user_role_name: string | null
  permissions: string[]
  is_login: string
  profile_url?: string
  password_change_required?: string
}

// Token Exchange Types

export interface TokenExchangeRequest {
  ssoToken: string
}

export interface TokenExchangeUserInfo {
  userNo: number
  userId: string
  userName: string
  userEmail: string
  roles: string[]
  permissions: string[]
}

export interface TokenExchangeResponse {
  expiresIn: number
  user: TokenExchangeUserInfo
}
