import { Button } from '@/components/shadcn/button';
import { Checkbox } from '@/components/shadcn/checkbox';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/shadcn/dialog';
import { Field, FieldError, FieldLabel } from '@/components/shadcn/field';
import { Input } from '@/components/shadcn/input';
import { InputDatePicker } from '@/components/shadcn/inputDatePicker';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/shadcn/select';
import { Textarea } from '@/components/shadcn/textarea';
import { useEffectiveTypesQuery, useExpirationTypesQuery } from '@/hooks/queries/useTypes';
import { useUsersQuery } from '@/hooks/queries/useUsers';
import { usePostManualGrantVacationMutation, useUserAssignedVacationPoliciesQuery } from '@/hooks/queries/useVacations';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
  selectedUser: z.string().min(1, { message: '사용자를 선택해주세요.' }),
  vacationPolicy: z.string().min(1, { message: '휴가 정책을 선택해주세요.' }),
  grantDate: z.string().optional(),
  expiryDate: z.string().optional(),
  grantTime: z.number().min(0.0625, { message: '부여 시간을 입력해주세요.' }),
  description: z.string().min(1, { message: '부여 사유를 입력해주세요.' }),
});

type VacationGrantFormValues = z.infer<typeof formSchema>;

interface VacationGrantDialogProps {
  open: boolean;
  onClose: () => void;
}

