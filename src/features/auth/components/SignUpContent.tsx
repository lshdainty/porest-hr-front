import PorestLogo from '@/assets/img/porest.svg';
import { toast } from '@/components/shadcn/sonner';
import { Button } from '@/components/shadcn/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card';
import { SignUpProvider } from '@/features/auth/contexts/SignUpContext';
import { usePostCompleteSignupMutation, useValidateInvitationTokenQuery } from '@/hooks/queries/useAuths';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import InvitationInfo from '@/features/auth/components/InvitationInfo';
import SignUpForm from '@/features/auth/components/SignUpForm';
import SocialConnectButton from '@/features/auth/components/SocialConnectButton';

interface FormData {
  birth: string;
  lunarYN: string;
}

const SignUpContent = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';

  const { data: validationData, isLoading, isError } = useValidateInvitationTokenQuery(token);
  const { mutate: completeSignup, isPending } = usePostCompleteSignupMutation();

  const [formData, setFormData] = useState<FormData>({
    birth: '',
    lunarYN: 'N'
  });
  const [connectedOAuth, setConnectedOAuth] = useState<string[]>([]);

  // ✅ OAuth2 연동 결과 처리
  useEffect(() => {
    const oauth = searchParams.get('oauth');
    const status = searchParams.get('status');
    const error = searchParams.get('error');

    if (oauth && status === 'connected') {
      // OAuth2 연동 성공
      setConnectedOAuth(prev => {
        if (!prev.includes(oauth)) {
          return [...prev, oauth];
        }
        return prev;
      });
      toast.success(`${oauth} 계정 연동이 완료되었습니다!`);
      
      // URL 파라미터 정리 (token만 남기고 제거)
      navigate(`/signup?token=${token}`, { replace: true });
    } else if (error) {
      // OAuth2 연동 실패
      toast.error(decodeURIComponent(error));
    }
  }, [searchParams, token, navigate]);

  const handleOAuthConnect = (provider: string) => {
    // OAuth2 로그인 시작 (세션에 이미 토큰이 저장되어 있음)
    window.location.href = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/oauth2/authorization/${provider}?token=${token}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (connectedOAuth.length === 0) {
      toast.error('최소 하나의 소셜 로그인을 연동해주세요.');
      return;
    }

    completeSignup(
      {
        invitation_token: token,
        user_birth: formData.birth,
        lunar_yn: formData.lunarYN
      },
      {
        onSuccess: () => {
          toast.success('회원가입이 완료되었습니다!');
          navigate('/login');
        }
      }
    );
  };

  if (isLoading || !token) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !validationData || validationData.invitation_status !== 'PENDING') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center text-destructive">
              <p className="text-lg font-semibold">
                {isError ? '초대 링크 확인에 실패했습니다.' :
                 !validationData ? '유효하지 않은 초대 링크입니다.' :
                 validationData.invitation_status === 'ACTIVE' ? '이미 가입이 완료된 링크입니다.' :
                 validationData.invitation_status === 'EXPIRED' ? '만료된 초대 링크입니다.' :
                 validationData.invitation_status === 'INACTIVE' ? '비활성화된 초대 링크입니다.' :
                 '유효하지 않은 초대 링크입니다.'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <SignUpProvider value={{
      token,
      validationData,
      isLoading,
      isError,
      isPending,
      formData,
      setFormData,
      connectedOAuth,
      setConnectedOAuth,
      handleOAuthConnect,
      handleSubmit
    }}>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center">
              <img src={PorestLogo} alt="Porest Logo" className="w-36 h-16" />
            </div>

            <CardTitle className="text-2xl font-semibold tracking-tight">
              회원가입
            </CardTitle>
            <CardContent className="text-sm text-muted-foreground">
              초대받은 정보로 계정을 완성해주세요
            </CardContent>
          </CardHeader>

          <CardContent className="space-y-6">
            <InvitationInfo />

            <SocialConnectButton />

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">추가 정보</span>
              </div>
            </div>

            <SignUpForm />

            <div className="text-center">
              <p className="text-sm text-gray-600">
                이미 계정이 있으신가요?{' '}
                <Button
                  variant="link"
                  className="p-0 h-auto font-semibold text-primary"
                  onClick={() => navigate('/login')}
                >
                  로그인
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </SignUpProvider>
  );
};

export default SignUpContent;
