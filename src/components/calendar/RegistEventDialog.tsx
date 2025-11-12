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
} from '@/components/shadcn/dialog';
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/shadcn/form";
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
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
  calendarType: z.string().min(1, '일정 타입을 선택해주세요.'),
  vacationType: z.string().optional(),
  desc: z.string().min(1, '일정 사유를 입력해주세요.'),
  startDate: z.string().min(1, '시작일을 입력해주세요.'),
  endDate: z.string().min(1, '종료일을 입력해주세요.'),
  startHour: z.string().optional(),
  startMinute: z.string().optional(),
});

type RegistEventFormValues = z.infer<typeof formSchema>;

export const RegistEventDialog: React.FC = () => {
  const { start, end, open } = useCalendarSlotStore();
  const { setOpen } = useCalendarSlotStore(s => s.actions);
  const { loginUser } = useLoginUserStore();
  const calendarTypes = useCalendarType();

  const form = useForm<RegistEventFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      calendarType: '',
      vacationType: '',
      desc: '',
      startDate: dayjs(start).format('YYYY-MM-DD'),
      endDate: dayjs(end).format('YYYY-MM-DD'),
      startHour: '9',
      startMinute: '0',
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

  const onSubmit = (values: RegistEventFormValues) => {
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
        startHour: '9',
        startMinute: '0',
      });
    }
  }, [open, start, end, form]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>일정 등록</DialogTitle>
          <DialogDescription>일정 정보를 입력해주세요.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className='flex flex-row gap-2'>
              <FormField
                control={form.control}
                name="calendarType"
                render={({ field }) => (
                  <FormItem className='flex-1'>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="일정 타입" />
                        </SelectTrigger>
                      </FormControl>
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
                    <FormMessage />
                  </FormItem>
                )}
              />
              {isVacation && (
                <FormField
                  control={form.control}
                  name="vacationType"
                  render={({ field }) => (
                    <FormItem className='flex-1'>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="사용 휴가" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {vacations?.map(v => (
                            <SelectItem key={v.vacation_type} value={v.vacation_type}>
                              {`${v.vacation_type_name} (${v.total_remain_time_str})`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
            <FormField
              control={form.control}
              name="desc"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="일정 사유" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex flex-row gap-2 items-start'>
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className='flex-1'>
                    <FormControl>
                      <InputDatePicker
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder='시작일'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='flex items-center h-10'>~</div>
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className='flex-1'>
                    <FormControl>
                      <InputDatePicker
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder='종료일'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {!isDate && watchedCalendarType && (
              <div className='flex flex-row gap-2'>
                <FormField
                  control={form.control}
                  name="startHour"
                  render={({ field }) => (
                    <FormItem className='flex-1'>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="시" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Array.from({ length: 11 }, (_, i) => (
                            <SelectItem key={i+8} value={(i+8).toString()}>{`${i+8} 시`}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="startMinute"
                  render={({ field }) => (
                    <FormItem className='flex-1'>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="분" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={'0'}>{'0 분'}</SelectItem>
                          <SelectItem value={'30'}>{'30 분'}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            <DialogFooter>
              <DialogClose asChild>
                <Button variant='outline' type="button">취소</Button>
              </DialogClose>
              <Button type='submit'>등록</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}