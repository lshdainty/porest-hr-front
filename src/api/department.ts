import { CompanyQueryKey } from '@/api/company';
import { api, type ApiResponse } from '@/api/index';
import { toast } from '@/components/alert/toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const enum DepartmentQueryKey {
  POST_DEPARTMENT = 'postDepartment',
  PUT_DEPARTMENT = 'putDepartment',
  DELETE_DEPARTMENT = 'deleteDepartment',
  GET_DEPARTMENT = 'getDepartment',
  GET_DEPARTMENT_WITH_CHILDREN = 'getDepartmentWithChildren',
  GET_DEPARTMENT_USERS = 'getDepartmentUsers',
  POST_DEPARTMENT_USER = 'postDepartmentUser',
  DELETE_DEPARTMENT_USER = 'deleteDepartmentUser',
  CHECK_USER_MAIN_DEPARTMENT = 'checkUserMainDepartment'
}

interface PostDepartmentReq {
  department_name: string
  department_name_kr: string
  parent_id?: number | null
  head_user_id?: string
  tree_level?: number
  department_desc?: string
  color_code?:string
  company_id?: string
}

interface PostDepartmentResp {
  department_id: number
}

const usePostDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (d: PostDepartmentReq): Promise<PostDepartmentResp> => {
      const resp: ApiResponse<PostDepartmentResp> = await api.request({
        method: 'post',
        url: `/departments`,
        data: d
      });

      if (resp.code !== 200) throw new Error(resp.message);

      return resp.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DepartmentQueryKey.GET_DEPARTMENT] });
      queryClient.invalidateQueries({ queryKey: [DepartmentQueryKey.GET_DEPARTMENT_WITH_CHILDREN] });
      queryClient.invalidateQueries({ queryKey: [CompanyQueryKey.GET_COMPANY_WITH_DEPARTMENTS] });
      toast.success('부서가 등록되었습니다.');
    },
    onError: (error) => {
      console.error('Department creation failed:', error);
    }
  });
}

interface PutDepartmentReq {
  department_name?: string
  department_name_kr?: string
  parent_id?: number | null
  head_user_id?: string
  tree_level?: number
  department_desc?: string
  color_code?:string
  company_id?: string
}

const usePutDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ departmentId, data }: { departmentId: number;  data: PutDepartmentReq }): Promise<void> => {
      await api.request({
        method: 'put',
        url: `/departments/${departmentId}`,
        data: data
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DepartmentQueryKey.GET_DEPARTMENT] });
      queryClient.invalidateQueries({ queryKey: [DepartmentQueryKey.GET_DEPARTMENT_WITH_CHILDREN] });
      queryClient.invalidateQueries({ queryKey: [CompanyQueryKey.GET_COMPANY_WITH_DEPARTMENTS] });
      toast.success('부서 정보가 수정되었습니다.');
    },
    onError: (error) => {
      console.error('Department update failed:', error);
    }
  });
}

const useDeleteDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (departmentId: number): Promise<void> => {
      await api.request({
        method: 'delete',
        url: `/departments/${departmentId}`
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DepartmentQueryKey.GET_DEPARTMENT] });
      queryClient.invalidateQueries({ queryKey: [DepartmentQueryKey.GET_DEPARTMENT_WITH_CHILDREN] });
      queryClient.invalidateQueries({ queryKey: [CompanyQueryKey.GET_COMPANY_WITH_DEPARTMENTS] });
      toast.success('부서가 삭제되었습니다.');
    },
    onError: (error) => {
      console.error('Department deletion failed:', error);
    }
  });
}

interface GetDepartmentResp {
  department_id: number
  department_name: string
  department_name_kr: string
  parent_id: number
  head_user_id: string
  tree_level: number
  department_desc: string
  color_code:string
  company_id: string
}

const useGetDepartment = (departmentId: number) => {
  return useQuery({
    queryKey: [DepartmentQueryKey.GET_DEPARTMENT, departmentId],
    queryFn: async (): Promise<GetDepartmentResp> => {
      const resp: ApiResponse<GetDepartmentResp> = await api.request({
        method: 'get',
        url: `/departments/${departmentId}`
      });

      if (resp.code !== 200) throw new Error(resp.message);

      return resp.data;
    },
    enabled: !!departmentId
  });
};

interface GetDepartmentWithChildrenResp {
  department_id: number
  department_name: string
  department_name_kr: string
  parent_id: number
  head_user_id: string
  tree_level: number
  department_desc: string
  color_code:string
  company_id: string
  children: GetDepartmentWithChildrenResp[]
}

