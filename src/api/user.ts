import { api } from '@/api/index'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/alert/toast';
import { useAuthStore } from '@/store/AuthStore';

interface ApiResponse<T = any> {
  code: number
  message: string
  count: string
  data: T
}

const enum UserQueryKey {
  GET_USER = 'getUser',
  GET_USERS = 'getUsers',
  GET_LOGIN_USER_INFO = 'getLoginUserInfo',
  GET_VALIDATE_INVITATION_TOKEN = 'getValidateInvitationToken',
  POST_USER = 'postUser',
  POST_USER_INVITE = 'postUserInvite',
  POST_RESEND_INVITATION = 'postResendInvitation',
  PUT_USER = 'putUser',
  DELETE_USER = 'deleteUser'
}

interface GetUserReq {
  user_id: string
}

interface GetUserResp {
  user_id: string
  user_name: string
  user_email: string
  user_birth: string
  user_work_time: string
  user_role_type: string
  user_role_name: string
  user_origin_company_type: string
  user_company_name: string
  lunar_yn: string
  profile_url: string
  invitation_token?: string
  invitation_sent_at?: string
  invitation_expires_at?: string
  invitation_status?: string
  registered_at?: string
}

interface LoginUserInfo {
  id: string
  name: string
  email: string
  role: string
}

const useGetUser = (reqData: GetUserReq) => {
  return useQuery({
    queryKey: [UserQueryKey.GET_USER, reqData.user_id],
    queryFn: async (): Promise<GetUserResp> => {
      const resp: ApiResponse = await api.request({
        method: 'get',
        url: `/user/${reqData.user_id}`
      });

      if (resp.code !== 200) throw new Error(resp.data.data.message);

      return resp.data;
    }
  });
};

interface GetUsersResp {
  user_id: string
  user_name: string
  user_email: string
  user_birth: string
  user_work_time: string
  user_role_type: string
  user_role_name: string
  user_origin_company_type: string
  user_company_name: string
  lunar_yn: string
  profile_url: string
  invitation_token?: string
  invitation_sent_at?: string
  invitation_expires_at?: string
  invitation_status?: string
  registered_at?: string
}

const useGetUsers = () => {
  return useQuery({
    queryKey: [UserQueryKey.GET_USERS],
    queryFn: async (): Promise<GetUsersResp[]> => {
      const resp: ApiResponse = await api.request({
        method: 'get',
        url: `/users`
      });

      if (resp.code !== 200) throw new Error(resp.data.data.message);

      return resp.data;
    }
  });
};

const useGetLoginUserInfo = () => {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: [UserQueryKey.GET_LOGIN_USER_INFO],
    queryFn: async (): Promise<LoginUserInfo> => {
      const resp: ApiResponse<LoginUserInfo> = await api.request({
        method: 'get',
        url: `/user-info`
      });

      if (resp.code !== 200) throw new Error(resp.data.data.message);

      return resp.data;
    },
    enabled: isAuthenticated,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
};

interface ValidateInvitationTokenReq {
  token: string
}

interface ValidateInvitationTokenResp {
  user_id: string
  user_name: string
  user_email: string
  user_role_type: string
  user_work_time: string
  user_origin_company_type: string
  invitation_sent_at: string
  invitation_expires_at: string
  invitation_status: string
}

const useGetValidateInvitationToken = (reqData: ValidateInvitationTokenReq) => {
  return useQuery({
    queryKey: [UserQueryKey.GET_VALIDATE_INVITATION_TOKEN, reqData.token],
    queryFn: async (): Promise<ValidateInvitationTokenResp> => {
      const resp: ApiResponse<ValidateInvitationTokenResp> = await api.request({
        method: 'get',
        url: `/user/invitation/validate/${reqData.token}`
      });

      if (resp.code !== 200) throw new Error(resp.data.data.message);

      return resp.data;
    },
  });
};

interface PostUserReq {
  user_id: string
  // user_pwd: string
  user_name: string
  user_email: string
  user_birth: string
  user_company_type: string
  user_department_type: string
  user_work_time: string
  lunar_yn: string
  profile_url: string
  profile_uuid: string
}

const usePostUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (d: PostUserReq) => {
      const resp: ApiResponse = await api.request({
        method: 'post',
        url: `/user`,
        data: d
      });

      if (resp.code !== 200) throw new Error(resp.data.data.message);

      return resp.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [UserQueryKey.GET_USERS] });
      toast.success('사용자가 등록되었습니다.');
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });
}

interface PutUserReq {
  user_id: string
  user_name: string
  user_email: string
  user_birth: string
  user_company_type: string
  user_department_type: string
  user_work_time: string
  lunar_yn: string
  profile_url: string
  profile_uuid: string
}

const usePutUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (d: PutUserReq) => {
      const resp: ApiResponse = await api.request({
        method: 'put',
        url: `/user/${d.user_id}`,
        data: d
      });

      if (resp.code !== 200) throw new Error(resp.data.data.message);

      return resp.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [UserQueryKey.GET_USERS] });
      toast.success('사용자 정보가 수정되었습니다.');
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });
}

const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (user_id: string) => {
      const resp: ApiResponse = await api.request({
        method: 'delete',
        url: `/user/${user_id}`
      });

      if (resp.code !== 200) throw new Error(resp.data.data.message);

      return resp.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [UserQueryKey.GET_USERS] });
      toast.success('사용자가 삭제되었습니다.');
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });
}

interface PostUserInviteReq {
  user_id: string
  user_name: string
  user_email: string
  user_origin_company_type: string
  user_work_time: string
}

interface PostUserInviteResp {
  user_id: string
  user_name: string
  user_email: string
  user_role_type: string
  user_work_time: string
  user_origin_company_type: string
  invitation_sent_at: string
  invitation_expires_at: string
  invitation_status: string
}

const usePostUserInvite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (d: PostUserInviteReq): Promise<PostUserInviteResp> => {
      const resp: ApiResponse<PostUserInviteResp> = await api.request({
        method: 'post',
        url: `/user/invite`,
        data: d
      });

      if (resp.code !== 200) throw new Error(resp.data.data.message);

      return resp.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [UserQueryKey.GET_USERS] });
      toast.success('사용자 초대가 완료되었습니다.');
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });
}

const usePostUploadProfile = () => {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('profile', file);

      const resp: ApiResponse = await api.request({
        method: 'post',
        url: `/user/upload/profile`,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      if (resp.code !== 200) throw new Error(resp.data.data.message);

      return resp.data;
    }
  });
}

const usePostResendInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (user_id: string) => {
      const resp: ApiResponse = await api.request({
        method: 'post',
        url: `/user/invitation/resend/${user_id}`
      });

      if (resp.code !== 200) throw new Error(resp.data.data.message);

      return resp.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [UserQueryKey.GET_USERS] });
      toast.success('초대 메일이 재전송되었습니다.');
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });
}

export {
  // QueryKey
  UserQueryKey,

  // API Hook
  useGetUser,
  useGetUsers,
  useGetLoginUserInfo,
  useGetValidateInvitationToken,
  usePostUser,
  usePostUserInvite,
  usePostResendInvitation,
  usePutUser,
  useDeleteUser,
  usePostUploadProfile
}

export type {
  // Interface
  GetUserResp,
  GetUsersResp,
  LoginUserInfo,
  ValidateInvitationTokenResp,
  PostUserReq,
  PostUserInviteReq,
  PostUserInviteResp,
  PutUserReq
}