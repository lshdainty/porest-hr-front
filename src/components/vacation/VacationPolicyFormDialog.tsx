import { usePostVacationPolicy } from '@/api/vacation';
import { Button } from '@/components/shadcn/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/shadcn/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/shadcn/dialog';
import {
  Field,
  FieldError,
  FieldLabel
} from '@/components/shadcn/field';
import { Input } from '@/components/shadcn/input';
import { InputDatePicker } from '@/components/shadcn/inputDatePicker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn/select';
import { Separator } from '@/components/shadcn/separator';
import { Spinner } from '@/components/shadcn/spinner';
import { Textarea } from '@/components/shadcn/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Calendar,
  Info
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';

// 폼 스키마 정의
const formSchema = z.object({
  name: z.string().min(1, '휴가 정책 이름을 입력해주세요'),
  description: z.string().optional(),
  vacationType: z.string().min(1, '휴가 타입을 선택해주세요'),
  grantMethod: z.string().min(1, '부여 방법을 선택해주세요'),
  grantTime: z.number().optional(),
  grantTimeExists: z.string().optional(),
  minuteGrantYn: z.string().min(1, '분단위 부여 여부를 선택해주세요'),
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
    // grantTimeExists가 Y이면 grantTime 필수
    if (data.grantTimeExists === 'Y') {
      if (!data.grantTime || data.grantTime <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: '고정 시간 부여 시 부여 시간을 입력해주세요 (0보다 큰 값)',
          path: ['grantTime']
        });
      }
    }
    if (!data.effectiveType) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '발효 타입을 선택해주세요',
        path: ['effectiveType']
      });
    }
    if (!data.expirationType) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '만료 타입을 선택해주세요',
        path: ['expirationType']
      });
    }
  }

  // MANUAL_GRANT 검증
  if (data.grantMethod === 'MANUAL_GRANT') {
    // grantTimeExists가 Y이면 grantTime 필수, N이면 검증 안 함
    if (data.grantTimeExists === 'Y') {
      if (!data.grantTime || data.grantTime <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: '고정 시간 부여 시 부여 시간을 입력해주세요 (0보다 큰 값)',
          path: ['grantTime']
        });
      }
    }
    // grantTimeExists가 N(가변 시간)일 때는 grantTime 검증 제외

    if (!data.effectiveType) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '발효 타입을 선택해주세요',
        path: ['effectiveType']
      });
    }
    if (!data.expirationType) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '만료 타입을 선택해주세요',
        path: ['expirationType']
      });
    }
  }

  // REPEAT_GRANT 검증
  if (data.grantMethod === 'REPEAT_GRANT') {
    if (!data.grantTime || data.grantTime <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '부여 시간을 입력해주세요 (0보다 큰 값)',
        path: ['grantTime']
      });
    }
    if (!data.effectiveType) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '발효 타입을 선택해주세요',
        path: ['effectiveType']
      });
    }
    if (!data.expirationType) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '만료 타입을 선택해주세요',
        path: ['expirationType']
      });
    }
    if (!data.repeatUnit) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '반복 단위를 선택해주세요',
        path: ['repeatUnit']
      });
    }
    if (!data.repeatInterval || data.repeatInterval <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '반복 간격을 입력해주세요 (0보다 큰 값)',
        path: ['repeatInterval']
      });
    }
    if (!data.firstGrantDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '첫 부여 날짜를 선택해주세요',
        path: ['firstGrantDate']
      });
    }
    if (!data.isRecurring) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '반복 여부를 선택해주세요',
        path: ['isRecurring']
      });
    }

    // isRecurring이 N이면 maxGrantCount 필수
    if (data.isRecurring === 'N') {
      if (!data.maxGrantCount || data.maxGrantCount <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: '최대 부여 횟수를 입력해주세요 (0보다 큰 값)',
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
          message: 'YEARLY는 특정 일만 지정할 수 없습니다. 특정 월을 함께 지정해주세요',
          path: ['specificMonths']
        });
      }
    } else if (data.repeatUnit === 'MONTHLY') {
      // months 지정 불가
      if (data.specificMonths) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'MONTHLY는 특정 월을 지정할 수 없습니다',
          path: ['specificMonths']
        });
      }
    } else if (data.repeatUnit === 'QUARTERLY' || data.repeatUnit === 'HALF') {
      // months 지정 불가
      if (data.specificMonths) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `${data.repeatUnit}는 특정 월을 지정할 수 없습니다`,
          path: ['specificMonths']
        });
      }
    } else if (data.repeatUnit === 'DAILY') {
      // months, days 둘 다 불가
      if (data.specificMonths || data.specificDays) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'DAILY는 특정 월/일을 지정할 수 없습니다',
          path: ['specificMonths']
        });
      }
    }
  }
});

