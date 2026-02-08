// Company Types

export interface PostCompanyReq {
  company_id: string
  company_name: string
  company_desc: string
}

export interface PostCompanyResp {
  company_id: string
}

export interface GetCompanyResp {
  company_id: string
  company_name: string
  company_desc: string
}

export interface PutCompanyReq {
  company_name?: string
  company_desc?: string
}

export interface GetCompanyWithDepartmentsReq {
  company_id: string
}

export interface GetCompanyWithDepartmentResp {
  company_id: string
  company_name: string
  company_desc: string
  departments: Array<GetCompanyWithDepartment>
}

export interface GetCompanyWithDepartment {
  department_id: number
  department_name: string
  department_name_kr: string
  parent_id: number
  head_user_id: string
  tree_level: number
  department_desc: string
  color_code: string
  children: Array<GetCompanyWithDepartment>
}
