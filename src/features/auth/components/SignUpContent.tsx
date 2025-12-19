import Logo from '@/assets/img/porest.svg';
import LogoDark from '@/assets/img/porest_dark.svg';
import { Button } from '@/components/shadcn/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/shadcn/card';
import { Checkbox } from '@/components/shadcn/checkbox';
import { Field, FieldError, FieldLabel } from '@/components/shadcn/field';
import { Input } from '@/components/shadcn/input';
import { InputDatePicker } from '@/components/shadcn/inputDatePicker';
import { toast } from '@/components/shadcn/sonner';
import { Spinner } from '@/components/shadcn/spinner';
import { useTheme } from '@/components/shadcn/themeProvider';
import {
  useCheckUserIdDuplicateMutation,
  useCsrfTokenQuery,
  usePostRegistrationCompleteMutation,
  usePostRegistrationValidateMutation
} from '@/hooks/queries/useAuths';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, CalendarDays, CheckCircle, KeyRound, Mail, Ticket, User, XCircle } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

interface ValidatedInfo {
  userId: string;
  userName: string;
  userEmail: string;
}

// 제한된 이메일 도메인 목록 (정확히 일치하거나 서브도메인)
const BLOCKED_EMAIL_DOMAINS = [
  'sk.com',
  'skc.com',
  'skc.kr',
  'skcorp.com'
];

// 제한된 이메일 도메인 접두어 (partner.xxx.xxx 등)
const BLOCKED_EMAIL_PREFIXES = [
  'partner.'
];

// 이메일 도메인 검증 함수
const isBlockedEmailDomain = (email: string): boolean => {
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return false;

  // partner.xxx.xxx 형태 차단
  if (BLOCKED_EMAIL_PREFIXES.some(prefix => domain.startsWith(prefix))) {
    return true;
  }

  // 특정 도메인 또는 서브도메인 차단 (sk.com, mail.sk.com 등)
  return BLOCKED_EMAIL_DOMAINS.some(blocked =>
    domain === blocked || domain.endsWith('.' + blocked)
  );
};

const SignUpContent = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { t } = useTranslation('login');

  const [step, setStep] = useState<'basic' | 'complete'>('basic');
  const [validatedInfo, setValidatedInfo] = useState<ValidatedInfo | null>(null);

  // CSRF 토큰 발급
  useCsrfTokenQuery();

  const handleValidateSuccess = (info: ValidatedInfo) => {
    setValidatedInfo(info);
    setStep('complete');
  };

  const handleBack = () => {
    setStep('basic');
  };

  const handleComplete = () => {
    toast.success(t('signup.success'));
    navigate('/login', { replace: true });
  };

  const handleSwitchToLogin = () => {
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <img
              src={theme === 'light' ? Logo : LogoDark}
              alt="Porest Logo"
              className="h-12"
            />
          </div>
          <CardTitle className="text-2xl font-semibold tracking-tight">
            {step === 'basic' ? t('signup.step1.title') : t('signup.step2.title')}
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            {step === 'basic' ? t('signup.step1.subtitle') : t('signup.step2.subtitle')}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {step === 'basic' ? (
            <SignUpBasicForm
              onValidateSuccess={handleValidateSuccess}
              onSwitchToLogin={handleSwitchToLogin}
            />
          ) : (
            validatedInfo && (
              <SignUpCompleteForm
                validatedInfo={validatedInfo}
                onBack={handleBack}
                onComplete={handleComplete}
              />
            )
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// 1단계: 초대 확인 폼
const createSignUpFormSchema = (t: (key: string) => string) =>
  z.object({
    user_id: z.string().min(1, t('signup.idRequired')),
    user_name: z.string().min(1, t('signup.nameRequired')),
    user_email: z.string().min(1, t('signup.emailRequired')).email(t('signup.emailInvalid')),
    token: z.string().min(1, t('signup.tokenRequired')),
  });

type SignUpFormValues = z.infer<ReturnType<typeof createSignUpFormSchema>>;

interface SignUpBasicFormProps {
  onValidateSuccess: (info: ValidatedInfo) => void;
  onSwitchToLogin: () => void;
}

const SignUpBasicForm = ({ onValidateSuccess, onSwitchToLogin }: SignUpBasicFormProps) => {
  const { t } = useTranslation('login');
  const validateMutation = usePostRegistrationValidateMutation();

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(createSignUpFormSchema(t)),
    defaultValues: {
      user_id: '',
      user_name: '',
      user_email: '',
      token: '',
    },
  });

  const onSubmit = (values: SignUpFormValues) => {
    validateMutation.mutate(
      {
        user_id: values.user_id,
        user_name: values.user_name,
        user_email: values.user_email,
        invitation_code: values.token,
      },
      {
        onSuccess: (data) => {
          if (data.valid) {
            onValidateSuccess({
              userId: values.user_id,
              userName: values.user_name,
              userEmail: values.user_email,
            });
          } else {
            toast.error(data.message || t('signup.error.invalidInfo'));
          }
        },
      }
    );
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-4">
        <Controller
          control={form.control}
          name="user_id"
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel>
                <User className="h-4 w-4 text-muted-foreground inline-block" />
                {t('signup.idLabel')}
              </FieldLabel>
              <Input
                {...field}
                placeholder={t('signup.idPlaceholder')}
              />
              <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="user_name"
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel>
                <User className="h-4 w-4 text-muted-foreground inline-block" />
                {t('signup.nameLabel')}
              </FieldLabel>
              <Input
                {...field}
                placeholder={t('signup.namePlaceholder')}
              />
              <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="user_email"
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel>
                <Mail className="h-4 w-4 text-muted-foreground inline-block" />
                {t('signup.emailLabel')}
              </FieldLabel>
              <Input
                {...field}
                type="email"
                placeholder={t('signup.emailPlaceholder')}
              />
              <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="token"
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel>
                <Ticket className="h-4 w-4 text-muted-foreground inline-block" />
                {t('signup.tokenLabel')}
              </FieldLabel>
              <Input
                {...field}
                placeholder={t('signup.tokenPlaceholder')}
              />
              <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
            </Field>
          )}
        />
        <Button
          type="submit"
          className="w-full mt-2"
          disabled={validateMutation.isPending}
        >
          {validateMutation.isPending && <Spinner />}
          {validateMutation.isPending ? t('signup.loadingBtn') : t('signup.submitBtn')}
        </Button>
        <div className="text-center text-sm mt-2">
          <span className="text-muted-foreground">{t('signup.hasAccount')}</span>{' '}
          <a
            href="#"
            className="font-medium text-primary underline-offset-4 hover:underline"
            onClick={(e) => {
              e.preventDefault();
              onSwitchToLogin();
            }}
          >
            {t('tab.login')}
          </a>
        </div>
      </div>
    </form>
  );
};

