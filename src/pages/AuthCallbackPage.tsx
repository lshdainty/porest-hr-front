import Loading from '@/components/loading/Loading';
import { setToken } from '@/lib/api';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * SSO 인증 콜백 페이지
 * SSO에서 인증 완료 후 리다이렉트되어 JWT 토큰을 처리합니다.
 */
const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // URL fragment에서 토큰 추출 (예: /auth/callback#token=xxx)
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.substring(1)); // # 제거
    const token = params.get('token');
    const errorParam = params.get('error');

    if (errorParam) {
      setError(decodeURIComponent(errorParam));
      // 3초 후 로그인 페이지로 이동
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 3000);
      return;
    }

    if (token) {
      // 토큰 저장
      setToken(token);
      // URL에서 토큰 제거 (보안)
      window.history.replaceState({}, '', window.location.pathname);
      // 대시보드로 이동
      navigate('/dashboard', { replace: true });
    } else {
      setError('인증 토큰을 받지 못했습니다.');
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 3000);
    }
  }, [navigate]);

  if (error) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-red-600 mb-2">인증 실패</h1>
          <p className="text-muted-foreground">{error}</p>
          <p className="text-sm text-muted-foreground mt-4">
            잠시 후 로그인 페이지로 이동합니다...
          </p>
        </div>
      </div>
    );
  }

  return <Loading />;
};

export { AuthCallbackPage };