type FormData = z.infer<typeof formSchema>;

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

export function VacationPolicyFormDialog({
  trigger,
  initialData = null,
  isEditing = false,
  grantMethodTypes = [],
  vacationTypes = [],
  effectiveTypes = [],
  expirationTypes = [],
  repeatUnitTypes = []
}: VacationPolicyFormDialogProps) {
  const [open, setOpen] = useState(false);
  const { mutateAsync: postVacationPolicy, isPending } = usePostVacationPolicy();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      vacationType: '',
      grantMethod: '',
      grantTime: undefined,
      grantTimeExists: 'Y',
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
  const watchGrantTimeExists = form.watch('grantTimeExists');
  const watchRepeatUnit = form.watch('repeatUnit');
  const watchIsRecurring = form.watch('isRecurring');

  // grantTimeExists가 N(가변)으로 변경되면 grantTime 초기화
  useEffect(() => {
    if (watchGrantTimeExists === 'N' && watchGrantMethod !== 'REPEAT_GRANT') {
      form.setValue('grantTime', undefined);
    }
  }, [watchGrantTimeExists, watchGrantMethod, form]);

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
          grantTimeExists: 'Y',
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
        // grant_time_exists가 N이면 grant_time을 null로, Y이면 입력값 사용
        grant_time: data.grantTimeExists === 'N' ? null : (data.grantTime || 0),
        grant_time_exists: data.grantTimeExists || 'Y',
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
      console.error('휴가 정책 저장 실패:', error);
    }
  };

  const getDialogTitle = () => {
    if (isEditing) return '휴가 정책 수정';
    return '휴가 정책 추가';
  };

  // 부여 방법에 따라 필요한 필드만 렌더링하는 헬퍼 함수
  const shouldShowField = (fieldName: string): boolean => {
    const method = watchGrantMethod;

    const fieldsByMethod: Record<string, string[]> = {
      'ON_REQUEST': ['name', 'description', 'vacationType', 'grantMethod', 'grantTime', 'grantTimeExists', 'minuteGrantYn', 'effectiveType', 'expirationType', 'approvalRequiredCount'],
      'MANUAL_GRANT': ['name', 'description', 'vacationType', 'grantMethod', 'grantTime', 'grantTimeExists', 'minuteGrantYn', 'effectiveType', 'expirationType'],
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
    return ['YEARLY', 'MONTHLY', 'QUARTERLY', 'HALF'].includes(watchRepeatUnit);
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
                기본 설정
              </CardTitle>
              <CardDescription>
                휴가의 기본 정보와 부여 방식을 설정해주세요.
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
                        휴가 정책 이름
                        <span className='text-destructive ml-0.5'>*</span>
                      </FieldLabel>
                      <Input placeholder='예: 연차, 리프레시 휴가' {...field} />
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
                      <FieldLabel>휴가 정책 설명</FieldLabel>
                      <Textarea
                        placeholder='휴가 정책에 대한 설명을 입력해주세요'
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
                        휴가 타입
                        <span className='text-destructive ml-0.5'>*</span>
                      </FieldLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder='휴가 타입을 선택해주세요' />
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
                        휴가의 종류를 선택해주세요 (연차, 출산, 결혼 등).
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
                        부여 방법
                        <span className='text-destructive ml-0.5'>*</span>
                      </FieldLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder='부여 방법을 선택해주세요' />
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

              {/* 부여 시간 존재 여부 - ON_REQUEST, MANUAL_GRANT만 표시 */}
              {shouldShowField('grantTimeExists') && (
                <Controller
                  control={form.control}
                  name='grantTimeExists'
                  render={({ field, fieldState }) => (
                    <Field data-invalid={!!fieldState.error}>
                      <FieldLabel>
                        부여 시간 존재 여부
                      </FieldLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder='선택해주세요' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='Y'>고정 시간 부여 (Y)</SelectItem>
                          <SelectItem value='N'>가변 시간 부여 (N)</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className='text-sm text-muted-foreground space-y-1 mt-2'>
                        <p><strong>고정 시간 부여 (Y):</strong> 정책 등록 시 입력한 부여 시간을 자동으로 사용합니다.</p>
                        <p><strong>가변 시간 부여 (N):</strong> 휴가 부여 시 사용자 또는 관리자가 직접 시간을 입력합니다.</p>
                      </div>
                      <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
                    </Field>
                  )}
                />
              )}

              {/* 부여 시간 - ON_REQUEST, REPEAT_GRANT에서 필수, MANUAL_GRANT에서 선택 */}
              {/* REPEAT_GRANT는 항상 표시, ON_REQUEST/MANUAL_GRANT는 grantTimeExists가 Y일 때만 표시 */}
              {shouldShowField('grantTime') && (watchGrantMethod === 'REPEAT_GRANT' || watchGrantTimeExists === 'Y') && (
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
                          부여 시간
                          {/* REPEAT_GRANT는 항상 필수, ON_REQUEST/MANUAL_GRANT는 grantTimeExists가 Y일 때만 필수 */}
                          {(watchGrantMethod === 'REPEAT_GRANT' ||
                            ((watchGrantMethod === 'ON_REQUEST' || watchGrantMethod === 'MANUAL_GRANT') && watchGrantTimeExists === 'Y')) && (
                            <span className='text-destructive ml-0.5'>*</span>
                          )}
                        </FieldLabel>
                        <div className='grid grid-cols-3 gap-4'>
                          <div className='flex flex-col'>
                            <Input
                              type='number'
                              min='0'
                              max='365'
                              placeholder='일'
                              className='w-full'
                              value={days || ''}
                              onChange={(e) => {
                                const newDays = e.target.value ? parseInt(e.target.value) : 0;
                                handleTimeChange(newDays, hours, minutes);
                              }}
                            />
                            <p className='text-xs text-muted-foreground mt-1'>일</p>
                          </div>
                          <div className='flex flex-col'>
                            <Select
                              value={hours.toString()}
                              onValueChange={(value) => {
                                handleTimeChange(days, parseInt(value), minutes);
                              }}
                            >
                              <SelectTrigger className='w-full'>
                                <SelectValue placeholder='시간' />
                              </SelectTrigger>
                              <SelectContent>
                                {[0, 1, 2, 3, 4, 5, 6, 7].map((h) => (
                                  <SelectItem key={h} value={h.toString()}>
                                    {h}시간
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <p className='text-xs text-muted-foreground mt-1'>시간 (1시간 = 0.125일)</p>
                          </div>
                          <div className='flex flex-col'>
                            <Select
                              value={minutes.toString()}
                              onValueChange={(value) => {
                                handleTimeChange(days, hours, parseInt(value));
                              }}
                            >
                              <SelectTrigger className='w-full'>
                                <SelectValue placeholder='분' />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value='0'>0분</SelectItem>
                                <SelectItem value='30'>30분</SelectItem>
                              </SelectContent>
                            </Select>
                            <p className='text-xs text-muted-foreground mt-1'>분 (30분 = 0.0625일)</p>
                          </div>
                        </div>
                        <p className='text-sm text-muted-foreground mt-2'>
                          {watchGrantTimeExists === 'Y'
                            ? '고정 시간 부여: 휴가 부여 시 이 시간이 자동으로 적용됩니다.'
                            : watchGrantTimeExists === 'N'
                              ? '가변 시간 부여: 휴가 부여 시 사용자/관리자가 직접 입력하므로 이 값은 참고용입니다.'
                              : '부여할 휴가를 일/시간/분 단위로 선택해주세요.'}
                          {field.value && field.value > 0 && (
                            <span className='block mt-1 font-medium text-primary'>
                              총 {[
                                days > 0 ? `${days}일` : '',
                                hours > 0 ? `${hours}시간` : '',
                                minutes > 0 ? `${minutes}분` : ''
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

              {/* 분단위 부여 여부 */}
              {shouldShowField('minuteGrantYn') && (
                <Controller
                  control={form.control}
                  name='minuteGrantYn'
                  render={({ field, fieldState }) => (
                    <Field data-invalid={!!fieldState.error}>
                      <FieldLabel>
                        분단위 부여 여부
                        <span className='text-destructive ml-0.5'>*</span>
                      </FieldLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder='선택해주세요' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='Y'>허용 (Y)</SelectItem>
                          <SelectItem value='N'>불허 (N)</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className='text-sm text-muted-foreground'>
                        휴가를 부여할 때 분단위(30분)로 부여할 수 있는지 설정합니다.
                      </p>
                      <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
                    </Field>
                  )}
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
                            유효기간 시작일자
                            <span className='text-destructive ml-0.5'>*</span>
                          </FieldLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder='시작일자 선택' />
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
                            휴가가 언제부터 유효한지 선택해주세요.
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
                            유효기간 만료일자
                            <span className='text-destructive ml-0.5'>*</span>
                          </FieldLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder='만료일자 선택' />
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
                            휴가가 언제까지 유효한지 선택해주세요.
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
                      <FieldLabel>승인 필요 횟수</FieldLabel>
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
                        신청 시 필요한 승인 횟수를 입력해주세요. (0은 승인 불필요)
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
                <CardTitle>반복 부여 설정</CardTitle>
                <CardDescription>
                  휴가를 자동으로 반복 부여하는 설정입니다.
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
                            반복 단위
                            <span className='text-destructive ml-0.5'>*</span>
                          </FieldLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder='반복 단위 선택' />
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
                            휴가를 얼마나 자주 부여할지 선택해주세요.
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
                            반복 간격
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
                            반복 주기마다 몇 번째에 부여할지 설정 (예: 1=매번, 2=격번)
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
                        <FieldLabel>특정 월 (선택)</FieldLabel>
                        <Input
                          type='number'
                          min='1'
                          max='12'
                          placeholder='예: 1 (1월)'
                          {...field}
                          value={field.value || ''}
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                        />
                        <p className='text-sm text-muted-foreground'>
                          매년 특정 월에 부여하려면 입력해주세요 (1-12). 미입력 시 첫 부여 날짜의 월 기준.
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
                        <FieldLabel>특정 일 (선택)</FieldLabel>
                        <Input
                          type='number'
                          min='1'
                          max='31'
                          placeholder='예: 1 (1일)'
                          {...field}
                          value={field.value || ''}
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                        />
                        <p className='text-sm text-muted-foreground'>
                          특정 일에 부여하려면 입력해주세요 (1-31). 해당 월에 없는 날짜는 자동으로 마지막 날로 조정됩니다.
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
                          첫 부여 날짜
                          <span className='text-destructive ml-0.5'>*</span>
                        </FieldLabel>
                        <InputDatePicker
                          value={field.value || ''}
                          onValueChange={field.onChange}
                        />
                        <p className='text-sm text-muted-foreground'>
                          스케줄러가 반복 부여를 계산하기 위한 기준일입니다.
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
                          반복 여부
                          <span className='text-destructive ml-0.5'>*</span>
                        </FieldLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder='반복 여부 선택' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='Y'>반복 부여 (Y)</SelectItem>
                            <SelectItem value='N'>1회성 부여 (N)</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className='text-sm text-muted-foreground'>
                          계속 반복할지, 1회만 부여할지 선택해주세요.
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
                          최대 부여 횟수
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
                          1회성 부여일 경우 최대 몇 번 부여할지 입력해주세요.
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
                      <p className='font-medium'>반복 부여 안내:</p>
                      <ul className='list-disc list-inside space-y-1'>
                        <li>YEARLY: 매년 특정 월/일에 부여</li>
                        <li>MONTHLY: 매월 특정 일에 부여 (특정 월 지정 불가)</li>
                        <li>QUARTERLY: 분기별 (1,4,7,10월) 특정 일에 부여</li>
                        <li>HALF: 반기별 (1,7월) 특정 일에 부여</li>
                        <li>DAILY: 매일 부여 (특정 월/일 지정 불가)</li>
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
              취소
            </Button>
            <Button type='submit' disabled={isPending}>
              {isPending && <Spinner />}
              {isPending ? '저장 중...' : (isEditing ? '수정' : '저장')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
