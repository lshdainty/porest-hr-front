import { useGetUsers } from '@/api/user';
import { useGetUserAssignedVacationPolicies, usePostManualGrantVacation } from '@/api/vacation';
import { Button } from '@/components/shadcn/button';
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
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
  selectedUser: z.string().min(1, { message: '사용자를 선택해주세요.' }),
  vacationPolicy: z.string().min(1, { message: '휴가 정책을 선택해주세요.' }),
  grantDate: z.string().min(1, { message: '부여일을 선택해주세요.' }),
  expiryDate: z.string().min(1, { message: '만료일을 선택해주세요.' }),
  grantTime: z.number().min(0.0625, { message: '부여 시간을 입력해주세요.' }),
  description: z.string().optional(),
});

type VacationGrantFormValues = z.infer<typeof formSchema>;

interface VacationGrantDialogProps {
  open: boolean;
  onClose: () => void;
  userId: string;
}

export default function VacationGrantDialog({
  open,
  onClose,
  userId,
}: VacationGrantDialogProps) {
  const { data: users, isLoading: isLoadingUsers } = useGetUsers();
  const { mutate: grantVacation, isPending } = usePostManualGrantVacation();

  const form = useForm<VacationGrantFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      selectedUser: '',
      vacationPolicy: '',
      grantDate: dayjs().format('YYYY-MM-DD'),
      expiryDate: dayjs().format('YYYY-MM-DD'),
      grantTime: undefined,
      description: '',
    },
  });

  const selectedUser = form.watch('selectedUser');
  const vacationPolicyId = form.watch('vacationPolicy');

  // 선택된 사용자의 MANUAL_GRANT 휴가 정책 조회
  const { data: vacationPolicies, isLoading: isLoadingPolicies } = useGetUserAssignedVacationPolicies({
    user_id: selectedUser,
    grant_method: 'MANUAL_GRANT'
  });

  // 선택된 정책 찾기
  const selectedPolicy = vacationPolicies?.find(
    policy => policy.vacation_policy_id.toString() === vacationPolicyId
  );

  // Dialog가 열릴 때 폼 초기화
  useEffect(() => {
    if (open) {
      form.reset({
        selectedUser: '',
        vacationPolicy: '',
        grantDate: dayjs().format('YYYY-MM-DD'),
        expiryDate: dayjs().format('YYYY-MM-DD'),
        grantTime: undefined,
        description: '',
      });
    }
  }, [open, form]);

  const onSubmit = (values: VacationGrantFormValues) => {
    // LocalDateTime 형식으로 변환 (YYYY-MM-DDTHH:mm:ss)
    const grantDateTime = `${values.grantDate}T00:00:00`;
    const expiryDateTime = `${values.expiryDate}T23:59:59`;

    grantVacation({
      user_id: values.selectedUser,
      vacation_policy_id: parseInt(values.vacationPolicy),
      grant_time: values.grantTime,
      grant_date: grantDateTime,
      expiry_date: expiryDateTime,
      grant_desc: values.description || '',
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

                <div className='grid grid-cols-2 gap-4'>
                  {/* 부여일 */}
                  <Controller
                    control={form.control}
                    name='grantDate'
                    render={({ field, fieldState }) => (
                      <Field data-invalid={!!fieldState.error}>
                        <FieldLabel>
                          부여일 <span className='text-red-500'>*</span>
                        </FieldLabel>
                        <InputDatePicker
                          value={field.value}
                          onValueChange={(value) => field.onChange(value)}
                        />
                        <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
                      </Field>
                    )}
                  />

                  {/* 만료일 */}
                  <Controller
                    control={form.control}
                    name='expiryDate'
                    render={({ field, fieldState }) => (
                      <Field data-invalid={!!fieldState.error}>
                        <FieldLabel>
                          만료일 <span className='text-red-500'>*</span>
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
                            <p className='text-xs text-muted-foreground mt-1'>시간</p>
                          </div>
                          {selectedPolicy?.minute_grant_yn === 'Y' && (
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
                              <p className='text-xs text-muted-foreground mt-1'>분</p>
                            </div>
                          )}
                        </div>
                        <p className='text-sm text-muted-foreground mt-2'>
                          부여할 휴가를 일/시간{selectedPolicy?.minute_grant_yn === 'Y' ? '/분' : ''} 단위로 선택해주세요.
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

                {/* 설명 */}
                <Controller
                  control={form.control}
                  name='description'
                  render={({ field, fieldState }) => (
                    <Field data-invalid={!!fieldState.error}>
                      <FieldLabel>설명</FieldLabel>
                      <Textarea
                        {...field}
                        placeholder='휴가 부여에 대한 설명을 입력하세요...'
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
            <Button type='submit' disabled={isPending}>
              {isPending ? '처리 중...' : '저장'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
