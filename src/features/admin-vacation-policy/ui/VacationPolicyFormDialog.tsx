import { Button } from '@/shared/ui/shadcn/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/shared/ui/shadcn/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/shared/ui/shadcn/dialog';
import {
    Field,
    FieldError,
    FieldLabel
} from '@/shared/ui/shadcn/field';
import { Input } from '@/shared/ui/shadcn/input';
import { InputDatePicker } from '@/shared/ui/shadcn/inputDatePicker';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/ui/shadcn/select';
import { Separator } from '@/shared/ui/shadcn/separator';
import { Spinner } from '@/shared/ui/shadcn/spinner';
import { Textarea } from '@/shared/ui/shadcn/textarea';
import { usePostVacationPolicyMutation } from '@/entities/vacation-policy';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Calendar,
    Info
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as z from 'zod';

// 폼 스키마 정의 (팩토리 함수)
const createFormSchema = (t: (key: string) => string) => z.object({
  name: z.string().min(1, t('policy.nameRequired')),
  description: z.string().optional(),
  vacationType: z.string().min(1, t('policy.typeRequired')),
  grantMethod: z.string().min(1, t('policy.grantMethodRequired')),
  grantTime: z.number().optional(),
  isFlexibleGrant: z.string().optional(),
  minuteGrantYn: z.string().min(1, t('policy.minuteGrantRequired')),
  effectiveType: z.string().optional(),
  expirationType: z.string().optional(),
  approvalRequiredCount: z.number().optional(),
  repeatUnit: z.string().optional(),
  repeatInterval: z.number().optional(),
  specificMonths: z.number().optional(),
  specificDays: z.number().optional(),
  firstGrantDate: z.string().optional(),
  isRecurring: z.string().optional(),
  maxGrantCount: z.number().optional(),
}).superRefine((data, ctx) => {
  // ON_REQUEST 검증
  if (data.grantMethod === 'ON_REQUEST') {
    // isFlexibleGrant 필수
    if (!data.isFlexibleGrant) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: t('policy.flexibleGrantRequired'),
        path: ['isFlexibleGrant']
      });
    }
    // isFlexibleGrant가 N이면 고정 시간 부여 → grantTime 필수
    if (data.isFlexibleGrant === 'N') {
      if (!data.grantTime || data.grantTime <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('policy.grantTimeFixedRequired'),
          path: ['grantTime']
        });
      }
    }
    if (!data.effectiveType) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: t('policy.effectiveTypeRequired'),
        path: ['effectiveType']
      });
    }
    if (!data.expirationType) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: t('policy.expirationTypeRequired'),
        path: ['expirationType']
      });
    }
  }

  // MANUAL_GRANT 검증
  if (data.grantMethod === 'MANUAL_GRANT') {
    // isFlexibleGrant 필수
    if (!data.isFlexibleGrant) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: t('policy.flexibleGrantRequired'),
        path: ['isFlexibleGrant']
      });
    }
    // isFlexibleGrant가 N이면 고정 시간 부여 → grantTime 필수, Y이면 가변 시간 부여 → 검증 안 함
    if (data.isFlexibleGrant === 'N') {
      if (!data.grantTime || data.grantTime <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('policy.grantTimeFixedRequired'),
          path: ['grantTime']
        });
      }
    }
    // isFlexibleGrant가 Y(가변 시간)일 때는 grantTime 검증 제외

    if (!data.effectiveType) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: t('policy.effectiveTypeRequired'),
        path: ['effectiveType']
      });
    }
    if (!data.expirationType) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: t('policy.expirationTypeRequired'),
        path: ['expirationType']
      });
    }
  }

  // REPEAT_GRANT 검증
  if (data.grantMethod === 'REPEAT_GRANT') {
    if (!data.grantTime || data.grantTime <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: t('policy.grantTimeRequired'),
        path: ['grantTime']
      });
    }
    if (!data.effectiveType) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: t('policy.effectiveTypeRequired'),
        path: ['effectiveType']
      });
    }
    if (!data.expirationType) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: t('policy.expirationTypeRequired'),
        path: ['expirationType']
      });
    }
    if (!data.repeatUnit) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: t('policy.repeatUnitRequired'),
        path: ['repeatUnit']
      });
    }
    if (!data.repeatInterval || data.repeatInterval <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: t('policy.repeatIntervalRequired'),
        path: ['repeatInterval']
      });
    }
    if (!data.firstGrantDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: t('policy.firstGrantDateRequired'),
        path: ['firstGrantDate']
      });
    }
    if (!data.isRecurring) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: t('policy.isRecurringRequired'),
        path: ['isRecurring']
      });
    }

    // isRecurring이 N이면 maxGrantCount 필수
    if (data.isRecurring === 'N') {
      if (!data.maxGrantCount || data.maxGrantCount <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('policy.maxGrantCountRequired'),
          path: ['maxGrantCount']
        });
      }
    }

    // repeatUnit에 따른 검증
    if (data.repeatUnit === 'YEARLY') {
      // months는 선택, days도 선택이지만 days만 있으면 안됨
      if (!data.specificMonths && data.specificDays) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('policy.yearlyMonthRequired'),
          path: ['specificMonths']
        });
      }
    } else if (data.repeatUnit === 'MONTHLY') {
      // months 지정 불가
      if (data.specificMonths) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('policy.monthlyNoMonth'),
          path: ['specificMonths']
        });
      }
    } else if (data.repeatUnit === 'QUARTERLY') {
      // months 지정 불가
      if (data.specificMonths) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('policy.quarterlyNoMonth'),
          path: ['specificMonths']
        });
      }
    } else if (data.repeatUnit === 'HALF') {
      // months 지정 불가
      if (data.specificMonths) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('policy.halfNoMonth'),
          path: ['specificMonths']
        });
      }
    } else if (data.repeatUnit === 'DAILY') {
      // months, days 둘 다 불가
      if (data.specificMonths || data.specificDays) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('policy.dailyNoMonthDay'),
          path: ['specificMonths']
        });
      }
    }
  }
});

