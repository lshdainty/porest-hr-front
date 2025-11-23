import Logo from '@/assets/img/porest.svg';
import LogoDark from '@/assets/img/porest_dark.svg';
import { Button } from '@/components/shadcn/button';
import { Input } from '@/components/shadcn/input';
import { Label } from '@/components/shadcn/label';
import { useTheme } from '@/components/shadcn/themeProvider';
import { authKeys, usePostLoginMutation } from '@/hooks/queries/useAuths';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const queryClient = useQueryClient();
  const loginMutation = usePostLoginMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);

    loginMutation.mutate(formData, {
      onSuccess: async () => {
        // 유저 정보 다시 가져오기
        await queryClient.invalidateQueries({
          queryKey: authKeys.detail('login-check')
        });
        navigate('/dashboard');
      }
    });
  };

  return (
    <form
      className='p-6 md:p-8 h-full flex justify-center'
      onSubmit={handleSubmit}
    >
      <div className='flex flex-col justify-center gap-6'>
        <div className='flex flex-col items-center text-center'>
          <img src={theme == 'light' ? Logo : LogoDark} alt='logo'></img>
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
        {/* Social Login Button will be passed as children or rendered here if tightly coupled, 
            but plan says separate component. Let's keep it separate and use composition in Content 
            or just render it here if it's part of the form layout. 
            The original code had it inside the form div. I'll export it separately and let Content compose them 
            or import it here. Let's import it here to keep the form structure intact easily. 
            Actually, the plan says "Orchestrate LoginForm and SocialLoginButton" in LoginContent. 
            So I will remove it from here and let LoginContent place it. 
            Wait, the "Or continue with" divider is here. 
            I'll keep the divider here and accept children for the social button? 
            Or just import SocialLoginButton here. Importing is easier.
        */}
      </div>
    </form>
  );
};

export default LoginForm;
