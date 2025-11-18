import { usePostSchedule } from '@/api/schedule';
import { useGetAvailableVacations, usePostUseVacation } from '@/api/vacation';
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
import { useCalendarType } from '@/hooks/useCalendarType';
import { useCalendarSlotStore } from '@/store/CalendarSlotStore';
import { useLoginUserStore } from '@/store/LoginUser';
import { zodResolver } from '@hookform/resolvers/zod';
import { Circle } from '@mui/icons-material';
import dayjs from 'dayjs';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

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
  const { start: storeStart, end: storeEnd, open: storeOpen } = useCalendarSlotStore();
  const { setOpen: setStoreOpen } = useCalendarSlotStore(s => s.actions);
  const { loginUser } = useLoginUserStore();
  const calendarTypes = useCalendarType();

  // props가 있으면 props 사용, 없으면 store 사용
  const open = propOpen !== undefined ? propOpen : storeOpen;
  const setOpen = onOpenChange || setStoreOpen;

  // 날짜 기본값 설정: props > store > 오늘 날짜
  const start = propStartDate || storeStart || new Date();
  const end = propEndDate || storeEnd || new Date();

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

  const { mutate: postUseVacation } = usePostUseVacation();
  const { mutate: postSchedule } = usePostSchedule();

  const onSubmit = (values: AddEventFormValues) => {
    const format = 'YYYY-MM-DDTHH:mm:ss';
    const { calendarType, vacationType, desc, startDate, endDate, startHour, startMinute } = values;
    
    const payload: any = {
      user_id: loginUser?.user_id || '',
    };

    if (isDate) {
      payload.start_date = dayjs(startDate).startOf('day').format(format);
      payload.end_date = dayjs(endDate).endOf('day').format(format);
    } else {
      let plusHour = 0;
      switch(calendarType) {
        case 'MORNINGOFF':
        case 'AFTERNOONOFF':
        case 'HEALTHCHECKHALF':
        case 'DEFENSEHALF':
          plusHour = 4;
          break;
        case 'ONETIMEOFF':
          plusHour = 1;
          break;
        case 'TWOTIMEOFF':
          plusHour = 2;
          break;
        case 'THREETIMEOFF':
          plusHour = 3;
          break;
        case 'FIVETIMEOFF':
          plusHour = 5;
          break;
        case 'SIXTIMEOFF':
          plusHour = 6;
          break;
        case 'SEVENTIMEOFF':
          plusHour = 7;
          break;
        default:
          break;
      }
      payload.start_date = dayjs(startDate).hour(Number(startHour)).minute(Number(startMinute)).second(0).format(format);
      payload.end_date = dayjs(endDate).hour(Number(startHour) + plusHour).minute(Number(startMinute)).second(0).format(format);
    }

    if (isVacation) {
      payload.vacation_type = vacationType;
      payload.vacation_time_type = calendarType;
      payload.vacation_desc = desc;
      postUseVacation(payload);
    } else {
      payload.schedule_type = calendarType;
      payload.schedule_desc = desc;
      postSchedule(payload);
    }
    setOpen(false);
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
  }, [open, start, end, startTime, form]);

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
                              <Circle sx={{fontSize: 16, color: ct.colorCode}} />{ct.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                        <SelectGroup>
                          <SelectLabel>스케줄</SelectLabel>
                          {calendarTypes.filter(c => c.type === 'schedule').map(ct => (
                            <SelectItem key={ct.id} value={ct.id}>
                              <Circle sx={{fontSize: 16, color: ct.colorCode}} />{ct.name}
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