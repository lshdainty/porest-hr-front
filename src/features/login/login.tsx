import { AuthQueryKey, usePostLogin } from '@/api/auth';
import loginBG from '@/assets/img/login_bg.jpg';
import Logo from '@/assets/img/porest.svg';
import LogoDark from '@/assets/img/porest_dark.svg';
import { toast } from '@/components/alert/toast';
import { Button } from '@/components/shadcn/button';
import { Card, CardContent } from '@/components/shadcn/card';
import { Input } from '@/components/shadcn/input';
import { Label } from '@/components/shadcn/label';
import { useTheme } from '@/components/shadcn/themeProvider';
import config from '@/config/config';
import { cn } from '@/lib/utils';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const queryClient = useQueryClient();
  const loginMutation = usePostLogin();

  // OAuth2 로그인 성공/실패 처리
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('status');
    const error = urlParams.get('error');

    // OAuth2 로그인 성공 처리
    if (status === 'success') {
      // 유저 정보 다시 가져오기
      queryClient.invalidateQueries({
        queryKey: [AuthQueryKey.GET_LOGIN_CHECK]
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const formData = new FormData(e.target as HTMLFormElement)

    loginMutation.mutate(formData, {
      onSuccess: async () => {
        // 유저 정보 다시 가져오기
        await queryClient.invalidateQueries({
          queryKey: [AuthQueryKey.GET_LOGIN_CHECK]
        })
        navigate('/dashboard')
      }
    })
  }

  const handleGoogleLogin = () => {
    window.location.href = `${config.baseUrl}/oauth2/authorization/google`
  }

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
              <form
                className='p-6 md:p-8 h-full flex justify-center'
                onSubmit={handleSubmit}
              >
                <div className='flex flex-col justify-center gap-6'>
                  <div className='flex flex-col items-center text-center'>
                    <img src={ theme == 'light' ? Logo : LogoDark } alt='logo'></img>
                  </div>
                  <div className='grid gap-3'>
                    <Label htmlFor='user_id'>ID</Label>
                    <Input
                      id='user_id'
                      name='user_id'
                      type='text'
                      placeholder='아이디를 입력하세요'
                      required
                    />
                  </div>
                  <div className='grid gap-3'>
                    <Label htmlFor='user_pw'>Password</Label>
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
                    {loginMutation.isPending ? 'Loading...' : 'Login'}
                  </Button>
                  <div className='after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t'>
                    <span className='bg-card text-muted-foreground relative z-10 px-2'>
                      Or continue with
                    </span>
                  </div>
                  <button
                    type='button'
                    onClick={handleGoogleLogin}
                    className='gsi-material-button'
                  >
                    <div className='gsi-material-button-state'></div>
                    <div className='gsi-material-button-content-wrapper'>
                      <div className='gsi-material-button-icon'>
                        <svg version='1.1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48' xmlnsXlink='http://www.w3.org/1999/xlink' style={{ display: 'block' }}>
                          <path fill='#EA4335' d='M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z'></path>
                          <path fill='#4285F4' d='M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z'></path>
                          <path fill='#FBBC05' d='M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z'></path>
                          <path fill='#34A853' d='M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z'></path>
                          <path fill='none' d='M0 0h48v48H0z'></path>
                        </svg>
                      </div>
                      <span className='gsi-material-button-contents'>Continue with Google</span>
                      <span style={{ display: 'none' }}>Continue with Google</span>
                    </div>
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}