type FormData = z.infer<ReturnType<typeof createFormSchema>>;

interface VacationPolicyFormDialogProps {
  trigger: React.ReactNode;
  initialData?: any | null;
  isEditing?: boolean;
  grantMethodTypes?: Array<{ code: string; name: string }>;
  vacationTypes?: Array<{ code: string; name: string }>;
  effectiveTypes?: Array<{ code: string; name: string }>;
  expirationTypes?: Array<{ code: string; name: string }>;
  repeatUnitTypes?: Array<{ code: string; name: string }>;
}

const VacationPolicyFormDialog = ({
  trigger,
  initialData = null,
  isEditing = false,
  grantMethodTypes = [],
  vacationTypes = [],
  effectiveTypes = [],
  expirationTypes = [],
  repeatUnitTypes = []
}: VacationPolicyFormDialogProps) => {
  const { t } = useTranslation('vacation');
  const { t: tc } = useTranslation('common');
  const [open, setOpen] = useState(false);
  const { mutateAsync: postVacationPolicy, isPending } = usePostVacationPolicyMutation();

  const formSchema = createFormSchema(t);
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      vacationType: '',
      grantMethod: '',
      grantTime: undefined,
      isFlexibleGrant: 'N',
      minuteGrantYn: 'N',
      effectiveType: '',
      expirationType: '',
      approvalRequiredCount: 0,
      repeatUnit: '',
      repeatInterval: 1,
      specificMonths: undefined,
      specificDays: undefined,
      firstGrantDate: '',
      isRecurring: 'Y',
      maxGrantCount: undefined,
    },
  });

  const watchGrantMethod = form.watch('grantMethod');
  const watchIsFlexibleGrant = form.watch('isFlexibleGrant');
  const watchMinuteGrantYn = form.watch('minuteGrantYn');
  const watchRepeatUnit = form.watch('repeatUnit');
  const watchIsRecurring = form.watch('isRecurring');
  const watchName = form.watch('name');
  const watchVacationType = form.watch('vacationType');
  const watchGrantTime = form.watch('grantTime');
  const watchEffectiveType = form.watch('effectiveType');
  const watchExpirationType = form.watch('expirationType');
  const watchRepeatInterval = form.watch('repeatInterval');
  const watchFirstGrantDate = form.watch('firstGrantDate');
  const watchMaxGrantCount = form.watch('maxGrantCount');

  // isFlexibleGrant가 Y(가변)로 변경되면 grantTime 초기화
  useEffect(() => {
    if (watchIsFlexibleGrant === 'Y' && watchGrantMethod !== 'REPEAT_GRANT') {
      form.setValue('grantTime', undefined);
    }
  }, [watchIsFlexibleGrant, watchGrantMethod, form]);

  // minuteGrantYn이 N(불허)로 변경되면 분 값 제거
  useEffect(() => {
    if (watchMinuteGrantYn === 'N') {
      const currentValue = form.getValues('grantTime');
      if (currentValue) {
        const days = Math.floor(currentValue);
        const remainder = currentValue - days;
        const hours = Math.floor(remainder / 0.125);
        // 분 값을 제외한 새로운 총 시간 계산
        const newTotal = days + (hours * 0.125);
        form.setValue('grantTime', newTotal > 0 ? newTotal : undefined);
      }
    }
  }, [watchMinuteGrantYn, form]);

  // 필수값 검증 함수
  const isFormValid = () => {
    // 기본 필수값
    if (!watchName || !watchVacationType || !watchGrantMethod || !watchMinuteGrantYn) {
      return false;
    }

    // ON_REQUEST 필수값
    if (watchGrantMethod === 'ON_REQUEST') {
      if (!watchIsFlexibleGrant || !watchEffectiveType || !watchExpirationType) {
        return false;
      }
      // isFlexibleGrant가 N이면 grantTime 필수
      if (watchIsFlexibleGrant === 'N' && (!watchGrantTime || watchGrantTime <= 0)) {
        return false;
      }
    }

    // MANUAL_GRANT 필수값
    if (watchGrantMethod === 'MANUAL_GRANT') {
      if (!watchIsFlexibleGrant || !watchEffectiveType || !watchExpirationType) {
        return false;
      }
      // isFlexibleGrant가 N이면 grantTime 필수
      if (watchIsFlexibleGrant === 'N' && (!watchGrantTime || watchGrantTime <= 0)) {
        return false;
      }
    }

    // REPEAT_GRANT 필수값
    if (watchGrantMethod === 'REPEAT_GRANT') {
      if (!watchGrantTime || watchGrantTime <= 0) {
        return false;
      }
      if (!watchEffectiveType || !watchExpirationType) {
        return false;
      }
      if (!watchRepeatUnit || !watchRepeatInterval || watchRepeatInterval <= 0) {
        return false;
      }
      if (!watchFirstGrantDate || !watchIsRecurring) {
        return false;
      }
      // isRecurring이 N이면 maxGrantCount 필수
      if (watchIsRecurring === 'N' && (!watchMaxGrantCount || watchMaxGrantCount <= 0)) {
        return false;
      }
    }

    return true;
  };

  useEffect(() => {
    if (open) {
      if (isEditing && initialData) {
        form.reset(initialData);
      } else {
        form.reset({
          name: '',
          description: '',
          vacationType: '',
          grantMethod: '',
          grantTime: undefined,
          isFlexibleGrant: 'N',
          minuteGrantYn: 'N',
          effectiveType: '',
          expirationType: '',
          approvalRequiredCount: 0,
          repeatUnit: '',
          repeatInterval: 1,
          specificMonths: undefined,
          specificDays: undefined,
          firstGrantDate: '',
          isRecurring: 'Y',
          maxGrantCount: undefined,
        });
      }
    }
  }, [open, isEditing, initialData, form]);

  const handleSubmit = async (data: FormData) => {
    try {
      // 백엔드 API 스펙에 맞게 데이터 매핑
      const payload: any = {
        vacation_policy_name: data.name,
        vacation_policy_desc: data.description || '',
        vacation_type: data.vacationType,
        grant_method: data.grantMethod,
        // isFlexibleGrant가 Y이면 가변 부여 → grant_time null, N이면 고정 부여 → 입력값 사용
        grant_time: data.isFlexibleGrant === 'Y' ? null : (data.grantTime || 0),
        is_flexible_grant: data.isFlexibleGrant || 'N',
        minute_grant_yn: data.minuteGrantYn || 'N',
        effective_type: data.effectiveType || null,
        expiration_type: data.expirationType || null,
      };

      // ON_REQUEST
      if (data.grantMethod === 'ON_REQUEST') {
        payload.approval_required_count = data.approvalRequiredCount || 0;
        payload.repeat_unit = null;
        payload.repeat_interval = null;
        payload.specific_months = null;
        payload.specific_days = null;
        payload.first_grant_date = null;
        payload.is_recurring = null;
        payload.max_grant_count = null;
      }
      // MANUAL_GRANT
      else if (data.grantMethod === 'MANUAL_GRANT') {
        payload.repeat_unit = null;
        payload.repeat_interval = null;
        payload.specific_months = null;
        payload.specific_days = null;
        payload.first_grant_date = null;
        payload.is_recurring = null;
        payload.max_grant_count = null;
        payload.approval_required_count = null;
      }
      // REPEAT_GRANT
      else if (data.grantMethod === 'REPEAT_GRANT') {
        payload.repeat_unit = data.repeatUnit || null;
        payload.repeat_interval = data.repeatInterval || null;
        payload.specific_months = data.specificMonths || null;
        payload.specific_days = data.specificDays || null;
        // firstGrantDate를 LocalDateTime 형식으로 변환 (YYYY-MM-DDTHH:mm:ss)
        payload.first_grant_date = data.firstGrantDate
          ? `${data.firstGrantDate}T00:00:00`
          : null;
        payload.is_recurring = data.isRecurring || 'Y';
        payload.max_grant_count = data.maxGrantCount || null;
        payload.approval_required_count = null;
      }

      await postVacationPolicy(payload);
      setOpen(false);
    } catch (error) {
      console.error(t('policy.saveError'), error);
    }
  };

  const getDialogTitle = () => {
    if (isEditing) return t('policy.editTitle');
    return t('policy.addTitle');
  };

  // 부여 방법에 따라 필요한 필드만 렌더링하는 헬퍼 함수
  const shouldShowField = (fieldName: string): boolean => {
    const method = watchGrantMethod;

    const fieldsByMethod: Record<string, string[]> = {
      'ON_REQUEST': ['name', 'description', 'vacationType', 'grantMethod', 'grantTime', 'isFlexibleGrant', 'minuteGrantYn', 'effectiveType', 'expirationType', 'approvalRequiredCount'],
      'MANUAL_GRANT': ['name', 'description', 'vacationType', 'grantMethod', 'grantTime', 'isFlexibleGrant', 'minuteGrantYn', 'effectiveType', 'expirationType'],
      'REPEAT_GRANT': ['name', 'description', 'vacationType', 'grantMethod', 'grantTime', 'minuteGrantYn', 'effectiveType', 'expirationType', 'repeatUnit', 'repeatInterval', 'firstGrantDate', 'isRecurring', 'maxGrantCount', 'specificMonths', 'specificDays'],
    };

    if (!method) return ['name', 'description', 'vacationType', 'grantMethod'].includes(fieldName);

    return fieldsByMethod[method]?.includes(fieldName) || false;
  };

  // repeatUnit에 따라 specificMonths/Days를 보여줄지 결정
  const shouldShowSpecificMonths = (): boolean => {
    if (watchGrantMethod !== 'REPEAT_GRANT') return false;
    return watchRepeatUnit === 'YEARLY';
  };

  const shouldShowSpecificDays = (): boolean => {
    if (watchGrantMethod !== 'REPEAT_GRANT') return false;
    return ['YEARLY', 'MONTHLY', 'QUARTERLY', 'HALF'].includes(watchRepeatUnit || '');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>{getDialogTitle()}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
          {/* 기본 설정 */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Calendar className='h-5 w-5' />
                {t('policy.basicSettings')}
              </CardTitle>
              <CardDescription>
                {t('policy.basicSettingsDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              {/* 휴가 정책 이름 */}
              {shouldShowField('name') && (
                <Controller
                  control={form.control}
                  name='name'
                  render={({ field, fieldState }) => (
                    <Field data-invalid={!!fieldState.error}>
                      <FieldLabel>
                        {t('policy.name')}
                        <span className='text-destructive ml-0.5'>*</span>
                      </FieldLabel>
                      <Input placeholder={t('policy.namePlaceholder')} {...field} />
                      <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
                    </Field>
                  )}
                />
              )}

              {/* 휴가 정책 설명 */}
              {shouldShowField('description') && (
                <Controller
                  control={form.control}
                  name='description'
                  render={({ field, fieldState }) => (
                    <Field data-invalid={!!fieldState.error}>
                      <FieldLabel>{t('policy.description')}</FieldLabel>
                      <Textarea
                        placeholder={t('policy.descriptionPlaceholder')}
                        className='min-h-[80px]'
                        {...field}
                      />
                      <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
                    </Field>
                  )}
                />
              )}

              <Separator />

              {/* 휴가 타입 */}
              {shouldShowField('vacationType') && (
                <Controller
                  control={form.control}
                  name='vacationType'
                  render={({ field, fieldState }) => (
                    <Field data-invalid={!!fieldState.error}>
                      <FieldLabel>
                        {t('policy.type')}
                        <span className='text-destructive ml-0.5'>*</span>
                      </FieldLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder={t('policy.typePlaceholder')} />
                        </SelectTrigger>
                        <SelectContent>
                          {vacationTypes.map((type) => (
                            <SelectItem key={type.code} value={type.code}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className='text-sm text-muted-foreground'>
                        {t('policy.typeDescription')}
                      </p>
                      <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
                    </Field>
                  )}
                />
              )}

              <Separator />

              {/* 부여 방법 */}
              {shouldShowField('grantMethod') && (
                <Controller
                  control={form.control}
                  name='grantMethod'
                  render={({ field, fieldState }) => (
                    <Field data-invalid={!!fieldState.error}>
                      <FieldLabel>
                        {t('policy.grantMethod')}
                        <span className='text-destructive ml-0.5'>*</span>
                      </FieldLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder={t('policy.grantMethodPlaceholder')} />
                        </SelectTrigger>
                        <SelectContent>
                          {grantMethodTypes.map((type) => (
                            <SelectItem key={type.code} value={type.code}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
                    </Field>
                  )}
                />
              )}

              {/* 분단위 부여 여부 */}
              {shouldShowField('minuteGrantYn') && (
                <Controller
                  control={form.control}
                  name='minuteGrantYn'
                  render={({ field, fieldState }) => (
                    <Field data-invalid={!!fieldState.error}>
                      <FieldLabel>
                        {t('policy.minuteGrant')}
                        <span className='text-destructive ml-0.5'>*</span>
                      </FieldLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder={tc('select')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='N'>{t('policy.minuteGrantNo')}</SelectItem>
                          <SelectItem value='Y'>{t('policy.minuteGrantYes')}</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className='text-sm text-muted-foreground'>
                        {t('policy.minuteGrantDesc')}
                      </p>
                      <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
                    </Field>
                  )}
                />
              )}

              {/* 가변 부여 여부 - ON_REQUEST, MANUAL_GRANT만 표시 */}
              {shouldShowField('isFlexibleGrant') && (
                <Controller
                  control={form.control}
                  name='isFlexibleGrant'
                  render={({ field, fieldState }) => (
                    <Field data-invalid={!!fieldState.error}>
                      <FieldLabel>
                        {t('policy.flexibleGrant')}
                        <span className='text-destructive ml-0.5'>*</span>
                      </FieldLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder={tc('select')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='N'>{t('policy.flexibleGrantNo')}</SelectItem>
                          <SelectItem value='Y'>{t('policy.flexibleGrantYes')}</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className='text-sm text-muted-foreground space-y-1 mt-2'>
                        <p>{t('policy.flexibleGrantFixedDesc')}</p>
                        <p>{t('policy.flexibleGrantFlexDesc')}</p>
                      </div>
                      <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
                    </Field>
                  )}
                />
              )}

              {/* 부여 시간 - ON_REQUEST, REPEAT_GRANT에서 필수, MANUAL_GRANT에서 선택 */}
              {/* REPEAT_GRANT는 항상 표시, ON_REQUEST/MANUAL_GRANT는 isFlexibleGrant가 N(고정)일 때만 표시 */}
              {shouldShowField('grantTime') && (watchGrantMethod === 'REPEAT_GRANT' || watchIsFlexibleGrant === 'N') && (
                <Controller
                  control={form.control}
                  name='grantTime'
                  render={({ field, fieldState }) => {
                    // grantTime을 일/시간/분으로 분해
                    const totalValue = field.value || 0;
                    const days = Math.floor(totalValue);
                    const remainder = totalValue - days;
                    const hours = Math.floor(remainder / 0.125);
                    const minutes = (remainder - hours * 0.125) >= 0.0625 ? 30 : 0;

                    const handleTimeChange = (newDays: number, newHours: number, newMinutes: number) => {
                      const total = newDays + (newHours * 0.125) + (newMinutes === 30 ? 0.0625 : 0);
                      field.onChange(total > 0 ? total : undefined);
                    };

                    return (
                      <Field data-invalid={!!fieldState.error}>
                        <FieldLabel>
                          {t('policy.grantTime')}
                          {/* REPEAT_GRANT는 항상 필수, ON_REQUEST/MANUAL_GRANT는 isFlexibleGrant가 N(고정)일 때만 필수 */}
                          {(watchGrantMethod === 'REPEAT_GRANT' ||
                            ((watchGrantMethod === 'ON_REQUEST' || watchGrantMethod === 'MANUAL_GRANT') && watchIsFlexibleGrant === 'N')) && (
                            <span className='text-destructive ml-0.5'>*</span>
                          )}
                        </FieldLabel>
                        <div className={`grid ${watchMinuteGrantYn === 'Y' ? 'grid-cols-3' : 'grid-cols-2'} gap-4`}>
                          <div className='flex flex-col'>
                            <Input
                              type='number'
                              min='0'
                              max='365'
                              placeholder={tc('day')}
                              className='w-full'
                              value={days || ''}
                              onChange={(e) => {
                                const newDays = e.target.value ? parseInt(e.target.value) : 0;
                                handleTimeChange(newDays, hours, minutes);
                              }}
                            />
                            <p className='text-xs text-muted-foreground mt-1'>{t('policy.dayUnit')}</p>
                          </div>
                          <div className='flex flex-col'>
                            <Select
                              value={hours.toString()}
                              onValueChange={(value) => {
                                handleTimeChange(days, parseInt(value), minutes);
                              }}
                            >
                              <SelectTrigger className='w-full'>
                                <SelectValue placeholder={tc('hour')} />
                              </SelectTrigger>
                              <SelectContent>
                                {[0, 1, 2, 3, 4, 5, 6, 7].map((h) => (
                                  <SelectItem key={h} value={h.toString()}>
                                    {h}{t('policy.hourUnit')}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <p className='text-xs text-muted-foreground mt-1'>{t('policy.hourConversion')}</p>
                          </div>
                          {watchMinuteGrantYn === 'Y' && (
                            <div className='flex flex-col'>
                              <Select
                                value={minutes.toString()}
                                onValueChange={(value) => {
                                  handleTimeChange(days, hours, parseInt(value));
                                }}
                              >
                                <SelectTrigger className='w-full'>
                                  <SelectValue placeholder={tc('minute')} />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value='0'>0{t('policy.minuteUnit')}</SelectItem>
                                  <SelectItem value='30'>30{t('policy.minuteUnit')}</SelectItem>
                                </SelectContent>
                              </Select>
                              <p className='text-xs text-muted-foreground mt-1'>{t('policy.minuteConversion')}</p>
                            </div>
                          )}
                        </div>
                        <p className='text-sm text-muted-foreground mt-2'>
                          {watchIsFlexibleGrant === 'N'
                            ? t('policy.fixedTimeDesc')
                            : watchIsFlexibleGrant === 'Y'
                              ? t('policy.flexibleTimeDesc')
                              : watchMinuteGrantYn === 'Y' ? t('policy.selectTimeWithMinuteDesc') : t('policy.selectTimeDesc')}
                          {field.value && field.value > 0 && (
                            <span className='block mt-1 font-medium text-primary'>
                              {t('policy.totalTime')} {[
                                days > 0 ? `${days}${t('policy.dayUnit')}` : '',
                                hours > 0 ? `${hours}${t('policy.hourUnit')}` : '',
                                minutes > 0 && watchMinuteGrantYn === 'Y' ? `${minutes}${t('policy.minuteUnit')}` : ''
                              ].filter(Boolean).join(' ')}
                            </span>
                          )}
                        </p>
                        <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
                      </Field>
                    );
                  }}
                />
              )}

              {/* 발효 타입 & 만료 타입 */}
              {(shouldShowField('effectiveType') || shouldShowField('expirationType')) && (
                <div className='grid grid-cols-2 gap-4'>
                  {shouldShowField('effectiveType') && (
                    <Controller
                      control={form.control}
                      name='effectiveType'
                      render={({ field, fieldState }) => (
                        <Field data-invalid={!!fieldState.error}>
                          <FieldLabel>
                            {t('policy.effectiveType')}
                            <span className='text-destructive ml-0.5'>*</span>
                          </FieldLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder={t('policy.effectiveTypePlaceholder')} />
                            </SelectTrigger>
                            <SelectContent>
                              {effectiveTypes.map((type) => (
                                <SelectItem key={type.code} value={type.code}>
                                  {type.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <p className='text-sm text-muted-foreground'>
                            {t('policy.effectiveTypeDesc')}
                          </p>
                          <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
                        </Field>
                      )}
                    />
                  )}

                  {shouldShowField('expirationType') && (
                    <Controller
                      control={form.control}
                      name='expirationType'
                      render={({ field, fieldState }) => (
                        <Field data-invalid={!!fieldState.error}>
                          <FieldLabel>
                            {t('policy.expirationType')}
                            <span className='text-destructive ml-0.5'>*</span>
                          </FieldLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder={t('policy.expirationTypePlaceholder')} />
                            </SelectTrigger>
                            <SelectContent>
                              {expirationTypes.map((type) => (
                                <SelectItem key={type.code} value={type.code}>
                                  {type.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <p className='text-sm text-muted-foreground'>
                            {t('policy.expirationTypeDesc')}
                          </p>
                          <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
                        </Field>
                      )}
                    />
                  )}
                </div>
              )}

              {/* 승인 필요 횟수 - ON_REQUEST 전용 */}
              {shouldShowField('approvalRequiredCount') && (
                <Controller
                  control={form.control}
                  name='approvalRequiredCount'
                  render={({ field, fieldState }) => (
                    <Field data-invalid={!!fieldState.error}>
                      <FieldLabel>{t('policy.approvalCount')}</FieldLabel>
                      <Input
                        type='number'
                        min='0'
                        placeholder='0'
                        value={String(field.value ?? 0)}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === '' ? 0 : parseInt(value) || 0);
                        }}
                      />
                      <p className='text-sm text-muted-foreground'>
                        {t('policy.approvalCountDesc')}
                      </p>
                      <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
                    </Field>
                  )}
                />
              )}
            </CardContent>
          </Card>

          {/* 반복 부여 설정 - REPEAT_GRANT 전용 */}
          {watchGrantMethod === 'REPEAT_GRANT' && (
            <Card>
              <CardHeader>
                <CardTitle>{t('policy.repeatSettings')}</CardTitle>
                <CardDescription>
                  {t('policy.repeatSettingsDesc')}
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-6'>
                {/* 반복 단위 & 반복 간격 */}
                <div className='grid grid-cols-2 gap-4'>
                  {shouldShowField('repeatUnit') && (
                    <Controller
                      control={form.control}
                      name='repeatUnit'
                      render={({ field, fieldState }) => (
                        <Field data-invalid={!!fieldState.error}>
                          <FieldLabel>
                            {t('policy.repeatUnit')}
                            <span className='text-destructive ml-0.5'>*</span>
                          </FieldLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder={t('policy.repeatUnitPlaceholder')} />
                            </SelectTrigger>
                            <SelectContent>
                              {repeatUnitTypes.map((type) => (
                                <SelectItem key={type.code} value={type.code}>
                                  {type.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <p className='text-sm text-muted-foreground'>
                            {t('policy.repeatUnitDesc')}
                          </p>
                          <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
                        </Field>
                      )}
                    />
                  )}

                  {shouldShowField('repeatInterval') && (
                    <Controller
                      control={form.control}
                      name='repeatInterval'
                      render={({ field, fieldState }) => (
                        <Field data-invalid={!!fieldState.error}>
                          <FieldLabel>
                            {t('policy.repeatInterval')}
                            <span className='text-destructive ml-0.5'>*</span>
                          </FieldLabel>
                          <Input
                            type='number'
                            min='1'
                            max='100'
                            placeholder='1'
                            {...field}
                            value={field.value || 1}
                            onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : 1)}
                          />
                          <p className='text-sm text-muted-foreground'>
                            {t('policy.repeatIntervalDesc')}
                          </p>
                          <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
                        </Field>
                      )}
                    />
                  )}
                </div>

                {/* 특정 월 - YEARLY만 */}
                {shouldShowSpecificMonths() && (
                  <Controller
                    control={form.control}
                    name='specificMonths'
                    render={({ field, fieldState }) => (
                      <Field data-invalid={!!fieldState.error}>
                        <FieldLabel>{t('policy.specificMonth')}</FieldLabel>
                        <Input
                          type='number'
                          min='1'
                          max='12'
                          placeholder={t('policy.specificMonthPlaceholder')}
                          {...field}
                          value={field.value || ''}
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                        />
                        <p className='text-sm text-muted-foreground'>
                          {t('policy.specificMonthDesc')}
                        </p>
                        <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
                      </Field>
                    )}
                  />
                )}

                {/* 특정 일 - YEARLY, MONTHLY, QUARTERLY, HALF */}
                {shouldShowSpecificDays() && (
                  <Controller
                    control={form.control}
                    name='specificDays'
                    render={({ field, fieldState }) => (
                      <Field data-invalid={!!fieldState.error}>
                        <FieldLabel>{t('policy.specificDay')}</FieldLabel>
                        <Input
                          type='number'
                          min='1'
                          max='31'
                          placeholder={t('policy.specificDayPlaceholder')}
                          {...field}
                          value={field.value || ''}
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                        />
                        <p className='text-sm text-muted-foreground'>
                          {t('policy.specificDayDesc')}
                        </p>
                        <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
                      </Field>
                    )}
                  />
                )}

                {/* 첫 부여 날짜 */}
                {shouldShowField('firstGrantDate') && (
                  <Controller
                    control={form.control}
                    name='firstGrantDate'
                    render={({ field, fieldState }) => (
                      <Field data-invalid={!!fieldState.error}>
                        <FieldLabel>
                          {t('policy.firstGrantDate')}
                          <span className='text-destructive ml-0.5'>*</span>
                        </FieldLabel>
                        <InputDatePicker
                          value={field.value || ''}
                          onValueChange={field.onChange}
                        />
                        <p className='text-sm text-muted-foreground'>
                          {t('policy.firstGrantDateDesc')}
                        </p>
                        <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
                      </Field>
                    )}
                  />
                )}

                <Separator />

                {/* 반복 여부 */}
                {shouldShowField('isRecurring') && (
                  <Controller
                    control={form.control}
                    name='isRecurring'
                    render={({ field, fieldState }) => (
                      <Field data-invalid={!!fieldState.error}>
                        <FieldLabel>
                          {t('policy.isRecurring')}
                          <span className='text-destructive ml-0.5'>*</span>
                        </FieldLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder={t('policy.isRecurringPlaceholder')} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='Y'>{t('policy.isRecurringYes')}</SelectItem>
                            <SelectItem value='N'>{t('policy.isRecurringNo')}</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className='text-sm text-muted-foreground'>
                          {t('policy.isRecurringYesDesc')}<br />
                          {t('policy.isRecurringNoDesc')}
                        </p>
                        <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
                      </Field>
                    )}
                  />
                )}

                {/* 최대 부여 횟수 - isRecurring=N일 때만 */}
                {shouldShowField('maxGrantCount') && watchIsRecurring === 'N' && (
                  <Controller
                    control={form.control}
                    name='maxGrantCount'
                    render={({ field, fieldState }) => (
                      <Field data-invalid={!!fieldState.error}>
                        <FieldLabel>
                          {t('policy.maxGrantCount')}
                          <span className='text-destructive ml-0.5'>*</span>
                        </FieldLabel>
                        <Input
                          type='number'
                          min='1'
                          placeholder='1'
                          {...field}
                          value={field.value || ''}
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                        />
                        <p className='text-sm text-muted-foreground'>
                          {t('policy.maxGrantCountDesc')}
                        </p>
                        <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
                      </Field>
                    )}
                  />
                )}

                {/* 안내 메시지 */}
                <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 dark:bg-blue-950/30 dark:border-blue-900'>
                  <div className='flex items-start gap-2'>
                    <Info className='h-5 w-5 text-blue-500 mt-0.5' />
                    <div className='text-sm text-blue-700 dark:text-blue-300 space-y-1'>
                      <p className='font-medium'>{t('policy.repeatGuideTitle')}</p>
                      <ul className='list-disc list-inside space-y-1'>
                        <li>{t('policy.repeatGuideYearly')}</li>
                        <li>{t('policy.repeatGuideMonthly')}</li>
                        <li>{t('policy.repeatGuideQuarterly')}</li>
                        <li>{t('policy.repeatGuideHalf')}</li>
                        <li>{t('policy.repeatGuideDaily')}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 제출 버튼 */}
          <div className='flex justify-end gap-4 pt-4'>
            <Button type='button' variant='secondary' onClick={() => setOpen(false)}>
              {tc('cancel')}
            </Button>
            <Button type='submit' disabled={isPending || !isFormValid()}>
              {isPending && <Spinner />}
              {isPending ? tc('saving') : (isEditing ? tc('edit') : tc('save'))}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export { VacationPolicyFormDialog };

