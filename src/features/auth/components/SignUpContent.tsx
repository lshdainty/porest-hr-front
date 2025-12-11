import PorestLogo from '@/assets/img/porest.svg';
import { Button } from '@/components/shadcn/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card';
import { toast } from '@/components/shadcn/sonner';
import { InvitationInfo } from '@/features/auth/components/InvitationInfo';
import { SignUpForm } from '@/features/auth/components/SignUpForm';
import { SocialConnectButton } from '@/features/auth/components/SocialConnectButton';
import { SignUpProvider } from '@/features/auth/contexts/SignUpContext';
import { usePostCompleteSignupMutation, useValidateInvitationTokenQuery } from '@/hooks/queries/useAuths';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface FormData {
  birth: string;
  lunarYN: string;
}

const SignUpContent = () => {
  const { t } = useTranslation('auth');
  const { t: tc } = useTranslation('common');
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
      toast.success(t('signup.oauthConnected', { provider: oauth }));
      
      // URL 파라미터 정리 (token만 남기고 제거)
      navigate(`/signup?token=${token}`, { replace: true });
    } else if (error) {
      // OAuth2 연동 실패
      toast.error(decodeURIComponent(error));
    }
  }, [searchParams, token, navigate]);

  const handleOAuthConnect = (provider: string) => {
    // OAuth2 로그인 시작 (세션에 이미 토큰이 저장되어 있음)
    window.location.href = `${import.meta.env.VITE_API_BASE_URL || 'https://porest.cloud'}/oauth2/authorization/${provider}?token=${token}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (connectedOAuth.length === 0) {
      toast.error(t('signup.needOAuth'));
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
          toast.success(t('signup.complete'));
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
                {isError ? t('signup.linkCheckFailed') :
                 !validationData ? t('signup.invalidLink') :
                 validationData.invitation_status === 'ACTIVE' ? t('signup.alreadyRegistered') :
                 validationData.invitation_status === 'EXPIRED' ? t('signup.expiredLink') :
                 validationData.invitation_status === 'INACTIVE' ? t('signup.inactiveLink') :
                 t('signup.invalidLink')}
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
              {t('signup.title')}
            </CardTitle>
            <CardContent className="text-sm text-muted-foreground">
              {t('signup.subtitle')}
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
                <span className="bg-background px-2 text-muted-foreground">{t('signup.additionalInfo')}</span>
              </div>
            </div>

            <SignUpForm />

            <div className="text-center">
              <p className="text-sm text-gray-600">
                {t('signup.hasAccount')}{' '}
                <Button
                  variant="link"
                  className="p-0 h-auto font-semibold text-primary"
                  onClick={() => navigate('/login')}
                >
                  {tc('login')}
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </SignUpProvider>
  );
};

export { SignUpContent };
