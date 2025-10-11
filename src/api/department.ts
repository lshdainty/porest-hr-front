import { api, type ApiResponse } from '@/api/index'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/alert/toast';
import { CompanyQueryKey } from '@/api/company';

const enum DepartmentQueryKey {
  POST_DEPARTMENT = 'postDepartment',
  PUT_DEPARTMENT = 'putDepartment',
  DELETE_DEPARTMENT = 'deleteDepartment',
  GET_DEPARTMENT = 'getDepartment',
  GET_DEPARTMENT_WITH_CHILDREN = 'getDepartmentWithChildren'
}

interface PostDepartmentReq {
  department_name: string
  department_name_kr: string
  parent_id?: number | null
  head_user_id?: string
  tree_level?: number
  department_desc?: string
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
        url: `/department`,
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
  company_id?: string
}

const usePutDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ departmentId, data }: { departmentId: number;  data: PutDepartmentReq }): Promise<void> => {
      await api.request({
        method: 'put',
        url: `/department/${departmentId}`,
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
        url: `/department/${departmentId}`
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
  parent_id?: number
  head_user_id?: string
  tree_level: number
  department_desc?: string
  company_id?: string
}

const useGetDepartment = (departmentId: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: [DepartmentQueryKey.GET_DEPARTMENT, departmentId],
    queryFn: async (): Promise<GetDepartmentResp> => {
      const resp: ApiResponse<GetDepartmentResp> = await api.request({
        method: 'get',
        url: `/department/${departmentId}`
      });

      if (resp.code !== 200) throw new Error(resp.message);

      return resp.data;
    },
    enabled: enabled && !!departmentId
  });
};

interface GetDepartmentWithChildrenResp {
  department_id: number
  department_name: string
  department_name_kr: string
  parent_id?: number
  head_user_id?: string
  tree_level: number
  department_desc?: string
  company_id?: string
  children?: GetDepartmentWithChildrenResp[]
}

const useGetDepartmentWithChildren = (departmentId: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: [DepartmentQueryKey.GET_DEPARTMENT_WITH_CHILDREN, departmentId],
    queryFn: async (): Promise<GetDepartmentWithChildrenResp> => {
      const resp: ApiResponse<GetDepartmentWithChildrenResp> = await api.request({
        method: 'get',
        url: `/department/${departmentId}/children`
      });

      if (resp.code !== 200) throw new Error(resp.message);

      return resp.data;
    },
    enabled: enabled && !!departmentId
  });
};

export {
  // QueryKey
  DepartmentQueryKey,

  // API Hook
  usePostDepartment,
  usePutDepartment,
  useDeleteDepartment,
  useGetDepartment,
  useGetDepartmentWithChildren
}

export type {
  // Interface
  PostDepartmentReq,
  PostDepartmentResp,
  PutDepartmentReq,
  GetDepartmentResp,
  GetDepartmentWithChildrenResp
}
