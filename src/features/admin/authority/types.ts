export interface Authority {
  id: string;
  code: string;
  name: string;
  group: string;
  description?: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  authorityIds: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  roleIds: string[];
  department?: string;
  position?: string;
}