const useGetDepartmentWithChildren = (departmentId: number) => {
  return useQuery({
    queryKey: [DepartmentQueryKey.GET_DEPARTMENT_WITH_CHILDREN, departmentId],
    queryFn: async (): Promise<GetDepartmentWithChildrenResp> => {
      const resp: ApiResponse<GetDepartmentWithChildrenResp> = await api.request({
        method: 'get',
        url: `/departments/${departmentId}/children`
      });

      if (resp.code !== 200) throw new Error(resp.message);

      return resp.data;
    },
    enabled: !!departmentId
  });
};

interface UserInfo {
  user_id: string
  user_name: string
  main_yn: 'Y' | 'N'
}

interface GetDepartmentUsersResp {
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

const useGetDepartmentUsers = (departmentId: number) => {
  return useQuery({
    queryKey: [DepartmentQueryKey.GET_DEPARTMENT_USERS, departmentId],
    queryFn: async (): Promise<GetDepartmentUsersResp> => {
      const resp: ApiResponse<GetDepartmentUsersResp> = await api.request({
        method: 'get',
        url: `/departments/${departmentId}/users`
      });

      if (resp.code !== 200) throw new Error(resp.message);

      return resp.data;
    },
    enabled: !!departmentId
  });
};

interface UserDepartmentInfo {
  user_id: string
  main_yn: 'Y' | 'N'
}

interface PostDepartmentUsersReq {
  users: UserDepartmentInfo[]
}

interface PostDepartmentUsersResp {
  user_department_ids: number[]
}

const usePostDepartmentUsers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ departmentId, data }: { departmentId: number; data: PostDepartmentUsersReq }): Promise<PostDepartmentUsersResp> => {
      const resp: ApiResponse<PostDepartmentUsersResp> = await api.request({
        method: 'post',
        url: `/departments/${departmentId}/users`,
        data: data
      });

      if (resp.code !== 200) throw new Error(resp.message);

      return resp.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DepartmentQueryKey.GET_DEPARTMENT] });
      queryClient.invalidateQueries({ queryKey: [DepartmentQueryKey.GET_DEPARTMENT_WITH_CHILDREN] });
      queryClient.invalidateQueries({ queryKey: [CompanyQueryKey.GET_COMPANY_WITH_DEPARTMENTS] });
      queryClient.invalidateQueries({ queryKey: [DepartmentQueryKey.GET_DEPARTMENT_USERS] });
      toast.success('부서에 사용자가 추가되었습니다.');
    },
    onError: (error) => {
      console.error('Department user registration failed:', error);
    }
  });
};

interface DeleteDepartmentUsersReq {
  user_ids: string[]
}

const useDeleteDepartmentUsers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ departmentId, data }: { departmentId: number; data: DeleteDepartmentUsersReq }): Promise<void> => {
      await api.request({
        method: 'delete',
        url: `/departments/${departmentId}/users`,
        data: data
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DepartmentQueryKey.GET_DEPARTMENT] });
      queryClient.invalidateQueries({ queryKey: [DepartmentQueryKey.GET_DEPARTMENT_WITH_CHILDREN] });
      queryClient.invalidateQueries({ queryKey: [CompanyQueryKey.GET_COMPANY_WITH_DEPARTMENTS] });
      queryClient.invalidateQueries({ queryKey: [DepartmentQueryKey.GET_DEPARTMENT_USERS] });
      toast.success('부서에서 사용자가 삭제되었습니다.');
    },
    onError: (error) => {
      console.error('Department user deletion failed:', error);
    }
  });
};

interface CheckUserMainDepartmentResp {
  has_main_department: 'Y' | 'N'
}

const useCheckUserMainDepartment = (userId: string) => {
  return useQuery({
    queryKey: [DepartmentQueryKey.CHECK_USER_MAIN_DEPARTMENT, userId],
    queryFn: async (): Promise<CheckUserMainDepartmentResp> => {
      const resp: ApiResponse<CheckUserMainDepartmentResp> = await api.request({
        method: 'get',
        url: `/users/${userId}/main-department/existence`
      });

      if (resp.code !== 200) throw new Error(resp.message);

      return resp.data;
    },
    enabled: !!userId
  });
};

export {
  // QueryKey
  DepartmentQueryKey,
  // API Hook
  useCheckUserMainDepartment, useDeleteDepartment, useDeleteDepartmentUsers, useGetDepartment, useGetDepartmentUsers, useGetDepartmentWithChildren, usePostDepartment, usePostDepartmentUsers, usePutDepartment
};

  export type {
    CheckUserMainDepartmentResp, DeleteDepartmentUsersReq, GetDepartmentResp, GetDepartmentUsersResp, GetDepartmentWithChildrenResp,
    // Interface
    PostDepartmentReq,
    PostDepartmentResp, PostDepartmentUsersReq,
    PostDepartmentUsersResp, PutDepartmentReq, UserDepartmentInfo, UserInfo
  };