const VacationGrantDialog = ({
  open,
  onClose,
}: VacationGrantDialogProps) => {
  const { data: users, isLoading: isLoadingUsers } = useUsersQuery();
  const { mutate: grantVacation, isPending } = usePostManualGrantVacationMutation();
  const { data: effectiveTypes = [] } = useEffectiveTypesQuery();
  const { data: expirationTypes = [] } = useExpirationTypesQuery();
  const [useCustomDates, setUseCustomDates] = useState(false);

  const form = useForm<VacationGrantFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      selectedUser: '',
      vacationPolicy: '',
      grantDate: undefined,
      expiryDate: undefined,
      grantTime: undefined,
      description: '',
    },
  });

  const selectedUser = form.watch('selectedUser');
  const vacationPolicyId = form.watch('vacationPolicy');
  const grantTime = form.watch('grantTime');
  const description = form.watch('description');
  const grantDate = form.watch('grantDate');
  const expiryDate = form.watch('expiryDate');

  // 선택된 사용자의 MANUAL_GRANT 휴가 정책 조회
  const { data: vacationPolicies, isLoading: isLoadingPolicies } = useUserAssignedVacationPoliciesQuery(
    selectedUser,
    undefined,
    'MANUAL_GRANT'
  );

  // 선택된 정책 찾기
  const selectedPolicy = vacationPolicies?.find(
    policy => policy.vacation_policy_id.toString() === vacationPolicyId
  );

  // 부여 시간이 유연한지 여부
  const isFlexibleGrant = selectedPolicy?.is_flexible_grant === 'Y';

  // effective_type과 expiration_type을 한글로 변환
  const getEffectiveTypeName = (code: string) => {
    return effectiveTypes.find(type => type.code === code)?.name || code;
  };

  const getExpirationTypeName = (code: string) => {
    return expirationTypes.find(type => type.code === code)?.name || code;
  };

  // 저장 버튼 활성화 조건 체크
  const isFormValid = () => {
    // 기본 필수값 체크
    if (!selectedUser || !vacationPolicyId || !grantTime || !description) {
      return false;
    }

    // 직접 지정 옵션을 선택한 경우 날짜도 필수
    if (useCustomDates) {
      if (!grantDate || !expiryDate) {
        return false;
      }
    }

    return true;
  };

  // Dialog가 열릴 때 폼 초기화
  useEffect(() => {
    if (open) {
      form.reset({
        selectedUser: '',
        vacationPolicy: '',
        grantDate: undefined,
        expiryDate: undefined,
        grantTime: undefined,
        description: '',
      });
      setUseCustomDates(false);
    }
  }, [open, form]);

  // 휴가 정책 선택 시 is_flexible_grant가 'N'이면 grant_time 자동 설정
  useEffect(() => {
    if (selectedPolicy) {
      if (selectedPolicy.is_flexible_grant === 'N') {
        // grant_time을 그대로 설정 (소수점 형식)
        form.setValue('grantTime', selectedPolicy.grant_time);
      } else {
        // is_flexible_grant가 'Y'인 경우, 기존 값 유지 또는 초기화
        form.setValue('grantTime', 0);
      }
    }
  }, [selectedPolicy, form]);

  const onSubmit = (values: VacationGrantFormValues) => {
    // 직접 지정을 선택한 경우 날짜 검증
    if (useCustomDates) {
      if (!values.grantDate) {
        form.setError('grantDate', { message: '유효기간 시작일자를 선택해주세요.' });
        return;
      }
      if (!values.expiryDate) {
        form.setError('expiryDate', { message: '유효기간 만료일자를 선택해주세요.' });
        return;
      }
    }

    // LocalDateTime 형식으로 변환 (YYYY-MM-DDTHH:mm:ss) 또는 null
    const grantDateTime = useCustomDates && values.grantDate ? `${values.grantDate}T00:00:00` : null;
    const expiryDateTime = useCustomDates && values.expiryDate ? `${values.expiryDate}T23:59:59` : null;

    grantVacation({
      user_id: values.selectedUser,
      vacation_policy_id: parseInt(values.vacationPolicy),
      grant_time: values.grantTime!,
      grant_date: grantDateTime!,
      expiry_date: expiryDateTime!,
      grant_desc: values.description,
    }, {
      onSuccess: () => {
        form.reset();
        onClose();
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-3xl'>
        <DialogHeader>
          <DialogTitle>휴가 부여</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='p-6 space-y-4'>
            {/* 대상 사용자 */}
            <Controller
              control={form.control}
              name='selectedUser'
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel>
                    대상 사용자 <span className='text-red-500'>*</span>
                  </FieldLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={isLoadingUsers}>
                    <SelectTrigger>
                      <SelectValue placeholder={isLoadingUsers ? '로딩 중...' : '사용자를 선택하세요'} />
                    </SelectTrigger>
                    <SelectContent>
                      {users?.map((user) => (
                        <SelectItem key={user.user_id} value={user.user_id}>
                          {user.user_name} ({user.user_id})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
                </Field>
              )}
            />

            {selectedUser && (
              <>
                {/* 휴가 정책 */}
                <Controller
                  control={form.control}
                  name='vacationPolicy'
                  render={({ field, fieldState }) => (
                    <Field data-invalid={!!fieldState.error}>
                      <FieldLabel>
                        휴가 정책 <span className='text-red-500'>*</span>
                      </FieldLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={isLoadingPolicies || !vacationPolicies || vacationPolicies.length === 0}
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              isLoadingPolicies
                                ? '로딩 중...'
                                : vacationPolicies && vacationPolicies.length === 0
                                  ? '할당된 관리자 부여 정책이 없습니다'
                                  : '휴가 정책을 선택하세요'
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {vacationPolicies?.map((policy) => (
                            <SelectItem
                              key={policy.vacation_policy_id}
                              value={policy.vacation_policy_id.toString()}
                            >
                              {policy.vacation_policy_name} ({policy.vacation_type})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
                    </Field>
                  )}
                />

                {/* 부여일, 만료일 직접 지정 옵션 */}
                <div className='flex items-center space-x-2'>
                  <Checkbox
                    id='useCustomDates'
                    checked={useCustomDates}
                    onCheckedChange={(checked) => {
                      setUseCustomDates(checked === true);
                      if (!checked) {
                        form.setValue('grantDate', undefined);
                        form.setValue('expiryDate', undefined);
                        form.clearErrors(['grantDate', 'expiryDate']);
                      } else {
                        form.setValue('grantDate', dayjs().format('YYYY-MM-DD'));
                        form.setValue('expiryDate', dayjs().format('YYYY-MM-DD'));
                      }
                    }}
                  />
                  <label
                    htmlFor='useCustomDates'
                    className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer'
                  >
                    부여일, 만료일 직접 지정
                  </label>
                </div>

                {!useCustomDates && selectedPolicy && (
                  <div className='grid grid-cols-2 gap-4'>
                    {/* 유효기간 시작일자 정책 표시 */}
                    <Field>
                      <FieldLabel>유효기간 시작일자</FieldLabel>
                      <div className='flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm'>
                        {selectedPolicy.effective_type ? getEffectiveTypeName(selectedPolicy.effective_type) : '정책 기본값'}
                      </div>
                      <p className='text-xs text-muted-foreground mt-1'>
                        휴가 정책의 시작일자 규칙이 적용됩니다
                      </p>
                    </Field>

                    {/* 유효기간 만료일자 정책 표시 */}
                    <Field>
                      <FieldLabel>유효기간 만료일자</FieldLabel>
                      <div className='flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm'>
                        {selectedPolicy.expiration_type ? getExpirationTypeName(selectedPolicy.expiration_type) : '정책 기본값'}
                      </div>
                      <p className='text-xs text-muted-foreground mt-1'>
                        휴가 정책의 만료일자 규칙이 적용됩니다
                      </p>
                    </Field>
                  </div>
                )}

                {useCustomDates && (
                  <div className='grid grid-cols-2 gap-4'>
                    {/* 유효기간 시작일자 */}
                    <Controller
                      control={form.control}
                      name='grantDate'
                      render={({ field, fieldState }) => (
                        <Field data-invalid={!!fieldState.error}>
                          <FieldLabel>
                            유효기간 시작일자 <span className='text-red-500'>*</span>
                          </FieldLabel>
                          <InputDatePicker
                            value={field.value}
                            onValueChange={(value) => field.onChange(value)}
                          />
                          <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
                        </Field>
                      )}
                    />

                    {/* 유효기간 만료일자 */}
                    <Controller
                      control={form.control}
                      name='expiryDate'
                      render={({ field, fieldState }) => (
                        <Field data-invalid={!!fieldState.error}>
                          <FieldLabel>
                            유효기간 만료일자 <span className='text-red-500'>*</span>
                          </FieldLabel>
                          <InputDatePicker
                            value={field.value}
                            onValueChange={(value) => field.onChange(value)}
                          />
                          <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
                        </Field>
                      )}
                    />
                  </div>
                )}

                {/* 부여 시간 */}
                <Controller
                  control={form.control}
                  name='grantTime'
                  render={({ field, fieldState }) => {
                    const totalValue = field.value || 0;
                    const days = Math.floor(totalValue);
                    const remainder = totalValue - days;
                    const hours = Math.floor(remainder / 0.125);
                    const minutes = (remainder - hours * 0.125) >= 0.0625 ? 30 : 0;

                    const handleTimeChange = (newDays: number, newHours: number, newMinutes: number) => {
                      const total = newDays + (newHours * 0.125) + (newMinutes === 30 ? 0.0625 : 0);
                      field.onChange(total > 0 ? total : undefined);
                    };

                    const isDisabled = !isFlexibleGrant;

                    return (
                      <Field data-invalid={!!fieldState.error}>
                        <FieldLabel>
                          부여 시간 <span className='text-red-500'>*</span>
                        </FieldLabel>
                        <div className={`grid ${selectedPolicy?.minute_grant_yn === 'Y' ? 'grid-cols-3' : 'grid-cols-2'} gap-4`}>
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
                              disabled={isDisabled}
                            />
                            <p className='text-xs text-muted-foreground mt-1'>일</p>
                          </div>
                          <div className='flex flex-col'>
                            <Select
                              value={hours.toString()}
                              onValueChange={(value) => {
                                handleTimeChange(days, parseInt(value), minutes);
                              }}
                              disabled={isDisabled}
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
                            <p className='text-xs text-muted-foreground mt-1'>시간</p>
                          </div>
                          {selectedPolicy?.minute_grant_yn === 'Y' && (
                            <div className='flex flex-col'>
                              <Select
                                value={minutes.toString()}
                                onValueChange={(value) => {
                                  handleTimeChange(days, hours, parseInt(value));
                                }}
                                disabled={isDisabled}
                              >
                                <SelectTrigger className='w-full'>
                                  <SelectValue placeholder='분' />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value='0'>0분</SelectItem>
                                  <SelectItem value='30'>30분</SelectItem>
                                </SelectContent>
                              </Select>
                              <p className='text-xs text-muted-foreground mt-1'>분</p>
                            </div>
                          )}
                        </div>
                        <p className='text-sm text-muted-foreground mt-2'>
                          {isDisabled
                            ? '이 휴가 정책은 고정된 부여 시간을 사용합니다.'
                            : `부여할 휴가를 일/시간${selectedPolicy?.minute_grant_yn === 'Y' ? '/분' : ''} 단위로 선택해주세요.`}
                          {field.value && field.value > 0 && (
                            <span className='block mt-1 font-medium text-primary'>
                              총 {[
                                days > 0 ? `${days}일` : '',
                                hours > 0 ? `${hours}시간` : '',
                                minutes > 0 && selectedPolicy?.minute_grant_yn === 'Y' ? `${minutes}분` : ''
                              ].filter(Boolean).join(' ')}
                            </span>
                          )}
                        </p>
                        <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
                      </Field>
                    );
                  }}
                />

                {/* 부여 사유 */}
                <Controller
                  control={form.control}
                  name='description'
                  render={({ field, fieldState }) => (
                    <Field data-invalid={!!fieldState.error}>
                      <FieldLabel>
                        부여 사유 <span className='text-red-500'>*</span>
                      </FieldLabel>
                      <Textarea
                        {...field}
                        placeholder='휴가 부여 사유를 입력하세요...'
                        rows={4}
                        className='resize-none'
                      />
                      <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
                    </Field>
                  )}
                />
              </>
            )}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type='button' variant='secondary' disabled={isPending}>
                취소
              </Button>
            </DialogClose>
            <Button type='submit' disabled={isPending || !isFormValid()}>
              {isPending ? '처리 중...' : '저장'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default VacationGrantDialog
