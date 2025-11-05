import { api, type ApiResponse } from '@/api/index';
import { toast } from '@/components/alert/toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const enum UserQueryKey {
  GET_USER = 'getUser',
  GET_USERS = 'getUsers',
  GET_USER_APPROVERS = 'getUserApprovers',
  GET_USER_ID_DUPLICATE = 'getUserIdDuplicate',
  POST_USER = 'postUser',
  POST_USER_INVITE = 'postUserInvite',
  POST_RESEND_INVITATION = 'postResendInvitation',
  PUT_USER = 'putUser',
  PUT_INVITED_USER = 'putInvitedUser',
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
  join_date: string
  user_role_type: string
  user_role_name: string
  user_origin_company_type: string
  user_origin_company_name: string
  main_department_name_kr: string | null
  lunar_yn: string
  profile_url: string
  invitation_token?: string
  invitation_sent_at?: string
  invitation_expires_at?: string
  invitation_status?: string
  registered_at?: string
}

const useGetUser = (reqData: GetUserReq) => {
  return useQuery({
    queryKey: [UserQueryKey.GET_USER, reqData.user_id],
    queryFn: async (): Promise<GetUserResp> => {
      const resp: ApiResponse<GetUserResp> = await api.request({
        method: 'get',
        url: `/users/${reqData.user_id}`
      });

      if (resp.code !== 200) throw new Error(resp.message);

      return resp.data;
    },
    enabled: !!reqData.user_id
  });
};

interface GetUsersResp {
  user_id: string
  user_name: string
  user_email: string
  user_birth: string
  user_work_time: string
  join_date: string
  user_role_type: string
  user_role_name: string
  user_origin_company_type: string
  user_origin_company_name: string
  main_department_name_kr: string | null
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
      const resp: ApiResponse<GetUsersResp[]> = await api.request({
        method: 'get',
        url: `/users`
      });

      if (resp.code !== 200) throw new Error(resp.message);

      return resp.data;
    }
  });
};

interface GetUserApproversReq {
  user_id: string
}

interface GetUserApproversResp {
  user_id: string
  user_name: string
  user_email: string
  user_role_type: string
  user_role_name: string
  department_id: number
  department_name: string
  department_name_kr: string
  department_level: number
}

const useGetUserApprovers = (reqData: GetUserApproversReq) => {
  return useQuery({
    queryKey: [UserQueryKey.GET_USER_APPROVERS, reqData.user_id],
    queryFn: async (): Promise<GetUserApproversResp[]> => {
      const resp: ApiResponse<GetUserApproversResp[]> = await api.request({
        method: 'get',
        url: `/users/${reqData.user_id}/approvers`
      });

      if (resp.code !== 200) throw new Error(resp.message);

      return resp.data;
    },
    enabled: !!reqData.user_id
  });
};

interface GetUserIdDuplicateReq {
  user_id: string
}

interface GetUserIdDuplicateResp {
  duplicate: boolean
}

const useGetUserIdDuplicate = (reqData: GetUserIdDuplicateReq) => {
  return useQuery({
    queryKey: [UserQueryKey.GET_USER_ID_DUPLICATE, reqData.user_id],
    queryFn: async (): Promise<GetUserIdDuplicateResp> => {
      const resp: ApiResponse<GetUserIdDuplicateResp> = await api.request({
        method: 'get',
        url: `/users/check-duplicate`,
        params: {
          user_id: reqData.user_id
        }
      });

      if (resp.code !== 200) throw new Error(resp.message);

      return resp.data;
    },
    enabled: !!reqData.user_id
  });
};

interface PostUserReq {
  user_id: string
  // user_pwd: string
  user_name: string
  user_email: string
  user_birth: string
  user_origin_company_type: string
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
        url: `/users`,
        data: d
      });

      if (resp.code !== 200) throw new Error(resp.message);

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
  user_role_type: string
  user_origin_company_type: string
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
        url: `/users/${d.user_id}`,
        data: d
      });

      if (resp.code !== 200) throw new Error(resp.message);

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

interface PutInvitedUserReq {
  user_id: string
  user_name: string
  user_email: string
  user_origin_company_type: string
  user_work_time: string
  join_date: string
}

interface PutInvitedUserResp {
  user_id: string
  user_name: string
  user_email: string
  user_origin_company_type: string
  user_work_time: string
  join_date: string
  user_role_type: string
  invitation_sent_at: string
  invitation_expires_at: string
  invitation_status: string
}

const usePutInvitedUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (d: PutInvitedUserReq): Promise<PutInvitedUserResp> => {
      const resp: ApiResponse<PutInvitedUserResp> = await api.request({
        method: 'put',
        url: `/users/${d.user_id}/invitations`,
        data: {
          user_name: d.user_name,
          user_email: d.user_email,
          user_origin_company_type: d.user_origin_company_type,
          user_work_time: d.user_work_time,
          join_date: d.join_date
        }
      });

      if (resp.code !== 200) throw new Error(resp.message);

      return resp.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [UserQueryKey.GET_USERS] });
      toast.success('초대된 사용자 정보가 수정되었습니다.');
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
        url: `/users/${user_id}`
      });

      if (resp.code !== 200) throw new Error(resp.message);

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
  join_date: string
}

interface PostUserInviteResp {
  user_id: string
  user_name: string
  user_email: string
  user_origin_company_type: string
  user_work_time: string
  join_date: string
  user_role_type: string
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
        url: `/users/invitations`,
        data: d
      });

      if (resp.code !== 200) throw new Error(resp.message);

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
        url: `/users/profiles`,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      if (resp.code !== 200) throw new Error(resp.message);

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
        url: `/users/${user_id}/invitations/resend`
      });

      if (resp.code !== 200) throw new Error(resp.message);

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
  useDeleteUser,
  // API Hook
  useGetUser, useGetUserApprovers, useGetUserIdDuplicate, useGetUsers, usePostResendInvitation, usePostUploadProfile, usePostUser,
  usePostUserInvite, usePutInvitedUser, usePutUser,
  // QueryKey
  UserQueryKey
};

export type {
  GetUserApproversReq,
  GetUserApproversResp,
  GetUserIdDuplicateReq,
  GetUserIdDuplicateResp,
  // Interface
  GetUserResp,
  GetUsersResp, PostUserInviteReq,
  PostUserInviteResp, PostUserReq, PutInvitedUserReq,
  PutInvitedUserResp, PutUserReq
};
