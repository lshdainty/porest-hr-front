import { Button } from '@/components/shadcn/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/shadcn/dialog';
import { Field, FieldError, FieldLabel } from '@/components/shadcn/field';
import { Input } from '@/components/shadcn/input';
import { toast } from '@/components/shadcn/sonner';
import { Spinner } from '@/components/shadcn/spinner';
import { useRequestPasswordResetMutation } from '@/hooks/queries/useUsers';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, User } from 'lucide-react';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

const createFormSchema = (t: (key: string) => string) =>
  z.object({
    user_id: z.string().min(1, t('resetPassword.userIdRequired')),
    email: z.string().email(t('resetPassword.emailInvalid')),
  });

type PasswordResetFormValues = z.infer<ReturnType<typeof createFormSchema>>;

interface PasswordResetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PasswordResetDialog = ({ open, onOpenChange }: PasswordResetDialogProps) => {
  const { t } = useTranslation('login');
  const resetPasswordMutation = useRequestPasswordResetMutation();

  const form = useForm<PasswordResetFormValues>({
    resolver: zodResolver(createFormSchema(t)),
    defaultValues: {
      user_id: '',
      email: '',
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        user_id: '',
        email: '',
      });
    }
  }, [open, form]);

  const onSubmit = (values: PasswordResetFormValues) => {
    resetPasswordMutation.mutate(values, {
      onSuccess: () => {
        toast.success(t('resetPassword.success'));
        onOpenChange(false);
      },
      onError: () => {
        toast.error(t('resetPassword.error'));
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader className='text-center sm:text-center'>
          <DialogTitle className='text-xl'>{t('resetPassword.title')}</DialogTitle>
          <DialogDescription>{t('resetPassword.description')}</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='grid gap-4 py-4'>
            <Controller
              control={form.control}
              name='user_id'
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel>
                    <User className='h-4 w-4 text-muted-foreground inline-block' />
                    {t('idLabel')}
                    <span className='text-destructive ml-0.5'>*</span>
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
              name='email'
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel>
                    <Mail className='h-4 w-4 text-muted-foreground inline-block' />
                    {t('resetPassword.email')}
                    <span className='text-destructive ml-0.5'>*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    type='email'
                    placeholder={t('resetPassword.emailPlaceholder')}
                  />
                  <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
                </Field>
              )}
            />
          </div>
          <div className='flex flex-col gap-3'>
            <Button
              type='submit'
              className='w-full'
              disabled={resetPasswordMutation.isPending}
            >
              {resetPasswordMutation.isPending && <Spinner />}
              {resetPasswordMutation.isPending
                ? t('resetPassword.submitting')
                : t('resetPassword.submit')}
            </Button>
            <Button
              type='button'
              variant='ghost'
              className='w-full'
              onClick={() => onOpenChange(false)}
            >
              {t('resetPassword.backToLogin')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export { PasswordResetDialog };
