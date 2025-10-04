import { api } from '@/api/index'
import {useQuery, useMutation } from '@tanstack/react-query';
import { toast } from '@/components/alert/toast';

interface ApiResponse<T = any> {
  code: number
  message: string
  count: number
  data: T
}

const enum AuthQueryKey {
  POST_LOGIN = 'postLogin',
  POST_LOGOUT = 'postLogout',
  GET_VALIDATE_INVITATION_TOKEN = 'getValidateInvitationToken',
  POST_COMPLETE_SIGNUP = 'postCompleteSignup',
}

interface PostLoginReq {
  formData: FormData
}

interface PostLoginResp {
  user_id: string
  user_name: string
  user_email: string
  user_role: string
  is_login: string
}

const usePostLogin = () => {
  return useMutation({
    mutationFn: async (formData: FormData): Promise<PostLoginResp> => {
      const resp: ApiResponse<PostLoginResp> = await api.request({
        method: 'post',
        url: `/login`,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return resp.data;
    },
    onSuccess: () => {
      toast.success('로그인에 성공했습니다.');
    },
    onError: (error: any) => {
      // 서버에서 반환한 에러 메시지를 표시
      const errorMessage = error?.message || '로그인에 실패했습니다.';
      toast.error(errorMessage);
      console.error('Login failed:', error);
    }
  });
}

const usePostLogout = () => {
  return useMutation({
    mutationFn: async (): Promise<void> => {
      await api.request({
        method: 'post',
        url: `/logout`
      });
    },
    onSuccess: () => {
      toast.success('로그아웃 되었습니다.');
    },
    onError: (error) => {
      toast.error('로그아웃에 실패했습니다.');
      console.error('Logout failed:', error);
    }
  });
}

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
    queryKey: [AuthQueryKey.GET_VALIDATE_INVITATION_TOKEN, reqData.token],
    queryFn: async (): Promise<ValidateInvitationTokenResp> => {
      const resp: ApiResponse<ValidateInvitationTokenResp> = await api.request({
        method: 'get',
        url: `/oauth2/signup/validate?token=${reqData.token}`
      });

      if (resp.code !== 200) throw new Error(resp.data.data.message);

      return resp.data;
    },
  });
};

interface PostCompleteSignupReq {
  invitation_token: string
  user_birth: string
  lunar_yn: string
}

interface PostCompleteSignupResp {
  user_id: string
  user_name: string
  user_email: string
}

const usePostCompleteSignup = () => {
  return useMutation({
    mutationFn: async (reqData: PostCompleteSignupReq): Promise<PostCompleteSignupResp> => {
      const resp: ApiResponse<PostCompleteSignupResp> = await api.request({
        method: 'post',
        url: `/user/invitation/complete`,
        data: reqData
      });

      return resp.data;
    },
    onSuccess: () => {
      toast.success('회원가입이 완료되었습니다!');
    },
    onError: (error: any) => {
      const errorMessage = error?.message || '회원가입에 실패했습니다.';
      toast.error(errorMessage);
      console.error('Signup failed:', error);
    }
  });
};

export {
  // QueryKey
  AuthQueryKey,

  // API Hook
  usePostLogin,
  usePostLogout,
  useGetValidateInvitationToken,
  usePostCompleteSignup,
}

export type {
  // Interface
  PostLoginReq,
  PostLoginResp,
  ValidateInvitationTokenResp,
  PostCompleteSignupReq,
  PostCompleteSignupResp,
}