// TODO: OAuth 연동 페이지 및 기능 개발 필요 (Google, Kakao 등 소셜 로그인 연동)

import loginBG from '@/assets/img/login_bg.jpg';
import Logo from '@/assets/img/porest.svg';
import LogoDark from '@/assets/img/porest_dark.svg';
import { Button } from '@/components/shadcn/button';
import { Card, CardContent } from '@/components/shadcn/card';
import { Field, FieldError, FieldLabel } from '@/components/shadcn/field';
import { Input } from '@/components/shadcn/input';
import { toast } from '@/components/shadcn/sonner';
import { Spinner } from '@/components/shadcn/spinner';
import { useTheme } from '@/components/shadcn/themeProvider';
import { useUser } from '@/contexts/UserContext';
import { PasswordResetDialog } from '@/features/login/components/PasswordResetDialog';
import { SocialLoginButton } from '@/features/login/components/SocialLoginButton';
import {
  authKeys,
  useCsrfTokenQuery,
  usePostLoginMutation
} from '@/hooks/queries/useAuths';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { KeyRound, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

interface LoginContentProps extends React.ComponentProps<'div'> {}

const LoginContent = ({ className, ...props }: LoginContentProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // CSRF 토큰 발급
  useCsrfTokenQuery();

  // OAuth2 로그인 성공/실패 처리
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('status');
    const error = urlParams.get('error');

    // OAuth2 로그인 성공 처리
    if (status === 'success') {
      // 유저 정보 다시 가져오기
      queryClient.invalidateQueries({
        queryKey: authKeys.detail('login-check')
      }).then(() => {
        // URL 파라미터 제거 후 대시보드로 이동
        window.history.replaceState({}, '', window.location.pathname);
        navigate('/dashboard');
      });

      return;
    }

    // OAuth2 로그인 실패 처리
    if (error) {
      const errorMessage = decodeURIComponent(error);

      // toast 호출 전 약간의 지연
      setTimeout(() => {
        toast.error(errorMessage);
      }, 100);

      // URL 파라미터 제거
      const timer = setTimeout(() => {
        window.history.replaceState({}, '', window.location.pathname);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [navigate, queryClient]);

  return (
    <div className='bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10'>
      <div className='w-full max-w-sm md:max-w-6xl'>
        <div className={cn('flex flex-col gap-6 h-[700px]', className)} {...props}>
          <Card className='overflow-hidden p-0 h-full'>
            <CardContent className='grid p-0 md:grid-cols-[2fr_1fr] h-full'>
              <div className='bg-muted relative hidden md:block'>
                <img
                  src={loginBG}
                  alt='Image'
                  className='absolute inset-0 h-full w-full object-cover'
                />
              </div>
              <div className='p-6 md:p-8 h-full flex justify-center'>
                <div className='flex flex-col justify-center gap-6 w-full'>
                  <LoginForm />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const createLoginFormSchema = (t: (key: string) => string) =>
  z.object({
    user_id: z.string().min(1, t('idRequired')),
    user_pw: z.string().min(1, t('passwordRequired')),
  });

type LoginFormValues = z.infer<ReturnType<typeof createLoginFormSchema>>;

const LoginForm = () => {
  const { t } = useTranslation('login');
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { refreshUser } = useUser();
  const loginMutation = usePostLoginMutation();
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(createLoginFormSchema(t)),
    defaultValues: {
      user_id: '',
      user_pw: '',
    },
  });

  const onSubmit = (values: LoginFormValues) => {
    const formData = new FormData();
    formData.append('user_id', values.user_id);
    formData.append('user_pw', values.user_pw);

    loginMutation.mutate(formData, {
      onSuccess: async () => {
        await refreshUser();
        navigate('/dashboard');
      },
    });
  };

  return (
    <>
      <form className='w-full' onSubmit={form.handleSubmit(onSubmit)}>
        <div className='flex flex-col justify-center gap-6'>
          <div className='flex flex-col items-center text-center'>
            <img src={theme == 'light' ? Logo : LogoDark} alt='logo' />
          </div>
          <Controller
            control={form.control}
            name='user_id'
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel>
                  <User className='h-4 w-4 text-muted-foreground inline-block' />
                  {t('idLabel')}
                </FieldLabel>
                <Input
                  {...field}
                  placeholder={t('idPlaceholder')}
                />
                <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name='user_pw'
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <div className='flex items-center'>
                  <FieldLabel>
                    <KeyRound className='h-4 w-4 text-muted-foreground inline-block' />
                    {t('passwordLabel')}
                  </FieldLabel>
                  <a
                    href='#'
                    className='ml-auto text-sm font-medium text-muted-foreground underline-offset-4 hover:underline hover:text-primary'
                    onClick={(e) => {
                      e.preventDefault();
                      setIsResetDialogOpen(true);
                    }}
                  >
                    {t('forgotPassword')}
                  </a>
                </div>
                <Input
                  {...field}
                  type='password'
                />
                <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
              </Field>
            )}
          />
          <Button
            type='submit'
            className='w-full'
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending && <Spinner />}
            {loginMutation.isPending ? t('loadingBtn') : t('loginBtn')}
          </Button>
          <div className='after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t'>
            <span className='bg-card text-muted-foreground relative z-10 px-2'>
              {t('orContinueWith')}
            </span>
          </div>
          <SocialLoginButton />
          <div className='text-center text-sm'>
            <span className='text-muted-foreground'>{t('signup.noAccount')}</span>{' '}
            <a
              href='#'
              className='font-medium text-primary underline-offset-4 hover:underline'
              onClick={(e) => {
                e.preventDefault();
                navigate('/signup');
              }}
            >
              {t('tab.signup')}
            </a>
          </div>
        </div>
      </form>

      <PasswordResetDialog
        open={isResetDialogOpen}
        onOpenChange={setIsResetDialogOpen}
      />
    </>
  );
};

export { LoginContent };
