import { api, type ApiResponse } from '@/api/index'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/alert/toast';

const enum DuesQueryKey {
  GET_YEAR_DUES = 'getYearDues',
  GET_YEAR_OPERATION_DUES = 'getYearOperationDues',
  GET_MONTH_BIRTH_DUES = 'getMonthBirthDues',
  GET_USERS_MONTH_BIRTH_DUES = 'getUsersMonthBirthDues',
  POST_DUES = 'postDues',
  PUT_DUES = 'putDues',
  DELETE_DUES = 'deleteDues'
}

interface GetYearDuesReq {
  year: string
}

interface GetYearDuesResp {
  dues_seq: number
  dues_user_name: string
  dues_amount: number
  dues_type: 'OPERATION' | 'BIRTH' | 'FINE'
  dues_calc: 'PLUS' | 'MINUS'
  dues_date: string
  dues_detail: string
  total_dues: number
}

const useGetYearDues = (reqData: GetYearDuesReq) => {
  return useQuery({
    queryKey: [DuesQueryKey.GET_YEAR_DUES, reqData],
    queryFn: async (): Promise<GetYearDuesResp[]> => {
      const resp: ApiResponse<GetYearDuesResp[]> = await api.request({
        method: 'get',
        url: `/dues?year=${reqData.year}`
      });

      if (resp.code !== 200) throw new Error(resp.message);

      return resp.data;
    }
  });
}

interface GetYearOperationDuesReq {
  year: string
}

interface GetYearOperationDuesResp {
  total_dues: number
  total_deposit: number
  total_withdrawal: number
}

const useGetYearOperationDues = (reqData: GetYearOperationDuesReq) => {
  return useQuery({
    queryKey: [DuesQueryKey.GET_YEAR_OPERATION_DUES, reqData],
    queryFn: async (): Promise<GetYearOperationDuesResp> => {
      const resp: ApiResponse<GetYearOperationDuesResp> = await api.request({
        method: 'get',
        url: `/dues/operation?year=${reqData.year}`
      });

      if (resp.code !== 200) throw new Error(resp.message);

      return resp.data;
    }
  });
}

interface GetMonthBirthDuesReq {
  year: string
  month: string
}

interface GetMonthBirthDuesResp {
  birth_month_dues: number
}

const useGetMonthBirthDues = (reqData: GetMonthBirthDuesReq) => {
  return useQuery({
    queryKey: [DuesQueryKey.GET_MONTH_BIRTH_DUES, reqData],
    queryFn: async (): Promise<GetMonthBirthDuesResp> => {
      const resp: ApiResponse<GetMonthBirthDuesResp> = await api.request({
        method: 'get',
        url: `/dues/birth/month?year=${reqData.year}&month=${reqData.month}`
      });

      if (resp.code !== 200) throw new Error(resp.message);

      return resp.data;
    }
  });
}

interface GetUsersMonthBirthDuesReq {
  year: string
}

interface GetUsersMonthBirthDuesResp {
  dues_user_name: string
  month_birth_dues: Array<number>
}

const useGetUsersMonthBirthDues = (reqData: GetUsersMonthBirthDuesReq) => {
  return useQuery({
    queryKey: [DuesQueryKey.GET_USERS_MONTH_BIRTH_DUES, reqData],
    queryFn: async (): Promise<GetUsersMonthBirthDuesResp[]> => {
      const resp: ApiResponse<GetUsersMonthBirthDuesResp[]> = await api.request({
        method: 'get',
        url: `/dues/users/birth/month?year=${reqData.year}`
      });

      if (resp.code !== 200) throw new Error(resp.message);

      return resp.data;
    }
  });
}

interface PostDuesReq {
  dues_amount: number
  dues_type: 'OPERATION' | 'BIRTH' | 'FINE'
  dues_calc: 'PLUS' | 'MINUS'
  dues_date: string
  dues_detail: string
  dues_user_name: string
}

const usePostDues = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (d: PostDuesReq) => {
      const resp: ApiResponse = await api.request({
        method: 'post',
        url: `/dues`,
        data: d
      });

      if (resp.code !== 200) throw new Error(resp.message);

      return resp.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DuesQueryKey.GET_YEAR_DUES] });
      toast.success('회비가 등록되었습니다.');
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });
}

interface PutDuesReq {
  dues_seq: number
  dues_amount: number
  dues_type: 'OPERATION' | 'BIRTH' | 'FINE'
  dues_calc: 'PLUS' | 'MINUS'
  dues_date: string
  dues_detail: string
  dues_user_name: string
}

const usePutDues = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (d: PutDuesReq) => {
      const resp: ApiResponse = await api.request({
        method: 'put',
        url: `/dues/${d.dues_seq}`,
        data: d
      });

      if (resp.code !== 200) throw new Error(resp.message);

      return resp.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DuesQueryKey.GET_YEAR_DUES] });
      toast.success('회비가 수정되었습니다.');
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });
}

const useDeleteDues = () => {
  const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: async (dues_seq: number) => {
        const resp: ApiResponse = await api.request({
          method: 'delete',
          url: `/dues/${dues_seq}`
        });
  
        if (resp.code !== 200) throw new Error(resp.message);
  
        return resp.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [DuesQueryKey.GET_YEAR_DUES] });
        toast.success('회비가 삭제되었습니다.');
      },
      onError: (error) => {
        toast.error(error.message);
      }
    }); 
} 

export {
  // QueryKey
  DuesQueryKey,

  // API Hook
  useGetYearDues,
  useGetYearOperationDues,
  useGetMonthBirthDues,
  useGetUsersMonthBirthDues,
  usePostDues,
  usePutDues,
  useDeleteDues
}

export type {
  GetYearDuesResp,
  GetYearOperationDuesResp,
  GetMonthBirthDuesResp,
  GetUsersMonthBirthDuesResp,
}