// 2단계: 회원가입 완료 폼
const createSignUpCompleteFormSchema = (t: (key: string) => string) =>
  z.object({
    new_user_id: z.string().min(1, t('signup.idRequired')),
    new_user_email: z.string().min(1, t('signup.emailRequired')).email(t('signup.emailInvalid')),
    password: z.string().min(1, t('signup.passwordRequired')),
    password_confirm: z.string().min(1, t('signup.passwordConfirmRequired')),
    user_birth: z.string().min(1, t('signup.birthDateRequired')),
    lunar_yn: z.string(),
  }).refine((data) => data.password === data.password_confirm, {
    message: t('signup.error.passwordMismatch'),
    path: ['password_confirm'],
  }).refine((data) => !isBlockedEmailDomain(data.new_user_email), {
    message: t('signup.error.blockedEmailDomain'),
    path: ['new_user_email'],
  });

type SignUpCompleteFormValues = z.infer<ReturnType<typeof createSignUpCompleteFormSchema>>;

interface SignUpCompleteFormProps {
  validatedInfo: ValidatedInfo;
  onBack: () => void;
  onComplete: () => void;
}

const SignUpCompleteForm = ({ validatedInfo, onBack, onComplete }: SignUpCompleteFormProps) => {
  const { t } = useTranslation('login');
  const completeMutation = usePostRegistrationCompleteMutation();
  const checkIdMutation = useCheckUserIdDuplicateMutation();

  const [idCheckStatus, setIdCheckStatus] = useState<'idle' | 'checking' | 'available' | 'duplicate'>('idle');

  const form = useForm<SignUpCompleteFormValues>({
    resolver: zodResolver(createSignUpCompleteFormSchema(t)),
    defaultValues: {
      new_user_id: validatedInfo.userId,
      new_user_email: validatedInfo.userEmail,
      password: '',
      password_confirm: '',
      user_birth: '',
      lunar_yn: 'N',
    },
  });

  const handleIdBlur = () => {
    const userId = form.getValues('new_user_id');
    if (!userId || userId.trim() === '') {
      setIdCheckStatus('idle');
      return;
    }

    // 원래 ID와 같으면 체크 안함
    if (userId === validatedInfo.userId) {
      setIdCheckStatus('available');
      return;
    }

    setIdCheckStatus('checking');
    checkIdMutation.mutate(userId, {
      onSuccess: (data) => {
        setIdCheckStatus(data.duplicate ? 'duplicate' : 'available');
        if (data.duplicate) {
          form.setError('new_user_id', {
            type: 'manual',
            message: t('signup.error.duplicateId')
          });
        } else {
          form.clearErrors('new_user_id');
        }
      },
      onError: () => {
        setIdCheckStatus('idle');
      }
    });
  };

  const onSubmit = (values: SignUpCompleteFormValues) => {
    // 중복 ID 상태에서는 제출 불가
    if (idCheckStatus === 'duplicate') {
      toast.error(t('signup.error.duplicateId'));
      return;
    }

    completeMutation.mutate(
      {
        new_user_id: values.new_user_id,
        new_user_email: values.new_user_email,
        password: values.password,
        password_confirm: values.password_confirm,
        user_birth: values.user_birth,
        lunar_yn: values.lunar_yn,
      },
      {
        onSuccess: () => {
          onComplete();
        },
      }
    );
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-4">
        <Controller
          control={form.control}
          name="new_user_id"
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error || idCheckStatus === 'duplicate'}>
              <FieldLabel>
                <User className="h-4 w-4 text-muted-foreground inline-block" />
                {t('signup.newUserId')}
              </FieldLabel>
              <div className="relative">
                <Input
                  {...field}
                  placeholder={t('signup.newUserIdPlaceholder')}
                  onBlur={(e) => {
                    field.onBlur();
                    handleIdBlur();
                  }}
                  className={cn(
                    idCheckStatus === 'available' && 'border-green-500 focus-visible:ring-green-500',
                    idCheckStatus === 'duplicate' && 'border-destructive focus-visible:ring-destructive'
                  )}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {idCheckStatus === 'checking' && <Spinner className="h-4 w-4" />}
                  {idCheckStatus === 'available' && <CheckCircle className="h-4 w-4 text-green-500" />}
                  {idCheckStatus === 'duplicate' && <XCircle className="h-4 w-4 text-destructive" />}
                </div>
              </div>
              <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
              {idCheckStatus === 'available' && !fieldState.error && (
                <p className="text-xs text-green-500 mt-1">{t('signup.idAvailable')}</p>
              )}
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="new_user_email"
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel>
                <Mail className="h-4 w-4 text-muted-foreground inline-block" />
                {t('signup.newUserEmail')}
              </FieldLabel>
              <Input
                {...field}
                type="email"
                placeholder={t('signup.newUserEmailPlaceholder')}
              />
              <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel>
                <KeyRound className="h-4 w-4 text-muted-foreground inline-block" />
                {t('signup.password')}
              </FieldLabel>
              <Input
                {...field}
                type="password"
                placeholder={t('signup.passwordPlaceholder')}
              />
              <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="password_confirm"
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel>
                <KeyRound className="h-4 w-4 text-muted-foreground inline-block" />
                {t('signup.passwordConfirm')}
              </FieldLabel>
              <Input
                {...field}
                type="password"
                placeholder={t('signup.passwordConfirmPlaceholder')}
              />
              <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="user_birth"
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel>
                <CalendarDays className="h-4 w-4 text-muted-foreground inline-block" />
                {t('signup.birthDate')}
              </FieldLabel>
              <InputDatePicker
                value={field.value}
                onValueChange={field.onChange}
                placeholder="yyyy-mm-dd"
                data-invalid={!!fieldState.error}
                endMonth={new Date()}
              />
              <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="lunar_yn"
          render={({ field }) => (
            <Field>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="lunar_yn"
                  checked={field.value === 'Y'}
                  onCheckedChange={(checked) => field.onChange(checked ? 'Y' : 'N')}
                />
                <label htmlFor="lunar_yn" className="text-sm text-muted-foreground flex items-center gap-1 cursor-pointer">
                  <CalendarDays className="h-4 w-4" />
                  {t('signup.lunarYn')}
                </label>
              </div>
            </Field>
          )}
        />
        <div className="flex gap-2 mt-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onBack}
            disabled={completeMutation.isPending}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            {t('signup.back')}
          </Button>
          <Button
            type="submit"
            className="flex-1"
            disabled={completeMutation.isPending || idCheckStatus === 'duplicate'}
          >
            {completeMutation.isPending && <Spinner />}
            {completeMutation.isPending ? t('signup.loadingBtn') : t('signup.complete')}
          </Button>
        </div>
      </div>
    </form>
  );
};

export { SignUpContent };
