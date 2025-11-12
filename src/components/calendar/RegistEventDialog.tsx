import { usePostSchedule } from '@/api/schedule';
import { useGetAvailableVacations, usePostUseVacation } from '@/api/vacation';
import { Button } from '@/components/shadcn/button';
import { Calendar } from '@/components/shadcn/calendar';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/shadcn/dialog';
import { Input } from '@/components/shadcn/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/shadcn/popover';
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
import { Circle } from '@mui/icons-material';
import dayjs from 'dayjs';
import { CalendarIcon } from 'lucide-react';
import React, { useEffect } from 'react';

export const RegistEventDialog: React.FC = () => {
  const { start, end, open } = useCalendarSlotStore();
  const { setOpen } = useCalendarSlotStore(s => s.actions);
  const { loginUser } = useLoginUserStore();
  const calendarTypes = useCalendarType();
  const [startOpen, setStartOpen] = React.useState(false);
  const [startDate, setStartDate] = React.useState<Date | undefined>(start);
  const [startMonth, setStartMonth] = React.useState<Date | undefined>(startDate);
  const [endOpen, setEndOpen] = React.useState(false);
  const [endDate, setEndDate] = React.useState<Date | undefined>(end)
  const [endMonth, setEndMonth] = React.useState<Date | undefined>(endDate);
  const [timeSelectOpen, setTimeSelectOpen] = React.useState(false);
  const [vacationSelectOpen, setVacationSelectOpen] = React.useState(false);
  const [selectCalendarType, setSelectCalendarType] = React.useState('');
  const [selectVacationType, setSelectVacationType] = React.useState('');
  const [desc, setDesc] = React.useState('');
  const [startHour, setStartHour] = React.useState('9');
  const [startMinute, setStartMinute] = React.useState('0');

  // inputDatePicker 사용하는 로직으로 변경 진행해야함

  const {data: vacations} = useGetAvailableVacations({
    user_id: loginUser?.user_id || '',
    start_date: dayjs(start).format('YYYY-MM-DDTHH:mm:ss')
  });

  const { mutate: postUseVacation } = usePostUseVacation();
  const { mutate: postSchedule } = usePostSchedule();

  const onSubmit = () => {
    const calendar = calendarTypes.find(c => c.id === selectCalendarType);
    const format = 'YYYY-MM-DDTHH:mm:ss';
    const data = Object();
    data['user_id'] = loginUser?.user_id || '';

    if (calendar?.isDate) {
      data['start_date'] = dayjs(startDate).set('hour', 0).set('minute', 0).set('second', 0).format(format);
      data['end_date'] = dayjs(endDate).set('hour', 23).set('minute',59).set('second', 59).format(format);
    } else {
      let plusHour = 0;
      switch(calendar?.id) {
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

      data['start_date'] = dayjs(startDate).set('hour', Number(startHour)).set('minute', Number(startMinute)).set('second', 0).format(format);
      data['end_date'] = dayjs(endDate).set('hour', Number(startHour) + plusHour).set('minute', Number(startMinute)).set('second', 0).format(format);
    }

    if (calendar?.type === 'vacation') {
      data['vacation_type'] = selectVacationType;
      data['vacation_time_type'] = calendar?.id;
      data['vacation_desc'] = desc;

      setOpen(false);
      postUseVacation(data);
    } else {
      data['schedule_type'] = calendar?.id;
      data['schedule_desc'] = desc;

      setOpen(false);
      postSchedule(data);
    }
  }

  useEffect(() => {
    setStartDate(start);
    setEndDate(end);
  }, [start, end]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>일정 등록</DialogTitle>
          <DialogDescription>일정 정보를 입력해주세요.</DialogDescription>
        </DialogHeader>
        <div className='flex flex-col gap-2'>
          <div className='w-full flex flex-row gap-2'>
            <div className='flex flex-1 gap-2'>
              <Select
                onValueChange={(value) => {
                  const calendar = calendarTypes.find(c => c.id === value);
                  (calendar?.isDate) ? setTimeSelectOpen(false) : setTimeSelectOpen(true);
                  (calendar?.type === 'vacation') ? setVacationSelectOpen(true) : setVacationSelectOpen(false);
                  setSelectCalendarType(value);
                }}
              >
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='일정 타입' />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>휴가</SelectLabel>
                    {
                      calendarTypes.map(calendarType => {
                        if (calendarType.type === 'vacation') return <SelectItem key={calendarType.id} value={calendarType.id}><Circle sx={{fontSize: 16, color: calendarType.colorCode}} />{calendarType.name}</SelectItem>
                      })
                    }
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>스케줄</SelectLabel>
                    {
                      calendarTypes.map(calendarType => {
                        if (calendarType.type === 'schedule') {
                          return (
                            <SelectItem key={calendarType.id} value={calendarType.id}>
                              <Circle sx={{fontSize: 16, color: calendarType.colorCode}} />
                              {calendarType.name}
                            </SelectItem>
                          )
                        }
                      })
                    }
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className='flex flex-1 gap-2'>
              {
                vacationSelectOpen ? (
                  <Select
                    onValueChange={(value) => {setSelectVacationType(value);}}
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='사용 휴가' />
                    </SelectTrigger>
                    <SelectContent>
                      {
                        vacations && vacations.map(v => {
                          return (
                            <SelectItem key={v.vacation_type} value={v.vacation_type}>
                              {`${v.vacation_type_name} (${v.total_remain_time_str})`}
                            </SelectItem>
                          )
                        })
                      }
                    </SelectContent>
                  </Select>
                ) : null
              }
            </div>
          </div>
          <Input placeholder='일정 사유' onChange={(e) => setDesc(e.target.value)} />
          <div className='flex flex-row gap-2'>
            <div className='relative flex gap-2'>
              <Input
                id='startDate'
                value={dayjs(startDate).format('YYYY-MM-DD')}
                placeholder='startDate'
                className='bg-background pr-10'
                onChange={(e) => {
                  const date = new Date(e.target.value)
                  setStartDate(date)
                  setStartMonth(date)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown') {
                    e.preventDefault()
                    setStartOpen(true)
                  }
                }}
              />
              <Popover open={startOpen} onOpenChange={setStartOpen}>
                <PopoverTrigger asChild>
                  <Button
                    id='date-picker'
                    variant='ghost'
                    className='absolute top-1/2 right-2 size-6 -translate-y-1/2'
                  >
                    <CalendarIcon className='size-3.5' />
                    <span className='sr-only'>Select date</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className='w-auto overflow-hidden p-0'
                  align='end'
                  alignOffset={-8}
                  sideOffset={10}
                >
                  <Calendar
                    mode='single'
                    selected={startDate}
                    captionLayout='dropdown'
                    month={startMonth}
                    onMonthChange={setStartMonth}
                    onSelect={(date) => {
                      setStartDate(date)
                      setStartOpen(false)
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className='flex items-center'>~</div>
            <div className='relative flex gap-2'>
              <Input
                id='endDate'
                value={dayjs(endDate).format('YYYY-MM-DD')}
                placeholder='endDate'
                className='bg-background pr-10'
                onChange={(e) => {
                  const date = new Date(e.target.value)
                  setEndDate(date)
                  setEndMonth(date)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown') {
                    e.preventDefault()
                    setEndOpen(true)
                  }
                }}
              />
              <Popover open={endOpen} onOpenChange={setEndOpen}>
                <PopoverTrigger asChild>
                  <Button
                    id='date-picker'
                    variant='ghost'
                    className='absolute top-1/2 right-2 size-6 -translate-y-1/2'
                  >
                    <CalendarIcon className='size-3.5' />
                    <span className='sr-only'>Select date</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className='w-auto overflow-hidden p-0'
                  align='end'
                  alignOffset={-8}
                  sideOffset={10}
                >
                  <Calendar
                    mode='single'
                    selected={endDate}
                    captionLayout='dropdown'
                    month={endMonth}
                    onMonthChange={setEndMonth}
                    onSelect={(date) => {
                      setEndDate(date)
                      setEndOpen(false)
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          { timeSelectOpen ? (
              <div className='flex flex-row gap-2'>
                <Select defaultValue={startHour} onValueChange={(value) => setStartHour(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder='시' />
                  </SelectTrigger>
                  <SelectContent>
                    {
                      Array.from({ length: 11 }, (_, i) => (
                        <SelectItem key={i+8} value={(i+8).toString()}>{`${i+8} 시`}</SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
                <Select defaultValue={startMinute} onValueChange={(value) => setStartMinute(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder='분' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem key={0} value={'0'}>{'0 분'}</SelectItem>
                    <SelectItem key={30} value={'30'}>{'30 분'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ) : null
          }
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant='outline'>취소</Button>
          </DialogClose>
          <Button type='submit' onClick={onSubmit}>등록</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}