export interface PermissionResp {
  code: string
  name: string
  desc: string
  resource: string
  action: string
}

export interface CreatePermissionReq {
  code: string
  name: string
  desc?: string
  resource: string
  action: string
}

export interface UpdatePermissionReq {
  name?: string
  desc?: string
  resource?: string
  action?: string
}
