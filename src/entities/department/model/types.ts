// Department Types

export interface PostDepartmentReq {
  department_name: string
  department_name_kr: string
  parent_id?: number | null
  head_user_id?: string
  tree_level?: number
  department_desc?: string
  color_code?: string
  company_id?: string
}

export interface PostDepartmentResp {
  department_id: number
}

export interface PutDepartmentReq {
  department_name?: string
  department_name_kr?: string
  parent_id?: number | null
  head_user_id?: string
  tree_level?: number
  department_desc?: string
  color_code?: string
  company_id?: string
}

export interface GetDepartmentResp {
  department_id: number
  department_name: string
  department_name_kr: string
  parent_id: number
  head_user_id: string
  tree_level: number
  department_desc: string
  color_code: string
  company_id: string
}

export interface GetDepartmentWithChildrenResp {
  department_id: number
  department_name: string
  department_name_kr: string
  parent_id: number
  head_user_id: string
  tree_level: number
  department_desc: string
  color_code: string
  company_id: string
  children: GetDepartmentWithChildrenResp[]
}

export interface UserInfo {
  user_id: string
  user_name: string
  main_yn: 'Y' | 'N'
}

export interface GetDepartmentUsersResp {
  department_id: number
  department_name: string
  department_name_kr: string
  parent_id: number | null
  head_user_id: string | null
  tree_level: number
  department_desc: string | null
  color_code: string | null
  company_id: string
  users_in_department: UserInfo[]
  users_not_in_department: UserInfo[]
}

export interface UserDepartmentInfo {
  user_id: string
  main_yn: 'Y' | 'N'
}

export interface PostDepartmentUsersReq {
  users: UserDepartmentInfo[]
}

export interface PostDepartmentUsersResp {
  user_department_ids: number[]
}

export interface DeleteDepartmentUsersReq {
  user_ids: string[]
}

export interface CheckUserMainDepartmentResp {
  has_main_department: 'Y' | 'N'
}
