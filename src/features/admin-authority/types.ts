export interface Authority {
  code: string;
  name: string;
  desc: string;
  resource: string;
  action: string;
}

export interface Role {
  role_code: string;
  role_name: string;
  desc: string;
  permissions: Authority[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role_codes: string[];
  department?: string;
  position?: string;
}
