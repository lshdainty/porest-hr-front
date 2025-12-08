import loginBG from '@/assets/img/login_bg.jpg';
import { toast } from '@/components/shadcn/sonner';
import { Card, CardContent } from '@/components/shadcn/card';
import { authKeys } from '@/hooks/queries/useAuths';
import { cn } from '@/lib/utils';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SocialLoginButton } from '@/features/login/components/SocialLoginButton';

interface LoginContentProps extends React.ComponentProps<'div'> {}

const LoginContent = ({ className, ...props }: LoginContentProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

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
            <CardContent className='grid p-0 md:[grid-template-columns:2fr_1fr] h-full'>
              <div className='bg-muted relative hidden md:block'>
                <img
                  src={loginBG}
                  alt='Image'
                  className='absolute inset-0 h-full w-full object-cover'
                />
              </div>
              <div className='p-6 md:p-8 h-full flex justify-center'>
                 <div className='flex flex-col justify-center gap-6 w-full'>
                    {/* LoginForm needs to be slightly adjusted to not contain the wrapper div if I want to inject SocialButton here.
                        Or I can just render LoginForm and SocialLoginButton inside the wrapper here. 
                        Wait, LoginForm in my previous step included the wrapper div with 'flex flex-col justify-center gap-6'.
                        Let's adjust LoginForm to be just the form fields and button, OR reuse it as is but I need to insert SocialLoginButton.
                        
                        Actually, I'll modify LoginForm to accept children or just put SocialLoginButton inside LoginForm in the previous step?
                        I didn't put it in. I left a comment.
                        
                        Let's rewrite LoginForm to include SocialLoginButton for simplicity as they are tightly coupled in the design.
                        OR, I can rewrite LoginContent to render the form structure.
                        
                        Let's check LoginForm again. It renders a <form> tag.
                        Inside <form>, it has the inputs and the "Or continue with" divider.
                        I should put SocialLoginButton inside the form or right after it?
                        The original code had the button inside the form div (which was inside the form tag? No, let's check original).
                        
                        Original:
                        <form ...>
                          <div className='flex flex-col justify-center gap-6'>
                             ... inputs ...
                             <Button type='submit' ... />
                             <div ... divider ... />
                             <button ... google ... />
                          </div>
                        </form>
                        
                        So the google button was INSIDE the form tag.
                        
                        I will update LoginForm to import and use SocialLoginButton.
                    */}
                    <LoginFormWithSocial />
                 </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Helper component to combine Form and Social Button to match original structure
import Logo from '@/assets/img/porest.svg';
import LogoDark from '@/assets/img/porest_dark.svg';
import { Button } from '@/components/shadcn/button';
import { Input } from '@/components/shadcn/input';
import { Label } from '@/components/shadcn/label';
import { useTheme } from '@/components/shadcn/themeProvider';
import { usePostLoginMutation } from '@/hooks/queries/useAuths';

const LoginFormWithSocial = () => {
  const { t } = useTranslation('login');
  const navigate = useNavigate();
  const { theme } = useTheme();
  const queryClient = useQueryClient();
  const loginMutation = usePostLoginMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    loginMutation.mutate(formData, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: authKeys.detail('login-check')
        });
        navigate('/dashboard');
      }
    });
  };

  return (
    <form className='w-full' onSubmit={handleSubmit}>
        <div className='flex flex-col justify-center gap-6'>
        <div className='flex flex-col items-center text-center'>
          <img src={theme == 'light' ? Logo : LogoDark} alt='logo'></img>
        </div>
        <div className='grid gap-3'>
          <Label htmlFor='user_id'>{t('idLabel')}</Label>
          <Input
            id='user_id'
            name='user_id'
            type='text'
            placeholder={t('idPlaceholder')}
            required
          />
        </div>
        <div className='grid gap-3'>
          <Label htmlFor='user_pw'>{t('passwordLabel')}</Label>
          <Input
            id='user_pw'
            name='user_pw'
            type='password'
            required
          />
        </div>
        <Button
          type='submit'
          className='w-full'
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? t('loadingBtn') : t('loginBtn')}
        </Button>
        <div className='after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t'>
          <span className='bg-card text-muted-foreground relative z-10 px-2'>
            {t('orContinueWith')}
          </span>
        </div>
        <SocialLoginButton />
      </div>
    </form>
  )
}

export { LoginContent };
