import Logo from '@/assets/img/porest.svg';
import LogoDark from '@/assets/img/porest_dark.svg';
import { Button } from '@/components/shadcn/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/shadcn/card';
import { Field, FieldError, FieldLabel } from '@/components/shadcn/field';
import { Input } from '@/components/shadcn/input';
import { toast } from '@/components/shadcn/sonner';
import { Spinner } from '@/components/shadcn/spinner';
import { useTheme } from '@/components/shadcn/themeProvider';
import { useUser } from '@/contexts/UserContext';
import { authKeys, usePostLogoutMutation } from '@/hooks/queries/useAuths';
import { useChangePasswordMutation } from '@/hooks/queries/useUsers';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { KeyRound, Lock, LogOut, ShieldCheck } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

interface PasswordChangeContentProps extends React.ComponentProps<'div'> {}

const PasswordChangeContent = ({ className, ...props }: PasswordChangeContentProps) => {
  return (
    <div className='bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10'>
      <div className='w-full max-w-md'>
        <div className={cn('flex flex-col gap-6', className)} {...props}>
          <PasswordChangeForm />
        </div>
      </div>
    </div>
  );
};

const createFormSchema = (t: (key: string) => string) =>
  z.object({
    current_password: z.string().min(1, t('currentPasswordRequired')),
    new_password: z.string().min(1, t('newPasswordRequired')),
    confirm_password: z.string().min(1, t('confirmPasswordRequired')),
  }).refine((data) => data.new_password === data.confirm_password, {
    message: t('passwordMismatch'),
    path: ['confirm_password'],
  });

type PasswordChangeFormValues = z.infer<ReturnType<typeof createFormSchema>>;

const PasswordChangeForm = () => {
  const { t } = useTranslation('user');
  const { t: tc } = useTranslation('common');
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { theme } = useTheme();
  const { refreshUser, clearLoginUser } = useUser();
  const changePasswordMutation = useChangePasswordMutation();
  const logoutMutation = usePostLogoutMutation();

  const form = useForm<PasswordChangeFormValues>({
    resolver: zodResolver(createFormSchema(t)),
    defaultValues: {
      current_password: '',
      new_password: '',
      confirm_password: '',
    },
  });

  const onSubmit = (values: PasswordChangeFormValues) => {
    changePasswordMutation.mutate(
      {
        current_password: values.current_password,
        new_password: values.new_password,
        new_password_confirm: values.confirm_password,
      },
      {
        onSuccess: async () => {
          toast.success(t('passwordChangeSuccess'));
          await refreshUser();
          navigate('/dashboard');
        },
        onError: (error) => {
          toast.error(error.message || t('passwordChangeError'));
        },
      }
    );
  };

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        clearLoginUser();
        queryClient.setQueryData(authKeys.detail('login-check'), null);
        navigate('/login');
      },
    });
  };

  return (
    <Card>
      <CardHeader className='text-center'>
        <div className='flex justify-center mb-4'>
          <img src={theme === 'light' ? Logo : LogoDark} alt='logo' className='h-8' />
        </div>
        <CardTitle className='text-xl'>{t('passwordChangeRequired')}</CardTitle>
        <CardDescription>{t('passwordChangeRequiredDescription')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='grid gap-4'>
            <Controller
              control={form.control}
              name='current_password'
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel>
                    <Lock className='h-4 w-4 text-muted-foreground inline-block' />
                    {t('currentPassword')}
                    <span className='text-destructive ml-0.5'>*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    type='password'
                    placeholder={t('currentPasswordPlaceholder')}
                  />
                  <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name='new_password'
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel>
                    <KeyRound className='h-4 w-4 text-muted-foreground inline-block' />
                    {t('newPassword')}
                    <span className='text-destructive ml-0.5'>*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    type='password'
                    placeholder={t('newPasswordPlaceholder')}
                  />
                  <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name='confirm_password'
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel>
                    <ShieldCheck className='h-4 w-4 text-muted-foreground inline-block' />
                    {t('confirmPassword')}
                    <span className='text-destructive ml-0.5'>*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    type='password'
                    placeholder={t('confirmPasswordPlaceholder')}
                  />
                  <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
                </Field>
              )}
            />
            <Button
              type='submit'
              className='w-full'
              disabled={changePasswordMutation.isPending}
            >
              {changePasswordMutation.isPending && <Spinner />}
              {changePasswordMutation.isPending ? tc('processing') : t('passwordChange')}
            </Button>
            <div className='after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t'>
              <span className='bg-card text-muted-foreground relative z-10 px-2'>
                {tc('or')}
              </span>
            </div>
            <Button
              type='button'
              variant='outline'
              className='w-full'
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
            >
              <LogOut className='h-4 w-4' />
              {logoutMutation.isPending ? tc('processing') : tc('logout')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export { PasswordChangeContent };
