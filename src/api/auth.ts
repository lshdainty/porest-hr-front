import { api } from '@/api/index'
import { useMutation } from '@tanstack/react-query';
import { toast } from '@/components/alert/toast';

interface ApiResponse<T = any> {
  code: number
  message: string
  count: number
  data: T
}

const enum AuthQueryKey {
  POST_LOGIN = 'postLogin',
  POST_LOGOUT = 'postLogout'
}

interface PostLoginReq {
  formData: FormData
}

interface PostLoginResp {
  user: {
    id: string
    name: string
    email: string
    role: string
  }
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
    onSuccess: (data) => {
      toast.success('로그인에 성공했습니다.');
      // 세션은 서버에서 쿠키로 자동 설정되므로 키만 저장
      localStorage.setItem('key', 'authenticated');
      localStorage.setItem('userInfo', JSON.stringify(data.user));
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
      // 세션은 서버에서 쿠키 삭제하므로 로컬 데이터만 정리
      localStorage.removeItem('key');
      localStorage.removeItem('userInfo');
    },
    onError: (error) => {
      toast.error('로그아웃에 실패했습니다.');
      console.error('Logout failed:', error);
    }
  });
}


export {
  // QueryKey
  AuthQueryKey,

  // API Hook
  usePostLogin,
  usePostLogout
}

export type {
  // Interface
  PostLoginReq,
  PostLoginResp
}