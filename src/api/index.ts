import axios, { AxiosError, AxiosResponse } from 'axios'
import config from '@/config/config';
import { toast } from '@/components/alert/toast';

interface CustomHeaders {
  [key: string]: any;
}

interface ApiErrorResponse {
  code: number;
  message: string;
  count: number;
  data?: {
    code: number;
    message: string;
    url: string;
  };
}

const baseURL = config.apiBaseUrl;
const api = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 세션 쿠키 포함하여 요청
});

// Request interceptor
api.interceptors.request.use(
  (config: any) => {
    const headers = config.headers as CustomHeaders;

    // login, logout API는 /api/v1 없이 호출
    if (config.url === '/login' || config.url === '/logout') {
      config.baseURL = import.meta.env.VITE_BASE_URL;
    }

    // 세션 쿠키는 withCredentials로 자동 포함됨
    return config;
  },
  (err: AxiosError) => {
    console.log('Request Error: ', err);
    return Promise.reject(err);
  }
);

// Response interceptor
api.interceptors.response.use(
  (resp: AxiosResponse) => {
    // 성공 응답은 그대로 data 부분만 반환
    return resp.data;
  },
  async (err: AxiosError<ApiErrorResponse>) => {
    console.log('API Error : ', err);

    // 네트워크 에러나 요청 자체가 실패한 경우
    if (!err.response) {
      toast.error('네트워크 오류가 발생했습니다.');
      return Promise.reject(new Error('네트워크 오류가 발생했습니다.'));
    }

    const { status, data } = err.response;

    // 401 에러 처리 (세션 만료)
    if (status === 401) {
      // 로컬 스토리지 정리
      localStorage.removeItem('key');
      localStorage.removeItem('userInfo');

      // 현재 페이지가 로그인 페이지가 아닌 경우에만 리다이렉트
      if (window.location.pathname !== '/web/login') {
        window.location.href = '/web/login';
      }

      toast.error('세션이 만료되었습니다. 다시 로그인해주세요.');
      return Promise.reject(new Error('세션이 만료되었습니다.'));
    }

    // 기타 HTTP 에러 처리
    if (status >= 400) {
      // Java에서 온 에러 응답 구조에 따라 메시지 추출
      const errorMessage = data?.data?.message || data?.message || '서버 오류가 발생했습니다.';
      toast.error(errorMessage);
      return Promise.reject(new Error(errorMessage));
    }

    // 기본 에러 처리
    const errorMessage = err.message || '알 수 없는 오류가 발생했습니다.';
    toast.error(errorMessage);
    return Promise.reject(new Error(errorMessage));
  }
);

export { api };
