import { useGetAvailableVacations } from '@/api/vacation';
import { useAddEvent } from '@/components/calendar/hooks/use-add-event';
import { calendarTypes } from '@/components/calendar/types';
import type { TEventColor } from '@/components/calendar/types';
import { Badge } from '@/components/shadcn/badge';
import { Button } from '@/components/shadcn/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/shadcn/dialog';
import { Field, FieldError, FieldLabel } from '@/components/shadcn/field';
import { Input } from '@/components/shadcn/input';
import { InputDatePicker } from '@/components/shadcn/inputDatePicker';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn/select';
import { useLoginUserStore } from '@/store/LoginUser';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import React, { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

const colorClassMap: Record<TEventColor, string> = {
  blue: 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300',
  green: 'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300',
  red: 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300',
  yellow: 'border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-300',
  purple: 'border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-300',
  orange: 'border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-950 dark:text-orange-300',
  pink: 'border-pink-200 bg-pink-50 text-pink-700 dark:border-pink-800 dark:bg-pink-950 dark:text-pink-300',
  gray: 'border-neutral-200 bg-neutral-50 text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300',
  teal: 'border-teal-200 bg-teal-50 text-teal-700 dark:border-teal-800 dark:bg-teal-950 dark:text-teal-300',
};

const formSchema = z.object({
  calendarType: z.string().min(1, '일정 타입을 선택해주세요.'),
  vacationType: z.string().optional(),
  desc: z.string().optional(),
  startDate: z.string().min(1, '시작일을 입력해주세요.'),
  endDate: z.string().min(1, '종료일을 입력해주세요.'),
  startHour: z.string().optional(),
  startMinute: z.string().optional(),
});

type AddEventFormValues = z.infer<typeof formSchema>;

interface AddEventDialogProps {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  startDate?: Date;
  endDate?: Date;
  startTime?: { hour: number; minute: number };
}

export const AddEventDialog: React.FC<AddEventDialogProps> = ({
  children,
  open: propOpen,
  onOpenChange,
  startDate: propStartDate,
  endDate: propEndDate,
  startTime
}) => {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const { loginUser } = useLoginUserStore();

  // open 상태 관리: props가 있으면 props 사용, 없으면 내부 상태 사용
  const open = propOpen !== undefined ? propOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  // 날짜 기본값 설정: props로 받은 날짜가 있으면 사용, 없으면 오늘 날짜 (useMemo로 메모이제이션)
  const start = useMemo(() => propStartDate || new Date(), [propStartDate]);
  const end = useMemo(() => propEndDate || new Date(), [propEndDate]);

  const form = useForm<AddEventFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      calendarType: '',
      vacationType: '',
      desc: '',
      startDate: dayjs(start).format('YYYY-MM-DD'),
      endDate: dayjs(end).format('YYYY-MM-DD'),
      startHour: startTime?.hour.toString() || '9',
      startMinute: startTime?.minute.toString() || '0',
    }
  });

  const watchedCalendarType = form.watch('calendarType');
  const selectedCalendar = calendarTypes.find(c => c.id === watchedCalendarType);
  const isVacation = selectedCalendar?.type === 'vacation';
  const isDate = selectedCalendar?.isDate;

  const {data: vacations} = useGetAvailableVacations({
    user_id: loginUser?.user_id || '',
    start_date: dayjs(start).format('YYYY-MM-DDTHH:mm:ss')
  });

  const { addEvent } = useAddEvent();

  const onSubmit = (values: AddEventFormValues) => {
    addEvent({
      userId: loginUser?.user_id || '',
      calendarType: values.calendarType,
      vacationType: values.vacationType,
      desc: values.desc,
      startDate: values.startDate,
      endDate: values.endDate,
      startHour: values.startHour,
      startMinute: values.startMinute,
    }, {
      onSuccess: () => setOpen(false)
    });
  }

  useEffect(() => {
    if(open) {
      form.reset({
        calendarType: '',
        vacationType: '',
        desc: '',
        startDate: dayjs(start).format('YYYY-MM-DD'),
        endDate: dayjs(end).format('YYYY-MM-DD'),
        startHour: startTime?.hour.toString() || '9',
        startMinute: startTime?.minute.toString() || '0',
      });
    }
  }, [open, start, end, startTime]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>일정 등록</DialogTitle>
          <DialogDescription>일정 정보를 입력해주세요.</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="py-6 space-y-4">
            <div className='flex flex-row gap-2'>
              <Controller
                control={form.control}
                name="calendarType"
                render={({ field, fieldState }) => (
                  <Field data-invalid={!!fieldState.error} className='flex-1'>
                    <FieldLabel>
                      일정 타입
                      <span className='text-destructive ml-0.5'>*</span>
                    </FieldLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="일정 타입" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>휴가</SelectLabel>
                          {calendarTypes.filter(c => c.type === 'vacation').map(ct => (
                            <SelectItem key={ct.id} value={ct.id}>
                              <Badge className={colorClassMap[ct.color]}>
                                {ct.name}
                              </Badge>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                        <SelectGroup>
                          <SelectLabel>스케줄</SelectLabel>
                          {calendarTypes.filter(c => c.type === 'schedule').map(ct => (
                            <SelectItem key={ct.id} value={ct.id}>
                              <Badge className={colorClassMap[ct.color]}>
                                {ct.name}
                              </Badge>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
                  </Field>
                )}
              />
              {isVacation && (
                <Controller
                  control={form.control}
                  name="vacationType"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={!!fieldState.error} className='flex-1'>
                      <FieldLabel>
                        사용 휴가
                        <span className='text-destructive ml-0.5'>*</span>
                      </FieldLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="사용 휴가" />
                        </SelectTrigger>
                        <SelectContent>
                          {vacations?.map(v => (
                            <SelectItem key={v.vacation_type} value={v.vacation_type}>
                              {`${v.vacation_type_name} (${v.total_remain_time_str})`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
                    </Field>
                  )}
                />
              )}
            </div>
            <Controller
              control={form.control}
              name="desc"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel>
                    일정 사유
                  </FieldLabel>
                  <Input placeholder="일정 사유" {...field} />
                  <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
                </Field>
              )}
            />
            <div className='flex flex-row gap-2 items-end'>
              <Controller
                control={form.control}
                name="startDate"
                render={({ field, fieldState }) => (
                  <Field data-invalid={!!fieldState.error} className='flex-1'>
                    <FieldLabel>
                      시작일
                      <span className='text-destructive ml-0.5'>*</span>
                    </FieldLabel>
                    <InputDatePicker
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder='시작일'
                    />
                    <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
                  </Field>
                )}
              />
              <div className='pb-2'>~</div>
              <Controller
                control={form.control}
                name="endDate"
                render={({ field, fieldState }) => (
                  <Field data-invalid={!!fieldState.error} className='flex-1'>
                    <FieldLabel>
                      종료일
                      <span className='text-destructive ml-0.5'>*</span>
                    </FieldLabel>
                    <InputDatePicker
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder='종료일'
                    />
                    <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
                  </Field>
                )}
              />
            </div>
            {!isDate && watchedCalendarType && (
              <div className='flex flex-row gap-2'>
                <Controller
                  control={form.control}
                  name="startHour"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={!!fieldState.error} className='flex-1'>
                      <FieldLabel>
                        시
                        <span className='text-destructive ml-0.5'>*</span>
                      </FieldLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="시" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 11 }, (_, i) => (
                            <SelectItem key={i+8} value={(i+8).toString()}>{`${i+8} 시`}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
                    </Field>
                  )}
                />
                <Controller
                  control={form.control}
                  name="startMinute"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={!!fieldState.error} className='flex-1'>
                      <FieldLabel>
                        분
                        <span className='text-destructive ml-0.5'>*</span>
                      </FieldLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="분" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={'0'}>{'0 분'}</SelectItem>
                          <SelectItem value={'30'}>{'30 분'}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
                    </Field>
                  )}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant='outline' type="button">취소</Button>
            </DialogClose>
            <Button type='submit' disabled={!form.formState.isValid}>등록</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}