import { api, type ApiResponse } from '@/api/index'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/alert/toast';

const enum CompanyQueryKey {
  POST_COMPANY = 'postCompany',
  GET_COMPANY = 'getCompany',
  PUT_COMPANY = 'putCompany',
  DELETE_COMPANY = 'deleteCompany',
  GET_COMPANY_WITH_DEPARTMENTS = 'getCompanyWithDepartments'
}

interface PostCompanyReq {
  company_id: string
  company_name: string
  company_desc: string
}

interface PostCompanyResp {
  company_id: string
}

const usePostCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (d: PostCompanyReq): Promise<PostCompanyResp> => {
      const resp: ApiResponse<PostCompanyResp> = await api.request({
        method: 'post',
        url: `/company`,
        data: d
      });

      return resp.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CompanyQueryKey.GET_COMPANY_WITH_DEPARTMENTS] });
      toast.success('회사가 등록되었습니다.');
    },
    onError: (error) => {
      console.error('Company creation failed:', error);
    }
  });
}

interface GetCompanyResp {
  company_id: string
  company_name: string
  company_desc: string
}

const useGetCompany = () => {
  return useQuery({
    queryKey: [CompanyQueryKey.GET_COMPANY],
    queryFn: async (): Promise<GetCompanyResp> => {
      const resp: ApiResponse<GetCompanyResp> = await api.request({
        method: 'get',
        url: `/company`
      });

      if (resp.code !== 200) throw new Error(resp.message);

      return resp.data;
    }
  });
};

interface PutCompanyReq {
  company_name?: string
  company_desc?: string
}

const usePutCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ companyId, data }: { companyId: string;  data: PutCompanyReq }): Promise<void> => {
      await api.request({
        method: 'put',
        url: `/company/${companyId}`,
        data: data
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CompanyQueryKey.GET_COMPANY_WITH_DEPARTMENTS] });
      toast.success('회사 정보가 수정되었습니다.');
    },
    onError: (error) => {
      console.error('Company update failed:', error);
    }
  });
}

const useDeleteCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (companyId: string): Promise<void> => {
      if (!companyId || companyId.trim() === '') {
        throw new Error('회사 ID가 필요합니다.');
      }

      await api.request({
        method: 'delete',
        url: `/company/${companyId}`
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CompanyQueryKey.GET_COMPANY_WITH_DEPARTMENTS] });
      toast.success('회사 정보가 삭제되었습니다.');
    },
    onError: (error) => {
      console.error('Company deletion failed:', error);
    }
  });
}

interface GetCompanyWithDepartmentsReq {
  company_id: string
}

interface GetCompanyWithDepartmentResp {
  company_id: string
  company_name: string
  company_desc: string
  departments: Array<GetCompanyWithDepartment>
}

interface GetCompanyWithDepartment {
  department_id: number
  department_name: string
  department_name_kr: string
  parent_id?: number
  head_user_id?: string
  tree_level: number
  department_desc?: string
  children?: Array<GetCompanyWithDepartment>
}

const useGetCompanyWithDepartments = (reqData: GetCompanyWithDepartmentsReq, enabled: boolean = true) => {
  return useQuery({
    queryKey: [CompanyQueryKey.GET_COMPANY_WITH_DEPARTMENTS, reqData.company_id],
    queryFn: async (): Promise<GetCompanyWithDepartmentResp> => {
      if (!reqData.company_id || reqData.company_id.trim() === '') {
        throw new Error('회사 ID가 필요합니다.');
      }

      const resp: ApiResponse<GetCompanyWithDepartmentResp> = await api.request({
        method: 'get',
        url: `/company/${reqData.company_id}/departments`
      });

      if (resp.code !== 200) throw new Error(resp.message);

      return resp.data;
    },
    enabled: enabled && !!reqData.company_id && reqData.company_id.trim() !== ''
  });
};

export {
  // QueryKey
  CompanyQueryKey,

  // API Hook
  usePostCompany,
  useGetCompany,
  usePutCompany,
  useDeleteCompany,
  useGetCompanyWithDepartments
}

export type {
  // Interface
  PostCompanyReq,
  PostCompanyResp,
  GetCompanyResp,
  PutCompanyReq,
  GetCompanyWithDepartmentsReq,
  GetCompanyWithDepartmentResp,
  GetCompanyWithDepartment
}
